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
        // Guardar token y datos del usuario (usando llaves consistentes con la app móvil)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
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

  async register(userData: any) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAdmin() {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      return user.is_admin === true ||
             user.is_admin === 1 ||
             user.is_admin === 'true' ||
             user.is_admin === '1' ||
             user.role === 'admin' ||
             user.user_type === 'admin';
    } catch (error) {
      console.error('❌ [AUTH] Error in admin check:', error);
      return false;
    }
  },

  // Obtener perfil completo del usuario
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      if (response.data) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Actualizar perfil
  async updateProfile(userData: any) {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Verificación de email
  async requestEmailVerification(email: string) {
    return (await api.post('/auth/verify-email/request', { email })).data;
  },

  async verifyEmail(token: string) {
    return (await api.get(`/auth/verify-email/${token}`)).data;
  },

  async resendVerificationEmail(email: string) {
    return (await api.post('/auth/verify-email/resend', { email })).data;
  },

  // Recuperación de contraseña
  async requestPasswordReset(email: string) {
    return (await api.post('/auth/password/reset-request', { email })).data;
  },

  async validateResetToken(token: string) {
    return (await api.get(`/auth/password/validate-token/${token}`)).data;
  },

  async resetPassword(token: string, newPassword: string) {
    return (await api.post('/auth/password/reset', { token, newPassword })).data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return (await api.post('/auth/change-password', { currentPassword, newPassword })).data;
  }
};