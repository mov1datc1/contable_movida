import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movimientoSchema = new mongoose.Schema(
  {
    id_mov: {
      type: String,
      default: () => uuidv4(),
      unique: true
    },
    fecha: {
      type: Date,
      required: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    monto: {
      type: Number,
      required: true,
      min: [0.01, 'El monto debe ser mayor a 0']
    },
    tipoFlujo: {
      type: String,
      enum: ['operativo', 'inversion', 'financiamiento'],
      required: true
    },
    categoriaIngreso: {
      type: String,
      enum: ['ventas', 'aportacion_capital', 'intereses', 'otros', ''],
      default: ''
    },
    categoriaEgreso: {
      type: String,
      enum: ['nomina', 'renta', 'servicios', 'publicidad', 'materiales', 'impuestos', 'otro', ''],
      default: ''
    },
    origen: {
      type: String,
      enum: [
        'BBVA Movida',
        'BBVA Jonathan',
        'BOFA Jonathan',
        'WellsFargo Ricardo',
        'Efectivo',
        'PayPal Movida',
        'Stripe Movida',
        'Wise Movida',
        'Otro'
      ],
      required: true
    },
    sentido: {
      type: String,
      enum: ['ingreso', 'egreso'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

movimientoSchema.pre('validate', function (next) {
  if (this.sentido === 'ingreso') {
    this.categoriaEgreso = '';
    if (!this.categoriaIngreso) {
      this.invalidate('categoriaIngreso', 'Debe seleccionar una categoría de ingreso');
    }
  }
  if (this.sentido === 'egreso') {
    this.categoriaIngreso = '';
    if (!this.categoriaEgreso) {
      this.invalidate('categoriaEgreso', 'Debe seleccionar una categoría de egreso');
    }
  }
  next();
});

export const Movimiento = mongoose.model('Movimiento', movimientoSchema);
