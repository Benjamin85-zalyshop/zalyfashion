import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const BoutiquesPage: React.FC = () => {
  const { vendors, products, navigateToCatalog, setCurrentView, storeSettings } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  // Filter vendors based on search and city
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'all' || v.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCity;
  });

  // Unique list of cities
  const cities = Array.from(new Set(vendors.map((v) => v.city)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-radial from-neutral-900 to-neutral-950 text-white p-8 sm:p-12 border border-stone-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Store className="w-3.5 h-3.5" />
            <span>Marketplace Mode Guinée</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Nos Boutiques & Créateurs Partenaires
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Retrouvez ici toutes les boutiques et ateliers certifiés du réseau <strong>ZALY FASHION</strong> en Guinée. Chaque vendeur est rigoureusement sélectionné pour la qualité de ses confections, son authenticité et son service de livraison fiable.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Garantie Qualité ZALY</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Paiement Sécurisé Orange Money, MoMo & Cash</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{vendors.length} boutiques enregistrées</span>
            </span>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setCurrentView('vendor-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg inline-flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Ouvrir ma propre boutique (2 mois d'essai offerts) &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & City Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Rechercher une boutique par nom, gérant ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-amber-800 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* City Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Ville :</span>
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedCity === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Toutes ({vendors.length})
          </button>
          {cities.map((city) => {
            const count = vendors.filter((v) => v.city.toLowerCase() === city.toLowerCase()).length;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-amber-800 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {city} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Boutiques Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
            Aucune boutique trouvée
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Aucune boutique ne correspond à « {searchQuery} ». Essayez un autre mot-clé ou réinitialisez la recherche.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCity('all');
            }}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => {
            const vendorProducts = products.filter(
              (p) => (p.vendorId || 'vendor-zaly') === vendor.id
            );
            const cleanPhone = vendor.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={vendor.id}
                className={`flex flex-col justify-between bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  vendor.isOfficialZaly
                    ? 'border-amber-600/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-200/80 hover:border-amber-700/40'
                }`}
              >
                {/* Header card */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-amber-800 font-serif-luxury font-bold text-xl shrink-0 shadow-xs">
                      {vendor.storeName.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {vendor.isOfficialZaly ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                          Maison Mère ZALY
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider border border-stone-200">
                          Boutique Partenaire
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold ${
                          vendor.status === 'actif'
                            ? 'text-emerald-700'
                            : vendor.status === 'en_attente_approbation'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        ● {vendor.status === 'actif' ? 'Ouverte & Active' : 'En vérification'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition">
                      {vendor.storeName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{vendor.city}, Guinée</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {vendor.description ||
                      'Boutique de confection et prêt-à-porter certifiée partenaire sur la marketplace ZALY FASHION.'}
                  </p>

                  {/* Vendor Details */}
                  <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                    <div className="flex items-center justify-between">
                      <span>Responsable :</span>
                      <strong className="text-neutral-900">{vendor.ownerName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Articles disponibles :</span>
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        {vendorProducts.length} article{vendorProducts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Téléphone :</span>
                      <span className="font-mono text-stone-800">{vendor.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Footer card actions */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigateToCatalog({ vendorId: vendor.id });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Voir les articles ({vendorProducts.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Bonjour ${vendor.ownerName}, je vous contacte depuis la marketplace ZALY FASHION à propos de votre boutique ${vendor.storeName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Discuter avec cette boutique sur WhatsApp"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center justify-center shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Callout: Join the Marketplace */}
      <div className="bg-stone-100 rounded-3xl p-8 sm:p-10 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
            Rejoindre ZALY Marketplace
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
            Vous gérez une boutique de mode ou un atelier en Guinée ?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Exposez vos pièces à des milliers de clients à Conakry et en province. Bénéficiez de la logistique de livraison sécurisée, du paiement Orange Money / Cash à la livraison et de la vitrine de prestige ZALY FASHION.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Bonjour ZALY FASHION, je souhaite inscrire ma boutique de mode sur votre marketplace en Guinée.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Postuler sur WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Accès Administrateur</span>
          </button>
        </div>
      </div>
    </div>
  );
};
