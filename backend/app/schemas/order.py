from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.order import PaymentStatus, OrderStatus


# ---------- Order Item ----------
class OrderItemCreate(BaseModel):
    product_id: int
    size: str | None = None
    color: str | None = None
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    product_image: str | None
    size: str | None
    color: str | None
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True


# ---------- Order ----------
class OrderCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    delivery_address: str
    city: str
    state: str
    country: str = "Nigeria"
    notes: str | None = None
    items: list[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    order_number: str
    full_name: str
    email: str
    phone: str
    delivery_address: str
    city: str
    state: str
    country: str
    notes: str | None
    subtotal: float
    delivery_fee: float
    total_amount: float
    payment_status: PaymentStatus
    order_status: OrderStatus
    payment_notes: str | None
    whatsapp_sent: bool
    items: list[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderCreateResponse(BaseModel):
    order: OrderResponse
    whatsapp_url: str


class OrderStatusUpdate(BaseModel):
    order_status: OrderStatus | None = None
    payment_status: PaymentStatus | None = None
    payment_notes: str | None = None
