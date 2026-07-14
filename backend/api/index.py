"""
Vercel Serverless Entry Point
-----------------------------
Wraps the FastAPI app with Mangum, which acts as an ASGI adapter
between Vercel's Lambda-style serverless runtime and FastAPI.

No changes to any router, model, or business logic are needed.
"""
import sys
import os

# Ensure the backend directory is on the path so `app.*` imports resolve
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # noqa: E402
from mangum import Mangum  # noqa: E402

# Vercel invokes `handler` for every incoming request
handler = Mangum(app, lifespan="off")
