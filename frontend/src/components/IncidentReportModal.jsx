import React, { useRef } from 'react';
import { FileText, Printer, Download, X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function IncidentReportModal({ isOpen, onClose, result, originalText }) {
  if (!isOpen || !result) return null;

  const reportId = useRef(`NCRP-EVI-${Math.floor(100000 + Math.random() * 900000)}`).current;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 rounded-2xl bg-white text-slate-900 shadow-2xl p-6 sm:p-10 border border-slate-300 print:m-0 print:p-6 print:border-none print:shadow-none print:max-w-none">
        
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>Cybercrime Evidentiary Incident Sheet</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Document Header */}
        <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-black tracking-tight text-slate-950 font-serif">SCAMSHIELD AI</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-700 uppercase">
              Digital Safety Audit
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            Automated Cyber Threat Forensic Report
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Generated for submission to National Cybercrime Helpline 1930 & cybercrime.gov.in
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Reference ID</span>
            <span className="font-mono font-bold text-slate-800">{reportId}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Verdict</span>
            <span className={`font-bold uppercase ${result.verdict === 'Scam' ? 'text-red-600' : 'text-green-600'}`}>
              {result.verdict} ({result.risk_score}/100)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">ML Confidence</span>
            <span className="font-mono font-semibold text-slate-800">
              {(result.ml_scam_probability * 100).toFixed(1)}% Scam Probability
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Timestamp (IST)</span>
            <span className="font-mono text-slate-700">{timestamp}</span>
          </div>
        </div>

        {/* Section 1: Intercepted Text */}
        <div className="py-4 border-b border-slate-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Intercepted Message Content (Evidence)
          </h3>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
            {originalText}
          </div>
        </div>

        {/* Section 2: Identified Threat Signals */}
        <div className="py-4 border-b border-slate-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Heuristic Red-Flag Signals ({result.highlighted_phrases?.length || 0})
          </h3>
          {result.highlighted_phrases && result.highlighted_phrases.length > 0 ? (
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-slate-200">Category</th>
                  <th className="p-2 border border-slate-200">Flagged Phrase</th>
                  <th className="p-2 border border-slate-200">Threat Explanation</th>
                </tr>
              </thead>
              <tbody>
                {result.highlighted_phrases.map((flag, i) => (
                  <tr key={i} className="border-t border-slate-200">
                    <td className="p-2 border border-slate-200 font-semibold text-red-600 uppercase text-[10px]">
                      {flag.category.replace('_', ' ')}
                    </td>
                    <td className="p-2 border border-slate-200 font-mono font-bold text-slate-900">
                      "{flag.phrase}"
                    </td>
                    <td className="p-2 border border-slate-200 text-slate-600">
                      {flag.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-slate-500 italic">No malicious keywords or coercive pressure detected.</p>
          )}
        </div>

        {/* Section 3: Link & Domain Forensics */}
        {result.link_analysis && result.link_analysis.length > 0 && (
          <div className="py-4 border-b border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Domain & URL Forensic Investigation
            </h3>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2 border border-slate-200">Domain</th>
                  <th className="p-2 border border-slate-200">TLD Risk</th>
                  <th className="p-2 border border-slate-200">Brand Impersonation</th>
                  <th className="p-2 border border-slate-200">Forensic Findings</th>
                </tr>
              </thead>
              <tbody>
                {result.link_analysis.map((l, idx) => (
                  <tr key={idx} className="border-t border-slate-200">
                    <td className="p-2 border border-slate-200 font-mono font-bold">{l.domain}</td>
                    <td className="p-2 border border-slate-200 font-semibold text-red-600">{l.tld} ({l.tld_risk})</td>
                    <td className="p-2 border border-slate-200">{l.typosquat_target || "None"}</td>
                    <td className="p-2 border border-slate-200 text-slate-600">{l.details?.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 4: Recommended Next Steps */}
        <div className="py-4 border-b border-slate-200 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            4. Victim Protection Checklist
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {result.recommended_actions?.map((act, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-green-600 font-bold">✔</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer & National Helplines */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <strong>National Cybercrime Helpline:</strong> 1930 | <strong>Portal:</strong> cybercrime.gov.in
          </div>
          <div className="font-mono text-[10px]">
            Audited by ScamShield AI v1.0 • HackNowa 2026
          </div>
        </div>

      </div>
    </div>
  );
}
