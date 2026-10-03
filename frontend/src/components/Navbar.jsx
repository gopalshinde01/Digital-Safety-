import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Globe, Users, Settings, Sparkles, AlertTriangle } from 'lucide-react';
import { translations } from '../services/i18n';

export default function Navbar({
  language,
  setLanguage,
  familyMode,
  setFamilyMode,
  region,
  setRegion,
  onOpenSettings,
  onOpenHowItWorks
}) {
  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <ShieldAlert className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                HackNowa 2026
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Family Mode Switch */}
          <button
            onClick={() => setFamilyMode(!familyMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              familyMode
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Simplified language for senior citizens & parents"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Family Mode</span>
            <span className={`text-[10px] px-1 rounded ${familyMode ? 'bg-amber-500/30 text-amber-200' : 'text-slate-500'}`}>
              {familyMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Region Toggle: India vs Global */}
          <button
            onClick={() => setRegion(region === 'india' ? 'global' : 'india')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition"
            title="Toggle helpline context (India 1930 / Global IC3)"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase text-[11px] font-bold text-slate-200">
              {region === 'india' ? '🇮🇳 India (1930)' : '🌐 Global'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* How It Works Button */}
          <button
            onClick={onOpenHowItWorks}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition"
            title="Under the hood AI architecture & ML metrics"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Configure Gemini API Key / Model"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
