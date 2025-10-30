import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

// RUTAS
app.get("/", async (req, res) => {
  await initDb();
  res.json({ ok: true, servicio: "contabilidad-movida-backend" });
});

// TODO: aquí van tus otras rutas
// app.use("/api/tareas", tareasRouter)
// app.use("/api/movimientos", movimientosRouter)
// etc.

export default app;

