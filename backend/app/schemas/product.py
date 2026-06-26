from datetime import datetime
from pydantic import BaseModel
from typing import Any


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Product Image ----------
class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    public_id: str | None
    is_primary: bool
    sort_order: int

    class Config:
        from_attributes = True


# ---------- Product ----------
class ProductBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    price: float
    discount_price: float | None = None
    category_id: int | None = None
    sizes: list[str] = []
    colors: list[dict[str, Any]] = []
    stock_quantity: int = 0
    instagram_url: str | None = None
    is_featured: bool = False
    is_new_arrival: bool = False
    is_best_seller: bool = False
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    price: float | None = None
    discount_price: float | None = None
    category_id: int | None = None
    sizes: list[str] | None = None
    colors: list[dict[str, Any]] | None = None
    stock_quantity: int | None = None
    instagram_url: str | None = None
    is_featured: bool | None = None
    is_new_arrival: bool | None = None
    is_best_seller: bool | None = None
    is_active: bool | None = None


class ProductResponse(ProductBase):
    id: int
    images: list[ProductImageResponse] = []
    category: CategoryResponse | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    per_page: int
    pages: int
