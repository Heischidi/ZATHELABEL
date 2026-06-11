# ZA — Premium Fashion E-Commerce Platform

A complete, production-ready fashion e-commerce platform for the **ZA** streetwear brand.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, React Query |
| Backend | FastAPI (Python), SQLAlchemy, Alembic |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens) |
| Images | Cloudinary |
| Deployment | Docker + Docker Compose |

---

## Quick Start

### 1. Clone and configure environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `POSTGRES_PASSWORD` — a strong database password
- `SECRET_KEY` — a long random string for JWT signing
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `WHATSAPP_NUMBER` — your store WhatsApp number (digits only, e.g. `2348012345678`)

### 2. Start with Docker

```bash
docker-compose up --build
```

This will:
1. Start PostgreSQL
2. Run Alembic migrations
3. Seed the database (admin user + sample products)
4. Start FastAPI backend on `http://localhost:8000`
5. Start Next.js frontend on `http://localhost:3000`

### 3. Access the platform

| URL | Description |
|---|---|
| `http://localhost:3000` | Customer Store |
| `http://localhost:3000/admin` | Admin Dashboard |
| `http://localhost:8000/api/docs` | API Documentation (Swagger) |

### Default Admin Credentials
```
Email:    admin@za.com
Password: admin123
```
> ⚠️ **Change these immediately after first login via Admin → Settings**

---

## Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
# Edit .env with local PostgreSQL credentials

# Run migrations
alembic upgrade head

# Seed database
python seed.py

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

---

## Project Structure

```
ZA/
├── frontend/              # Next.js 15 app
│   └── src/
│       ├── app/
│       │   ├── (store)/   # Customer-facing pages
│       │   └── admin/     # Admin dashboard
│       ├── components/    # Reusable components
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Utilities, API client
│       ├── store/         # Zustand state
│       └── types/         # TypeScript types
├── backend/               # FastAPI app
│   ├── app/
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # API endpoints
│   │   └── utils/         # Auth, Cloudinary, order helpers
│   ├── alembic/           # Database migrations
│   └── seed.py            # Database seed script
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Key Features

### Customer Store
- Full-width hero banner with animated typography
- Product browsing with search, filter, sort, and pagination
- Product detail with image gallery, size/color selectors
- Cart (persisted in localStorage with Zustand)
- Checkout with Nigerian states dropdown
- **WhatsApp-based order payment** — order creates a pre-filled WhatsApp message
- Customer dashboard (profile, orders, wishlist)

### Admin Dashboard
- Real-time stats (total orders, revenue, pending payments, etc.)
- Revenue chart (last 7 days — Recharts area chart)
- Product management with image upload (Cloudinary)
- Order management with inline status updates
- Payment management (confirm/reject awaiting payments)
- Delivery tracking (courier, tracking number, status)
- Customer management
- Site settings (WhatsApp number, delivery fee, contact info)

### Order Flow
1. Customer fills checkout form
2. Order is created with status `awaiting_payment`
3. Customer is redirected to WhatsApp with pre-filled message
4. Admin sees the order in Admin → Payments
5. Admin confirms payment via WhatsApp, then marks as confirmed
6. Order progresses through: `confirmed → processing → shipped → delivered`

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `SECRET_KEY` | JWT signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `WHATSAPP_NUMBER` | Store WhatsApp (digits only) |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend |
| `ALLOWED_ORIGINS` | CORS allowed origins |

---

## Production Deployment

1. Update `.env` with production values
2. Set `ALLOWED_ORIGINS` to your production domain
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Run: `docker-compose -f docker-compose.yml up -d --build`

---

*Built with ❤️ for ZA — Premium Streetwear & Fashion*
