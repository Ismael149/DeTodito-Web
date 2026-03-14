import { api } from './api';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  total: number;
  item_count: number;
}

const ensureNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

const normalizeCart = (cart: any): Cart => {
  return {
    ...cart,
    total: ensureNumber(cart.total),
    items: cart.items?.map((item: any) => ({
      ...item,
      price: ensureNumber(item.price || item.product_price),
      quantity: ensureNumber(item.quantity),
      product_name: item.product_name || item.name,
      product_image: item.product_image || item.image_url,
      stock: ensureNumber(item.stock || item.product_stock)
    })) || []
  };
};

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get('/cart');
    return normalizeCart(response.data);
  },

  async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
    const response = await api.post('/cart/items', { product_id: productId, quantity });
    const item = response.data;
    return {
      ...item,
      price: ensureNumber(item.price),
      quantity: ensureNumber(item.quantity)
    };
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    const item = response.data;
    return {
      ...item,
      price: ensureNumber(item.price),
      quantity: ensureNumber(item.quantity)
    };
  },

  async removeFromCart(itemId: number): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },

  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.items?.reduce((count, item) => count + item.quantity, 0) || 0;
    } catch (error) {
      return 0;
    }
  }
};