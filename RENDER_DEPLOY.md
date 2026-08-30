# Despliegue en Render — FaceControl

Guía paso a paso para subir el proyecto a [Render](https://render.com) en producción.

> **Render usa `docker-compose`?** No. Render NO soporta `docker-compose.yml`. Cada servicio se crea por separado en el panel de Render. Este proyecto se desplegará con **2 servicios independientes**:
> 1. **Static Site** → el frontend (React + Vite)
> 2. **Web Service (Docker)** → el backend (FastAPI)

---

## 🔑 Antes de empezar

Necesitas a mano estas cosas (están en tu archivo `backend/.env`):

- `SUPABASE_URL` = `https://rjwmmyrbesicrqwijghg.supabase.co/rest/v1/`
- `SUPABASE_ANON_KEY` = (la de tu `.env`)
- `SUPABASE_SERVICE_ROLE_KEY` = (la de tu `.env`)
- `SUPABASE_STORAGE_BUCKET` = `Faces`

Tu `.env` **NO se sube** a GitHub (está en `.gitignore`). Por eso hay que escribir las variables a mano en Render.

---

## ⚠️ REGLA DE ORO DEL ORDEN

**Crea PRIMERO el BACKEND y espera a que se despliegue.**
Después crea el FRONTEND, porque el frontend necesita saber la **URL pública del backend** para funcionar.

La URL del backend se la pones al frontend como `VITE_API_URL` (se inyecta al hacer el build del frontend).

---

## PASO 1 — Crea el BACKEND (Web Service)

1. Entra a [render.com](https://render.com) → inicia sesión (conecta tu cuenta de GitHub).
2. Botón **New** → **Web Service**.
3. **Connect repository** → busca y conecta `Eduardoesqsal/face_biometric_A-I`.
4. Configura así:

| Campo | Valor |
|---|---|
| Name | `facecontrol-backend` |
| Environment | `Docker` |
| **Root Directory** | **`backend`** *(IMPORTANTE: o el build no encuentra `app.main`)* |
| Dockerfile Path | *(déjalo vacío / `Dockerfile`)* |
| Instance Type | `Starter` (ver nota de RAM abajo) |
| Region | la más cercana a ti |

5. Sección **Environment** → agarra **Add Environment Variable** y agrega estas:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://rjwmmyrbesicrqwijghg.supabase.co/rest/v1/` |
| `SUPABASE_ANON_KEY` | tu anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | tu service role key |
| `SUPABASE_STORAGE_BUCKET` | `Faces` |
| `FRONTEND_URL` | *(NO lo llenes aquí todavía; se llena en el Paso 3)* |
| `CORS_ORIGINS` | *(NO lo llenes aquí todavía; se llena en el Paso 3)* |
| `RESET_ATTENDANCE_ON_STARTUP` | `0` |

   > Marca `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` como **secret** (el candadito) para que no se vean en los logs.

6. Botón **Create Web Service**.

7. **Espera** a que termine el build y a que diga **"Live" / "Deployed"** (puede tardar varios minutos).

8. Copia la URL que te da Render, tendrá la forma:
   ```
   https://facecontrol-backend.onrender.com
   ```
   **Guárdala. La vas a necesitar en los pasos siguientes.**

9. **Pruébalo**: abre `https://facecontrol-backend.onrender.com/health` → debe mostrar:
   ```json
   {"status":"ok"}
   ```

> ⚠️ **So`Sobre RAM**: el plan **Free** solo tiene 512 MB y el DeepFace/TensorFlow del reconocimiento facial NO cabe bien ahí (consume demasiada RAM y el proceso se cae). Para que funcione el reconocimiento de rostros usa plan **Starter** o superior. El plan Free solo sirve para probar login/registro.

---

## PASO 2 — Crea el FRONTEND (Static Site)

1. Botón **New** → **Static Site**.
2. **Connect repository** → el mismo `face_biometric_A-I`.
3. Configura así:

| Campo | Valor |
|---|---|
| Name | `facecontrol-frontend` |
| Root Directory | *(déjalo vacío)* |
| Build Command | `pnpm install --frozen-lockfile && pnpm --dir frontend build` |
| Publish Directory | `frontend/dist` |

4. Sección **Environment** (estas son variables de **BUILD**, se usan al compilar) → agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | la URL del backend del Paso 1, ej `https://facecontrol-backend.onrender.com` |

5. Botón **Deploy Static Site** (o **Create**).

6. **Espera** a que termine el build y copia tu URL pública:
   ```
   https://facecontrol-frontend.onrender.com
   ```
   **Guárdala también.**

---

## PASO 3 — Vuelve al BACKEND y completa las URLs (hazlo SIEMPRE)

Ahora que ya sabes la URL del frontend, ve al **backend** en Render y agrega/actualiza 2 variables de entorno:

| Variable | Valor |
|---|---|
| `FRONTEND_URL` | la URL del frontend, ej `https://facecontrol-frontend.onrender.com` |
| `CORS_ORIGINS` | la misma URL del frontend, ej `https://facecontrol-frontend.onrender.com` |

Luego en Render, botón **Manual Deploy** → **Deploy latest commit** para aplicar los cambios.

> Esto es lo que le permite al backend **aceptar peticiones** que vienen del frontend de Render (CORS). Sin esto el navegador bloquea las llamadas al backend.

---

## PASO 4 — Pruebas finales

1. Abre la URL del frontend: `https://facecontrol-frontend.onrender.com`
2. Haz **login** con tu correo/contraseña.
3. **Registra una persona** (nombre + imagen).
4. Prueba el **reconocimiento facial** con la cámara.

Si algo falla, mira las secciones de abajo.

---

## ❓ Preguntas frecuentes / errores comunes

**¿Qué pasa si el login funciona pero al reconocer se cae la app?**
Es RAM. El plan Free no aguanta DeepFace. Sube a Starter o más.

**¿Por qué el navegador me bloquea las peticiones al backend (CORS)?**
Porque `FRONTEND_URL` y `CORS_ORIGINS` no están bien puestos en el backend. Revisa el Paso 3 y asegúrate de usar la URL exacta del frontend, sin barra final `/`.

**¿Necesito poner `VITE_API_URL` con barra final?**
No. Pónlo sin barra: `https://facecontrol-backend.onrender.com`

**¿En qué puerto escucha el backend?**
En el puerto que Render asigna (`$PORT`). El Dockerfile ya está preparado para eso.

**¿Por qué me sale `ERROR: Could not import module "app.main"`?**
Porque el Web Service del backend tiene mal configurado (o vacío) el campo **Root Directory**. Para que el Dockerfile encuentre el código:

1. En el backend Web Service, pon **Root Directory = `backend`** (no lo dejes vacío).
2. En Dockerfile Path deja el campo vacío o pon `Dockerfile` (no `backend/Dockerfile`, porque el root ya es `backend`).
3. Guarda y haz **Manual Deploy → Clear build cache and deploy**.

> Si ya lo tenías vacío/raíz, el build anterior copiaba la carpeta equivocada y uvicorn no encontraba `app.main`.

**¿Qué pasa con `faces/` y `attendance.csv`?**
En Render el disco es temporal (no persistente), pero NO importa: los datos reales están en Supabase.

---

## 🧠 Resumen visual del orden

```
1. CREAR BACKEND  (Web Service Docker)
        ↓  espera a que esté "Live"
        ↓  anota su URL  (https://facecontrol-backend.onrender.com)
2. CREAR FRONTEND  (Static Site)
        ↓  ponle VITE_API_URL = URL del backend
        ↓  anota su URL  (https://facecontrol-frontend.onrender.com)
3. ACTUALIZAR BACKEND
        ↓  poner FRONTEND_URL y CORS_ORIGINS = URL del frontend
        ↓  re-desplegar el backend
4. PROBAR todo
```

**Recuerda la regla: primero el BACKEND, luego el FRONTEND, y al final actualiza el BACKEND con las URLs del frontend.**
