# syntax=docker/dockerfile:1

# ------------------------------------------------------------------
# Etapa 1: Dependencias compilables (compila ruedas que lo requieran)
# ------------------------------------------------------------------
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Librerías necesarias para compilar dependencias con wheels (numpy, tensorflow, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /wheels

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# ------------------------------------------------------------------
# Etapa 2: Imagen final (runtime)
# ------------------------------------------------------------------
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEEPFACE_HOME=/app/.deepface

# DeepFace/TensorFlow/OpenCV requieren librerías de sistema en runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app && useradd --system --gid app app

WORKDIR /app

# Copiar requirements (necesario para instalar desde las ruedas) y las ruedas compiladas
COPY requirements.txt .
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

# Copiar código de la aplicación
COPY app ./app

# Directorio para rostros temporales (se persiste vía volumen)
RUN mkdir -p /app/faces && chown -R app:app /app

USER app

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
