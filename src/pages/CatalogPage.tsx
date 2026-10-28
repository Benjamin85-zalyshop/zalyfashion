import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Search,
  Check,
  Store
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { products, catalogFilter, setCatalogFilter, resetCatalogFilters, formatGNF, vendors, setCurrentView } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColorHexes, setSelectedColorHexes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1600000);

  // Extract all available sizes & colors from current products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach((p) =>
      p.colors.forEach((c) => {
        if (!map.has(c.hex)) {
          map.set(c.hex, { name: c.name, hex: c.hex });
        }
      })
    );
    return Array.from(map.values());
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Department filter (7 core requested departments)
        if (catalogFilter.department && catalogFilter.department !== 'all') {
          switch (catalogFilter.department) {
            case 'vetements-homme':
              if (
                p.gender !== 'homme' ||
                !['t-shirts', 'chemises', 'polos', 'pantalons', 'jeans', 'costumes', 'vestes', 'survetements', 'shorts'].includes(
                  p.category
                )
              )
                return false;
              break;
            case 'vetements-femme':
              if (
                p.gender !== 'femme' ||
                !['robes', 'ensembles', 'chemisiers', 'jupes', 'tenues-elegantes', 'decontracte'].includes(
                  p.category
                )
              )
                return false;
              break;
            case 'chaussures-homme':
              if (
                p.gender !== 'homme' ||
                !['baskets', 'chaussures-ville', 'mocassins', 'sandales', 'bottines'].includes(p.category)
              )
                return false;
              break;
            case 'chaussures-femme':
              if (
                p.gender !== 'femme' ||
                !['baskets', 'chaussures-ville', 'mocassins', 'sandales', 'talons', 'bottines'].includes(
                  p.category
                )
              )
                return false;
              break;
            case 'sacs-accessoires':
              if (
                !['sacs', 'ceintures', 'montres', 'lunettes', 'portefeuilles', 'bijoux'].includes(
                  p.category
                )
              )
                return false;
              break;
            case 'nouveautes':
              if (!p.isNew) return false;
              break;
            case 'promotions':
              if (!p.isPromo) return false;
              break;
          }
        }

        // Gender filter
        if (catalogFilter.gender && catalogFilter.gender !== 'all') {
          if (p.gender !== catalogFilter.gender && p.gender !== 'mixte') return false;
        }

        // Category filter
        if (catalogFilter.category && catalogFilter.category !== 'all') {
          if (catalogFilter.category === 'chaussures') {
            if (!['baskets', 'chaussures-ville', 'mocassins', 'sandales', 'talons', 'bottines'].includes(p.category))
              return false;
          } else if (catalogFilter.category === 'accessoires') {
            if (!['sacs', 'ceintures', 'montres', 'lunettes', 'portefeuilles', 'bijoux'].includes(p.category))
              return false;
          } else if (p.category !== catalogFilter.category) {
            return false;
          }
        }

        // Vendor filter (Marketplace)
        if (catalogFilter.vendorId && catalogFilter.vendorId !== 'all') {
          const productVendorId = p.vendorId || 'vendor-zaly';
          if (productVendorId !== catalogFilter.vendorId) return false;
        }

        // Search query
        if (catalogFilter.search) {
          const q = catalogFilter.search.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Promo only
        if (catalogFilter.promoOnly && !p.isPromo) return false;

        // New only
        if (catalogFilter.newOnly && !p.isNew) return false;

        // In stock only
        if (inStockOnly && (!p.inStock || p.stockCount <= 0)) return false;

        // Price range
        if (p.price > maxPrice) return false;

        // Sizes filter
        if (selectedSizes.length > 0) {
          const hasSize = p.sizes.some((s) => selectedSizes.includes(s));
          if (!hasSize) return false;
        }

        // Colors filter
        if (selectedColorHexes.length > 0) {
          const hasColor = p.colors.some((c) => selectedColorHexes.includes(c.hex));
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (catalogFilter.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'recent':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'popular':
          default:
            return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        }
      });
  }, [
    products,
    catalogFilter,
    inStockOnly,
    maxPrice,
    selectedSizes,
    selectedColorHexes
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (hex: string) => {
    setSelectedColorHexes((prev) =>
      prev.includes(hex) ? prev.filter((h) => h !== hex) : [...prev, hex]
    );
  };

  const handleFullReset = () => {
    resetCatalogFilters();
    setSelectedSizes([]);
    setSelectedColorHexes([]);
    setInStockOnly(false);
    setMaxPrice(1600000);
  };

  const activeVendor =
    catalogFilter.vendorId && catalogFilter.vendorId !== 'all'
      ? vendors.find((v) => v.id === catalogFilter.vendorId)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header & Title Banner */}
      <div className="pb-6 mb-6 border-b border-stone-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-amber-800">
            Boutique ZALY FASHION Guinée
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
            {catalogFilter.department === 'vetements-homme'
              ? 'Collection Vêtements Homme'
              : catalogFilter.department === 'vetements-femme'
              ? 'Collection Vêtements Femme'
              : catalogFilter.department === 'chaussures-homme'
              ? 'Chaussures & Baskets Homme'
              : catalogFilter.department === 'chaussures-femme'
              ? 'Chaussures & Talons Femme'
              : catalogFilter.department === 'sacs-accessoires'
              ? 'Sacs, Montres & Maroquinerie'
              : catalogFilter.department === 'nouveautes' || catalogFilter.newOnly
              ? 'Nouveautés 2026'
              : catalogFilter.department === 'promotions' || catalogFilter.promoOnly
              ? 'Offres Spéciales & Promotions'
              : catalogFilter.category && catalogFilter.category !== 'all'
              ? `Collection ${catalogFilter.category.toUpperCase()}`
              : catalogFilter.gender === 'homme'
              ? 'Collection Homme'
              : catalogFilter.gender === 'femme'
              ? 'Collection Femme'
              : 'Tous les Vêtements, Chaussures & Accessoires'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {filteredProducts.length} pièce{filteredProducts.length > 1 ? 's' : ''} disponible
            {filteredProducts.length > 1 ? 's' : ''} en stock à Conakry
          </p>
        </div>

        {/* Top Controls: Mobile filter toggle & Sort By dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-neutral-900 rounded-xl text-xs font-semibold transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-800" />
            <span>Filtres ({selectedSizes.length + selectedColorHexes.length + (inStockOnly ? 1 : 0)})</span>
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-xs text-stone-500 font-medium hidden sm:inline">
              Trier par :
            </label>
            <select
              id="sortBy"
              value={catalogFilter.sortBy || 'popular'}
              onChange={(e) =>
                setCatalogFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any
                }))
              }
              className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-amber-700 shadow-xs"
            >
              <option value="popular">⭐ Les plus populaires</option>
              <option value="recent">✨ Nouveautés d'abord</option>
              <option value="price-asc">Prix croissant (GNF)</option>
              <option value="price-desc">Prix décroissant (GNF)</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Department Tabs Bar (7 exact requested categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-stone-200">
        {[
          { id: 'all', label: 'Tout le Catalogue' },
          { id: 'vetements-homme', label: 'Vêtements Homme' },
          { id: 'vetements-femme', label: 'Vêtements Femme' },
          { id: 'chaussures-homme', label: 'Chaussures Homme' },
          { id: 'chaussures-femme', label: 'Chaussures Femme' },
          { id: 'sacs-accessoires', label: 'Sacs & Accessoires' },
          { id: 'nouveautes', label: '✨ Nouveautés' },
          { id: 'promotions', label: '🔥 Promotions %' },
        ].map((dep) => {
          const isActive = (catalogFilter.department || 'all') === dep.id;
          return (
            <button
              key={dep.id}
              onClick={() => {
                if (dep.id === 'all') {
                  setCatalogFilter((prev) => ({
                    ...prev,
                    department: 'all',
                    category: 'all',
                    gender: 'all',
                    promoOnly: false,
                    newOnly: false
                  }));
                } else if (dep.id === 'nouveautes') {
                  setCatalogFilter((prev) => ({
                    ...prev,
                    department: 'nouveautes',
                    newOnly: true,
                    promoOnly: false,
                    category: 'all'
                  }));
                } else if (dep.id === 'promotions') {
                  setCatalogFilter((prev) => ({
                    ...prev,
                    department: 'promotions',
                    promoOnly: true,
                    newOnly: false,
                    category: 'all'
                  }));
                } else {
                  setCatalogFilter((prev) => ({
                    ...prev,
                    department: dep.id as any,
                    promoOnly: false,
                    newOnly: false,
                    category: 'all'
                  }));
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border ${
                isActive
                  ? 'bg-neutral-900 text-amber-300 border-neutral-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-700 hover:text-amber-800'
              }`}
            >
              {dep.label}
            </button>
          );
        })}
      </div>

      {/* 2. Active filters badges */}
      {(catalogFilter.gender !== 'all' ||
        catalogFilter.category !== 'all' ||
        catalogFilter.promoOnly ||
        catalogFilter.newOnly ||
        catalogFilter.search ||
        (catalogFilter.vendorId && catalogFilter.vendorId !== 'all') ||
        selectedSizes.length > 0 ||
        selectedColorHexes.length > 0 ||
        inStockOnly) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone-100/80 rounded-xl text-xs">
          <span className="text-stone-500 font-medium">Filtres actifs :</span>

          {activeVendor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-lg border border-amber-300 font-semibold shadow-2xs">
              <Store className="w-3.5 h-3.5 text-amber-800" />
              <span>Boutique : {activeVendor.storeName}</span>
              <button
                onClick={() => setCatalogFilter((prev) => ({ ...prev, vendorId: 'all' }))}
                className="hover:text-amber-950 font-bold ml-1"
                title="Retirer ce filtre boutique"
              >
                ✕
              </button>
            </span>
          )}

          {catalogFilter.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-stone-800 font-medium">
              « {catalogFilter.search} »
              <button
                onClick={() => setCatalogFilter((prev) => ({ ...prev, search: '' }))}
                className="hover:text-rose-600"
              >
                ✕
              </button>
            </span>
          )}

          {catalogFilter.gender && catalogFilter.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-stone-800 font-medium capitalize">
              Genre : {catalogFilter.gender}
              <button
                onClick={() => setCatalogFilter((prev) => ({ ...prev, gender: 'all' }))}
                className="hover:text-rose-600"
              >
                ✕
              </button>
            </span>
          )}

          {catalogFilter.promoOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 font-medium">
              En promotion %
              <button
                onClick={() => setCatalogFilter((prev) => ({ ...prev, promoOnly: false }))}
                className="hover:text-rose-900"
              >
                ✕
              </button>
            </span>
          )}

          {selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-stone-200 text-stone-800"
            >
              Taille : {s}
              <button onClick={() => toggleSize(s)}>✕</button>
            </span>
          ))}

          <button
            onClick={handleFullReset}
            className="ml-auto text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser tout</span>
          </button>
        </div>
      )}

      {/* 3. Main Catalog Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-6 sticky top-28">
          {/* Genre */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Genre
            </h4>
            <div className="space-y-1.5 text-xs text-stone-700">
              {['all', 'homme', 'femme'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-amber-800">
                  <input
                    type="radio"
                    name="gender"
                    checked={(catalogFilter.gender || 'all') === g}
                    onChange={() =>
                      setCatalogFilter((prev) => ({
                        ...prev,
                        gender: g as any
                      }))
                    }
                    className="text-amber-800 focus:ring-amber-800"
                  />
                  <span className="capitalize">{g === 'all' ? 'Tous les genres' : g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Catégories
            </h4>
            <div className="space-y-1.5 text-xs text-stone-700">
              {[
                { id: 'all', label: 'Toutes les catégories' },
                { id: 'costumes', label: 'Costumes & Smokings' },
                { id: 'vestes', label: 'Vestes & Blazers' },
                { id: 'chemises', label: 'Chemises de Luxe' },
                { id: 'robes', label: 'Robes de Gala & Soirée' },
                { id: 'ensembles', label: 'Ensembles & Tailleurs' },
                { id: 'chaussures', label: 'Chaussures & Baskets' },
                { id: 'accessoires', label: 'Sacs & Accessoires' },
              ].map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-amber-800">
                  <input
                    type="radio"
                    name="category"
                    checked={(catalogFilter.category || 'all') === cat.id}
                    onChange={() =>
                      setCatalogFilter((prev) => ({
                        ...prev,
                        category: cat.id
                      }))
                    }
                    className="text-amber-800 focus:ring-amber-800"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Prix Maximum
              </h4>
              <span className="text-xs font-bold text-amber-800">{formatGNF(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="1600000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>200 000 GNF</span>
              <span>1 600 000 GNF</span>
            </div>
          </div>

          {/* Sizes */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
              Tailles
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
              Couleurs
            </h4>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => {
                const isSelected = selectedColorHexes.includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    onClick={() => toggleColor(color.hex)}
                    title={color.name}
                    style={{ backgroundColor: color.hex }}
                    className={`w-6 h-6 rounded-full border border-stone-300 relative shadow-2xs transition hover:scale-110 flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-amber-800 ring-offset-2' : ''
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In Stock toggle */}
          <div className="pt-4 border-t border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-amber-800 focus:ring-amber-800"
              />
              <span className="font-medium">En stock uniquement à Conakry</span>
            </label>
          </div>

          {/* Marketplace / Vendeurs */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Boutique / Vendeur
            </h4>
            <select
              value={catalogFilter.vendorId || 'all'}
              onChange={(e) =>
                setCatalogFilter((prev) => ({ ...prev, vendorId: e.target.value }))
              }
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-amber-800"
            >
              <option value="all">Tous les vendeurs ({products.length})</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.storeName} {v.isOfficialZaly ? '★' : ''}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {activeVendor && (
            <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-neutral-900 text-white rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {activeVendor.isOfficialZaly ? 'Maison Mère ZALY' : 'Boutique Partenaire Certifiée'}
                    </span>
                    <span className="text-xs text-stone-400">• {activeVendor.city}, Guinée</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif-luxury">{activeVendor.storeName}</h3>
                  <p className="text-xs text-stone-300">
                    Gérant : <strong>{activeVendor.ownerName}</strong> • {filteredProducts.length} article(s) disponible(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentView('boutiques');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition"
                >
                  Toutes les boutiques
                </button>
                <button
                  onClick={() => setCatalogFilter((prev) => ({ ...prev, vendorId: 'all' }))}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition"
                >
                  ✕ Retirer le filtre
                </button>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
                Aucun produit ne correspond à vos filtres
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Essayez d'élargir vos critères de prix, de taille ou de catégorie pour voir nos autres créations.
              </p>
              <button
                onClick={handleFullReset}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col p-5 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-800" />
                  <span>Filtrer les produits</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-stone-100"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Genre Mobile */}
              <div>
                <h4 className="text-xs font-bold uppercase text-neutral-900 mb-2">Genre</h4>
                <div className="flex gap-2">
                  {['all', 'homme', 'femme'].map((g) => (
                    <button
                      key={g}
                      onClick={() =>
                        setCatalogFilter((prev) => ({ ...prev, gender: g as any }))
                      }
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border capitalize ${
                        (catalogFilter.gender || 'all') === g
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {g === 'all' ? 'Tous' : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Mobile */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-bold uppercase text-neutral-900">Prix max</h4>
                  <span className="text-xs font-bold text-amber-800">{formatGNF(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="1600000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />
              </div>

              {/* Sizes Mobile */}
              <div>
                <h4 className="text-xs font-bold uppercase text-neutral-900 mb-2">Tailles</h4>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                        selectedSizes.includes(s)
                          ? 'bg-neutral-900 text-white'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="pt-4 border-t border-stone-200 space-y-2 mt-auto">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Voir les {filteredProducts.length} articles
                </button>
                <button
                  onClick={handleFullReset}
                  className="w-full py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
