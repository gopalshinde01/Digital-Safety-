import React, { useState } from 'react';
import { Users, X, Check, Copy, Share2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { translations } from '../services/i18n';

export default function FamilyModeModal({ isOpen, onClose, result, language }) {
  if (!isOpen || !result) return null;

  const [copied, setCopied] = useState(false);
  const t = translations[language] || translations.en;
  const isScam = result.verdict === 'Scam';

  const familyText = result.family_mode_summary || (
    isScam 
      ? "🛑 DANGER — FRAUD ALERT! This message is trying to trick you. Do NOT click anything, do NOT enter your UPI PIN, and do NOT send any money. Immediately call your son, daughter, or a trusted family member."
      : "✅ This message looks safe. Remember to never share confidential passwords or bank OTPs with anyone."
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `🛡️ ScamShield AI Family Alert:\n\n${familyText}\n\nEmergency Helpline: 1930`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 bg-[#0b0f19] shadow-2xl shadow-amber-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {t.familyModeTitle}
            </h3>
            <p className="text-xs text-amber-300/80 font-medium">
              {t.familyModeExplainer}
            </p>
          </div>
        </div>

        {/* Big Alert Card */}
        <div className={`p-6 rounded-2xl border mb-6 text-center ${
          isScam 
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-100'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
        }`}>
          <div className="flex justify-center mb-3">
            {isScam ? (
              <span className="text-4xl animate-bounce">🛑</span>
            ) : (
              <span className="text-4xl">✅</span>
            )}
          </div>
          <p className="text-lg sm:text-xl font-semibold leading-relaxed">
            {familyText}
          </p>
        </div>

        {/* Elder Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200">
            <span className="text-lg">❌</span>
            <span>Never share OTP or Bank Passwords with callers</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200">
            <span className="text-lg">❌</span>
            <span>Never enter UPI PIN to receive money</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200">
            <span className="text-lg">📞</span>
            <span>When in doubt, call trusted family or 1930</span>
          </div>
        </div>

        {/* Copy for WhatsApp Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Warning Message for WhatsApp"}</span>
        </button>

      </div>
    </div>
  );
}
