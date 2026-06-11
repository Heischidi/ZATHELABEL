from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.database import get_db
from app.models.product import Product, Category, ProductImage
from app.schemas.product import ProductResponse, ProductListResponse
import math

router = APIRouter(prefix="/api/products", tags=["products"])


def product_query(db: Session):
    return db.query(Product).filter(Product.is_active == True)


@router.get("/", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    sort: str = Query("newest", enum=["newest", "oldest", "price_asc", "price_desc"]),
    min_price: float | None = None,
    max_price: float | None = None,
    featured: bool | None = None,
):
    q = product_query(db)

    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            q = q.filter(Product.category_id == cat.id)

    if search:
        q = q.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )

    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    if featured is not None:
        q = q.filter(Product.is_featured == featured)

    sort_map = {
        "newest": desc(Product.created_at),
        "oldest": asc(Product.created_at),
        "price_asc": asc(Product.price),
        "price_desc": desc(Product.price),
    }
    q = q.order_by(sort_map[sort])

    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get("/featured", response_model=list[ProductResponse])
def get_featured(db: Session = Depends(get_db), limit: int = 8):
    return product_query(db).filter(Product.is_featured == True).limit(limit).all()


@router.get("/new-arrivals", response_model=list[ProductResponse])
def get_new_arrivals(db: Session = Depends(get_db), limit: int = 8):
    return product_query(db).filter(Product.is_new_arrival == True).order_by(desc(Product.created_at)).limit(limit).all()


@router.get("/best-sellers", response_model=list[ProductResponse])
def get_best_sellers(db: Session = Depends(get_db), limit: int = 8):
    return product_query(db).filter(Product.is_best_seller == True).limit(limit).all()


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = product_query(db).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/{slug}/related", response_model=list[ProductResponse])
def get_related(slug: str, db: Session = Depends(get_db), limit: int = 4):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    related = (
        product_query(db)
        .filter(Product.category_id == product.category_id, Product.id != product.id)
        .limit(limit)
        .all()
    )
    return related
