import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">ComercioApp</span>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Productos
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Acciones de usuario */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
                  🛒 Carrito
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <span>👤 {user?.first_name}</span>
                    <span>▼</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;