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
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    formatGNF,
    setCurrentView,
    openProductDetail,
    storeSettings
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'track'>('orders');
  const [trackingSearchId, setTrackingSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* 1. Header Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-amber-400 font-brand-luxury text-2xl font-bold flex items-center justify-center border-2 border-amber-600/30">
            Z
          </div>
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
              Espace Client Privilège
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Suivi de vos commandes, gestion des adresses et articles favoris en Guinée
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center">
            <span className="text-[10px] uppercase text-stone-500 font-bold block">Commandes</span>
            <span className="text-sm font-extrabold text-neutral-900">{orders.length}</span>
          </div>
          <div className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-center">
            <span className="text-[10px] uppercase text-stone-500 font-bold block">Favoris</span>
            <span className="text-sm font-extrabold text-amber-800">{wishlist.length}</span>
          </div>
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
          <span>Mes Commandes ({orders.length})</span>
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
          <span>Mon Profil</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-neutral-900">
                Vous n'avez pas encore passé de commande
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explorez notre catalogue de haute couture et passez votre première commande avec livraison rapide à Conakry.
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
              {orders.map((order) => (
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

          {/* Searched result */}
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
                      Inspection des coutures, mise sous housse et pochon ZALY.
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

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <h3 className="font-bold text-neutral-900 text-sm pb-2 border-b border-stone-100">
            Coordonnées du Compte
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-stone-500 block mb-1">Nom complet</label>
              <input
                type="text"
                defaultValue="Sekouba Traoré"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-stone-500 block mb-1">Email</label>
              <input
                type="email"
                defaultValue="sekouba.traore@gmail.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-stone-500 block mb-1">Téléphone Guinée</label>
              <input
                type="tel"
                defaultValue="+224 622 34 56 78"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-stone-500 block mb-1">Adresse par défaut à Conakry</label>
              <input
                type="text"
                defaultValue="Kipé Centre, Villa 14, Commune de Ratoma"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <button
              onClick={() => alert('Profil mis à jour avec succès.')}
              className="px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
