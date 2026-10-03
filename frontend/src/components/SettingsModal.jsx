import React, { useState } from 'react';
import { X, Key, Save, Check, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { checkServerHealth } from '../services/api';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(localStorage.getItem('scamshield_gemini_key') || '');
  const [model, setModel] = useState(localStorage.getItem('scamshield_gemini_model') || 'gemini-1.5-flash');
  const [healthStatus, setHealthStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('scamshield_gemini_key', apiKey.trim());
    localStorage.setItem('scamshield_gemini_model', model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCheckHealth = async () => {
    setChecking(true);
    const res = await checkServerHealth();
    setChecking(false);
    setHealthStatus(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel border border-slate-700 p-6 sm:p-7 bg-[#0b0f19] shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              AI & API Settings
            </h3>
            <p className="text-xs text-slate-400">
              Optional Google Gemini API Key configuration
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
          💡 <strong>Graceful Fallback:</strong> ScamShield AI functions completely without an API key using our trained local ML classifier + rule heuristics! An API key adds deep generative reasoning and dynamic translations.
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gemini Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 font-mono"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (In-depth analysis)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (Next-Gen)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleCheckHealth}
              disabled={checking}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${checking ? 'animate-spin' : ''}`} />
              <span>Check Backend Status</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Saved!" : "Save Settings"}</span>
            </button>
          </div>

          {healthStatus && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
              <div>Backend: <span className={healthStatus.status === 'healthy' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{healthStatus.status}</span></div>
              {healthStatus.version && <div>Version: {healthStatus.version}</div>}
              {healthStatus.mode && <div>Mode: {healthStatus.mode}</div>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
