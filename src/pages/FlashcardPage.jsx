import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Flashcard from '../components/flashcards/Flashcard';
import Controls from '../components/flashcards/Controls';
import SessionSummary from '../components/flashcards/SessionSummary';

export default function FlashcardPage() {
  const { module_id } = useParams();
  const { fetchFlashcards, submitProgress } = useAppStore();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionStats, setSessionStats] = useState({ hard: 0, good: 0, easy: 0 });

  const loadCards = useCallback(async () => {
    setLoading(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ hard: 0, good: 0, easy: 0 });

    try {
      const { data } = await fetchFlashcards(module_id);
      setCards(data || []);
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
        handleRate('Hard');
      } else if (e.key === '2') {
        handleRate('Good');
      } else if (e.key === '3') {
        handleRate('Easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleRate, isFinished, loading]);

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
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> Cheat Sheet
            </Link>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

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
      />

      {/* SRS Controls */}
      <Controls
        onRate={handleRate}
        disabled={submitting}
        isFlipped={isFlipped}
      />
    </div>
  );
}
