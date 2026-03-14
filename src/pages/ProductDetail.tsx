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
  const { isAuthenticated, user: currentUser } = useAuth();
  
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const isOwner = currentUser?.id === product?.user_id || currentUser?.username === product?.seller_username;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    if (isOwner) {
      alert('❌ No puedes comprar tus propios productos.');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      alert('✅ Producto agregado al carrito!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Mira este producto en DeTodito: ${product.name}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('📋 ¡Enlace copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
         <div className="space-y-4">
          <div className={`bg-white rounded-3xl shadow-xl overflow-hidden relative group transition-all duration-500 hover:shadow-2xl ${product.stock === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            <img
              src={formatImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-600 text-white font-black px-8 py-3 rounded-full text-xl shadow-2xl tracking-tighter uppercase">
                  SIN STOCK
                </span>
              </div>
            )}
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-6 right-6 flex flex-col space-y-3">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 hover:bg-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button 
                onClick={handleShare}
                className="p-3 bg-white/80 backdrop-blur-md text-gray-900 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                {product.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">•</span>
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-gray-400 text-sm ml-2 font-medium">(24 reseñas)</span>
            </div>
            <p className="text-5xl font-black text-blue-600 tracking-tighter">${parseFloat(product.price).toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Descripción</h3>
            <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* Especificaciones Detalladas (Paridad con Mobile) */}
          <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponibles</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter">{product.stock} unidades</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendedor</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter">{product.seller_username || 'Premium User'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Garantía</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter">6 Meses</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiempo de Entrega</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter">24-48 horas</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Cantidad</span>
                <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 px-4 hover:bg-gray-50 text-blue-600 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 font-black text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 px-4 hover:bg-gray-50 text-blue-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {product.stock > 0 && (
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {product.stock - quantity} Disponibles más
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 ${product.stock === 0 || isOwner ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}
              >
                {addingToCart ? 'Procesando...' : isOwner ? 'Tu Producto' : product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
              </button>
              <button
                onClick={() => navigate('/products')}
                className="h-16 px-8 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-gray-100"
              >
                Explorar Más
              </button>
            </div>

            {isOwner && (
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs font-bold text-orange-800 leading-relaxed text-left">
                  Este producto es de tu autoría. Los vendedores no pueden autocomprar sus productos para garantizar la transparencia de la plataforma.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;