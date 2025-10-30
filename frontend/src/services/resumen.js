import api from './api.js';

export const fetchFlujoCaja = async (params = {}) => {
  const { data } = await api.get('/api/resumen/flujo-caja', { params });
  return data;
};

export const fetchEstadoResultados = async (params = {}) => {
  const { data } = await api.get('/api/resumen/estado-resultados', { params });
  return data;
};

export const fetchKPIs = async (params = {}) => {
  const { data } = await api.get('/api/resumen/kpis', { params });
  return data;
};
