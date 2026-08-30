# FaceControl

FaceControl es un sistema de control de asistencia biométrica con:

- backend en FastAPI
- frontend en React + TypeScript + Vite
- login con Supabase a través del backend
- almacenamiento de imágenes en Supabase Storage
- registros de asistencia en `public.attendance_records`
- empleados en `public.employees`

## Estructura

```text
face_attendance_system/
├── backend/
│   ├── app/
│   └── .env
├── frontend/
│   └── src/
├── faces/
├── attendance.csv
├── AGENTS.md
└── README.md
```

## Stack

### Backend

- FastAPI
- Pydantic
- Requests
- DeepFace / OpenCV
- Supabase REST y Storage

### Frontend

- React 18
- TypeScript
- Vite
- CSS personalizado

## Flujo de autenticación

1. El usuario entra al login del frontend.
2. El frontend envía `correo + contraseña` al backend.
3. El backend valida contra Supabase Auth.
4. El backend devuelve la sesión.
5. El frontend guarda la sesión y muestra el dashboard.

## Flujo de asistencia

1. El usuario abre la cámara.
2. El frontend captura frames y los manda al backend.
3. El backend compara contra las imágenes registradas.
4. Si reconoce un rostro, guarda la asistencia en `attendance_records`.

## Flujo de registro de persona

1. El usuario sube una foto y escribe un nombre.
2. El frontend envía el archivo al backend.
3. El backend sube la imagen al bucket `Faces`.
4. El backend guarda el nombre y la ruta en `employees`.

## Variables de entorno

### `backend/.env`

```env
SUPABASE_URL=https://<project>.supabase.co/rest/v1/
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=Faces
FRONTEND_URL=http://localhost:5173
RESET_ATTENDANCE_ON_STARTUP=0
```

Importante:

- `SUPABASE_URL` puede incluir `/rest/v1/` en tu archivo actual, pero el backend la normaliza.
- El bucket por defecto es `Faces`.
- `SUPABASE_SERVICE_ROLE_KEY` se usa en backend para Storage y tabla de empleados/asistencias.

## Endpoints

- `GET /health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/attendance`
- `DELETE /api/attendance`
- `POST /api/recognize`
- `POST /api/people`
- `GET /api/people`

## Instalación

### Backend

```powershell
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

La API queda en:

```text
http://127.0.0.1:8000
```

### Frontend

```powershell
pnpm install
pnpm --dir frontend dev
```

La UI queda en:

```text
http://127.0.0.1:5173
```

## Scripts raíz

- `pnpm run dev:web`
- `pnpm run build:web`
- `pnpm run preview:web`

## Notas de implementación

- La fuente de verdad de negocio está en Supabase.
- El backend mantiene una caché temporal local para reconocimiento facial.
- No se debe volver a usar CSV como persistencia principal de asistencias.
- Si cambias credenciales o rutas de Supabase, reinicia el backend.

