from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import requests

from ...core.config import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, SUPABASE_STORAGE_BUCKET


class SupabaseError(RuntimeError):
    pass


@dataclass(slots=True)
class SupabaseClient:
    base_url: str
    service_role_key: str
    timeout: int = 20

    def _headers(self) -> dict[str, str]:
        return {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Prefer": "return=representation",
        }

    def request(self, method: str, path: str, *, params: dict[str, Any] | None = None, json: Any = None) -> Any:
        if not self.base_url or not self.service_role_key:
            raise SupabaseError("Supabase no está configurado en el backend")

        url = f"{self.base_url}/rest/v1/{path.lstrip('/')}"
        try:
            response = requests.request(
                method,
                url,
                headers=self._headers(),
                params=params,
                json=json,
                timeout=self.timeout,
            )
        except requests.RequestException as error:
            raise SupabaseError(f"No fue posible contactar Supabase: {error}") from error

        if not response.ok:
            raise SupabaseError(response.text.strip() or f"Supabase respondió {response.status_code}")

        if response.status_code == 204:
            return None

        try:
            return response.json()
        except ValueError:
            return None

    def upload_storage_object(self, bucket: str, object_path: str, content: bytes, content_type: str) -> None:
        if not self.base_url or not self.service_role_key:
            raise SupabaseError("Supabase no está configurado en el backend")

        url = f"{self.base_url}/storage/v1/object/{bucket}/{object_path.lstrip('/')}"
        try:
            response = requests.post(
                url,
                headers={
                    "apikey": self.service_role_key,
                    "Authorization": f"Bearer {self.service_role_key}",
                    "Content-Type": content_type,
                    "x-upsert": "true",
                },
                data=content,
                timeout=self.timeout,
            )
        except requests.RequestException as error:
            raise SupabaseError(f"No fue posible subir el archivo: {error}") from error

        if not response.ok:
            raise SupabaseError(response.text.strip() or f"Supabase respondió {response.status_code}")

    def download_storage_object(self, bucket: str, object_path: str) -> bytes:
        if not self.base_url or not self.service_role_key:
            raise SupabaseError("Supabase no está configurado en el backend")

        url = f"{self.base_url}/storage/v1/object/{bucket}/{object_path.lstrip('/')}"
        try:
            response = requests.get(
                url,
                headers={
                    "apikey": self.service_role_key,
                    "Authorization": f"Bearer {self.service_role_key}",
                },
                timeout=self.timeout,
            )
        except requests.RequestException as error:
            raise SupabaseError(f"No fue posible descargar el archivo: {error}") from error

        if not response.ok:
            raise SupabaseError(response.text.strip() or f"Supabase respondió {response.status_code}")

        return response.content


def get_supabase_client() -> SupabaseClient:
    return SupabaseClient(base_url=SUPABASE_URL, service_role_key=SUPABASE_SERVICE_ROLE_KEY)
