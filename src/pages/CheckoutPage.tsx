import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { GUINEA_CITIES, CONAKRY_DISTRICTS } from '../data/initialData';
import { PaymentMethod, CustomerDeliveryInfo } from '../types/ecommerce';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronLeft,
  CheckCircle2,
  Info
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedPromo,
    formatGNF,
    getShippingFee,
    shippingCityId,
    setShippingCityId,
    createOrder,
    setCurrentView,
    storeSettings
  } = useShop();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [district, setDistrict] = useState(CONAKRY_DISTRICTS[0]);
  const [customDistrict, setCustomDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto stroke-1" />
        <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900">
          Votre panier est vide
        </h2>
        <p className="text-xs text-stone-500">
          Vous ne pouvez pas finaliser de commande sans avoir sélectionné d'articles.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition"
        >
          Découvrir les collections &rarr;
        </button>
      </div>
    );
  }

  const selectedCity = GUINEA_CITIES.find((c) => c.id === shippingCityId) || GUINEA_CITIES[0];
  const shippingFee = getShippingFee(shippingCityId, cartSubtotal);
  const discountAmount = appliedPromo
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Veuillez saisir votre nom complet';
    if (!phone.trim()) newErrors.phone = 'Numéro de téléphone requis pour la livraison';
    if (!address.trim()) newErrors.address = 'Précisez votre adresse ou repère de livraison';
    if (paymentMethod === 'orange_money' && !transactionRef.trim()) {
      newErrors.transactionRef = 'Veuillez saisir la référence de transaction Orange Money';
    }
    if (paymentMethod === 'mtn_momo' && !transactionRef.trim()) {
      newErrors.transactionRef = 'Veuillez saisir la référence de transaction MoMo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const customerInfo: CustomerDeliveryInfo = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      city: selectedCity.name,
      district: selectedCity.id === 'conakry' ? district : (customDistrict || 'Centre-ville'),
      address: address.trim(),
      notes: notes.trim()
    };

    setTimeout(() => {
      createOrder({
        customer: customerInfo,
        paymentMethod,
        transactionRef: transactionRef.trim() || undefined,
        cityId: shippingCityId
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Top back button & title */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('catalog')}
          className="p-2 text-stone-500 hover:text-neutral-900 rounded-lg hover:bg-stone-100 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif-luxury text-3xl font-bold text-neutral-900 tracking-tight">
            Finaliser votre Commande
          </h1>
          <p className="text-xs text-stone-500">
            Livraison sécurisée à Conakry et dans toute la Guinée
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form: Delivery info & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Coordonnées & Livraison */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
                <Truck className="w-5 h-5 text-amber-800" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  1. Informations de Livraison en Guinée
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Sekouba Traoré"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Numéro de Téléphone (Appels) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+224 6XX XX XX XX"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Numéro WhatsApp (Pour le suivi)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+224 6XX XX XX XX (ou identique)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                  />
                </div>

                {/* Ville ou Préfecture */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Ville ou Région de Guinée *
                  </label>
                  <select
                    value={shippingCityId}
                    onChange={(e) => setShippingCityId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition font-medium"
                  >
                    {GUINEA_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.delay})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Commune ou Quartier si Conakry */}
              {shippingCityId === 'conakry' ? (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Commune / Quartier de Conakry *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition font-medium"
                  >
                    {CONAKRY_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Quartier ou Repère dans la ville *
                  </label>
                  <input
                    type="text"
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    placeholder="Ex: Quartier Commercial, près du Grand Marché"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                  />
                </div>
              )}

              {/* Adresse détaillée */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Adresse précise & Indication de livraison *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Villa 12, Rue des Ambassades, face à la Pharmacie"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                />
                {errors.address && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.address}</span>
                )}
              </div>

              {/* Instructions */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Remarques ou instructions de livraison (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Appeler avant d'arriver, livraison possible entre 14h et 18h..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 2. Mode de Paiement */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
                <ShieldCheck className="w-5 h-5 text-amber-800" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  2. Mode de Paiement en Guinée
                </h2>
              </div>

              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-amber-800 focus:ring-amber-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        Paiement en espèces à la livraison (Cash)
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Payez le montant exact en Francs Guinéens (GNF) au livreur après réception et inspection de vos articles.
                    </p>
                  </div>
                </label>

                {/* 2. Orange Money Guinée */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'orange_money'
                      ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'orange_money'}
                    onChange={() => setPaymentMethod('orange_money')}
                    className="mt-0.5 text-amber-800 focus:ring-amber-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-orange-600" />
                        Orange Money Guinée
                      </span>
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                        Instantané
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Effectuez le transfert vers notre compte marchand officiel ZALY FASHION :{' '}
                      <strong className="text-orange-600 font-bold">
                        {storeSettings.orangeMoneyMerchantNumber}
                      </strong>.
                    </p>

                    {paymentMethod === 'orange_money' && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200 space-y-2">
                        <label className="text-[11px] font-bold text-neutral-900 block">
                          Numéro de transaction reçu par SMS (ex: OM-GN-XXXX) :
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="Code référence SMS Orange Money..."
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                        {errors.transactionRef && (
                          <span className="text-[10px] text-rose-600 block">{errors.transactionRef}</span>
                        )}
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. MTN Mobile Money */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'mtn_momo'
                      ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'mtn_momo'}
                    onChange={() => setPaymentMethod('mtn_momo')}
                    className="mt-0.5 text-amber-800 focus:ring-amber-800"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-yellow-600" />
                      MTN Mobile Money Guinée (MoMo Pay)
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Paiement direct sur le numéro marchand MTN :{' '}
                      <strong>{storeSettings.momoMerchantNumber}</strong>.
                    </p>

                    {paymentMethod === 'mtn_momo' && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-yellow-200 space-y-2">
                        <label className="text-[11px] font-bold text-neutral-900 block">
                          ID de transaction MoMo :
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="Référence transaction MoMo..."
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* 4. Carte bancaire */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 text-amber-800 focus:ring-amber-800"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Carte Bancaire (Visa / Mastercard)
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Paiement sécurisé par terminal de paiement électronique (TPE) à la livraison ou par passerelle internationale.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Order Items & Grand Total (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-md space-y-5 sticky top-28">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 pb-3 border-b border-stone-200 flex items-center justify-between">
              <span>Récapitulatif de votre Panier</span>
              <span className="text-xs font-semibold text-amber-800">
                {cart.length} article{cart.length > 1 ? 's' : ''}
              </span>
            </h3>

            {/* Items list */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 space-y-2">
              {cart.map((i) => (
                <div key={i.itemKey} className="pt-2 flex items-center gap-3">
                  <img
                    src={i.product.images[0]}
                    alt={i.product.name}
                    className="w-14 h-16 object-cover object-top rounded-md border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-neutral-900 truncate">
                      {i.product.name}
                    </h5>
                    <p className="text-[10px] text-stone-500">
                      Taille: {i.selectedSize} • Coul: {i.selectedColor.name} • Qté: {i.quantity}
                    </p>
                    <span className="text-xs font-bold text-neutral-900">
                      {formatGNF(i.product.price * i.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Costs calculation */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Sous-total articles</span>
                <span className="font-semibold text-neutral-900">{formatGNF(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Réduction promo ({appliedPromo?.discountPercent}%)</span>
                  <span>-{formatGNF(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>
                  Frais de livraison ({selectedCity.name})
                </span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Gratuite</span>
                  ) : (
                    formatGNF(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-stone-200">
                <span>Total à régler</span>
                <span className="text-amber-800 text-lg">{formatGNF(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  <span>Confirmer & Commander ({formatGNF(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-stone-700">
                <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Délais estimés : {selectedCity.delay}</span>
              </p>
              <p>Un reçu avec votre numéro de commande unique vous sera immédiatement délivré.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
