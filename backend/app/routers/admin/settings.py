from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_admin
from app.models.settings import SiteSetting
from app.models.user import User
from app.schemas.settings import SettingResponse, BulkSettingsUpdate

router = APIRouter(prefix="/api/admin/settings", tags=["admin-settings"])

DEFAULT_KEYS = [
    "brand_name", "logo_url", "whatsapp_number", "delivery_fee",
    "hero_banners", "social_links", "contact_email", "contact_phone",
    "contact_address", "meta_description",
]


@router.get("/", response_model=list[SettingResponse])
def get_settings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    settings = db.query(SiteSetting).all()
    return settings


@router.put("/")
def update_settings(
    data: BulkSettingsUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    for key, value in data.settings.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    return {"message": "Settings updated"}


@router.get("/public")
def get_public_settings(db: Session = Depends(get_db)):
    """Public endpoint for frontend to fetch site settings."""
    settings = db.query(SiteSetting).all()
    return {s.key: s.value for s in settings}
