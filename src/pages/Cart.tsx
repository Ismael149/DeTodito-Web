import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      try {
        await removeFromCart(itemId);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Inicia sesión</h1>
          <p className="text-gray-600 mb-8">
            Debes iniciar sesión para ver tu carrito de compras
          </p>
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4 p-4 border rounded-lg">
              <div className="w-20 h-20 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Descubre productos increíbles y agrégalos a tu carrito
          </p>
          <Link to="/products" className="btn-primary text-lg px-8 py-3">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md border p-4">
              <div className="flex items-center space-x-4">
                {/* Imagen del producto */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.product_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    ${item.price} c/u
                  </p>
                  
                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-700">
                        Cantidad:
                      </label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total:</span>
                <span>${(getCartTotal() + 5).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-lg"
            >
              Proceder al Pago
            </button>

            <Link
              to="/products"
              className="block text-center text-blue-600 hover:text-blue-700 mt-4"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;