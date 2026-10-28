import { Product, Vendor } from '../types/ecommerce';

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
  }
};
