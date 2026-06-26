from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, users, products, categories, cart, wishlist, orders, upload
from app.routers.admin import dashboard, products as admin_products, orders as admin_orders
from app.routers.admin import customers, delivery, settings as admin_settings

settings = get_settings()

app = FastAPI(
    title="ZA Fashion API",
    description="Backend API for the ZA streetwear e-commerce platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
origins = [o.strip() for o in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Customer routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(upload.router)

# Admin routers
app.include_router(dashboard.router)
app.include_router(admin_products.router)
app.include_router(admin_orders.router)
app.include_router(customers.router)
app.include_router(delivery.router)
app.include_router(admin_settings.router)


from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global exception caught: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": str(type(exc))}
    )

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ZA Fashion API"}
