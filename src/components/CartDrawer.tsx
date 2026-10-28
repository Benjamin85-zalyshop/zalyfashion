import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    formatGNF,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    storeSettings,
    setCurrentView,
    getWhatsAppCartUrl
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput.trim());
    setPromoFeedback({ msg: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const discountAmount = appliedPromo
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const totalEstimate = Math.max(0, cartSubtotal - discountAmount);

  // Free shipping progress
  const freeThreshold = storeSettings.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const amountLeftForFree = Math.max(0, freeThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                Votre Panier d'Achat
              </h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-neutral-900 hover:bg-stone-200 transition"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Alert Bar */}
          <div className="bg-amber-50/70 border-b border-amber-200/60 p-3 text-xs text-stone-700">
            {amountLeftForFree > 0 ? (
              <div>
                <p className="font-medium text-stone-800">
                  Ajoutez encore <strong className="text-amber-800">{formatGNF(amountLeftForFree)}</strong> pour bénéficier de la <span className="underline">Livraison Gratuite en Guinée</span> !
                </p>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Félicitations ! Vous bénéficiez de la livraison offerte en Guinée !
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300 mb-3" />
                <h3 className="text-sm font-bold text-neutral-800 mb-1">Votre panier est vide</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Découvrez nos collections pour Homme, Femme, Chaussures et Accessoires à Conakry.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-full transition shadow-md"
                >
                  Découvrir les collections &rarr;
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.itemKey} className="py-4 flex gap-3 sm:gap-4 group">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-top rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.itemKey)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        <span>Taille : <strong className="text-stone-700">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Couleur :
                          <span
                            style={{ backgroundColor: item.selectedColor.hex }}
                            className="inline-block w-2.5 h-2.5 rounded-full border border-stone-300"
                          />
                          <span className="text-stone-700 font-medium">{item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(item.itemKey, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:text-neutral-900 hover:bg-stone-200 transition rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.itemKey, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockCount}
                          className="px-2 py-1 text-stone-600 hover:text-neutral-900 hover:bg-stone-200 transition rounded-r disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatGNF(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Promo code input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code « {appliedPromo.code} » (-{appliedPromo.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-rose-600 text-xs font-bold"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code promo (ex: ZALY10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs uppercase focus:outline-none focus:border-amber-700"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Appliquer
                    </button>
                  </form>
                )}
                {promoFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      promoFeedback.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'
                    }`}
                  >
                    {promoFeedback.msg}
                  </p>
                )}
              </div>

              {/* Subtotals & Total */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-semibold text-neutral-900">{formatGNF(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Réduction ({appliedPromo?.discountPercent}%)</span>
                    <span>-{formatGNF(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-semibold text-stone-700">
                    {cartSubtotal >= freeThreshold ? (
                      <span className="text-emerald-700 font-bold">Gratuite</span>
                    ) : (
                      'Calculés à la commande'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-neutral-900 pt-2 border-t border-stone-200">
                  <span>Total estimé</span>
                  <span className="text-amber-800">{formatGNF(totalEstimate)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Passer la commande</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>

                {/* Direct WhatsApp Ordering */}
                <a
                  href={getWhatsAppCartUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Commander via WhatsApp</span>
                </a>
              </div>

              {/* Guarantee text */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Paiement sécurisé en Guinée • Échange sous 72h</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
