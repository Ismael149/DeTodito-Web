import { api } from './api';
import { CartItem } from '../types/cart';

interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    // Verificar si hay token antes de hacer la request
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('🛒 No hay token - retornando carrito vacío');
      return { items: [], total: 0, itemCount: 0 };
    }

    try {
      const response = await api.get<CartResponse>('/cart');
      return response.data;
    } catch (error: any) {
      // Si es error 401, no loguear - ya se maneja en el interceptor
      if (error.response?.status !== 401) {
        console.error('Error getting cart:', error);
      }
      return { items: [], total: 0, itemCount: 0 };
    }
  },

  async addToCart(productId: number, quantity: number = 1): Promise<any> {
    try {
      const response = await api.post('/cart/add', {
        product_id: productId,
        quantity
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al agregar al carrito');
    }
  },

  async updateCartItem(itemId: number, quantity: number): Promise<any> {
    try {
      const response = await api.put(`/cart/item/${itemId}`, { quantity });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar carrito');
    }
  },

  async removeFromCart(itemId: number): Promise<any> {
    try {
      const response = await api.delete(`/cart/item/${itemId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar del carrito');
    }
  },

  async clearCart(): Promise<any> {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al vaciar carrito');
    }
  }
};