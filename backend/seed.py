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

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import *  # noqa
from app.utils.auth import hash_password

db = SessionLocal()

# ─────────────── Admin User ───────────────
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
    print("✅ Admin user created: admin@za.com / admin123")
else:
    print("ℹ️  Admin user already exists")

# ─────────────── Categories ───────────────
categories_data = [
    {"name": "Men", "slug": "men", "description": "Men's streetwear collection"},
    {"name": "Women", "slug": "women", "description": "Women's fashion collection"},
    {"name": "Accessories", "slug": "accessories", "description": "Bags, caps, belts, and more"},
    {"name": "Outerwear", "slug": "outerwear", "description": "Jackets, coats, and hoodies"},
    {"name": "Footwear", "slug": "footwear", "description": "Sneakers and boots"},
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
        print(f"✅ Category created: {cat_data['name']}")
    else:
        cat_map[cat_data["slug"]] = existing.id

# ─────────────── Products ───────────────
products_data = [
    {
        "name": "ZA Signature Tee",
        "slug": "za-signature-tee",
        "description": "Our iconic oversized tee crafted from premium 100% cotton. A wardrobe essential.",
        "price": 15000,
        "discount_price": 12000,
        "category_id": cat_map.get("men"),
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "White", "hex": "#FFFFFF"}],
        "stock_quantity": 50,
        "is_featured": True,
        "is_new_arrival": True,
        "is_best_seller": True,
    },
    {
        "name": "ZA Urban Hoodie",
        "slug": "za-urban-hoodie",
        "description": "Premium heavyweight fleece hoodie with embroidered ZA logo.",
        "price": 35000,
        "category_id": cat_map.get("outerwear"),
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Charcoal", "hex": "#36454F"}],
        "stock_quantity": 30,
        "is_featured": True,
        "is_new_arrival": True,
    },
    {
        "name": "ZA Wide Leg Trousers",
        "slug": "za-wide-leg-trousers",
        "description": "Relaxed wide-leg silhouette in luxurious wool-blend fabric.",
        "price": 28000,
        "discount_price": 22000,
        "category_id": cat_map.get("men"),
        "sizes": ["S", "M", "L", "XL"],
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
        "category_id": cat_map.get("women"),
        "sizes": ["XS", "S", "M", "L"],
        "colors": [{"name": "Ivory", "hex": "#FFFFF0"}, {"name": "Black", "hex": "#000000"}],
        "stock_quantity": 20,
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
        "name": "ZA Cargo Pants",
        "slug": "za-cargo-pants",
        "description": "Technical multi-pocket cargo pants in ripstop nylon.",
        "price": 22000,
        "category_id": cat_map.get("men"),
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": [{"name": "Olive", "hex": "#808000"}, {"name": "Black", "hex": "#000000"}],
        "stock_quantity": 35,
        "is_new_arrival": True,
    },
    {
        "name": "ZA Bomber Jacket",
        "slug": "za-bomber-jacket",
        "description": "Oversized satin bomber with embroidered back panel. Statement outerwear.",
        "price": 55000,
        "discount_price": 48000,
        "category_id": cat_map.get("outerwear"),
        "sizes": ["S", "M", "L", "XL"],
        "colors": [{"name": "Black", "hex": "#000000"}, {"name": "Gold", "hex": "#C9A96E"}],
        "stock_quantity": 10,
        "is_featured": True,
        "is_best_seller": True,
    },
]

for prod_data in products_data:
    if not db.query(Product).filter(Product.slug == prod_data["slug"]).first():
        product = Product(**prod_data)
        db.add(product)
        db.commit()
        print(f"✅ Product created: {prod_data['name']}")

# ─────────────── Site Settings ───────────────
default_settings = {
    "brand_name": "ZA",
    "whatsapp_number": "2348000000000",
    "delivery_fee": "3500",
    "contact_email": "hello@za.store",
    "contact_phone": "+234 800 000 0000",
    "contact_address": "Lagos, Nigeria",
    "meta_description": "ZA — Premium streetwear and fashion for the bold.",
    "hero_banners": '[{"title":"New Season Arrivals","subtitle":"Redefine Your Style","image":"","cta":"Shop Now","link":"/products"}]',
    "social_links": '{"instagram":"","twitter":"","facebook":"","tiktok":""}',
}

for key, value in default_settings.items():
    if not db.query(SiteSetting).filter(SiteSetting.key == key).first():
        db.add(SiteSetting(key=key, value=value))

db.commit()
print("✅ Site settings initialized")
db.close()
print("\n🎉 Seed complete! ZA database is ready.")
