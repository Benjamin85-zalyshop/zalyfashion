import { Vendor } from '../types/ecommerce';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vendor-zaly',
    storeName: 'ZALY FASHION Officiel',
    ownerName: 'Maison ZALY Guinée',
    email: 'contact@zalyfashion.gn',
    phone: '+224 625 66 75 22',
    whatsapp: '+224 625 66 75 22',
    city: 'Conakry (Kaloum, Almamya)',
    district: 'Kaloum',
    status: 'actif',
    isOfficialZaly: true,
    joinedAt: '2026-01-01',
    description: 'Boutique amirale et créateur officiel de la collection haute couture ZALY FASHION en Guinée.',
    productsCount: 16,
    pinCode: '1234',
    subscription: {
      status: 'actif',
      trialStartedAt: '2026-01-01T00:00:00Z',
      trialEndsAt: '2026-03-01T00:00:00Z',
      annualFee: 300000,
      expiresAt: '2027-01-01T00:00:00Z',
      lastPaymentDate: '2026-01-01T00:00:00Z'
    }
  },
  {
    id: 'vendor-kankan-couture',
    storeName: 'Atelier Kankan Création',
    ownerName: 'Kaba Keïta',
    email: 'kankan.creation@gmail.com',
    phone: '+224 620 44 55 66',
    whatsapp: '+224 620 44 55 66',
    city: 'Kankan (Haute-Guinée)',
    district: 'Kankan Centre',
    status: 'actif',
    isOfficialZaly: false,
    joinedAt: '2026-02-15',
    description: 'Atelier spécialisé dans les tenues traditionnelles modernisées et le bazin teinté à la main.',
    productsCount: 0,
    pinCode: '1234',
    subscription: {
      status: 'trial',
      trialStartedAt: '2026-02-15T00:00:00Z',
      trialEndsAt: '2026-04-16T00:00:00Z',
      annualFee: 300000
    }
  },
  {
    id: 'vendor-dixinn-leather',
    storeName: 'Dixinn Maroquinerie d’Art',
    ownerName: 'Ousmane Sylla',
    email: 'sylla.leather@gmail.com',
    phone: '+224 628 33 22 11',
    whatsapp: '+224 628 33 22 11',
    city: 'Conakry (Dixinn)',
    district: 'Dixinn Camayenne',
    status: 'actif',
    isOfficialZaly: false,
    joinedAt: '2026-03-01',
    description: 'Artisans maroquiniers travaillant le cuir pleine fleur pour des accessoires et ceintures sur-mesure.',
    productsCount: 0,
    pinCode: '1234',
    subscription: {
      status: 'trial',
      trialStartedAt: '2026-03-01T00:00:00Z',
      trialEndsAt: '2026-05-01T00:00:00Z',
      annualFee: 300000
    }
  }
];
