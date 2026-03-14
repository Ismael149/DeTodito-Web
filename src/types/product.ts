export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  category_name?: string;
  seller_id: number;
  seller_username?: string;
  image_url: string;
  images?: string[];
  is_active: boolean;
  condition?: 'nuevo' | 'usado';
  created_at?: string;
  updated_at?: string;
}
