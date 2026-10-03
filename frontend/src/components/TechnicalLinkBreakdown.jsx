import React from 'react';
import { Link2, AlertTriangle, ShieldCheck, ExternalLink, Globe, FileWarning } from 'lucide-react';
import { translations } from '../services/i18n';

export default function TechnicalLinkBreakdown({ links, language }) {
  const t = translations[language] || translations.en;

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-cyan-400" />
          {t.linkAnalysisTitle} ({links.length})
        </h3>
        <span className="text-xs text-slate-400">DNS & URL Forensics</span>
      </div>

      <div className="space-y-3">
        {links.map((link, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              link.is_suspicious
                ? 'bg-rose-950/20 border-rose-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 overflow-hidden">
                <Globe className={`w-4 h-4 shrink-0 ${link.is_suspicious ? 'text-rose-400' : 'text-emerald-400'}`} />
                <span className="font-mono text-sm font-bold text-slate-100 truncate">
                  {link.domain}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {link.has_typosquatting && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300">
                    Impersonating: {link.typosquat_target}
                  </span>
                )}
                {link.is_shortened && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    URL Shortener
                  </span>
                )}
                {link.is_ip_address && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300">
                    Raw IP Host
                  </span>
                )}
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  link.tld_risk === 'dangerous'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  TLD: {link.tld} ({link.tld_risk})
                </span>
              </div>
            </div>

            {/* URL string */}
            <p className="pt-2 text-xs font-mono text-slate-400 break-all">
              {link.url}
            </p>

            {/* Forensic Detail List */}
            {link.details && link.details.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-800/50">
                {link.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
