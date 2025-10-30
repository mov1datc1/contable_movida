# Contabilidad Movida

Plataforma fullstack para gestionar tareas, movimientos financieros y tableros ejecutivos de Movida TCI.

## Arquitectura del proyecto

```
/
├── backend/        # API Express + MongoDB (Mongoose)
├── frontend/       # Aplicación React + TailwindCSS
└── README.md
```

## Requisitos previos

- Node.js 18+
- MongoDB (Atlas u otra instancia accesible)
- npm o pnpm/yarn (las instrucciones usan `npm`)

## Configuración del backend

1. Copia el archivo de entorno y completa los valores reales:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Variables soportadas:

   - `MONGODB_URI`: cadena de conexión a MongoDB.
   - `PORT`: puerto donde correrá la API (por defecto 5000).
   - `FRONTEND_ORIGIN`: dominio permitido para CORS (por ejemplo `http://localhost:3000` o la URL de Vercel del frontend).

2. Instala dependencias e inicia el servidor en modo desarrollo:

   ```bash
   npm install
   npm run dev
   ```

   El servidor Express expone los endpoints REST en `http://localhost:5000`.

## Configuración del frontend

1. Configura las variables de entorno para apuntar al backend:

   ```bash
   cd frontend
   cp .env.example .env
   ```

   - `VITE_API_BASE_URL`: URL base del backend (ej. `http://localhost:5000`).

2. Instala dependencias y levanta la app:

   ```bash
   npm install
   npm run dev
   ```

   La aplicación quedará disponible en `http://localhost:3000`.

## Ejecutar la solución completa en local

1. Inicia el backend (`npm run dev` en `backend/`).
2. Inicia el frontend (`npm run dev` en `frontend/`).
3. Abre `http://localhost:3000` en el navegador para utilizar el panel.

## Despliegue en Vercel

- **Frontend**: despliega la carpeta `frontend/` como proyecto Vite. Configura la variable de entorno `VITE_API_BASE_URL` en Vercel apuntando al backend.
- **Backend**: puedes desplegar la carpeta `backend/` como una app Node.js en Vercel (usando serverless functions) o en otra plataforma Node (Railway, Render, etc.). Si usas Vercel, define `PORT` y `MONGODB_URI` en las variables de entorno del proyecto backend. Asegúrate de exponer las rutas bajo `/api/...` y actualizar `FRONTEND_ORIGIN` con el dominio del frontend en producción.

## Endpoints principales

- `GET /api/tareas` – listado y filtros básicos de tareas.
- `POST /api/tareas` – creación de nuevas tareas.
- `GET /api/movimientos` – listado de movimientos financieros con filtros por fecha, sentido y texto.
- `POST /api/movimientos` – creación de movimientos (ingresos o egresos).
- `GET /api/resumen/flujo-caja` – totales de ingresos/egresos, balance y breakdown por categoría.
- `GET /api/resumen/estado-resultados` – estado de resultados resumido.
- `GET /api/resumen/kpis` – KPIs financieros clave.

Todos los endpoints responden en formato JSON y comparten un manejo de errores consistente.

## Notas adicionales

- TailwindCSS ya está configurado en el frontend con un tema inspirado en dashboards SaaS.
- El frontend incluye utilidades para exportar tablas filtradas a Excel (`xlsx`) y PDF (`jspdf` + `autotable`).
- CORS está habilitado en el backend permitiendo el dominio especificado en `FRONTEND_ORIGIN` y `http://localhost:3000` por defecto.
- Los modelos en MongoDB evitan duplicar estructuras entre módulos: los movimientos almacenan ingresos y egresos en una sola colección diferenciada por `sentido`.

¡Listo! Conecta tus credenciales reales, despliega ambos proyectos en Vercel y tendrás el tablero contable funcionando.
