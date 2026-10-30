import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, OrderStatus, ProductCategory, Gender } from '../types/ecommerce';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Store,
  Download
} from 'lucide-react';
import {
  CATEGORY_FALLBACK_IMAGES,
  DEFAULT_LUXURY_IMAGE,
  SUGGESTED_CATEGORY_PHOTOS
} from '../data/fallbackImages';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    storeSettings,
    updateStoreSettings,
    formatGNF,
    setCurrentView,
    navigateToCatalog,
    vendors,
    addVendor,
    updateVendorStatus,
    currentUser,
    loginUser,
    setupAdminAccount
  } = useShop();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => currentUser?.role === 'admin');
  const [loginMethod, setLoginMethod] = useState<'pin' | 'credentials' | 'setup'>('pin');
  const [pinCode, setPinCode] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Account Setup state in Settings tab
  const [adminSetupName, setAdminSetupName] = useState(currentUser?.role === 'admin' ? currentUser.name : 'Administrateur ZALY');
  const [adminSetupEmail, setAdminSetupEmail] = useState(currentUser?.role === 'admin' ? currentUser.email : 'admin@zalyfashion.com');
  const [adminSetupPhone, setAdminSetupPhone] = useState(currentUser?.role === 'admin' ? currentUser.phone : '+224 625 66 75 22');
  const [adminSetupPassword, setAdminSetupPassword] = useState('');
  const [adminSetupSuccess, setAdminSetupSuccess] = useState('');
  const [adminSetupError, setAdminSetupError] = useState('');
  const [adminSetupLoading, setAdminSetupLoading] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'vendors' | 'settings'>('analytics');

  // Filter orders by status
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodGender, setProdGender] = useState<Gender>('homme');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('costumes');
  const [prodPrice, setProdPrice] = useState(500000);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodStock, setProdStock] = useState(10);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSizesStr, setProdSizesStr] = useState('S, M, L, XL');
  const [prodVendorId, setProdVendorId] = useState<string>('vendor-zaly');

  // New Vendor Form State
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [newVendorStoreName, setNewVendorStoreName] = useState('');
  const [newVendorOwnerName, setNewVendorOwnerName] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('+224 ');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [newVendorCity, setNewVendorCity] = useState('Conakry');
  const [newVendorDescription, setNewVendorDescription] = useState('');

  // Settings form states
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (loginMethod === 'pin') {
      // PIN access
      if (pinCode === '1234' || pinCode.toLowerCase() === 'admin' || pinCode === '2026') {
        setIsAuthenticated(true);
      } else {
        setAuthError('Code PIN incorrect. Utilisez 1234 ou vos identifiants personnalisés.');
      }
    } else {
      // Credentials login
      setAuthLoading(true);
      try {
        const res = await loginUser(adminEmail.trim(), adminPassword);
        if (res.success && res.user) {
          if (res.user.role === 'admin') {
            setIsAuthenticated(true);
          } else {
            setAuthError('Ce compte est un compte client. Seuls les comptes administrateurs ont accès à cet espace.');
          }
        } else {
          setAuthError(res.message || 'Identifiant ou mot de passe incorrect.');
        }
      } catch {
        setAuthError('Erreur de connexion au serveur.');
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleSetupAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSetupError('');
    setAdminSetupSuccess('');
    setAdminSetupLoading(true);

    try {
      const res = await setupAdminAccount({
        fullName: adminSetupName.trim(),
        email: adminSetupEmail.trim(),
        phone: adminSetupPhone.trim(),
        password: adminSetupPassword
      });

      if (res.success) {
        setAdminSetupSuccess('Compte administrateur créé et enregistré avec succès dans la base MySQL Hostinger !');
        setAdminSetupPassword('');
        setIsAuthenticated(true);
        setTimeout(() => setAdminSetupSuccess(''), 5000);
      } else {
        setAdminSetupError(res.message || 'Erreur lors de la configuration du compte admin.');
      }
    } catch {
      setAdminSetupError('Erreur de communication avec l\'API Hostinger.');
    } finally {
      setAdminSetupLoading(false);
    }
  };

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'annulee' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'en_attente').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = prodSizesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const categoryLabels: { [key: string]: string } = {
      costumes: 'Costumes & Smokings',
      vestes: 'Vestes & Blazers',
      chemises: 'Chemises Homme',
      polos: 'Polos & Casual',
      pantalons: 'Pantalons & Chinos',
      robes: 'Robes de Soirée & Gala',
      ensembles: 'Ensembles & Tailleurs',
      chemisiers: 'Chemisiers & Tops',
      jupes: 'Jupes & Bas',
      baskets: 'Baskets & Sneakers',
      mocassins: 'Chaussures de Ville Homme',
      talons: 'Chaussures Femme & Talons',
      sacs: 'Sacs & Maroquinerie',
      montres: 'Montres & Horlogerie',
      ceintures: 'Ceintures & Maroquinerie',
      lunettes: 'Lunettes & Accessoires'
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    const cleanImg = prodImageUrl?.trim();
    const isValidImg =
      cleanImg &&
      cleanImg.length > 5 &&
      !cleanImg.startsWith('file:') &&
      !cleanImg.startsWith('C:');

    const finalImage = isValidImg
      ? cleanImg
      : CATEGORY_FALLBACK_IMAGES[prodCategory] || DEFAULT_LUXURY_IMAGE;

    const selectedVendor = vendors.find((v) => v.id === prodVendorId) || vendors[0];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        gender: prodGender,
        category: prodCategory,
        categoryLabel: categoryLabels[prodCategory] || prodCategory,
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        stockCount: Number(prodStock),
        inStock: Number(prodStock) > 0,
        description: prodDescription,
        images: [finalImage, ...editingProduct.images.slice(1)],
        sizes,
        vendorId: selectedVendor?.id,
        vendorName: selectedVendor?.storeName,
        isOfficial: selectedVendor?.isOfficialZaly
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: prodName,
        slug: prodName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        gender: prodGender,
        category: prodCategory,
        categoryLabel: categoryLabels[prodCategory] || prodCategory,
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        isPromo: Boolean(prodOriginalPrice && prodOriginalPrice > prodPrice),
        isNew: true,
        isPopular: false,
        inStock: Number(prodStock) > 0,
        stockCount: Number(prodStock),
        rating: 5.0,
        reviewCount: 1,
        images: [finalImage],
        description: prodDescription || 'Pièce de haute qualité confectionnée avec soin par ZALY FASHION.',
        composition: 'Matières sélectionnées de haute qualité',
        careInstructions: 'Nettoyage délicat recommandé',
        sizes: sizes.length > 0 ? sizes : ['M', 'L'],
        colors: [{ name: 'Noir Classique', hex: '#111111', code: 'blk' }],
        sku: `ZLY-${prodGender.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        vendorId: selectedVendor?.id || 'vendor-zaly',
        vendorName: selectedVendor?.storeName || 'ZALY FASHION Officiel',
        isOfficial: selectedVendor ? selectedVendor.isOfficialZaly : true
      });
    }

    setIsAddProductOpen(false);
    resetProductForm();
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdGender(prod.gender);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice);
    setProdStock(prod.stockCount);
    setProdImageUrl(prod.images[0] || '');
    setProdDescription(prod.description);
    setProdSizesStr(prod.sizes.join(', '));
    setProdVendorId(prod.vendorId || 'vendor-zaly');
    setIsAddProductOpen(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(500000);
    setProdOriginalPrice(undefined);
    setProdStock(10);
    setProdImageUrl('');
    setProdDescription('');
    setProdSizesStr('S, M, L, XL');
    setProdVendorId('vendor-zaly');
  };

  const handleSaveNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorStoreName.trim()) return;

    addVendor({
      storeName: newVendorStoreName.trim(),
      ownerName: newVendorOwnerName.trim() || 'Gérant Boutique',
      email: newVendorEmail.trim() || 'contact@boutique.gn',
      phone: newVendorPhone.trim() || '+224 625 66 75 22',
      city: newVendorCity.trim() || 'Conakry',
      status: 'actif',
      isOfficialZaly: false,
      joinedAt: new Date().toISOString().split('T')[0],
      description: newVendorDescription.trim() || 'Boutique partenaire certifiée ZALY Marketplace.',
      productsCount: 0
    });

    setIsAddVendorOpen(false);
    setNewVendorStoreName('');
    setNewVendorOwnerName('');
    setNewVendorPhone('+224 ');
    setNewVendorEmail('');
    setNewVendorDescription('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
  };

  // If not authenticated, show secure login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-500/30 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Espace Administrateur Sécurisé
            </span>
            <h1 className="font-serif-luxury text-2xl font-bold text-neutral-900 mt-1">
              Back-Office ZALY FASHION
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Accès réservé aux gestionnaires de la boutique & showroom
            </p>
          </div>

          {/* Toggle login method : 3 tabs */}
          <div className="grid grid-cols-3 p-1 bg-stone-100 rounded-xl text-[11px] font-bold uppercase tracking-wider gap-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('pin');
                setAuthError('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center whitespace-nowrap ${
                loginMethod === 'pin'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-stone-500 hover:text-neutral-900'
              }`}
            >
              PIN Rapide
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('credentials');
                setAuthError('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center whitespace-nowrap ${
                loginMethod === 'credentials'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-stone-500 hover:text-neutral-900'
              }`}
            >
              Se Connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('setup');
                setAuthError('');
              }}
              className={`py-2 px-1 rounded-lg transition text-center whitespace-nowrap ${
                loginMethod === 'setup'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-800 hover:text-amber-900 font-extrabold'
              }`}
            >
              Créer Compte
            </button>
          </div>

          {/* 1. CODE PIN RAPIDE */}
          {loginMethod === 'pin' && (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Code PIN d'accès immédiat :
                </label>
                <input
                  type="password"
                  placeholder="Code PIN (ex: 1234)"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  autoFocus
                  className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg disabled:opacity-50"
              >
                {authLoading ? 'Vérification...' : "Déverrouiller avec le Code PIN"}
              </button>

              <div className="pt-2 text-center space-y-2">
                <p className="text-[11px] text-stone-500">
                  💡 Le code d'usine est <strong>1234</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('setup');
                    setAuthError('');
                  }}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition"
                >
                  👉 Vous voulez créer votre propre compte Admin ? Cliquez ici
                </button>
              </div>
            </form>
          )}

          {/* 2. CONNEXION PAR EMAIL & MOT DE PASSE */}
          {loginMethod === 'credentials' && (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email ou Téléphone Admin
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: admin@zalyfashion.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mot de passe Administrateur
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg disabled:opacity-50"
              >
                {authLoading ? 'Connexion en cours...' : "Se Connecter à l'Administration"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('setup');
                    setAuthError('');
                  }}
                  className="text-xs text-amber-800 font-bold hover:underline"
                >
                  Pas encore de compte configuré ? Créez-le ici
                </button>
              </div>
            </form>
          )}

          {/* 3. CRÉATION / CONFIGURATION DU COMPTE ADMIN */}
          {loginMethod === 'setup' && (
            <form onSubmit={handleSetupAdminSubmit} className="space-y-3.5 text-left">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                ✨ Définissez vos identifiants administrateur personnels. Ils seront enregistrés directement dans votre base Hostinger MySQL.
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nom de l'Administrateur
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Benjamin Tolno"
                  value={adminSetupName}
                  onChange={(e) => setAdminSetupName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email Admin
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@zalyfashion.com"
                    value={adminSetupEmail}
                    onChange={(e) => setAdminSetupEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Téléphone (Guinée)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+224 6XX XX XX XX"
                    value={adminSetupPhone}
                    onChange={(e) => setAdminSetupPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Choisissez votre Mot de Passe Administrateur
                </label>
                <input
                  type="password"
                  required
                  placeholder="Définissez un mot de passe sécurisé"
                  value={adminSetupPassword}
                  onChange={(e) => setAdminSetupPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                />
              </div>

              {adminSetupError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium">
                  {adminSetupError}
                </div>
              )}

              {adminSetupSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center font-medium">
                  {adminSetupSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={adminSetupLoading}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg disabled:opacity-50"
              >
                {adminSetupLoading ? 'Enregistrement dans MySQL...' : "Créer mon Compte & Ouvrir l'Admin"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* 1. Admin Top Banner */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-widest">
              Back-Office Officiel
            </span>
            <span className="text-xs text-stone-400">• Showroom Conakry</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white mt-1">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-xs text-stone-400">
            Gestion des ventes, catalogue, commandes en Guinée et configuration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/zaly_fashion_hostinger.zip"
            download="zaly_fashion_hostinger.zip"
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            title="Télécharger la version prête pour Hostinger"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger le ZIP Hostinger</span>
          </a>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Voir la boutique client
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-semibold transition"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setAdminTab('analytics')}
          className={`pb-3 px-3 transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'analytics'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Statistiques & Ventes</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`pb-3 px-3 transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'orders'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gestion des Commandes ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-black text-[10px] flex items-center justify-center">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`pb-3 px-3 transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'products'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestion du Catalogue ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('vendors')}
          className={`pb-3 px-3 transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'vendors'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Vendeurs & Marketplace ({vendors.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`pb-3 px-3 transition flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'settings'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres Boutique</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: ANALYTICS & STATS */}
      {adminTab === 'analytics' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Chiffre d'Affaires Réalisé
              </span>
              <div className="text-xl sm:text-2xl font-black text-neutral-900">
                {formatGNF(totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                Commandes confirmées & payées
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Commandes Totales
              </span>
              <div className="text-xl sm:text-2xl font-black text-neutral-900">
                {totalOrdersCount}
              </div>
              <span className="text-[11px] text-amber-700 font-semibold block">
                {pendingOrdersCount} en attente de traitement
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Articles en Catalogue
              </span>
              <div className="text-xl sm:text-2xl font-black text-neutral-900">
                {products.length}
              </div>
              <span className="text-[11px] text-stone-500 block">
                Hommes, Femmes & Accessoires
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Alertes Stock Faible
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-600">
                {lowStockProducts.length}
              </div>
              <span className="text-[11px] text-stone-500 block">
                Moins de 5 pièces restantes
              </span>
            </div>
          </div>

          {/* Quick Alert on low stock */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Articles nécessitant un réapprovisionnement à Conakry :</span>
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {lowStockProducts.map((p) => (
                  <span
                    key={p.id}
                    className="px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-stone-800"
                  >
                    {p.name} (<strong>{p.stockCount} en stock</strong>)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          {/* Status filter buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition capitalize ${
                    orderStatusFilter === st
                      ? 'bg-neutral-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'Toutes les commandes' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-stone-500">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-neutral-900">{order.id}</span>
                      <span className="text-xs font-bold text-amber-800">
                        {formatGNF(order.total)}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      Client : <strong>{order.customer.fullName}</strong> • Tél : {order.customer.phone} • WhatsApp : {order.customer.whatsapp}
                    </span>
                  </div>

                  {/* Status changer dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-stone-500 font-bold">Statut :</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold capitalize text-neutral-900"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmee">Confirmée</option>
                      <option value="en_livraison">En livraison</option>
                      <option value="livree">Livrée</option>
                      <option value="annulee">Annulée</option>
                    </select>

                    <button
                      onClick={() => updateOrderStatus(order.id, order.status, !order.isPaid)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        order.isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      {order.isPaid ? '✓ Payée' : 'Marquer payée'}
                    </button>
                  </div>
                </div>

                {/* Destination info */}
                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <strong>Lieu de livraison :</strong> {order.customer.city} — {order.customer.district}
                    <br />
                    <strong>Adresse :</strong> {order.customer.address}
                  </div>
                  <div>
                    <strong>Mode de paiement :</strong>{' '}
                    {order.paymentMethod === 'cod' ? 'Cash à la livraison' : order.paymentMethod.toUpperCase()}
                    {order.paymentDetails?.transactionRef && (
                      <span className="block text-[11px] text-stone-500">
                        Réf transaction : {order.paymentDetails.transactionRef}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-stone-100 pt-2 text-xs">
                  {order.items.map((i) => (
                    <div key={i.itemKey} className="py-1.5 flex justify-between items-center">
                      <span>
                        • {i.product.name} (Taille: <strong>{i.selectedSize}</strong>, Coul: <strong>{i.selectedColor.name}</strong>) x{i.quantity}
                      </span>
                      <span className="font-bold text-neutral-900">
                        {formatGNF(i.product.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Catalogue des Produits</h3>
              <p className="text-xs text-stone-500">{products.length} articles répertoriés</p>
            </div>
            <button
              onClick={() => {
                resetProductForm();
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Ajouter un Produit</span>
            </button>
          </div>

          {/* Product Form Modal / Section */}
          {isAddProductOpen && (
            <div className="bg-white p-6 rounded-2xl border-2 border-amber-700/40 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <h4 className="text-sm font-bold text-neutral-900">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit de Luxe'}
                </h4>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="text-stone-400 hover:text-neutral-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Nom du produit *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="Ex: Costume Royal Sur-Mesure"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Genre *</label>
                    <select
                      value={prodGender}
                      onChange={(e) => setProdGender(e.target.value as Gender)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs capitalize"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                      <option value="mixte">Mixte / Unisexe</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Catégorie *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="costumes">Costumes & Smokings</option>
                      <option value="vestes">Vestes & Blazers</option>
                      <option value="chemises">Chemises</option>
                      <option value="polos">Polos</option>
                      <option value="pantalons">Pantalons & Chinos</option>
                      <option value="robes">Robes de Soirée</option>
                      <option value="ensembles">Ensembles & Tailleurs</option>
                      <option value="chemisiers">Chemisiers</option>
                      <option value="jupes">Jupes</option>
                      <option value="baskets">Baskets & Sneakers</option>
                      <option value="mocassins">Mocassins en cuir</option>
                      <option value="talons">Escarpins & Talons</option>
                      <option value="sacs">Sacs & Maroquinerie</option>
                      <option value="montres">Montres de Luxe</option>
                      <option value="ceintures">Ceintures</option>
                      <option value="lunettes">Lunettes de soleil</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Prix en GNF *</label>
                    <input
                      type="number"
                      required
                      step="10000"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Prix d'origine en GNF (si promotion)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={prodOriginalPrice || ''}
                      onChange={(e) =>
                        setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="Ex: 600000"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Quantité en Stock *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Boutique / Vendeur *</label>
                    <select
                      value={prodVendorId}
                      onChange={(e) => setProdVendorId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.storeName} {v.isOfficialZaly ? '(Boutique Officielle)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Section with Upload, Direct URL, and Suggestions */}
                <div className="space-y-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-800" />
                      <span>Photo du Produit *</span>
                    </label>
                    <span className="text-[10px] text-stone-500">
                      Téléversez un fichier ou collez un lien
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A: Upload from device */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-stone-600 block">
                        Option 1 : Téléverser depuis votre appareil (PC / Mobile)
                      </span>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-stone-400 hover:border-amber-800 rounded-lg cursor-pointer transition text-stone-700 hover:text-amber-800 text-xs font-semibold">
                        <Upload className="w-4 h-4 text-amber-700" />
                        <span>Choisir une photo locale...</span>
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

                    {/* Option B: Direct URL */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-stone-600 block">
                        Option 2 : Ou coller l'adresse URL d'une image
                      </span>
                      <input
                        type="url"
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Suggested Quick Photos for this Category */}
                  {(SUGGESTED_CATEGORY_PHOTOS[prodCategory] || SUGGESTED_CATEGORY_PHOTOS['sacs']) && (
                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                        ✨ Ou choisir une photo haute définition suggérée ({prodCategory}) :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          SUGGESTED_CATEGORY_PHOTOS[prodCategory] ||
                          SUGGESTED_CATEGORY_PHOTOS['sacs']
                        ).map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProdImageUrl(sug.url)}
                            className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded-md text-[11px] text-stone-700 transition"
                          >
                            📷 {sug.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Image Preview */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-stone-700">Aperçu en direct :</span>
                    <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-amber-800/40 bg-white shrink-0 shadow-xs">
                      <img
                        src={
                          prodImageUrl && prodImageUrl.trim().length > 5
                            ? prodImageUrl
                            : CATEGORY_FALLBACK_IMAGES[prodCategory] || DEFAULT_LUXURY_IMAGE
                        }
                        alt="Aperçu"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            CATEGORY_FALLBACK_IMAGES[prodCategory] || DEFAULT_LUXURY_IMAGE;
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {prodImageUrl
                        ? '✓ Image prête et validée'
                        : 'Image par défaut pour cette catégorie'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Tailles disponibles (séparées par une virgule)</label>
                  <input
                    type="text"
                    value={prodSizesStr}
                    onChange={(e) => setProdSizesStr(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Description détaillée</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Détails sur la coupe, la confection et le tissu..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition"
                  >
                    Enregistrer le Produit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <th className="p-3">Article</th>
                    <th className="p-3">Boutique / Vendeur</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Genre</th>
                    <th className="p-3">Prix GNF</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.images && p.images[0] ? p.images[0] : (CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE)}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE;
                          }}
                          className="w-10 h-12 object-cover object-top rounded border border-stone-200 shrink-0 bg-stone-100"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-neutral-900 block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{p.sku}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-stone-800 block truncate max-w-[120px]">
                          {p.vendorName || 'ZALY FASHION Officiel'}
                        </span>
                        {p.isOfficial !== false && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold">
                            Officiel
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-stone-600">{p.categoryLabel}</td>
                      <td className="p-3 capitalize font-medium">{p.gender}</td>
                      <td className="p-3 font-bold text-neutral-900">{formatGNF(p.price)}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            p.stockCount <= 5 ? 'text-rose-600' : 'text-stone-800'
                          }`}
                        >
                          {p.stockCount}
                        </span>
                      </td>
                      <td className="p-3">
                        {p.inStock ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                            En stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">
                            Épuisé
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="p-1.5 rounded hover:bg-stone-200 text-stone-600 hover:text-neutral-900"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer « ${p.name} » ?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-rose-100 text-stone-400 hover:text-rose-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKETPLACE & VENDORS */}
      {adminTab === 'vendors' && (
        <div className="space-y-6">
          {/* Marketplace Architecture Info Banner */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Architecture Marketplace Guinée
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white mt-1">
                  Gestion des Vendeurs & Boutiques Partenaires
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                  Cette infrastructure permet l'intégration progressive de créateurs et ateliers partenaires.
                  ZALY FASHION reste le vendeur principal officiel avec contrôle total de conformité.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setCurrentView('boutiques');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-stone-700"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Annuaire Public des Boutiques</span>
                </button>
                <button
                  onClick={() => setIsAddVendorOpen(true)}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Inscrire une Boutique</span>
                </button>
              </div>
            </div>

            {/* 3 Distinct Roles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-stone-800 text-xs">
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60 space-y-1">
                <span className="font-bold text-amber-400 block">1. Administrateur Principal</span>
                <p className="text-stone-300 text-[11px]">
                  Supervision globale ZALY FASHION : approbation des vendeurs, publication des produits, suivi des encaissements Orange Money / MoMo et contrôle des livraisons.
                </p>
              </div>
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60 space-y-1">
                <span className="font-bold text-amber-400 block">2. Vendeurs Partenaires</span>
                <p className="text-stone-300 text-[11px]">
                  Boutiques de mode et ateliers guinéens certifiés avec fiches dédiées, stocks distincts et visibilité catalogue. Reversements automatisés en attente de validation contractuelle.
                </p>
              </div>
              <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60 space-y-1">
                <span className="font-bold text-amber-400 block">3. Clients</span>
                <p className="text-stone-300 text-[11px]">
                  Navigation par vendeur ou rayon, panier unifié, paiement sécurisé en GNF (Cash ou Mobile Money) et commande directe WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Vendors Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] text-stone-500 font-semibold uppercase">Total Boutiques</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{vendors.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] text-emerald-600 font-semibold uppercase">Boutiques Actives</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {vendors.filter((v) => v.status === 'actif').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] text-amber-600 font-semibold uppercase">En Attente d'Approbation</span>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {vendors.filter((v) => v.status === 'en_attente_approbation').length}
              </p>
            </div>
          </div>

          {/* Add Vendor Modal */}
          {isAddVendorOpen && (
            <div className="bg-white p-6 rounded-2xl border-2 border-amber-700/40 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <h4 className="text-sm font-bold text-neutral-900">
                  Enregistrer une Nouvelle Boutique Partenaire
                </h4>
                <button
                  onClick={() => setIsAddVendorOpen(false)}
                  className="text-stone-400 hover:text-neutral-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNewVendor} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Nom de la boutique *</label>
                    <input
                      type="text"
                      required
                      value={newVendorStoreName}
                      onChange={(e) => setNewVendorStoreName(e.target.value)}
                      placeholder="Ex: Dixinn Haute Couture"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Nom du gérant / créateur *</label>
                    <input
                      type="text"
                      required
                      value={newVendorOwnerName}
                      onChange={(e) => setNewVendorOwnerName(e.target.value)}
                      placeholder="Ex: Thierno Camara"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Téléphone de contact *</label>
                    <input
                      type="text"
                      required
                      value={newVendorPhone}
                      onChange={(e) => setNewVendorPhone(e.target.value)}
                      placeholder="+224 6XX XX XX XX"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Ville / Commune *</label>
                    <input
                      type="text"
                      required
                      value={newVendorCity}
                      onChange={(e) => setNewVendorCity(e.target.value)}
                      placeholder="Ex: Dixinn, Conakry"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-stone-700 block mb-1">Email professionnel</label>
                    <input
                      type="email"
                      value={newVendorEmail}
                      onChange={(e) => setNewVendorEmail(e.target.value)}
                      placeholder="vendeur@zalyfashion.gn"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-stone-700 block mb-1">Description & Spécialité</label>
                    <textarea
                      rows={2}
                      value={newVendorDescription}
                      onChange={(e) => setNewVendorDescription(e.target.value)}
                      placeholder="Ex: Atelier spécialisé en maroquinerie d'art et confection de cuir pleine fleur..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddVendorOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition"
                  >
                    Valider l'Inscription
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vendors List Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <th className="p-3">Boutique</th>
                    <th className="p-3">Responsable</th>
                    <th className="p-3">Ville</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Articles</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Modération</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {vendors.map((v) => {
                    const vendorProducts = products.filter(
                      (p) => (p.vendorId || 'vendor-zaly') === v.id
                    );
                    return (
                      <tr key={v.id} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-semibold text-neutral-900">
                          <div className="flex items-center gap-1.5">
                            <span>{v.storeName}</span>
                            {v.isOfficialZaly && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">
                                Vendeur Principal
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-normal block max-w-xs truncate">
                            {v.description}
                          </span>
                        </td>
                        <td className="p-3 text-stone-700">{v.ownerName}</td>
                        <td className="p-3 text-stone-700">{v.city}</td>
                        <td className="p-3 text-stone-600 font-mono text-[11px]">{v.phone}</td>
                        <td className="p-3 font-bold text-stone-900">{vendorProducts.length}</td>
                        <td className="p-3">
                          <div className="flex flex-col gap-0.5">
                            {v.status === 'actif' ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold inline-block w-fit">
                                Actif
                              </span>
                            ) : v.status === 'en_attente_approbation' ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold inline-block w-fit">
                                En attente
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold inline-block w-fit">
                                Suspendu
                              </span>
                            )}
                            {v.subscription && (
                              <span className="text-[9px] text-amber-800 font-semibold">
                                {v.subscription.status === 'trial'
                                  ? '🎁 Essai 2 mois'
                                  : v.subscription.status === 'actif'
                                  ? '💳 Abonné (300k GNF)'
                                  : '⚠️ Abonnement expiré'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                navigateToCatalog({ vendorId: v.id });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[10px] transition flex items-center gap-1"
                              title="Voir les articles de cette boutique dans le catalogue"
                            >
                              <ShoppingBag className="w-3 h-3 text-amber-700" />
                              <span>Voir articles ({vendorProducts.length})</span>
                            </button>

                            {!v.isOfficialZaly ? (
                              <>
                                {v.status !== 'actif' ? (
                                  <button
                                    onClick={() => updateVendorStatus(v.id, 'actif')}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition"
                                  >
                                    Activer
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => updateVendorStatus(v.id, 'suspendu')}
                                    className="px-2.5 py-1 bg-stone-200 hover:bg-rose-100 text-stone-700 hover:text-rose-700 rounded font-semibold text-[10px] transition"
                                  >
                                    Suspendre
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-stone-400 italic">Protégé</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE SETTINGS */}
      {adminTab === 'settings' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">Configuration Générale ZALY FASHION</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Coordonnées en Guinée, numéros de paiement et frais de livraison
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nom de l'enseigne</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, storeName: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Slogan officiel</label>
                <input
                  type="text"
                  value={settingsForm.slogan}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, slogan: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Numéro WhatsApp officiel (wa.me)</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, whatsappNumber: e.target.value }))
                  }
                  placeholder="+224625667522"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Numéro Téléphone Showroom</label>
                <input
                  type="text"
                  value={settingsForm.phoneContact}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, phoneContact: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Numéro Marchand Orange Money</label>
                <input
                  type="text"
                  value={settingsForm.orangeMoneyMerchantNumber}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      orangeMoneyMerchantNumber: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Numéro Marchand MTN MoMo</label>
                <input
                  type="text"
                  value={settingsForm.momoMerchantNumber}
                  onChange={(e) =>
                    setSettingsForm((s) => ({ ...s, momoMerchantNumber: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Frais de livraison Conakry (GNF)</label>
                <input
                  type="number"
                  step="5000"
                  value={settingsForm.conakryShippingFee}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      conakryShippingFee: Number(e.target.value)
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Seuil Livraison Gratuite (GNF)</label>
                <input
                  type="number"
                  step="50000"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      freeShippingThreshold: Number(e.target.value)
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Bandeau d'annonce défilant</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, announcementText: e.target.value }))
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Adresse Showroom Conakry</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, address: e.target.value }))
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Enregistrer les paramètres</span>
              </button>
            </div>
          </form>

          {/* ADMIN ACCOUNT & CREDENTIALS SECTION */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              <h3 className="font-bold text-neutral-900 text-base">
                Compte Administrateur & Sécurité (Hostinger MySQL)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Personnalisez votre adresse email, votre téléphone guinéen et définissez un mot de passe administrateur sécurisé. Ces identifiants sont sauvegardés dans votre base de données Hostinger.
            </p>

            {adminSetupSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{adminSetupSuccess}</span>
              </div>
            )}

            {adminSetupError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{adminSetupError}</span>
              </div>
            )}

            <form onSubmit={handleSetupAdminSubmit} className="space-y-4 text-xs bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nom de l'Administrateur
                  </label>
                  <input
                    type="text"
                    required
                    value={adminSetupName}
                    onChange={(e) => setAdminSetupName(e.target.value)}
                    placeholder="ex: Directrice ZALY"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Email Administrateur
                  </label>
                  <input
                    type="email"
                    required
                    value={adminSetupEmail}
                    onChange={(e) => setAdminSetupEmail(e.target.value)}
                    placeholder="contact@votredomaine.com"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Téléphone Administrateur (Guinée)
                  </label>
                  <input
                    type="tel"
                    required
                    value={adminSetupPhone}
                    onChange={(e) => setAdminSetupPhone(e.target.value)}
                    placeholder="+224 6XX XX XX XX"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nouveau Mot de Passe Administrateur
                  </label>
                  <input
                    type="password"
                    required
                    value={adminSetupPassword}
                    onChange={(e) => setAdminSetupPassword(e.target.value)}
                    placeholder="Définir un mot de passe sécurisé"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-500">
                  🔒 Mot de passe haché avec l'algorithme BCRYPT standard de PHP/MySQL.
                </span>
                <button
                  type="submit"
                  disabled={adminSetupLoading}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {adminSetupLoading ? (
                    <span>Sauvegarde en cours...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Sauvegarder le compte Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
