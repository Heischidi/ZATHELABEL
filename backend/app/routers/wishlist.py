from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.wishlist import Wishlist
from app.models.product import Product
from app.models.user import User
from app.schemas.wishlist import WishlistItemCreate, WishlistResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("/", response_model=WishlistResponse)
def get_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    return WishlistResponse(items=items, total=len(items))


@router.post("/", status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    data: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == data.product_id,
    ).first()
    if existing:
        return {"message": "Already in wishlist"}

    item = Wishlist(user_id=current_user.id, product_id=data.product_id)
    db.add(item)
    db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == product_id,
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Removed from wishlist"}
