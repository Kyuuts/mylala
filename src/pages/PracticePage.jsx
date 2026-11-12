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
  HelpCircle,
  X,
  Volume2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function PracticePage() {
  const { flashcards, userProgress, streak, weeklyXp, addXp } = useAppStore();
  const [activeModal, setActiveModal] = useState(null); // 'detective' | 'conjunction' | 'dictation' | 'sentence' | 'dialog' | null
  const [modalFeedback, setModalFeedback] = useState(null);

  // Calculate cards due
  const totalCards = flashcards?.length || 0;
  const reviewedCount = Object.keys(userProgress || {}).length;

  // Interactive Quick Game States
  // 1. Grammar Detective sample
  const detectiveQuestion = {
    sentence: 'Although she was tired, but she finished the entire assignment on time.',
    options: ['Although', 'was tired', 'but', 'finished'],
    correct: 'but',
    explanation: 'Dalam bahasa Inggris, jangan pasangkan "Although" dengan "but" secara bersamaan (Double Conjunction Error).',
  };

  // 2. Bridge Builder (Conjunction) sample
  const bridgeQuestion = {
    context: 'The economic forecast looked grim. ____, tech companies reported record-breaking quarterly profits.',
    options: ['However', 'Because', 'Therefore', 'Although'],
    correct: 'However',
    explanation: 'Kalimat menunjukkan kontras antar dua kalimat terpisah, sehingga "However" dengan koma adalah konektor yang tepat.',
  };

  const handleDetectiveSubmit = (selected) => {
    if (selected === detectiveQuestion.correct) {
      addXp(15, 'Grammar Detective Champion');
      setModalFeedback({
        isCorrect: true,
        message: 'Tepat sekali! 🎉 Jangan gunakan "Although" dan "but" sekaligus dalam satu kalimat.',
      });
    } else {
      setModalFeedback({
        isCorrect: false,
        message: 'Kurang tepat. Perhatikan penggunaan kata hubung ganda (double conjunction).',
      });
    }
  };

  const handleBridgeSubmit = (selected) => {
    if (selected === bridgeQuestion.correct) {
      addXp(15, 'Bridge Builder Champion');
      setModalFeedback({
        isCorrect: true,
        message: 'Hebat! 🎉 "However" menghubungkan dua kalimat kontras secara logis.',
      });
    } else {
      setModalFeedback({
        isCorrect: false,
        message: 'Belum tepat. Coba perhatikan hubungan pertentangan antar kedua kalimat.',
      });
    }
  };

  const practiceModes = [
    {
      id: 'flashcards',
      title: 'Kartu Hafalan (Spaced Repetition)',
      tagline: 'Active Recall & Voice Shadowing',
      description: 'Latih ingatan jangka panjang kosakata & pola tata bahasa dengan algoritma SM-2 teruji serta penilaian pelafalan suara.',
      icon: Layers,
      color: 'indigo',
      badge: 'Utama • Siap Dimainkan',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actionText: 'Mulai Latihan Flashcard',
      actionUrl: '/flashcards/all',
      isLive: true,
    },
    {
      id: 'detective',
      title: 'Kesalahan Umum (Grammar Detective)',
      tagline: 'Error Spotting & Hunting',
      description: 'Asah kejelianmu menemukan 1 kata jebakan yang sering salah diucapkan atau ditulis pembelajar.',
      icon: Search,
      color: 'amber',
      badge: 'Game Cepat (+15 XP)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      actionText: 'Mainkan Game Detektif',
      onClick: () => {
        setModalFeedback(null);
        setActiveModal('detective');
      },
      isLive: true,
    },
    {
      id: 'conjunction',
      title: 'Konjungsi (Bridge Builder)',
      tagline: 'Sentence Connectors & Transitions',
      description: 'Latih kemampuan menyambungkan ide dan klausa agar bahasa Inggrismu mengalir mulus tanpa terputus.',
      icon: GitCommit,
      color: 'teal',
      badge: 'Game Cepat (+15 XP)',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      actionText: 'Tantangan Jembatan Logika',
      onClick: () => {
        setModalFeedback(null);
        setActiveModal('conjunction');
      },
      isLive: true,
    },
    {
      id: 'dictation',
      title: 'Dikte (Ear Master)',
      tagline: 'Listening & Accurate Typing',
      description: 'Dengarkan rekaman penutur asli dalam tempo natural, lalu ketik ejaan kalimatnya tanpa typo.',
      icon: Headphones,
      color: 'sky',
      badge: 'Fase 3 • Early Preview',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      actionText: 'Coba Mode Dikte',
      onClick: () => {
        setModalFeedback(null);
        setActiveModal('dictation');
      },
      isLive: true,
    },
    {
      id: 'dialog',
      title: 'Dialog (Roleplay Lounge)',
      tagline: 'Real-Life Situational Chat',
      description: 'Simulasi percakapan interaktif seperti berkirim pesan dengan penutur asli untuk melatih respons spontan.',
      icon: MessageSquare,
      color: 'emerald',
      badge: 'Fase 3 • Early Preview',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'Masuk Lounge Dialog',
      onClick: () => {
        setModalFeedback(null);
        setActiveModal('dialog');
      },
      isLive: true,
    },
    {
      id: 'sentence',
      title: 'Latihan Menulis (Sentence Builder)',
      tagline: 'Word Blocks to Cohesive Sentences',
      description: 'Susun balok-balok frasa acak menjadi kalimat bahasa Inggris formal dan terstruktur dengan benar.',
      icon: PenTool,
      color: 'purple',
      badge: 'Fase 3 • Early Preview',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      actionText: 'Rakit Kalimat Sekarang',
      onClick: () => {
        setModalFeedback(null);
        setActiveModal('sentence');
      },
      isLive: true,
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* 1. Arena Header & Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-yellow-200" />
              <span>Arena Latihan • 6 Mode Interaktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Pelatihan & Pengasahan Skill
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Ubah pengetahuan pasif menjadi kemampuan aktif. Pilih mode latihan di bawah untuk melatih memori, tata bahasa, kejelian telinga, hingga menulis.
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

      {/* 3. Interactive Modals for Quick Practice Games */}
      {/* A. Grammar Detective Modal */}
      {activeModal === 'detective' && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
                  <Search className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900">Grammar Detective 🕵️‍♂️</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Temukan 1 kata atau bagian kalimat di bawah yang <strong>merusak tata bahasa</strong>:
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-900 font-medium text-sm leading-relaxed">
              "{detectiveQuestion.sentence}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {detectiveQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleDetectiveSubmit(opt)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 text-xs font-bold transition active:scale-95"
                >
                  "{opt}"
                </button>
              ))}
            </div>

            {modalFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${modalFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {modalFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <div>
                  <p className="font-bold">{modalFeedback.message}</p>
                  <p className="text-[11px] mt-1 text-slate-600">{detectiveQuestion.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* B. Bridge Builder Modal */}
      {activeModal === 'conjunction' && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-teal-100 text-teal-700">
                  <GitCommit className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900">Bridge Builder 🌉</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih kata sambung yang paling tepat untuk mengisi bagian rumpang:
            </p>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-slate-900 font-medium text-sm leading-relaxed">
              "{bridgeQuestion.context}"
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {bridgeQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleBridgeSubmit(opt)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-800 text-xs font-bold transition active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>

            {modalFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${modalFeedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {modalFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <div>
                  <p className="font-bold">{modalFeedback.message}</p>
                  <p className="text-[11px] mt-1 text-slate-600">{bridgeQuestion.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* C. Preview Info Modal for Dictation, Dialog, Sentence Builder */}
      {(activeModal === 'dictation' || activeModal === 'dialog' || activeModal === 'sentence') && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">
              {activeModal === 'dictation' && 'Dikte (Ear Master)'}
              {activeModal === 'dialog' && 'Dialog (Roleplay Lounge)'}
              {activeModal === 'sentence' && 'Latihan Menulis (Sentence Builder)'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fitur interaktif ini merupakan bagian dari roadmap <strong>Tahap 3 (Arena Latihan Mendalam)</strong>. Fondasi audio speech & data schema telah siap!
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
              >
                Kembali ke Arena Latihan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
