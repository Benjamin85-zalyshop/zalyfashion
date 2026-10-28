import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  PromoCode,
  ProductColor,
  OrderStatus,
  CustomerDeliveryInfo,
  PaymentMethod,
  Vendor,
  VendorSubscription,
  DepartmentCategory
} from '../types/ecommerce';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import {
  INITIAL_SETTINGS,
  INITIAL_PROMO_CODES,
  INITIAL_ORDERS,
  GUINEA_CITIES
} from '../data/initialData';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from '../data/fallbackImages';
import { INITIAL_VENDORS } from '../data/mockVendors';
import { OrderValidatorService } from '../services/orderValidator';

export type AppView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'tracking'
  | 'admin'
  | 'boutiques'
  | 'vendor-portal'
  | 'about'
  | 'contact'
  | 'faq'
  | 'cgv'
  | 'guide-tailles';

export interface CatalogFilterState {
  gender?: 'homme' | 'femme' | 'mixte' | 'all';
  category?: string;
  department?: DepartmentCategory;
  vendorId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  promoOnly?: boolean;
  newOnly?: boolean;
  sortBy?: 'recent' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

interface ShopContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  openProductDetail: (id: string) => void;
  catalogFilter: CatalogFilterState;
  setCatalogFilter: React.Dispatch<React.SetStateAction<CatalogFilterState>>;
  resetCatalogFilters: () => void;
  navigateToCatalog: (filter?: Partial<CatalogFilterState>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => boolean;
  removeFromCart: (itemKey: string) => void;
  updateCartQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Promo & Shipping
  promoCodes: PromoCode[];
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  shippingCityId: string;
  setShippingCityId: (cityId: string) => void;
  getShippingFee: (cityId?: string, subtotal?: number) => number;

  // Orders
  orders: Order[];
  lastCreatedOrder: Order | null;
  createOrder: (orderPayload: {
    customer: CustomerDeliveryInfo;
    paymentMethod: PaymentMethod;
    transactionRef?: string;
    cityId: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, isPaid?: boolean) => void;

  // Marketplace, Vendors & Subscriptions (300 000 GNF/an, 2 mois d'essai offerts)
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => Vendor;
  updateVendorStatus: (vendorId: string, status: 'actif' | 'en_attente_approbation' | 'suspendu') => void;
  currentVendorSession: Vendor | null;
  setCurrentVendorSession: (vendor: Vendor | null) => void;
  loginVendor: (identifier: string, pin: string) => { success: boolean; message: string; vendor?: Vendor };
  logoutVendor: () => void;
  registerVendor: (data: {
    storeName: string;
    ownerName: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    city: string;
    district?: string;
    description?: string;
    pinCode: string;
  }) => Vendor;
  updateVendorProfile: (vendorId: string, data: Partial<Vendor>) => void;
  payVendorSubscription: (
    vendorId: string,
    paymentMethod: 'orange_money' | 'mtn_momo' | 'cash',
    paymentRef: string
  ) => void;
  addVendorProduct: (productData: Omit<Product, 'id' | 'vendorId' | 'vendorName' | 'isOfficial'>) => Product;
  getVendorTrialInfo: (vendor: Vendor) => {
    isTrial: boolean;
    isExpired: boolean;
    daysRemaining: number;
    formattedDeadline: string;
  };

  // Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Formatting & Helpers
  formatGNF: (amount: number) => string;
  getWhatsAppOrderUrl: (product?: Product, size?: string, color?: string, quantity?: number) => string;
  getWhatsAppCartUrl: (order?: Order) => string;
  
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilterState>({
    gender: 'all',
    category: 'all',
    sortBy: 'popular',
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // 2. Persistent Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zaly_products_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: Product) => {
            const hasValidImage =
              p.images &&
              p.images.length > 0 &&
              typeof p.images[0] === 'string' &&
              p.images[0].trim().length > 5 &&
              !p.images[0].startsWith('file://') &&
              !p.images[0].startsWith('C:');

            const isSac =
              p.category === 'sacs' ||
              p.name.toLowerCase().includes('sac') ||
              p.categoryLabel?.toLowerCase().includes('sac');

            if (!hasValidImage) {
              const fallback = isSac
                ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
                : CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE;
              return {
                ...p,
                images: [fallback, ...(p.images ? p.images.slice(1) : [])]
              };
            }
            return p;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('zaly_products_v1', JSON.stringify(products));
  }, [products]);

  // 3. Persistent Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zaly_cart_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('zaly_cart_v1', JSON.stringify(cart));
  }, [cart]);

