import React from 'react';
import { Flame, TrendingUp, AlertTriangle, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { translations } from '../services/i18n';

export default function ScamOfTheWeek({ stats, language }) {
  const t = translations[language] || translations.en;
  const scam = stats?.scam_of_the_week;
  const categories = stats?.top_scam_categories || [];

  return (
    <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {t.scamOfTheWeekTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Live threat radar monitoring emerging cybercrime patterns in India
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
          🔥 High Alert Vector
        </span>
      </div>

      {/* Featured Scam Card */}
      {scam && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/20 via-slate-900/60 to-amber-950/20 border border-rose-500/20 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-bold text-rose-200">
              {scam.title}
            </h4>
            <span className="text-xs font-mono text-slate-400">
              Vector: {scam.vector}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {scam.modis_operandi}
          </p>

          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Key Indicators to Watch:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {scam.indicators?.map((ind, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-medium">
            💡 <strong>Prevention Tip:</strong> {scam.prevention_tip}
          </div>
        </div>
      )}

      {/* Trending Scam Categories Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Active Attack Distribution
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200 truncate pr-2">
                  {cat.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  cat.trend.startsWith('+') ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {cat.trend}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${cat.share_pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {cat.share_pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
