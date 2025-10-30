import axios from 'axios';

const sanitizeBaseUrl = (url) => {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith('//')) {
    return `https:${normalized}`;
  }

  if (/^(localhost|127\.0\.0\.1)(?::\d+)?(\/.*)?$/i.test(normalized)) {
    return `http://${normalized}`;
  }

  if (/^[\w.-]+(?::\d+)?(\/.*)?$/.test(normalized)) {
    return `https://${normalized}`;
  }

  return normalized;
};

const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL;

const API_BASE_URL =
  sanitizeBaseUrl(rawBaseUrl) || sanitizeBaseUrl('http://localhost:5000/api');

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
