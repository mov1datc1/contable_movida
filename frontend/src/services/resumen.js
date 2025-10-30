import api from './api.js';

export const fetchFlujoCaja = async (params = {}) => {
  const { data } = await api.get('/resumen/flujo-caja', { params });
  return data;
};

export const fetchEstadoResultados = async (params = {}) => {
  const { data } = await api.get('/resumen/estado-resultados', { params });
  return data;
};

export const fetchKPIs = async (params = {}) => {
  const { data } = await api.get('/resumen/kpis', { params });
  return data;
};
