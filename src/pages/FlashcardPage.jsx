import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, BookOpen, Mic, Shuffle, Sparkles, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Flashcard from '../components/flashcards/Flashcard';
import Controls from '../components/flashcards/Controls';
import SessionSummary from '../components/flashcards/SessionSummary';
import VoiceShadowingWidget from '../components/flashcards/VoiceShadowingWidget';
import FlashcardAiExplainer from '../components/flashcards/FlashcardAiExplainer';
import VoiceSelectorModal from '../components/common/VoiceSelectorModal';
import { getTargetSpeechSentence } from '../utils/speechRecognition';

// Algoritma Fisher-Yates Shuffle untuk pengacakan kartu yang merata dan adil
function shuffleArray(array) {
  if (!array || array.length <= 1) return array ? [...array] : [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashcardPage() {
  const { module_id } = useParams();
  const { fetchFlashcards, submitProgress, getMetrics } = useAppStore();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVoiceShadowing, setShowVoiceShadowing] = useState(false);
  const [showAiExplainer, setShowAiExplainer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionStats, setSessionStats] = useState({ hard: 0, good: 0, easy: 0 });
  const [shuffleToast, setShuffleToast] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const { dueCount = 0 } = getMetrics ? getMetrics() : {};

  const loadCards = useCallback(async () => {
    setLoading(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ hard: 0, good: 0, easy: 0 });

    try {
      const { data } = await fetchFlashcards(module_id);
      const rawList = data || [];
      // Otomatis acak urutan kartu saat sesi dibuka agar tidak monoton
      setCards(shuffleArray(rawList));
    } catch (err) {
      console.error('Failed to load flashcards:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards, module_id]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Fitur acak manual bila user ingin kocok kartu di tengah sesi
  const handleShuffle = useCallback(() => {
    if (cards.length <= 1) return;
    setCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffleToast(true);
    setTimeout(() => setShuffleToast(false), 2200);
  }, [cards.length]);

  const handleRate = useCallback(
    async (rating) => {
      if (submitting || !cards[currentIndex]) return;
      const currentCard = cards[currentIndex];

      setSubmitting(true);
      // Track session stats
      setSessionStats((prev) => ({
        ...prev,
        [rating.toLowerCase()]: prev[rating.toLowerCase()] + 1,
      }));

      try {
        await submitProgress(currentCard.id, rating);
      } catch (err) {
        console.warn('Progress submission error:', err);
      } finally {
        setSubmitting(false);
        setIsFlipped(false);

        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsFinished(true);
        }
      }
    },
    [cards, currentIndex, submitProgress, submitting]
  );

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || loading) return;

      // 1. Never intercept hotkeys when AI explainer or Voice modal is open
      if (showAiExplainer || showVoiceModal) return;

      // 2. Do not intercept if user is actively focused on an input/textarea/editable
      const activeEl = document.activeElement;
      const activeTag = activeEl?.tagName?.toLowerCase();
      const isTyping =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeEl?.isContentEditable ||
        activeEl?.closest('[data-modal]') ||
        activeEl?.closest('.ai-explainer-drawer');

      if (isTyping) return;

      // 3. Spacebar Handling: Flip Card
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        // If an on-screen button was focused from previous click, blur it so Space doesn't re-trigger it
        if (activeTag === 'button') {
          activeEl.blur();
        }
        handleFlip();
        return;
      }

      // 4. Rating & Shuffle Shortcuts
      if (e.key === '1') {
        if (isFlipped) handleRate('Hard');
      } else if (e.key === '2') {
        if (isFlipped) handleRate('Good');
      } else if (e.key === '3') {
        if (isFlipped) handleRate('Easy');
      } else if (e.key === 's' || e.key === 'S') {
        handleShuffle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleRate, handleShuffle, isFinished, loading, isFlipped, showAiExplainer, showVoiceModal]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Menyiapkan kartu flashcard...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-14 h-14 bg-[#D4F63D] border-2 border-black shadow-[3px_3px_0px_#000] text-black rounded-2xl flex items-center justify-center mx-auto">
          {module_id === 'due' ? <Sparkles className="w-7 h-7 stroke-[2.5]" /> : <AlertCircle className="w-7 h-7 stroke-[2.5]" />}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-black uppercase">
          {module_id === 'due' ? 'Review Hari Ini Tuntas! 🎉' : 'Belum Ada Flashcard'}
        </h2>
        <p className="text-xs sm:text-sm text-black/70 font-bold">
          {module_id === 'due'
            ? 'Hebat! Semua memori kartu SRS kamu dalam status aman. Tidak ada kartu yang jatuh tempo saat ini.'
            : 'Modul ini belum memiliki kartu flashcard yang terdaftar.'}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-2">
          {module_id === 'due' && (
            <Link
              to="/flashcards/all"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF85C0] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
            >
              <span>Latihan Semua Kartu (Koleksi Bebas)</span>
            </Link>
          )}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="py-6">
        <SessionSummary
          stats={sessionStats}
          totalCards={cards.length}
          onRestart={loadCards}
        />
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-xl mx-auto py-2">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black active:translate-x-0.5 active:translate-y-0.5 transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Keluar Sesi
        </Link>

        <div className="flex items-center gap-2">
          {module_id !== 'all' && module_id !== 'due' && (
            <Link
              to={`/module/${module_id}`}
              className="px-2.5 py-1 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] text-xs font-black text-black flex items-center gap-1 mr-1"
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" /> Teori
            </Link>
          )}

          <button
            type="button"
            onClick={handleShuffle}
            title="Kocok susunan kartu (Shortcut: S)"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-[#D4F63D] text-black text-xs font-black transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Acak</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVoiceModal(true)}
            title="Pengaturan Suara AI Kokoro"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF85C0] hover:bg-[#D4F63D] text-black text-xs font-black transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Suara AI</span>
          </button>

          <span className="text-xs font-black px-3 py-1 rounded-xl bg-[#D4F63D] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Mode Indicator & Switcher Strip */}
      <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border-2 border-black shadow-[1px_1px_0px_#000] ${
            module_id === 'due' ? 'bg-[#FF85C0] text-black' : 'bg-[#70D6FF] text-black'
          }`}>
            {module_id === 'due' ? 'Fokus Review SRS' : module_id === 'all' ? 'Semua Koleksi Modul' : 'Flashcard Modul'}
          </span>
          <span className="text-xs font-black text-black">
            {cards.length} Kartu Aktif
          </span>
        </div>

        {/* Helpful Banner / Direct Switcher between Due and All */}
        {module_id === 'all' && dueCount > 0 && (
          <Link
            to="/flashcards/due"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF85C0] text-black border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-xs font-black transition"
          >
            <span>Fokus {dueCount} Kartu Review Saja →</span>
          </Link>
        )}
        {module_id === 'due' && (
          <Link
            to="/flashcards/all"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-black border-2 border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-xs font-black transition"
          >
            <span>Buka Semua Kartu →</span>
          </Link>
        )}
      </div>

      {/* Visual Feedback Toast when Shuffled */}
      {shuffleToast && (
        <div className="flex justify-center -my-1 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <Shuffle className="w-3.5 h-3.5 text-[#D4F63D] stroke-[2.5]" /> Urutan kartu berhasil diacak!
          </span>
        </div>
      )}

      {/* Neo-Brutalist Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-white h-3 rounded-full border-2 border-black p-0.5 overflow-hidden">
          <div
            className="bg-[#B388FF] h-full rounded-full transition-all duration-300 border border-black"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onToggleShadowing={() => {
          setShowVoiceShadowing((prev) => !prev);
          if (!showVoiceShadowing) setShowAiExplainer(false);
        }}
        isShadowingActive={showVoiceShadowing}
        onToggleAiExplainer={() => {
          setShowAiExplainer((prev) => !prev);
          if (!showAiExplainer) setShowVoiceShadowing(false);
        }}
        isAiExplainerActive={showAiExplainer}
      />

      {/* Quick Action Bar: Lala AI Assistant & Voice Shadowing */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setShowAiExplainer((prev) => !prev);
            if (!showAiExplainer) setShowVoiceShadowing(false);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 ${
            showAiExplainer
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-md'
              : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${showAiExplainer ? 'text-amber-300 fill-amber-300' : 'text-amber-500 fill-amber-400'}`} />
          <span>{showAiExplainer ? 'Sembunyikan Lala AI' : '💡 Tanya Lala AI'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowVoiceShadowing((prev) => !prev);
            if (!showVoiceShadowing) setShowAiExplainer(false);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
            showVoiceShadowing
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Mic className={`w-3.5 h-3.5 ${showVoiceShadowing ? 'text-white' : 'text-indigo-600'}`} />
          <span>{showVoiceShadowing ? 'Sembunyikan Pelafalan' : '🎙️ Latih Pelafalan'}</span>
        </button>
      </div>

      {/* Lala AI Explainer Drawer */}
      {showAiExplainer && (
        <FlashcardAiExplainer
          card={currentCard}
          isFlipped={isFlipped}
          onClose={() => setShowAiExplainer(false)}
        />
      )}

      {/* Voice Shadowing Assessment Engine */}
      {showVoiceShadowing && (
        <VoiceShadowingWidget
          targetSentence={getTargetSpeechSentence(currentCard)}
          cardId={currentCard.id}
          isFlipped={isFlipped}
        />
      )}

      {/* SRS Controls */}
      <Controls
        onRate={handleRate}
        disabled={submitting}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      {/* Kokoro AI Voice Selector & Caching Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
