import { api } from './api';

export interface CheckoutData {
  address_id: number;
  payment_method_id: number;
  items: {
    product_id: number;
    quantity: number;
    price: number | string;
  }[];
  shipping_agency?: string;
  shipping_cost?: number;
}

export interface PaymentData {
  paymentMethod: string;
  lastFour: string;
}

export const checkoutService = {
  async createOrder(checkoutData: CheckoutData) {
    const response = await api.post('/checkout/order', checkoutData);
    return response.data;
  },

  async processPayment(orderId: number, paymentData: PaymentData) {
    const response = await api.post(`/checkout/${orderId}/payment`, paymentData);
    return response.data;
  },

  async getCheckoutSummary(cartId: number) {
    const response = await api.get(`/checkout/summary?cart_id=${cartId}`);
    return response.data;
  },

  async completeCheckoutAtomic(checkoutData: CheckoutData, paymentData: PaymentData) {
    const response = await api.post('/checkout/complete-atomic', { 
      ...checkoutData, 
      paymentData 
    });
    return response.data;
  },

  async calculateShipping(addressId: number, cartId: number) {
    const response = await api.post('/checkout/shipping/calculate', {
      address_id: addressId,
      cart_id: cartId
    });
    return response.data;
  }
};
