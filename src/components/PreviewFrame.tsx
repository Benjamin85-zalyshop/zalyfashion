import React from 'react';
import { ViewportMode } from '../types';
import { Smartphone, Tablet, Monitor, RotateCcw, ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  html: string;
  css: string;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onOpenNewTab: () => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  html,
  css,
  viewport,
  onViewportChange,
  onOpenNewTab,
}) => {
  const [key, setKey] = React.useState(0);

  // Injects the CSS into the HTML inside the <head> if possible, or prepends it
  const combinedContent = React.useMemo(() => {
    const styleTag = `<style>\n${css}\n</style>`;
    if (html.includes('</head>')) {
      return html.replace('</head>', `${styleTag}\n</head>`);
    }
    return `${styleTag}\n${html}`;
  }, [html, css]);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Bar / Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span className="font-semibold text-slate-200">Aperçu en direct</span>
          <span className="hidden sm:inline text-slate-500">• Rendu HTML & CSS instantané</span>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onViewportChange('desktop')}
            title="Vue Ordinateur (Plein écran)"
            className={`flex items-center gap-1 px-2 py-1 rounded transition ${
              viewport === 'desktop'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bureau</span>
          </button>
          <button
            onClick={() => onViewportChange('tablet')}
            title="Vue Tablette (768px)"
            className={`flex items-center gap-1 px-2 py-1 rounded transition ${
              viewport === 'tablet'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablette</span>
          </button>
          <button
            onClick={() => onViewportChange('mobile')}
            title="Vue Mobile (375px)"
            className={`flex items-center gap-1 px-2 py-1 rounded transition ${
              viewport === 'mobile'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            title="Recharger l'aperçu"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenNewTab}
            title="Ouvrir dans une nouvelle fenêtre"
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Plein Écran</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950 p-2 sm:p-4 flex justify-center items-stretch overflow-auto">
        <div
          className={`${getViewportWidth()} transition-all duration-300 h-full flex flex-col bg-white rounded-lg shadow-xl overflow-hidden border border-slate-700`}
        >
          <iframe
            key={key}
            title="Live Preview"
            srcDoc={combinedContent}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-modals allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
