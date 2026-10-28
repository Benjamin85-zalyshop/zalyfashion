import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  TrendingUp,
  Percent,
  MessageCircle,
  Truck,
  ShieldCheck,
  Send
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigateToCatalog, openProductDetail, storeSettings, formatGNF } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Curated lists
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 4);
  const promoProducts = products.filter((p) => p.isPromo).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO BANNER SPECTACULAIRE */}
      <section className="relative min-h-[580px] sm:min-h-[720px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
        {/* Background Editorial High-Fashion Photography */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Mode de luxe ZALY FASHION"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000 opacity-60"
          />
          {/* Subtle Dark Luxury Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-neutral-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-300">
              Collection Haute Couture 2026 • Guinée
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            EXPRIMEZ <span className="italic font-normal text-amber-300">VOTRE</span> STYLE
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed">
            Découvrez les dernières tendances en vêtements, chaussures et accessoires d'exception.
            L'élégance raffinée disponible dès aujourd'hui à Conakry et partout en Guinée.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={() => navigateToCatalog({ gender: 'homme', category: 'all' })}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-100 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-200 shadow-xl shadow-black/40 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Découvrir la collection Homme</span>
              <ArrowRight className="w-4 h-4 text-amber-800" />
            </button>

            <button
              onClick={() => navigateToCatalog({ gender: 'femme', category: 'all' })}
              className="w-full sm:w-auto px-8 py-4 bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-200 shadow-xl shadow-amber-900/40 hover:scale-105 border border-amber-400/40 flex items-center justify-center gap-2"
            >
              <span>Découvrir la collection Femme</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Delivery teaser tag */}
          <div className="pt-6 flex items-center justify-center gap-6 text-[11px] sm:text-xs text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              Livraison Express à Conakry & Régions
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Paiement sécurisé Orange Money & Cash
            </span>
          </div>
        </div>
      </section>

      {/* 2. GRANDES CATÉGORIES PRINCIPALES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-800">
            Explorer les univers
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            Les Catégories Majeures
          </h2>
          <div className="w-12 h-0.5 bg-amber-700 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Homme */}
          <div
            onClick={() => navigateToCatalog({ gender: 'homme', category: 'all' })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
              alt="Mode Homme"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Élégance</span>
              <h3 className="font-bold text-sm sm:text-base">Mode Homme</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Costumes, chemises & polos</p>
            </div>
          </div>

          {/* Card 2: Femme */}
          <div
            onClick={() => navigateToCatalog({ gender: 'femme', category: 'all' })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
              alt="Mode Femme"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Prestige</span>
              <h3 className="font-bold text-sm sm:text-base">Mode Femme</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Robes de gala & tailleurs</p>
            </div>
          </div>

          {/* Card 3: Chaussures Homme */}
          <div
            onClick={() => navigateToCatalog({ category: 'chaussures', gender: 'homme' })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop"
              alt="Chaussures Homme"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Mocassins</span>
              <h3 className="font-bold text-sm sm:text-base">Chaussures Homme</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Cuir glacé & richelieus</p>
            </div>
          </div>

          {/* Card 4: Chaussures Femme */}
          <div
            onClick={() => navigateToCatalog({ category: 'chaussures', gender: 'femme' })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
              alt="Chaussures Femme"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Stiletto</span>
              <h3 className="font-bold text-sm sm:text-base">Chaussures Femme</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Escarpins & sandales dorées</p>
            </div>
          </div>

          {/* Card 5: Sacs & Accessoires */}
          <div
            onClick={() => navigateToCatalog({ category: 'accessoires', gender: 'all' })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"
              alt="Sacs & Accessoires"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Maroquinerie</span>
              <h3 className="font-bold text-sm sm:text-base">Sacs & Montres</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Cuir grainé & chronographes</p>
            </div>
          </div>

          {/* Card 6: Nouveautés */}
          <div
            onClick={() => navigateToCatalog({ newOnly: true })}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
              alt="Nouveautés"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-white">
              <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Exclusivité</span>
              <h3 className="font-bold text-sm sm:text-base">Nouveautés</h3>
              <p className="text-[10px] text-stone-300 mt-0.5">Arrivages récents 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOUVELLE COLLECTION (PRODUITS POPULAIRES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Derniers Arrivages</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Nouvelle Collection 2026
            </h2>
          </div>

          <button
            onClick={() => navigateToCatalog({ newOnly: true })}
            className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 transition"
          >
            <span>Voir tout le catalogue ({products.length} articles)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL LOOKBOOK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[420px] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop"
            alt="Lookbook Haute Couture"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.25em]">
              Édition Limitée
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
              L'Art du Tailoring & de la Soie
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Chaque costume, robe et soulier est sélectionné pour sa matière noble et sa tenue irréprochable sous la lumière de Conakry. Profitez d'une confection soignée aux standards des plus grandes capitales de mode.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => navigateToCatalog({ category: 'costumes' })}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition shadow-lg shadow-amber-900/30"
              >
                Découvrir la sélection
              </button>
              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Conseil styliste</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEILLEURES VENTES & POPULAIRES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>Les Incontournables</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Meilleures Ventes ZALY
            </h2>
          </div>

          <button
            onClick={() => navigateToCatalog({ sortBy: 'popular' })}
            className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 transition"
          >
            <span>Voir les pièces les plus demandées</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. OFFRES SPÉCIALES & PROMOTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-neutral-900 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-rose-400">
                <Percent className="w-4 h-4" /> Offres Privilèges du Moment
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold">
                Jusqu'à -20% sur une sélection exclusive
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
                Utilisez le code promo <span className="text-amber-300 font-bold bg-neutral-800 px-2 py-0.5 rounded">ZALY10</span> pour -10% immédiats, ou <span className="text-amber-300 font-bold bg-neutral-800 px-2 py-0.5 rounded">BIENVENUE</span> pour -15% dès 500 000 GNF.
              </p>
            </div>

            <button
              onClick={() => navigateToCatalog({ promoOnly: true })}
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition shadow-lg shrink-0"
            >
              Profiter des promotions &rarr;
            </button>
          </div>

          {/* Promo preview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800">
            {promoProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. AVANTAGES DE LA BOUTIQUE EN GUINÉE */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-800">
              Pourquoi nous faire confiance
            </span>
            <h2 className="font-serif-luxury text-3xl font-bold text-neutral-900 mt-1">
              L'Expérience ZALY FASHION en Guinée
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Livraison Garantie Partout</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                À Conakry (Kaloum, Kipé, Nongo, Matam, Matoto) sous 24h à 48h, et dans les préfectures de l'intérieur (N'Zérékoré, Kankan, Kindia, Labé) sous 3 à 5 jours ouvrés.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Paiement Mobile Sécurisé</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Réglez facilement avec votre compte <strong>Orange Money Guinée</strong>, <strong>MTN Mobile Money</strong> ou directement en <strong>espèces à la livraison</strong> après avoir vérifié votre colis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Qualité Internationale & Authenticité</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tissus en laine vierge peignée, popeline de coton d'Égypte, soies italiennes et cuir véritable. Chaque pièce fait l'objet d'un contrôle rigoureux avant expédition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TÉMOIGNAGES DE CLIENTS EN GUINÉE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-800">
            Avis vérifiés
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-neutral-900 mt-1">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              « J'ai commandé le costume croisé pour un mariage à Kipé. La coupe est spectaculaire, digne des plus grands tailleurs parisiens. Livré à domicile en moins de 24h avec paiement Orange Money sans aucun problème ! »
            </p>
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-neutral-900">Mamadou Diallo</h4>
              <span className="text-[11px] text-stone-500">Conakry (Kipé Centre)</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              « La robe en satin émeraude est absolument divine. Le tissu a un reflet magnifique et la taille conseillée sur WhatsApp était parfaite. ZALY FASHION est devenu ma boutique de référence à Conakry. »
            </p>
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-neutral-900">Fatoumata Binta Bah</h4>
              <span className="text-[11px] text-stone-500">Conakry (Camayenne)</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-stone-700 italic leading-relaxed">
              « Commandé depuis N'Zérékoré via le bouton WhatsApp. Le suivi était impeccable et le colis est arrivé intact en 4 jours. Les mocassins en cuir italien sont d'un confort exceptionnel. Bravo ! »
            </p>
            <div className="pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-neutral-900">Moussa Kourouma</h4>
              <span className="text-[11px] text-stone-500">N'Zérékoré (Région Forestière)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER & OFFRE EXCLUSIVE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-stone-800 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
            Rejoignez le Cercle Privilège ZALY
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
            Inscrivez-vous pour recevoir en avant-première nos arrivages exclusifs et recevez un bon de réduction de <strong>10%</strong> valable sur votre prochaine commande.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Merci ! Utilisez le code promo « ZALY10 » pour profiter de vos -10%.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Votre adresse email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-stone-700 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-full transition shadow-md shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>S'inscrire</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-stone-500">
            Désabonnement en un clic à tout moment. Vos données sont protégées.
          </p>
        </div>
      </section>
    </div>
  );
};
