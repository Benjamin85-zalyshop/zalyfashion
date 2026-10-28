import { CartItem, CustomerDeliveryInfo, OrderVerificationResult, PaymentMethod, PromoCode } from '../types/ecommerce';
import { GUINEA_CITIES } from '../data/initialData';

export class OrderValidatorService {
  /**
   * Vérification des prix, des stocks et des calculs côté serveur
   */
  static verifyOrder({
    items,
    masterProducts,
    promoCode,
    cityId,
    freeShippingThreshold,
    conakryShippingFee,
    interiorShippingFee,
  }: {
    items: CartItem[];
    masterProducts: any[];
    promoCode?: PromoCode | null;
    cityId: string;
    freeShippingThreshold: number;
    conakryShippingFee: number;
    interiorShippingFee: number;
  }): OrderVerificationResult {
    const errors: string[] = [];
    let verifiedSubtotal = 0;
    let stockOk = true;

    // 1. Vérification stricte des prix unitaires et des stocks réels
    for (const item of items) {
      const realProduct = masterProducts.find((p) => p.id === item.product.id);
      if (!realProduct) {
        errors.push(`Produit introuvable sur le serveur : ID ${item.product.id}`);
        continue;
      }

      // Vérification du stock
      if (!realProduct.inStock || realProduct.stockCount < item.quantity) {
        errors.push(
          `Stock insuffisant pour « ${realProduct.name} » : ${realProduct.stockCount} disponible(s), ${item.quantity} demandée(s).`
        );
        stockOk = false;
      }

      // Prix officiel côté serveur (ignore toute modification côté client)
      const officialUnitPrice = realProduct.price;
      verifiedSubtotal += officialUnitPrice * item.quantity;
    }

    // 2. Calcul officiel des frais de livraison
    let verifiedShippingFee = 0;
    if (verifiedSubtotal < freeShippingThreshold) {
      const city = GUINEA_CITIES.find((c) => c.id === cityId);
      if (city) {
        verifiedShippingFee = city.id === 'conakry' ? conakryShippingFee : city.fee;
      } else {
        verifiedShippingFee = conakryShippingFee;
      }
    }

    // 3. Vérification du code promo côté serveur
    let verifiedDiscount = 0;
    if (promoCode && promoCode.active) {
      if (!promoCode.minAmount || verifiedSubtotal >= promoCode.minAmount) {
        verifiedDiscount = Math.round((verifiedSubtotal * promoCode.discountPercent) / 100);
      } else {
        errors.push(
          `Le code promo ${promoCode.code} requiert un panier minimum de ${promoCode.minAmount} GNF.`
        );
      }
    }

    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedShippingFee);

    return {
      isValid: errors.length === 0 && stockOk,
      verifiedSubtotal,
      verifiedShippingFee,
      verifiedDiscount,
      verifiedTotal,
      errors,
      stockOk
    };
  }

  /**
   * Sécurisation du statut de paiement :
   * Ne simule JAMAIS la réussite d'un paiement électronique sans passerelle bancaire réelle.
   */
  static determineInitialPaymentState(
    paymentMethod: PaymentMethod,
    transactionRef?: string
  ): {
    isPaid: boolean;
    verificationNotes: string;
    status: 'en_attente' | 'confirmee';
  } {
    if (paymentMethod === 'cod') {
      return {
        isPaid: false,
        verificationNotes: 'Paiement en espèces prévu à la livraison lors de la remise en main propre.',
        status: 'en_attente'
      };
    }

    if (paymentMethod === 'orange_money') {
      return {
        isPaid: false, // NON SIMULÉ : En attente de validation réelle par le commerçant
        verificationNotes: `Réf Orange Money transmise : ${transactionRef || 'Non fournie'}. En attente de confirmation par le marchand via USSD/relevé.`,
        status: 'en_attente'
      };
    }

    if (paymentMethod === 'mtn_momo') {
      return {
        isPaid: false, // NON SIMULÉ : En attente de validation réelle
        verificationNotes: `Réf MTN MoMo transmise : ${transactionRef || 'Non fournie'}. En attente de vérification sur compte marchand MTN.`,
        status: 'en_attente'
      };
    }

    return {
      isPaid: false,
      verificationNotes: 'Paiement par carte à finaliser avec terminal de paiement électronique (TPE) à la livraison.',
      status: 'en_attente'
    };
  }
}
