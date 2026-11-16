# Propuesta visual NEXORA

Rama `feat/nexora-visual`, basada en `feat/mejoras-operativas`. **Pendiente de revisión visual; no fusionar con main.**

## Qué cambia

- Verde institucional y dorado conservados. Fondos claros, bordes suaves y tipografía con jerarquía consistente.
- Barra lateral fija con secciones por rol e iconos SVG locales, sin bibliotecas adicionales.
- Menú móvil plegable en un diálogo accesible: foco controlado, cierre con Escape y navegación visible al necesitarla.
- Encabezado compacto con ubicación actual, perfil y cierre de sesión.
- Inicio personalizado: bienvenida, indicadores reales y accesos directos.
- Usuarios en tabla compacta con estados y datos de contacto desplegables. Paginación y acciones conservadas.
- Formularios, confirmaciones, listas, reportes, login y portada pública con acabado consistente.
- Al navegar, el contenido vuelve al inicio. La barra lateral permanece accesible en listas largas.
- Respeta la preferencia de movimiento reducido. Los reportes conservan impresión y CSV.

La rama no cambia contratos de API ni reglas de negocio. Las imágenes existentes se conservan. No contiene datos de demostración ni simulación de pagos.

## Revisarla sin afectar main

Desde el repositorio del frontend:

```powershell
git fetch origin
git worktree add ..\SGAF-visual --track origin/feat/nexora-visual
Set-Location ..\SGAF-visual
npm ci
Copy-Item .env.example .env.local
```

Configurar `.env.local` con la URL del backend **actualizado de prueba** y luego:

```powershell
npm run lint
npm run build
npm run dev
```

Para revisar el compilado, detener `dev` y ejecutar `npm run preview`. Autorizar el origen correspondiente en CORS del backend de prueba.

## Qué revisar

1. Escritorio: menú fijo al desplazar listas, contraste, títulos, tabla de usuarios y estados.
2. Móvil de 390 px: abrir menú, navegar, cerrar con Escape; la página no debe desplazarse horizontalmente. La tabla tiene desplazamiento horizontal propio.
3. Abrir un editor, cambiar datos y cancelar: debe ofrecer conservar o descartar los cambios.
4. Gráficos, CSV e impresión; comprobar datos con el backend de prueba.
5. Portada pública y login. Mantener la identidad visual escogida inicialmente.

Validado con compilación, lint y recorridos de navegador en escritorio y móvil usando respuestas de prueba externas al repositorio. Pendiente la aceptación del usuario y la prueba integrada con PostgreSQL migrado.
