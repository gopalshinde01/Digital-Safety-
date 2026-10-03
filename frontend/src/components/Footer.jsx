import React from 'react';
import { Shield, Heart, Github, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-[#07090e]/90 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 text-sm">ScamShield AI</span>
              <p className="text-xs text-slate-400">
                Built for HackNowa Global Hackathon 2026 • Digital Safety & Cybersecurity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Lock className="w-3 h-3 text-cyan-400" />
              100% Client-Side Privacy
            </span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-cyan-400 flex items-center gap-1 transition"
            >
              <span>National Cybercrime Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            Disclaimer: ScamShield AI provides automated heuristic & ML risk scoring. In case of financial fraud, immediately call 1930.
          </p>
          <p className="flex items-center gap-1.5 font-medium text-slate-300">
            <span>Developed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by <strong>Gopal Shinde</strong></span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-semibold">HackNowa Global Hackathon 2026</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
