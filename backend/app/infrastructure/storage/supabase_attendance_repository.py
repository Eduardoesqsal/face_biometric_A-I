from __future__ import annotations

from datetime import date, datetime
from zoneinfo import ZoneInfo

from ...domain.models import AttendanceRecord
from .supabase_client import SupabaseClient


class SupabaseAttendanceRepository:
    def __init__(self, client: SupabaseClient) -> None:
        self._client = client
        self._timezone = ZoneInfo("America/Mexico_City")

    def list_records(self) -> list[AttendanceRecord]:
        rows = self._client.request(
            "GET",
            "attendance_records",
            params={
                "select": "name,timestamp",
                "order": "timestamp.desc",
            },
        )
        records = [
            AttendanceRecord(
                name=(row.get("name") or "").strip(),
                timestamp=self._format_timestamp(row.get("timestamp")),
            )
            for row in rows or []
            if row.get("name") and row.get("timestamp")
        ]
        return records

    def register_attendance(self, name: str) -> tuple[bool, str]:
        employee_rows = self._client.request(
            "GET",
            "employees",
            params={"select": "id,name", "name": f"eq.{name}", "limit": "1"},
        )
        if not employee_rows:
            return False, ""

        employee_id = employee_rows[0]["id"]
        now_local = datetime.now(self._timezone)
        today = now_local.date().isoformat()
        existing = self._client.request(
            "GET",
            "attendance_records",
            params={
                "select": "id,timestamp",
                "employee_id": f"eq.{employee_id}",
                "order": "timestamp.desc",
                "limit": "20",
            },
        )
        for row in existing or []:
            timestamp = self._format_timestamp(row.get("timestamp"))
            if timestamp.startswith(today):
                return False, timestamp

        created = self._client.request(
            "POST",
            "attendance_records",
            json={
                "employee_id": employee_id,
                "name": name,
                "timestamp": now_local.isoformat(),
            },
        )
        row = created[0] if isinstance(created, list) and created else created
        timestamp = (
            self._format_timestamp((row or {}).get("timestamp"))
            if isinstance(row, dict)
            else now_local.strftime("%Y-%m-%d %H:%M:%S")
        )
        return True, timestamp

    def delete_all(self) -> None:
        self._client.request("DELETE", "attendance_records", params={"id": "not.is.null"})

    def delete_one(self, name: str, timestamp: str) -> bool:
        rows = self._client.request(
            "GET",
            "attendance_records",
            params={
                "select": "id,name,timestamp",
                "name": f"eq.{name}",
                "order": "timestamp.desc",
                "limit": "50",
            },
        )
        target = self._normalize_timestamp(timestamp)
        for row in rows or []:
            if self._normalize_timestamp(row.get("timestamp")) == target:
                record_id = row["id"]
                self._client.request("DELETE", "attendance_records", params={"id": f"eq.{record_id}"})
                return True
        return False

    def _format_timestamp(self, value: str | None) -> str:
        if not value:
            return ""
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=self._timezone)
            return parsed.astimezone(self._timezone).strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            return value

    def _normalize_timestamp(self, value: str | None) -> str:
        if not value:
            return ""
        return self._format_timestamp(value)
