# UI/UX Design System --- Biometric Attendance Platform

## ⚠️ REGLA CRÍTICA --- SOLO CAMBIOS VISUALES

Este trabajo consiste **EXCLUSIVAMENTE en rediseñar y mejorar la
interfaz visual (UI/UX)** de la plataforma existente.

**NO MODIFICAR LA LÓGICA EXISTENTE.**

La aplicación ya funciona y su funcionalidad debe permanecer exactamente
igual.

### Está estrictamente prohibido modificar:

-   Backend.
-   APIs y endpoints.
-   Base de datos.
-   Autenticación y autorización.
-   Roles y permisos.
-   Reconocimiento, detección o identificación facial.
-   Algoritmos de biometría.
-   Registro de asistencia.
-   Cálculos de horarios.
-   Procesamiento de imágenes.
-   Subida de imágenes.
-   Manejo de cámara.
-   Peticiones HTTP/WebSockets.
-   Funciones, hooks, contextos o servicios existentes.
-   Estructura de datos.
-   Rutas funcionales.
-   Integraciones existentes.
-   Flujo de funcionamiento.

**NO reconstruir la aplicación.** **NO cambiar la arquitectura.** **NO
reemplazar funcionalidades.** **NO crear lógica nueva para sustituir la
existente.**

### Qué SÍ se puede modificar

Únicamente aspectos de presentación:

-   Colores.
-   Fondos.
-   Tipografías.
-   Tamaños de texto.
-   Espaciado.
-   Márgenes y padding.
-   Bordes y border-radius.
-   Sombras.
-   Cards.
-   Botones.
-   Inputs.
-   Tablas.
-   Sidebar.
-   Navbar.
-   Iconos.
-   Layout visual.
-   Grid/Flexbox.
-   Responsive visual.
-   Animaciones y transiciones.
-   Hover y focus.
-   Loading visual.
-   Badges.
-   Indicadores visuales.
-   Apariencia de la cámara.
-   Overlay visual del reconocimiento facial.
-   Marco ovalado del rostro.
-   Landmarks y línea de escaneo como elementos visuales.

Si un componente ya existe y funciona, **conservar su lógica, props,
eventos y comportamiento** y modificar únicamente su apariencia.

> **La misma aplicación que ya funciona debe verse mucho más
> profesional. El objetivo NO es reprogramarla; el objetivo es
> rediseñarla visualmente.**

------------------------------------------------------------------------

# Objetivo

Diseñar una interfaz web profesional para una plataforma de **control de
asistencia mediante reconocimiento facial**.

La interfaz debe transmitir:

-   Tecnología
-   Seguridad
-   Precisión
-   Confianza
-   Modernidad
-   Elegancia
-   Simplicidad

El resultado debe parecer un **producto SaaS profesional**, no una
plantilla genérica de administración.

La referencia visual es una interfaz moderna de tecnología biométrica,
minimalista, sofisticada y orientada a sistemas empresariales.

------------------------------------------------------------------------

# 1. Dirección visual

## Tema

Utilizar exclusivamente un **modo oscuro elegante**.

No implementar Light Mode.

La interfaz debe utilizar principalmente:

-   Gris plomo.
-   Gris grafito medio.
-   Gris carbón.
-   Blanco.
-   Grises claros.

### Importante

**NO utilizar azul como color principal ni como color de acento.**

Evitar completamente interfaces con apariencia azulada.

El gris debe sentirse **neutral**, no azul.

------------------------------------------------------------------------

# 2. Paleta de colores

Utilizar una paleta similar a:

``` text
Background principal:
#34383C

Background secundario:
#2C3034

Sidebar:
#292D31

Cards:
#3A3F43

Cards elevadas:
#41464A

Inputs:
#303438

Border:
#555B60

Texto principal:
#F5F5F5

Texto secundario:
#C5C8CA

Texto terciario:
#92979B

Blanco:
#FFFFFF
```

