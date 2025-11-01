import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://contable-movida-back.vercel.app/api');

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Error en la comunicación con el servidor';
    return Promise.reject(new Error(message));
  }
);

export default api;
