from __future__ import annotations

import re
from pathlib import Path

from ...core.config import ALLOWED_IMAGE_EXTENSIONS


class LocalFaceRepository:
    def __init__(self, faces_dir: Path) -> None:
        self._faces_dir = faces_dir
        self._faces_dir.mkdir(parents=True, exist_ok=True)

    def list_people(self) -> dict[str, Path]:
        people: dict[str, Path] = {}
        for image in self._faces_dir.iterdir():
            if image.is_file() and image.suffix.lower() in ALLOWED_IMAGE_EXTENSIONS:
                people[image.stem] = image
        return people

    def save_person(self, display_name: str, filename: str, content: bytes) -> str:
        safe_name = self._slugify(display_name)
        if not safe_name:
            raise ValueError("El nombre no es válido")

        extension = Path(filename or "photo.jpg").suffix.lower()
        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValueError("Usa una imagen JPG, JPEG o PNG")

        destination = self._faces_dir / f"{safe_name}{extension}"
        destination.write_bytes(content)
        return safe_name

    def _slugify(self, value: str) -> str:
        normalized = value.strip()
        normalized = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", normalized)
        normalized = re.sub(r"\s+", " ", normalized)
        normalized = normalized.strip(" .")
        return normalized
