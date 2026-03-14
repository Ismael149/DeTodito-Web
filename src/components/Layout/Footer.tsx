import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold">ComercioApp</span>
            </Link>
            <p className="text-gray-300 max-w-md">
              Tu marketplace confiable para comprar y vender productos. Conectamos compradores y vendedores de forma segura y eficiente.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Productos</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Ayuda</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Términos</Link></li>
              <li><Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 ComercioApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;