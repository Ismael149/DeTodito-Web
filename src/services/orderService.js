import { api } from './api';

export const orderService = {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear orden');
    }
  },

  async getUserOrders() {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener órdenes');
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener orden');
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar orden');
    }
  }
};