from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, OrderItem, PaymentStatus, OrderStatus
from app.models.product import Product
from app.models.settings import SiteSetting
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderCreateResponse
from app.utils.order import generate_order_number, build_whatsapp_url
from app.dependencies import get_optional_user, get_current_user
from app.config import get_settings

router = APIRouter(prefix="/api/orders", tags=["orders"])
settings = get_settings()


def get_setting_value(db: Session, key: str, default: str) -> str:
    s = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    return s.value if s and s.value else default


@router.post("/", response_model=OrderCreateResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    delivery_fee = float(get_setting_value(db, "delivery_fee", "3500"))
    whatsapp_number = get_setting_value(db, "whatsapp_number", settings.whatsapp_number)

    # Build order items from cart data
    subtotal = 0.0
    order_items_data = []
    for item_data in data.items:
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_data.product_id} not found")
        unit_price = product.discount_price or product.price
        total_price = unit_price * item_data.quantity
        subtotal += total_price
        primary_img = next((img.image_url for img in product.images if img.is_primary), None)
        order_items_data.append({
            "product_id": product.id,
            "product_name": product.name,
            "product_image": primary_img,
            "size": item_data.size,
            "color": item_data.color,
            "quantity": item_data.quantity,
            "unit_price": unit_price,
            "total_price": total_price,
        })

    # Generate unique order number
    while True:
        order_number = generate_order_number()
        if not db.query(Order).filter(Order.order_number == order_number).first():
            break

    order = Order(
        order_number=order_number,
        user_id=current_user.id if current_user else None,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        delivery_address=data.delivery_address,
        city=data.city,
        state=data.state,
        country=data.country,
        notes=data.notes,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total_amount=subtotal + delivery_fee,
        payment_status=PaymentStatus.awaiting_payment,
        order_status=OrderStatus.pending,
    )
    db.add(order)
    db.flush()

    for item_data in order_items_data:
        db.add(OrderItem(order_id=order.id, **item_data))

    order.whatsapp_sent = True
    db.commit()
    db.refresh(order)

    whatsapp_url = build_whatsapp_url(
        whatsapp_number=whatsapp_number,
        order_number=order.order_number,
        customer_name=order.full_name,
        total_amount=order.total_amount,
    )

    return OrderCreateResponse(order=order, whatsapp_url=whatsapp_url)


@router.get("/", response_model=list[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/{order_number}", response_model=OrderResponse)
def get_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
