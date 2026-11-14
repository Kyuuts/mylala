import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X,
  BookOpen,
  Zap,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { getLevelExam } from '../../services/levelExamData';
import { useAppStore } from '../../store/useAppStore';

export default function LevelExitExamModal({ isOpen, onClose, levelCode = 'A1', onGraduate }) {
  const { completeLevelExam } = useAppStore();

  const [step, setStep] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [examData, setExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // [{ questionId, selectedIndex, isCorrect }]
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const data = getLevelExam(levelCode);
      setExamData(data);
      setStep('intro');
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCorrectAnswersCount(0);
      setUserAnswers([]);
      setConfettiActive(false);
    }
  }, [isOpen, levelCode]);

  if (!isOpen || !examData) return null;

  const questions = examData.questions || [];
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const passingScore = examData.passingScore || Math.ceil(totalQuestions * 0.8);

  const handleStartExam = () => {
    setStep('quiz');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setUserAnswers([]);
  };

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = currentQ.options[index]?.isCorrect;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: index,
        isCorrect: !!isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Exam finished, calculate results
      setStep('result');
      const isPassed = correctAnswersCount >= passingScore;

      if (isPassed) {
        setConfettiActive(true);
        // Reward 150 XP & advance level in store
        completeLevelExam(levelCode, correctAnswersCount, totalQuestions);
      }
    }
  };

  const isPassed = correctAnswersCount >= passingScore;
  const percentScore = Math.round((correctAnswersCount / totalQuestions) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      {/* Lightweight Festive Confetti Particles when Passed */}
      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full animate-bounce"
              style={{
                top: `${(i * 19) % 95}%`,
                left: `${(i * 23) % 98}%`,
                backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#3b82f6', '#14b8a6'][i % 6],
                animationDuration: `${1.2 + (i % 5) * 0.4}s`,
                animationDelay: `${(i % 10) * 0.1}s`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200 z-20">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Ujian Kelulusan Resmi • Exit Exam
              </span>
              <h3 className="text-base font-extrabold text-white">
                {examData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="space-y-6 text-center py-2">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 text-white flex items-center justify-center mx-auto text-4xl shadow-lg shadow-orange-500/25">
                  ⚔️
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
                  +150 XP
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Ujian Kenaikan Level {levelCode}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  {examData.description}
                </p>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Jumlah Soal</span>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{totalQuestions} Soal Mix</p>
                  <span className="text-[10px] text-slate-500">Grammar &amp; Vocab</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Passing Grade</span>
                  <p className="text-sm font-extrabold text-emerald-600 mt-0.5">Minimal 80%</p>
                  <span className="text-[10px] text-slate-500">{passingScore} dari {totalQuestions} benar</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Hadiah Lulus</span>
                  <p className="text-sm font-extrabold text-indigo-600 mt-0.5">+150 XP</p>
                  <span className="text-[10px] text-slate-500">Promosi Level Akun</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartExam}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mulai Ujian Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: QUIZ STEPPER */}
          {step === 'quiz' && currentQ && (
            <div className="space-y-5">
              {/* Progress Bar & Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-indigo-600">
                    Soal {currentIndex + 1} dari {totalQuestions}
                  </span>
                  <span className="text-slate-400 font-bold">
                    Benar: {correctAnswersCount}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    {currentQ.category}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {currentQ.prompt}
                </h4>

                {currentQ.context && (
                  <p className="text-xs sm:text-sm text-slate-700 font-serif italic p-3 rounded-xl bg-white border border-slate-200 leading-relaxed">
                    {currentQ.context}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-slate-50';

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300/40';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300/40';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswerSubmitted && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation */}
              {isAnswerSubmitted && currentQ.explanation && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                    currentQ.options[selectedOption]?.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pembahasan Kunci:</span>
                  </p>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && (
            <div className="space-y-6 text-center py-2">
              <div className="relative inline-block">
                <div
                  className={`w-24 h-24 rounded-3xl text-white flex items-center justify-center mx-auto text-5xl shadow-xl ${
                    isPassed
                      ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 shadow-orange-500/25 animate-pulse'
                      : 'bg-slate-700 shadow-slate-500/20'
                  }`}
                >
                  {isPassed ? '🏆' : '📖'}
                </div>
                {isPassed && (
                  <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                    +150 XP
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                  Hasil Evaluasi Ujian Akhir
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isPassed ? '🎉 SELAMAT! KAMU LULUS!' : 'Belum Lulus, Coba Lagi!'}
                </h2>
                <p className="text-sm font-bold text-slate-500">
                  Skor: <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>{correctAnswersCount}</span> / {totalQuestions} Soal Benar ({percentScore}%)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto text-left space-y-2">
                {isPassed ? (
                  <>
                    <p className="font-bold text-slate-900">
                      Luar biasa! Kamu telah membuktikan penguasaan materi di Level {levelCode}.
                    </p>
                    <p>
                      Status profilmu resmi naik tingkat, bonus <strong>+150 XP</strong> telah ditambahkan ke leaderboard, dan seluruh modul di level berikutnya telah terbuka!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-rose-800">
                      Nilai kelulusan minimal adalah 80% ({passingScore} dari {totalQuestions} benar).
                    </p>
                    <p>
                      Jangan berkecil hati! Pelajari kembali materi modul yang masih ragu, lalu ulangi ujian kapan saja tanpa penalti poin.
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleStartExam}
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Ujian</span>
                </button>

                <button
                  onClick={() => {
                    if (isPassed && onGraduate) {
                      const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                      const currentIdx = CEFR_ORDER.indexOf(levelCode);
                      const nextLevel = currentIdx !== -1 && currentIdx < CEFR_ORDER.length - 1 ? CEFR_ORDER[currentIdx + 1] : levelCode;
                      onGraduate(nextLevel);
                    }
                    onClose();
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer ${
                    isPassed
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <span>{isPassed ? 'Buka Level Baru 🚀' : 'Kembali Membaca Modul'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (for quiz step navigation) */}
        {step === 'quiz' && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Pilih satu jawaban di atas untuk melihat pembahasan.
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswerSubmitted}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Selesai & Lihat Skor' : 'Soal Berikutnya'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
