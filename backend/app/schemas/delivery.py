from datetime import datetime
from pydantic import BaseModel
from app.models.delivery import DeliveryStatus


class DeliveryCreate(BaseModel):
    order_id: int
    courier_name: str | None = None
    tracking_number: str | None = None
    status: DeliveryStatus = DeliveryStatus.pending
    estimated_delivery: str | None = None
    notes: str | None = None


class DeliveryUpdate(BaseModel):
    courier_name: str | None = None
    tracking_number: str | None = None
    status: DeliveryStatus | None = None
    estimated_delivery: str | None = None
    notes: str | None = None


class DeliveryResponse(BaseModel):
    id: int
    order_id: int
    courier_name: str | None
    tracking_number: str | None
    status: DeliveryStatus
    estimated_delivery: str | None
    notes: str | None
    updated_at: datetime

    class Config:
        from_attributes = True
