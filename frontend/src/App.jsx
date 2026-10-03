import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroInput from './components/HeroInput';
import RiskVerdictCard from './components/RiskVerdictCard';
import HighlightedText from './components/HighlightedText';
import TechnicalLinkBreakdown from './components/TechnicalLinkBreakdown';
import ActionChecklist from './components/ActionChecklist';
import FamilyModeModal from './components/FamilyModeModal';
import ShareableReportModal from './components/ShareableReportModal';
import ScamOfTheWeek from './components/ScamOfTheWeek';
import HowItWorksMetrics from './components/HowItWorksMetrics';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';
import { analyzeMessage, fetchStats } from './services/api';
import IncidentReportModal from './components/IncidentReportModal';
import PhoneMockupView from './components/PhoneMockupView';
import { translations } from './services/i18n';
import { Users, Share2, Sparkles, AlertCircle, FileText, Smartphone, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [analyzedText, setAnalyzedText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [familyMode, setFamilyMode] = useState(false);
  const [region, setRegion] = useState('india');
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('forensics'); // 'forensics' or 'phone'

  // Modals state
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState(false);

  const resultsRef = useRef(null);
  const t = translations[language] || translations.en;

  // Load community stats on mount
  useEffect(() => {
    async function loadInitialStats() {
      const data = await fetchStats();
      setStats(data);
    }
    loadInitialStats();
  }, []);

  const handleAnalyze = async () => {
    if (!inputText || !inputText.trim()) return;

    setLoading(true);
    setAnalyzedText(inputText);

    const res = await analyzeMessage({
      text: inputText,
      language,
      family_mode: familyMode,
      region
    });

    setAnalysisResult(res);
    setLoading(false);

    // If family mode is active, trigger family modal automatically for high risk scams
    if (familyMode && res.verdict === 'Scam') {
      setIsFamilyModalOpen(true);
    }

    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        familyMode={familyMode}
        setFamilyMode={setFamilyMode}
        region={region}
        setRegion={setRegion}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Family Mode Alert Banner if active */}
        {familyMode && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3 text-amber-300 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{t.familyModeBadge}: Results will be formatted in simplified elder-friendly language.</span>
            </div>
            <button
              onClick={() => setIsFamilyModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition shrink-0"
            >
              Open Elder View
            </button>
          </div>
        )}

        {/* Hero & Input Section */}
        <HeroInput
          inputText={inputText}
          setInputText={setInputText}
          onAnalyze={handleAnalyze}
          loading={loading}
          language={language}
        />

        {/* Live Analysis Results */}
        {analysisResult && (
          <div ref={resultsRef} className="space-y-8 pt-4 animate-fade-in">
            
            {/* Action Bar over Results */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {/* View Tabs */}
                <button
                  onClick={() => setActiveTab('forensics')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeTab === 'forensics'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Threat Forensics</span>
                </button>
                <button
                  onClick={() => setActiveTab('phone')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeTab === 'phone'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📱 Phone Mockup</span>
                </button>
              </div>

              {/* Action Modals Triggers */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsFamilyModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Elder View</span>
                </button>
                <button
                  onClick={() => setIsIncidentReportOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300 flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📄 Evidence Sheet (PDF)</span>
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Report</span>
                </button>
              </div>
            </div>

            {/* Verdict Gauge Card (Visible in both tabs) */}
            <RiskVerdictCard
              result={analysisResult}
              language={language}
            />

            {/* Tab 1: Detailed Forensics View */}
            {activeTab === 'forensics' && (
              <div className="space-y-8 animate-fade-in">
                {/* Red Flag Highlights */}
                <HighlightedText
                  originalText={analyzedText}
                  redFlags={analysisResult.highlighted_phrases}
                  language={language}
                />

                {/* Link Forensics Breakdown */}
                <TechnicalLinkBreakdown
                  links={analysisResult.link_analysis}
                  language={language}
                />

                {/* Do's & Don'ts Checklist + Emergency Helplines */}
                <ActionChecklist
                  result={analysisResult}
                  language={language}
                />
              </div>
            )}

            {/* Tab 2: Live Smartphone Chat Simulation */}
            {activeTab === 'phone' && (
              <div className="rounded-2xl glass-panel p-6 border border-slate-800 animate-fade-in flex flex-col items-center">
                <div className="text-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    Simulated Smartphone Receiver View
                  </h3>
                  <p className="text-xs text-slate-400">
                    See how this attack appears on a victim's phone with ScamShield overlay warnings
                  </p>
                </div>
                <PhoneMockupView
                  originalText={analyzedText}
                  redFlags={analysisResult.highlighted_phrases}
                  verdict={analysisResult.verdict}
                  riskScore={analysisResult.risk_score}
                />
              </div>
            )}

          </div>
        )}

        {/* Scam of the Week & Threat Radar Dashboard */}
        <div className="pt-6">
          <ScamOfTheWeek stats={stats} language={language} />
        </div>

      </main>

      {/* Modals */}
      <FamilyModeModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        result={analysisResult}
        language={language}
      />

      <ShareableReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={analysisResult}
        originalText={analyzedText}
        language={language}
      />

      <IncidentReportModal
        isOpen={isIncidentReportOpen}
        onClose={() => setIsIncidentReportOpen(false)}
        result={analysisResult}
        originalText={analyzedText}
      />

      <HowItWorksMetrics
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        stats={stats}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
