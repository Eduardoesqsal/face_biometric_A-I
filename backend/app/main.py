from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .core.config import DEFAULT_CORS_ORIGINS, FACES_DIR
from .presentation.api.routes import router

app = FastAPI(title="Face Attendance API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

FACES_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/faces", StaticFiles(directory=str(FACES_DIR)), name="faces")


@app.on_event("startup")
def ensure_storage() -> None:
    FACES_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def root() -> HTMLResponse:
    return HTMLResponse(
        """
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Face Attendance API</title>
            <style>
              body { font-family: Inter, Arial, sans-serif; background: #0c0f14; color: #f3f6f9; margin: 0; min-height: 100vh; display: grid; place-items: center; }
              .card { background: #171c24; border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 24px 28px; max-width: 560px; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
              h1 { margin: 0 0 8px; font-size: 1.6rem; }
              p { margin: 0; color: #c7cfd9; line-height: 1.6; }
              code { background: #232a36; padding: 2px 6px; border-radius: 6px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Face Attendance API</h1>
              <p>Backend activo. Usa el frontend separado para la interfaz. Estado: <code>/health</code>.</p>
            </div>
          </body>
        </html>
        """,
        media_type="text/html",
    )
