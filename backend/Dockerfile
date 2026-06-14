FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create tables, seed (non-fatal), then start server
CMD ["sh", "-c", "python -c 'from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine); print(\"Tables ready\")' && (python seed.py 2>&1 || echo 'Seed failed, continuing...') && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
