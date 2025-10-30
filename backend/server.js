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
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

const envAllowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envAllowedOrigins])
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

