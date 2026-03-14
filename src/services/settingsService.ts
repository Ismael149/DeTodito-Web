import { api } from './api';

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/user/settings');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await api.put('/user/settings', settings);
    return response.data;
  },

  applyVisualSettings: (settings: any) => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (settings.fontSize) {
      document.documentElement.style.fontSize = `${settings.fontSize}px`;
    }
  }
};
