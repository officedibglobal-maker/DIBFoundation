
import type { Timestamp } from 'firebase/firestore';

export interface ImpactStoreProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  currency: "GHS";
  images: string[];
  primaryImage: string;
  stockQuantity: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  active: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  impactLabel: string;
  impactDescription: string;
  tags: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ImpactStoreCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ImpactStoreOrder {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    region: string;
    country: string;
  };
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: "GHS";
  paymentMethod: "test" | "paystack" | "stripe" | "bank-transfer";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfillmentStatus:
    | "new"
    | "processing"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  customerNotes: string;
  adminNotes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ImpactStoreSettings {
  storeName: "DIBF Impact Store";
  currency: "GHS";
  storeEnabled: true;
  checkoutEnabled: true;
  inventoryEnabled: true;
  showOutOfStockProducts: true;
  freeShippingThreshold: 500;
  standardShippingFee: 30;
  supportEmail: string;
  supportPhone: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  announcementEnabled: true;
  announcementText: string;
  impactMessage: string;
  updatedAt: Timestamp;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  allowBackorder: boolean;
}
