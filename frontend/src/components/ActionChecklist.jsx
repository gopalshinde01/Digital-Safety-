import React from 'react';
import { CheckCircle2, XCircle, PhoneCall, Shield, AlertOctagon, ExternalLink } from 'lucide-react';
import { translations } from '../services/i18n';

export default function ActionChecklist({ result, language }) {
  if (!result) return null;

  const t = translations[language] || translations.en;
  const helplines = result.emergency_helplines || {};

  return (
    <div className="space-y-6">
      
      {/* Side-by-Side: Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommended Actions (Do's) */}
        <div className="rounded-2xl glass-panel p-6 border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {t.recommendedActionsTitle}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {result.recommended_actions?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Traps (What NOT to Do) */}
        <div className="rounded-2xl glass-panel p-6 border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center gap-2 mb-4 text-rose-400">
            <XCircle className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {t.whatNotToDoTitle}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {result.what_not_to_do?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  ✕
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Emergency Cybercrime Helplines & Reporting Bar */}
      <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-blue-950/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {t.emergencyHelplinesTitle}
              </h4>
              <p className="text-xs text-slate-400">
                If money was deducted or credentials stolen, contact official authorities immediately within the golden hour.
              </p>
            </div>
          </div>

          {/* Quick Helpline Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {Object.entries(helplines).map(([title, contact], idx) => {
              const isUrl = contact.startsWith('http');
              return (
                <a
                  key={idx}
                  href={isUrl ? contact : `tel:${contact}`}
                  target={isUrl ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-100 transition shadow-sm hover:shadow-cyan-500/10"
                >
                  <span className="text-cyan-400 font-bold">{contact}</span>
                  <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-none">{title}</span>
                  {isUrl ? <ExternalLink className="w-3 h-3 text-slate-400" /> : <PhoneCall className="w-3 h-3 text-emerald-400" />}
                </a>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
