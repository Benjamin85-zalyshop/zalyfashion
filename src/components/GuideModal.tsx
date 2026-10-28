import React from 'react';
import { X, CheckCircle2, Sparkles, Download, Layers, Globe } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Oui, vous pouvez créer un site en HTML et CSS ici !</h2>
              <p className="text-xs text-slate-400">Tout ce qu'il faut savoir pour concevoir et exporter votre site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-300">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Deux façons de créer votre site web :
            </h3>
            <ul className="space-y-2 text-slate-300 ml-6 list-disc text-xs sm:text-sm">
              <li>
                <strong className="text-white">Option A — Vous écrivez ou éditez le code vous-même :</strong> Vous disposez ici d'un éditeur temps réel complet avec séparation <code>index.html</code> et <code>style.css</code>. Chaque frappe met immédiatement à jour le site dans l'aperçu.
              </li>
              <li>
                <strong className="text-white">Option B — Vous me demandez de le coder pour vous :</strong> Dites-moi simplement quel type de site vous voulez (un restaurant, un portfolio, une boutique, un blog, une page événementielle...), et je génère l'intégralité du design et du code sur-mesure !
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              2. Téléchargement et Déploiement :
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Vous pouvez à tout instant cliquer sur les boutons <strong className="text-blue-400">Exporter</strong> pour télécharger vos fichiers <code>index.html</code> et <code>style.css</code> bruts. Ils fonctionnent sur n'importe quel navigateur, serveur web, hébergeur gratuit (GitHub Pages, Netlify, Vercel) ou clé USB sans dépendance.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              3. Technologies et Puissance disponibles :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200">HTML5 Sémantique</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Balises header, nav, section, article, footer, audio, video.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200">CSS3 & Animations</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Flexbox, CSS Grid, variables :root, transitions et keyframes.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200">Polices & Médias Web</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Google Fonts, icônes SVG, images externes et dégradés modernes.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-semibold text-slate-200">Responsive Mobile</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Simulateur d'écrans mobile, tablette et grand écran intégré.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm transition shadow-lg shadow-blue-500/20"
          >
            J'ai compris, commencer à créer !
          </button>
        </div>
      </div>
    </div>
  );
};
