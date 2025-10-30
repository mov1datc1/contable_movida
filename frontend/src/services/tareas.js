import api from './api.js';

export const fetchTareas = async (params = {}) => {
  const { data } = await api.get('/tareas', { params });
  return data;
};

export const createTarea = async (payload) => {
  const { data } = await api.post('/tareas', payload);
  return data;
};

export const updateTarea = async (id, payload) => {
  const { data } = await api.put(`/tareas/${id}`, payload);
  return data;
};

export const deleteTarea = async (id) => {
  const { data } = await api.delete(`/tareas/${id}`);
  return data;
};
