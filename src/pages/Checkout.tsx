import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { addressService } from '../services/addressService';
import { paymentService } from '../services/paymentService';
import { checkoutService } from '../services/checkoutService';
import { 
  MapPinIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  PlusIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [addrData, payData] = await Promise.all([
        addressService.getUserAddresses(),
        paymentService.getUserPaymentMethods()
      ]);
      setAddresses(addrData);
      setPaymentMethods(payData);
      
      const defaultAddr = addrData.find((a: any) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
      
      const defaultPay = payData.find((p: any) => p.is_default);
      if (defaultPay) setSelectedPayment(defaultPay.id);
    } catch (error) {
      console.error('Error loading checkout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert('Por favor selecciona una dirección y un método de pago');
      return;
    }

    try {
      setProcessing(true);
      const result = await checkoutService.createOrder({
        address_id: selectedAddress,
        payment_method_id: selectedPayment,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      if (result.success) {
        await clearCart();
        navigate('/orders', { state: { newOrder: true } });
        alert('¡Pedido realizado con éxito!');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 flex items-center">
        <span className="w-1.5 h-8 bg-blue-600 rounded-full mr-4"></span>
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Section: Address */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-blue-600">
                <MapPinIcon className="h-7 w-7 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Dirección de Envío</h2>
              </div>
              <button 
                onClick={() => navigate('/profile')} 
                className="text-blue-600 font-bold text-sm flex items-center hover:underline"
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Gestionar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedAddress === addr.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  {selectedAddress === addr.id && <CheckCircleIcon className="absolute top-4 right-4 w-6 h-6 text-blue-600" />}
                  <p className="font-bold text-gray-900 mb-1">{addr.address_type === 'shipping' ? 'Envío' : 'Facturación'}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{addr.address_line1}, {addr.city}</p>
                  <p className="text-xs text-gray-400 mt-2">{addr.postal_code}</p>
                </div>
              ))}
              {addresses.length === 0 && (
                <p className="text-red-500 font-medium">No has registrado direcciones.</p>
              )}
            </div>
          </section>

          {/* Section: Payment */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-blue-600">
                <CreditCardIcon className="h-7 w-7 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Método de Pago</h2>
              </div>
              <button 
                onClick={() => navigate('/profile')} 
                className="text-blue-600 font-bold text-sm flex items-center hover:underline"
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Gestionar
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map(pm => (
                <div 
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedPayment === pm.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${selectedPayment === pm.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCardIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 capitalize">{pm.brand} •••• {pm.last4}</p>
                    <p className="text-sm text-gray-500">Expira {pm.exp_month}/{pm.exp_year}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === pm.id ? 'border-blue-600' : 'border-gray-300'}`}>
                    {selectedPayment === pm.id && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-red-500 font-medium">No has registrado métodos de pago.</p>
              )}
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Resumen</h2>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50 mb-8">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-900 pt-3">
                <span>Total</span>
                <span className="text-blue-600">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              disabled={processing || !selectedAddress || !selectedPayment}
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center uppercase tracking-widest"
            >
              {processing ? 'Procesando...' : (
                <>
                  <ShieldCheckIcon className="w-6 h-6 mr-2" />
                  Pagar Ahora
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center text-xs text-gray-400 font-medium">
              <LockClosedIcon className="w-4 h-4 mr-1" />
              Pago 100% Seguro por Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icons
const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export default Checkout;