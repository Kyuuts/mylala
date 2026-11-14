import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, BookOpen, Mic, Shuffle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Flashcard from '../components/flashcards/Flashcard';
import Controls from '../components/flashcards/Controls';
import SessionSummary from '../components/flashcards/SessionSummary';
import VoiceShadowingWidget from '../components/flashcards/VoiceShadowingWidget';
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
  const { fetchFlashcards, submitProgress } = useAppStore();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVoiceShadowing, setShowVoiceShadowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionStats, setSessionStats] = useState({ hard: 0, good: 0, easy: 0 });
  const [shuffleToast, setShuffleToast] = useState(false);

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

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1') {
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
  }, [handleFlip, handleRate, handleShuffle, isFinished, loading, isFlipped]);

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
        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Belum Ada Flashcard</h2>
        <p className="text-sm text-slate-600">
          Modul ini belum memiliki kartu flashcard yang terdaftar.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm transition hover:bg-indigo-700 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
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
    <div className="space-y-6 max-w-xl mx-auto py-2">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Keluar Sesi
        </Link>

        <div className="flex items-center gap-2">
          {module_id !== 'all' && (
            <Link
              to={`/module/${module_id}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mr-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Cheat Sheet
            </Link>
          )}

          <button
            type="button"
            onClick={handleShuffle}
            title="Kocok ulang susunan kartu (Shortcut: S)"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition active:scale-95 cursor-pointer border border-indigo-200/80 shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Acak Kartu</span>
          </button>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Visual Feedback Toast when Shuffled */}
      {shuffleToast && (
        <div className="flex justify-center -my-2 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-md">
            <Shuffle className="w-3 h-3 text-indigo-200" /> Urutan kartu berhasil diacak! 🔀
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <Flashcard
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onToggleShadowing={() => setShowVoiceShadowing((prev) => !prev)}
        isShadowingActive={showVoiceShadowing}
      />

      {/* Voice Shadowing Quick Bar */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowVoiceShadowing((prev) => !prev)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
            showVoiceShadowing
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}
        >
          <Mic className={`w-3.5 h-3.5 ${showVoiceShadowing ? 'text-white' : 'text-indigo-600'}`} />
          <span>{showVoiceShadowing ? 'Sembunyikan Latihan Pelafalan' : '🎙️ Latih Pelafalan (Voice Shadowing)'}</span>
        </button>
      </div>

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
    </div>
  );
}
