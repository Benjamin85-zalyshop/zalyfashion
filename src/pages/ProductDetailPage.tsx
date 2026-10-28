import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Ruler,
  Check,
  Share2,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from '../data/fallbackImages';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    formatGNF,
    toggleWishlist,
    isInWishlist,
    getWhatsAppOrderUrl,
    storeSettings,
    showToast
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Noir', hex: '#000', code: 'blk' });
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // New review form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFav = isInWishlist(product.id);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      setCurrentView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setReviewSubmitted(true);
    showToast('Merci ! Votre avis sera publié après validation.');
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur ZALY FASHION Guinée`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien du produit copié dans le presse-papier !');
    }
  };

  // Similar products in same category or gender
  const similarProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-neutral-900 transition"
        >
          Accueil
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button
          onClick={() => setCurrentView('catalog')}
          className="hover:text-neutral-900 transition"
        >
          {product.gender === 'homme'
            ? 'Homme'
            : product.gender === 'femme'
            ? 'Femme'
            : 'Mixte'}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-400 capitalize">{product.categoryLabel}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Product Hero (Gallery + Purchase Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Photos Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-amber-700 shadow-md scale-95'
                      : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} vue ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-md group">
            <img
              src={
                (() => {
                  const currentImg = product.images?.[activeImageIndex]?.trim() || '';
                  const isValid =
                    currentImg.length > 5 &&
                    (currentImg.startsWith('http://') ||
                      currentImg.startsWith('https://') ||
                      currentImg.startsWith('data:image/') ||
                      currentImg.startsWith('/'));
                  if (isValid) return currentImg;
                  return product.category === 'sacs' || product.name.toLowerCase().includes('sac')
                    ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
                    : CATEGORY_FALLBACK_IMAGES[product.category] || DEFAULT_LUXURY_IMAGE;
                })()
              }
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  product.category === 'sacs' || product.name.toLowerCase().includes('sac')
                    ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
                    : CATEGORY_FALLBACK_IMAGES[product.category] || DEFAULT_LUXURY_IMAGE;
              }}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-neutral-900 text-amber-300 text-xs font-bold uppercase rounded-md shadow-md tracking-wider">
                  Nouveau 2026
                </span>
              )}
              {discountPercentage && (
                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase rounded-md shadow-md tracking-wider">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Wishlist & Share buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md flex items-center justify-center transition"
                aria-label="Ajouter aux favoris"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-neutral-900 shadow-md flex items-center justify-center transition"
                aria-label="Partager"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-800">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">
                  ({product.reviewCount} avis vérifiés)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* SKU */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <span>RÉF : {product.sku}</span>
              <div className="flex items-center gap-1.5 text-stone-600 bg-stone-100/90 px-2 py-0.5 rounded-md font-sans">
                <span>Vendu par :</span>
                <span className="font-bold text-amber-800">
                  {product.vendorName || 'ZALY FASHION Officiel'}
                </span>
                <span className="text-[10px] text-amber-600">★</span>
              </div>
            </div>

            {/* Price section in GNF */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-baseline gap-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {formatGNF(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm sm:text-base text-stone-400 line-through">
                  {formatGNF(product.originalPrice)}
                </div>
              )}
              {discountPercentage && (
                <span className="ml-auto text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                  Économie : {formatGNF(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {product.inStock && product.stockCount > 0 ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-emerald-800">
                    En stock à Conakry — {product.stockCount} pièces restantes
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-rose-700">Rupture de stock temporaire</span>
                </>
              )}
            </div>

            {/* Color selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Couleur : <span className="font-normal text-stone-600">{selectedColor.name}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition shadow-xs flex items-center justify-center ${
                      selectedColor.code === c.code
                        ? 'border-amber-800 ring-2 ring-amber-800/40 ring-offset-2 scale-110'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                  >
                    {selectedColor.code === c.code && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Taille : <span className="font-normal text-stone-600">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guide des tailles</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      selectedSize === s
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-2">
                Quantité
              </span>
              <div className="flex items-center w-36 border border-stone-300 rounded-xl bg-stone-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-stone-600 hover:text-neutral-900 hover:bg-stone-200 rounded-l-xl transition"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  disabled={quantity >= product.stockCount}
                  className="px-3 py-2 text-stone-600 hover:text-neutral-900 hover:bg-stone-200 rounded-r-xl transition disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stockCount <= 0}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Ajouter au panier</span>
              </button>

              {/* Buy Now (Direct Checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock || product.stockCount <= 0}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Acheter maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Order via WhatsApp */}
              <a
                href={getWhatsAppOrderUrl(product, selectedSize, selectedColor.name, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Commander directement sur WhatsApp</span>
              </a>
            </div>

            {/* Quick Guarantees Box */}
            <div className="p-4 bg-stone-100/70 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Livraison Conakry en 24h-48h • Intérieur de la Guinée en 3-5j</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Paiement par Orange Money, MTN MoMo ou Cash à la réception</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Échange gratuit sous 72h si la taille ne convient pas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs (Description, Composition & Entretien, Avis) */}
      <div className="mt-16 pt-10 border-t border-stone-200">
        <div className="flex border-b border-stone-200 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 px-4 transition ${
              activeTab === 'desc'
                ? 'border-b-2 border-amber-800 text-amber-800'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            Description Détaillée
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-4 transition ${
              activeTab === 'specs'
                ? 'border-b-2 border-amber-800 text-amber-800'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            Composition & Entretien
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 transition flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-b-2 border-amber-800 text-amber-800'
                : 'text-stone-500 hover:text-neutral-900'
            }`}
          >
            <span>Avis Clients</span>
            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full">
              {product.reviews ? product.reviews.length : 2}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6 text-xs sm:text-sm text-stone-700 leading-relaxed max-w-4xl">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <h5 className="font-bold text-neutral-900 mb-1">Coupe & Silhouette</h5>
                  <p className="text-stone-600 text-xs">Conception étudiée pour sublimer la silhouette tout en garantissant un tombé fluide et élégant.</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <h5 className="font-bold text-neutral-900 mb-1">Fabrication d'Excellence</h5>
                  <p className="text-xs text-stone-600">Points de couture invisibles et finitions manuelles garantissant une longévité supérieure.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <h5 className="font-bold text-neutral-900 mb-1">Matières & Composition :</h5>
                <p className="text-stone-600">{product.composition}</p>
              </div>
              <div className="pt-2">
                <h5 className="font-bold text-neutral-900 mb-1">Conseils d'Entretien :</h5>
                <p className="text-stone-600">{product.careInstructions}</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {(product.reviews || [
                  {
                    id: 'rev-default-1',
                    author: 'Sekou Diallo',
                    city: 'Conakry',
                    rating: 5,
                    date: '18 Octobre 2026',
                    comment: 'Très belle finition, tissu de qualité. La livraison a été ponctuelle à mon bureau à Kaloum.',
                    verified: true
                  }
                ]).map((r) => (
                  <div key={r.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{r.author}</span>
                        {r.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Achat vérifié
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">{r.date}</span>
                    </div>
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600">{r.comment}</p>
                    <span className="text-[10px] text-stone-400 block">{r.city}</span>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-xl">
                <h4 className="font-bold text-neutral-900 text-sm">Donner votre avis sur ce produit</h4>
                {reviewSubmitted ? (
                  <p className="text-emerald-700 text-xs font-semibold">
                    Merci pour votre retour ! Votre avis apparaîtra très prochainement.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Votre nom *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="Mamadou Barry"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Ville / Quartier *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewCity}
                          onChange={(e) => setNewReviewCity(e.target.value)}
                          placeholder="Conakry (Kipé)"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Note :
                      </label>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setNewReviewRating(s)}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= newReviewRating ? 'fill-amber-500' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Votre commentaire *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Qualité du tissu, coupe, confort..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-neutral-900 text-white font-bold text-xs rounded-lg hover:bg-neutral-800 transition"
                    >
                      Envoyer mon avis
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
              Vous Pourriez Aussi Aimer
            </h3>
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
