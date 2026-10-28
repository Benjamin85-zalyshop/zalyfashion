import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'homme' | 'femme' | 'chaussures'>('homme');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Guide des Tailles ZALY FASHION</h3>
              <p className="text-xs text-stone-500">Trouvez votre coupe parfaite pour chaque vêtement et chaussure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('homme')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'homme'
                ? 'bg-white text-neutral-900 border-b-2 border-amber-800'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Vêtements Homme
          </button>
          <button
            onClick={() => setActiveTab('femme')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'femme'
                ? 'bg-white text-neutral-900 border-b-2 border-amber-800'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Vêtements Femme
          </button>
          <button
            onClick={() => setActiveTab('chaussures')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'chaussures'
                ? 'bg-white text-neutral-900 border-b-2 border-amber-800'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Chaussures (EU/US)
          </button>
        </div>

        {/* Table Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'homme' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-sm">Costumes, Blazers & Chemises Homme</h4>
              <table className="w-full text-left border-collapse border border-stone-200">
                <thead>
                  <tr className="bg-stone-100 text-stone-700">
                    <th className="p-2 border border-stone-200">Taille ZALY</th>
                    <th className="p-2 border border-stone-200">Tour de Poitrine (cm)</th>
                    <th className="p-2 border border-stone-200">Tour de Taille (cm)</th>
                    <th className="p-2 border border-stone-200">Correspondance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">48 / S</td>
                    <td className="p-2 border border-stone-200">94 - 98 cm</td>
                    <td className="p-2 border border-stone-200">80 - 84 cm</td>
                    <td className="p-2 border border-stone-200">Small</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">50 / M</td>
                    <td className="p-2 border border-stone-200">98 - 102 cm</td>
                    <td className="p-2 border border-stone-200">84 - 88 cm</td>
                    <td className="p-2 border border-stone-200">Medium standard</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">52 / L</td>
                    <td className="p-2 border border-stone-200">102 - 106 cm</td>
                    <td className="p-2 border border-stone-200">88 - 92 cm</td>
                    <td className="p-2 border border-stone-200">Large</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">54 / XL</td>
                    <td className="p-2 border border-stone-200">106 - 110 cm</td>
                    <td className="p-2 border border-stone-200">92 - 96 cm</td>
                    <td className="p-2 border border-stone-200">Extra Large</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">56 / XXL</td>
                    <td className="p-2 border border-stone-200">110 - 116 cm</td>
                    <td className="p-2 border border-stone-200">96 - 102 cm</td>
                    <td className="p-2 border border-stone-200">Double XL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'femme' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-sm">Robes, Ensembles & Chemisiers Femme</h4>
              <table className="w-full text-left border-collapse border border-stone-200">
                <thead>
                  <tr className="bg-stone-100 text-stone-700">
                    <th className="p-2 border border-stone-200">Taille</th>
                    <th className="p-2 border border-stone-200">Poitrine (cm)</th>
                    <th className="p-2 border border-stone-200">Taille (cm)</th>
                    <th className="p-2 border border-stone-200">Hanches (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">36 / S</td>
                    <td className="p-2 border border-stone-200">82 - 86 cm</td>
                    <td className="p-2 border border-stone-200">64 - 68 cm</td>
                    <td className="p-2 border border-stone-200">88 - 92 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">38 / M</td>
                    <td className="p-2 border border-stone-200">86 - 90 cm</td>
                    <td className="p-2 border border-stone-200">68 - 72 cm</td>
                    <td className="p-2 border border-stone-200">92 - 96 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">40 / L</td>
                    <td className="p-2 border border-stone-200">90 - 94 cm</td>
                    <td className="p-2 border border-stone-200">72 - 76 cm</td>
                    <td className="p-2 border border-stone-200">96 - 100 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">42 / XL</td>
                    <td className="p-2 border border-stone-200">94 - 100 cm</td>
                    <td className="p-2 border border-stone-200">76 - 82 cm</td>
                    <td className="p-2 border border-stone-200">100 - 106 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'chaussures' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-sm">Guide des Pointures Chaussures</h4>
              <table className="w-full text-left border-collapse border border-stone-200">
                <thead>
                  <tr className="bg-stone-100 text-stone-700">
                    <th className="p-2 border border-stone-200">Pointure EU (Guinée)</th>
                    <th className="p-2 border border-stone-200">Longueur du pied (cm)</th>
                    <th className="p-2 border border-stone-200">US Homme</th>
                    <th className="p-2 border border-stone-200">US Femme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">37</td>
                    <td className="p-2 border border-stone-200">23.5 cm</td>
                    <td className="p-2 border border-stone-200">5.5</td>
                    <td className="p-2 border border-stone-200">6.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">38</td>
                    <td className="p-2 border border-stone-200">24.0 cm</td>
                    <td className="p-2 border border-stone-200">6.0</td>
                    <td className="p-2 border border-stone-200">7.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">39</td>
                    <td className="p-2 border border-stone-200">24.5 cm</td>
                    <td className="p-2 border border-stone-200">6.5</td>
                    <td className="p-2 border border-stone-200">8.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">40</td>
                    <td className="p-2 border border-stone-200">25.0 cm</td>
                    <td className="p-2 border border-stone-200">7.5</td>
                    <td className="p-2 border border-stone-200">9.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">41</td>
                    <td className="p-2 border border-stone-200">26.0 cm</td>
                    <td className="p-2 border border-stone-200">8.0</td>
                    <td className="p-2 border border-stone-200">9.5</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">42</td>
                    <td className="p-2 border border-stone-200">26.5 cm</td>
                    <td className="p-2 border border-stone-200">8.5</td>
                    <td className="p-2 border border-stone-200">10.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">43</td>
                    <td className="p-2 border border-stone-200">27.5 cm</td>
                    <td className="p-2 border border-stone-200">9.5</td>
                    <td className="p-2 border border-stone-200">11.0</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-stone-200">44</td>
                    <td className="p-2 border border-stone-200">28.0 cm</td>
                    <td className="p-2 border border-stone-200">10.0</td>
                    <td className="p-2 border border-stone-200">12.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600">
            <strong>Un doute sur votre taille ?</strong> Contactez notre conseiller styliste sur WhatsApp au{' '}
            <span className="text-amber-800 font-bold">+224 625 66 75 22</span>. Si la taille ne vous convient pas, nous effectuons l’échange gratuitement sous 72h à Conakry.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
