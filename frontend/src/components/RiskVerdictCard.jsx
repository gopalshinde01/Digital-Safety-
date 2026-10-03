import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Cpu, Link2, Flag, ExternalLink, Sparkles } from 'lucide-react';
import { translations } from '../services/i18n';

export default function RiskVerdictCard({ result, language }) {
  if (!result) return null;

  const t = translations[language] || translations.en;
  const score = result.risk_score;
  const verdict = result.verdict;

  // Visual styling based on verdict
  let colorTheme = {
    badge: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
    gaugeBg: 'stroke-emerald-500',
    glow: 'neon-border-green',
    title: t.verdictSafe,
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    gradient: 'from-emerald-500/20 via-slate-900/50 to-slate-950'
  };

  if (verdict === 'Suspicious') {
    colorTheme = {
      badge: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
      gaugeBg: 'stroke-amber-500',
      glow: 'neon-border-amber',
      title: t.verdictSuspicious,
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      gradient: 'from-amber-500/20 via-slate-900/50 to-slate-950'
    };
  } else if (verdict === 'Scam') {
    colorTheme = {
      badge: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
      gaugeBg: 'stroke-rose-500',
      glow: 'neon-border-red',
      title: t.verdictScam,
      icon: <ShieldAlert className="w-8 h-8 text-rose-400" />,
      gradient: 'from-rose-500/20 via-slate-900/50 to-slate-950'
    };
  }

  // Calculate circular stroke offset
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 ${colorTheme.glow} transition-all`}>
      {/* Background Gradient Accents */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorTheme.gradient} pointer-events-none opacity-60`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Verdict & Summary */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border tracking-wide uppercase ${colorTheme.badge}`}>
              {colorTheme.icon}
              {colorTheme.title}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {result.ai_provider}
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed max-w-2xl">
            {result.summary}
          </p>

          {/* Sub-signals metadata */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>ML Classifier: <strong>{(result.ml_scam_probability * 100).toFixed(1)}% Scam Prob</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-rose-400" />
              <span>Red Flags: <strong>{result.highlighted_phrases.length} Detected</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Analyzed Links: <strong>{result.link_analysis.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Circular 0-100 Speedometer / Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              {/* Value Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`${colorTheme.gaugeBg} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Center Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tighter text-white">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                / 100 Risk
              </span>
            </div>
          </div>

          <span className="mt-2 text-xs font-semibold text-slate-400">
            {score <= 30 ? "Safe Threshold" : score <= 65 ? "Caution Advised" : "High Severity"}
          </span>
        </div>

      </div>
    </div>
  );
}
