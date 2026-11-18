# Rediseño visual NEXORA

Rama: `feat/nexora-visual`. Pendiente de aceptación del usuario; no fusionar con `main`.

## Dirección visual

Esta revisión reemplaza la propuesta verde y dorada por una identidad azul noche, azul intenso y turquesa. Cambia la composición de portada, acceso e inicio, además del estilo compartido por las pantallas académicas, financieras y administrativas.

| Uso                       | Color     |
| ------------------------- | --------- |
| Paneles oscuros y títulos | `#14253f` |
| Acciones y selección      | `#3155d9` |
| Acentos decorativos       | `#65e3cf` |
| Fondo del campus          | `#f3f5fa` |
| Superficies               | `#ffffff` |

- **Manrope** para títulos; **DM Sans** para lectura y controles. Archivos WOFF2 locales con sus licencias OFL en `public/fonts`. No hay solicitudes a Google Fonts durante el uso.
- Portada editorial con imagen enmarcada, áreas de formación diferenciadas, beneficios y contacto sobre fondo oscuro.
- Acceso con panel de marca, ilustración vectorial y formulario independiente. Registro con grupos numerados.
- Campus con navegación fija azul noche, selección azul, perfil y encabezado compacto.
- Inicio con bienvenida ilustrada e indicadores reales del backend. No se agregan métricas inventadas.
- Tarjetas, campos, botones, estados, tablas, diálogos y gráficos con tratamiento común.
- Mi cuenta distribuida en dos columnas en escritorio y una en móvil.
- Icono de pestaña NEXORA; pantallas de carga y 404 acordes con la identidad.
- Adaptación móvil, foco visible, movimiento reducido e impresión conservados.

## Alcance

Cambios de presentación. Se mantienen servicios, contratos de API, rutas, autorización, validaciones, cálculos, datos y operaciones existentes. No se agregan dependencias de JavaScript ni cambios al backend o la base de datos. Los SVG son decorativos y no representan métricas.

Los estilos se organizan así:

- `src/index.css`: colores, tipografías, controles compartidos, accesibilidad e impresión.
- `src/styles/campus.css`: navegación, panel, registros, tablas y cuenta.
- `src/styles/public.css`: portada, acceso, registro y página no encontrada.

## Actualizar la copia local

Con el servidor detenido y el directorio de trabajo limpio:

```powershell
git fetch origin
git switch feat/nexora-visual
git pull --ff-only origin feat/nexora-visual
npm ci
npm run lint
npm run build
npm run dev
```

Si todavía no existe la rama local, usar `git switch --track origin/feat/nexora-visual` en lugar de `git switch feat/nexora-visual`.

Conservar la configuración actual de `VITE_API_URL` en `.env.local`. El diseño aparece en la dirección que imprime Vite. Un frontend local que apunta a Render sigue operando sobre la base de datos configurada en Render.

## Verificación

Lint y compilación sin errores. Revisión en navegador de portada, acceso, validación de campos vacíos, inicio, usuarios, diálogo de edición, cuenta, reportes, formulario de materia y registro. Verificación móvil a 390 px y revisión del ancho mínimo a 320 px.

Las pantallas privadas se revisan con respuestas de prueba en un servidor local externo al repositorio, sin contactar Render ni Supabase. Esas respuestas no se incluyen en la aplicación ni en esta rama. Esta comprobación visual no sustituye una prueba de integración de las operaciones con el backend real.
