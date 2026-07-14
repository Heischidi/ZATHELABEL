"""
One-time setup: creates all database tables and stamps Alembic.
Run from backend/: python create_tables.py
"""
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load the .env from the ZA root (one level up from backend/)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

db_url = os.environ.get("DATABASE_URL", "NOT SET")
print(f"Loaded .env from: {env_path}")
print(f"DATABASE_URL: {db_url[:55]}...")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import *  # noqa

print("\nConnecting to Supabase...")
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("DONE: All tables created successfully.")

from alembic.config import Config
from alembic import command

alembic_cfg = Config("alembic.ini")
command.stamp(alembic_cfg, "head")
print("DONE: Alembic stamped at head.")
print("\nSuccess! Your Supabase database is ready. Now run: python seed.py")
