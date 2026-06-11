from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class SiteSetting(Base):
    """
    Key-value store for site-wide settings.
    Keys: brand_name, logo_url, whatsapp_number, delivery_fee,
          hero_banners, social_links, contact_email, contact_phone,
          contact_address, meta_description
    """
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
