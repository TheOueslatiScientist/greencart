export type Badge = "bio" | "local" | "antigaspi" | "promo" | "saison";

export interface Producer {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  coverImage: string;
  location: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  description: string;
  shortBio: string;
  badges: Badge[];
  rating: number;
  reviewCount: number;
  productCount: number;
  joinedAt: string;
  certifications: string[];
  distance?: number;
}

// Simplified type used for map markers
export interface ProducerMarker {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  badges: Badge[];
  rating: number;
  productCount: number;
  avatar: string;
  distanceFromUser?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  badges: Badge[];
  producerId: string;
  producerName: string;
  producerLocation: string;
  stock: number;
  unit: string;
  weight?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  expiresAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  items: CartItem[];
  total: number;
  createdAt: string;
  deliveryAddress?: string;
  producerName: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string;
  producerId?: string;
}
