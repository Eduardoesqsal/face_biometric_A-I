from __future__ import annotations

import csv
import threading
from datetime import datetime
from pathlib import Path

from ...domain.models import AttendanceRecord


class CsvAttendanceRepository:
    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path
        self._lock = threading.RLock()
        self._ensure_file()

    def list_records(self) -> list[AttendanceRecord]:
        with self._lock:
            self._ensure_file()
            with self._file_path.open(newline="", encoding="utf-8") as file:
                rows = list(csv.DictReader(file))

        records = [
            AttendanceRecord(
                name=row.get("Nombre", "").strip(),
                timestamp=row.get("Hora", "").strip(),
            )
            for row in rows
            if row.get("Nombre") and row.get("Hora")
        ]
        records.sort(key=lambda item: item.timestamp, reverse=True)
        return records

    def register_attendance(self, name: str) -> tuple[bool, str]:
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

        with self._lock:
            with self._file_path.open("a", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow([name, timestamp])

        return True, timestamp

    def delete_all(self) -> None:
        with self._lock:
            self._ensure_file()
            with self._file_path.open("w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["Nombre", "Hora"])

    def delete_one(self, name: str, timestamp: str) -> bool:
        with self._lock:
            records = self.list_records()
            remaining: list[AttendanceRecord] = []
            removed = False

            for record in records:
                if not removed and record.name == name and record.timestamp == timestamp:
                    removed = True
                    continue
                remaining.append(record)

            if not removed:
                return False

            self._write_records(remaining)
            return True

    def _ensure_file(self) -> None:
        self._file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self._file_path.exists() or self._file_path.stat().st_size == 0:
            self._write_header()

    def _write_records(self, records: list[AttendanceRecord]) -> None:
        with self._file_path.open("w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Nombre", "Hora"])
            for record in records:
                writer.writerow([record.name, record.timestamp])

    def _write_header(self) -> None:
        with self._file_path.open("w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Nombre", "Hora"])
