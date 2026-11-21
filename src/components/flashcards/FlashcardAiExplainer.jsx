import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { parseFrontCardText } from './Flashcard';
import { ttsService } from '../../services/ttsService';

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
        return `Instruksi Khusus:
- DILARANG menulis salam pembuka, perkenalan diri, atau kalimat basa-basi (JANGAN tulis "Hai! Aku Lala", "Mari kita bedah", dll).
- Langsung sajikan penjelasan dalam format Markdown yang rapi, elegan, dan profesional.
- Sesuaikan kosakata agar cocok untuk tingkat pemahaman CEFR ${cefrLevel}.

Materi Kartu: "${frontText}"
Kunci/Arti: "${backText}"
${exampleSentence ? `Kalimat Contoh: "${exampleSentence}"` : ''}

Format wajib:
### 📌 1. Aturan & Makna Utama
(Jelaskan fungsi gramatika atau makna kata secara tegas, padat, dan jelas. Jika menyajikan rumus tata bahasa, buat ringkas dan bersahabat untuk layar HP, hindari satu baris kode yang terlalu panjang).

### 🔍 2. Nuansa & Perbandingan
(Tampilkan tabel Markdown atau poin perbandingan dengan kata/struktur yang sering tertukar atau membingungkan pembelajar).

### 💡 3. Contoh Penggunaan Nyata
(Berikan 2 contoh kalimat bahasa Inggris sehari-hari yang natural beserta terjemahan bahasa Indonesianya).`;

      case 'dialogue':
        return `Instruksi Khusus:
- DILARANG menulis salam pembuka atau basa-basi.
- Langsung sajikan 2 skenario dialog percakapan pendek yang natural dalam kehidupan nyata untuk level ${cefrLevel}.

Materi: "${frontText}" (Arti: "${backText}")

Format wajib:
### 💬 Situasi 1: [Nama Situasi Sehari-hari]
- **A**: "[Kalimat percakapan bahasa Inggris]" (*[Arti bahasa Indonesia]*)
- **B**: "[Kalimat balasan bahasa Inggris]" (*[Arti bahasa Indonesia]*)

### 💬 Situasi 2: [Nama Situasi Lainnya]
- **A**: "[Kalimat percakapan bahasa Inggris]" (*[Arti bahasa Indonesia]*)
- **B**: "[Kalimat balasan bahasa Inggris]" (*[Arti bahasa Indonesia]*)

> 💡 **Poin Praktik:** (Berikan 1 tips singkat cara mengucapkan atau intonasi yang pas).`;

      case 'mnemonic':
        return `Instruksi Khusus:
- DILARANG menulis salam pembuka atau basa-basi.
- Langsung berikan trik mengingat yang kreatif, ringkas, dan melekat di ingatan untuk level ${cefrLevel}.

Materi: "${frontText}" (Arti: "${backText}")

Format wajib:
### 🧠 Jembatan Keledai (Mnemonik Cerdas)
(Trik kata kunci, rima, atau asosiasi visual unik agar langsung terngiang di otak).

### ⚡ Pola Cepat Ingat
(Rumus 1 baris yang mudah dihafal).

### ⚠️ Kesalahan Umum (Common Mistake)
- ❌ **Salah:** [Contoh kalimat salah yang sering dibuat orang]
- ✅ **Benar:** [Kalimat yang benar beserta penjelasannya]`;

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
        temperature: 0.5,
        maxTokens: 1200,
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

    const fullCustomPrompt = `Instruksi Khusus: DILARANG membuat salam pembuka atau basa-basi. Langsung jawab secara profesional dan to-the-point dalam Bahasa Indonesia yang ramah sesuai tingkat CEFR ${cefrLevel}.

Materi kartu: "${frontText}" (Arti: "${backText}")

Pertanyaan pengguna:
"${query}"`;

    fetchExplanation('custom', fullCustomPrompt);
    setCustomQuestion('');
  };

  // Speech synthesis for English quotes/sentences inside response via Kokoro AI
  const playSpeech = (text) => {
    if (!text) return;
    ttsService.speak(text);
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
      onKeyDown={(e) => e.stopPropagation()}
      className="w-full bg-white rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4 ai-explainer-drawer"
    >
      {/* Drawer Header */}
      <div className="px-4 py-3 bg-[#FFD166] text-black border-b-2.5 border-black flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-black">Asisten Lala AI</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#D4F63D] border border-black text-black">
                CEFR {cefrLevel}
              </span>
            </div>
            <p className="text-[10px] text-black/70 font-bold truncate max-w-[240px] sm:max-w-md flex items-center gap-1">
              <span>Materi:</span>
              {parseFrontCardText(frontText).categoryHint && (
                <span className="px-1.5 py-0.2 rounded-md bg-[#FF85C0] border border-black text-[9px] font-black text-black shrink-0">
                  {parseFrontCardText(frontText).categoryHint}
                </span>
              )}
              <strong className="text-black font-black truncate">
                {parseFrontCardText(frontText).mainText}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fetchExplanation(activeTab)}
            disabled={isLoading}
            title="Muat ulang penjelasan"
            className="p-1.5 rounded-lg bg-white border-2 border-black shadow-[1px_1px_0px_#000] hover:bg-[#D4F63D] text-black transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Tutup asisten AI"
            className="p-1.5 rounded-lg bg-[#FF85C0] border-2 border-black shadow-[1px_1px_0px_#000] hover:bg-black hover:text-white text-black transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Preset Action Tabs */}
      <div className="p-2 sm:p-2.5 border-b border-indigo-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
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
      <div className="p-3.5 sm:p-5 space-y-3">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center space-y-2.5 text-indigo-600">
            <div className="relative">
              <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-600 tracking-tight">
              Lala sedang merancang penjelasan terbaik...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {!isLoading && errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Gagal Menghubungi Lala AI</p>
              <p className="text-[11px] leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={() => fetchExplanation(activeTab)}
                className="mt-1.5 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
              >
                <RotateCcw className="w-3 h-3" /> Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Fully Rendered Professional Markdown Presentation */}
        {!isLoading && !errorMsg && responseContent && (
          <div className="space-y-3">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100/90 shadow-2xs max-w-full overflow-hidden break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-sm font-black text-indigo-950 mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 break-words [overflow-wrap:anywhere]"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xs sm:text-sm font-extrabold text-indigo-900 mt-3.5 mb-1.5 flex items-center gap-1 break-words [overflow-wrap:anywhere]"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-xs sm:text-[13px] text-slate-700 leading-relaxed my-1.5 break-words [overflow-wrap:anywhere]"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside space-y-1.5 my-2 text-xs sm:text-[13px] text-slate-700 pl-1 break-words"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside space-y-1.5 my-2 text-xs sm:text-[13px] text-slate-700 pl-1 break-words"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed break-words [overflow-wrap:anywhere]" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-indigo-500 pl-3.5 py-2 my-2.5 bg-indigo-50/70 rounded-r-xl italic text-xs sm:text-[13px] text-indigo-950 font-medium break-words [overflow-wrap:anywhere]"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-extrabold text-slate-900" {...props} />
                  ),
                  pre: ({ node, children, ...props }) => (
                    <div className="overflow-x-auto my-2.5 max-w-full rounded-xl bg-slate-900 p-3 text-slate-100 border border-slate-800 shadow-inner">
                      <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]" {...props}>
                        {children}
                      </pre>
                    </div>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const isInline = !node || node?.position?.start?.line === node?.position?.end?.line;
                    if (!inline && !isInline) {
                      return (
                        <div className="overflow-x-auto my-2 max-w-full rounded-xl bg-slate-900 p-3 text-slate-100 border border-slate-800 shadow-inner">
                          <code className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]" {...props}>
                            {children}
                          </code>
                        </div>
                      );
                    }
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-100 break-words [overflow-wrap:anywhere] inline-block max-w-full align-middle whitespace-normal"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-2xs max-w-full">
                      <table className="min-w-full text-xs text-left border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-indigo-50/90 text-indigo-950 font-extrabold border-b border-indigo-100" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="py-2.5 px-3 font-extrabold text-slate-800 bg-indigo-50/90 whitespace-nowrap" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="py-2.5 px-3 border-t border-slate-100 text-slate-700 bg-white leading-relaxed break-words [overflow-wrap:anywhere]" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-3.5 border-slate-200" {...props} />
                  ),
                }}
              >
                {responseContent}
              </ReactMarkdown>
            </div>

            {/* Quick Actions Footer inside response */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Zap className="w-3 h-3 text-amber-500" />
                Respon cerdas disesuaikan untuk level CEFR {cefrLevel}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer border border-slate-200 bg-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Tersalin!</span>
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
              Ajukan pertanyaan khusus seputar materi kartu ini:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Contoh: Apa bedanya dengan kata 'happen'?"
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              />
              <button
                type="submit"
                disabled={isLoading || !customQuestion.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
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
