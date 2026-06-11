import cloudinary
import cloudinary.uploader
from app.config import get_settings

settings = get_settings()

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
)


def upload_image(file_bytes: bytes, folder: str = "za-store") -> dict:
    """Upload image bytes to Cloudinary and return URL + public_id."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary by public_id."""
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"
