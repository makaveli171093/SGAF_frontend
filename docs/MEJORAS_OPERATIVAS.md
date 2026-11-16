# NEXORA: mejoras operativas

La rama `feat/mejoras-operativas` necesita la rama del mismo nombre de SGAF-BACKEND y su migración `20261115090000_operational_improvements`. El rediseño se revisa por separado en `feat/nexora-visual`; no fusionarlo con main antes de aprobar su apariencia.

## Funciones

- Inicio por rol con indicadores consultados al backend.
- Administración: editar usuarios e inactivar/reactivar conservando el historial. No se permite cambiar el rol ni desactivar la cuenta propia; el servidor protege al último administrador.
- Periodos: reapertura administrativa con motivo e historial. Un periodo vigente vuelve a Activo; uno futuro a Planificado. Un periodo vencido no se reabre.
- Materias: edición de código, nombre, tarifas y estado. Los créditos son editables antes de tener inscripciones; después se conservan por su impacto histórico. Las tarifas no reescriben obligaciones existentes.
- Grupos: editar nombre, capacidad, docente, materia y periodo. Con inscripciones o tareas se conservan materia y periodo. El backend valida cupos y cruces de horario.
- Horarios: editar o eliminar bloques, además de crearlos. No se modifican grupos de periodos cerrados.
- Mi cuenta: datos personales, contraseña e imagen. La contraseña requiere la actual y revoca las sesiones anteriores. La imagen se recorta al centro a 256 × 256; se almacena como imagen pequeña en la base de datos. Sin imagen se muestran iniciales.
- Recepción: historial de intentos de pago y bloqueo de un nuevo formulario si existe un intento pendiente.
- Reportes de administración: Recharts, CSV e impresión/PDF. Los ingresos son pagos aprobados por fecha de verificación, en hora de Bolivia. Deudas y ocupación son el estado actual. Los pagos antiguos aprobados sin fecha de verificación se muestran como excluidos, sin inventar fechas.
- Confirmaciones accesibles, protección de cambios sin guardar en los nuevos editores y paginación de usuarios. Los datos consultados quedan asociados a la sesión que los obtuvo.

## Revisar localmente sin cambiar main

Desde el repositorio local del frontend:

```powershell
git fetch origin
git worktree add ..\SGAF-mejoras --track origin/feat/mejoras-operativas
Set-Location ..\SGAF-mejoras
npm ci
Copy-Item .env.example .env.local
```

Configura `.env.local` con la URL del **backend actualizado de prueba**. El backend de producción anterior aún no contiene estos endpoints. Luego:

```powershell
npm run lint
npm run build
npm run dev
```

Para probar el compilado: `npm run preview`. No se necesita publicar en Vercel para revisarlo localmente. Usa otro directorio para la rama visual; no mezcles cambios ni copies `node_modules` entre ramas.

## Pruebas manuales con el backend de prueba

1. Administrador: editar un usuario; inactivar otra cuenta y verificar que su sesión deje de funcionar. Reactivar un estudiante con deuda y comprobar que conserve la restricción.
2. Reabrir un periodo vigente con un motivo. Revisar el historial. Intentar reabrir uno vencido y comprobar el rechazo.
3. Cambiar tarifas de una materia y verificar que las obligaciones anteriores mantengan su importe. Revisar la restricción de créditos con inscripciones.
4. Reducir capacidad por debajo de inscritos y crear/editar un horario que choque con otro docente o estudiante: el servidor debe rechazarlo.
5. Cambiar datos/foto de cada rol. Cancelar un editor con cambios. Cambiar contraseña y comprobar acceso con la nueva e invalidación de sesiones anteriores.
6. Recepción: revisar una obligación con intentos rechazados y pendientes. Verificar el bloqueo de un nuevo registro mientras haya uno pendiente.
7. Reportes: contrastar ingresos con pagos aprobados, cambiar fechas y revisar CSV e impresión. Cero datos debe mostrar cero, no ejemplos.

## Verificación realizada durante el desarrollo

- TypeScript/Vite y oxlint.
- Navegación de escritorio y móvil con Chrome; edición, cancelación, confirmaciones, permisos de navegación, reapertura, materias, horarios, CSV e intentos de pago con respuestas de prueba aisladas fuera del repositorio.
- No se usaron credenciales ni registros reales en esas pruebas del navegador. La validación integrada con PostgreSQL requiere ejecutar la migración y las pruebas anteriores en una base de prueba.

## Publicación

Primero actualizar y probar el backend con su migración; después publicar este frontend. Mantener MockPay deshabilitado hasta verificar la disponibilidad del servicio del curso. No se ha sustituido la pasarela ni añadido un proveedor de almacenamiento.
