import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Debug: Verificar variable de entorno
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🌐 API_URL final:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
