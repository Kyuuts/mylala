import React, { useState } from 'react';
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
import { SCANNER_QUESTIONS, resolvePlacementResult } from '../../services/placementTestData';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState(() =>
    SCANNER_QUESTIONS.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }))
  );

  if (!isOpen) return null;

  const currentQuestion = quizQuestions[currentIndex] || SCANNER_QUESTIONS[0];
  const totalQuestions = quizQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleStart = () => {
    // Re-shuffle options dynamically whenever test starts or restarts
    const prepared = SCANNER_QUESTIONS.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                The Language Scanner • CEFR Diagnostic
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Tes Penempatan Level Bahasa
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="space-y-6 text-center max-w-md mx-auto py-2">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                <Compass className="w-10 h-10 animate-spin-slow" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Temukan Posisi Level Bahasa Inggrismu
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jawab <strong>8 pertanyaan diagnostik cepat</strong> (estimasi 3 menit) untuk mendeteksi apakah kamu berada di level <strong>A1, A2, B1, B2</strong>, atau <strong>C1</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Apa yang Akan Kamu Dapatkan?</span>
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Lencana resmi CEFR untuk profilmu</li>
                  <li>Rekomendasi modul &amp; artikel bacaan pertama yang paling pas</li>
                  <li>Bonus instan <strong>+50 XP</strong> untuk peringkat ligamu</li>
                </ul>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition active:scale-95 cursor-pointer"
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
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Pertanyaan {currentIndex + 1} dari {totalQuestions}</span>
                  <span className="text-indigo-600 font-extrabold">{currentQuestion.levelLabel}</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">
                  {currentQuestion.prompt}
                </p>

                {currentQuestion.context && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
                    {currentQuestion.context}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800';

                  if (isAnswerSubmitted) {
                    if (option.isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer`}
                    >
                      <span className="leading-snug">{option.text}</span>
                      {isAnswerSubmitted && option.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && !option.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold">
                    {currentQuestion.options[selectedOption]?.isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Tepat!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Belum Tepat
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
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
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 text-white flex items-center justify-center mx-auto text-5xl shadow-xl shadow-orange-500/20">
                  {finalResult.badge}
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
                  +50 XP
                </span>
              </div>

              {/* Level Title */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                  Hasil Penempatan CEFR Resmi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {finalResult.levelCode} • {finalResult.title}
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {finalResult.role} &bull; {finalResult.accuracyPercent}% Akurasi ({correctAnswersCount} / 8 Benar)
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200">
                {finalResult.summary}
              </p>

              {/* Recommendation Cards */}
              <div className="space-y-2.5 text-left">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rekomendasi Pertama Untukmu:
                </span>

                <Link
                  to={`/module/${finalResult.recommendedModuleId}`}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/60 hover:border-indigo-300 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Modul Belajar</span>
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-700 transition">
                        {finalResult.recommendedModuleTitle}
                      </p>
                    </div>
                  </div>
                  <span className="p-1.5 rounded-xl bg-indigo-600 text-white group-hover:bg-indigo-700 shrink-0 transition">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  to={`/reading?article=${finalResult.recommendedArticleId}`}
                  onClick={onClose}
                  className="p-3.5 rounded-2xl border border-sky-100 bg-sky-50/50 hover:bg-sky-100/60 hover:border-sky-300 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Newspaper className="w-4 h-4 text-sky-600 shrink-0" />
                    <div className="min-w-0 text-left">
                      <span className="text-[10px] font-bold text-sky-600 uppercase">Artikel Bacaan</span>
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-700 transition">
                        {finalResult.recommendedArticleTitle}
                      </p>
                    </div>
                  </div>
                  <span className="p-1.5 rounded-xl bg-sky-600 text-white group-hover:bg-sky-700 shrink-0 transition">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleStart}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi</span>
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
                  className="flex-1 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
                >
                  Terapkan Level &amp; Lanjut Belajar 🚀
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (for quiz step) */}
        {step === 'quiz' && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Pilih satu jawaban terbaik di atas.
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswerSubmitted}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Lihat Hasil Scanner' : 'Pertanyaan Berikutnya'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

