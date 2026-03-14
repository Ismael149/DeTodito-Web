import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { CartItem, CartContextType } from '../types/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Si no está autenticado, vaciar el carrito
      setCart([]);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    // No intentar cargar el carrito si no está autenticado
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Si hay error de autenticación, no hacer nada - el interceptor se encargará
      if (error instanceof Error && !error.message.includes('401')) {
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para agregar productos al carrito');
    }

    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      if (message.toLowerCase().includes('stock')) {
        alert('⚠️ No hay suficiente stock para agregar este producto.');
      } else {
        alert('❌ Error al agregar al carrito: ' + message);
      }
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    const item = cart.find(i => i.id === itemId);
    if (item && quantity > item.stock) {
      alert(`⚠️ Solo hay ${item.stock} unidades disponibles de este producto.`);
      return;
    }

    try {
      if (quantity === 0) {
        await removeFromCart(itemId);
      } else {
        await cartService.updateCartItem(itemId, quantity);
        await loadCart();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      if (message.toLowerCase().includes('stock')) {
        alert('⚠️ No hay suficiente stock disponible.');
      } else {
        alert('❌ Error al actualizar cantidad: ' + message);
      }
      throw error;
    }
  };

  const removeFromCart = async (itemId: number): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para modificar el carrito');
    }

    try {
      await cartService.clearCart();
      setCart([]);
    } catch (error) {
      throw error;
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};