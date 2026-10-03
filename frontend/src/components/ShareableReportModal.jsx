import React, { useState } from 'react';
import { Share2, X, Copy, Check, MessageSquare, ShieldAlert, ShieldCheck } from 'lucide-react';
import { translations } from '../services/i18n';

export default function ShareableReportModal({ isOpen, onClose, result, originalText, language }) {
  if (!isOpen || !result) return null;

  const [copied, setCopied] = useState(false);
  const t = translations[language] || translations.en;
  const isScam = result.verdict === 'Scam';

  const shareText = `🚨 SCAM ALERT — ScamShield AI Report 🚨
Verdict: ${result.verdict.toUpperCase()} (Risk Score: ${result.risk_score}/100)
Message Checked: "${originalText.substring(0, 100)}..."

Summary: ${result.summary}

⚠️ Safety Advice:
${result.recommended_actions?.slice(0, 2).map(a => `• ${a}`).join('\n')}

Helpline: 1930 | Report at: https://cybercrime.gov.in
Analyzed by ScamShield AI (HackNowa 2026)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel border border-cyan-500/40 p-6 sm:p-7 bg-[#0b0f19] shadow-2xl shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Shareable Threat Report
            </h3>
            <p className="text-xs text-slate-400">
              Warn your friends, family, and community group
            </p>
          </div>
        </div>

        {/* Digital Report Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mb-5 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-cyan-400">SCAMSHIELD VERDICT</span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              isScam ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {result.verdict} ({result.risk_score}/100)
            </span>
          </div>

          <p className="line-clamp-2 text-slate-400 italic">
            "{originalText}"
          </p>

          <p className="text-slate-200">
            {result.summary}
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Verified by ScamShield AI</span>
            <span>Helpline: 1930</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Report"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
