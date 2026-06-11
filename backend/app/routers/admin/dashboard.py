from fastapi import APIRouter, Depends
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.models.order import Order, PaymentStatus, OrderStatus
from app.models.product import Product

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    # Core stats
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == PaymentStatus.payment_confirmed
    ).scalar() or 0

    pending_payments = db.query(Order).filter(
        Order.payment_status == PaymentStatus.awaiting_payment
    ).count()

    confirmed_payments = db.query(Order).filter(
        Order.payment_status == PaymentStatus.payment_confirmed
    ).count()

    delivered_orders = db.query(Order).filter(
        Order.order_status == OrderStatus.delivered
    ).count()

    active_customers = db.query(User).filter(
        User.is_active == True, User.is_admin == False
    ).count()

    # Revenue chart — last 7 days
    revenue_chart = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        day_revenue = db.query(func.sum(Order.total_amount)).filter(
            func.date(Order.created_at) == day,
            Order.payment_status == PaymentStatus.payment_confirmed,
        ).scalar() or 0
        revenue_chart.append({"date": day.isoformat(), "revenue": float(day_revenue)})

    # Recent orders
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()

    return {
        "stats": {
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "pending_payments": pending_payments,
            "confirmed_payments": confirmed_payments,
            "delivered_orders": delivered_orders,
            "active_customers": active_customers,
        },
        "revenue_chart": revenue_chart,
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "full_name": o.full_name,
                "total_amount": o.total_amount,
                "payment_status": o.payment_status,
                "order_status": o.order_status,
                "created_at": o.created_at.isoformat(),
            }
            for o in recent_orders
        ],
    }
