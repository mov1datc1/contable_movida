import api from './api.js';

export const fetchTareas = async (params = {}) => {
  const { data } = await api.get('/api/tareas', { params });
  return data;
};

export const createTarea = async (payload) => {
  const { data } = await api.post('/api/tareas', payload);
  return data;
};

export const updateTarea = async (id, payload) => {
  const { data } = await api.put(`/api/tareas/${id}`, payload);
  return data;
};

export const deleteTarea = async (id) => {
  const { data } = await api.delete(`/api/tareas/${id}`);
  return data;
};