## Acento

Utilizar un acento muy discreto para estados importantes:

``` text
Success:
#A8C7A0
```

El verde debe ser **apagado, elegante y ligeramente pastel**.

No utilizar verde neón.

No utilizar cyan brillante.

No utilizar azul.

------------------------------------------------------------------------

# 3. Principios de diseño

La interfaz debe seguir estos principios:

1.  Minimalismo.
2.  Mucho espacio visual.
3.  Jerarquía clara.
4.  Bordes suaves.
5.  Cards con profundidad sutil.
6.  Tipografía limpia.
7.  Iconografía consistente.
8.  Animaciones discretas.
9.  Información fácil de interpretar.
10. Apariencia premium.

Evitar:

-   Gradientes exagerados.
-   Sombras excesivas.
-   Colores saturados.
-   Elementos innecesarios.
-   Cards excesivamente redondeadas.
-   Interfaces recargadas.
-   Estética gamer.
-   Neon.
-   Azul tecnológico.
-   Glassmorphism exagerado.

------------------------------------------------------------------------

# 4. Tipografía

Utilizar preferentemente:

``` text
Inter
```

Alternativamente:

``` text
Sora
```

Jerarquía:

``` text
Título:
28–32px / semibold

Título de sección:
18–20px / semibold

Texto:
14–16px / regular

Texto secundario:
12–14px / regular
```

------------------------------------------------------------------------

# 5. Layout general

La aplicación debe utilizar una estructura SaaS administrativa:

``` text
┌──────────────────────────────────────────────────────┐
│ Sidebar │              Top Bar                       │
│         ├────────────────────────────────────────────┤
│         │                                            │
│         │              Main Content                  │
│         │                                            │
│         │                                            │
└─────────┴────────────────────────────────────────────┘
```

## Sidebar

Sidebar vertical fija.

Debe contener:

-   Logo.
-   Dashboard.
-   Empleados.
-   Asistencia.
-   Cámara.
-   Registros.
-   Reportes.
-   Configuración.

En la parte inferior:

-   Avatar.
-   Nombre del usuario.
-   Rol.
-   Cerrar sesión.

El elemento seleccionado debe tener un fondo ligeramente más claro que
el resto.

------------------------------------------------------------------------

# 6. Login

El login debe ser una de las pantallas visualmente más importantes.

No crear un login blanco.

Debe utilizar fondo gris plomo/grafito.

## Composición

Dividir visualmente la pantalla en dos zonas.

### Zona izquierda

Mostrar una representación tecnológica de un rostro humano.

El rostro debe parecer un **mapeo facial biométrico**.

Debe incluir:

-   Contorno del rostro.
-   Puntos de referencia facial.
-   Líneas conectando puntos.
-   Mesh facial.
-   Elementos de escaneo.
-   Marco de reconocimiento.

La representación debe parecer una visualización tecnológica de:

``` text
Face Mapping
Facial Landmarks
Face Recognition
Biometric Scan
```

No utilizar una fotografía convencional como elemento principal.

### Zona derecha

Card de login:

``` text
Bienvenido

Inicia sesión para continuar

[ Usuario o correo ]

[ Contraseña ]

☐ Recordarme

¿Olvidaste tu contraseña?

[ Iniciar sesión ]
```

El botón principal debe tener alto contraste sin introducir colores
saturados.

------------------------------------------------------------------------

# 7. Visualización facial del Login

Este elemento es especialmente importante.

Crear una animación visual sutil simulando:

``` text
Escaneo facial
        ↓
Detección de landmarks
        ↓
Mapeo facial
        ↓
Reconocimiento
```

La animación puede incluir:

-   Línea de escaneo vertical.
-   Puntos faciales apareciendo.
-   Líneas conectándose.
-   Contorno facial.
-   Pulso suave.
-   Indicador de procesamiento.

Debe ser elegante y lento.

