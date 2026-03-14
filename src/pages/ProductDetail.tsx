import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatImageUrl } from '../utils/urlUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  stock: number;
  image_url?: string;
  seller_username?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProduct(parseInt(id!));
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      alert('Producto agregado al carrito!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen del producto */}
         <div>
          <div className={`bg-white rounded-lg shadow-md overflow-hidden relative ${product.stock === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            {product.image_url ? (
              <img
                src={formatImageUrl(product.image_url)}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Sin imagen</span>
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full text-lg shadow-xl">
                  SIN STOCK
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
              <span className="text-gray-600">Categoría: {product.category}</span>
            </div>
          </div>

          <div>
            <p className="text-4xl font-bold text-blue-600 mb-4">${product.price}</p>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Stock disponible:</span>
                <span className="ml-2 text-gray-600">{product.stock} unidades</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Vendedor:</span>
                <span className="ml-2 text-gray-600">{product.seller_username || 'Anónimo'}</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium text-gray-900">
                Cantidad:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
              </button>
              <button
                onClick={() => navigate('/products')}
                className="btn-secondary"
              >
                Seguir Comprando
              </button>
            </div>

            {product.stock === 0 && (
              <p className="text-red-600 font-medium">Producto agotado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;