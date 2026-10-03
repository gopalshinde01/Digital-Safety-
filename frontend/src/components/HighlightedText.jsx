import React, { useState } from 'react';
import { Flag, Info, AlertCircle, ShieldAlert } from 'lucide-react';
import { translations } from '../services/i18n';

export default function HighlightedText({ originalText, redFlags, language }) {
  const [selectedFlag, setSelectedFlag] = useState(null);
  const t = translations[language] || translations.en;

  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="rounded-2xl glass-panel p-6 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Flag className="w-4 h-4 text-emerald-400" />
          {t.redFlagsTitle}
        </h3>
        <p className="text-sm text-slate-400 italic">
          No manipulative red-flag keywords, pressure tactics, or credential traps were detected in this message.
        </p>
      </div>
    );
  }

  // Highlight matches in the message
  const renderHighlightedMessage = () => {
    let parts = [originalText];

    redFlags.forEach((flag, flagIdx) => {
      const phrase = flag.phrase;
      if (!phrase) return;

      const newParts = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        // Case-insensitive replacement
        const regex = new RegExp(`(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const splitText = part.split(regex);

        splitText.forEach((segment, segIdx) => {
          if (segment.toLowerCase() === phrase.toLowerCase()) {
            newParts.push(
              <mark
                key={`hl-${flagIdx}-${segIdx}`}
                onClick={() => setSelectedFlag(flag)}
                className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded cursor-pointer hover:bg-rose-500/30 transition-all font-semibold"
                title={flag.explanation}
              >
                {segment}
              </mark>
            );
          } else if (segment) {
            newParts.push(segment);
          }
        });
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Flag className="w-4 h-4 text-rose-400" />
          {t.redFlagsTitle} ({redFlags.length})
        </h3>
        <span className="text-xs text-slate-400">Click highlighted tags for threat details</span>
      </div>

      {/* Annotated message display */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {renderHighlightedMessage()}
      </div>

      {/* Flag breakdown pills / list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {redFlags.map((flag, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedFlag(flag)}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              selectedFlag?.phrase === flag.phrase
                ? 'bg-rose-500/10 border-rose-500/50 shadow-md shadow-rose-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {flag.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                {flag.severity} Risk
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">
              "{flag.phrase}"
            </p>
            <p className="text-xs text-slate-400 line-clamp-2">
              {flag.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
