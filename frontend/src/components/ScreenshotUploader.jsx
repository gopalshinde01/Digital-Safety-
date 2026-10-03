import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { extractTextFromImage } from '../services/ocr';
import { translations } from '../services/i18n';

// Preset sample screenshots as fast demo loaders
const SAMPLE_SCREENSHOTS = [
  {
    title: "⚡ Electricity Threat SMS",
    text: "Dear consumer your electricity power will be disconnected tonight at 9:30 PM by electricity officer call 9876543210 immediately."
  },
  {
    title: "🏦 SBI NetBanking APK Scam",
    text: "SBI Alert: Dear customer your SBI NetBanking account is blocked. Update your PAN card now: http://sbi-kyc-update.xyz/login.apk"
  },
  {
    title: "💸 Google Pay UPI Refund Trap",
    text: "Rs 25,000 sent to your GooglePay by mistake. Please click link to approve refund and enter UPI PIN to receive money: http://paytm-refund-approval.live"
  }
];

export default function ScreenshotUploader({ onTextExtracted, language }) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const t = translations[language] || translations.en;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show thumbnail
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setLoading(true);
    setStatusText(t.ocrProcessing);

    const result = await extractTextFromImage(file);
    setLoading(false);

    if (result.success && result.text) {
      setStatusText(t.ocrSuccess);
      onTextExtracted(result.text);
    } else {
      setStatusText(t.ocrError);
    }
  };

  const handleSelectSample = (sample) => {
    setPreviewUrl(null);
    setStatusText(`Loaded ${sample.title}`);
    onTextExtracted(sample.text);
  };

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          Screenshot OCR Extraction
        </h4>
        <span className="text-[11px] text-cyan-400 font-semibold">100% Client-Side Private</span>
      </div>

      {/* Drop / Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-5 text-center bg-slate-950/40 hover:bg-slate-900/40 transition group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="flex items-center justify-center gap-4">
            <img src={previewUrl} alt="Screenshot Preview" className="h-16 w-auto rounded-lg border border-slate-700 object-cover" />
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-200 block">Screenshot Uploaded</span>
              <span className="text-[11px] text-slate-400">Click to choose a different image</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-300">
              {t.screenshotUploadPrompt}
            </p>
            <span className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP screenshots</span>
          </div>
        )}
      </div>

      {/* Progress / Status feedback */}
      {loading && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{statusText}</span>
        </div>
      )}

      {/* Quick Screenshot Demo Presets */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 block mb-2">
          Or try a simulated screenshot case:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCREENSHOTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-cyan-300 transition"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
