from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class AttendanceRecord:
    name: str
    timestamp: str


@dataclass(frozen=True, slots=True)
class DashboardSummary:
    records: list[AttendanceRecord]
    today: int
    people: int


@dataclass(frozen=True, slots=True)
class RecognitionResult:
    recognized: bool
    name: str | None = None
    timestamp: str | None = None
    registered: bool = False
    message: str = ""

