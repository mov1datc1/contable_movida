// redeploy cors fix timestamp22
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import tareasRouter from "./routes/taskRoutes.js";
import movimientosRouter from "./routes/movimientoRoutes.js";
import resumenRouter from "./routes/resumenRoutes.js";

const app = express();

/**
 * CORS SUPER EXPLÍCITO
 *
 * Permitimos:
 * - https://contable-movida.vercel.app  (frontend prod)
 * - localhost para desarrollo
 *
 * Siempre devolvemos Access-Control-Allow-Origin si el origin es válido.
 */
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_ORIGIN,
    "https://contable-movida.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ].filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // manejar preflight OPTIONS sin pasar a las rutas
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

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

// healthcheck
app.get("/", async (req, res) => {
  await initDb();
  res.json({ ok: true, servicio: "contabilidad-movida-backend" });
});

app.use("/api/tareas", tareasRouter);
app.use("/api/movimientos", movimientosRouter);
app.use("/api/resumen", resumenRouter);

// Manejo básico de errores (incluye CORS y DB)
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err?.message || err);

  return res.status(500).json({
    error: "Error interno del servidor",
    detail: err.message || "unknown",
  });
});

export default app;

