import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Volume2,
  Mic,
  MicOff,
  Send,
  RefreshCw,
  Sparkles,
  Trophy,
  ArrowRight,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle2,
  Bot,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  ROLEPLAY_AI_PRESETS,
  generateRoleplayReply,
} from '../../services/aiService';
import {
  isSpeechRecognitionSupported,
  getSpeechRecognitionInstance,
} from '../../utils/speechRecognition';

export default function LalaAiRoleplayModal({ isOpen, onClose }) {
  const { user, cefrLevel, addXp, getEffectiveAiConfig } = useAppStore();
  const activeCefr = cefrLevel || user?.cefrLevel || 'A1';

  // Mode: 'select' | 'chat' | 'summary'
  const [viewMode, setViewMode] = useState('select');
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([]); // [{ sender: 'ai'|'user', text, translation, feedback }]
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showTranslations, setShowTranslations] = useState({}); // { [msgIdx]: boolean }
  const [isLoading, setIsLoading] = useState(false);
  const [turnsCount, setTurnsCount] = useState(0);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setViewMode('select');
      setSelectedScenario(null);
      setMessages([]);
      setInputMessage('');
      setSuggestions([]);
      setTurnsCount(0);
      setIsLoading(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  // Start selected scenario
  const handleStartScenario = (scenario) => {
    setSelectedScenario(scenario);
    setViewMode('chat');
    setTurnsCount(1);
    setMessages([
      {
        sender: 'ai',
        text: scenario.openingMessage,
        translation: scenario.openingTranslation,
        feedback: null,
      },
    ]);
    setSuggestions(scenario.initialSuggestions || []);
  };

  // Text-to-Speech audio helper
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle speech recognition input
  const handleToggleMic = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Browser Anda belum mendukung input suara Web Speech API.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = getSpeechRecognitionInstance();
    if (!rec) return;

    recognitionRef.current = rec;
    rec.onstart = () => setIsListening(true);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        setInputMessage((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
      }
    };

    rec.start();
  };

  // Send message to AI
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading || !selectedScenario) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // 1. Add user message
    const updatedMessages = [
      ...messages,
      {
        sender: 'user',
        text,
      },
    ];

    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    // 2. Prepare conversation history format
    const historyPayload = updatedMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const config = getEffectiveAiConfig();
      const aiReply = await generateRoleplayReply({
        scenario: selectedScenario.scenario,
        rolePrompt: selectedScenario.rolePrompt,
        history: historyPayload,
        userMessage: text,
        userCefrLevel: activeCefr,
        config,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply.reply,
          translation: aiReply.translation,
          feedback: aiReply.feedback,
        },
      ]);

      setSuggestions(aiReply.suggestions || []);
      setTurnsCount((prev) => prev + 1);
      addXp(10, 'Percakapan Lala AI');
    } catch (err) {
      console.error('Roleplay error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having a little trouble hearing you. Could you say that again?",
          translation: 'Aku sedikit kesulitan memproses jawabanmu. Bisa katakan lagi?',
          feedback: 'Periksa koneksi internet Anda atau coba ketik kembali.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Conclude scenario & award bonus XP
  const handleFinishScenario = () => {
    addXp(30, 'Menyelesaikan Roleplay AI');
    setViewMode('summary');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* SCREEN 1: SCENARIO SELECTOR */}
        {/* ============================================================ */}
        {viewMode === 'select' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
                  💬
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Lala AI Roleplay Lounge 🎭
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Pilih skenario percakapan nyata bersama asisten cerdas
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="flex items-center justify-between px-1">
                <span className="font-extrabold text-slate-700">Pilih Topik Latihan:</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Level {activeCefr}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLEPLAY_AI_PRESETS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleStartScenario(sc)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all active:scale-98 cursor-pointer flex flex-col justify-between shadow-2xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-2xl p-1 rounded-xl bg-slate-50 group-hover:bg-white transition">
                          {sc.avatar}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition">
                          {sc.badge}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                        {sc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {sc.scenario}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                      <span>Mitra: {sc.partnerName}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: INTERACTIVE CHAT ROOM */}
        {/* ============================================================ */}
        {viewMode === 'chat' && selectedScenario && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1 rounded-xl bg-white/20 backdrop-blur-xs">
                  {selectedScenario.avatar}
                </span>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                    <span>{selectedScenario.title}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 shadow-2xs">
                      {activeCefr}
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-100">
                    Bicara dengan <strong>{selectedScenario.partnerName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFinishScenario}
                  title="Selesai dan ambil XP"
                  className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-[11px] transition cursor-pointer"
                >
                  Selesai Sesi
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Transcript Scroll Area */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3.5 bg-slate-50/60 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1 animate-in fade-in duration-150`}
                >
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium">{msg.text}</span>
                      {msg.sender === 'ai' && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text)}
                          title="Dengarkan pelafalan audio"
                          className="text-slate-400 hover:text-indigo-600 p-0.5 rounded shrink-0 cursor-pointer transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* AI Translation Toggle */}
                    {msg.sender === 'ai' && msg.translation && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setShowTranslations((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 w-fit cursor-pointer"
                        >
                          {showTranslations[idx] ? (
                            <>
                              <EyeOff className="w-3 h-3" /> Sembunyikan Arti
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" /> Lihat Terjemahan
                            </>
                          )}
                        </button>
                        {showTranslations[idx] && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded-lg">
                            {msg.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lala's Friendly Feedback Banner */}
                  {msg.feedback && (
                    <div className="flex items-start gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 max-w-[85%] shadow-2xs text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block text-amber-950">Tips Perbaikan Lala:</span>
                        <span className="leading-snug">{msg.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* AI Thinking Animation */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 w-fit text-slate-500 shadow-2xs animate-pulse">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold">
                    {selectedScenario.partnerName} sedang membalas...
                  </span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Suggestions Chips Bar */}
            {suggestions.length > 0 && !isLoading && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
                <span className="text-[10px] font-black text-slate-400 shrink-0 uppercase tracking-wider">
                  Inspirasi:
                </span>
                {suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold shrink-0 transition active:scale-95 cursor-pointer border border-indigo-100"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={handleToggleMic}
                title={isListening ? 'Berhenti mendengarkan' : 'Bicara lewat suara mikrofon'}
                className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? 'Mendengarkan ucapanmu...' : 'Ketik balasan bahasa Inggris...'}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-900"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition cursor-pointer disabled:opacity-40 shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: COMPLETION SUMMARY */}
        {/* ============================================================ */}
        {viewMode === 'summary' && selectedScenario && (
          <div className="p-6 sm:p-8 text-center space-y-5 flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8 text-emerald-600 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-slate-900">
                Sesi Roleplay Selesai! 🎉
              </h3>
              <p className="text-xs text-slate-600 max-w-sm">
                Kamu telah berlatih percakapan nyata bersama <strong>{selectedScenario.partnerName}</strong> sebanyak <strong>{turnsCount} ronde</strong>.
              </p>
            </div>

            {/* XP Award Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-extrabold text-sm shadow-xs">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+30 XP Bonus Roleplay Ditambahkan!</span>
            </div>

            <div className="pt-4 flex items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setViewMode('select')}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Ganti Skenario
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
