import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  Clock,
  MapPin,
  Phone,
  Check
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastCreatedOrder, setCurrentView, formatGNF, getWhatsAppCartUrl, showToast } = useShop();

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900">
          Aucune commande récente trouvée
        </h2>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold"
        >
          Retourner à la boutique
        </button>
      </div>
    );
  }

  const order = lastCreatedOrder;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    showToast(`Numéro ${order.id} copié !`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* 1. Success Hero Box */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-b from-stone-50 to-white text-center space-y-4 border-b border-stone-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900">
            Félicitations pour votre commande !
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Votre commande a bien été enregistrée par la maison <strong>ZALY FASHION</strong>. Notre équipe prépare votre colis avec le plus grand soin.
          </p>

          {/* Unique Order ID badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-300 rounded-xl">
            <span className="text-xs text-stone-500">Numéro de commande :</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-amber-800">
              {order.id}
            </span>
            <button
              onClick={handleCopyOrderId}
              title="Copier le numéro"
              className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-neutral-900"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Order Details & Actions */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick WhatsApp Confirmation Button */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Accélérer votre livraison via WhatsApp</span>
              </h4>
              <p className="text-[11px] text-emerald-800">
                Transmettez votre référence sur WhatsApp pour une prise en charge immédiate à Conakry.
              </p>
            </div>

            <a
              href={getWhatsAppCartUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
            >
              <span>Notifier sur WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Delivery & Payment recap grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Delivery address */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-800" /> Adresse de livraison en Guinée
              </span>
              <p className="font-bold text-neutral-900">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.city} — {order.customer.district}</p>
              <p className="text-stone-600">{order.customer.address}</p>
              <p className="text-stone-500 pt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {order.customer.phone}
              </p>
            </div>

            {/* Payment & Status */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-800" /> Modalités de règlement
              </span>
              <p className="font-bold text-neutral-900 capitalize">
                {order.paymentMethod === 'cod'
                  ? 'Paiement à la livraison (Cash)'
                  : order.paymentMethod === 'orange_money'
                  ? 'Orange Money Guinée'
                  : order.paymentMethod === 'mtn_momo'
                  ? 'MTN Mobile Money'
                  : 'Carte bancaire'}
              </p>
              {order.paymentDetails?.transactionRef && (
                <p className="text-stone-500 font-mono text-[11px]">
                  Réf paiement : {order.paymentDetails.transactionRef}
                </p>
              )}
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-bold text-[10px] uppercase tracking-wide">
                  Statut : {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Articles commandés ({order.items.length})
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
              {order.items.map((i) => (
                <div key={i.itemKey} className="p-3.5 flex items-center gap-3">
                  <img
                    src={i.product.images[0]}
                    alt={i.product.name}
                    className="w-12 h-14 object-cover object-top rounded-md border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-neutral-900 truncate">
                      {i.product.name}
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      Taille : {i.selectedSize} • Couleur : {i.selectedColor.name} • Qté : {i.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {formatGNF(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total calculation */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span>{formatGNF(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Réduction promo :</span>
                  <span>-{formatGNF(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frais de livraison :</span>
                <span>{order.shippingFee === 0 ? 'Gratuite' : formatGNF(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-neutral-900 text-sm pt-2 border-t border-stone-200">
                <span>Montant total :</span>
                <span className="text-amber-800">{formatGNF(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
            <button
              onClick={() => setCurrentView('catalog')}
              className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
            >
              Continuer mes achats
            </button>
            <button
              onClick={() => setCurrentView('tracking')}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-neutral-900 font-bold text-xs rounded-xl transition"
            >
              Suivre cette commande
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le reçu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