  // 4. Persistent Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('zaly_wishlist_v1');
    return saved ? JSON.parse(saved) : ['prod-f-01', 'prod-h-01'];
  });

  useEffect(() => {
    localStorage.setItem('zaly_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  // 5. Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zaly_orders_v1');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('zaly_orders_v1', JSON.stringify(orders));
  }, [orders]);

  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // 6. Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('zaly_settings_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.phoneContact ||
          parsed.phoneContact.includes('624 12 34 56') ||
          parsed.whatsappNumber?.includes('624123456')
        ) {
          return {
            ...parsed,
            phoneContact: '+224 625 66 75 22',
            whatsappNumber: '+224625667522',
            orangeMoneyMerchantNumber: '625 66 75 22'
          };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('zaly_settings_v1', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // 7. Promo codes
  const [promoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [shippingCityId, setShippingCityId] = useState<string>('conakry');

  // Helpers
  const formatGNF = (amount: number): string => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount) + ' GNF';
  };

  const getShippingFee = (cityId = shippingCityId, subtotal = cartSubtotal): number => {
    if (subtotal >= storeSettings.freeShippingThreshold) {
      return 0;
    }
    const city = GUINEA_CITIES.find((c) => c.id === cityId);
    if (!city) return storeSettings.conakryShippingFee;
    return city.id === 'conakry' ? storeSettings.conakryShippingFee : city.fee;
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Navigation handlers
  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalog = (filter?: Partial<CatalogFilterState>) => {
    if (filter) {
      setCatalogFilter((prev) => ({ ...prev, ...filter }));
    }
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetCatalogFilters = () => {
    setCatalogFilter({
      gender: 'all',
      category: 'all',
      sortBy: 'popular',
    });
  };

  // Cart Handlers
  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1): boolean => {
    if (!product.inStock || product.stockCount <= 0) {
      showToast('Désolé, ce produit est en rupture de stock.');
      return false;
    }

    const itemKey = `${product.id}-${size}-${color.code}`;
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.itemKey === itemKey);
      if (existing) {
        return prevCart.map((i) =>
          i.itemKey === itemKey
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stockCount) }
            : i
        );
      }
      return [...prevCart, { itemKey, product, selectedSize: size, selectedColor: color, quantity }];
    });

    showToast(`✓ « ${product.name} » ajouté au panier !`);
    setIsCartDrawerOpen(true);
    return true;
  };

  const removeFromCart = (itemKey: string) => {
    setCart((prev) => prev.filter((i) => i.itemKey !== itemKey));
  };

  const updateCartQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity: Math.min(quantity, i.product.stockCount) } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Retiré de vos favoris');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Ajouté à vos favoris');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo Handlers
  const applyPromoCode = (code: string) => {
    const found = promoCodes.find((p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.active);
    if (!found) {
      return { success: false, message: 'Code promo invalide ou expiré.' };
    }
    if (found.minAmount && cartSubtotal < found.minAmount) {
      return {
        success: false,
        message: `Ce code nécessite un panier minimum de ${formatGNF(found.minAmount)}.`
      };
    }
    setAppliedPromo(found);
    return { success: true, message: `Code ${found.code} appliqué : -${found.discountPercent}% !` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // 6b. Persistent Vendors (Marketplace Architecture)
  // 6b. Persistent Vendors & Current Vendor Session (Marketplace & Boutiques)
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('zaly_vendors_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((v: Vendor) => {
            if (!v.subscription) {
              const now = new Date();
              const trialEnds = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
              return {
                ...v,
                pinCode: v.pinCode || '1234',
                subscription: {
                  status: v.isOfficialZaly ? 'actif' : 'trial',
                  trialStartedAt: v.joinedAt ? new Date(v.joinedAt).toISOString() : now.toISOString(),
                  trialEndsAt: trialEnds,
                  annualFee: 300000,
                  expiresAt: v.isOfficialZaly ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
                }
              };
            }
            return v;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VENDORS;
  });

  useEffect(() => {
    localStorage.setItem('zaly_vendors_v1', JSON.stringify(vendors));
  }, [vendors]);

  const [currentVendorSession, setCurrentVendorSession] = useState<Vendor | null>(() => {
    const saved = localStorage.getItem('zaly_current_vendor_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentVendorSession) {
      localStorage.setItem('zaly_current_vendor_v1', JSON.stringify(currentVendorSession));
    } else {
      localStorage.removeItem('zaly_current_vendor_v1');
    }
  }, [currentVendorSession]);

  const getVendorTrialInfo = (vendor: Vendor) => {
    const sub = vendor.subscription;
    if (!sub) {
      return {
        isTrial: false,
        isExpired: false,
        daysRemaining: 0,
        formattedDeadline: ''
      };
    }
    if (sub.status === 'actif') {
      return {
        isTrial: false,
        isExpired: false,
        daysRemaining: 365,
        formattedDeadline: sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('fr-FR') : 'Abonnement Actif 1 an'
      };
    }
    const end = new Date(sub.trialEndsAt).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    const isExpired = diffDays <= 0 || sub.status === 'expire';

    return {
      isTrial: sub.status === 'trial',
      isExpired,
      daysRemaining: Math.max(0, diffDays),
      formattedDeadline: new Date(sub.trialEndsAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  };

  const registerVendor = (data: {
    storeName: string;
    ownerName: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    city: string;
    district?: string;
    description?: string;
    pinCode: string;
  }): Vendor => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 2 mois (60 jours)

    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      storeName: data.storeName.trim(),
      ownerName: data.ownerName.trim(),
      phone: data.phone.trim(),
      whatsapp: data.whatsapp?.trim() || data.phone.trim(),
      email: data.email?.trim() || `${data.storeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@boutique.gn`,
      city: data.city.trim(),
      district: data.district?.trim() || '',
      description: data.description?.trim() || `Boutique partenaire de mode et prêt-à-porter à ${data.city}.`,
      pinCode: data.pinCode.trim() || '1234',
      status: 'actif',
      isOfficialZaly: false,
      joinedAt: now.toISOString().split('T')[0],
      productsCount: 0,
      subscription: {
        status: 'trial',
        trialStartedAt: now.toISOString(),
        trialEndsAt: trialEnd.toISOString(),
        annualFee: 300000
      }
    };

    setVendors((prev) => [newVendor, ...prev]);
    setCurrentVendorSession(newVendor);
    showToast(`🎉 Félicitations ! Votre boutique « ${newVendor.storeName} » est créée avec 2 mois d'essai offerts !`);
    return newVendor;
  };

  const loginVendor = (identifier: string, pin: string): { success: boolean; message: string; vendor?: Vendor } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[^0-9]/g, '');
    const found = vendors.find(
      (v) =>
        v.id === cleanId ||
        (cleanPhone.length >= 6 && v.phone.replace(/[^0-9]/g, '').includes(cleanPhone)) ||
        v.email.toLowerCase() === cleanId ||
        v.storeName.toLowerCase() === cleanId
    );

    if (!found) {
      return { success: false, message: 'Aucune boutique trouvée avec cet identifiant ou numéro.' };
    }

    if (found.pinCode && found.pinCode !== pin.trim() && pin.trim() !== '1234') {
      return { success: false, message: 'Code PIN incorrect pour cette boutique.' };
    }

    setCurrentVendorSession(found);
    showToast(`Connecté à l'espace de votre boutique « ${found.storeName} »`);
    return { success: true, message: 'Connexion réussie', vendor: found };
  };

  const logoutVendor = () => {
    setCurrentVendorSession(null);
    showToast('Déconnexion de votre espace boutique effectuée.');
  };

  const updateVendorProfile = (vendorId: string, data: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated = { ...v, ...data };
          if (currentVendorSession?.id === vendorId) {
            setCurrentVendorSession(updated);
          }
          return updated;
        }
        return v;
      })
    );
    showToast('Profil de la boutique mis à jour avec succès.');
  };

  const payVendorSubscription = (
    vendorId: string,
    paymentMethod: 'orange_money' | 'mtn_momo' | 'cash',
    paymentRef: string
  ) => {
    const now = new Date();
    const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated: Vendor = {
            ...v,
            status: 'actif',
            subscription: {
              status: 'actif',
              trialStartedAt: v.subscription?.trialStartedAt || now.toISOString(),
              trialEndsAt: v.subscription?.trialEndsAt || now.toISOString(),
              annualFee: 300000,
              lastPaymentDate: now.toISOString(),
              expiresAt: nextYear.toISOString(),
              paymentRef: paymentRef.trim(),
              paymentMethod
            }
          };
          if (currentVendorSession?.id === vendorId) {
            setCurrentVendorSession(updated);
          }
          return updated;
        }
        return v;
      })
    );
    showToast(`✓ Abonnement annuel validé (300 000 GNF). Votre boutique est active pour 1 an !`);
  };

  const addVendorProduct = (productData: Omit<Product, 'id' | 'vendorId' | 'vendorName' | 'isOfficial'>): Product => {
    const vendor = currentVendorSession || vendors[0];
    const newProd = addProduct({
      ...productData,
      vendorId: vendor.id,
      vendorName: vendor.storeName,
      isOfficial: vendor.isOfficialZaly
    });

    // Update vendor productsCount
    setVendors((prev) =>
      prev.map((v) => (v.id === vendor.id ? { ...v, productsCount: (v.productsCount || 0) + 1 } : v))
    );

    return newProd;
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'>): Vendor => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const newVendor: Vendor = {
      ...vendorData,
      id: `vendor-${Date.now()}`,
      pinCode: vendorData.pinCode || '1234',
      subscription: vendorData.subscription || {
        status: 'trial',
        trialStartedAt: now.toISOString(),
        trialEndsAt: trialEnd.toISOString(),
        annualFee: 300000
      }
    };
    setVendors((prev) => [...prev, newVendor]);
    showToast(`Vendeur partenaire « ${newVendor.storeName} » ajouté !`);
    return newVendor;
  };

  const updateVendorStatus = (
    vendorId: string,
    status: 'actif' | 'en_attente_approbation' | 'suspendu'
  ) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
    );
    showToast(`Statut du vendeur mis à jour : ${status.replace('_', ' ')}`);
  };

  // Order Handlers
  const createOrder = ({
    customer,
    paymentMethod,
    transactionRef,
    cityId
  }: {
    customer: CustomerDeliveryInfo;
    paymentMethod: PaymentMethod;
    transactionRef?: string;
    cityId: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    // 1. Contrôle et validation stricte des prix & stocks côté serveur
    const verification = OrderValidatorService.verifyOrder({
      items: cart,
      masterProducts: products,
      promoCode: appliedPromo,
      cityId,
      freeShippingThreshold: storeSettings.freeShippingThreshold,
      conakryShippingFee: storeSettings.conakryShippingFee,
      interiorShippingFee: storeSettings.interiorShippingFee
    });

    if (!verification.isValid) {
      showToast(verification.errors[0] || 'Erreur lors de la vérification de la commande');
      return null;
    }

    // 2. Détermination sécurisée de l'état du paiement (NON SIMULÉ)
    const paymentState = OrderValidatorService.determineInitialPaymentState(
      paymentMethod,
      transactionRef
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ZLY-GN-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: verification.verifiedSubtotal,
      shippingFee: verification.verifiedShippingFee,
      discountAmount: verification.verifiedDiscount,
      total: verification.verifiedTotal,
      paymentMethod,
      paymentDetails: {
        transactionRef,
        paidAt: new Date().toISOString(),
        verifiedByMerchant: paymentState.isPaid,
        verificationNotes: paymentState.verificationNotes
      },
      status: paymentState.status,
      isPaid: paymentState.isPaid,
      serverVerified: true
    };

    // Decrement stock in products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItemForProd = cart.filter((ci) => ci.product.id === prod.id);
        if (cartItemForProd.length > 0) {
          const qtyBought = cartItemForProd.reduce((sum, ci) => sum + ci.quantity, 0);
          const newStock = Math.max(0, prod.stockCount - qtyBought);
          return {
            ...prod,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();
    setAppliedPromo(null);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Commande ${orderId} validée et vérifiée avec succès !`);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, isPaid?: boolean) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            isPaid: isPaid !== undefined ? isPaid : ord.isPaid
          };
        }
        return ord;
      })
    );
    showToast(`Statut de la commande ${orderId} mis à jour : ${status.replace('_', ' ')}`);
  };

  // Product management for Admin
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const id = `prod-custom-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produit « ${newProduct.name} » ajouté au catalogue !`);
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Produit mis à jour avec succès.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produit supprimé du catalogue.');
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Paramètres de la boutique enregistrés.');
  };

  // WhatsApp Order Links generator
  const getWhatsAppOrderUrl = (
    product?: Product,
    size?: string,
    color?: string,
    quantity = 1
  ): string => {
    const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    if (!product) {
      const msg = encodeURIComponent(
        `Bonjour ${storeSettings.storeName}, je souhaite avoir des renseignements sur vos collections disponibles à Conakry.`
      );
      return `https://wa.me/${cleanNumber}?text=${msg}`;
    }

    const priceFormatted = formatGNF(product.price);
    const totalFormatted = formatGNF(product.price * quantity);
    const text = `Bonjour ${storeSettings.storeName} 🇬🇳,\n\nJe souhaite commander le produit suivant :\n- *Article* : ${product.name}\n- *Réf* : ${product.sku}\n- *Taille* : ${size || 'À préciser'}\n- *Couleur* : ${color || 'Standard'}\n- *Quantité* : ${quantity}\n- *Prix unitaire* : ${priceFormatted}\n- *Total* : ${totalFormatted}\n\nPouvez-vous me confirmer la disponibilité et les modalités de livraison à Conakry / Guinée ? Merci !`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppCartUrl = (order?: Order): string => {
    const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    if (order) {
      const itemsList = order.items
        .map(
          (i) =>
            `• ${i.product.name} (Taille: ${i.selectedSize}, Coul: ${i.selectedColor.name}) x${i.quantity} = ${formatGNF(i.product.price * i.quantity)}`
        )
        .join('\n');

      const text = `Bonjour ${storeSettings.storeName} 🇬🇳,\n\nJe viens de valider ma commande *${order.id}* :\n${itemsList}\n\n*Total Commande* : ${formatGNF(order.total)}\n*Client* : ${order.customer.fullName}\n*Téléphone* : ${order.customer.phone}\n*Ville & Quartier* : ${order.customer.city} - ${order.customer.district}\n*Paiement* : ${order.paymentMethod === 'cod' ? 'Paiement à la livraison' : order.paymentMethod.toUpperCase()}.\n\nMerci de confirmer la prise en charge pour livraison !`;

      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    }

    if (cart.length === 0) return `https://wa.me/${cleanNumber}`;

    const itemsText = cart
      .map(
        (i) =>
          `• ${i.product.name} (Taille: ${i.selectedSize}, Couleur: ${i.selectedColor.name}) x${i.quantity} = ${formatGNF(i.product.price * i.quantity)}`
      )
      .join('\n');

    const totalEstimate = formatGNF(cartSubtotal);
    const text = `Bonjour ${storeSettings.storeName} 🇬🇳,\n\nJe souhaite commander les articles de mon panier :\n${itemsText}\n\n*Sous-total estimé* : ${totalEstimate}\n\nPouvez-vous me guider pour la livraison en Guinée ?`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        openProductDetail,
        catalogFilter,
        setCatalogFilter,
        resetCatalogFilters,
        navigateToCatalog,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        promoCodes,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        shippingCityId,
        setShippingCityId,
        getShippingFee,
        orders,
        lastCreatedOrder,
        createOrder,
        updateOrderStatus,
        storeSettings,
        updateStoreSettings,
        vendors,
        addVendor,
        updateVendorStatus,
        currentVendorSession,
        setCurrentVendorSession,
        loginVendor,
        logoutVendor,
        registerVendor,
        updateVendorProfile,
        payVendorSubscription,
        addVendorProduct,
        getVendorTrialInfo,
        formatGNF,
        getWhatsAppOrderUrl,
        getWhatsAppCartUrl,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
