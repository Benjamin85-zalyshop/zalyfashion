import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, navigateToCatalog, storeSettings } = useShop();

  return (
    <footer className="bg-neutral-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* 1. Value propositions row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Livraison Express Guinée</h4>
              <p className="text-xs text-stone-400">À Conakry en 24h & dans toutes les préfectures.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Paiement à la Réception</h4>
              <p className="text-xs text-stone-400">Réglez en cash ou par Orange Money à la livraison.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Échange sous 72h</h4>
              <p className="text-xs text-stone-400">Taille inadaptée ? Échange simple et sans tracas.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Stylistes WhatsApp 7j/7</h4>
              <p className="text-xs text-stone-400">Conseils personnalisés et commande directe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-brand-luxury text-2xl font-extrabold tracking-[0.2em] text-white">
                ZALY
              </span>
              <span className="font-brand-luxury text-2xl font-light tracking-[0.2em] text-amber-500">
                FASHION
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Maison de prêt-à-porter haut de gamme et d'accessoires de luxe en Guinée. Nous célébrons l'élégance contemporaine à travers des pièces confectionnées avec le plus grand soin.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeSettings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeSettings.phoneContact}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeSettings.email}</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Discuter avec notre équipe sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 1: Collections */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400">Collections</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateToCatalog({ gender: 'homme' })}
                  className="hover:text-white transition"
                >
                  Mode Homme (Costumes, Chemises)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog({ gender: 'femme' })}
                  className="hover:text-white transition"
                >
                  Mode Femme (Robes, Ensembles)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog({ category: 'chaussures' })}
                  className="hover:text-white transition"
                >
                  Chaussures & Baskets de Luxe
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog({ category: 'accessoires' })}
                  className="hover:text-white transition"
                >
                  Sacs, Montres & Maroquinerie
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog({ newOnly: true })}
                  className="hover:text-amber-300 transition text-amber-400 font-semibold"
                >
                  ✨ Nouveautés 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog({ promoOnly: true })}
                  className="hover:text-rose-400 transition text-rose-400 font-semibold"
                >
                  Offres & Promotions %
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Service Client & Info */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400">Service Client</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Suivi de votre commande
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('guide-tailles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Guide des tailles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('faq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Questions Fréquentes (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Showroom & Contact Conakry
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('vendor-portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition text-amber-400 font-semibold flex items-center gap-1.5"
                >
                  <span>✨ Devenir Vendeur (2 mois offerts)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations Légales */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400">À Propos & Légal</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('boutiques');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition text-amber-300 font-semibold"
                >
                  🏪 Nos Boutiques Partenaires
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Notre Histoire & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('cgv');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('cgv');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Livraison & Retours en Guinée
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('cgv');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Politique de Confidentialité
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Payments & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <p
            onDoubleClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-default select-none"
          >
            © 2026 <strong>ZALY FASHION</strong>. Tous droits réservés. République de Guinée.
          </p>
        </div>

        {/* Payment badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-[11px] text-stone-400 font-medium mr-1">Moyens acceptés :</span>
          <span className="px-2.5 py-1 bg-neutral-900 border border-stone-800 rounded font-bold text-orange-500 text-[10px]">
            Orange Money
          </span>
          <span className="px-2.5 py-1 bg-neutral-900 border border-stone-800 rounded font-bold text-amber-400 text-[10px]">
            MTN MoMo
          </span>
          <span className="px-2.5 py-1 bg-neutral-900 border border-stone-800 rounded font-bold text-emerald-400 text-[10px]">
            Cash à la livraison
          </span>
          <span className="px-2.5 py-1 bg-neutral-900 border border-stone-800 rounded font-bold text-blue-400 text-[10px]">
            Visa / Mastercard
          </span>
        </div>
      </div>
    </footer>
  );
};
