import { Router } from 'express';
import {
  listarMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
} from '../controllers/movimientoController.js';

const router = Router();

router.get('/', listarMovimientos);
router.post('/', crearMovimiento);
router.put('/:id', actualizarMovimiento);
router.patch('/:id', actualizarMovimiento);
router.delete('/:id', eliminarMovimiento);

export default router;
