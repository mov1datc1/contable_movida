import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tareaSchema = new mongoose.Schema(
  {
    id_tarea: {
      type: String,
      default: () => uuidv4(),
      unique: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    estatus: {
      type: String,
      enum: ['abierta', 'en_curso', 'on_hold', 'cerrada'],
      default: 'abierta'
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Tarea = mongoose.model('Tarea', tareaSchema);
