import React, { useState } from 'react';
import { ShieldAlert, Sparkles, Send, RotateCcw, Image as ImageIcon, Zap, AlertTriangle } from 'lucide-react';
import ScreenshotUploader from './ScreenshotUploader';
import { translations } from '../services/i18n';

const PRESET_MESSAGES = {
  electricity: "Dear Consumer your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210 to avoid disconnection.",
  sbiKyc: "SBI Alert: Dear customer your SBI NetBanking account has been suspended today. Download SBI NetBanking Update APK from http://sbi-kyc-update.xyz/login.apk to restore service immediately.",
  jobScam: "Part-time online job opportunity! Earn Rs 2500 to Rs 8000 daily from home just by rating hotels on Google Maps and liking YouTube videos. No investment needed. Contact manager on Telegram: @YouTubeLikeJobsIndia",
  upiFraud: "Received Rs 25,000 on Google Pay by mistake. Kindly refund immediately: http://paytm-refund-approval.live/upi (Enter your UPI PIN to approve reversal).",
  legitOtp: "ICICI Bank: OTP for transaction of Rs 850.00 on card ending 4012 is 849201. Valid for 10 mins. Do NOT share with anyone, including bank staff."
};

export default function HeroInput({
  inputText,
  setInputText,
  onAnalyze,
  loading,
  language
}) {
  const [showUploader, setShowUploader] = useState(false);
  const t = translations[language] || translations.en;

  const handleSelectPreset = (key) => {
    setInputText(PRESET_MESSAGES[key] || '');
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="space-y-4">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Multi-Layer AI Cyber Threat Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          {t.heroHeading}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          {t.heroSubheading}
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="rounded-3xl glass-panel p-5 sm:p-7 border border-slate-800 shadow-2xl relative">
        
        {/* Quick Sample Selector Pills */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.quickSamplesTitle}
            </span>
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{showUploader ? "Hide Screenshot OCR" : "Upload Screenshot OCR"}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(t.samples).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 hover:text-white transition shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Screenshot OCR Section */}
        {showUploader && (
          <div className="mb-4">
            <ScreenshotUploader
              language={language}
              onTextExtracted={(text) => {
                setInputText(text);
                setShowUploader(false);
              }}
            />
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholderText}
            rows={5}
            className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder-slate-500 p-4 transition-all resize-y font-mono"
          />

          {inputText && (
            <button
              onClick={handleClear}
              type="button"
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white transition"
              title="Clear text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {inputText.length} characters • Ready to scan
          </div>

          <button
            onClick={onAnalyze}
            disabled={loading || !inputText.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.analyzingButton}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>{t.analyzeButton}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