Nunca utilizar animaciones exageradas.

**Importante:** esta animación es únicamente visual. No debe crear ni
modificar ninguna lógica de reconocimiento existente.

------------------------------------------------------------------------

# 8. Dashboard

Después del login, mostrar el Dashboard.

Debe proporcionar información inmediata sobre el estado de asistencia.

## Header

``` text
Dashboard

[Notificaciones] [Avatar] [Usuario]
```

------------------------------------------------------------------------

# 9. Métricas principales

Mostrar cards superiores.

Ejemplo:

``` text
Empleados
58
Total registrados
```

``` text
Asistencias hoy
36
Registros exitosos
```

``` text
Hora actual
08:45 AM
```

``` text
Asistencia
96%
Promedio mensual
```

Las cards deben ser compactas, elegantes y fáciles de leer.

**Conservar los datos reales y la lógica existente.**

------------------------------------------------------------------------

# 10. Registro de asistencia en tiempo real

Crear una card grande para la cámara:

``` text
Registro de asistencia en tiempo real
```

Dentro:

-   Imagen/cámara.
-   Rostro detectado.
-   Contorno facial.
-   Indicadores biométricos.
-   Estado del reconocimiento.
-   Nombre identificado.
-   Hora.

Ejemplo visual:

``` text
✓ Asistencia registrada

Juan Pérez

08:45:32 AM

Entrada
```

No modificar la lógica que determina estos estados.

------------------------------------------------------------------------

# 11. Marco facial

## IMPORTANTE

El área de identificación facial **NO debe utilizar un cuadro cuadrado
como elemento principal**.

Debe utilizar un:

## ÓVALO VERTICAL

El óvalo debe rodear la cabeza y el rostro.

Debe sentirse como un sistema biométrico real.

Puede tener:

-   Línea fina.
-   Glow extremadamente sutil.
-   Indicadores de detección.
-   Puntos faciales.
-   Línea horizontal de escaneo.

No modificar el algoritmo de detección; solamente cambiar su
representación visual.

------------------------------------------------------------------------

# 12. Pantalla de Cámara

Crear una sección específica:

``` text
Cámara / Registrar asistencia
```

La cámara debe ocupar la mayor parte de la pantalla.

## Centro

Mostrar el rostro de la persona.

El sistema debe mostrar visualmente estados como:

``` text
Rostro detectado
```

``` text
Buscando rostro...
```

``` text
Identificando...
```

``` text
Asistencia registrada
```

Los estados deben conectarse a los estados reales ya existentes; **no
crear una nueva lógica para ellos**.

------------------------------------------------------------------------

# 13. Registro biométrico de empleados

Crear un flujo visual de registro dividido en pasos:

``` text
1 Información
      ↓
2 Captura facial
      ↓
3 Confirmar
```

## Información personal

Campos:

``` text
Nombre completo
Correo electrónico
Departamento
Puesto
```

Botón:

``` text
Siguiente
```

Mantener intactos los formularios y su lógica existente.

------------------------------------------------------------------------

# 14. Captura facial

La segunda etapa debe permitir registrar el rostro.

Mostrar:

``` text
Captura facial

Asegúrate de estar en un lugar
bien iluminado y sin accesorios.
```

Mostrar una guía visual **ovalada** para posicionar el rostro.

El sistema puede mostrar visualmente:

-   Subir imágenes.
-   Capturar mediante cámara.
-   Registrar múltiples ángulos.

Ángulos recomendados:

``` text
Frontal
Izquierda
Derecha
Ligera inclinación
```

La funcionalidad existente debe permanecer intacta.

------------------------------------------------------------------------

# 15. Panel de carga de imágenes

Crear o rediseñar visualmente un componente Drag & Drop:

``` text
Subir imágenes

Arrastra y suelta o haz clic para seleccionar

Formatos: JPG, PNG
```

Mostrar miniaturas de las imágenes cargadas.

