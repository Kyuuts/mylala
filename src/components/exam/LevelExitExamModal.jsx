import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// Fisher-Yates shuffle algorithm for exam question options
const shuffleOptions = (options) => {
  const array = [...options];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LevelExitExamModal({ isOpen, onClose, levelCode = 'A1', onGraduate }) {
  const { completeLevelExam } = useAppStore();

  const [step, setStep] = useState('intro'); // 'intro' | 'quiz' | 'result'
  const [examData, setExamData] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // [{ questionId, selectedIndex, isCorrect }]
  const [confettiActive, setConfettiActive] = useState(false);

  // Countdown Timer States (10 Minutes Standard)
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const data = getLevelExam(levelCode);
      setExamData(data);
      const shuffled = (data?.questions || []).map((q) => ({
        ...q,
        options: shuffleOptions(q.options || []),
      }));
      setExamQuestions(shuffled);
      setStep('intro');
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCorrectAnswersCount(0);
      setUserAnswers([]);
      setConfettiActive(false);
      setTimeLeft(data?.timeLimitSeconds || 600);
      setIsTimeUp(false);
    }
  }, [isOpen, levelCode]);

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

  // Countdown Timer Effect
  useEffect(() => {
    let interval = null;
    if (step === 'quiz' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timeLeft]);

  // Auto-submit when time expires (BUG-05 Fix)
  useEffect(() => {
    if (step === 'quiz' && timeLeft === 0) {
      setIsTimeUp(true);
      finishExam();
    }
  }, [step, timeLeft]);

  if (!isOpen || !examData) return null;

  const questions = examQuestions.length > 0 ? examQuestions : (examData.questions || []);
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const passingScore = examData.passingScore || Math.ceil(totalQuestions * 0.8);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    // Re-shuffle dynamically on each attempt
    const shuffled = (examData?.questions || []).map((q) => ({
      ...q,
      options: shuffleOptions(q.options || []),
    }));
    setExamQuestions(shuffled);
    setStep('quiz');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setUserAnswers([]);
    setTimeLeft(examData?.timeLimitSeconds || 600);
    setIsTimeUp(false);
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

  const finishExam = () => {
    setStep('result');
    const isPassed = correctAnswersCount >= passingScore;

    if (isPassed) {
      setConfettiActive(true);
      // Reward 150 XP & advance level in store
      completeLevelExam(levelCode, correctAnswersCount, totalQuestions);
      if (typeof onGraduate === 'function') {
        onGraduate();
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishExam();
    }
  };

  const isPassed = correctAnswersCount >= passingScore;
  const percentScore = Math.round((correctAnswersCount / totalQuestions) * 100);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      {/* Lightweight Festive Confetti Particles when Passed */}
      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-md border border-black animate-bounce"
              style={{
                top: `${(i * 19) % 95}%`,
                left: `${(i * 23) % 98}%`,
                backgroundColor: ['#D4F63D', '#70D6FF', '#FF85C0', '#FFD166', '#80ED99', '#B388FF'][i % 6],
                animationDuration: `${1.2 + (i % 5) * 0.4}s`,
                animationDelay: `${(i % 10) * 0.1}s`,
                opacity: 0.95,
              }}
            />
          ))}
        </div>
      )}

      <div
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col max-h-[94vh] z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header - Neo-Brutalism */}
        <div className="px-6 py-4 border-b-2.5 border-black flex items-center justify-between bg-[#B388FF] text-black">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                Ujian Kelulusan Resmi • Exit Exam
              </span>
              <h3 className="text-base font-black text-black uppercase">
                {examData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="space-y-6 text-center py-2">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-[#FFD166] text-black border-2.5 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto text-4xl">
                  ⚔️
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg bg-[#80ED99] text-black border-2 border-black text-[10px] font-black shadow-[1.5px_1.5px_0px_#000]">
                  +150 XP
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                  Ujian Kenaikan Level {levelCode}
                </h2>
                <p className="text-xs sm:text-sm text-black/80 font-bold leading-relaxed max-w-md mx-auto">
                  {examData.description}
                </p>
              </div>

              {/* Rules Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-black text-black/70 uppercase block">Jumlah Soal</span>
                  <p className="text-sm font-black text-black mt-0.5">{totalQuestions} Soal Mix</p>
                  <span className="text-[10px] font-bold text-black/60">Grammar &amp; Vocab</span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-black text-black/70 uppercase block">Batas Waktu</span>
                  <p className="text-sm font-black text-amber-600 mt-0.5">10 Menit</p>
                  <span className="text-[10px] font-bold text-black/60">Auto-submit</span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-black text-black/70 uppercase block">Passing Grade</span>
                  <p className="text-sm font-black text-emerald-600 mt-0.5">Minimal 80%</p>
                  <span className="text-[10px] font-bold text-black/60">{passingScore} dari {totalQuestions} benar</span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="text-[10px] font-black text-black/70 uppercase block">Hadiah Lulus</span>
                  <p className="text-sm font-black text-indigo-700 mt-0.5">+150 XP</p>
                  <span className="text-[10px] font-bold text-black/60">Promosi Level Akun</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartExam}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black font-black text-sm uppercase tracking-wider border-2.5 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mulai Ujian Sekarang</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: QUIZ STEPPER */}
          {step === 'quiz' && currentQ && (
            <div className="space-y-5">
              {/* Progress Bar & Counter with Realtime Timer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-black uppercase">
                    Soal {currentIndex + 1} / {totalQuestions}
                  </span>

                  {/* Countdown Timer Pill */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000] transition-all ${
                      timeLeft <= 60
                        ? 'bg-rose-200 text-black animate-pulse'
                        : timeLeft <= 180
                        ? 'bg-amber-200 text-black'
                        : 'bg-white text-black'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  <span className="text-black font-black">
                    Benar: {correctAnswersCount}
                  </span>
                </div>
                <div className="w-full bg-white h-3.5 rounded-full border-2 border-black p-0.5 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="space-y-3 p-5 rounded-2xl bg-[#70D6FF]/20 border-2.5 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black text-white">
                    {currentQ.category}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-black leading-snug">
                  {currentQ.prompt}
                </h4>

                {currentQ.context && (
                  <p className="text-xs sm:text-sm text-black font-serif italic p-3 rounded-xl bg-white border-2 border-black leading-relaxed">
                    {currentQ.context}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = 'bg-white border-2 border-black text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]';

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-[#80ED99] border-2 border-black text-black shadow-[2px_2px_0px_#000] font-black';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-[#FF85C0] border-2 border-black text-black shadow-[2px_2px_0px_#000] font-black';
                    } else {
                      btnStyle = 'bg-slate-100 border-2 border-black/30 text-black/40 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-bold transition flex items-center justify-between gap-3 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswerSubmitted && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-black stroke-[3] shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-black stroke-[3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation */}
              {isAnswerSubmitted && currentQ.explanation && (
                <div
                  className={`p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm leading-relaxed ${
                    currentQ.options[selectedOption]?.isCorrect
                      ? 'bg-[#80ED99]/40 text-black font-bold'
                      : 'bg-[#FFD166]/50 text-black font-bold'
                  }`}
                >
                  <p className="font-black flex items-center gap-1.5 mb-1 uppercase tracking-tight text-black">
                    <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
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
                  className={`w-24 h-24 rounded-2xl text-black flex items-center justify-center mx-auto text-5xl border-3 border-black shadow-[4px_4px_0px_#000] ${
                    isPassed
                      ? 'bg-[#D4F63D] animate-pulse'
                      : 'bg-white'
                  }`}
                >
                  {isPassed ? '🏆' : '📖'}
                </div>
                {isPassed && (
                  <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-xl bg-[#80ED99] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]">
                    +150 XP
                  </span>
                )}
              </div>

              {isTimeUp && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-200 border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_#000]">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                  <span>Batas Waktu 10 Menit Berakhir • Ujian Dikirim Otomatis</span>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block">
                  Hasil Evaluasi Ujian Akhir
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                  {isPassed ? '🎉 SELAMAT! KAMU LULUS!' : 'Belum Lulus, Coba Lagi!'}
                </h2>
                <p className="text-sm font-black text-black/80">
                  Skor: <span className={isPassed ? 'text-emerald-700' : 'text-rose-700'}>{correctAnswersCount}</span> / {totalQuestions} Soal Benar ({percentScore}%)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-xs sm:text-sm text-black font-bold leading-relaxed max-w-md mx-auto text-left space-y-2">
                {isPassed ? (
                  <>
                    <p className="font-black text-black">
                      Luar biasa! Kamu telah membuktikan penguasaan materi di Level {levelCode}.
                    </p>
                    <p>
                      Status profilmu resmi naik tingkat, bonus <strong>+150 XP</strong> telah ditambahkan ke leaderboard, dan seluruh modul di level berikutnya telah terbuka!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-black text-rose-700">
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
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-black bg-white hover:bg-slate-100 text-black font-black text-xs sm:text-sm shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
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
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-black font-black text-xs sm:text-sm border-2.5 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer ${
                    isPassed
                      ? 'bg-[#D4F63D] hover:bg-[#c2e42f]'
                      : 'bg-[#FF85C0] hover:bg-[#ff70b3]'
                  }`}
                >
                  <span>{isPassed ? 'Buka Level Baru 🚀' : 'Kembali Membaca Modul'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (for quiz step navigation) */}
        {step === 'quiz' && (
          <div className="px-6 py-4 border-t-2 border-black bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-xs font-bold text-black/70">
              Pilih satu jawaban di atas untuk melihat pembahasan.
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswerSubmitted}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Selesai & Lihat Skor' : 'Soal Berikutnya'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
