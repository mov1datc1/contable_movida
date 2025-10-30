import { Tarea } from '../models/Tarea.js';

export const listarTareas = async (req, res) => {
  try {
    const { q, estatus } = req.query;
    const filtro = {};
    if (q) {
      filtro.descripcion = { $regex: q, $options: 'i' };
    }
    if (estatus) {
      filtro.estatus = estatus;
    }
    const tareas = await Tarea.find(filtro).sort({ createdAt: -1 });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

export const crearTarea = async (req, res) => {
  try {
    const { descripcion, estatus } = req.body;
    if (!descripcion) {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }
    const nuevaTarea = await Tarea.create({ descripcion, estatus });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findOneAndUpdate({ id_tarea: id }, req.body, {
      new: true,
      runValidators: true
    });
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findOneAndDelete({ id_tarea: id });
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};
