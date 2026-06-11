from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.order import Order, PaymentStatus, OrderStatus
from app.models.user import User
from app.schemas.order import OrderResponse, OrderStatusUpdate
import math

router = APIRouter(prefix="/api/admin/orders", tags=["admin-orders"])


@router.get("/")
def admin_list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    payment_status: str | None = None,
    order_status: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    q = db.query(Order)
    if payment_status:
        q = q.filter(Order.payment_status == payment_status)
    if order_status:
        q = q.filter(Order.order_status == order_status)
    if search:
        q = q.filter(
            (Order.order_number.ilike(f"%{search}%")) |
            (Order.full_name.ilike(f"%{search}%")) |
            (Order.email.ilike(f"%{search}%"))
        )
    q = q.order_by(Order.created_at.desc())
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "items": [OrderResponse.model_validate(o) for o in items],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": math.ceil(total / per_page) if total else 1,
    }


@router.get("/{order_id}", response_model=OrderResponse)
def admin_get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=OrderResponse)
def admin_update_order(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if data.order_status is not None:
        order.order_status = data.order_status
    if data.payment_status is not None:
        order.payment_status = data.payment_status
    if data.payment_notes is not None:
        order.payment_notes = data.payment_notes
    db.commit()
    db.refresh(order)
    return order
