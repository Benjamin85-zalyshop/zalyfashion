import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Store,
  Plus,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Phone,
  MessageCircle,
  MapPin,
  Lock,
  LogOut,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  HelpCircle,
  Trash2,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { ProductCategory, Gender } from '../types/ecommerce';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from '../data/fallbackImages';
import { GUINEA_CITIES, CONAKRY_DISTRICTS } from '../data/initialData';

export const VendorPortalPage: React.FC = () => {
  const {
    currentVendorSession,
    registerVendor,
    loginVendor,
    logoutVendor,
    updateVendorProfile,
    payVendorSubscription,
    addVendorProduct,
    getVendorTrialInfo,
    vendors,
    products,
    deleteProduct,
    orders,
    formatGNF,
    setCurrentView,
    navigateToCatalog,
    storeSettings,
    showToast
  } = useShop();

  // Auth / Registration tabs
  const [activePortalTab, setActivePortalTab] = useState<'register' | 'login'>('register');

  // Registration Form
  const [regStoreName, setRegStoreName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regPhone, setRegPhone] = useState('+224 ');
  const [regWhatsapp, setRegWhatsapp] = useState('+224 ');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('Conakry (Capitale)');
  const [regDistrict, setRegDistrict] = useState(CONAKRY_DISTRICTS[0]);
  const [regDescription, setRegDescription] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regError, setRegError] = useState('');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs (once logged in)
  const [dashboardTab, setDashboardTab] = useState<'products' | 'new-product' | 'orders' | 'subscription' | 'profile'>('products');

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mtn_momo'>('orange_money');
  const [paymentRefInput, setPaymentRefInput] = useState('');

  // New Product Form for Vendor
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('costumes');
  const [prodGender, setProdGender] = useState<Gender>('homme');
  const [prodPrice, setProdPrice] = useState<number>(350000);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodSizesStr, setProdSizesStr] = useState('M, L, XL');
  const [prodColorsStr, setProdColorsStr] = useState('Noir, Bleu Marine');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Products belonging to the logged-in vendor
  const vendorProducts = currentVendorSession
    ? products.filter((p) => p.vendorId === currentVendorSession.id)
    : [];

  // Orders containing products of this vendor
  const vendorOrders = currentVendorSession
    ? orders.filter((o) => o.items.some((item) => item.product.vendorId === currentVendorSession.id))
    : [];

  // Trial & Subscription status
  const trialInfo = currentVendorSession ? getVendorTrialInfo(currentVendorSession) : null;

  // Handle Vendor Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regStoreName.trim()) {
      setRegError('Veuillez entrer le nom de votre boutique.');
      return;
    }
    if (!regOwnerName.trim()) {
      setRegError('Veuillez entrer le nom du gérant / propriétaire.');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length < 8) {
      setRegError('Veuillez renseigner un numéro de téléphone valide en Guinée.');
      return;
    }
    if (!regPin.trim() || regPin.trim().length < 4) {
      setRegError('Veuillez choisir un code PIN secret à 4 chiffres (ex: 2026).');
      return;
    }

    try {
      const created = registerVendor({
        storeName: regStoreName,
        ownerName: regOwnerName,
        phone: regPhone,
        whatsapp: regWhatsapp.trim().length > 5 ? regWhatsapp : regPhone,
        email: regEmail,
        city: regCity,
        district: regDistrict,
        description: regDescription,
        pinCode: regPin
      });

      if (created) {
        setDashboardTab('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setRegError(err.message || "Erreur lors de l'enregistrement de la boutique.");
    }
  };

  // Handle Vendor Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('Veuillez entrer le numéro de téléphone ou nom de la boutique.');
      return;
    }

    const res = loginVendor(loginIdentifier, loginPin);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setDashboardTab('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Payment Submit
  const handlePaySubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVendorSession) return;
    if (!paymentRefInput.trim()) {
      showToast('Veuillez saisir le code ou la référence de la transaction.');
      return;
    }

    payVendorSubscription(currentVendorSession.id, paymentMethod, paymentRefInput);
    setIsPaymentModalOpen(false);
    setPaymentRefInput('');
  };

  // Handle New Product Creation
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVendorSession) return;
    if (!prodName.trim()) {
      showToast('Veuillez donner un nom au produit.');
      return;
    }

    setIsAddingProduct(true);

    const sizes = prodSizesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const colors = prodColorsStr
      .split(',')
      .map((c, idx) => ({
        name: c.trim(),
        hex: idx === 0 ? '#111827' : idx === 1 ? '#1e3a8a' : '#d97706',
        code: `c-${idx}`
      }))
      .filter((c) => c.name.length > 0);

    const cleanImg = prodImageUrl.trim();
    const isValidImg =
      cleanImg.length > 5 &&
      (cleanImg.startsWith('http://') ||
        cleanImg.startsWith('https://') ||
        cleanImg.startsWith('data:image/') ||
        cleanImg.startsWith('/'));

    const finalImage = isValidImg
      ? cleanImg
      : prodCategory === 'sacs' || prodName.toLowerCase().includes('sac')
      ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      : CATEGORY_FALLBACK_IMAGES[prodCategory] || DEFAULT_LUXURY_IMAGE;

    addVendorProduct({
      name: prodName.trim(),
      slug: prodName.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now()}`,
      gender: prodGender,
      category: prodCategory,
      categoryLabel: prodCategory.toUpperCase(),
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      isPromo: Boolean(prodOriginalPrice && prodOriginalPrice > prodPrice),
      isNew: true,
      inStock: prodStock > 0,
      stockCount: prodStock,
      rating: 5,
      reviewCount: 0,
      images: [finalImage],
      description: prodDescription.trim() || `Article de mode haute qualité confectionné par ${currentVendorSession.storeName}.`,
      composition: 'Matière sélectionnée de premier choix.',
      careInstructions: 'Nettoyage à sec ou lavage délicat à la main recommandé.',
      sizes: sizes.length > 0 ? sizes : ['Standard'],
      colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#111', code: 'std' }],
      sku: `VND-${currentVendorSession.storeName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setIsAddingProduct(false);
    // Reset form
    setProdName('');
    setProdPrice(350000);
    setProdOriginalPrice(undefined);
    setProdImageUrl('');
    setProdDescription('');
    setDashboardTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* 1. Header Banner */}
      <div className="bg-neutral-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Marketplace Créateurs & Boutiques de Guinée</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Vendez vos créations sur ZALY FASHION
              </h1>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Rejoignez la plus grande vitrine de mode haut de gamme en Guinée. Exposez vos vêtements, chaussures et maroquinerie avec un accompagnement complet.
              </p>
            </div>

            {/* Trial & Price Card Highlight */}
            <div className="bg-gradient-to-br from-amber-600/30 via-neutral-900 to-amber-950/40 border border-amber-500/50 rounded-2xl p-6 text-center shrink-0 max-w-sm shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
                Offre Spéciale Partenaires 2026
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-serif-luxury my-1">
                2 MOIS D'ESSAI OFFERTS
              </div>
              <p className="text-xs text-amber-200/90 font-medium mb-3">
                100% Gratuit pendant 60 jours sans aucun engagement
              </p>
              <div className="pt-3 border-t border-amber-500/30 text-xs text-stone-300">
                Puis seulement <strong className="text-white font-bold">300 000 GNF / an</strong>
                <span className="block text-[11px] text-stone-400">Moins de 25 000 GNF par mois</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* IF VENDOR IS NOT LOGGED IN */}
        {!currentVendorSession ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Why sell on Zaly benefits (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-900">
                  Pourquoi ouvrir votre boutique sur ZALY ?
                </h2>

                <div className="space-y-4 text-xs text-stone-600">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold border border-amber-500/20">
                      🎁
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">2 Mois d'Essai Totalement Gratuits</h4>
                      <p className="text-stone-500 mt-0.5">
                        Testez la plateforme sans débourser un centime pendant 60 jours. Publiez vos articles et commencez à vendre dès aujourd'hui.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold border border-amber-500/20">
                      💳
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Abonnement Accessible : 300 000 GNF / an</h4>
                      <p className="text-stone-500 mt-0.5">
                        Après vos deux mois offerts, un forfait annuel unique de 300 000 GNF (payable par Orange Money) maintient votre boutique en ligne toute l'année.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold border border-amber-500/20">
                      💬
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Commandes Directes sur votre WhatsApp</h4>
                      <p className="text-stone-500 mt-0.5">
                        Les clients de Conakry et de l'intérieur peuvent commander vos articles directement sur votre propre numéro WhatsApp avec un message pré-rempli.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold border border-amber-500/20">
                      🇬🇳
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Visibilité dans toute la Guinée</h4>
                      <p className="text-stone-500 mt-0.5">
                        Votre vitrine est référencée dans notre annuaire officiel des créateurs et visible par des milliers d'amateurs de mode.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick login helper for demo */}
                <div className="pt-4 border-t border-stone-100 bg-stone-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Boutiques déjà partenaires (Test rapide) :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {vendors.filter((v) => !v.isOfficialZaly).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          loginVendor(v.id, '1234');
                          setDashboardTab('products');
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition shadow-sm text-left"
                      >
                        🏪 {v.storeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Auth Forms (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              {/* Tabs Switcher */}
              <div className="flex border-b border-stone-200 mb-6">
                <button
                  onClick={() => setActivePortalTab('register')}
                  className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
                    activePortalTab === 'register'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  ✨ Créer ma Boutique (2 Mois Gratuits)
                </button>
                <button
                  onClick={() => setActivePortalTab('login')}
                  className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
                    activePortalTab === 'login'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  🔐 Déjà une Boutique ? Connexion
                </button>
              </div>

              {/* REGISTRATION FORM */}
              {activePortalTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  {regError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                      {regError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">
                        Nom de votre Boutique / Marque *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Kaloum Mode & Élégance"
                        value={regStoreName}
                        onChange={(e) => setRegStoreName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">
                        Nom et Prénom du Gérant *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mamadou Diallo"
                        value={regOwnerName}
                        onChange={(e) => setRegOwnerName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">
                        Numéro de Téléphone Appel *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+224 62X XX XX XX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">
                        Numéro WhatsApp Commandes *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+224 62X XX XX XX"
                        value={regWhatsapp}
                        onChange={(e) => setRegWhatsapp(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Ville en Guinée *</label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      >
                        {GUINEA_CITIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Commune / Quartier *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Kaloum Almamya, Kipé, Dixinn..."
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Description & Spécialités de votre boutique
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Spécialiste des costumes italiens, robes de gala et sacs en cuir haut de gamme."
                      value={regDescription}
                      onChange={(e) => setRegDescription(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <label className="font-bold text-amber-950 block">
                      Créez votre Code PIN Secret de Gestion (4 chiffres) *
                    </label>
                    <p className="text-[11px] text-amber-800">
                      Ce code vous permettra de vous reconnecter à votre tableau de bord boutique sur n'importe quel appareil.
                    </p>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      placeholder="Ex: 2026"
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value)}
                      className="w-40 tracking-widest text-base font-mono text-center px-3 py-2 bg-white border border-amber-300 rounded-xl text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  {/* Conditions & Confirmation */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-neutral-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Engagement ZALY FASHION : 2 mois offerts sans aucun paiement requis aujourd'hui</span>
                    </div>
                    <p>
                      Après les 60 jours d'essai, vous pourrez prolonger votre boutique pour 300 000 GNF par an par Orange Money ou MTN MoMo.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lancer ma Boutique Immédiatement (2 Mois Offerts)</span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                </form>
              )}

              {/* LOGIN FORM */}
              {activePortalTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  {loginError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                      {loginError}
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Numéro de Téléphone ou Nom de la Boutique *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: +224 620 44 55 66 ou Atelier Kankan"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Code PIN Secret (4 chiffres) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Code PIN (ex: 1234)"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700 font-mono tracking-widest"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Accéder à mon Espace Boutique</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* IF VENDOR IS LOGGED IN: DASHBOARD */
          <div className="space-y-6">
            {/* Top Bar for Logged-In Vendor */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-bold text-xl shrink-0">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Boutique Partenaire
                    </span>
                    <span className="text-xs text-stone-500">• {currentVendorSession.city}</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900">
                    {currentVendorSession.storeName}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Gérant : <strong>{currentVendorSession.ownerName}</strong> • Tél : {currentVendorSession.phone} • WhatsApp : {currentVendorSession.whatsapp || currentVendorSession.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => {
                    navigateToCatalog({ vendorId: currentVendorSession.id });
                  }}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  <span>Voir ma vitrine client</span>
                </button>

                <button
                  onClick={logoutVendor}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>

            {/* SUBSCRIPTION & TRIAL BANNER */}
            {trialInfo && (
              <div
                className={`rounded-2xl p-5 border shadow-sm transition-all ${
                  trialInfo.isTrial
                    ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-amber-300'
                    : trialInfo.isExpired
                    ? 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-300'
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        trialInfo.isTrial
                          ? 'bg-amber-500/20 text-amber-900'
                          : trialInfo.isExpired
                          ? 'bg-rose-500/20 text-rose-800'
                          : 'bg-emerald-500/20 text-emerald-800'
                      }`}
                    >
                      {trialInfo.isTrial ? (
                        <Clock className="w-6 h-6 text-amber-700" />
                      ) : trialInfo.isExpired ? (
                        <AlertTriangle className="w-6 h-6 text-rose-700" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          {trialInfo.isTrial
                            ? 'Période d’essai gratuit (2 mois offerts)'
                            : trialInfo.isExpired
                            ? 'Période d’essai expirée'
                            : 'Abonnement Annuel Actif'}
                        </span>
                        {trialInfo.isTrial && (
                          <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">
                            {trialInfo.daysRemaining} jour(s) restant(s)
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-0.5">
                        {trialInfo.isTrial
                          ? `Il vous reste ${trialInfo.daysRemaining} jours d'essai gratuit sur vos 2 mois offerts`
                          : trialInfo.isExpired
                          ? 'Votre essai gratuit de 2 mois est arrivé à terme'
                          : 'Votre boutique ZALY FASHION est active pour 1 an'}
                      </h3>

                      <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                        {trialInfo.isTrial ? (
                          <>
                            Profitez pleinement de votre vitrine jusqu'au <strong>{trialInfo.formattedDeadline}</strong>. Vous pouvez anticiper ou régler votre abonnement annuel de <strong>300 000 GNF</strong> à tout moment par Orange Money.
                          </>
                        ) : trialInfo.isExpired ? (
                          <>
                            Pour continuer d'exposer vos articles à des milliers d'acheteurs en Guinée, activez dès maintenant votre abonnement annuel de <strong>300 000 GNF</strong>.
                          </>
                        ) : (
                          <>
                            Abonnement partenaire valide jusqu'au <strong>{trialInfo.formattedDeadline}</strong>.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 ${
                        trialInfo.isExpired
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>
                        {trialInfo.isTrial ? 'Régler mon abonnement (300 000 GNF)' : 'Activer mon abonnement (300 000 GNF)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD NAVIGATION TABS */}
            <div className="flex border-b border-stone-200 overflow-x-auto gap-2 text-xs">
              <button
                onClick={() => setDashboardTab('products')}
                className={`pb-3 px-4 font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                  dashboardTab === 'products'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mes Articles en Rayon ({vendorProducts.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('new-product')}
                className={`pb-3 px-4 font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                  dashboardTab === 'new-product'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Plus className="w-4 h-4 text-amber-700" />
                <span>+ Publier un Nouvel Article</span>
              </button>

              <button
                onClick={() => setDashboardTab('orders')}
                className={`pb-3 px-4 font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                  dashboardTab === 'orders'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Commandes Reçues ({vendorOrders.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('profile')}
                className={`pb-3 px-4 font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                  dashboardTab === 'profile'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Paramètres Boutique</span>
              </button>
            </div>

            {/* TAB CONTENT 1: VENDOR PRODUCTS */}
            {dashboardTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                    Articles de « {currentVendorSession.storeName} »
                  </h3>
                  <button
                    onClick={() => setDashboardTab('new-product')}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Ajouter un article</span>
                  </button>
                </div>

                {vendorProducts.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <Package className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif-luxury text-lg font-bold text-neutral-900">
                      Vous n'avez pas encore d'article en ligne
                    </h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Commencez à exposer vos vêtements, chaussures ou sacs dès maintenant pour que les clients puissent les commander sur WhatsApp.
                    </p>
                    <button
                      onClick={() => setDashboardTab('new-product')}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow"
                    >
                      + Publier mon premier article
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {vendorProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col group"
                      >
                        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                          <img
                            src={p.images[0] || CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                p.category === 'sacs' || p.name.toLowerCase().includes('sac')
                                  ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
                                  : CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE;
                            }}
                            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900 text-amber-300 text-[10px] font-bold uppercase rounded">
                            {p.categoryLabel}
                          </span>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{p.name}</h4>
                            <p className="text-xs font-bold text-amber-800 mt-1">{formatGNF(p.price)}</p>
                            <span className="text-[11px] text-stone-500 block">Stock : {p.stockCount} pièce(s)</span>
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-700 font-semibold">● En rayon</span>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer « ${p.name} » ?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="text-stone-400 hover:text-rose-600 transition p-1"
                              title="Supprimer l'article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: NEW PRODUCT FORM */}
            {dashboardTab === 'new-product' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm max-w-3xl space-y-6">
                <div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-900">
                    Publier un nouvel article
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Cet article sera visible dans le catalogue ZALY FASHION sous le nom de votre boutique <strong>{currentVendorSession.storeName}</strong>.
                  </p>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Nom du Produit *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Veste Croisée en Lin Beige"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Catégorie *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      >
                        <option value="costumes">Costumes & Smokings</option>
                        <option value="vestes">Vestes & Blazers</option>
                        <option value="chemises">Chemises</option>
                        <option value="polos">Polos & T-shirts</option>
                        <option value="pantalons">Pantalons & Chinos</option>
                        <option value="robes">Robes de Soirée & Gala</option>
                        <option value="ensembles">Ensembles & Tailleurs</option>
                        <option value="baskets">Baskets & Sneakers</option>
                        <option value="mocassins">Mocassins en Cuir</option>
                        <option value="talons">Escarpins & Talons</option>
                        <option value="sacs">Sacs & Maroquinerie</option>
                        <option value="montres">Montres & Horlogerie</option>
                        <option value="ceintures">Ceintures</option>
                        <option value="lunettes">Lunettes de soleil</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Rayon / Genre *</label>
                      <select
                        value={prodGender}
                        onChange={(e) => setProdGender(e.target.value as Gender)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      >
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                        <option value="mixte">Mixte</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Prix en GNF *</label>
                      <input
                        type="number"
                        step="10000"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Prix Barré (si promo)</label>
                      <input
                        type="number"
                        step="10000"
                        placeholder="Ex: 400000"
                        value={prodOriginalPrice || ''}
                        onChange={(e) =>
                          setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Tailles disponibles</label>
                      <input
                        type="text"
                        placeholder="Ex: S, M, L, XL ou 40, 41, 42"
                        value={prodSizesStr}
                        onChange={(e) => setProdSizesStr(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Couleurs</label>
                      <input
                        type="text"
                        placeholder="Ex: Noir, Marron, Blanc"
                        value={prodColorsStr}
                        onChange={(e) => setProdColorsStr(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Quantité en Stock *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={prodStock}
                        onChange={(e) => setProdStock(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-700" />
                      <span>Photo du Produit *</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Téléverser depuis votre appareil (PC / Téléphone)
                        </span>
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-dashed border-stone-400 hover:border-amber-800 rounded-xl cursor-pointer transition text-stone-700 hover:text-amber-800 text-xs font-semibold">
                          <Upload className="w-4 h-4 text-amber-700" />
                          <span>Choisir un fichier photo...</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    setProdImageUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Ou coller une URL d'image web
                        </span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={prodImageUrl}
                          onChange={(e) => setProdImageUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                        />
                      </div>
                    </div>

                    {prodImageUrl && (
                      <div className="flex items-center gap-3 pt-2">
                        <img
                          src={prodImageUrl}
                          alt="Aperçu"
                          className="w-14 h-16 object-cover object-top rounded-lg border border-stone-300"
                        />
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ✓ Photo chargée prête à être publiée
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Description courte</label>
                    <textarea
                      rows={3}
                      placeholder="Décrivez les finitions, la coupe et les points forts de ce modèle..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingProduct}
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Mettre en Vente sur ZALY FASHION</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 3: ORDERS */}
            {dashboardTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                  Commandes concernant « {currentVendorSession.storeName} »
                </h3>

                {vendorOrders.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center space-y-2">
                    <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                    <h4 className="font-bold text-sm text-neutral-900">Aucune commande enregistrée pour l'instant</h4>
                    <p className="text-xs text-stone-500">
                      Les commandes passées par vos clients apparaîtront ici avec les coordonnées de livraison en Guinée.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendorOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                          <div>
                            <span className="font-mono font-bold text-sm text-neutral-900">{ord.id}</span>
                            <span className="text-xs text-stone-500 block">
                              Client : <strong>{ord.customer.fullName}</strong> • Tél : {ord.customer.phone}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg uppercase">
                              {ord.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-stone-500 block mt-1">
                              Livraison : {ord.customer.city} ({ord.customer.district})
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Articles de votre boutique :</span>
                          {ord.items
                            .filter((item) => item.product.vendorId === currentVendorSession.id)
                            .map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-1">
                                <span>
                                  {item.product.name} (Taille: {item.selectedSize}) x{item.quantity}
                                </span>
                                <span className="font-bold text-neutral-900">
                                  {formatGNF(item.product.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: PROFILE SETTINGS */}
            {dashboardTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm max-w-2xl space-y-4">
                <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                  Coordonnées de la Boutique
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Nom de la boutique</label>
                    <input
                      type="text"
                      value={currentVendorSession.storeName}
                      onChange={(e) =>
                        updateVendorProfile(currentVendorSession.id, { storeName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Gérant / Propriétaire</label>
                    <input
                      type="text"
                      value={currentVendorSession.ownerName}
                      onChange={(e) =>
                        updateVendorProfile(currentVendorSession.id, { ownerName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Numéro WhatsApp Clientèle</label>
                    <input
                      type="text"
                      value={currentVendorSession.whatsapp || currentVendorSession.phone}
                      onChange={(e) =>
                        updateVendorProfile(currentVendorSession.id, { whatsapp: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={currentVendorSession.description}
                      onChange={(e) =>
                        updateVendorProfile(currentVendorSession.id, { description: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAYMENT MODAL FOR ANNUAL SUBSCRIPTION (300 000 GNF) */}
      {isPaymentModalOpen && currentVendorSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">
                    Abonnement Annuel ZALY FASHION
                  </h3>
                  <span className="text-xs text-stone-500">Boutique : {currentVendorSession.storeName}</span>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Price badge */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase">Tarif Partenaire Annuel</span>
                <p className="text-xs text-stone-600">Accès illimité à la marketplace pendant 1 an</p>
              </div>
              <div className="text-xl font-black text-amber-900 font-serif-luxury">
                {formatGNF(300000)}
              </div>
            </div>

            {/* Instructions Orange Money Guinée */}
            <form onSubmit={handlePaySubscription} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-stone-800 block">Choisissez le moyen de paiement :</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-3 rounded-xl border font-bold text-left transition flex items-center gap-2 ${
                      paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span>Orange Money Guinée</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-xl border font-bold text-left transition flex items-center gap-2 ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>MTN Mobile Money</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-neutral-900 block">Instructions de transfert :</span>
                {paymentMethod === 'orange_money' ? (
                  <p className="text-stone-600 leading-relaxed">
                    Effectuez un transfert de <strong>300 000 GNF</strong> au numéro marchand officiel ZALY FASHION : <strong className="text-orange-600 font-mono text-sm">{storeSettings.phoneContact}</strong>.
                  </p>
                ) : (
                  <p className="text-stone-600 leading-relaxed">
                    Effectuez un transfert de <strong>300 000 GNF</strong> au numéro MTN Mobile Money ZALY : <strong className="text-amber-700 font-mono text-sm">660 12 34 56</strong>.
                  </p>
                )}
                <span className="text-[10px] text-stone-500 block">
                  Collez ci-dessous le code de transaction reçu par SMS pour validation immédiate.
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Référence / Code de la transaction SMS *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: OM-GNF-9482103 ou TXN-2026-89"
                  value={paymentRefInput}
                  onChange={(e) => setPaymentRefInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs text-neutral-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md"
                >
                  Valider mon abonnement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
