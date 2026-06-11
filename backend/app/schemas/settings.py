from datetime import datetime
from pydantic import BaseModel


class SettingUpdate(BaseModel):
    value: str | None = None


class SettingResponse(BaseModel):
    key: str
    value: str | None
    updated_at: datetime

    class Config:
        from_attributes = True


class BulkSettingsUpdate(BaseModel):
    settings: dict[str, str | None]
