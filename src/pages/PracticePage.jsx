import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import LalaAiRoleplayModal from '../components/ai/LalaAiRoleplayModal';
import { ttsService } from '../services/ttsService';
import VoiceSelectorModal from '../components/common/VoiceSelectorModal';

export default function PracticePage() {
  const { flashcards, userProgress, streak, weeklyXp, addXp } = useAppStore();
  const [isAiRoleplayOpen, setIsAiRoleplayOpen] = useState(false);

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
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Helper for text-to-speech audio via Kokoro AI
  const handleSpeak = (text, rate = 1.0) => {
    ttsService.speak(text, { speed: rate });
  };

  // Close any modal and stop audio
  const handleCloseModal = () => {
    ttsService.stop();
    setActiveModal(null);
  };

  // Lock body scroll when any practice modal is active
  useEffect(() => {
    if (activeModal && typeof document !== 'undefined') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeModal]);

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
      title: 'Dialog AI (Roleplay Lounge) ⚡',
      tagline: 'Percakapan Interaktif Nyata Bersama Lala AI',
      description: 'Latih kemampuan berbicara & mengobrol dalam situasi nyata (Kafe London, Wawancara Kerja, Hotel, dll.) dengan koreksi tata bahasa instan dan audio suara.',
      icon: MessageSquare,
      color: 'emerald',
      badge: 'Lala AI Cerdas • +30 XP',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold',
      actionText: 'Mulai Obrolan AI ➔',
      onClick: () => setIsAiRoleplayOpen(true),
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
      {/* 1. Header Banner - Neo-Brutalism */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FF85C0] text-black p-6 sm:p-8 border-3 border-black shadow-[6px_6px_0px_#000]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black uppercase">
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Arena Latihan • 6 Mode Interaktif Penuh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
              Pusat Pelatihan &amp; Pengasahan Skill
            </h1>
            <p className="text-xs sm:text-sm text-black/80 font-bold leading-relaxed">
              Ubah pengetahuan pasif menjadi kemampuan aktif. Pilih salah satu mode latihan di bawah untuk melatih ingatan kartu, kejelian detektif, telinga dikte, menulis, hingga simulasi dialog!
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowVoiceModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4F63D] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 hover:bg-white transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                <span>Pengaturan Suara AI Kokoro</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white rounded-2xl p-4 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-around gap-5 text-center shrink-0">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black/70">Streak</span>
              <p className="text-2xl font-black text-black flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500 fill-current" />
                {streak || 1} Hari
              </p>
            </div>
            <div className="w-0.5 h-10 bg-black/20" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black/70">XP Latihan</span>
              <p className="text-2xl font-black text-black flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5 text-amber-500 stroke-[2.5]" />
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
              className="bg-white rounded-3xl border-2.5 border-black p-5 sm:p-6 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] bg-[#FFD166] text-black">
                    {mode.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-black text-black group-hover:text-indigo-600 transition">
                    {mode.title}
                  </h2>
                  <p className="text-xs font-bold text-black/60 mt-0.5">
                    {mode.tagline}
                  </p>
                </div>

                <p className="text-xs text-black/80 font-medium leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t-2 border-black/15">
                {mode.actionUrl ? (
                  <Link
                    to={mode.actionUrl}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>{mode.actionText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                ) : (
                  <button
                    onClick={mode.onClick}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                  >
                    <span>{mode.actionText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE MODAL ENGINES (NEO-BRUTALISM THEMED) */}
      {/* ======================================================== */}

      {/* A. GRAMMAR DETECTIVE MODAL */}
      {activeModal === 'detective' &&
        detQuestions[detIndex] &&
        createPortal(
          <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in" onClick={handleCloseModal}>
            <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b-2.5 border-black pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#FFD166] border-2 border-black shadow-[2px_2px_0px_#000] text-black">
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                    Soal {detIndex + 1} / {detQuestions.length}
                  </span>
                  <h3 className="font-black text-black text-base uppercase">Grammar Detective 🕵️‍♂️</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <p className="text-xs font-bold text-black/80">
              Temukan 1 bagian kata di bawah yang <strong>merusak tata bahasa kalimat</strong>:
            </p>

            <div className="p-4 rounded-2xl bg-[#FFD166]/25 border-2 border-black shadow-[2px_2px_0px_#000] text-black font-black text-sm sm:text-base leading-relaxed">
              "{detQuestions[detIndex].sentence}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {detQuestions[detIndex].options.map((opt) => {
                const isCorrect = opt === detQuestions[detIndex].correct;
                let style = 'bg-white border-2 border-black text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]';

                if (detSubmitted) {
                  if (isCorrect) style = 'border-2 border-black bg-[#80ED99] text-black font-black shadow-[2px_2px_0px_#000]';
                  else if (detSelected === opt) style = 'border-2 border-black bg-[#FF85C0] text-black font-black shadow-[2px_2px_0px_#000]';
                  else style = 'border-2 border-black/30 text-black/40 opacity-60 bg-slate-100';
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
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition text-left cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${style}`}
                  >
                    "{opt}"
                  </button>
                );
              })}
            </div>

            {detSubmitted && (
              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs space-y-1.5 animate-fade-in">
                <span className="font-black text-black block text-sm">
                  {detSelected === detQuestions[detIndex].correct ? '🎉 Analisis Tepat (+15 XP)!' : '❌ Belum Tepat'}
                </span>
                <p className="text-black/80 font-medium leading-relaxed">
                  {detQuestions[detIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black text-black">Skor: {detScore} Benar</span>
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
                  className="px-4 py-2 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  {detIndex === detQuestions.length - 1 ? 'Selesai Tantangan' : 'Soal Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* B. BRIDGE BUILDER (CONJUNCTION) MODAL */}
      {activeModal === 'conjunction' &&
        bbQuestions[bbIndex] &&
        createPortal(
          <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in" onClick={handleCloseModal}>
            <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b-2.5 border-black pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#70D6FF] border-2 border-black shadow-[2px_2px_0px_#000] text-black">
                  <GitCommit className="w-4 h-4 stroke-[2.5]" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                    Tantangan {bbIndex + 1} / {bbQuestions.length}
                  </span>
                  <h3 className="font-black text-black text-base uppercase">Bridge Builder 🌉</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <p className="text-xs font-bold text-black/80">
              Pilih kata hubung (konektor) yang paling tepat untuk mengisi bagian rumpang:
            </p>

            <div className="p-4 rounded-2xl bg-[#70D6FF]/20 border-2 border-black shadow-[2px_2px_0px_#000] text-black font-black text-sm sm:text-base leading-relaxed">
              "{bbQuestions[bbIndex].context}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {bbQuestions[bbIndex].options.map((opt) => {
                const isCorrect = opt === bbQuestions[bbIndex].correct;
                let style = 'bg-white border-2 border-black text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]';

                if (bbSubmitted) {
                  if (isCorrect) style = 'border-2 border-black bg-[#80ED99] text-black font-black shadow-[2px_2px_0px_#000]';
                  else if (bbSelected === opt) style = 'border-2 border-black bg-[#FF85C0] text-black font-black shadow-[2px_2px_0px_#000]';
                  else style = 'border-2 border-black/30 text-black/40 opacity-60 bg-slate-100';
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
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition text-center cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {bbSubmitted && (
              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs space-y-1.5 animate-fade-in">
                <span className="font-black text-black block text-sm">
                  {bbSelected === bbQuestions[bbIndex].correct ? '🎉 Jembatan Logika Benar (+15 XP)!' : '❌ Belum Tepat'}
                </span>
                <p className="text-black/80 font-medium leading-relaxed">
                  {bbQuestions[bbIndex].explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <span className="text-xs font-black text-black">Skor: {bbScore} Benar</span>
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
                  className="px-4 py-2 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  {bbIndex === bbQuestions.length - 1 ? 'Selesai Tantangan' : 'Tantangan Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* C. DICTATION (EAR MASTER) MODAL */}
      {activeModal === 'dictation' &&
        dtQuestions[dtIndex] &&
        createPortal(
          <div role="dialog" className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in" onClick={handleCloseModal}>
            <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b-2.5 border-black pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#80ED99] border-2 border-black shadow-[2px_2px_0px_#000] text-black">
                  <Headphones className="w-4 h-4 stroke-[2.5]" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                    Dikte {dtIndex + 1} / {dtQuestions.length}
                  </span>
                  <h3 className="font-black text-black text-base uppercase">Ear Master (Dikte) 🎧</h3>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Audio Triggers */}
            <div className="p-5 rounded-2xl bg-[#D4F63D]/25 border-2 border-black shadow-[2px_2px_0px_#000] text-center space-y-3">
              <span className="text-xs text-black font-black block">
                Dengarkan audio penutur asli di bawah, lalu ketik yang kamu dengar:
              </span>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 1.0)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Putar Normal (1.0x)</span>
                </button>

                <button
                  onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 0.75)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  <span>🐢 Santai (0.75x)</span>
                </button>
              </div>

              <p className="text-[11px] text-black/70 font-bold">
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
                className="w-full p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-sm font-bold text-black focus:outline-hidden focus:bg-[#D4F63D]/10 transition"
              />
            </div>

            {/* Evaluation Results */}
            {dtEvaluated && (
              <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] space-y-2 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-black text-black">Hasil Evaluasi Dikte:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#80ED99] text-black border border-black font-black text-xs">
                    {dtAccuracy}% Akurat
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-black/60 block text-[10px] uppercase font-black">Kalimat Sasaran:</span>
                  <p className="font-black text-black text-sm">
                    "{dtQuestions[dtIndex].targetSentence}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t-2 border-black">
              <button
                onClick={() => handleSpeak(dtQuestions[dtIndex].targetSentence, 1.0)}
                className="text-xs text-black font-black hover:underline flex items-center gap-1"
              >
                <span>Putar Ulang</span>
                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
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
                  className="px-5 py-2.5 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer disabled:opacity-50"
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
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                >
                  {dtIndex === dtQuestions.length - 1 ? 'Selesai Sesi' : 'Dikte Berikutnya ➔'}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* D. ROLEPLAY LOUNGE MODAL */}
      {activeModal === 'roleplay' &&
        rpScenarios[rpScenarioIndex] &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden p-4 sm:p-6 space-y-4 flex flex-col max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2.5 border-black pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-lg">
                    {rpScenarios[rpScenarioIndex].avatar}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                      Simulasi Dialog Interaktif
                    </span>
                    <h3 className="font-black text-black text-base uppercase">{rpScenarios[rpScenarioIndex].title}</h3>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer">
                  <X className="w-4 h-4 stroke-[2.5]" />
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
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed border-2 border-black shadow-[2px_2px_0px_#000] ${
                        item.sender === 'user'
                          ? 'bg-[#B388FF] text-black font-bold'
                          : 'bg-[#F8FAFC] text-black font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span>{item.text}</span>
                        {item.sender === 'npc' && (
                          <button
                            onClick={() => handleSpeak(item.text)}
                            className="text-black hover:opacity-70 p-0.5 rounded shrink-0 cursor-pointer"
                            title="Dengar suara"
                          >
                            <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>

                    {item.feedback && (
                      <span className="text-[10px] text-black font-black bg-[#80ED99] border border-black px-2 py-0.5 rounded-md shadow-xs">
                        💡 {item.feedback}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Response Options */}
              {!rpCompleted ? (
                <div className="space-y-2 pt-2 border-t-2 border-black shrink-0">
                  <span className="text-[11px] font-black text-black block uppercase tracking-wider">Pilih respons balasan Anda:</span>
                  {rpScenarios[rpScenarioIndex].turns[rpTurnIndex]?.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        const newHistory = [
                          ...rpHistory,
                          { sender: 'user', text: opt.text, feedback: opt.feedback },
                        ];

                        if (opt.npcReply) {
                          newHistory.push({ sender: 'npc', text: opt.npcReply });
                        }

                        setRpHistory(newHistory);
                        addXp(15, 'Roleplay Dialogue');

                        if (rpTurnIndex < rpScenarios[rpScenarioIndex].turns.length - 1) {
                          setRpTurnIndex((t) => t + 1);
                        } else {
                          setRpCompleted(true);
                        }
                      }}
                      className="w-full p-3 rounded-2xl border-2 border-black bg-white hover:bg-[#D4F63D] text-left text-xs font-bold text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer leading-snug"
                    >
                      "{opt.text}"
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#80ED99] border-2 border-black shadow-[3px_3px_0px_#000] text-center space-y-2 animate-fade-in text-black shrink-0">
                  <span className="text-2xl">🏆</span>
                  <h4 className="font-black text-black text-sm uppercase">Skenario Percakapan Tuntas!</h4>
                  <p className="text-xs font-bold text-black/80">
                    Kamu telah menyelesaikan percakapan dengan lancar dan sopan. Bonus +25 XP telah ditambahkan!
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                  >
                    Selesai &amp; Keluar Lounge
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* E. SENTENCE BUILDER MODAL */}
      {activeModal === 'builder' &&
        sbChallenges[sbIndex] &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2.5 border-black pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#B388FF] border-2 border-black shadow-[2px_2px_0px_#000] text-black">
                    <PenTool className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                      Level {sbIndex + 1} / {sbChallenges.length}
                    </span>
                    <h3 className="font-black text-black text-base uppercase">Sentence Builder ✍️</h3>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer">
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Target Meaning */}
              <div className="p-4 rounded-2xl bg-[#B388FF]/20 border-2 border-black shadow-[2px_2px_0px_#000] space-y-1 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                  Susun ke Kalimat Bahasa Inggris:
                </span>
                <p className="font-black text-black text-sm sm:text-base leading-snug">
                  "{sbChallenges[sbIndex].indonesianMeaning}"
                </p>
              </div>

              {/* Placement Workspace */}
              <div className="space-y-1.5 shrink-0">
                <span className="text-[11px] font-black text-black uppercase">Area Susunan Kalimat (Ketuk balok untuk melepas):</span>
                <div className="min-h-16 p-3 rounded-2xl border-2 border-dashed border-black bg-[#F8FAFC] flex flex-wrap gap-2 items-center">
                  {sbPlacedTokens.length === 0 ? (
                    <span className="text-xs text-black/50 font-bold italic">Ketuk balok kata di bawah untuk menyusun kalimat...</span>
                  ) : (
                    sbPlacedTokens.map((token, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => {
                          if (sbSubmitted) return;
                          setSbPlacedTokens(sbPlacedTokens.filter((_, i) => i !== tIdx));
                          setSbAvailableTokens([...sbAvailableTokens, token]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#D4F63D] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 hover:bg-rose-300 transition cursor-pointer"
                      >
                        {token}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Available Tokens Pool */}
              <div className="space-y-1.5 shrink-0">
                <span className="text-[11px] font-black text-black uppercase">Pilihan Balok Kata:</span>
                <div className="flex flex-wrap gap-2 p-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_#000] rounded-2xl min-h-12 items-center">
                  {sbAvailableTokens.map((token, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => {
                        if (sbSubmitted) return;
                        setSbPlacedTokens([...sbPlacedTokens, token]);
                        setSbAvailableTokens(sbAvailableTokens.filter((_, i) => i !== aIdx));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 hover:bg-[#70D6FF] transition cursor-pointer"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Feedback */}
              {sbSubmitted && (
                <div className={`p-4 rounded-2xl text-xs space-y-1.5 animate-fade-in border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 ${sbIsCorrect ? 'bg-[#80ED99] text-black font-bold' : 'bg-[#FF85C0] text-black font-bold'}`}>
                  <span className="font-black block text-sm">
                    {sbIsCorrect ? '🎉 Susunan Sempurna (+20 XP)!' : '❌ Susunan Belum Pas'}
                  </span>
                  <p className="leading-relaxed text-black/80 font-medium">
                    {sbChallenges[sbIndex].explanation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t-2 border-black shrink-0">
                <button
                  onClick={() => {
                    setSbPlacedTokens([]);
                    setSbAvailableTokens([...sbChallenges[sbIndex].scrambled]);
                    setSbSubmitted(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-black text-black hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
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
                    className="px-5 py-2.5 rounded-xl bg-[#D4F63D] hover:bg-[#c2e42f] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition disabled:opacity-40 cursor-pointer"
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
                    className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
                  >
                    {sbIndex === sbChallenges.length - 1 ? 'Selesai Tantangan' : 'Level Berikutnya ➔'}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Lala AI Interactive Roleplay Modal */}
      <LalaAiRoleplayModal
        isOpen={isAiRoleplayOpen}
        onClose={() => setIsAiRoleplayOpen(false)}
      />

      {/* Kokoro AI Voice Selector Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
