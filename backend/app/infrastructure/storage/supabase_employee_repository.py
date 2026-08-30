from __future__ import annotations

import tempfile
from pathlib import Path

from ...core.config import ALLOWED_IMAGE_EXTENSIONS, SUPABASE_STORAGE_BUCKET
from .supabase_client import SupabaseClient, SupabaseError


class SupabaseEmployeeRepository:
    def __init__(self, client: SupabaseClient, faces_dir: Path | str) -> None:
        self._client = client
        self._faces_dir = Path(faces_dir)
        self._faces_dir.mkdir(parents=True, exist_ok=True)
        self._cache_dir = Path(tempfile.gettempdir()) / "facecontrol_faces_cache"
        self._cache_dir.mkdir(parents=True, exist_ok=True)

    def list_people(self) -> dict[str, Path]:
        rows = self._client.request(
            "GET",
            "employees",
            params={
                "select": "id,name,email,department,position,image_path,active",
                "order": "created_at.desc",
            },
        )

        people: dict[str, Path] = {}
        for row in rows or []:
            if not row.get("active", True):
                continue

            name = (row.get("name") or "").strip()
            image_path = (row.get("image_path") or "").strip()
            if not name or not image_path:
                continue

            local_path = self._ensure_local_copy(image_path, name)
            if local_path:
                people[name] = local_path

        return people

    def save_person(self, display_name: str, filename: str, content: bytes) -> str:
        safe_name = self._slugify(display_name)
        if not safe_name:
            raise ValueError("El nombre no es válido")

        extension = Path(filename or "photo.jpg").suffix.lower()
        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValueError("Usa una imagen JPG, JPEG o PNG")

        object_path = f"{safe_name}{extension}"
        self._client.upload_storage_object(
            SUPABASE_STORAGE_BUCKET,
            object_path,
            content,
            self._content_type_for_extension(extension),
        )

        image_path = f"{SUPABASE_STORAGE_BUCKET}/{object_path}"
        existing = self._client.request(
            "GET",
            "employees",
            params={"select": "id", "name": f"eq.{safe_name}", "limit": "1"},
        )
        payload = {
            "name": safe_name,
            "email": None,
            "department": None,
            "position": None,
            "image_path": image_path,
            "active": True,
        }
        if existing:
            self._client.request("PATCH", "employees", params={"name": f"eq.{safe_name}"}, json=payload)
        else:
            self._client.request("POST", "employees", json=payload)

        self._write_local_copy(object_path, content)
        return safe_name

    def _ensure_local_copy(self, image_path: str, name: str) -> Path | None:
        local_path = self._cache_dir / Path(image_path).name
        if local_path.exists():
            return local_path

        try:
            if "/" in image_path:
                bucket, object_path = image_path.split("/", 1)
            else:
                bucket, object_path = SUPABASE_STORAGE_BUCKET, image_path
            content = self._client.download_storage_object(bucket, object_path)
        except SupabaseError:
            return None

        local_path.write_bytes(content)
        return local_path

    def _write_local_copy(self, filename: str, content: bytes) -> None:
        path = self._cache_dir / filename
        path.write_bytes(content)

    def _content_type_for_extension(self, extension: str) -> str:
        if extension in {".jpg", ".jpeg"}:
            return "image/jpeg"
        if extension == ".png":
            return "image/png"
        return "application/octet-stream"

    def _slugify(self, value: str) -> str:
        import re

        normalized = value.strip()
        normalized = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", normalized)
        normalized = re.sub(r"\s+", " ", normalized)
        normalized = normalized.strip(" .")
        return normalized
