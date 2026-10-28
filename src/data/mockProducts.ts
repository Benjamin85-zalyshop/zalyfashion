import { Product } from '../types/ecommerce';

export const INITIAL_PRODUCTS: Product[] = [
  // --- HOMME : VESTES & COSTUMES ---
  {
    id: 'prod-h-01',
    name: 'Costume Croisé Impérial Noir',
    slug: 'costume-croise-imperial-noir',
    gender: 'homme',
    category: 'costumes',
    categoryLabel: 'Costumes & Smokings',
    price: 1350000,
    originalPrice: 1550000,
    isPromo: true,
    isPopular: true,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Costume deux pièces coupe ajustée confectionné dans une laine vierge peignée de haute qualité. Finitions intérieures passepoilées dorées, boutons en corozo naturel. Idéal pour les grands événements et rendez-vous d’affaires prestigieux.',
    composition: '100% Laine vierge peignée Super 120s, doublure en satin de soie',
    careInstructions: 'Nettoyage à sec uniquement chez un professionnel',
    sizes: ['48', '50', '52', '54', '56'],
    colors: [
      { name: 'Noir Nuit', hex: '#111111', code: 'blk' },
      { name: 'Bleu Minuit', hex: '#0f172a', code: 'navy' },
      { name: 'Gris Anthracite', hex: '#334155', code: 'grey' }
    ],
    sku: 'ZLY-HOM-CST-01',
    reviews: [
      {
        id: 'rev-01',
        author: 'Mamadou Diallo',
        city: 'Conakry (Kipé)',
        rating: 5,
        date: '14 Octobre 2026',
        comment: 'Qualité de tissu remarquable ! Reçu en 24h à Kipé. La coupe tombe parfaitement.',
        verified: true
      },
      {
        id: 'rev-02',
        author: 'Ibrahima Sory Camara',
        city: 'Conakry (Almamya)',
        rating: 5,
        date: '02 Octobre 2026',
        comment: 'Très impressionné par l’emballage luxe et le service client WhatsApp. Je recommande ZALY.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-h-02',
    name: 'Blazer Casual Laine & Soie Crème',
    slug: 'blazer-casual-laine-soie-creme',
    gender: 'homme',
    category: 'vestes',
    categoryLabel: 'Vestes & Blazers',
    price: 890000,
    originalPrice: 980000,
    isPromo: false,
    isNew: true,
    isPopular: true,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Veste déstructurée et aérée au tombé naturel. Épaules souples napolitaines, poches plaquées pour une élégance décontractée sous le climat tropical.',
    composition: '75% Laine légère, 25% Soie sauvage',
    careInstructions: 'Nettoyage à sec spécialisé',
    sizes: ['48', '50', '52', '54'],
    colors: [
      { name: 'Beige Crème', hex: '#d6c7b2', code: 'cream' },
      { name: 'Vert Forêt', hex: '#1e3a2f', code: 'forest' }
    ],
    sku: 'ZLY-HOM-BLZ-02'
  },
  {
    id: 'prod-h-03',
    name: 'Chemise Slim Fit Popeline d’Égypte',
    slug: 'chemise-slim-fit-popeline-egypte',
    gender: 'homme',
    category: 'chemises',
    categoryLabel: 'Chemises Homme',
    price: 340000,
    originalPrice: 390000,
    isPromo: true,
    isPopular: true,
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620012253295-c15c429fccf8?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Chemise habillée en coton égyptien à fibres extra-longues. Col italien renforcé, poignets biseautés ajustables. Tissage infroissable idéal pour toute la journée.',
    composition: '100% Coton d’Égypte double retors',
    careInstructions: 'Lavage en machine à 30°C, repassage doux',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blanc Pur', hex: '#ffffff', code: 'wht' },
      { name: 'Bleu Ciel', hex: '#bae6fd', code: 'sky' },
      { name: 'Noir Profond', hex: '#18181b', code: 'blk' }
    ],
    sku: 'ZLY-HOM-CHM-03'
  },
  {
    id: 'prod-h-04',
    name: 'Polo Piqué Signature Boutons Nacre',
    slug: 'polo-pique-signature-boutons-nacre',
    gender: 'homme',
    category: 'polos',
    categoryLabel: 'Polos & Casual',
    price: 250000,
    isNew: true,
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 15,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Polo intemporel en maille piquée dense et respirante. Col tricoté qui conserve sa tenue, fentes latérales renforcées pour un confort optimal.',
    composition: '100% Coton peigné mercerisé',
    careInstructions: 'Lavage délicat à l’envers',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vert Émeraude', hex: '#064e3b', code: 'emr' },
      { name: 'Bordeaux Profond', hex: '#881337', code: 'burg' },
      { name: 'Blanc Neige', hex: '#f8fafc', code: 'wht' }
    ],
    sku: 'ZLY-HOM-POL-04'
  },
  {
    id: 'prod-h-05',
    name: 'Pantalon Tailoring Chino Stretch Beige',
    slug: 'pantalon-tailoring-chino-stretch-beige',
    gender: 'homme',
    category: 'pantalons',
    categoryLabel: 'Pantalons & Chinos',
    price: 360000,
    originalPrice: 420000,
    isPromo: true,
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewCount: 22,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Coupe semi-ajustée moderne avec pli central pressé. Ceinture à passants avec doublure antiglisse et poches italiennes passepoilées.',
    composition: '97% Coton twill fin, 3% Élasthanne',
    careInstructions: 'Lavage à 30°C, séchage à l’air libre',
    sizes: ['40', '42', '44', '46', '48'],
    colors: [
      { name: 'Sable Doré', hex: '#d4b996', code: 'sand' },
      { name: 'Bleu Marine', hex: '#1e293b', code: 'navy' }
    ],
    sku: 'ZLY-HOM-PNT-05'
  },

  // --- FEMME : ROBES, ENSEMBLES & TENUES ÉLÉGANTES ---
  {
    id: 'prod-f-01',
    name: 'Robe Fourreau Soie Satinée Émeraude',
    slug: 'robe-fourreau-soie-satinee-emeraude',
    gender: 'femme',
    category: 'robes',
    categoryLabel: 'Robes de Soirée & Gala',
    price: 780000,
    originalPrice: 920000,
    isPromo: true,
    isPopular: true,
    isNew: true,
    inStock: true,
    stockCount: 9,
    rating: 5.0,
    reviewCount: 48,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Une silhouette sculpturale d’une sensualité raffinée. Décolleté bénitier fluide, fente latérale discrète et dos nu plongeant orné de fines lanières croisées. Pour toutes vos soirées d’exception à Conakry.',
    composition: '95% Soie fluide d’Italie, 5% Élasthanne',
    careInstructions: 'Nettoyage à sec uniquement',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Vert Émeraude', hex: '#047857', code: 'emr' },
      { name: 'Rouge Rubis', hex: '#9f1239', code: 'ruby' },
      { name: 'Noir Onyx', hex: '#09090b', code: 'onyx' }
    ],
    sku: 'ZLY-FEM-ROB-01',
    reviews: [
      {
        id: 'rev-f-01',
        author: 'Fatoumata Binta Bah',
        city: 'Conakry (Camayenne)',
        rating: 5,
        date: '20 Octobre 2026',
        comment: 'La robe est sublime, le satin a un reflet luxueux magnifique en vrai ! Portée à un gala, compliments garantis.',
        verified: true
      }
    ]
  },
  {
    id: 'prod-f-02',
    name: 'Tailleur Pantalon Haute Couture Terracotta',
    slug: 'tailleur-pantalon-haute-couture-terracotta',
    gender: 'femme',
    category: 'ensembles',
    categoryLabel: 'Ensembles & Tailleurs',
    price: 950000,
    isPopular: true,
    isNew: true,
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviewCount: 27,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Ensemble veste croisée cintrée et pantalon palazzo taille haute à pinces. Équilibre parfait entre puissance, féminité et prestige contemporain.',
    composition: 'Twill de viscose lourde et crêpe stretch',
    careInstructions: 'Nettoyage à sec recommandé',
    sizes: ['36', '38', '40', '42'],
    colors: [
      { name: 'Terracotta Intense', hex: '#9a3412', code: 'terra' },
      { name: 'Blanc Ivoire', hex: '#fdfbf7', code: 'ivory' },
      { name: 'Noir Intemporel', hex: '#18181b', code: 'blk' }
    ],
    sku: 'ZLY-FEM-ENS-02'
  },
  {
    id: 'prod-f-03',
    name: 'Chemisier Mousseline Soie à Nœud Lavallière',
    slug: 'chemisier-mousseline-soie-noeud-lavalliere',
    gender: 'femme',
    category: 'chemisiers',
    categoryLabel: 'Chemisiers & Tops',
    price: 380000,
    originalPrice: 440000,
    isPromo: true,
    inStock: true,
    stockCount: 16,
    rating: 4.8,
    reviewCount: 14,
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Chemisier vaporeux au drapé exceptionnel. Col montant transformable avec ruban lavallière nouable, poignets froncés à boutons dorés sculptés.',
    composition: '100% Crêpe georgette de soie',
    careInstructions: 'Lavage main à froid ou pressing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivoire Doré', hex: '#fef3c7', code: 'gold' },
      { name: 'Rose Poudré', hex: '#fce7f3', code: 'pink' }
    ],
    sku: 'ZLY-FEM-CHM-03'
  },
  {
    id: 'prod-f-04',
    name: 'Jupe Midi Plissée Métallisée Soleil',
    slug: 'jupe-midi-plissee-metallisee-soleil',
    gender: 'femme',
    category: 'jupes',
    categoryLabel: 'Jupes & Bas',
    price: 390000,
    isNew: true,
    inStock: true,
    stockCount: 11,
    rating: 4.7,
    reviewCount: 18,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Jupe midi au plissé accordéon permanent créant des jeux de lumière spectaculaires en mouvement. Taille élastiquée en lurex doré.',
    composition: 'Polyester plissé technique satiné',
    careInstructions: 'Lavage délicat à l’eau froide, suspendre sans repasser',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Champagne Givré', hex: '#fae8b6', code: 'champ' },
      { name: 'Bronze Métallique', hex: '#78350f', code: 'bronz' }
    ],
    sku: 'ZLY-FEM-JUP-04'
  },

  // --- CHAUSSURES HOMME & FEMME ---
  {
    id: 'prod-ch-01',
    name: 'Mocassins Mors Doré en Cuir Glacé Italien',
    slug: 'mocassins-mors-dore-cuir-glace-italien',
    gender: 'homme',
    category: 'mocassins',
    categoryLabel: 'Chaussures de Ville Homme',
    price: 580000,
    originalPrice: 650000,
    isPromo: true,
    isPopular: true,
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 31,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Mocassins prestigieux confectionnés selon le montage Blake. Cuir de veau pleine fleur glacé à la main, boucle mors équestre dorée et semelle en cuir cousu avec insert en gomme antidérapant.',
    composition: 'Tige 100% Cuir pleine fleur, semelle cuir & patin gomme',
    careInstructions: 'Cirage régulier avec crème incolore de qualité',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Noir Brillant', hex: '#0a0a0a', code: 'blk' },
      { name: 'Brun Havana', hex: '#451a03', code: 'brn' }
    ],
    sku: 'ZLY-CHS-MOC-01'
  },
  {
    id: 'prod-ch-02',
    name: 'Sneakers Luxe Monogramme Semelle Épaisse',
    slug: 'sneakers-luxe-monogramme-semelle-epaisse',
    gender: 'mixte',
    category: 'baskets',
    categoryLabel: 'Baskets & Sneakers',
    price: 520000,
    isPopular: true,
    isNew: true,
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Baskets urbaines streetwear de luxe avec empiècements en daim et cuir nappa. Semelle compensée ultra-légère à mémoire de forme pour un confort de marche absolu.',
    composition: 'Cuir suédé, mesh respirant, semelle EVA haute densité',
    careInstructions: 'Nettoyer avec une mousse nettoyante pour sneakers',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Blanc & Crème', hex: '#fafaf9', code: 'wht' },
      { name: 'Noir & Or', hex: '#1c1917', code: 'goldblk' }
    ],
    sku: 'ZLY-CHS-SNK-02'
  },
  {
    id: 'prod-ch-03',
    name: 'Escarpins Stiletto Cuir Verni 10cm',
    slug: 'escarpins-stiletto-cuir-verni-10cm',
    gender: 'femme',
    category: 'talons',
    categoryLabel: 'Chaussures Femme & Talons',
    price: 490000,
    originalPrice: 560000,
    isPromo: true,
    inStock: true,
    stockCount: 10,
    rating: 5.0,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'L’élégance intemporelle à son apogée. Bout pointu affiné, cambrure étudiée pour le confort et talon aiguille vertigineux signature de ZALY FASHION.',
    composition: 'Cuir verni véritable, première de propreté matelassée',
    careInstructions: 'Frotter délicatement avec un chiffon doux humide',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Noir Verni', hex: '#000000', code: 'blk' },
      { name: 'Rouge Carmin', hex: '#b91c1c', code: 'red' },
      { name: 'Nude Poudré', hex: '#fed7aa', code: 'nude' }
    ],
    sku: 'ZLY-CHS-ESC-03'
  },

  // --- ACCESSOIRES & MAROQUINERIE ---
  {
    id: 'prod-acc-01',
    name: 'Sac Cabas Grand Format Cuir Grainé',
    slug: 'sac-cabas-grand-format-cuir-graine',
    gender: 'femme',
    category: 'sacs',
    categoryLabel: 'Sacs & Maroquinerie',
    price: 680000,
    originalPrice: 790000,
    isPromo: true,
    isPopular: true,
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewCount: 23,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Maroquinerie de prestige avec cadenas et clé amovibles dorés. Double anse en cuir roulé, bandoulière amovible et multiples compartiments zippés intérieurs.',
    composition: '100% Cuir de vachette grainé, ferrures galvanisées or 24K',
    careInstructions: 'Conserver dans son pochon de protection fourni',
    sizes: ['Taille Unique (35x28x14 cm)'],
    colors: [
      { name: 'Caramel Fauve', hex: '#b45309', code: 'tan' },
      { name: 'Noir Ebène', hex: '#171717', code: 'blk' }
    ],
    sku: 'ZLY-ACC-SAC-01'
  },
  {
    id: 'prod-acc-02',
    name: 'Montre Chronographe Royal Acier & Or Rose',
    slug: 'montre-chronographe-royal-acier-or-rose',
    gender: 'mixte',
    category: 'montres',
    categoryLabel: 'Montres & Horlogerie',
    price: 920000,
    isPopular: true,
    isNew: true,
    inStock: true,
    stockCount: 10,
    rating: 5.0,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Boîtier en acier inoxydable chirurgical 316L avec lunette ciselée or rose. Verre saphir inrayable, mouvement quartz chronographe de haute précision et étanchéité 5 ATM.',
    composition: 'Acier inoxydable brossé et plaquage or rose PVD',
    careInstructions: 'Nettoyage avec un chiffon microfibre',
    sizes: ['Cadran 41mm'],
    colors: [
      { name: 'Acier & Or Rose', hex: '#e0a96d', code: 'rosegold' },
      { name: 'Argent & Noir', hex: '#94a3b8', code: 'silver' }
    ],
    sku: 'ZLY-ACC-MNT-02'
  },
  {
    id: 'prod-acc-03',
    name: 'Ceinture Réversible Cuir & Boucle Monogramme',
    slug: 'ceinture-reversible-cuir-boucle-monogramme',
    gender: 'homme',
    category: 'ceintures',
    categoryLabel: 'Ceintures & Maroquinerie',
    price: 240000,
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Ceinture réversible offrant deux looks en un seul geste : un côté en cuir noir lisse et un côté en cuir marron grainé. Boucle amovible en métal brossé.',
    composition: '100% Cuir véritable pleine fleur',
    careInstructions: 'Éviter le contact prolongé avec l’eau',
    sizes: ['90 cm', '100 cm', '110 cm', '120 cm'],
    colors: [
      { name: 'Noir & Marron Réversible', hex: '#1c1917', code: 'rev' }
    ],
    sku: 'ZLY-ACC-CEI-03'
  },
  {
    id: 'prod-acc-04',
    name: 'Lunettes de Soleil Aviateur Verres Polarisés Or',
    slug: 'lunettes-soleil-aviateur-verres-polarises-or',
    gender: 'mixte',
    category: 'lunettes',
    categoryLabel: 'Lunettes & Accessoires',
    price: 280000,
    originalPrice: 350000,
    isPromo: true,
    isNew: true,
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 22,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'Monture ultra-légère en titane doré avec verres dégradés haute définition catégorie 3 anti-éblouissement. Protection UV400 maximale certifiée.',
    composition: 'Titane léger, verres minéraux polarisés',
    careInstructions: 'Livré avec étui rigide et chamoisine microfibre',
    sizes: ['Taille Standard Unisexe'],
    colors: [
      { name: 'Or & Verres Dégradés', hex: '#ca8a04', code: 'gold' },
      { name: 'Noir Total', hex: '#0f172a', code: 'blk' }
    ],
    sku: 'ZLY-ACC-LUN-04'
  }
];
