import { api } from './api';
import { authService } from './authService';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  image_url?: string;
  action_url?: string;
  related_id?: number;
  related_type?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSetting {
  id: number;
  category: string;
  via_email: boolean;
  via_push: boolean;
  via_in_app: boolean;
  is_active: boolean;
}

const listeners: ((count: number) => void)[] = [];
let currentUnreadCount = 0;

export const notificationService = {
  subscribe(callback: (count: number) => void) {
    listeners.push(callback);
    callback(currentUnreadCount);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  setUnreadCount(count: number) {
    currentUnreadCount = count;
    listeners.forEach(listener => listener(count));
  },

  getUnreadCount() {
    return currentUnreadCount;
  },

  async refreshStats() {
    if (!authService.isAuthenticated()) {
      this.setUnreadCount(0);
      return;
    }
    try {
      const response = await api.get('/notifications?limit=1');
      if (response.data && response.data.stats) {
        this.setUnreadCount(response.data.stats.unread || 0);
        return response.data.stats;
      }
    } catch (error) {
      console.error('Error refreshing notification stats:', error);
    }
  },

  async getNotifications(page: number = 1, limit: number = 20, filters: any = {}) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters.unreadOnly) params.append('unreadOnly', 'true');
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);

    const response = await api.get(`/notifications?${params.toString()}`);
    if (response.data && response.data.stats) {
      this.setUnreadCount(response.data.stats.unread || 0);
    }
    return response.data;
  },

  async markAsRead(notificationId: number) {
    const response = await api.patch(`/notifications/${notificationId}/read`, {});
    this.refreshStats();
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all', {});
    this.setUnreadCount(0);
    return response.data;
  },

  async archiveNotification(notificationId: number) {
    const response = await api.patch(`/notifications/${notificationId}/archive`, {});
    this.refreshStats();
    return response.data;
  },

  async getSettings() {
    const response = await api.get('/notifications/settings');
    return response.data;
  },

  async updateSetting(category: string, setting: Partial<NotificationSetting>) {
    const response = await api.put(`/notifications/settings/${category}`, setting);
    return response.data;
  },

  async registerDevice(deviceData: any) {
    const response = await api.post('/notifications/devices', deviceData);
    return response.data;
  }
};
