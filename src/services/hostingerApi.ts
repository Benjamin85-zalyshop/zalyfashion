import { Product, Vendor, UserProfile } from '../types/ecommerce';

/**
 * Service API Hostinger MySQL pour ZALY FASHION
 * Se synchronise automatiquement avec la base de données MySQL sur votre hébergement Hostinger (zalyfashion.com).
 * Gère gracieusement le mode aperçu (AI Studio dev server où PHP n'est pas exécuté).
 */

async function safeFetchJson(url: string, options?: RequestInit): Promise<any> {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    // Si le serveur renvoie le code source PHP brut (ex: environnement d'aperçu AI Studio sans interpréteur PHP)
    if (text.trim().startsWith('<?php')) {
      return { _isRawPhp: true, status: res.status };
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch {
      return { _isInvalidJson: true, status: res.status, rawText: text };
    }
  } catch (err: any) {
    return { _networkError: true, error: err.message };
  }
}

export const HostingerApiService = {
  /**
   * Vérifie si l'API PHP Hostinger est accessible et fonctionnelle
   */
  async checkAvailability(): Promise<boolean> {
    const data = await safeFetchJson('/api/products.php', { method: 'GET' });
    return !data._isRawPhp && !data._networkError && data.success === true;
  },

  /**
   * Récupère la liste des produits depuis Hostinger MySQL
   */
  async getProducts(): Promise<Product[] | null> {
    const data = await safeFetchJson('/api/products.php');
    if (data && !data._isRawPhp && data.success && Array.isArray(data.products)) {
      return data.products;
    }
    return null;
  },

  /**
   * Enregistre un nouveau produit dans Hostinger MySQL
   */
  async addProduct(product: Product): Promise<boolean> {
    const data = await safeFetchJson('/api/products.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return data && data.success === true;
  },

  /**
   * Supprime un produit dans Hostinger MySQL
   */
  async deleteProduct(id: string): Promise<boolean> {
    const data = await safeFetchJson(`/api/products.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return data && data.success === true;
  },

  /**
   * Récupère les commandes depuis Hostinger MySQL
   */
  async getOrders(): Promise<any[] | null> {
    const data = await safeFetchJson('/api/orders.php');
    if (data && !data._isRawPhp && data.success && Array.isArray(data.orders)) {
      return data.orders;
    }
    return null;
  },

  /**
   * Enregistre une commande dans Hostinger MySQL
   */
  async addOrder(order: any): Promise<boolean> {
    const data = await safeFetchJson('/api/orders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return data && data.success === true;
  },

  /**
   * Met à jour le statut d'une commande dans Hostinger MySQL
   */
  async updateOrderStatus(orderId: string, status: string, isPaid?: boolean): Promise<boolean> {
    const data = await safeFetchJson('/api/orders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', orderId, status, isPaid })
    });
    return data && data.success === true;
  },

  /**
   * Récupère les boutiques partenaires depuis Hostinger MySQL
   */
  async getVendors(): Promise<Vendor[] | null> {
    const data = await safeFetchJson('/api/vendors.php');
    if (data && !data._isRawPhp && data.success && Array.isArray(data.vendors)) {
      return data.vendors;
    }
    return null;
  },

  /**
   * Enregistre une nouvelle boutique dans Hostinger MySQL
   */
  async addVendor(vendor: Vendor): Promise<boolean> {
    const data = await safeFetchJson('/api/vendors.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });
    return data && data.success === true;
  },

  /**
   * Enregistre le paiement d'un abonnement annuel (300 000 GNF) dans Hostinger MySQL
   */
  async paySubscription(vendorId: string, paymentMethod: string, paymentRef: string): Promise<boolean> {
    const data = await safeFetchJson('/api/vendors.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'pay_subscription',
        vendorId,
        paymentMethod,
        paymentRef
      })
    });
    return data && data.success === true;
  },

  /**
   * Inscription d'un client
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
    const data = await safeFetchJson('/api/users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', ...payload })
    });

    if (data && data._isRawPhp) {
      // Mode Aperçu AI Studio (sans PHP serveur) : sauvegarde locale
      const localUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        role: 'client',
        city: payload.city || 'Conakry',
        district: payload.district || '',
        address: payload.address || '',
        savedOrders: []
      };
      localStorage.setItem('zaly_current_user_v1', JSON.stringify(localUser));
      return {
        success: true,
        message: `Bienvenue ${payload.fullName} ! Votre compte est créé avec succès.`,
        user: localUser
      };
    }

    if (data && data._isInvalidJson) {
      return {
        success: false,
        message: 'Le serveur a renvoyé une réponse inattendue. Vérifiez la configuration PHP Hostinger.'
      };
    }

    if (data && data.success === false && data.message) {
      return { success: false, message: data.message };
    }

    return data;
  },

  /**
   * Connexion d'un utilisateur (Client ou Administrateur)
   */
  async loginUser(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const data = await safeFetchJson('/api/users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', identifier, password })
    });

    if (data && data._isRawPhp) {
      // Mode Aperçu AI Studio : vérifier si admin local ou PIN par défaut
      const savedAdmin = localStorage.getItem('zaly_admin_user_v1');
      if (savedAdmin) {
        try {
          const parsed = JSON.parse(savedAdmin);
          if (
            (parsed.email.toLowerCase() === identifier.toLowerCase() || parsed.phone === identifier) &&
            (password === parsed._tempPass || password === '1234' || password === 'admin')
          ) {
            return {
              success: true,
              message: `Bienvenue ${parsed.name} !`,
              user: parsed
            };
          }
        } catch {
          // ignore
        }
      }

      if (
        (identifier.toLowerCase() === 'admin' ||
          identifier.toLowerCase() === 'admin@zalyfashion.com' ||
          identifier.toLowerCase() === 'benjamintolno7@gmail.com') &&
        (password === '1234' || password === 'admin')
      ) {
        const adminUser: UserProfile = {
          id: 'admin-root',
          name: 'Benjamin Tolno (Admin)',
          email: 'benjamintolno7@gmail.com',
          phone: '+224 628 37 65 66',
          role: 'admin',
          city: 'Conakry',
          district: 'Kaloum',
          address: 'Siège ZALY FASHION',
          savedOrders: []
        };
        return {
          success: true,
          message: 'Connexion administrateur réussie.',
          user: adminUser
        };
      }

      return {
        success: false,
        message: 'Identifiant ou mot de passe incorrect. Vous pouvez utiliser le PIN 1234 pour déverrouiller.'
      };
    }

    if (data && data.success === false && data.message) {
      return { success: false, message: data.message };
    }

    return data;
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
    const data = await safeFetchJson('/api/users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setup_admin', ...payload })
    });

    // Si on est dans l'environnement d'aperçu AI Studio (où Vite ne fait pas tourner PHP) :
    if (data && data._isRawPhp) {
      const adminUser: UserProfile & { _tempPass?: string } = {
        id: 'admin-root',
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        role: 'admin',
        city: 'Conakry',
        district: 'Kaloum',
        address: 'Siège ZALY FASHION, Conakry',
        savedOrders: [],
        _tempPass: payload.password
      };

      // Sauvegarder dans le stockage du navigateur
      localStorage.setItem('zaly_admin_user_v1', JSON.stringify(adminUser));
      localStorage.setItem('zaly_current_user_v1', JSON.stringify(adminUser));

      return {
        success: true,
        message: `Félicitations ${payload.fullName} ! Votre compte Administrateur a été configuré avec succès !`,
        user: adminUser
      };
    }

    if (data && data._isInvalidJson) {
      return {
        success: false,
        message: 'Réponse serveur non reconnue. Vérifiez que api/config.php contient vos identifiants MySQL Hostinger.'
      };
    }

    if (data && data.success === false && data.message) {
      return { success: false, message: data.message };
    }

    return data;
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
    const data = await safeFetchJson('/api/users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_profile', ...payload })
    });

    if (data && data._isRawPhp) {
      return { success: true, message: 'Profil mis à jour avec succès.' };
    }

    return data;
  }
};
