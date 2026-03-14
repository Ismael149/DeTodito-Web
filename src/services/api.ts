import axios from 'axios';
import { environment } from '../config/environment';

const API_URL = environment.apiUrl;

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para controlar redirecciones
let isRedirecting = false;

// Interceptor para agregar token a todas las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // No loguear requests de rutas públicas para evitar spam en consola
    const isPublicRoute = config.url?.includes('/auth/login') || 
                         config.url?.includes('/auth/register') ||
                         config.url?.includes('/health');
    
    if (!isPublicRoute) {
      console.log('🔐 Interceptor de request - Token disponible:', !!token);
      console.log('🔐 URL de la request:', config.url);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Evitar loguear errores de rutas públicas
    const isPublicRoute = error.config?.url?.includes('/auth/login') || 
                         error.config?.url?.includes('/auth/register');
    
    if (!isPublicRoute) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message
      });
    }
    
    if (error.response?.status === 401) {
      console.warn('🔐 Token inválido o expirado');
      
      // Solo redirigir si no estamos ya en la página de login y no estamos en medio de una redirección
      if (!window.location.pathname.includes('/login') && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Usar setTimeout para evitar problemas de react durante el render
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
);