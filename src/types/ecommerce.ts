export type Gender = 'homme' | 'femme' | 'mixte';

export type UserRole = 'admin' | 'vendeur' | 'client';

export type DepartmentCategory =
  | 'all'
  | 'vetements-homme'
  | 'vetements-femme'
  | 'chaussures-homme'
  | 'chaussures-femme'
  | 'sacs-accessoires'
  | 'nouveautes'
  | 'promotions';

export type ProductCategory =
  // Vêtements Homme
  | 't-shirts'
  | 'chemises'
  | 'polos'
  | 'pantalons'
  | 'jeans'
  | 'costumes'
  | 'vestes'
  | 'survetements'
  | 'shorts'
  // Vêtements Femme
  | 'robes'
  | 'ensembles'
  | 'chemisiers'
  | 'jupes'
  | 'tenues-elegantes'
  | 'decontracte'
  // Chaussures
  | 'baskets'
  | 'chaussures-ville'
  | 'mocassins'
  | 'sandales'
  | 'talons'
  | 'bottines'
  // Accessoires
  | 'sacs'
  | 'ceintures'
  | 'montres'
  | 'lunettes'
  | 'portefeuilles'
  | 'bijoux';

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface VendorSubscription {
  status: 'trial' | 'actif' | 'expire' | 'en_attente_validation';
  trialStartedAt: string; // ISO string
  trialEndsAt: string; // ISO string (60 days from registration)
  annualFee: number; // 300,000 GNF
  lastPaymentDate?: string;
  expiresAt?: string; // 1 year after payment
  paymentRef?: string;
  paymentMethod?: 'orange_money' | 'mtn_momo' | 'cash';
}

export interface Vendor {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  district?: string;
  status: 'actif' | 'en_attente_approbation' | 'suspendu';
  isOfficialZaly: boolean;
  joinedAt: string;
  description: string;
  productsCount: number;
  pinCode?: string;
  logoUrl?: string;
  subscription?: VendorSubscription;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  gender: Gender;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // in GNF
  originalPrice?: number; // in GNF if promo
  isPromo?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  composition: string;
  careInstructions: string;
  sizes: string[];
  colors: ProductColor[];
  sku: string;
  reviews?: ProductReview[];
  // Marketplace Architecture fields
  vendorId?: string;
  vendorName?: string;
  isOfficial?: boolean;
}

export interface CartItem {
  itemKey: string; // `${productId}-${selectedSize}-${colorCode}`
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus =
  | 'en_attente'
  | 'confirmee'
  | 'en_livraison'
  | 'livree'
  | 'annulee';

export type PaymentMethod =
  | 'cod' // Paiement à la livraison
  | 'orange_money' // Orange Money Guinée
  | 'mtn_momo' // MTN Mobile Money
  | 'card'; // Carte bancaire

export interface CustomerDeliveryInfo {
  fullName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  city: string;
  district: string; // Commune ou quartier (ex: Kaloum, Kipé, Nongo, Matam, etc.)
  address: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. ZLY-2026-8941
  createdAt: string;
  customer: CustomerDeliveryInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    transactionRef?: string;
    paidAt?: string;
    verifiedByMerchant?: boolean;
    verificationNotes?: string;
  };
  status: OrderStatus;
  isPaid: boolean;
  serverVerified?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minAmount?: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  whatsappNumber: string; // format international: +224 6XX XX XX XX
  phoneContact: string;
  email: string;
  address: string;
  announcementText: string;
  conakryShippingFee: number; // e.g. 25000 GNF
  interiorShippingFee: number; // e.g. 60000 GNF
  freeShippingThreshold: number; // e.g. 800000 GNF
  orangeMoneyMerchantNumber: string;
  momoMerchantNumber: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  role: UserRole;
  savedOrders: string[];
}

export interface OrderVerificationResult {
  isValid: boolean;
  verifiedSubtotal: number;
  verifiedShippingFee: number;
  verifiedDiscount: number;
  verifiedTotal: number;
  errors: string[];
  stockOk: boolean;
}
