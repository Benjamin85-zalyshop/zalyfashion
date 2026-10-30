import { StoreSettings, Order, PromoCode } from '../types/ecommerce';
import { INITIAL_PRODUCTS } from './mockProducts';

export const GUINEA_CITIES = [
  { id: 'conakry', name: 'Conakry (Capitale)', fee: 25000, delay: '24h - 48h express' },
  { id: 'nzerekore', name: "N'Zérékoré (Région Forestière)", fee: 60000, delay: '3 à 5 jours ouvrés' },
  { id: 'kankan', name: 'Kankan (Haute-Guinée)', fee: 55000, delay: '3 à 4 jours ouvrés' },
  { id: 'kindia', name: 'Kindia (Basse-Guinée)', fee: 40000, delay: '48h - 72h' },
  { id: 'labe', name: 'Labé (Moyenne-Guinée)', fee: 50000, delay: '3 à 4 jours ouvrés' },
  { id: 'boke', name: 'Boké', fee: 45000, delay: '48h - 72h' },
  { id: 'mamou', name: 'Mamou', fee: 45000, delay: '48h - 72h' },
  { id: 'siguiri', name: 'Siguiri', fee: 60000, delay: '3 à 5 jours ouvrés' },
  { id: 'gueckedou', name: 'Guéckédou', fee: 65000, delay: '4 à 6 jours ouvrés' },
  { id: 'macenta', name: 'Macenta', fee: 65000, delay: '4 à 6 jours ouvrés' },
];

export const CONAKRY_DISTRICTS = [
  'Kaloum (Centre des affaires, Almamya, Boulbinet)',
  'Dixinn (Camayenne, Belle-Vue, Minière, Landréah)',
  'Ratoma (Kipé, Nongo, Lambanyi, Kaporo, Taouyah)',
  'Ratoma (Hamdallaye, Bambéto, Cosa, Koloma)',
  'Matam (Madina, Bonfi, Touguiwondy, Coléah)',
  'Matoto (Yimbaya, Entag, Dabompa, Kissosso, Sangoyah)',
  'Coyah & Sanoyah',
  'Dubréka & Kagbelen'
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'ZALY FASHION',
  slogan: 'Votre style, votre élégance, votre identité.',
  whatsappNumber: '+224625667522',
  phoneContact: '+224 625 66 75 22',
  email: 'contact@zalyfashion.com',
  address: 'Boulevard du Commerce, Almamya, Kaloum, Conakry, Guinée',
  announcementText: '✨ LIVRAISON EXPRESS DISPONIBLE À CONAKRY ET DANS TOUTE LA GUINÉE • PAIEMENT ORANGE MONEY & CASH',
  conakryShippingFee: 25000,
  interiorShippingFee: 60000,
  freeShippingThreshold: 800000,
  orangeMoneyMerchantNumber: '625 66 75 22',
  momoMerchantNumber: '660 12 34 56'
};

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'ZALY10', discountPercent: 10, active: true },
  { code: 'BIENVENUE', discountPercent: 15, minAmount: 500000, active: true },
  { code: 'CONAKRY2026', discountPercent: 20, minAmount: 1000000, active: true },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZLY-2026-8941',
    createdAt: '2026-10-25T14:32:00Z',
    customer: {
      fullName: 'Sekouba Traoré',
      phone: '+224 622 34 56 78',
      whatsapp: '+224 622 34 56 78',
      city: 'Conakry (Capitale)',
      district: 'Ratoma (Kipé, Nongo, Lambanyi, Kaporo, Taouyah)',
      address: 'Villa 14, Rue des Ambassades, Kipé Centre',
      notes: 'Appeler avant de livrer s’il vous plaît'
    },
    items: [
      {
        itemKey: 'prod-h-01-50-blk',
        product: INITIAL_PRODUCTS[0],
        selectedSize: '50',
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1
      }
    ],
    subtotal: 1350000,
    shippingFee: 0, // > 800 000 GNF
    discountAmount: 135000, // ZALY10
    total: 1215000,
    paymentMethod: 'orange_money',
    paymentDetails: {
      transactionRef: 'OM-CI-849204192',
      paidAt: '2026-10-25T14:35:00Z'
    },
    status: 'en_livraison',
    isPaid: true
  },
  {
    id: 'ZLY-2026-8942',
    createdAt: '2026-10-26T09:15:00Z',
    customer: {
      fullName: 'Aissatou Barry',
      phone: '+224 628 90 12 34',
      whatsapp: '+224 628 90 12 34',
      city: 'Conakry (Capitale)',
      district: 'Dixinn (Camayenne, Belle-Vue, Minière, Landréah)',
      address: 'Immeuble Palmier, 2ème étage, Camayenne',
      notes: 'Livraison souhaitée dans l’après-midi'
    },
    items: [
      {
        itemKey: 'prod-f-01-S-emr',
        product: INITIAL_PRODUCTS[5],
        selectedSize: 'S',
        selectedColor: INITIAL_PRODUCTS[5].colors[0],
        quantity: 1
      },
      {
        itemKey: 'prod-ch-03-38-blk',
        product: INITIAL_PRODUCTS[11],
        selectedSize: '38',
        selectedColor: INITIAL_PRODUCTS[11].colors[0],
        quantity: 1
      }
    ],
    subtotal: 1270000,
    shippingFee: 0,
    discountAmount: 0,
    total: 1270000,
    paymentMethod: 'cod',
    status: 'confirmee',
    isPaid: false
  },
  {
    id: 'ZLY-2026-8943',
    createdAt: '2026-10-27T08:20:00Z',
    customer: {
      fullName: 'Moussa Kourouma',
      phone: '+224 664 55 66 77',
      whatsapp: '+224 664 55 66 77',
      city: "N'Zérékoré (Région Forestière)",
      district: 'Quartier Commercial, près du grand marché',
      address: 'Boutique Kourouma & Frères',
    },
    items: [
      {
        itemKey: 'prod-ch-01-42-blk',
        product: INITIAL_PRODUCTS[9],
        selectedSize: '42',
        selectedColor: INITIAL_PRODUCTS[9].colors[0],
        quantity: 1
      }
    ],
    subtotal: 580000,
    shippingFee: 60000,
    discountAmount: 0,
    total: 640000,
    paymentMethod: 'mtn_momo',
    paymentDetails: {
      transactionRef: 'MOMO-GN-7731902'
    },
    status: 'en_attente',
    isPaid: true
  }
];
