import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  User,
  Package,
  Heart,
  Search,
  MapPin,
  Phone,
  Mail,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  LogOut,
  Shield,
  Edit3,
  Check,
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    formatGNF,
    setCurrentView,
    openProductDetail,
    storeSettings,
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfileData
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'track'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+224 ');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Conakry');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'Conakry');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Tracking search state
  const [trackingSearchId, setTrackingSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);

  // Filter orders for logged in user (or all local device orders if guest)
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customer.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
          o.customer.phone === currentUser.phone
      )
    : orders;

  const displayOrders = userOrders.length > 0 ? userOrders : orders;

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await loginUser(loginIdentifier.trim(), loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Identifiant ou mot de passe incorrect.');
      } else {
        setLoginIdentifier('');
        setLoginPassword('');
        if (res.user) {
          setProfileName(res.user.name);
          setProfilePhone(res.user.phone);
          setProfileAddress(res.user.address);
          setProfileCity(res.user.city);
        }
      }
    } catch {
      setLoginError('Erreur de connexion au serveur.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);

    try {
      const res = await registerUser({
        fullName: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        address: regAddress.trim(),
        district: regAddress.trim(),
        city: regCity
      });
      if (!res.success) {
        setRegError(res.message || 'Erreur lors de la création du compte.');
      } else {
        setRegPassword('');
      }
    } catch {
      setRegError('Erreur de connexion au serveur.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateUserProfileData({
      fullName: profileName,
      phone: profilePhone,
      address: profileAddress,
      district: profileAddress,
      city: profileCity
    });

    if (res.success) {
      setProfileSuccessMsg('Profil et adresse enregistrés avec succès.');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } else {
      setProfileSuccessMsg(res.message || 'Erreur de mise à jour.');
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.id.toLowerCase() === trackingSearchId.trim().toLowerCase()
    );
    setSearchedOrder(found || 'not_found');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> En attente de validation
          </span>
        );
      case 'confirmee':
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmée & En préparation
          </span>
        );
      case 'en_livraison':
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3 h-3" /> En cours de livraison
          </span>
        );
      case 'livree':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Colis Livré
          </span>
        );
      case 'annulee':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-md font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Annulée
          </span>
        );
      default:
        return null;
    }
  };

  // If user is not authenticated, show elegant Auth Screen with options to Login, Register, or Track Order
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {/* Top Header */}
        <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-amber-400 font-brand-luxury text-2xl font-bold flex items-center justify-center border-2 border-amber-600/30 mx-auto shadow-lg">
            Z
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
            Espace Membre Privilège
          </h1>
          <p className="text-xs text-stone-500">
            Connectez-vous à votre compte ou inscrivez-vous pour sauvegarder vos commandes, vos adresses à Conakry et vos favoris.
          </p>
        </div>

        {/* Tab switch between Connexion and Inscription */}
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-bold uppercase tracking-wider bg-stone-50">
            <button
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
              }}
              className={`py-3.5 flex items-center justify-center gap-2 transition ${
                authMode === 'login'
                  ? 'bg-white text-amber-900 border-b-2 border-amber-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LogIn className="w-4 h-4 text-amber-700" />
              <span>Connexion</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setRegError('');
              }}
              className={`py-3.5 flex items-center justify-center gap-2 transition ${
                authMode === 'register'
                  ? 'bg-white text-amber-900 border-b-2 border-amber-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <UserPlus className="w-4 h-4 text-amber-700" />
              <span>Créer un compte</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email ou N° Téléphone (Guinée)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ex: sekou@gmail.com ou 622345678"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loginLoading ? (
                    <span>Connexion en cours...</span>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-stone-500">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      Inscrivez-vous gratuitement
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nom & Prénom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ex: Fanta Camara"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="fanta@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                      />
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Téléphone Guinée
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+224 6XX XX XX XX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-800"
                      />
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Au moins 6 caractères"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Adresse / Quartier
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Kipé, Lambanyi, Kaloum..."
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800"
                      />
                      <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Ville
                    </label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-800"
                    >
                      <option value="Conakry">Conakry</option>
                      <option value="Kindia">Kindia</option>
                      <option value="Mamou">Mamou</option>
                      <option value="Labé">Labé</option>
                      <option value="Kankan">Kankan</option>
                      <option value="Nzérékoré">Nzérékoré</option>
                    </select>
                  </div>
                </div>

                {regError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {regLoading ? (
                    <span>Création du compte...</span>
                  ) : (
                    <>
                      <span>Créer mon compte client</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-stone-500">
                    Déjà inscrit ?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      Connectez-vous ici
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Guest tracking banner */}
        <div className="mt-8 max-w-md mx-auto text-center">
          <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
            <p className="text-xs text-stone-600 mb-2">
              Vous avez passé une commande sans compte ?
            </p>
            <button
              onClick={() => {
                setActiveTab('track');
                // Temporary allow track view
              }}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 underline inline-flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Suivre un colis avec le numéro de référence</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN USER INTERFACE
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* 1. Header Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-amber-400 font-brand-luxury text-2xl font-bold flex items-center justify-center border-2 border-amber-600/30">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'Z'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
                Bonjour, {currentUser.name}
              </h1>
              {currentUser.role === 'admin' && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-800 border border-amber-500/30 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentUser.email} • {currentUser.phone} • {currentUser.city}
            </p>
          </div>
        </div>

        {/* Quick actions & stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center">
            <span className="text-[10px] uppercase text-stone-500 font-bold block">Commandes</span>
            <span className="text-sm font-extrabold text-neutral-900">{displayOrders.length}</span>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center">
            <span className="text-[10px] uppercase text-stone-500 font-bold block">Favoris</span>
            <span className="text-sm font-extrabold text-amber-800">{wishlist.length}</span>
          </div>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Back-office Admin</span>
            </button>
          )}

          <button
            onClick={logoutUser}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-stone-200"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 sm:px-4 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mes Commandes ({displayOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-2 sm:px-4 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Mes Favoris ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`pb-3 px-2 sm:px-4 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'track'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Suivre un Colis</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 sm:px-4 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-b-2 border-amber-800 text-amber-800'
              : 'text-stone-500 hover:text-neutral-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Mon Profil & Adresses</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {displayOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                Vous n'avez pas encore passé de commande
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explorez notre catalogue de haute couture et passez votre commande avec livraison rapide à Conakry.
              </p>
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition"
              >
                Découvrir le catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm hover:border-amber-700/30 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-neutral-900">
                          {order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-[11px] text-stone-400 mt-1 block">
                        Passée le{' '}
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-500 block">Montant Total</span>
                      <span className="text-sm sm:text-base font-extrabold text-amber-800">
                        {formatGNF(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.itemKey}
                        onClick={() => openProductDetail(item.product.id)}
                        className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100 transition"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover object-top rounded-lg border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <h5 className="font-semibold text-neutral-900 truncate">
                            {item.product.name}
                          </h5>
                          <p className="text-[10px] text-stone-500">
                            Taille: {item.selectedSize} • Qté: {item.quantity}
                          </p>
                          <span className="font-bold text-neutral-900 text-[11px]">
                            {formatGNF(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery details row */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2 border-t border-stone-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>{order.customer.city} — {order.customer.district}</span>
                    </span>
                    <span className="text-[11px] text-stone-600 font-medium">
                      Paiement :{' '}
                      {order.paymentMethod === 'cod'
                        ? 'Cash à la livraison'
                        : order.paymentMethod.toUpperCase()}
                      {order.isPaid ? ' (Payé)' : ' (À régler)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                Votre liste de favoris est vide
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Cliquez sur le cœur d'un produit pour l'enregistrer et le retrouver facilement ici.
              </p>
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition"
              >
                Parcourir la boutique
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRACK A PACKAGE */}
      {activeTab === 'track' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center">
            <Truck className="w-10 h-10 text-amber-800 mx-auto" />
            <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
              Suivi en temps réel de votre Colis
            </h3>
            <p className="text-xs text-stone-500">
              Saisissez votre référence de commande (ex: <code>ZLY-2026-8941</code>) pour visualiser l'état de votre livraison.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ex: ZLY-2026-8941"
                value={trackingSearchId}
                onChange={(e) => setTrackingSearchId(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs uppercase font-mono focus:outline-none focus:border-amber-800"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition"
              >
                Suivre
              </button>
            </form>
          </div>

          {searchedOrder === 'not_found' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs text-center">
              Aucune commande trouvée avec la référence « {trackingSearchId} ». Vérifiez l'orthographe ou contactez notre support client WhatsApp au {storeSettings.phoneContact}.
            </div>
          )}

          {searchedOrder && searchedOrder !== 'not_found' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">Commande {searchedOrder.id}</h4>
                  <p className="text-[11px] text-stone-500">
                    Destinataire : {searchedOrder.customer.fullName} ({searchedOrder.customer.city})
                  </p>
                </div>
                {getStatusBadge(searchedOrder.status)}
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Commande Enregistrée</h5>
                    <p className="text-[11px] text-stone-500">
                      Commande transmise avec succès au showroom ZALY Conakry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      searchedOrder.status !== 'en_attente'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {searchedOrder.status !== 'en_attente' ? '✓' : '2'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">
                      Validation & Emballage Haute Couture
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      Inspection des pièces, confection et mise sous housse ZALY.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      ['en_livraison', 'livree'].includes(searchedOrder.status)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {['en_livraison', 'livree'].includes(searchedOrder.status) ? '✓' : '3'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">En cours d'Acheminement</h5>
                    <p className="text-[11px] text-stone-500">
                      Colis confié à notre coursier express à Conakry / transporteur interurbain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      searchedOrder.status === 'livree'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {searchedOrder.status === 'livree' ? '✓' : '4'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Livraison & Réception</h5>
                    <p className="text-[11px] text-stone-500">
                      Remis en mains propres avec contrôle satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE & ADDRESSES */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                Mes Coordonnées & Adresse de Livraison
              </h3>
              <p className="text-xs text-stone-500">
                Vos informations utilisées automatiquement lors du paiement
              </p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => {
                  setProfileName(currentUser.name);
                  setProfilePhone(currentUser.phone);
                  setProfileAddress(currentUser.address);
                  setProfileCity(currentUser.city);
                  setIsEditingProfile(true);
                }}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            )}
          </div>

          {profileSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {!isEditingProfile ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Nom & Prénom
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {currentUser.name}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Adresse Email
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {currentUser.email}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Téléphone (Guinée)
                  </span>
                  <span className="text-sm font-semibold font-mono text-neutral-900">
                    {currentUser.phone}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Ville
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {currentUser.city}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Adresse de livraison / Quartier
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {currentUser.address || 'Aucune adresse renseignée pour le moment'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-bold block mb-1">Téléphone Guinée</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-bold block mb-1">Ville</label>
                  <select
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Conakry">Conakry</option>
                    <option value="Kindia">Kindia</option>
                    <option value="Mamou">Mamou</option>
                    <option value="Labé">Labé</option>
                    <option value="Kankan">Kankan</option>
                    <option value="Nzérékoré">Nzérékoré</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  Adresse précise & Quartier (ex: Kipé Centre, Villa 14)
                </label>
                <input
                  type="text"
                  required
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition shadow-sm"
                >
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
