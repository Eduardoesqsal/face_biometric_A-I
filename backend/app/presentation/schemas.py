from __future__ import annotations

from pydantic import BaseModel, Field


class AttendanceRecordSchema(BaseModel):
    name: str = Field(..., description="Nombre de la persona")
    timestamp: str = Field(..., description="Fecha y hora de asistencia")


class DashboardResponseSchema(BaseModel):
    records: list[AttendanceRecordSchema]
    today: int
    people: int


class RecognitionResponseSchema(BaseModel):
    recognized: bool
    name: str | None = None
    timestamp: str | None = None
    registered: bool = False
    message: str


class MessageResponseSchema(BaseModel):
    message: str
    people: int | None = None


class PersonSchema(BaseModel):
    name: str
    filename: str
    image_url: str


class PeopleResponseSchema(BaseModel):
    people: list[PersonSchema]
    count: int


class ErrorResponseSchema(BaseModel):
    detail: str


class DeleteAttendanceRequestSchema(BaseModel):
    all: bool = False
    name: str | None = None
    timestamp: str | None = None


class AuthLoginRequestSchema(BaseModel):
    email: str
    password: str


class AuthUserSchema(BaseModel):
    id: str
    email: str | None = None


class AuthSessionSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    user: AuthUserSchema


class AuthLoginResponseSchema(BaseModel):
    session: AuthSessionSchema


class AuthMeResponseSchema(BaseModel):
    authenticated: bool
    user: AuthUserSchema | None = None
