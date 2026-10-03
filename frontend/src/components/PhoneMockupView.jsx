import React from 'react';
import { Smartphone, ShieldAlert, AlertTriangle, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

export default function PhoneMockupView({ originalText, redFlags, verdict, riskScore }) {
  const isScam = verdict === 'Scam';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Smartphone Outer Shell */}
      <div className="relative w-full max-w-[340px] rounded-[44px] border-[10px] border-slate-800 bg-[#0b141a] shadow-2xl shadow-cyan-500/10 overflow-hidden font-sans">
        
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex items-center justify-center z-20">
          <div className="w-16 h-3 bg-black rounded-b-xl flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-6 h-1 rounded-full bg-slate-700" />
          </div>
        </div>

        {/* WhatsApp Chat Header */}
        <div className="pt-8 pb-3 px-4 bg-[#202c33] text-white flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center gap-2.5">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 font-bold text-xs">
                ⚠️
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#202c33]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 truncate max-w-[130px]">
                  Unknown Sender
                </span>
                <span className="text-[9px] uppercase font-bold px-1 rounded bg-rose-500/30 text-rose-300">
                  Suspicious
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                +91 98765 43210 (Unverified)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <Phone className="w-3.5 h-3.5" />
            <MoreVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Threat Warning Banner inside Phone */}
        <div className={`p-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5 ${
          isScam ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
        }`}>
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>ScamShield Alert: {riskScore}/100 Risk Detected!</span>
        </div>

        {/* Chat Conversation Area */}
        <div className="p-4 space-y-3 min-h-[360px] bg-[#0b141a] bg-opacity-95 relative flex flex-col justify-end">
          
          {/* Security Advisory Pill in Chat */}
          <div className="self-center px-3 py-1 rounded-lg bg-[#182229] border border-slate-800 text-[10px] text-slate-400 text-center max-w-[260px]">
            🔒 Messages with unverified senders could be attempts to steal OTPs or money.
          </div>

          {/* Incoming Scam Message Bubble */}
          <div className="self-start max-w-[90%] rounded-2xl rounded-tl-sm p-3.5 bg-[#202c33] text-slate-100 text-xs shadow-md space-y-2 border border-slate-700/60">
            <p className="leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
              {originalText}
            </p>

            {/* Bubble Timestamp */}
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
              <span>9:32 PM</span>
              <span className="text-cyan-400">✓✓</span>
            </div>
          </div>

          {/* AI Danger Annotations */}
          {redFlags && redFlags.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                Detected Traps in Message:
              </span>
              {redFlags.slice(0, 3).map((flag, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-[11px] text-rose-200 flex items-start gap-1.5"
                >
                  <span className="font-bold text-rose-400">⚠️</span>
                  <span><strong>{flag.phrase}:</strong> {flag.explanation}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Phone Bar */}
        <div className="p-2.5 bg-[#202c33] border-t border-slate-800 flex items-center justify-between text-slate-500 text-[11px] font-mono">
          <span>ScamShield Protection: Active</span>
          <span className="text-emerald-400 font-bold">1930 Helpline</span>
        </div>

      </div>
    </div>
  );
}
