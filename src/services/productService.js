import { api } from './api';

export const productService = {
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos');
    }
  },

  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el producto');
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear producto');
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar producto');
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar producto');
    }
  },

  async searchProducts(query, filters = {}) {
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al buscar productos');
    }
  }
};