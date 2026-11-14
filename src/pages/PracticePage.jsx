import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Layers,
  Search,
  Headphones,
  MessageSquare,
  PenTool,
  GitCommit,
  ArrowRight,
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  X,
  Sparkles,
  HelpCircle,
  Play,
  Check,
} from 'lucide-react';
import {
  GRAMMAR_DETECTIVE_QUESTIONS,
  BRIDGE_BUILDER_QUESTIONS,
  DICTATION_CHALLENGES,
  ROLEPLAY_SCENARIOS,
  SENTENCE_BUILDER_CHALLENGES,
} from '../services/practiceModesData';
import { useAppStore } from '../store/useAppStore';

export default function PracticePage() {
  const { flashcards, userProgress, streak, weeklyXp, addXp } = useAppStore();

  // Active Mode Modal State: null | 'detective' | 'conjunction' | 'dictation' | 'roleplay' | 'builder'
  const [activeModal, setActiveModal] = useState(null);

  // Helper shuffle algorithm for questions and options
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ==========================================
  // 1. GRAMMAR DETECTIVE STATE (5 Randomized Questions)
  // ==========================================
  const [detQuestions, setDetQuestions] = useState(() =>
    shuffleArray(GRAMMAR_DETECTIVE_QUESTIONS)
      .slice(0, 5)
      .map((q) => ({ ...q, options: shuffleArray(q.options) }))
  );
  const [detIndex, setDetIndex] = useState(0);
  const [detSelected, setDetSelected] = useState(null);
  const [detSubmitted, setDetSubmitted] = useState(false);
  const [detScore, setDetScore] = useState(0);

  // ==========================================
  // 2. BRIDGE BUILDER STATE (5 Randomized Questions)
  // ==========================================
  const [bbQuestions, setBbQuestions] = useState(() =>
    shuffleArray(BRIDGE_BUILDER_QUESTIONS)
      .slice(0, 5)
      .map((q) => ({ ...q, options: shuffleArray(q.options) }))
  );
  const [bbIndex, setBbIndex] = useState(0);
  const [bbSelected, setBbSelected] = useState(null);
  const [bbSubmitted, setBbSubmitted] = useState(false);
  const [bbScore, setBbScore] = useState(0);

  // ==========================================
  // 3. DICTATION (EAR MASTER) STATE (5 Randomized Challenges)
  // ==========================================
  const [dtQuestions, setDtQuestions] = useState(() =>
    shuffleArray(DICTATION_CHALLENGES).slice(0, 5)
  );
  const [dtIndex, setDtIndex] = useState(0);
  const [dtInput, setDtInput] = useState('');
  const [dtEvaluated, setDtEvaluated] = useState(false);
  const [dtAccuracy, setDtAccuracy] = useState(0);

  // ==========================================
  // 4. ROLEPLAY LOUNGE STATE (Randomized Scenarios)
  // ==========================================
  const [rpScenarios, setRpScenarios] = useState(() =>
    shuffleArray(ROLEPLAY_SCENARIOS).map((sc) => ({
      ...sc,
      turns: sc.turns.map((t) => ({ ...t, options: shuffleArray(t.options) })),
    }))
  );
  const [rpScenarioIndex, setRpScenarioIndex] = useState(0);
  const [rpTurnIndex, setRpTurnIndex] = useState(0);
  const [rpHistory, setRpHistory] = useState([]); // [{ sender: 'npc'|'user', text, feedback }]
  const [rpCompleted, setRpCompleted] = useState(false);

  // ==========================================
  // 5. SENTENCE BUILDER STATE (5 Randomized Challenges)
  // ==========================================
  const [sbChallenges, setSbChallenges] = useState(() =>
    shuffleArray(SENTENCE_BUILDER_CHALLENGES)
      .slice(0, 5)
      .map((c) => ({ ...c, scrambled: shuffleArray(c.scrambled) }))
  );
  const [sbIndex, setSbIndex] = useState(0);
  const [sbPlacedTokens, setSbPlacedTokens] = useState([]);
  const [sbAvailableTokens, setSbAvailableTokens] = useState([]);
  const [sbSubmitted, setSbSubmitted] = useState(false);
  const [sbIsCorrect, setSbIsCorrect] = useState(false);

  // Helper for text-to-speech audio
  const handleSpeak = (text, rate = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Close any modal and stop audio
  const handleCloseModal = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveModal(null);
  };

  // Open & Initialize Modes with Fresh 5 Shuffled Questions
  const openDetective = () => {
    const randomized = shuffleArray(GRAMMAR_DETECTIVE_QUESTIONS)
      .slice(0, 5)
      .map((q) => ({ ...q, options: shuffleArray(q.options) }));
    setDetQuestions(randomized);
    setDetIndex(0);
    setDetSelected(null);
    setDetSubmitted(false);
    setDetScore(0);
    setActiveModal('detective');
  };

  const openBridgeBuilder = () => {
    const randomized = shuffleArray(BRIDGE_BUILDER_QUESTIONS)
      .slice(0, 5)
      .map((q) => ({ ...q, options: shuffleArray(q.options) }));
    setBbQuestions(randomized);
    setBbIndex(0);
    setBbSelected(null);
    setBbSubmitted(false);
    setBbScore(0);
    setActiveModal('conjunction');
  };

  const openDictation = () => {
    const randomized = shuffleArray(DICTATION_CHALLENGES).slice(0, 5);
    setDtQuestions(randomized);
    setDtIndex(0);
    setDtInput('');
    setDtEvaluated(false);
    setDtAccuracy(0);
    setActiveModal('dictation');
  };

  const openRoleplay = () => {
    const randomized = shuffleArray(ROLEPLAY_SCENARIOS).map((sc) => ({
      ...sc,
      turns: sc.turns.map((t) => ({ ...t, options: shuffleArray(t.options) })),
    }));
    setRpScenarios(randomized);
    setRpScenarioIndex(0);
    setRpTurnIndex(0);
    setRpCompleted(false);
    const initialScenario = randomized[0];
    setRpHistory([
      { sender: 'npc', text: initialScenario.turns[0].npcLine },
    ]);
    setActiveModal('roleplay');
  };

  const openSentenceBuilder = () => {
    const randomized = shuffleArray(SENTENCE_BUILDER_CHALLENGES)
      .slice(0, 5)
      .map((c) => ({ ...c, scrambled: shuffleArray(c.scrambled) }));
    setSbChallenges(randomized);
    setSbIndex(0);
    setSbSubmitted(false);
    setSbIsCorrect(false);
    setSbPlacedTokens([]);
    setSbAvailableTokens([...randomized[0].scrambled]);
    setActiveModal('builder');
  };

  // Mode Cards Configuration
  const practiceModes = [
    {
      id: 'flashcards',
      title: 'Kartu Hafalan (Spaced Repetition)',
      tagline: 'Active Recall & Voice Shadowing',
      description: 'Latih ingatan jangka panjang kosakata & tata bahasa dengan algoritma SM-2 teruji serta penilaian pelafalan suara mic real-time.',
      icon: Layers,
      color: 'indigo',
      badge: 'Mode Utama • Siap Dimainkan',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionText: 'Mulai Latihan Flashcard',
      actionUrl: '/flashcards/all',
    },
    {
      id: 'detective',
      title: 'Kesalahan Umum (Grammar Detective)',
      tagline: 'Error Spotting & Hunting',
      description: 'Temukan 1 kata perusak tata bahasa dalam kalimat. Latih kejelian dari jebakan preposisi hingga inversi!',
      icon: Search,
      color: 'amber',
      badge: '5 Soal Acak • +15 XP',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      actionText: 'Mainkan Game Detektif',
      onClick: openDetective,
    },
    {
      id: 'conjunction',
      title: 'Konjungsi (Bridge Builder)',
      tagline: 'Sentence Connectors & Transitions',
      description: 'Latih menyambungkan dua ide/klausa dengan konektor logis (However, Therefore, Although, Despite, Furthermore).',
      icon: GitCommit,
      color: 'teal',
      badge: '5 Soal Acak • +15 XP',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      actionText: 'Tantangan Jembatan Logika',
      onClick: openBridgeBuilder,
    },
    {
      id: 'dictation',
      title: 'Dikte (Ear Master)',
      tagline: 'Listening & Accurate Typing Engine',
      description: 'Dengarkan rekaman penutur asli dalam tempo normal atau santai, lalu ketik ejaannya dengan tingkat akurasi presisi.',
      icon: Headphones,
      color: 'sky',
      badge: '5 Audio Acak • +20 XP',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      actionText: 'Mulai Latihan Dikte',
      onClick: openDictation,
    },
    {
      id: 'roleplay',
      title: 'Dialog (Roleplay Lounge)',
      tagline: 'Real-Life Situational Chat Simulation',
      description: 'Simulasi percakapan interaktif seperti memesan kopi di London atau wawancara kerja profesional dengan feedback kesantunan.',
      icon: MessageSquare,
      color: 'emerald',
      badge: 'Simulasi Chat • +25 XP',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'Masuk Lounge Dialog',
      onClick: openRoleplay,
    },
    {
      id: 'builder',
      title: 'Latihan Menulis (Sentence Builder)',
      tagline: 'Word Blocks to Cohesive Sentences',
      description: 'Susun balok-balok kata acak menjadi kalimat bahasa Inggris formal yang terstruktur rapi sesuai makna bahasa Indonesianya.',
      icon: PenTool,
      color: 'purple',
      badge: '5 Soal Acak • +20 XP',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      actionText: 'Rakit Kalimat Sekarang',
      onClick: openSentenceBuilder,
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-yellow-200" />
              <span>Arena Latihan • 6 Mode Interaktif Penuh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Pelatihan &amp; Pengasahan Skill
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Ubah pengetahuan pasif menjadi kemampuan aktif. Pilih salah satu mode latihan di bawah untuk melatih ingatan kartu, kejelian detektif, telinga dikte, menulis, hingga simulasi dialog!
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-around gap-5 text-center shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Streak</span>
              <p className="text-2xl font-extrabold text-white flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-300 fill-current" />
                {streak || 1} Hari
              </p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">XP Latihan</span>
              <p className="text-2xl font-extrabold text-amber-200 flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5 text-amber-300" />
                {weeklyXp || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid 6 Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {practiceModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-50 transition-all">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${mode.badgeClass}`}>
                    {mode.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                    {mode.title}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {mode.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                {mode.actionUrl ? (
                  <Link
                    to={mode.actionUrl}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>{mode.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={mode.onClick}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>{mode.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE MODAL ENGINES (TAHAP 3 FULL IMPLEMENTATION) */}
      {/* ======================================================== */}

      {/* A. GRAMMAR DETECTIVE MODAL */}
      {activeModal === 'detective' && detQuestions[detIndex] && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Search className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-700">Soal {detIndex + 1} dari {detQuestions.length}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Grammar Detective 🕵️‍♂️</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Temukan 1 bagian kata di bawah yang <strong>merusak tata bahasa kalimat</strong>:
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
              "{detQuestions[detIndex].sentence}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {detQuestions[detIndex].options.map((opt) => {
                const isCorrect = opt === detQuestions[detIndex].correct;
                let style = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800';

                if (detSubmitted) {
                  if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  else if (detSelected === opt) style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                  else style = 'border-slate-200 text-slate-400 opacity-60';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (detSubmitted) return;
                      setDetSelected(opt);
                      setDetSubmitted(true);
                      if (isCorrect) {
                        setDetScore((s) => s + 1);
                        addXp(15, 'Grammar Detective');
                      }
                    }}
                    disabled={detSubmitted}
                    className={`p-3 rounded-2xl border text-xs font-bold transition text-left cursor-pointer ${style}`}
                  >
                    "{opt}"
                  </button>
                );
              })}
            </div>

            {detSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fade-in">
                <span className="font-bold text-slate-800">
                  {detSelected === detQuestions[detIndex].correct ? '🎉 Analisis Tepat (+15 XP)!' : '❌ Belum Tepat'}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {detQuestions[detIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">Skor: {detScore} Benar</span>
              {detSubmitted && (
                <button
                  onClick={() => {
                    if (detIndex < detQuestions.length - 1) {
                      setDetIndex((i) => i + 1);
                      setDetSelected(null);
                      setDetSubmitted(false);
                    } else {
                      handleCloseModal();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer"
                >
                  {detIndex === detQuestions.length - 1 ? 'Selesai Tantangan' : 'Soal Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* B. BRIDGE BUILDER (CONJUNCTION) MODAL */}
      {activeModal === 'conjunction' && bbQuestions[bbIndex] && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <GitCommit className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-teal-700">Tantangan {bbIndex + 1} dari {bbQuestions.length}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Bridge Builder 🌉</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih kata hubung (konektor) yang paling tepat untuk mengisi bagian rumpang:
            </p>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
              "{bbQuestions[bbIndex].context}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {bbQuestions[bbIndex].options.map((opt) => {
                const isCorrect = opt === bbQuestions[bbIndex].correct;
                let style = 'border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-800';

                if (bbSubmitted) {
                  if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  else if (bbSelected === opt) style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                  else style = 'border-slate-200 text-slate-400 opacity-60';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (bbSubmitted) return;
                      setBbSelected(opt);
                      setBbSubmitted(true);
                      if (isCorrect) {
                        setBbScore((s) => s + 1);
                        addXp(15, 'Bridge Builder');
                      }
                    }}
                    disabled={bbSubmitted}
                    className={`p-3 rounded-2xl border text-xs font-bold transition text-center cursor-pointer ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {bbSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-fade-in">
                <span className="font-bold text-slate-800">
                  {bbSelected === bbQuestions[bbIndex].correct ? '🎉 Jembatan Logika Benar (+15 XP)!' : '❌ Belum Tepat'}
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {bbQuestions[bbIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">Skor: {bbScore} Benar</span>
              {bbSubmitted && (
                <button
                  onClick={() => {
                    if (bbIndex < bbQuestions.length - 1) {
                      setBbIndex((i) => i + 1);
                      setBbSelected(null);
                      setBbSubmitted(false);
                    } else {
                      handleCloseModal();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  {bbIndex === bbQuestions.length - 1 ? 'Selesai Tantangan' : 'Tantangan Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C. DICTATION (EAR MASTER) MODAL */}
      {activeModal === 'dictation' && dtQuestions[dtIndex] && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Headphones className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-sky-700">Dikte {dtIndex + 1} dari {dtQuestions.length}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Ear Master (Dikte) 🎧</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Triggers */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-3">
              <span className="text-xs text-sky-800 font-semibold block">
                Dengarkan audio penutur asli di bawah, lalu ketik yang kamu dengar:
              </span>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 1.0)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Putar Normal (1.0x)</span>
                </button>

                <button
                  onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 0.75)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 active:scale-95 transition cursor-pointer"
                >
                  <span>🐢 Santai (0.75x)</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Petunjuk konteks: <em>{dtQuestions[dtIndex].hint}</em>
              </p>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <textarea
                value={dtInput}
                onChange={(e) => setDtInput(e.target.value)}
                disabled={dtEvaluated}
                placeholder="Ketik kalimat bahasa Inggris yang kamu dengar di sini..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            {/* Evaluation Results */}
            {dtEvaluated && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Hasil Evaluasi Dikte:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs">
                    {dtAccuracy}% Akurat
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kalimat Sasaran:</span>
                  <p className="font-bold text-slate-900 text-sm">
                    "{dtQuestions[dtIndex].targetSentence}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 1.0)}
                className="text-xs text-sky-700 font-bold hover:underline"
              >
                Putar Ulang 🔊
              </button>

              {!dtEvaluated ? (
                <button
                  onClick={() => {
                    const cleanTarget = dtQuestions[dtIndex].targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '');
                    const cleanInput = dtInput.toLowerCase().replace(/[^a-z0-9\s]/g, '');
                    const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
                    const inputWords = cleanInput.split(/\s+/).filter(Boolean);

                    let match = 0;
                    targetWords.forEach((tw, idx) => {
                      if (inputWords[idx] === tw) match++;
                    });

                    const acc = Math.round((match / targetWords.length) * 100);
                    setDtAccuracy(acc);
                    setDtEvaluated(true);
                    if (acc >= 70) {
                      addXp(20, 'Ear Master Dikte');
                    }
                  }}
                  disabled={!dtInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-40 cursor-pointer"
                >
                  Periksa Ejaan ➔
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (dtIndex < dtQuestions.length - 1) {
                      setDtIndex((i) => i + 1);
                      setDtInput('');
                      setDtEvaluated(false);
                    } else {
                      handleCloseModal();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {dtIndex === dtQuestions.length - 1 ? 'Selesai Sesi' : 'Dikte Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* D. ROLEPLAY LOUNGE MODAL */}
      {activeModal === 'roleplay' && rpScenarios[rpScenarioIndex] && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 text-lg">
                  {rpScenarios[rpScenarioIndex].avatar}
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700">Simulasi Dialog Interaktif</span>
                  <h3 className="font-extrabold text-slate-900 text-base">{rpScenarios[rpScenarioIndex].title}</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Transcript Area */}
            <div className="space-y-3 overflow-y-auto flex-1 p-2">
              {rpHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                      item.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span>{item.text}</span>
                      {item.sender === 'npc' && (
                        <button
                          onClick={() => handleSpeak(item.text)}
                          className="text-slate-400 hover:text-indigo-600 p-0.5 rounded shrink-0"
                          title="Dengar suara"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.feedback && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      💡 {item.feedback}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Response Options */}
            {!rpCompleted ? (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block">Pilih respons balasan Anda:</span>
                {rpScenarios[rpScenarioIndex].turns[rpTurnIndex]?.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => {
                      // 1. Add user message
                      const newHistory = [
                        ...rpHistory,
                        { sender: 'user', text: opt.text, feedback: opt.feedback },
                      ];

                      // 2. Add NPC reply
                      if (opt.npcReply) {
                        newHistory.push({ sender: 'npc', text: opt.npcReply });
                      }

                      setRpHistory(newHistory);
                      addXp(15, 'Roleplay Dialogue');

                      // 3. Check if more turns exist
                      if (rpTurnIndex < rpScenarios[rpScenarioIndex].turns.length - 1) {
                        setRpTurnIndex((t) => t + 1);
                      } else {
                        setRpCompleted(true);
                      }
                    }}
                    className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left text-xs font-semibold text-slate-800 transition active:scale-95 cursor-pointer leading-snug"
                  >
                    "{opt.text}"
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in">
                <span className="text-xl">🏆</span>
                <h4 className="font-extrabold text-emerald-900 text-sm">Skenario Percakapan Tuntas!</h4>
                <p className="text-xs text-emerald-700">
                  Kamu telah menyelesaikan percakapan dengan lancar dan sopan. Bonus +25 XP telah ditambahkan!
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Selesai &amp; Keluar Lounge
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* E. SENTENCE BUILDER MODAL */}
      {activeModal === 'builder' && sbChallenges[sbIndex] && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <PenTool className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-purple-700">Level {sbIndex + 1} dari {sbChallenges.length}</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Sentence Builder ✍️</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Meaning */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                Susun ke Kalimat Bahasa Inggris:
              </span>
              <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                "{sbChallenges[sbIndex].indonesianMeaning}"
              </p>
            </div>

            {/* Placement Workspace */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Area Susunan Kalimat (Ketuk balok untuk melepas):</span>
              <div className="min-h-16 p-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap gap-2 items-center">
                {sbPlacedTokens.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Ketuk balok kata di bawah untuk menyusun kalimat...</span>
                ) : (
                  sbPlacedTokens.map((token, tIdx) => (
                    <button
                      key={tIdx}
                      onClick={() => {
                        if (sbSubmitted) return;
                        // Remove from placed, return to available
                        setSbPlacedTokens(sbPlacedTokens.filter((_, i) => i !== tIdx));
                        setSbAvailableTokens([...sbAvailableTokens, token]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs hover:bg-rose-600 transition cursor-pointer"
                    >
                      {token}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Available Tokens Pool */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Pilihan Balok Kata:</span>
              <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-2xl min-h-12 items-center">
                {sbAvailableTokens.map((token, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => {
                      if (sbSubmitted) return;
                      setSbPlacedTokens([...sbPlacedTokens, token]);
                      setSbAvailableTokens(sbAvailableTokens.filter((_, i) => i !== aIdx));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 font-bold text-xs shadow-2xs hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Feedback */}
            {sbSubmitted && (
              <div className={`p-4 rounded-2xl text-xs space-y-1.5 animate-fade-in ${sbIsCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                <span className="font-extrabold">
                  {sbIsCorrect ? '🎉 Susunan Sempurna (+20 XP)!' : '❌ Susunan Belum Pas'}
                </span>
                <p className="leading-relaxed text-slate-600">
                  {sbChallenges[sbIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSbPlacedTokens([]);
                  setSbAvailableTokens([...sbChallenges[sbIndex].scrambled]);
                  setSbSubmitted(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Susunan</span>
              </button>

              {!sbSubmitted ? (
                <button
                  onClick={() => {
                    const currentSentence = sbPlacedTokens.join(' ').trim();
                    const targetSentence = sbChallenges[sbIndex].targetTokens.join(' ').trim();
                    const isCorrect = currentSentence.toLowerCase() === targetSentence.toLowerCase();

                    setSbIsCorrect(isCorrect);
                    setSbSubmitted(true);
                    if (isCorrect) {
                      addXp(20, 'Sentence Builder');
                    }
                  }}
                  disabled={sbPlacedTokens.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-40 cursor-pointer"
                >
                  Periksa Susunan ➔
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (sbIndex < sbChallenges.length - 1) {
                      const next = sbIndex + 1;
                      setSbIndex(next);
                      setSbPlacedTokens([]);
                      setSbAvailableTokens([...sbChallenges[next].scrambled]);
                      setSbSubmitted(false);
                      setSbIsCorrect(false);
                    } else {
                      handleCloseModal();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {sbIndex === sbChallenges.length - 1 ? 'Selesai Tantangan' : 'Level Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
