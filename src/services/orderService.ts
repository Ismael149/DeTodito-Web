import { api } from './api';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  description: string;
  image_url: string;
  seller_id: number;
  seller_username: string;
  item_status: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancellation_reason?: string;
  refund_status?: string;
  refunded_at?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  shipping_agency: string;
  shipping_cost: number;
  tracking_number?: string;
  payment_status: string;
  billing_address?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer_username: string;
  customer_email: string;
  customer_phone: string;
}

export const orderService = {
  async getUserOrders(): Promise<Order[]> {
    const response = await api.get('/orders/user');
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    return this.getUserOrders();
  },

  async getSellerOrders(): Promise<any[]> {
    const response = await api.get('/orders/seller');
    return response.data;
  },

  async updateItemStatus(itemId: number, statusData: any) {
    const response = await api.patch(`/orders/items/${itemId}/status`, statusData);
    return response.data;
  },

  async generateInvoice(orderId: number) {
    const response = await api.post(`/orders/${orderId}/invoice`, {});
    return response.data;
  },

  async downloadInvoice(orderId: number): Promise<void> {
    try {
      console.log('📄 Generando descarga de factura para orden:', orderId);
      
      const response = await api.get(`/orders/${orderId}/invoice/download`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-orden-${orderId}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Descarga iniciada');
    } catch (error: any) {
      console.error('❌ Error descargando factura:', error);
      throw new Error('Error al descargar la factura');
    }
  }
};