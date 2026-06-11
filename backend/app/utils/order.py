import random
import string
from datetime import datetime


def generate_order_number() -> str:
    """Generate a unique order number like ZA-20240611-X7K2M."""
    date_part = datetime.utcnow().strftime("%Y%m%d")
    random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"ZA-{date_part}-{random_part}"


def build_whatsapp_url(
    whatsapp_number: str,
    order_number: str,
    customer_name: str,
    total_amount: float,
) -> str:
    """Generate a pre-filled WhatsApp URL for payment instructions."""
    message = (
        f"Hello ZA Team,\n\n"
        f"I would like to make payment for my order.\n\n"
        f"Order Number: {order_number}\n"
        f"Customer Name: {customer_name}\n"
        f"Total Amount: \u20a6{total_amount:,.0f}\n\n"
        f"Please send payment details.\n\n"
        f"Thank you."
    )
    import urllib.parse
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{whatsapp_number}?text={encoded}"
