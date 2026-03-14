import { api } from './api';

export const sellerService = {
  async getPublicProfile(sellerId: number) {
    const response = await api.get(`/sellers/${sellerId}/profile`);
    return response.data;
  },

  async rateSeller(sellerId: number, rating: number, comment: string) {
    const response = await api.post(`/sellers/${sellerId}/rate`, { 
      rating, 
      comment 
    });
    return response.data;
  }
};
