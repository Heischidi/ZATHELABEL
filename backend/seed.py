"""
Seed script — populates the database with:
- Admin user
- Categories
- Sample products
- Default site settings
Run: python seed.py
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the ZA root (one level up from backend/)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import *  # noqa
from app.utils.auth import hash_password

db = SessionLocal()

# Admin User
if not db.query(User).filter(User.email == "admin@za.com").first():
    admin = User(
        email="admin@za.com",
        password_hash=hash_password("admin123"),
        full_name="ZA Admin",
        is_admin=True,
        is_active=True,
    )
    db.add(admin)
    db.commit()
    print("Admin user created: admin@za.com / admin123")
else:
    print("Admin user already exists")

# ─────────────── Categories ───────────────
categories_data = [
    {"name": "Dresses", "slug": "dresses", "description": "Elegant dresses for every occasion"},
    {"name": "Tops & Blouses", "slug": "tops", "description": "Stylish tops and blouses for women"},
    {"name": "Bottoms", "slug": "bottoms", "description": "Trousers, skirts, and shorts for women"},
    {"name": "Accessories", "slug": "accessories", "description": "Bags, caps, belts, and more"},
    {"name": "Outerwear", "slug": "outerwear", "description": "Jackets, coats, and hoodies for women"},
]

cat_map = {}
for cat_data in categories_data:
    existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
    if not existing:
        cat = Category(**cat_data)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        cat_map[cat_data["slug"]] = cat.id
        print(f"Category created: {cat_data['name']}")
    else:
        cat_map[cat_data["slug"]] = existing.id

# ─────────────── Products ───────────────
products_data = [
    {
        "name": "ZA Signature Tee",
        "slug": "za-signature-tee",
        "description": "Our iconic oversized tee crafted from premium 100% cotton. A wardrobe essential for every woman.",
        "price": 15000,
        "discount_price": 12000,
        "category_id": cat_map.get("tops"),
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "White", "hex": "#FFFFFF"}],
        "stock_quantity": 50,
        "is_featured": True,
        "is_new_arrival": True,
        "is_best_seller": True,
    },
    {
        "name": "ZA Women's Bomber Jacket",
        "slug": "za-womens-bomber-jacket",
        "description": "Oversized satin bomber with embroidered ZA logo. Statement outerwear designed for her.",
        "price": 55000,
        "discount_price": 48000,
        "category_id": cat_map.get("outerwear"),
        "sizes": ["XS", "S", "M", "L"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Gold", "hex": "#C9A96E"}],
        "stock_quantity": 10,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "ZA Wide Leg Trousers",
        "slug": "za-wide-leg-trousers",
        "description": "Relaxed wide-leg silhouette in luxurious wool-blend fabric. Tailored for the modern woman.",
        "price": 28000,
        "discount_price": 22000,
        "category_id": cat_map.get("bottoms"),
        "sizes": ["XS", "S", "M", "L"],
        "colors": [{"name": "Beige", "hex": "#F5F5DC"}, {"name": "Black", "hex": "#000000"}],
        "stock_quantity": 25,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "ZA Women's Wrap Dress",
        "slug": "za-womens-wrap-dress",
        "description": "Elegant wrap dress in fluid satin. Perfect for any occasion.",
        "price": 32000,
        "category_id": cat_map.get("dresses"),
        "sizes": ["XS", "S", "M", "L"],
        "colors": [{"name": "Ivory", "hex": "#FFFFF0"}, {"name": "Black", "hex": "#000000"}],
        "stock_quantity": 20,
        "is_featured": True,
        "is_new_arrival": True,
    },
    {
        "name": "ZA Mini Dress",
        "slug": "za-mini-dress",
        "description": "Sleek mini dress with a structured bodice and flared hem. Bold, feminine, unforgettable.",
        "price": 27000,
        "category_id": cat_map.get("dresses"),
        "sizes": ["XS", "S", "M", "L"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Sage", "hex": "#87AE73"}],
        "stock_quantity": 18,
        "is_featured": True,
        "is_new_arrival": True,
    },
    {
        "name": "ZA Leather Cap",
        "slug": "za-leather-cap",
        "description": "Structured leather baseball cap with gold ZA emblem.",
        "price": 12000,
        "category_id": cat_map.get("accessories"),
        "sizes": ["One Size"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Tan", "hex": "#D2691E"}],
        "stock_quantity": 40,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "ZA Mini Crossbody Bag",
        "slug": "za-mini-crossbody-bag",
        "description": "Compact genuine leather crossbody with detachable strap.",
        "price": 45000,
        "category_id": cat_map.get("accessories"),
        "sizes": ["One Size"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Brown", "hex": "#8B4513"}],
        "stock_quantity": 15,
        "is_featured": True,
    },
    {
        "name": "ZA Linen Blouse",
        "slug": "za-linen-blouse",
        "description": "Lightweight linen blouse with relaxed fit and subtle ZA stitching. Effortlessly chic.",
        "price": 18000,
        "category_id": cat_map.get("tops"),
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": [{"name": "Cream", "hex": "#FFFDD0"}, {"name": "Sage", "hex": "#87AE73"}],
        "stock_quantity": 30,
        "is_new_arrival": True,
    },
]

for prod_data in products_data:
    if not db.query(Product).filter(Product.slug == prod_data["slug"]).first():
        product = Product(**prod_data)
        db.add(product)
        db.commit()
        print(f"Product created: {prod_data['name']}")

# ─────────────── Site Settings ───────────────
default_settings = {
    "brand_name": "ZA",
    "whatsapp_number": "2349055576563",
    "delivery_fee": "3500",
    "contact_email": "hello@za.store",
    "contact_phone": "+234 905 557 6563",
    "contact_address": "Lagos, Nigeria",
    "meta_description": "ZA — Premium streetwear and fashion for the bold.",
    "hero_banners": '[{"title":"New Season Arrivals","subtitle":"Redefine Your Style","image":"","cta":"Shop Now","link":"/products"}]',
    "social_links": '{"instagram":"","twitter":"","facebook":"","tiktok":""}',
}

for key, value in default_settings.items():
    if not db.query(SiteSetting).filter(SiteSetting.key == key).first():
        db.add(SiteSetting(key=key, value=value))

db.commit()
print("Site settings initialized")
db.close()
print("\nSeed complete! ZA database is ready.")
