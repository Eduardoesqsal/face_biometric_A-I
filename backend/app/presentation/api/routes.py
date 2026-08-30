from __future__ import annotations

import requests
from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile

from ...application.attendance_service import AttendanceService
from ...core.config import SUPABASE_ANON_KEY, SUPABASE_URL
from ..api.dependencies import get_attendance_service
from ..schemas import (
    AuthLoginRequestSchema,
    AuthLoginResponseSchema,
    AuthMeResponseSchema,
    AuthSessionSchema,
    AuthUserSchema,
    DashboardResponseSchema,
    DeleteAttendanceRequestSchema,
    MessageResponseSchema,
    PeopleResponseSchema,
    PersonSchema,
    RecognitionResponseSchema,
)
from ...infrastructure.storage.supabase_client import SupabaseError

router = APIRouter(prefix="/api", tags=["attendance"])


def _require_supabase() -> None:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise HTTPException(status_code=500, detail="Supabase no está configurado en el backend")


def _auth_headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _map_user(payload: dict) -> AuthUserSchema:
    return AuthUserSchema(
        id=str(payload.get("id", "")),
        email=payload.get("email"),
    )


@router.post("/auth/login", response_model=AuthLoginResponseSchema)
def auth_login(payload: AuthLoginRequestSchema) -> AuthLoginResponseSchema:
    _require_supabase()

    try:
        response = requests.post(
            f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json={"email": payload.email, "password": payload.password},
            timeout=20,
        )
    except requests.RequestException as error:
        raise HTTPException(status_code=502, detail=f"No fue posible contactar Supabase: {error}") from error

    try:
        data = response.json()
    except ValueError as error:
        raise HTTPException(status_code=502, detail=f"Respuesta inválida de Supabase ({response.status_code})") from error

    if not response.ok:
        detail = data.get("error_description") or data.get("msg") or data.get("error") or "No se pudo iniciar sesión"
        raise HTTPException(status_code=response.status_code, detail=detail)

    session = AuthSessionSchema(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        token_type=data.get("token_type", "bearer"),
        expires_in=int(data.get("expires_in", 0)),
        user=_map_user(data.get("user", {})),
    )
    return AuthLoginResponseSchema(session=session)


@router.get("/auth/me", response_model=AuthMeResponseSchema)
def auth_me(authorization: str | None = Header(default=None)) -> AuthMeResponseSchema:
    _require_supabase()

    if not authorization:
        raise HTTPException(status_code=401, detail="No autenticado")

    token = authorization.replace("Bearer ", "", 1).strip()

    try:
        response = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
            },
            timeout=20,
        )
    except requests.RequestException as error:
        raise HTTPException(status_code=502, detail=f"No fue posible validar la sesión: {error}") from error

    if not response.ok:
        raise HTTPException(status_code=401, detail="Sesión inválida")

    try:
        payload = response.json()
    except ValueError as error:
        raise HTTPException(status_code=502, detail="Respuesta inválida al validar la sesión") from error

    return AuthMeResponseSchema(authenticated=True, user=_map_user(payload))


@router.post("/auth/logout", response_model=MessageResponseSchema)
def auth_logout() -> MessageResponseSchema:
    return MessageResponseSchema(message="Sesión cerrada")


@router.get("/attendance", response_model=DashboardResponseSchema)
def get_attendance(service: AttendanceService = Depends(get_attendance_service)) -> DashboardResponseSchema:
    summary = service.get_dashboard_summary()
    return DashboardResponseSchema(
        records=[{"name": record.name, "timestamp": record.timestamp} for record in summary.records],
        today=summary.today,
        people=summary.people,
    )


@router.delete("/attendance", response_model=MessageResponseSchema)
def delete_attendance(
    payload: DeleteAttendanceRequestSchema,
    service: AttendanceService = Depends(get_attendance_service),
) -> MessageResponseSchema:
    try:
        service.delete_attendance(payload.all, payload.name, payload.timestamp)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return MessageResponseSchema(message="Registros actualizados")


@router.post("/recognize", response_model=RecognitionResponseSchema)
async def recognize(
    image: UploadFile = File(...),
    service: AttendanceService = Depends(get_attendance_service),
) -> RecognitionResponseSchema:
    try:
        content = await image.read()
        result = service.recognize(content)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return RecognitionResponseSchema(
        recognized=result.recognized,
        name=result.name,
        timestamp=result.timestamp,
        registered=result.registered,
        message=result.message,
    )


@router.post("/people", response_model=MessageResponseSchema)
async def add_person(
    name: str = Form(...),
    image: UploadFile = File(...),
    service: AttendanceService = Depends(get_attendance_service),
) -> MessageResponseSchema:
    try:
        content = await image.read()
        saved_name, people_count = service.add_person(name, image.filename or "photo.jpg", content)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except SupabaseError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    return MessageResponseSchema(
        message=f"{saved_name} fue agregado",
        people=people_count,
    )


@router.get("/people", response_model=PeopleResponseSchema)
def list_people(service: AttendanceService = Depends(get_attendance_service)) -> PeopleResponseSchema:
    people = service.list_people()
    return PeopleResponseSchema(
        people=[
            PersonSchema(name=item["name"], filename=item["filename"], image_url=f"/faces/{item['filename']}")
            for item in people
        ],
        count=len(people),
    )
