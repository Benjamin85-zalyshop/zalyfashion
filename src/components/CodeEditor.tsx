import React from 'react';
import { Copy, Check, Plus, Code2, Paintbrush, Undo2 } from 'lucide-react';
import { CODE_SNIPPETS } from '../snippets';

interface CodeEditorProps {
  activeTab: 'html' | 'css';
  onTabChange: (tab: 'html' | 'css') => void;
  html: string;
  css: string;
  onHtmlChange: (code: string) => void;
  onCssChange: (code: string) => void;
  onResetToTemplate: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  onTabChange,
  html,
  css,
  onHtmlChange,
  onCssChange,
  onResetToTemplate,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showSnippets, setShowSnippets] = React.useState(false);

  const currentCode = activeTab === 'html' ? html : css;
  const lineCount = React.useMemo(() => {
    return currentCode.split('\n').length;
  }, [currentCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertSnippet = (snippetCode: string) => {
    if (activeTab === 'html') {
      if (html.includes('</body>')) {
        onHtmlChange(html.replace('</body>', `  ${snippetCode}\n</body>`));
      } else {
        onHtmlChange(html + '\n\n' + snippetCode);
      }
    } else {
      onCssChange(css + '\n\n' + snippetCode);
    }
    setShowSnippets(false);
  };

  const filteredSnippets = CODE_SNIPPETS.filter((s) => s.category === activeTab);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'html'
                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-orange-400" />
            <span>index.html</span>
          </button>

          <button
            onClick={() => onTabChange('css')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'css'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5 text-blue-400" />
            <span>style.css</span>
          </button>
        </div>

        {/* Toolbar Tools */}
        <div className="flex items-center gap-2">
          {/* Snippets inserter */}
          <div className="relative">
            <button
              onClick={() => setShowSnippets(!showSnippets)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition text-xs font-medium"
              title="Insérer un composant"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>Insérer composant</span>
            </button>

            {showSnippets && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-semibold text-slate-300 px-2 py-1 mb-1 border-b border-slate-800 flex justify-between items-center">
                  <span>Composants {activeTab.toUpperCase()}</span>
                  <span className="text-[10px] text-slate-500">{filteredSnippets.length} dispos</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredSnippets.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => insertSnippet(s.code)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition group"
                    >
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{s.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={onResetToTemplate}
            title="Réinitialiser ce fichier au modèle d'origine"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition text-xs"
            title="Copier le code dans le presse-papier"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden bg-slate-950 font-mono text-xs sm:text-sm">
        {/* Line Numbers column */}
        <div className="select-none py-3 px-2 sm:px-3 text-right bg-slate-950/80 text-slate-600 border-r border-slate-800/80 font-mono text-[11px] sm:text-xs">
          {Array.from({ length: Math.min(lineCount, 600) }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={currentCode}
          onChange={(e) => {
            if (activeTab === 'html') {
              onHtmlChange(e.target.value);
            } else {
              onCssChange(e.target.value);
            }
          }}
          spellCheck={false}
          className="flex-1 w-full p-3 bg-transparent text-slate-200 focus:outline-none resize-none font-mono leading-6 overflow-y-auto selection:bg-blue-600 selection:text-white"
          placeholder={
            activeTab === 'html'
              ? 'Écrivez votre structure HTML ici...'
              : 'Écrivez vos règles de style CSS ici...'
          }
        />
      </div>

      {/* Bottom status bar */}
      <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center select-none">
        <div>
          Format : <span className="text-slate-300 font-medium">{activeTab.toUpperCase()}5</span> • UTF-8
        </div>
        <div>{lineCount} lignes</div>
      </div>
    </div>
  );
};
