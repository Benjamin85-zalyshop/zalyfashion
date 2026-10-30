import { Product, Vendor, UserProfile } from '../types/ecommerce';

/**
 * Service API Hostinger MySQL pour ZALY FASHION
 * Se synchronise automatiquement avec la base de données MySQL sur votre hébergement Hostinger.
 */

export const HostingerApiService = {
  /**
   * Vérifie si l'API PHP Hostinger est accessible
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const res = await fetch('/api/products.php', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Récupère la liste des produits depuis Hostinger MySQL
   */
  async getProducts(): Promise<Product[] | null> {
    try {
      const res = await fetch('/api/products.php');
      if (!res.ok) return null;
      const data = await res.json();
      return data.success && Array.isArray(data.products) ? data.products : null;
    } catch {
      return null;
    }
  },

  /**
   * Enregistre un nouveau produit dans Hostinger MySQL
   */
  async addProduct(product: Product): Promise<boolean> {
    try {
      const res = await fetch('/api/products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Supprime un produit dans Hostinger MySQL
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Récupère les commandes depuis Hostinger MySQL
   */
  async getOrders(): Promise<any[] | null> {
    try {
      const res = await fetch('/api/orders.php');
      if (!res.ok) return null;
      const data = await res.json();
      return data.success && Array.isArray(data.orders) ? data.orders : null;
    } catch {
      return null;
    }
  },

  /**
   * Enregistre une commande dans Hostinger MySQL
   */
  async addOrder(order: any): Promise<boolean> {
    try {
      const res = await fetch('/api/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Met à jour le statut d'une commande dans Hostinger MySQL
   */
  async updateOrderStatus(orderId: string, status: string, isPaid?: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', orderId, status, isPaid })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Récupère les boutiques partenaires depuis Hostinger MySQL
   */
  async getVendors(): Promise<Vendor[] | null> {
    try {
      const res = await fetch('/api/vendors.php');
      if (!res.ok) return null;
      const data = await res.json();
      return data.success && Array.isArray(data.vendors) ? data.vendors : null;
    } catch {
      return null;
    }
  },

  /**
   * Enregistre une nouvelle boutique dans Hostinger MySQL
   */
  async addVendor(vendor: Vendor): Promise<boolean> {
    try {
      const res = await fetch('/api/vendors.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Enregistre le paiement d'un abonnement annuel (300 000 GNF) dans Hostinger MySQL
   */
  async paySubscription(vendorId: string, paymentMethod: string, paymentRef: string): Promise<boolean> {
    try {
      const res = await fetch('/api/vendors.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay_subscription',
          vendorId,
          paymentMethod,
          paymentRef
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Inscription d'un client dans Hostinger MySQL
   */
  async registerUser(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    city?: string;
    district?: string;
    address?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    try {
      const res = await fetch('/api/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...payload })
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Erreur réseau avec le serveur Hostinger.' };
    }
  },

  /**
   * Connexion d'un utilisateur (Client ou Administrateur)
   */
  async loginUser(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    try {
      const res = await fetch('/api/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', identifier, password })
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, message: err.message || 'Erreur de connexion au serveur Hostinger.' };
    }
  },

  /**
   * Configuration personnalisée du compte Administrateur
   */
  async setupAdmin(payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    try {
      const res = await fetch('/api/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup_admin', ...payload })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Erreur lors de la configuration admin.' };
    }
  },

  /**
   * Mise à jour du profil utilisateur
   */
  async updateUserProfile(payload: {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', ...payload })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Erreur de mise à jour.' };
    }
  }
};
