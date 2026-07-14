# Deploying ZA — Free Stack: Vercel + Supabase + Cloudinary

This guide walks you through deploying ZA at **zero cost** using:
- **Vercel** — Next.js frontend + FastAPI backend (serverless)
- **Supabase** — PostgreSQL database (free tier)
- **Cloudinary** — Image uploads (already configured, free tier)

---

## Prerequisites

- GitHub account (repo must be pushed to GitHub for Vercel)
- [Supabase account](https://supabase.com) (free)
- [Vercel account](https://vercel.com) (free)
- [Cloudinary account](https://cloudinary.com) (free, you likely already have this)
- Python 3.11+ installed locally (for running migrations)

---

## Step 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name (e.g. `za-fashion`), set a strong password, pick a region (closest to you)
3. Wait ~2 minutes for the project to provision

### Get your connection strings

Go to **Project Settings → Database → Connection string**

You need **two URLs**:

| URL | Tab | Port | Used for |
|---|---|---|---|
| **Transaction Pooler** | "Transaction" | `6543` | The running app (Vercel) |
| **Direct** | "Direct connection" | `5432` | Running Alembic migrations |

Both look like:
```
postgresql://postgres.[ref]:[password]@[host]:[port]/postgres
```

---

## Step 2 — Run Database Migrations Locally

This is a **one-time step** — run it from your machine before the first deploy.

```powershell
# Navigate to backend
cd C:\Users\ejiko\OneDrive\Documents\ZA\backend

# Activate your virtual environment
venv\Scripts\activate

# Edit alembic.ini — paste your Supabase DIRECT URL (port 5432) on the sqlalchemy.url line
# Example: postgresql://postgres.abcdefgh:MyPass@db.abcdefgh.supabase.co:5432/postgres

# Run migrations
alembic upgrade head

# Seed the database (creates admin user + sample products)
python seed.py
```

After this, you'll see the tables in **Supabase → Table Editor**.

---

## Step 3 — Push to GitHub

Make sure the repo is pushed to GitHub (if not already):

```powershell
cd C:\Users\ejiko\OneDrive\Documents\ZA
git add .
git commit -m "chore: configure for Vercel + Supabase deployment"
git push
```

---

## Step 4 — Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select your ZA repo
3. Set **Root Directory** to `./` (the repo root — leave as default)
4. Vercel will auto-detect the monorepo setup from `vercel.json`

### Set Environment Variables

In the Vercel project settings → **Environment Variables**, add these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase **Transaction Pooler** URL (port `6543`) |
| `SECRET_KEY` | A long random string for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `ALLOWED_ORIGINS` | `https://YOUR-PROJECT.vercel.app` |
| `WHATSAPP_NUMBER` | Your WhatsApp number (digits only, e.g. `2348012345678`) |
| `NEXT_PUBLIC_API_URL` | `https://YOUR-PROJECT.vercel.app` ← **same domain, no /api suffix** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |

> **Note**: `NEXT_PUBLIC_API_URL` should be your Vercel domain (e.g. `https://zathelabel.vercel.app`).
> Since frontend and backend are on the same domain, `/api/*` calls are automatically routed
> to the Python backend by `vercel.json`.

5. Click **Deploy**

---

## Step 5 — Verify

After deploy (usually ~3 minutes), test:

| URL | Expected result |
|---|---|
| `https://YOUR-PROJECT.vercel.app/api/health` | `{"status": "ok", "service": "ZA Fashion API"}` |
| `https://YOUR-PROJECT.vercel.app/api/docs` | Swagger UI |
| `https://YOUR-PROJECT.vercel.app` | Store homepage |
| `https://YOUR-PROJECT.vercel.app/admin` | Admin login |

**Default admin credentials:**
```
Email:    admin@za.com
Password: admin123
```
> ⚠️ Change these immediately via Admin → Settings after first login.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `500` errors on `/api/*` | Check Vercel function logs → Functions tab in Vercel dashboard |
| `could not connect to database` | Make sure `DATABASE_URL` uses port `6543` (Transaction Pooler), not `5432` |
| Migration fails | Make sure `alembic.ini` has the Direct URL (port `5432`) when running locally |
| Images not uploading | Verify Cloudinary env vars are set correctly in Vercel |
| Frontend shows blank page | Check `NEXT_PUBLIC_API_URL` is set to your Vercel domain (no trailing slash) |

---

## Free Tier Limits to Know

| Service | Limit |
|---|---|
| Vercel (Hobby) | 100GB bandwidth/month, 10s function timeout, 100hrs compute |
| Supabase (Free) | 500MB DB, 5GB storage, project pauses after 1 week of inactivity |
| Cloudinary (Free) | 25GB storage, 25GB bandwidth/month |

> **Supabase project pause**: On the free tier, Supabase pauses inactive projects after ~1 week.
> You can un-pause from the dashboard. Upgrade to Pro ($25/mo) to disable this.
