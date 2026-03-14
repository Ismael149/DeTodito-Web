export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
  created_at: string;
  updated_at: string;
}

export interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  refreshCart: () => Promise<void>;
}