"""
Startup script for Railway deployment.
Handles DB setup, seeding, and launches uvicorn.
"""
import os
import sys
import subprocess

print("=== ZA Backend Startup ===")

# 1. Create all tables
print("Creating database tables...")
try:
    from app.database import engine, Base
    from app.models import *  # noqa
    Base.metadata.create_all(bind=engine)
    print("✅ Tables ready")
except Exception as e:
    print(f"❌ Table creation failed: {e}")
    sys.exit(1)

# 2. Seed database (non-fatal)
print("Running seed...")
try:
    from app.database import SessionLocal
    from app.models.user import User
    from app.models.product import Category, Product
    from app.models.settings import SiteSetting
    from app.utils.auth import hash_password

    db = SessionLocal()

    # Admin user
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

    # Default settings
    defaults = {
        "brand_name": "ZA",
        "whatsapp_number": "2348000000000",
        "delivery_fee": "3500",
        "contact_email": "hello@za.store",
    }
    for key, value in defaults.items():
        if not db.query(SiteSetting).filter(SiteSetting.key == key).first():
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    db.close()
    print("✅ Seed complete")

except Exception as e:
    print(f"⚠️  Seed failed (non-fatal): {e}")

# 3. Start uvicorn
port = os.environ.get("PORT", "8000")
print(f"🚀 Starting uvicorn on port {port}...")
os.execvp("uvicorn", [
    "uvicorn",
    "app.main:app",
    "--host", "0.0.0.0",
    "--port", port,
])
