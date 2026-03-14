import { api } from './api';

export const productService = {
  async getProducts(filters: any = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/products${params.toString() ? `?${params.toString()}` : ''}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  },

  async getProduct(id: number, forceReload = false) {
    try {
      const url = forceReload ? `/products/${id}?t=${Date.now()}` : `/products/${id}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  },

  async refreshProduct(id: number) {
    const response = await api.get(`/products/${id}/refresh?t=${Date.now()}`);
    return response.data;
  },

  async createProduct(productData: FormData) {
    const response = await api.post('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async updateProduct(id: number, productData: FormData) {
    const response = await api.put(`/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  searchProducts: async (query: string, filters: any = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async updateProductStatus(id: number, statusData: {
    is_active: boolean;
    deactivation_reason?: string | null
  }) {
    const response = await api.patch(`/products/${id}/status`, statusData);
    return response.data;
  },

  async getUserProducts(userId: number) {
    const response = await api.get(`/products/user/${userId}`);
    return response.data;
  },

  async getRelatedProducts(productId: number, categoryId: number, limit: number = 8) {
    try {
      const allProducts = await this.getProducts();
      return allProducts
        .filter((p: any) => p.id !== productId && p.category_id === categoryId)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting related products:', error);
      return [];
    }
  },

  async getAlsoViewedProducts(productId: number, limit: number = 4) {
    try {
      const allProducts = await this.getProducts();
      return allProducts
        .filter((p: any) => p.id !== productId)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting also viewed products:', error);
      return [];
    }
  },

  async incrementView(id: number) {
    try {
      await api.post(`/products/${id}/view`);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  }
};
