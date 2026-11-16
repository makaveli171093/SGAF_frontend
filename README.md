SGAF — Frontend
Interfaz web del Sistema de Gestión Académica y Financiera (SGAF), desarrollado para centralizar procesos académicos, administrativos y financieros de una institución educativa. La aplicación permite que estudiantes, docentes, recepción y administradores accedan a las funciones correspondientes a su rol.
Alcance
- Acceso y usuarios: registro, inicio de sesión, perfil y control de acceso por roles.
- Gestión académica: períodos, materias, grupos, docentes, horarios e inscripciones.
- Estudiantes: consulta de inscripciones, tareas, entregas y estado financiero.
- Docentes: gestión de tareas, revisión de entregas y registro de calificaciones.
- Recepción: revisión de postulantes, obligaciones y pagos manuales.
- Administración: gestión de usuarios y configuración académica, métricas y reportes.
- Pagos: consulta y seguimiento de obligaciones; integración de pagos en línea mediante el backend cuando esté habilitada.
Este repositorio contiene únicamente el frontend. La autenticación, las reglas de negocio, la persistencia de datos y el procesamiento de pagos dependen del backend de SGAF.
Tecnologías principales
React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 8 · Axios · Zustand · React Hook Form · Zod · Recharts.
Requisitos
- Git.
- Node.js compatible con Vite 8 (versión 20.19+ o 22.12+, según la línea de Node utilizada; se recomienda una versión LTS actual).
- npm.
- Backend de SGAF ejecutándose y accesible desde el navegador.
Instalación y ejecución
1. Clonar el repositorio
git clone https://github.com/makaveli171093/SGAF_frontend.git
cd SGAF_frontend
2. Instalar las dependencias
npm ci
3. Configurar las variables de entorno
Copia el archivo de ejemplo:
cp .env.example .env.local
En Windows (PowerShell): Copy-Item .env.example .env.local.

Configura .env.local:
VITE_API_URL=http://localhost:3000/api/v1
VITE_ONLINE_PAYMENTS_ENABLED=false
- VITE_API_URL: URL base de la API del backend, incluyendo /api/v1 si esa es su ruta configurada.
- VITE_ONLINE_PAYMENTS_ENABLED: activa (true) u oculta (false) la opción de pagos en línea. Para usarla, el backend y la pasarela de pagos deben estar configurados.
4. Levantar los servicios necesarios
Inicia por separado el backend SGAF y sus servicios requeridos (por ejemplo, su base de datos), siguiendo las instrucciones de su propio repositorio. Verifica que la API responda en la URL configurada y que permita solicitudes desde el origen del frontend.

No es necesario levantar una base de datos desde este repositorio: el frontend se comunica con ella a través del backend.
5. Iniciar el frontend
npm run dev
Abre la URL local indicada por Vite (normalmente http://localhost:5173).
Comandos disponibles
Comando	Función
npm run dev	Inicia el servidor de desarrollo.
npm run build	Valida TypeScript y genera la compilación de producción en dist/.
npm run preview	Previsualiza localmente la compilación.
npm run lint	Ejecuta Oxlint.


Despliegue
El proyecto incluye vercel.json para el despliegue como aplicación de una sola página (SPA). Configura VITE_API_URL en el entorno de despliegue y asegúrate de que el backend sea accesible desde el navegador.
