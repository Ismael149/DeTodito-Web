import { api } from './api';

export const userService = {
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  getFullName() {
    const user = this.getCurrentUser();
    if (!user) return 'Usuario';
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username || 'Usuario';
  },

  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    if (response.data.user) this.setCurrentUser(response.data.user);
    return response.data;
  },

  async updateProfile(profileData: any) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) this.setCurrentUser(response.data.user);
    return response.data;
  },

  async updateAvatar(data: string | FormData) {
    const isFormData = data instanceof FormData;
    const response = await api.post('/auth/update-avatar', isFormData ? data : { profile_picture: data }, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    if (response.data.user) this.setCurrentUser(response.data.user);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  async deleteAccount(reason: string) {
    const response = await api.post('/auth/delete-account', { reason });
    return response.data;
  }
};
