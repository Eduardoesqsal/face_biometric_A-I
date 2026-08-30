from __future__ import annotations

from functools import lru_cache
from tempfile import gettempdir

from ...application.attendance_service import AttendanceService
from ...infrastructure.recognition.deepface_engine import DeepFaceRecognitionEngine
from ...infrastructure.storage.supabase_attendance_repository import SupabaseAttendanceRepository
from ...infrastructure.storage.supabase_client import get_supabase_client
from ...infrastructure.storage.supabase_employee_repository import SupabaseEmployeeRepository


@lru_cache
def get_attendance_service() -> AttendanceService:
    client = get_supabase_client()
    return AttendanceService(
        attendance_repository=SupabaseAttendanceRepository(client),
        face_repository=SupabaseEmployeeRepository(client, gettempdir()),
        recognition_engine=DeepFaceRecognitionEngine(),
    )
