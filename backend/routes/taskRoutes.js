import { Router } from 'express';
import {
  listarTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from '../controllers/taskController.js';

const router = Router();

router.get('/', listarTareas);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.patch('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

export default router;
