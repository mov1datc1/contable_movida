import api from './api.js';

export const fetchMovimientos = async (params = {}) => {
  const { data } = await api.get('/api/movimientos', { params });
  return data;
};

export const createMovimiento = async (payload) => {
  const { data } = await api.post('/api/movimientos', payload);
  return data;
};

export const updateMovimiento = async (id, payload) => {
  const { data } = await api.put(`/api/movimientos/${id}`, payload);
  return data;
};

export const deleteMovimiento = async (id) => {
  const { data } = await api.delete(`/api/movimientos/${id}`);
  return data;
};
