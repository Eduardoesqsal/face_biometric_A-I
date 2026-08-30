# AGENTS.md - FaceControl

## Rol
Actúa como Senior Frontend Engineer + UI/UX Engineer con foco en dashboards empresariales, SaaS oscuro y aplicaciones responsive.

Tu prioridad es mantener una interfaz profesional, clara y consistente con FaceControl. La pantalla de login debe verse refinada, seria y bien compuesta.

## Contexto del proyecto

- `backend/` contiene la API FastAPI.
- `frontend/` contiene la interfaz React + TypeScript + Vite.
- Supabase es la base del sistema.
- La persistencia principal de negocio está en:
  - `public.employees`
  - `public.attendance_records`
- Las imágenes se suben a Supabase Storage en el bucket `Faces`.
- El backend mantiene solo caché temporal para comparar rostros con DeepFace.

## Flujo actual

### Login
1. El usuario escribe correo y contraseña.
2. El frontend envía la solicitud al backend.
3. El backend valida credenciales con Supabase Auth.
4. El frontend guarda sesión y habilita la app.

### Registro de persona
1. El usuario escribe nombre y sube imagen.
2. El backend sube la imagen a Supabase Storage.
3. El backend guarda el nombre y `image_path` en `employees`.

### Reconocimiento
1. El frontend activa la cámara manualmente.
2. El backend compara el frame con las imágenes registradas.
3. Si reconoce el rostro, inserta la asistencia en `attendance_records`.

## Reglas de UI

- El login debe verse intencional, no genérico.
- Usar iconos pequeños y discretos.
- Los campos `email`, `password` y el botón `Ingresar` deben tener jerarquía clara.
- Los pasos 1, 2, 3 deben presentarse como chips o bloques compactos con iconos pequeños.
- Mantén el tema oscuro profesional.
- Evita saturación visual, efectos llamativos y glassmorphism exagerado.

## Reglas de implementación

- No inventes endpoints.
- Revisa el backend antes de conectar servicios.
- No agregues dependencias innecesarias.
- Usa componentes reutilizables.
- Mantén TypeScript estricto.
- Centraliza datos mock cuando no haya API real.
- No rompas el responsive.

## Archivos clave

- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/presentation/api/routes.py`
- `backend/app/presentation/api/dependencies.py`
- `backend/app/infrastructure/storage/supabase_client.py`
- `backend/app/infrastructure/storage/supabase_employee_repository.py`
- `backend/app/infrastructure/storage/supabase_attendance_repository.py`
- `frontend/src/App.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/LiveRegister.tsx`
- `frontend/src/application/auth/AuthContext.tsx`
- `frontend/src/application/hooks/useCameraRecognition.ts`
- `frontend/src/styles/facecontrol.css`

## Variables de entorno

### Backend

```env
SUPABASE_URL=https://<project>.supabase.co/rest/v1/
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=Faces
FRONTEND_URL=http://localhost:5173
RESET_ATTENDANCE_ON_STARTUP=0
```

### Importante

- `SUPABASE_URL` se normaliza en backend.
- El bucket por defecto debe ser `Faces`.
- El backend debe ser reiniciado tras cambios en `.env`.

## Validación

Cuando sea posible:

- ejecuta `pnpm --dir frontend build`
- corrige errores de TypeScript
- verifica imports y rutas
- revisa responsive en desktop y mobile

## Criterio de calidad

Un cambio es correcto si:

- respeta la arquitectura existente
- mejora la claridad visual
- mantiene el flujo backend-first
- usa Supabase para datos reales
- conserva reconocimiento facial funcional
- no degrada el rendimiento de la interfaz

## Estado visual implementado

- El login utiliza `frontend/src/assets/face.png` como portada biometrica.
- La imagen usa un recorte circular perfecto con `aspect-ratio: 1 / 1`.
- En pantallas grandes (`min-width: 1100px`) la pantalla se divide en dos mitades: imagen a la izquierda y formulario a la derecha.
- En telefonos la composicion es vertical: marca superior, imagen circular y formulario debajo.
- `FaceControl` y `Control de Asistencia` estan separados de los titulos del formulario para evitar solapamientos.
- La paleta usa grafito, grises neutros y verde pastel biometrico; no se usa azul como acento principal.
- La interfaz general fue refinada en `frontend/src/styles/facecontrol.css` para sidebar, dashboard, cards, tablas, formularios, camara y estados.
- `frontend/src/pages/Login.tsx` solo contiene ajustes estructurales visuales de la marca; no se modificaron estados, eventos, autenticacion ni peticiones.

## Validacion frontend

Usar unicamente `pnpm`; `npm` esta prohibido para este proyecto.

```bash
pnpm --dir frontend dev
pnpm --dir frontend build
```

El ultimo build validado fue correcto con Vite.
