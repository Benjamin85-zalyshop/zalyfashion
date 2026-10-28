import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const InfoPages: React.FC = () => {
  const { currentView, setCurrentView, storeSettings, showToast } = useShop();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    showToast('Message envoyé ! Notre équipe vous répondra sous 24h.');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
  };

  // 1. PAGE À PROPOS
  if (currentView === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-800">
            L'Histoire ZALY FASHION
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-neutral-900">
            Votre Style, Votre Élégance, Votre Identité
          </h1>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
        </div>

        <div className="space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <p>
            Fondée avec la volonté d'offrir à la Guinée et à l'Afrique de l'Ouest une référence incontournable du prêt-à-porter de luxe, <strong>ZALY FASHION</strong> incarne la rencontre entre les exigences de la haute couture internationale et le raffinement contemporain guinéen.
          </p>
          <p>
            Des costumes d'affaires minutieusement coupés aux robes de gala les plus exclusives, en passant par notre maroquinerie en cuir véritable et nos souliers italiens, chaque création est rigoureusement sélectionnée pour la qualité irréprochable de ses matières et de ses finitions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-stone-200">
            <div className="text-center space-y-1">
              <span className="font-serif-luxury text-3xl font-bold text-amber-800">100%</span>
              <h4 className="text-xs font-bold text-neutral-900 uppercase">Qualité Certifiée</h4>
              <p className="text-[11px] text-stone-500">Matières nobles et finitions artisanales contrôlées.</p>
            </div>
            <div className="text-center space-y-1">
              <span className="font-serif-luxury text-3xl font-bold text-amber-800">24h - 48h</span>
              <h4 className="text-xs font-bold text-neutral-900 uppercase">Livraison Conakry</h4>
              <p className="text-[11px] text-stone-500">Service express à domicile ou sur votre lieu de travail.</p>
            </div>
            <div className="text-center space-y-1">
              <span className="font-serif-luxury text-3xl font-bold text-amber-800">7j / 7</span>
              <h4 className="text-xs font-bold text-neutral-900 uppercase">Conseil Styliste</h4>
              <p className="text-[11px] text-stone-500">Accompagnement personnalisé sur WhatsApp.</p>
            </div>
          </div>

          <p>
            Notre showroom situé au cœur du quartier des affaires de Conakry à Kaloum vous accueille sur rendez-vous pour des essayages personnalisés et des commandes sur-mesure.
          </p>
        </div>

        <div className="pt-6 text-center">
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-8 py-3.5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-neutral-800 transition"
          >
            Découvrir nos créations &rarr;
          </button>
        </div>
      </div>
    );
  }

  // 2. PAGE CONTACT & SHOWROOM
  if (currentView === 'contact') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-800">
            Nous Contacter
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900">
            Showroom & Service Client ZALY Conakry
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
            Une question sur une taille, une disponibilité en stock ou une commande spéciale ? Notre équipe est à votre entière disposition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details */}
          <div className="lg:col-span-5 bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Coordonnées</h3>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Adresse du Showroom :</strong>
                  <span>{storeSettings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Téléphone direct :</strong>
                  <span>{storeSettings.phoneContact}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email :</strong>
                  <span>{storeSettings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Horaires d'ouverture :</strong>
                  <span>Lundi au Samedi : 09h00 – 20h00</span>
                  <br />
                  <span>Dimanche : 11h00 – 18h00</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Discussion en direct sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
              Envoyez-nous un Message
            </h3>

            {contactSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Votre message a été transmis avec succès. Nous vous répondrons très rapidement !</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Votre Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Mamadou Camara"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Téléphone Guinée *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+224 6XX XX XX XX"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Adresse Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Votre message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Dites-nous ce que vous recherchez ou posez votre question..."
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. PAGE FAQ
  if (currentView === 'faq') {
    const faqs = [
      {
        q: 'Quels sont les délais de livraison à Conakry et en province ?',
        a: 'À Conakry (Kaloum, Ratoma, Dixinn, Matam, Matoto, Kagbelen), la livraison est effectuée en 24h à 48h ouvrées. Pour les villes de l’intérieur (N’Zérékoré, Kankan, Kindia, Labé, Boké, Mamou), comptez entre 3 et 5 jours ouvrés via notre réseau de partenaires fiables.'
      },
      {
        q: 'Comment s’effectue le paiement à la livraison ?',
        a: 'Vous pouvez régler directement en espèces (Francs Guinéens) auprès de notre coursier lors de la remise du colis, ou effectuer un transfert Orange Money / MTN Mobile Money instantané au moment de la livraison.'
      },
      {
        q: 'Puis-je commander directement sur WhatsApp ?',
        a: 'Oui ! Sur chaque fiche produit et dans votre panier, un bouton vert « Commander sur WhatsApp » génère automatiquement le récapitulatif de votre sélection (nom de l’article, taille, couleur, total) et vous met en relation directe avec nos conseillers.'
      },
      {
        q: 'Que se passe-t-il si la taille ne me convient pas ?',
        a: 'Nous proposons un échange gratuit sous 72h à Conakry. Le vêtement ou la chaussure doit simplement être dans son état neuf avec ses étiquettes et emballage d’origine.'
      },
      {
        q: 'Les articles sont-ils authentiques et de haute qualité ?',
        a: 'Absolument. ZALY FASHION ne propose que des pièces sélectionnées avec soin : laine vierge, coton d’Égypte, cuir pleine fleur glacé à la main et soies italiennes. Aucun compromis sur les finitions.'
      }
    ];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-800">
            Foire Aux Questions
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900">
            Questions Fréquentes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Retrouvez toutes les réponses concernant vos commandes, la livraison et le paiement en Guinée.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. CGV & CONDITIONS LÉGALES
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif-luxury text-3xl font-bold text-neutral-900">
          Conditions Générales de Vente & Mentions Légales
        </h1>
        <p className="text-xs text-stone-500">Maison ZALY FASHION • République de Guinée • 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <section className="space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm">1. Objet & Application</h3>
          <p>
            Les présentes conditions générales régissent l'ensemble des ventes conclues sur le site ZALY FASHION ainsi que par commande directe via WhatsApp ou dans notre showroom à Conakry.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm">2. Prix & Devise</h3>
          <p>
            Les prix de nos produits sont exprimés en Francs Guinéens (GNF) toutes taxes comprises. Les frais de livraison sont clairement indiqués lors de la validation du panier selon la ville de destination en Guinée.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm">3. Modalités de Paiement</h3>
          <p>
            Nous acceptons le paiement en espèces (Cash on Delivery) à la livraison, le paiement mobile via Orange Money Guinée et MTN MoMo, ainsi que les cartes bancaires certifiées.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-neutral-900 text-sm">4. Politique de Retours & Échanges</h3>
          <p>
            En cas de problème de taille ou de non-conformité, un échange est garanti dans un délai de 72 heures suivant la livraison à Conakry. Les produits doivent être retournés non portés, avec leur emballage et étiquettes intacts.
          </p>
        </section>
      </div>
    </div>
  );
};
