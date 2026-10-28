import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star, MessageCircle } from 'lucide-react';
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_LUXURY_IMAGE } from '../data/fallbackImages';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, formatGNF, addToCart, toggleWishlist, isInWishlist, getWhatsAppOrderUrl } = useShop();
  const isFav = isInWishlist(product.id);
  const getInitialImage = () => {
    const rawImg = product.images && product.images[0] ? product.images[0].trim() : '';
    const isValidUrl =
      rawImg.length > 5 &&
      (rawImg.startsWith('http://') ||
        rawImg.startsWith('https://') ||
        rawImg.startsWith('data:image/') ||
        rawImg.startsWith('/'));

    if (isValidUrl) {
      return rawImg;
    }

    if (product.category === 'sacs' || product.name.toLowerCase().includes('sac')) {
      return 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop';
    }
    return CATEGORY_FALLBACK_IMAGES[product.category] || DEFAULT_LUXURY_IMAGE;
  };

  const [imgSrc, setImgSrc] = useState<string>(getInitialImage);

  React.useEffect(() => {
    setImgSrc(getInitialImage());
  }, [product.id, product.images, product.category, product.name]);

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock && product.sizes.length > 0 && product.colors.length > 0) {
      addToCart(product, product.sizes[0], product.colors[0], 1);
    } else {
      openProductDetail(product.id);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => openProductDetail(product.id)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/70 hover:border-amber-700/40 hover:shadow-xl transition-all duration-300"
    >
      {/* 1. Image Container (Ratio 3:4) */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        {/* Main Image */}
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => {
            const fallback =
              product.category === 'sacs' || product.name.toLowerCase().includes('sac')
                ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
                : CATEGORY_FALLBACK_IMAGES[product.category] || DEFAULT_LUXURY_IMAGE;
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-amber-300 rounded shadow-sm">
              Nouveau
            </span>
          )}
          {discountPercentage && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {product.isPopular && !product.isNew && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-700 text-white rounded shadow-sm">
              Populaire
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300 rounded shadow-sm">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Ajouter aux favoris"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md flex items-center justify-center transition z-10"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick Sizes overlay on hover */}
        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto max-w-[70%]">
            {product.sizes.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-[10px] bg-white/90 text-neutral-900 font-semibold px-1.5 py-0.5 rounded shadow-xs"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-white font-semibold">+{product.sizes.length - 4}</span>
            )}
          </div>
          <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Eye className="w-3 h-3" /> Voir
          </span>
        </div>
      </div>

      {/* 2. Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-medium">{product.categoryLabel}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-amber-800 transition">
            {product.name}
          </h3>

          {/* Vendor tag */}
          <div className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
            Boutique :{' '}
            <span className="text-amber-800 font-semibold">
              {product.vendorName || 'ZALY FASHION Officiel'}
            </span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {product.colors.map((c) => (
              <span
                key={c.code}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs"
              />
            ))}
            <span className="text-[10px] text-stone-400 ml-1">
              {product.colors.length} {product.colors.length > 1 ? 'couleurs' : 'couleur'}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-neutral-900 tracking-tight">
              {formatGNF(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[10px] sm:text-xs text-stone-400 line-through">
                {formatGNF(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={getWhatsAppOrderUrl(product, product.sizes[0], product.colors[0]?.name, 1)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Commander sur WhatsApp"
              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>

            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              title={product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                product.inStock
                  ? 'bg-stone-100 hover:bg-neutral-900 text-neutral-800 hover:text-white'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