Cada imagen puede mostrar visualmente:

-   Vista previa.
-   Eliminar.
-   Reemplazar.

No cambiar el mecanismo existente de subida.

------------------------------------------------------------------------

# 16. Cámara durante registro

Cuando el usuario registre el rostro mediante cámara:

Mostrar:

``` text
Posiciona tu rostro dentro del área
```

Utilizar nuevamente el **marco ovalado**.

Mostrar indicadores visuales como:

``` text
Rostro detectado
Distancia adecuada
Buena iluminación
```

Estos indicadores deben representar los estados que ya existan; no
implementar lógica biométrica nueva.

------------------------------------------------------------------------

# 17. Actividad reciente

En el Dashboard mostrar una lista de registros:

``` text
Actividad reciente

Juan Pérez       Entrada    08:45 AM
María López      Entrada    08:42 AM
Carlos Ramírez   Entrada    08:41 AM
Ana Martínez     Salida     06:15 PM
Luis García      Salida     06:10 PM
```

Utilizar:

-   Avatar.
-   Nombre.
-   Tipo de registro.
-   Hora.
-   Indicador de estado.

Los datos deben provenir de la lógica existente.

------------------------------------------------------------------------

# 18. Estados biométricos

Representar visualmente estados como:

### Buscando

``` text
○ Buscando rostro...
```

### Detectado

``` text
● Rostro detectado
```

### Identificando

``` text
◌ Identificando...
```

### Reconocido

``` text
✓ Juan Pérez identificado
```

### Asistencia

``` text
✓ Asistencia registrada
08:45:32 AM
```

Estos son únicamente ejemplos de presentación. Mantener los estados
funcionales actuales.

------------------------------------------------------------------------

# 19. Microinteracciones

Agregar animaciones pequeñas y profesionales:

-   Hover en botones.
-   Transiciones de sidebar.
-   Aparición suave de cards.
-   Escaneo facial visual.
-   Puntos faciales animados.
-   Cambio visual de estado.
-   Indicador de cámara online.
-   Feedback visual al registrar asistencia.

Duración aproximada:

``` text
150–300ms
```

Las animaciones deben sentirse naturales.

------------------------------------------------------------------------

# 20. Cámara online

Mostrar un indicador discreto:

``` text
● En línea
```

No utilizar un círculo verde brillante.

Utilizar un verde pastel/desaturado.

------------------------------------------------------------------------

# 21. Responsive Design

La plataforma debe funcionar correctamente en:

-   Desktop.
-   Laptop.
-   Tablet.

Prioridad:

``` text
Desktop > Tablet > Mobile
```

El Dashboard debe mantener una buena jerarquía incluso cuando el espacio
sea reducido.

------------------------------------------------------------------------

# 22. Componentes reutilizables

Crear o estilizar componentes consistentes para:

``` text
Button
Input
Card
Modal
Sidebar
TopBar
Avatar
Badge
StatusIndicator
FaceScanner
FaceDetectionOverlay
CameraPreview
EmployeeCard
AttendanceRecord
MetricCard
UploadZone
Stepper
Table
Toast
```

Si estos componentes ya existen, **no reemplazar su lógica**.
Reutilizarlos y aplicarles el nuevo sistema visual.

------------------------------------------------------------------------

# 23. FaceScanner

Crear o estilizar visualmente un componente reutilizable:

``` text
<FaceScanner />
```

Puede representar visualmente estados como:

``` text
detecting
scanning
recognized
error
```

Puede tener opciones visuales como:

``` text
showLandmarks
showScanLine
showOval
showStatus
```

El contenedor facial debe utilizar una **forma ovalada vertical**.

**No modificar la lógica interna del reconocimiento facial existente.**

------------------------------------------------------------------------

# 24. Experiencia general

La aplicación debe sentirse como un producto de:

``` text
Biometría
+
Software empresarial
+
Inteligencia artificial
+
Seguridad
```

