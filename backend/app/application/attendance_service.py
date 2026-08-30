from __future__ import annotations

import tempfile
from datetime import datetime
from pathlib import Path

from ..domain.models import DashboardSummary, RecognitionResult
from ..domain.ports import AttendanceRepository, FaceRepository, RecognitionEngine


class AttendanceService:
    def __init__(
        self,
        attendance_repository: AttendanceRepository,
        face_repository: FaceRepository,
        recognition_engine: RecognitionEngine,
    ) -> None:
        self._attendance_repository = attendance_repository
        self._face_repository = face_repository
        self._recognition_engine = recognition_engine

    def get_dashboard_summary(self) -> DashboardSummary:
        records = self._attendance_repository.list_records()
        today = datetime.now().strftime("%Y-%m-%d")
        today_count = sum(record.timestamp.startswith(today) for record in records)
        people_count = len(self._face_repository.list_people())
        return DashboardSummary(records=records, today=today_count, people=people_count)

    def list_people(self) -> list[dict[str, str]]:
        people = self._face_repository.list_people()
        return [
            {"name": name, "filename": image.name}
            for name, image in people.items()
        ]

    def add_person(self, display_name: str, filename: str, content: bytes) -> tuple[str, int]:
        saved_name = self._face_repository.save_person(display_name, filename, content)
        people_count = len(self._face_repository.list_people())
        return saved_name, people_count

    def recognize(self, content: bytes) -> RecognitionResult:
        people = self._face_repository.list_people()
        if not people:
            return RecognitionResult(recognized=False, message="No hay personas registradas")

        temp_path = self._write_temp_image(content)
        try:
            matched_name = self._match_face(people, temp_path)
            if not matched_name:
                return RecognitionResult(recognized=False, message="Rostro no reconocido")

            registered, timestamp = self._attendance_repository.register_attendance(matched_name)
            message = "Asistencia registrada" if registered else "Ya registraste asistencia hoy"
            return RecognitionResult(
                recognized=True,
                name=matched_name,
                timestamp=timestamp,
                registered=registered,
                message=message,
            )
        finally:
            temp_path.unlink(missing_ok=True)

    def delete_attendance(self, delete_all: bool, name: str | None, timestamp: str | None) -> None:
        if delete_all:
            self._attendance_repository.delete_all()
            return

        if not name or not timestamp:
            raise ValueError("Indica el registro que deseas borrar")

        deleted = self._attendance_repository.delete_one(name, timestamp)
        if not deleted:
            raise LookupError("Registro no encontrado")

    def _match_face(self, people: dict[str, Path], probe_image: Path) -> str | None:
        for name, reference_image in people.items():
            if self._recognition_engine.verify(reference_image, probe_image):
                return name
        return None

    def _write_temp_image(self, content: bytes) -> Path:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(content)
            return Path(temp_file.name)

