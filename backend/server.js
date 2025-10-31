// redeploy cors fix timestamp
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import tareasRouter from "./routes/taskRoutes.js";
import movimientosRouter from "./routes/movimientoRoutes.js";
import resumenRouter from "./routes/resumenRoutes.js";

const app = express();

/**
 * CORS CONFIG
 *
 * Permitimos:
 * - tu frontend en producción: https://contable-movida.vercel.app
 * - entornos locales comunes: localhost:3000 y localhost:5173
 *
 * Importante:
 * - Esto además responde preflight OPTIONS.
 * - Ya no dependemos sólo de FRONTEND_ORIGIN porque necesitamos más de un origen permitido.
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://contable-movida.vercel.app",
];

// middleware CORS personalizado
app.use(
  cors({
    origin: function (origin, callback) {
      // Requests internas del servidor (sin origin, por ejemplo llamadas directas desde Vercel) las dejamos pasar
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // origen no permitido
      return callback(
        new Error("CORS bloqueado para este origen: " + origin),
        false
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// responder preflight OPTIONS global
app.options("*", cors());

app.use(express.json());

// === Conexión MongoDB (lazy / serverless-friendly) ===
let isConnected = false;

async function initDb() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado (serverless)");
    isConnected = true;
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    throw err;
  }
}

// Middleware para asegurar conexión antes de /api/*
app.use("/api", async (req, res, next) => {
  try {
    await initDb();
    next();
  } catch (error) {
    next(error);
  }
});

// === Rutas ===

// Endpoint raíz de salud
app.get("/", async (req, res) => {
  await initDb();
  res.json({ ok: true, servicio: "contabilidad-movida-backend" });
});

// CRUD tareas
app.use("/api/tareas", tareasRouter);

// CRUD movimientos (ingresos / egresos)
app.use("/api/movimientos", movimientosRouter);

// Resúmenes financieros (flujo-caja, estado-resultados, kpis)
app.use("/api/resumen", resumenRouter);

// Manejo básico de errores (incluye errores de CORS y DB)
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err?.message || err);

  if (err.message && err.message.startsWith("CORS bloqueado")) {
    return res.status(403).json({ error: "CORS no permitido", detail: err.message });
  }

  return res.status(500).json({
    error: "Error interno del servidor",
    detail: err.message || "unknown",
  });
});

export default app;