No debe parecer:

``` text
Admin template genérico
```

La estética debe ser moderna, premium, minimalista y tecnológica sin
exagerar.

------------------------------------------------------------------------

# 25. Regla fundamental de diseño

Si existe conflicto entre agregar más elementos y mantener la interfaz
limpia:

**Priorizar siempre la simplicidad.**

Si existe conflicto entre utilizar un color llamativo y mantener una
apariencia profesional:

**Priorizar siempre los tonos grises, blancos y neutros.**

Si existe conflicto entre utilizar un marco cuadrado o un elemento
ovalado para el reconocimiento facial:

**Utilizar siempre el óvalo para representar la identificación del
rostro.**

Si existe conflicto entre un diseño claro y uno excesivamente
tecnológico:

**Elegir el diseño tecnológico pero sobrio.**

------------------------------------------------------------------------

# 27. Implementacion visual vigente

La version actual del frontend aplica este cierre visual al login y a la
interfaz general:

## Portada del login

- Usar `frontend/src/assets/face.png` como imagen biometrica principal.
- Mostrar la imagen en un recorte circular perfecto, nunca como una card
  rectangular.
- Mantener la imagen centrada dentro de la mitad izquierda en pantallas
  grandes.
- Usar el panel derecho exclusivamente para el formulario de acceso.
- En desktop grande, dividir la pantalla en `50% / 50%`.
- En movil, ordenar la pantalla verticalmente: marca superior, imagen y
  formulario debajo.
- En movil, el formulario debe conservar un margen amplio respecto a la
  imagen para que sus titulos no se encimen.

## Marca y jerarquia

- `FaceControl` y `Control de Asistencia` deben vivir en una franja
  superior independiente de los titulos del formulario.
- Mantener espacio visible entre `AI BIOMETRIC ACCESS`, `Iniciar sesion`,
  `Usa tus credenciales autorizadas.` y `Correo electronico`.
- El isotipo debe ser discreto, circular y translucido, integrado con el
  fondo grafito.

## Sistema general aplicado

- Fondo grafito neutral, superficies gris carbon y tarjetas sobrias.
- Verde pastel desaturado para estados biometricos y activos.
- Bordes finos, sombras minimas y radios moderados.
- Sidebar, dashboard, tablas, formularios, estados y camara comparten el
  mismo lenguaje visual.
- No usar azul dominante, neon, glassmorphism excesivo ni decoracion
  innecesaria.

## Restriccion tecnica

Estos cambios pertenecen unicamente a presentacion. No modificar
autenticacion, servicios, endpoints, camara, reconocimiento facial,
peticiones HTTP, datos ni flujo de negocio.

La validacion del frontend debe ejecutarse con:

```bash
pnpm run build
```

------------------------------------------------------------------------

# 26. Resultado esperado

El resultado final debe parecer una plataforma real de control de
asistencia empresarial.

Debe transmitir inmediatamente:

> "Este sistema utiliza reconocimiento facial para identificar empleados
> y registrar automáticamente su asistencia."

La UI debe ser:

**Profesional + tecnológica + minimalista + elegante + sobria +
biométrica.**

### Restricción final

**Modificar únicamente la capa visual.**

Antes de finalizar, comprobar que:

-   El login sigue funcionando.
-   La autenticación sigue funcionando.
-   El Dashboard sigue funcionando.
-   La cámara sigue funcionando.
-   El reconocimiento facial sigue funcionando.
-   El registro de asistencia sigue funcionando.
-   La carga de imágenes sigue funcionando.
-   Los datos siguen llegando de las mismas fuentes.
-   Las rutas siguen funcionando.
-   Las APIs siguen siendo las mismas.
-   No se modificó ninguna lógica de negocio.

Si una mejora visual requiere cambiar lógica funcional, **NO realizar
ese cambio**. Buscar una solución exclusivamente visual.
