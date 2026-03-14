import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { pdfService } from '../services/pdfService';
import { 
  ShoppingBagIcon, 
  ArrowDownTrayIcon, 
  ChevronRightIcon,
  TagIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (order: any) => {
    try {
      await pdfService.generateOrderInvoice(order);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error al descargar la factura');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completado':
      case 'entregado':
        return { color: 'text-green-600 bg-green-50', icon: <CheckCircleIcon className="w-4 h-4 mr-1" />, text: 'Completado' };
      case 'pendiente':
        return { color: 'text-yellow-600 bg-yellow-50', icon: <ClockIcon className="w-4 h-4 mr-1" />, text: 'Pendiente' };
      case 'cancelado':
        return { color: 'text-red-600 bg-red-50', icon: <XCircleIcon className="w-4 h-4 mr-1" />, text: 'Cancelado' };
      case 'en_proceso':
        return { color: 'text-blue-600 bg-blue-50', icon: <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />, text: 'En Proceso' };
      default:
        return { color: 'text-gray-600 bg-gray-50', icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" />, text: status };
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mis Compras</h1>
          <p className="text-gray-500 mt-1">Gestiona tus pedidos y descarga tus facturas.</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl">
          <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Aún no tienes compras</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">¡Descubre productos increíbles y realiza tu primera compra hoy mismo!</p>
          <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            Explorar Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6 md:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest mr-2">Pedido</span>
                        <span className="text-lg font-bold text-gray-900 font-mono">#{order.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </div>
                      <button 
                        onClick={() => downloadInvoice(order)}
                        className="flex items-center px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-100 transition-all transform active:scale-95"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Factura
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex overflow-x-auto pb-4 space-x-6 hide-scrollbar">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex-shrink-0 flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl w-80">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
                          <img src={item.product_image || 'https://via.placeholder.com/150'} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{item.product_name}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <TagIcon className="w-3 h-3 mr-1" />
                            <span>Cant: {item.quantity}</span>
                          </div>
                          <p className="text-blue-600 font-black mt-1">${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                       <span className="text-sm font-bold text-gray-400 mr-2 uppercase tracking-tighter">Total pagado:</span>
                       <span className="text-2xl font-black text-gray-900">${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/product/${order.items?.[0]?.product_id}`)}
                      className="group/btn flex items-center text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Ver detalle completo
                      <ChevronRightIcon className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple animation icons
const ArrowPathIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export default Orders;