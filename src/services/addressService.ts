import { api } from './api';

export interface Address {
  id?: number;
  user_id?: number;
  address_type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export const addressService = {
  async getUserAddresses(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  },

  async getAddressById(addressId: number): Promise<Address> {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data;
  },

  async createAddress(addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  async updateAddress(addressId: number, addressData: Partial<Address>): Promise<Address> {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  },

  async deleteAddress(addressId: number): Promise<void> {
    await api.delete(`/addresses/${addressId}`);
  },

  async setDefaultAddress(addressId: number): Promise<Address> {
    const response = await api.patch(`/addresses/${addressId}/set-default`, {});
    return response.data;
  },

  async validateAddressForCheckout(): Promise<{ valid: boolean; hasAddress: boolean }> {
    try {
      const response = await api.get('/addresses/checkout/validate');
      return response.data;
    } catch (error) {
      return { valid: false, hasAddress: false };
    }
  }
};
