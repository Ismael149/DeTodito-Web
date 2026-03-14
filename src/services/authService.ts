import { api } from './api';
import { User, RegisterData } from '../types/auth';

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Intentando login con:', { email, apiUrl: api.defaults.baseURL });
      
      const response = await api.post<LoginResponse>('/auth/login', { 
        email, 
        password 
      });
      
      console.log('✅ Login exitoso - Respuesta:', response.data);
      
      if (response.data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        console.log('💾 Token guardado en localStorage:', response.data.token.substring(0, 20) + '...');
        console.log('💾 User data guardado:', response.data.user);
      } else {
        console.error('❌ No se recibió token en la respuesta');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error completo en login:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Email o contraseña incorrectos');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al iniciar sesión');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getToken() {
    return localStorage.getItem('authToken');
  }
};