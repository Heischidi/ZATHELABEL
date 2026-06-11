import enum
from sqlalchemy import (
    Column, Integer, String, Text, Float,
    ForeignKey, DateTime, Boolean, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class PaymentStatus(str, enum.Enum):
    awaiting_payment = "awaiting_payment"
    payment_confirmed = "payment_confirmed"
    payment_failed = "payment_failed"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Customer info (captured at checkout)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    delivery_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False, default="Nigeria")
    notes = Column(Text, nullable=True)

    # Financials
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, nullable=False, default=0)
    total_amount = Column(Float, nullable=False)

    # Status
    payment_status = Column(
        Enum(PaymentStatus),
        default=PaymentStatus.awaiting_payment,
        nullable=False,
    )
    order_status = Column(
        Enum(OrderStatus),
        default=OrderStatus.pending,
        nullable=False,
    )
    payment_notes = Column(Text, nullable=True)
    whatsapp_sent = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    delivery = relationship("Delivery", back_populates="order", uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    # Snapshot of product at time of order
    product_name = Column(String(255), nullable=False)
    product_image = Column(String(500), nullable=True)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
