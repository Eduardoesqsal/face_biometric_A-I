import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_DIR = PROJECT_ROOT / "backend"
ENV_FILES = [BACKEND_DIR / ".env", PROJECT_ROOT / ".env"]
FACES_DIR = PROJECT_ROOT / "faces"
ATTENDANCE_FILE = PROJECT_ROOT / "attendance.csv"
RESET_ATTENDANCE_ON_STARTUP = os.environ.get("RESET_ATTENDANCE_ON_STARTUP", "1").strip().lower() not in {"0", "false", "no"}


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


for env_file in ENV_FILES:
    _load_env_file(env_file)


SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_URL = SUPABASE_URL.removesuffix("/rest/v1").removesuffix("/auth/v1").removesuffix("/rest/v1/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "").strip()
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
SUPABASE_STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "Faces").strip() or "Faces"

os.environ.setdefault("DEEPFACE_HOME", str(PROJECT_ROOT))

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Solución de continuidad con docker-compose / Render: además de los orígenes de
# desarrollo, se admiten orígenes extra configurables vía CORS_ORIGINS (separados
# por coma). En Render se usa la URL pública del frontend.
_CORS_EXTRA = [
    o.strip()
    for o in os.environ.get("CORS_ORIGINS", "").split(",")
    if o.strip()
]
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    *[o for o in _CORS_EXTRA if o not in {"http://localhost:5173", "http://127.0.0.1:5173"}],
]
