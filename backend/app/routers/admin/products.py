from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.product import Product, ProductImage, Category
from app.models.user import User
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse
)
from app.utils.cloudinary import delete_image
import math

router = APIRouter(prefix="/api/admin/products", tags=["admin-products"])


# --- Categories ---
@router.get("/categories", response_model=list[CategoryResponse])
def admin_list_categories(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Category).all()


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def admin_create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{cat_id}", response_model=CategoryResponse)
def admin_update_category(
    cat_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{cat_id}")
def admin_delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}


# --- Products ---
@router.get("/", response_model=ProductListResponse)
def admin_list_products(
    page: int = 1,
    per_page: int = 20,
    search: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    q = db.query(Product)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()
    return ProductListResponse(
        items=items, total=total, page=page, per_page=per_page,
        pages=math.ceil(total / per_page) if total else 1,
    )


@router.post("/", response_model=ProductResponse, status_code=201)
def admin_create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    prod_data = data.model_dump()
    if prod_data.get("discount_price") is not None and prod_data["discount_price"] <= 0:
        prod_data["discount_price"] = None
    product = Product(**prod_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductResponse)
def admin_get_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def admin_update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Exclude None only for fields other than discount_price, so setting discount_price to None is possible
    update_data = data.model_dump(exclude_unset=True)
    if "discount_price" in update_data and (update_data["discount_price"] is None or update_data["discount_price"] <= 0):
        update_data["discount_price"] = None
        
    for field, value in update_data.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def admin_delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Delete Cloudinary images
    for img in product.images:
        if img.public_id:
            delete_image(img.public_id)
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}


@router.post("/{product_id}/images")
def admin_add_product_image(
    product_id: int,
    image_url: str,
    public_id: str | None = None,
    is_primary: bool = False,
    sort_order: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if is_primary:
        for img in product.images:
            img.is_primary = False
    img = ProductImage(
        product_id=product_id,
        image_url=image_url,
        public_id=public_id,
        is_primary=is_primary,
        sort_order=sort_order,
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/{product_id}/images/{image_id}")
def admin_delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    img = db.query(ProductImage).filter(
        ProductImage.id == image_id, ProductImage.product_id == product_id
    ).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    if img.public_id:
        delete_image(img.public_id)
    db.delete(img)
    db.commit()
    return {"message": "Image deleted"}
