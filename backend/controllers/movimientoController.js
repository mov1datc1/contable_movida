import { Movimiento } from '../models/Movimiento.js';
import { getDateRangeFromQuery } from '../utils/dateUtils.js';

export const listarMovimientos = async (req, res) => {
  try {
    const { q, sentido, inicio, fin, anio, mes } = req.query;
    const filtro = {};

    if (sentido) {
      filtro.sentido = sentido;
    }

    if (q) {
      filtro.descripcion = { $regex: q, $options: 'i' };
    }

    const { startDate, endDate } = getDateRangeFromQuery({ inicio, fin, anio, mes });
    if (startDate && endDate) {
      filtro.fecha = { $gte: startDate, $lte: endDate };
    }

    const movimientos = await Movimiento.find(filtro).sort({ fecha: -1 });
    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

export const crearMovimiento = async (req, res) => {
  try {
    const datos = req.body;
    if (!datos.monto || Number(datos.monto) <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }
    const movimiento = await Movimiento.create(datos);
    res.status(201).json(movimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear movimiento' });
  }
};

export const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const movimiento = await Movimiento.findOneAndUpdate({ id_mov: id }, datos, {
      new: true,
      runValidators: true
    });
    if (!movimiento) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(movimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar movimiento' });
  }
};

export const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await Movimiento.findOneAndDelete({ id_mov: id });
    if (!movimiento) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json({ mensaje: 'Movimiento eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar movimiento' });
  }
};
