import { Router } from 'express';
import {
  obtenerFlujoCaja,
  obtenerEstadoResultados,
  obtenerKPIs
} from '../controllers/resumenController.js';

const router = Router();

router.get('/flujo-caja', obtenerFlujoCaja);
router.get('/estado-resultados', obtenerEstadoResultados);
router.get('/kpis', obtenerKPIs);

export default router;
