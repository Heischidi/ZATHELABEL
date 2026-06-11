from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.settings import SiteSetting
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse, CartItemResponse
from app.dependencies import get_optional_user

router = APIRouter(prefix="/api/cart", tags=["cart"])


def get_delivery_fee(db: Session) -> float:
    setting = db.query(SiteSetting).filter(SiteSetting.key == "delivery_fee").first()
    return float(setting.value) if setting and setting.value else 3500.0


def build_cart_response(items: list[CartItem], db: Session) -> CartResponse:
    subtotal = sum(
        (item.product.discount_price or item.product.price) * item.quantity
        for item in items
        if item.product
    )
    delivery_fee = get_delivery_fee(db) if items else 0.0
    return CartResponse(
        items=items,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=subtotal + delivery_fee,
        item_count=sum(i.quantity for i in items),
    )


def get_cart_items(db: Session, user: User | None, session_id: str | None) -> list[CartItem]:
    if user:
        return db.query(CartItem).filter(CartItem.user_id == user.id).all()
    elif session_id:
        return db.query(CartItem).filter(CartItem.session_id == session_id).all()
    return []


@router.get("/", response_model=CartResponse)
def get_cart(
    session_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    items = get_cart_items(db, current_user, session_id)
    return build_cart_response(items, db)


@router.post("/", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Find existing item
    q = db.query(CartItem).filter(
        CartItem.product_id == data.product_id,
        CartItem.size == data.size,
        CartItem.color == data.color,
    )
    if current_user:
        q = q.filter(CartItem.user_id == current_user.id)
    else:
        q = q.filter(CartItem.session_id == data.session_id)

    existing = q.first()
    if existing:
        existing.quantity += data.quantity
    else:
        cart_item = CartItem(
            user_id=current_user.id if current_user else None,
            session_id=data.session_id if not current_user else None,
            product_id=data.product_id,
            size=data.size,
            color=data.color,
            quantity=data.quantity,
        )
        db.add(cart_item)

    db.commit()
    items = get_cart_items(db, current_user, data.session_id)
    return build_cart_response(items, db)


@router.put("/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    session_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity
    db.commit()
    items = get_cart_items(db, current_user, session_id)
    return build_cart_response(items, db)


@router.delete("/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    session_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    items = get_cart_items(db, current_user, session_id)
    return build_cart_response(items, db)


@router.delete("/", response_model=dict)
def clear_cart(
    session_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    if current_user:
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    elif session_id:
        db.query(CartItem).filter(CartItem.session_id == session_id).delete()
    db.commit()
    return {"message": "Cart cleared"}
