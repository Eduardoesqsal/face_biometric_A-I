from __future__ import annotations

from pathlib import Path
from typing import Protocol

from .models import AttendanceRecord


class AttendanceRepository(Protocol):
    def list_records(self) -> list[AttendanceRecord]:
        ...

    def register_attendance(self, name: str) -> tuple[bool, str]:
        ...

    def delete_all(self) -> None:
        ...

    def delete_one(self, name: str, timestamp: str) -> bool:
        ...


class FaceRepository(Protocol):
    def list_people(self) -> dict[str, Path]:
        ...

    def save_person(self, display_name: str, filename: str, content: bytes) -> str:
        ...


class RecognitionEngine(Protocol):
    def verify(self, reference_image: Path, probe_image: Path) -> bool:
        ...

