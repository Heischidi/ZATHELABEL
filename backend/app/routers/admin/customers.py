from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.models.order import Order
from app.schemas.user import UserResponse
import math

router = APIRouter(prefix="/api/admin/customers", tags=["admin-customers"])


@router.get("/")
def admin_list_customers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    q = db.query(User).filter(User.is_admin == False)
    if search:
        q = q.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.phone.ilike(f"%{search}%"))
        )
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "items": [UserResponse.model_validate(u) for u in items],
        "total": total,
        "page": page,
        "pages": math.ceil(total / per_page) if total else 1,
    }


@router.get("/{customer_id}")
def admin_get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        return {"error": "Customer not found"}
    orders = db.query(Order).filter(Order.user_id == customer_id).order_by(Order.created_at.desc()).all()
    return {
        "customer": UserResponse.model_validate(user),
        "orders": [
            {
                "order_number": o.order_number,
                "total_amount": o.total_amount,
                "payment_status": o.payment_status,
                "order_status": o.order_status,
                "created_at": o.created_at.isoformat(),
            }
            for o in orders
        ],
    }
