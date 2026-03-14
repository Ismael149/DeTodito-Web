import { api } from './api';

export interface Order {
  id: number;
  invoice_number: string;
  total: number;
  status: string;
  shipping_address: string;
  billing_address?: string;
  payment_method: string;
  payment_status: string;
  shipping_agency?: string;
  shipping_cost: number;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  item_count: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  tracking?: {
    status: string;
    tracking_number?: string;
    shipping_agency?: string;
    shipped_at?: string;
    estimated_delivery?: string;
    seller_notes?: string;
  };
}

export interface SellerOrder {
  order_item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  buyer_first_name: string;
  buyer_last_name: string;
  order_date: string;
  order_status: string;
  tracking_status: string;
  tracking_number?: string;
  shipping_agency?: string;
  shipped_at?: string;
  estimated_delivery?: string;
  invoice_number: string;
}

export interface TrackingData {
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  shipping_agency?: string;
  shipping_cost?: number;
  estimated_delivery?: string;
  shipped_at?: string;
  seller_notes?: string;
  evidence_images?: Array<{
    url: string;
    description?: string;
  }>;
}

export interface CreateOrderData {
  cart_id: number;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  shipping_agency: string;
  shipping_cost: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export const orderService = {
  // Crear nueva orden
  async createOrder(orderData: CreateOrderData): Promise<{ order: Order; invoice_number: string }> {
    try {
      const response = await api.post('/orders/create', orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la orden');
    }
  },

  // Obtener órdenes del usuario (comprador)
  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders/user/orders');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las órdenes');
    }
  },

  // Obtener órdenes del vendedor
  async getSellerOrders(): Promise<SellerOrder[]> {
    try {
      const response = await api.get('/orders/seller/orders');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las órdenes de venta');
    }
  },

  // Descargar factura en PDF
  async downloadInvoice(orderId: number): Promise<Blob> {
    try {
      const response = await api.get(`/orders/user/invoice/${orderId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al descargar la factura');
    }
  },

  // Actualizar tracking de envío
  async updateTracking(orderItemId: number, trackingData: TrackingData): Promise<any> {
    try {
      const response = await api.put(`/orders/seller/tracking/${orderItemId}`, trackingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el tracking');
    }
  },

  // Obtener notificaciones del vendedor
  async getSellerNotifications(): Promise<any[]> {
    try {
      const response = await api.get('/orders/seller/notifications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener las notificaciones');
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await api.patch(`/orders/seller/notifications/${notificationId}/read`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al marcar la notificación como leída');
    }
  },

  // Cancelar orden
  async cancelOrder(orderId: number, reason: string): Promise<void> {
    try {
      await api.post(`/orders/user/${orderId}/cancel`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cancelar la orden');
    }
  },

  // Obtener detalles de una orden específica
  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await api.get(`/orders/user/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener la orden');
    }
  },

  // Validar si el usuario puede realizar checkout
  async validateCheckout(): Promise<{ valid: boolean; message?: string }> {
    try {
      const response = await api.get('/orders/checkout/validate');
      return response.data;
    } catch (error: any) {
      return { valid: false, message: 'Error al validar checkout' };
    }
  },

  // Utilitario para descargar el PDF en el navegador
  downloadPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};