import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import tareasRouter from "./routes/taskRoutes.js";
import movimientosRouter from "./routes/movimientoRoutes.js";
import resumenRouter from "./routes/resumenRoutes.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Conectar a MongoDB UNA SOLA VEZ (si no está conectado ya)
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

// Middleware para asegurar la conexión a la base de datos antes de las rutas /api
app.use("/api", async (req, res, next) => {
  try {
    await initDb();
    next();
  } catch (error) {
    next(error);
  }
});

// RUTAS
app.get("/", async (req, res) => {
  await initDb();
  res.json({ ok: true, servicio: "contabilidad-movida-backend" });
});

app.use("/api/tareas", tareasRouter);
app.use("/api/movimientos", movimientosRouter);
app.use("/api/resumen", resumenRouter);

export default app;

