// ScamShield AI - Web Speech API Voice Synthesizer
// Provides audio alerts for elder safety and accessibility in English, Hindi, and Marathi

class VoiceAlertService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this._initVoices();
  }

  _initVoices() {
    if (!this.synth) return;
    
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  getVoiceForLanguage(langCode) {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }

    const langMap = {
      en: ['en-IN', 'en-GB', 'en-US', 'en'],
      hi: ['hi-IN', 'hi', 'en-IN'],
      mr: ['mr-IN', 'mr', 'hi-IN', 'hi']
    };

    const targetLangs = langMap[langCode] || ['en'];

    for (const target of targetLangs) {
      const match = this.voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(target.toLowerCase()));
      if (match) return match;
    }

    return this.voices[0] || null;
  }

  speak(text, language = 'en', onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('Web Speech API not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of emojis or special markdown characters for natural speech
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}🛑⚠️✅❌🔥💡🚨]/gu, '')
      .replace(/[*_#`]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = this.getVoiceForLanguage(language);
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.rate = 0.95; // Slightly slower for elder comprehension
    utterance.pitch = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }
}

export const voiceService = new VoiceAlertService();
