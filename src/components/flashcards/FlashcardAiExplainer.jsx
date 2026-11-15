import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Volume2,
  Copy,
  Check,
  RefreshCw,
  Send,
  X,
  Bot,
  Zap,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { askLalaAI } from '../../services/aiService';
import { useAppStore } from '../../store/useAppStore';

// In-memory response cache per card ID + query to save tokens & prevent duplicate queries
const EXPLANATION_CACHE = new Map();

export default function FlashcardAiExplainer({ card, isFlipped, onClose }) {
  const getEffectiveAiConfig = useAppStore((state) => state.getEffectiveAiConfig);
  const cefrLevel = useAppStore((state) => state.cefrLevel) || 'A1';

  const [activeTab, setActiveTab] = useState('nuance'); // 'nuance' | 'dialogue' | 'mnemonic' | 'custom'
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);

  // Target word or sentence from card
  const frontText = card?.front_text || '';
  const backText = card?.back_text || '';
  const exampleSentence = card?.example_sentence || '';

  // Preset prompt generator based on active tab
  const getPromptForTab = (tab) => {
    switch (tab) {
      case 'nuance':
        return `Tolong bedah dan jelaskan kartu kosakata/tata bahasa ini secara padat, edukatif, dan ramah:
- Materi / Pertanyaan: "${frontText}"
- Arti / Jawaban: "${backText}"
${exampleSentence ? `- Kalimat Contoh: "${exampleSentence}"` : ''}

Tolong jelaskan:
1. Makna inti dan bagaimana cara menggunakannya dalam situasi nyata.
2. Nuansa atau perbedaan dengan kata/frasa yang mirip (jika ada).
3. Aturan tata bahasa penting yang perlu diingat oleh pembelajar level ${cefrLevel}.`;

      case 'dialogue':
        return `Tolong buatkan 2 dialog percakapan pendek (masing-masing 2-3 baris pertukaran) yang natural dan relevan dalam kehidupan sehari-hari menggunakan materi ini:
- Materi: "${frontText}"
- Arti: "${backText}"

Sertakan terjemahan bahasa Indonesia di setiap baris percakapan dan pastikan kosakatanya cocok untuk tingkat CEFR ${cefrLevel}.`;

      case 'mnemonic':
        return `Berikan tips cara mudah dan cepat mengingat (mnemonik / jembatan keledai / asosiasi visual unik atau lucu) untuk materi ini:
- Kata / Frasa: "${frontText}"
- Arti: "${backText}"

Tuliskan tips ingatan yang kreatif dan mudah terngiang di kepala agar tidak pernah lupa lagi!`;

      default:
        return '';
    }
  };

  // Fetch explanation from Lala AI
  const fetchExplanation = async (tabToFetch, customPrompt = '') => {
    const cardId = card?.id || `${frontText}-${backText}`;
    const cacheKey = `${cardId}::${tabToFetch}::${customPrompt || 'preset'}::${cefrLevel}`;

    // Check in-memory cache
    if (EXPLANATION_CACHE.has(cacheKey)) {
      setResponseContent(EXPLANATION_CACHE.get(cacheKey));
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const promptText = customPrompt || getPromptForTab(tabToFetch);

    try {
      const config = getEffectiveAiConfig();
      const res = await askLalaAI({
        prompt: promptText,
        userCefrLevel: cefrLevel,
        config,
        temperature: 0.6,
        maxTokens: 600,
      });

      const cleanText = (res.content || '').trim();
      setResponseContent(cleanText);
      EXPLANATION_CACHE.set(cacheKey, cleanText);
    } catch (err) {
      console.error('Lala AI error:', err);
      setErrorMsg(err.message || 'Gagal memuat penjelasan dari Lala AI. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger auto-fetch when card changes or tab changes
  useEffect(() => {
    if (card && activeTab !== 'custom') {
      fetchExplanation(activeTab);
    }
  }, [card?.id, activeTab, cefrLevel]);

  // Handle custom question submit
  const handleCustomSubmit = (e) => {
    e?.preventDefault();
    const query = customQuestion.trim();
    if (!query || isLoading) return;

    const fullCustomPrompt = `Terkait materi kartu ini:
- Kartu: "${frontText}" (Arti: "${backText}")

Pertanyaan pengguna:
"${query}"

Jawablah dengan ramah, jelas, dan edukatif dalam Bahasa Indonesia yang santai sesuai level CEFR ${cefrLevel}.`;

    fetchExplanation('custom', fullCustomPrompt);
    setCustomQuestion('');
  };

  // Speech synthesis for English quotes/sentences inside response
  const playSpeech = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy explanation to clipboard
  const handleCopy = () => {
    if (!responseContent) return;
    navigator.clipboard?.writeText(responseContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!card) return null;

  return (
    <div
      ref={containerRef}
      className="w-full bg-gradient-to-b from-indigo-50/90 via-white to-slate-50 rounded-2xl border-2 border-indigo-200/90 shadow-xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      {/* Drawer Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">Asisten Lala AI</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 shadow-2xs">
                Level {cefrLevel}
              </span>
            </div>
            <p className="text-[10px] text-indigo-100">
              Bedah tuntas kartu: <strong className="text-white font-semibold">{frontText}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fetchExplanation(activeTab)}
            disabled={isLoading}
            title="Muat ulang penjelasan"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Tutup Asisten"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Action Tabs */}
      <div className="p-2 sm:p-3 border-b border-indigo-100/80 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('nuance')}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs ${
            activeTab === 'nuance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Nuansa & Aturan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dialogue')}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs ${
            activeTab === 'dialogue'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contoh Percakapan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mnemonic')}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs ${
            activeTab === 'mnemonic'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Cara Cepat Ingat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tanya Bebas</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-indigo-600">
            <div className="relative">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-600">Lala sedang menyusun penjelasan terbaik...</p>
          </div>
        )}

        {/* Error Alert */}
        {!isLoading && errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Gagal Menghubungi Lala AI</p>
              <p className="text-[11px] leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={() => fetchExplanation(activeTab)}
                className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700"
              >
                <RotateCcw className="w-3 h-3" /> Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Response Markdown-style Presentation */}
        {!isLoading && !errorMsg && responseContent && (
          <div className="relative group">
            <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-[13px] leading-relaxed space-y-2.5 bg-white p-3.5 sm:p-4 rounded-xl border border-indigo-100/80 shadow-2xs whitespace-pre-line">
              {responseContent}
            </div>

            {/* Quick Actions Footer inside response */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Zap className="w-3 h-3 text-amber-500" />
                Dihasilkan instan &bull; Disesuaikan untuk {cefrLevel}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Question Input Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="pt-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ajukan pertanyaan khusus seputar kata ini:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Contoh: Apa bedanya dengan kata 'happen'?"
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="submit"
                disabled={isLoading || !customQuestion.trim()}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
