import api from './api.js';

export const fetchMovimientos = async (params = {}) => {
  const { data } = await api.get('/movimientos', { params });
  return data;
};

export const createMovimiento = async (payload) => {
  const { data } = await api.post('/movimientos', payload);
  return data;
};

export const updateMovimiento = async (id, payload) => {
  const { data } = await api.put(`/movimientos/${id}`, payload);
  return data;
};

export const deleteMovimiento = async (id) => {
  const { data } = await api.delete(`/movimientos/${id}`);
  return data;
};
