# syntax=docker/dockerfile:1

FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /wheels

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt


FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEEPFACE_HOME=/app/.deepface

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app \
    && useradd --system --gid app app

WORKDIR /app

COPY requirements.txt .
COPY --from=builder /wheels /wheels

RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

COPY app ./app

RUN mkdir -p /app/faces \
    && chown -R app:app /app

USER app

EXPOSE 10000

# IMPORT TEST + ARRANQUE
CMD ["sh", "-c", "echo '=== ARCHIVOS APP ===' && find /app/app -maxdepth 2 -type f && echo '=== PYTHON PATH ===' && python -c 'import sys; print(sys.path)' && echo '=== IMPORT TEST ===' && python -c 'import app.main; print(\"IMPORT OK\")' && echo '=== START UVICORN ===' && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]