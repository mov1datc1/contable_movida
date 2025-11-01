import api from './api.js';

export const fetchFlujoCaja = async (params = {}) => {
  const { data } = await api.get('/resumen/flujo-caja', { params });
  return data;
};

export const fetchEstadoResultados = async (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.anio) {
    searchParams.append('anio', params.anio);
  }
  if (params.mes) {
    searchParams.append('mes', params.mes);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `/resumen/estado-resultados?${queryString}`
    : '/resumen/estado-resultados';

  const { data } = await api.get(url);
  return data;
};

export const fetchKPIs = async (params = {}) => {
  const { data } = await api.get('/resumen/kpis', { params });
  return data;
};
