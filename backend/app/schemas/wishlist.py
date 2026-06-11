from datetime import datetime
from pydantic import BaseModel
from app.schemas.product import ProductResponse


class WishlistItemCreate(BaseModel):
    product_id: int


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product: ProductResponse
    created_at: datetime

    class Config:
        from_attributes = True


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    total: int
