import { api } from './api';

export interface SearchFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  sortBy?: string;
  hasDiscount?: boolean;
  freeShipping?: boolean;
  inStock?: boolean;
  page?: number;
}

const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export const searchService = {
  async searchProducts(query: string, filters: SearchFilters = {}, useCache = true) {
    try {
      const cacheKey = JSON.stringify({ query, filters, type: 'search' });
      
      if (useCache && searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.data;
        }
      }

      const params = new URLSearchParams();
      if (query && query.trim().length >= 2) {
        params.append('q', query.trim());
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/search?${params.toString()}`);
      
      if (useCache) {
        searchCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  async getSearchSuggestions(query: string) {
    if (!query || query.length < 2) return { suggestions: [] };
    const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getSearchHistory() {
    const response = await api.get('/search/history');
    return response.data;
  },

  async getRecommendations(limit: number = 12, type: 'personalized' | 'trending' | 'similar' = 'personalized', productId?: number) {
    let url = `/search/recommendations?limit=${limit}&type=${type}`;
    if (type === 'similar' && productId) {
      url += `&productId=${productId}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  async getRealTimeFeed(limit: number = 30) {
    const response = await api.get(`/search/feed?limit=${limit}`);
    return response.data;
  },

  async recordProductView(productId: number) {
    await api.post('/search/record-view', { productId });
  },

  async recordSearchClick(query: string) {
    await api.post('/search/record-click', { query });
  },

  clearCache() {
    searchCache.clear();
  }
};
