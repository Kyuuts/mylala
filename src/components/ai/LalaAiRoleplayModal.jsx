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
  ChevronLeft,
  ChevronRight,
  Settings2,
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
import {
  speakNaturalCharacterLine,
  findBestVoiceForCharacter,
  stopCharacterLine,
} from '../../utils/characterVoiceEngine';
import { EDGE_AZURE_VOICES } from '../../services/ttsService';

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

  // Voice Preference State ('auto' | 'british' | 'us_female' | 'us_male')
  const [voiceMode, setVoiceMode] = useState('auto');

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseInputRef = useRef(''); // Holds pre-existing input before mic starts to prevent repeating

  // DOM Refs
  const chatBottomRef = useRef(null);
  const chipsScrollRef = useRef(null);

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
      stopCharacterLine();
    }
  }, [isOpen]);

  // Lock body scroll & prevent horizontal layout shift
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      const prevOverflowX = document.body.style.overflowX;
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.overflowX = prevOverflowX;
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

    // Speak opening message with natural character voice
    setTimeout(() => {
      speakNaturalCharacterLine(scenario.openingMessage, scenario.id, voiceMode);
    }, 400);
  };

  // Text-to-Speech audio helper using natural voices
  const handleSpeak = (text) => {
    speakNaturalCharacterLine(text, selectedScenario?.id || 'cafe', voiceMode);
  };

  // Toggle speech recognition input with accurate session transcript (NO REPETITION BUG)
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

    // Snapshot existing text so we don't overwrite if user typed something first
    baseInputRef.current = inputMessage.trim();
    recognitionRef.current = rec;

    rec.onstart = () => setIsListening(true);
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    // CRITICAL FIX: replace transcript with session total instead of appending to prev on every partial chunk!
    rec.onresult = (event) => {
      let currentSessionTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentSessionTranscript += event.results[i][0].transcript;
      }

      const fullText = baseInputRef.current
        ? `${baseInputRef.current} ${currentSessionTranscript.trim()}`
        : currentSessionTranscript.trim();

      setInputMessage(fullText);
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
    baseInputRef.current = '';
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

      // Auto-speak reply with character's natural voice
      speakNaturalCharacterLine(aiReply.reply, selectedScenario.id, voiceMode);
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col h-[88vh] sm:h-[92vh] max-h-[92vh] sm:max-h-[94vh] border-3 border-black text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* SCREEN 1: SCENARIO SELECTOR */}
        {/* ============================================================ */}
        {viewMode === 'select' && (
          <div className="flex flex-col h-full overflow-hidden w-full">
            <div className="px-5 py-4 bg-[#70D6FF] text-black border-b-2.5 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-lg shrink-0">
                  💬
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-base leading-tight truncate uppercase">
                    Lala AI Roleplay Lounge 🎭
                  </h3>
                  <p className="text-xs text-black/70 font-bold truncate">
                    Pilih skenario percakapan nyata dengan suara natural
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs w-full">
              <div className="flex items-center justify-between px-1">
                <span className="font-black text-black uppercase">Pilih Topik Latihan:</span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-[#FFD166] border border-black text-black">
                  Level {activeCefr}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {ROLEPLAY_AI_PRESETS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleStartScenario(sc)}
                    className="p-3.5 rounded-2xl border-2 border-black hover:bg-[#D4F63D]/20 text-left transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex flex-col justify-between shadow-[3px_3px_0px_#000] bg-white group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-2xl p-1 rounded-xl bg-white border border-black transition">
                          {sc.avatar}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#FFD166] border border-black text-black transition">
                          {sc.badge}
                        </span>
                      </div>
                      <h4 className="font-black text-black text-sm group-hover:underline transition">
                        {sc.title}
                      </h4>
                      <p className="text-[11px] text-black/70 font-bold mt-1 line-clamp-2 leading-relaxed">
                        {sc.scenario}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t-2 border-black flex items-center justify-between text-[11px] font-black text-black">
                      <span>Mitra: {sc.partnerName}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
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
          <div className="flex flex-col h-full overflow-hidden w-full">
            {/* Header */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#80ED99] text-black border-b-2.5 border-black flex items-center justify-between shrink-0 w-full min-w-0 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <span className="text-xl sm:text-2xl p-1 rounded-xl bg-white border border-black shadow-[1px_1px_0px_#000] shrink-0">
                  {selectedScenario.avatar}
                </span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h4 className="font-black text-xs sm:text-sm leading-tight flex items-center gap-1.5 truncate">
                    <span className="truncate">{selectedScenario.title}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-[#FFD166] text-black border border-black shrink-0">
                      {activeCefr}
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-black/70 font-bold truncate">
                    Bicara dengan <strong>{selectedScenario.partnerName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Voice Preset Dropdown (Microsoft Edge / Azure Neural) */}
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl text-[10px] font-black text-black border-2 border-black shadow-[1px_1px_0px_#000] shrink-0">
                  <Volume2 className="w-3 h-3 text-black stroke-[2.5] shrink-0" />
                  <select
                    value={voiceMode}
                    onChange={(e) => setVoiceMode(e.target.value)}
                    className="bg-transparent text-black font-black text-[10px] focus:outline-none cursor-pointer max-w-[80px] sm:max-w-none truncate"
                    title="Pilih Karakter & Aksen Suara Microsoft AI"
                  >
                    <option value="auto">Auto (Sesuai Karakter) 🎭</option>
                    <optgroup label="🇺🇸 American English">
                      {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-US').map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.flag} {v.name} ({v.gender}) - {v.badge}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🇬🇧 British English">
                      {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-GB').map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.flag} {v.name} ({v.gender}) - {v.badge}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🇦🇺 Australian English">
                      {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-AU').map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.flag} {v.name} ({v.gender}) - {v.badge}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleFinishScenario}
                  title="Selesai dan ambil XP"
                  className="px-2.5 py-1 rounded-xl bg-[#FFD166] hover:bg-[#f1be43] text-black font-black text-[10px] sm:text-[11px] border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer shrink-0"
                >
                  Selesai<span className="hidden sm:inline"> Sesi</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[1px_1px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Chat Transcript Scroll Area */}
            <div className="p-3 sm:p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-3.5 bg-[#F8FAFC] text-xs w-full max-w-full">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1 animate-in fade-in duration-150 w-full`}
                >
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-[13px] leading-relaxed break-words overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000] ${
                      msg.sender === 'user'
                        ? 'bg-[#B388FF] text-black font-bold rounded-br-xs'
                        : 'bg-white text-black font-medium rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="break-words">{msg.text}</span>
                      {msg.sender === 'ai' && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text)}
                          title="Dengarkan pelafalan audio natural"
                          className="text-black hover:text-[#70D6FF] p-0.5 rounded shrink-0 cursor-pointer transition"
                        >
                          <Volume2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      )}
                    </div>

                    {/* AI Translation Toggle */}
                    {msg.sender === 'ai' && msg.translation && (
                      <div className="mt-2 pt-2 border-t border-black/20 flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setShowTranslations((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-black text-black/60 hover:text-black w-fit cursor-pointer"
                        >
                          {showTranslations[idx] ? (
                            <>
                              <EyeOff className="w-3 h-3 stroke-[2.5]" /> Sembunyikan Arti
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 stroke-[2.5]" /> Lihat Terjemahan
                            </>
                          )}
                        </button>
                        {showTranslations[idx] && (
                          <p className="text-[11px] text-black font-bold italic bg-[#D4F63D]/40 p-2 rounded-lg border border-black/30 break-words">
                            {msg.translation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Lala's Friendly Feedback Banner */}
                  {msg.feedback && (
                    <div className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FFD166] border-2 border-black shadow-[2px_2px_0px_#000] text-black max-w-[85%] text-[11px] break-words">
                      <Lightbulb className="w-4 h-4 text-black stroke-[2.5] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black block uppercase text-[10px]">Tips Perbaikan Lala:</span>
                        <span className="font-bold leading-snug break-words">{msg.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* AI Thinking Animation */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] w-fit text-black font-bold animate-pulse">
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                  <span className="text-[11px]">
                    {selectedScenario.partnerName} sedang membalas...
                  </span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Suggestions Chips Bar WITH DESKTOP & MOBILE SCROLL ARROWS */}
            {suggestions.length > 0 && !isLoading && (
              <div className="bg-white border-t-2 border-black flex items-center px-1 py-1.5 shrink-0 w-full min-w-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => chipsScrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' })}
                  className="p-1 rounded-lg text-black hover:bg-slate-100 transition shrink-0 cursor-pointer"
                  title="Geser pilihan ke kiri"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div
                  ref={chipsScrollRef}
                  className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none px-1 scroll-smooth"
                >
                  <span className="text-[10px] font-black text-black shrink-0 uppercase tracking-wider pl-1">
                    Inspirasi:
                  </span>
                  {suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#D4F63D] text-black text-xs font-black shrink-0 transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] max-w-[180px] sm:max-w-[280px] truncate"
                      title={sug}
                    >
                      "{sug}"
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => chipsScrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}
                  className="p-1 rounded-lg text-black hover:bg-slate-100 transition shrink-0 cursor-pointer"
                  title="Geser pilihan ke kanan"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2 sm:p-3 bg-white border-t-2.5 border-black flex items-center gap-1.5 sm:gap-2 shrink-0 w-full min-w-0 overflow-hidden"
            >
              <button
                type="button"
                onClick={handleToggleMic}
                title={isListening ? 'Berhenti mendengarkan' : 'Bicara lewat suara mikrofon'}
                className={`p-2.5 rounded-2xl transition cursor-pointer shrink-0 border-2 border-black active:translate-x-0.5 active:translate-y-0.5 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-[2px_2px_0px_#000]'
                    : 'bg-white hover:bg-slate-100 text-black shadow-[2px_2px_0px_#000]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 stroke-[2.5]" /> : <Mic className="w-4 h-4 stroke-[2.5]" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? 'Mendengarkan ucapanmu (bicara sekarang)...' : 'Ketik balasan bahasa Inggris...'}
                disabled={isLoading}
                className="flex-1 min-w-0 px-3.5 py-2 text-xs rounded-2xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-black bg-white text-black font-bold placeholder:text-black/50"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42e] active:translate-x-0.5 active:translate-y-0.5 text-black border-2 border-black shadow-[2px_2px_0px_#000] transition cursor-pointer disabled:opacity-40 shrink-0 font-black"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: COMPLETION SUMMARY */}
        {/* ============================================================ */}
        {viewMode === 'summary' && selectedScenario && (
          <div className="p-6 sm:p-8 text-center space-y-5 flex flex-col items-center justify-center my-auto w-full max-w-full">
            <div className="w-16 h-16 rounded-3xl bg-[#FFD166] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-black uppercase">
                Sesi Roleplay Selesai! 🎉
              </h3>
              <p className="text-xs text-black/70 font-bold max-w-sm">
                Kamu telah berlatih percakapan nyata bersama <strong>{selectedScenario.partnerName}</strong> sebanyak <strong>{turnsCount} ronde</strong>.
              </p>
            </div>

            {/* XP Award Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4F63D] text-black font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000]">
              <Zap className="w-4 h-4 fill-black text-black stroke-[2.5]" />
              <span>+30 XP Bonus Roleplay Ditambahkan!</span>
            </div>

            <div className="pt-4 flex items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setViewMode('select')}
                className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-white hover:bg-slate-50 text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                Ganti Skenario
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#80ED99] hover:bg-[#68d783] active:translate-x-0.5 active:translate-y-0.5 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] transition cursor-pointer"
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
