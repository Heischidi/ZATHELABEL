from pydantic import BaseModel
from app.schemas.product import ProductResponse


class CartItemCreate(BaseModel):
    product_id: int
    size: str | None = None
    color: str | None = None
    quantity: int = 1
    session_id: str | None = None


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    size: str | None
    color: str | None
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    subtotal: float
    delivery_fee: float
    total: float
    item_count: int
