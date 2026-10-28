import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  Menu,
  X,
  Phone,
  MessageCircle,
  Truck,
  Store,
  Sparkles
} from 'lucide-react';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from '../data/fallbackImages';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    navigateToCatalog,
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    wishlist,
    storeSettings,
    formatGNF,
    products,
    openProductDetail
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = searchTerm.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigateToCatalog({ search: searchTerm.trim() });
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-neutral-900 text-stone-200 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span className="font-medium tracking-wide">
              {storeSettings.announcementText}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-stone-300 shrink-0">
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Conakry & Intérieur</span>
            </span>
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: {storeSettings.phoneContact}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-stone-800 hover:text-amber-700 transition"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center sm:items-start cursor-pointer select-none group"
          >
            <div className="flex items-center gap-2">
              <span className="font-brand-luxury text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-neutral-900 group-hover:text-amber-800 transition">
                ZALY
              </span>
              <span className="font-brand-luxury text-2xl sm:text-3xl font-light tracking-[0.2em] text-amber-700">
                FASHION
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium hidden sm:block">
              {storeSettings.slogan}
            </span>
          </div>

          {/* Desktop Search Bar (Smart search) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Rechercher costume, robe, mocassins, baskets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 bg-stone-100/80 border border-stone-200 rounded-full text-xs placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Live Search Autocomplete Popup */}
            {isSearchOpen && searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="p-3 bg-stone-50 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex justify-between items-center">
                  <span>Produits suggérés</span>
                  <span>{searchResults.length} résultats</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        openProductDetail(p.id);
                        setIsSearchOpen(false);
                        setSearchTerm('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-stone-50 cursor-pointer transition"
                    >
                      <img
                        src={p.images && p.images[0] ? p.images[0] : (CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE)}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            CATEGORY_FALLBACK_IMAGES[p.category] || DEFAULT_LUXURY_IMAGE;
                        }}
                        className="w-12 h-14 object-cover object-top rounded-md border border-stone-200 bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-neutral-900 truncate">{p.name}</h4>
                        <p className="text-[11px] text-stone-500">{p.categoryLabel}</p>
                        <p className="text-xs font-bold text-amber-800">{formatGNF(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold text-center transition"
                >
                  Voir tous les résultats pour « {searchTerm} » &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-amber-800 transition"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setCurrentView('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 text-stone-700 hover:text-amber-800 transition relative"
              title="Mes Favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Customer Account / Tracking */}
            <button
              onClick={() => {
                setCurrentView('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 text-stone-700 hover:text-amber-800 transition"
              title="Mon Compte / Suivi"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Espace Vendeurs & Créer sa boutique */}
            <button
              onClick={() => {
                setCurrentView('vendor-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition shadow-xs group"
              title="Vendez vos créations avec 2 mois d'essai offerts"
            >
              <Store className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition" />
              <span>Vendre sur Zaly</span>
              <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded-full">
                2 mois offerts
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 pl-3 pr-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full transition shadow-sm group"
              title="Voir mon panier"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline">
                {cartCount > 0 ? formatGNF(cartSubtotal) : 'Panier'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Rechercher un vêtement, chaussures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-stone-100 border border-stone-300 rounded-xl text-xs placeholder-stone-500 focus:outline-none focus:border-amber-700"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-800"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* 3. Main Desktop Menu Links */}
        <nav className="hidden lg:flex items-center justify-center border-t border-stone-100 py-3 gap-6 xl:gap-8 text-xs font-semibold tracking-wider uppercase text-stone-700">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition hover:text-amber-800 ${
              currentView === 'home' ? 'text-amber-800 border-b-2 border-amber-800 pb-1' : ''
            }`}
          >
            Accueil
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'nouveautes', newOnly: true, gender: 'all', category: 'all' })
            }
            className="transition hover:text-amber-800 flex items-center gap-1 text-amber-700 font-bold"
          >
            <span>Nouveautés</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'vetements-homme', gender: 'homme', category: 'all' })
            }
            className="transition hover:text-amber-800"
          >
            Vêtements Homme
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'vetements-femme', gender: 'femme', category: 'all' })
            }
            className="transition hover:text-amber-800"
          >
            Vêtements Femme
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'chaussures-homme', gender: 'homme', category: 'chaussures' })
            }
            className="transition hover:text-amber-800"
          >
            Chaussures Homme
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'chaussures-femme', gender: 'femme', category: 'chaussures' })
            }
            className="transition hover:text-amber-800"
          >
            Chaussures Femme
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'sacs-accessoires', category: 'accessoires', gender: 'all' })
            }
            className="transition hover:text-amber-800"
          >
            Sacs & Accessoires
          </button>

          <button
            onClick={() =>
              navigateToCatalog({ department: 'promotions', promoOnly: true, gender: 'all', category: 'all' })
            }
            className="transition hover:text-rose-700 text-rose-600 font-bold"
          >
            Promotions %
          </button>

          <button
            onClick={() => {
              setCurrentView('boutiques');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition hover:text-amber-800 ${
              currentView === 'boutiques' ? 'text-amber-800 border-b-2 border-amber-800 pb-1 font-bold' : ''
            }`}
          >
            Boutiques
          </button>

          <button
            onClick={() => {
              setCurrentView('vendor-portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition hover:text-amber-800 flex items-center gap-1.5 ${
              currentView === 'vendor-portal' ? 'text-amber-800 border-b-2 border-amber-800 pb-1 font-bold' : ''
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-700" />
            <span>Espace Vendeurs</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="transition hover:text-amber-800"
          >
            Contact
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="px-5 py-4 space-y-3 text-sm font-medium text-stone-800">
            <button
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Accueil
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'nouveautes', newOnly: true, gender: 'all', category: 'all' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100 text-amber-700 font-semibold"
            >
              ✨ Nouveautés 2026
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'vetements-homme', gender: 'homme', category: 'all' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Vêtements Homme
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'vetements-femme', gender: 'femme', category: 'all' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Vêtements Femme
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'chaussures-homme', gender: 'homme', category: 'chaussures' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Chaussures Homme
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'chaussures-femme', gender: 'femme', category: 'chaussures' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Chaussures Femme
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'sacs-accessoires', category: 'accessoires', gender: 'all' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Sacs & Accessoires
            </button>
            <button
              onClick={() => {
                navigateToCatalog({ department: 'promotions', promoOnly: true, gender: 'all', category: 'all' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100 text-rose-600 font-semibold"
            >
              Offres Spéciales & Promotions %
            </button>
            <button
              onClick={() => {
                setCurrentView('boutiques');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 border-b border-stone-100 font-semibold text-neutral-900"
            >
              🏪 Nos Boutiques Partenaires
            </button>
            <button
              onClick={() => {
                setCurrentView('account');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 border-b border-stone-100"
            >
              Mon Compte & Suivi de commande
            </button>
            <button
              onClick={() => {
                setCurrentView('vendor-portal');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block w-full text-left py-2 border-b border-stone-100 font-bold text-amber-800"
            >
              ✨ Espace Vendeurs : Vendre sur ZALY (2 mois offerts)
            </button>
            <button
              onClick={() => {
                setCurrentView('contact');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Contact & Showroom Conakry
            </button>
          </div>

          <div className="bg-stone-50 p-4 border-t border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>{storeSettings.phoneContact}</span>
            </span>
            <span className="text-amber-800 font-semibold">Conakry, Guinée</span>
          </div>
        </div>
      )}
    </header>
  );
};
