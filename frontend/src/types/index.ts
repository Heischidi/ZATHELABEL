// ── Types for the ZA platform ──

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  public_id?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  category_id?: number;
  category?: Category;
  sizes: string[];
  colors: ProductColor[];
  stock_quantity: number;
  instagram_url?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  item_count: number;
}

export interface OrderItem {
  id: number;
  product_id?: number;
  product_name: string;
  product_image?: string;
  size?: string;
  color?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type PaymentStatus =
  | "awaiting_payment"
  | "payment_confirmed"
  | "payment_failed";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  country: string;
  notes?: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_notes?: string;
  whatsapp_sent: boolean;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderCreateResponse {
  order: Order;
  whatsapp_url: string;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface Wishlist {
  items: WishlistItem[];
  total: number;
}

export interface Delivery {
  id: number;
  order_id: number;
  courier_name?: string;
  tracking_number?: string;
  status: "pending" | "in_transit" | "delivered";
  estimated_delivery?: string;
  notes?: string;
  updated_at: string;
}

export interface SiteSettings {
  brand_name?: string;
  logo_url?: string;
  whatsapp_number?: string;
  delivery_fee?: string;
  hero_banners?: string;
  social_links?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  meta_description?: string;
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  pending_payments: number;
  confirmed_payments: number;
  delivered_orders: number;
  active_customers: number;
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
}

export interface AdminDashboard {
  stats: DashboardStats;
  revenue_chart: RevenueChartPoint[];
  recent_orders: Partial<Order>[];
}

// ── Auth ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ── Checkout ──
export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  country: string;
  notes?: string;
}
