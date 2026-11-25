import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  BookOpen,
  Newspaper,
  X,
  Zap,
} from 'lucide-react';
import { SCANNER_SETS, resolvePlacementResult } from '../../services/placementTestData';
import { useAppStore } from '../../store/useAppStore';

// Fisher-Yates shuffle algorithm for question options
const shuffleOptions = (options) => {
  const array = [...options];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LanguageScannerModal({ isOpen, onClose, onSelectLevel }) {
  const { setUserCefrLevel } = useAppStore();

  const [step, setStep] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [currentGerbongIndex, setCurrentGerbongIndex] = useState(() =>
    Math.floor(Math.random() * SCANNER_SETS.length)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState(() => {
    const initialSet = SCANNER_SETS[0];
    return initialSet.questions.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));
  });

  // Lock body scroll on mobile & desktop when open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const currentSet = SCANNER_SETS[currentGerbongIndex] || SCANNER_SETS[0];
  const currentQuestion = quizQuestions[currentIndex] || currentSet.questions[0];
  const totalQuestions = quizQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleStart = () => {
    // Pick a new random gerbong set (attempting to give a different one if possible)
    let nextGerbongIdx = Math.floor(Math.random() * SCANNER_SETS.length);
    if (SCANNER_SETS.length > 1 && nextGerbongIdx === currentGerbongIndex) {
      nextGerbongIdx = (nextGerbongIdx + 1) % SCANNER_SETS.length;
    }

    const chosenSet = SCANNER_SETS[nextGerbongIdx];
    const prepared = chosenSet.questions.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));

    setCurrentGerbongIndex(nextGerbongIdx);
    setQuizQuestions(prepared);
    setStep('quiz');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setFinalResult(null);
  };

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = currentQuestion.options[index]?.isCorrect;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final result without prematurely triggering setUserCefrLevel (avoids double XP)
      const result = resolvePlacementResult(correctAnswersCount);
      setFinalResult(result);
      setStep('result');
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b-2.5 border-black flex items-center justify-between bg-[#70D6FF]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                The Language Scanner • CEFR Diagnostic
              </span>
              <h3 className="text-base font-black text-black">
                Tes Penempatan Level Bahasa
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="space-y-6 text-center max-w-md mx-auto py-2">
              <div className="w-20 h-20 rounded-3xl bg-[#FFD166] border-3 border-black shadow-[4px_4px_0px_#000] text-black flex items-center justify-center mx-auto">
                <Compass className="w-10 h-10 stroke-[2.5] animate-spin-slow" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-black tracking-tight uppercase">
                  Temukan Posisi Level Bahasa Inggrismu
                </h2>
                <p className="text-xs sm:text-sm text-black/70 font-bold leading-relaxed">
                  Jawab <strong>8 pertanyaan diagnostik cepat</strong> (dipilih acak dari <strong>5 Gerbong Soal / total 40 soal CEFR</strong>) untuk mendeteksi apakah kamu berada di level <strong>A1, A2, B1, B2</strong>, atau <strong>C1</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[3px_3px_0px_#000] text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-black">
                  <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Apa yang Akan Kamu Dapatkan?</span>
                </div>
                <ul className="space-y-1.5 text-black/80 font-bold list-disc list-inside">
                  <li>Lencana resmi CEFR untuk profilmu</li>
                  <li>Rekomendasi modul &amp; artikel bacaan pertama yang paling pas</li>
                  <li>Bank soal adaptif 5 gerbong teruji agar tiap pengujian ulang selalu segar</li>
                  <li>Bonus instan <strong>+50 XP</strong> untuk peringkat ligamu</li>
                </ul>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42e] text-black font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                Mulai Scanner Level (3 Menit) 🚀
              </button>
            </div>
          )}

          {/* STEP 2: QUIZ FLOW */}
          {step === 'quiz' && currentQuestion && (
            <div className="space-y-5">
              {/* Progress Bar & Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-black gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFD166] border-2 border-black shadow-[1px_1px_0px_#000] text-black font-black text-[10px]">
                      Gerbong {currentGerbongIndex + 1} dari 5 • {currentSet.badge}
                    </span>
                    <span>Pertanyaan {currentIndex + 1} dari {totalQuestions}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-[#D4F63D] border border-black text-black font-black">{currentQuestion.levelLabel}</span>
                </div>

                <div className="w-full bg-white rounded-full h-3 border-2 border-black p-0.5 overflow-hidden">
                  <div
                    className="bg-[#B388FF] h-full rounded-full transition-all duration-300 border border-black"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2.5">
                <p className="text-sm font-black text-black">
                  {currentQuestion.prompt}
                </p>

                {currentQuestion.context && (
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[2px_2px_0px_#000] text-black font-bold text-sm sm:text-base leading-relaxed">
                    {currentQuestion.context}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'border-black bg-white hover:bg-[#D4F63D]/30 text-black shadow-[2px_2px_0px_#000]';

                  if (isAnswerSubmitted) {
                    if (option.isCorrect) {
                      btnStyle = 'border-black bg-[#80ED99] text-black font-black shadow-[3px_3px_0px_#000]';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-black bg-[#FF85C0] text-black font-black shadow-[3px_3px_0px_#000]';
                    } else {
                      btnStyle = 'border-black bg-white text-black/40 opacity-60 shadow-none';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer active:translate-x-0.5 active:translate-y-0.5`}
                    >
                      <span className="leading-snug">{option.text}</span>
                      {isAnswerSubmitted && option.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && !option.isCorrect && (
                        <XCircle className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-[#FFD166] border-2 border-black shadow-[3px_3px_0px_#000] space-y-1.5 text-xs animate-fade-in text-black">
                  <div className="flex items-center gap-1.5 font-black">
                    {currentQuestion.options[selectedOption]?.isCorrect ? (
                      <span className="text-black flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Jawaban Tepat!
                      </span>
                    ) : (
                      <span className="text-black flex items-center gap-1">
                        <XCircle className="w-4 h-4 stroke-[2.5]" /> Belum Tepat
                      </span>
                    )}
                  </div>
                  <p className="font-bold leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RESULT CELEBRATION */}
          {step === 'result' && finalResult && (
            <div className="space-y-6 text-center max-w-md mx-auto py-2">
              {/* Badge Icon */}
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl bg-[#FFD166] border-3 border-black shadow-[5px_5px_0px_#000] text-black flex items-center justify-center mx-auto text-5xl">
                  {finalResult.badge}
                </div>
                <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-[#80ED99] text-black border-2 border-black text-[10px] font-black shadow-[2px_2px_0px_#000]">
                  +50 XP
                </span>
              </div>

              {/* Level Title */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-black">
                  Hasil Penempatan CEFR Resmi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                  {finalResult.levelCode} • {finalResult.title}
                </h2>
                <p className="text-xs font-black text-black/70">
                  {finalResult.role} &bull; {finalResult.accuracyPercent}% Akurasi ({correctAnswersCount} / 8 Benar)
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-black font-bold leading-relaxed p-4 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[3px_3px_0px_#000]">
                {finalResult.summary}
              </p>

              {/* Recommendation Cards */}
              <div className="space-y-2.5 text-left">
                <span className="text-xs font-black text-black uppercase tracking-wider">
                  Rekomendasi Pertama Untukmu:
                </span>

                <Link
                  to={`/module/${finalResult.recommendedModuleId}`}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl border-2 border-black bg-white hover:bg-[#D4F63D]/30 shadow-[3px_3px_0px_#000] transition flex items-center justify-between gap-3 group active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] font-black text-black/60 uppercase">Modul Belajar</span>
                      <p className="text-xs font-black text-black truncate group-hover:underline">
                        {finalResult.recommendedModuleTitle}
                      </p>
                    </div>
                  </div>
                  <span className="p-1.5 rounded-xl bg-[#D4F63D] border border-black text-black shrink-0 transition">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>

                <Link
                  to={`/reading?article=${finalResult.recommendedArticleId}`}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl border-2 border-black bg-white hover:bg-[#70D6FF]/30 shadow-[3px_3px_0px_#000] transition flex items-center justify-between gap-3 group active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Newspaper className="w-4 h-4 text-black stroke-[2.5] shrink-0" />
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] font-black text-black/60 uppercase">Artikel Bacaan</span>
                      <p className="text-xs font-black text-black truncate group-hover:underline">
                        {finalResult.recommendedArticleTitle}
                      </p>
                    </div>
                  </div>
                  <span className="p-1.5 rounded-xl bg-[#70D6FF] border border-black text-black shrink-0 transition">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleStart}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-black bg-white text-black hover:bg-slate-50 text-xs font-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                  title="Uji ulang kemampuan dengan paket gerbong soal baru"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Ulangi (Gerbong Baru)</span>
                </button>

                <button
                  onClick={() => {
                    if (finalResult?.levelCode) {
                      setUserCefrLevel(finalResult.levelCode);
                      if (onSelectLevel) {
                        onSelectLevel(finalResult.levelCode);
                      }
                    }
                    onClose();
                  }}
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42e] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  Terapkan Level &amp; Lanjut Belajar 🚀
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (for quiz step) */}
        {step === 'quiz' && (
          <div className="px-5 sm:px-6 py-3.5 border-t-2.5 border-black bg-white flex items-center justify-between">
            <span className="text-xs text-black/60 font-bold">
              Pilih satu jawaban terbaik di atas.
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswerSubmitted}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42e] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Lihat Hasil Scanner' : 'Pertanyaan Berikutnya'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

