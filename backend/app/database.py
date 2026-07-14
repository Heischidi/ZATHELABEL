from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from app.config import get_settings

settings = get_settings()

# NullPool disables SQLAlchemy's built-in connection pool.
# In serverless (Vercel) each invocation is short-lived, so persistent
# pools cause connection leaks. Supabase's PgBouncer (Transaction Pooler,
# port 6543) handles pooling on the database side instead.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    poolclass=NullPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
