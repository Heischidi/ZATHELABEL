from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.delivery import Delivery
from app.models.order import Order
from app.models.user import User
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate, DeliveryResponse

router = APIRouter(prefix="/api/admin/delivery", tags=["admin-delivery"])


@router.get("/", response_model=list[DeliveryResponse])
def admin_list_deliveries(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return db.query(Delivery).all()


@router.post("/", response_model=DeliveryResponse, status_code=201)
def admin_create_delivery(
    data: DeliveryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    order = db.query(Order).filter(Order.id == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    existing = db.query(Delivery).filter(Delivery.order_id == data.order_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Delivery record already exists")
    delivery = Delivery(**data.model_dump())
    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    return delivery


@router.get("/{delivery_id}", response_model=DeliveryResponse)
def admin_get_delivery(
    delivery_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    d = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return d


@router.put("/{delivery_id}", response_model=DeliveryResponse)
def admin_update_delivery(
    delivery_id: int,
    data: DeliveryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    d = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Delivery not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(d, field, value)
    db.commit()
    db.refresh(d)
    return d
