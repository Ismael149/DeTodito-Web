import { api } from './api';

export interface PaymentMethod {
  id?: number;
  user_id?: number;
  card_type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodCreate {
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  cardholder_name: string;
  is_default?: boolean;
}

export const paymentService = {
  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payment-methods');
    return response.data;
  },

  async getPaymentMethodById(methodId: number): Promise<PaymentMethod> {
    const response = await api.get(`/payment-methods/${methodId}`);
    return response.data;
  },

  async createPaymentMethod(methodData: PaymentMethodCreate): Promise<PaymentMethod> {
    const response = await api.post('/payment-methods', methodData);
    return response.data;
  },

  async updatePaymentMethod(methodId: number, methodData: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const response = await api.put(`/payment-methods/${methodId}`, methodData);
    return response.data;
  },

  async deletePaymentMethod(methodId: number): Promise<void> {
    await api.delete(`/payment-methods/${methodId}`);
  },

  async setDefaultPaymentMethod(methodId: number): Promise<PaymentMethod> {
    const response = await api.patch(`/payment-methods/${methodId}/set-default`, {});
    return response.data;
  },

  async validatePaymentMethodForCheckout(): Promise<{ valid: boolean; hasMethod: boolean }> {
    try {
      const response = await api.get('/payment-methods/checkout/validate');
      return response.data;
    } catch (error) {
      return { valid: false, hasMethod: false };
    }
  }
};
