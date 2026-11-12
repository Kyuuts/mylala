import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Tag,
  Sparkles,
  Check,
  BookmarkPlus,
  ArrowRight,
  X,
  Volume2,
  Play,
  Pause,
  Square,
  FastForward,
} from 'lucide-react';
import { GRADED_ARTICLES } from '../services/readingArticlesData';
import { CEFR_LEVELS } from '../utils/moduleLevel';
import { useAppStore } from '../store/useAppStore';

export default function ReadingPage() {
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState(null);
  const [savedVocab, setSavedVocab] = useState({});
  const { addFlashcard, syncNotification } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeArticleId } = useParams();
  const navigate = useNavigate();

  // Audio Speech States
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0); // 0.85 | 1.0 | 1.15
  const isPlayingAllRef = useRef(false);

  // Auto-open specific article if passed via query param ?article=... or route /reading/:id
  useEffect(() => {
    const targetId = routeArticleId || searchParams.get('article');
    if (targetId) {
      const found = GRADED_ARTICLES.find((a) => a.id === targetId);
      if (found) {
        setActiveArticle(found);
        setSelectedLevel(found.cefr_level);
      }
    }
  }, [routeArticleId, searchParams]);

  // Sync ref with state
  useEffect(() => {
    isPlayingAllRef.current = isPlayingAll;
  }, [isPlayingAll]);

  // Clean up audio when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeArticle]);

  const filteredArticles = selectedLevel === 'ALL'
    ? GRADED_ARTICLES
    : GRADED_ARTICLES.filter((a) => a.cefr_level === selectedLevel);

  const handleSaveVocab = (vocabItem, articleTitle) => {
    addFlashcard({
      id: `card-user-${Date.now()}`,
      module_id: 'mod-starter-conversation',
      front_text: `Arti kosakata: "${vocabItem.word}"`,
      back_text: vocabItem.meaning,
      example_sentence: vocabItem.example,
      source: `Artikel: ${articleTitle}`,
    });

    setSavedVocab((prev) => ({ ...prev, [vocabItem.word]: true }));
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveParagraphIndex(null);
    setIsPlayingAll(false);
    isPlayingAllRef.current = false;
  };

  const handleSpeakWord = (text) => {
    stopAudio();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakParagraph = (text, index, onComplete) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    setActiveParagraphIndex(index);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;

    utterance.onend = () => {
      setActiveParagraphIndex(null);
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      setActiveParagraphIndex(null);
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleParagraph = (text, index) => {
    if (activeParagraphIndex === index) {
      stopAudio();
    } else {
      setIsPlayingAll(false);
      speakParagraph(text, index);
    }
  };

  const playSequence = (paragraphs, idx) => {
    if (!isPlayingAllRef.current || idx >= paragraphs.length) {
      stopAudio();
      return;
    }

    speakParagraph(paragraphs[idx], idx, () => {
      if (isPlayingAllRef.current) {
        // Small pause between paragraphs
        setTimeout(() => {
          playSequence(paragraphs, idx + 1);
        }, 600);
      }
    });
  };

  const handleTogglePlayAll = () => {
    if (!activeArticle) return;

    if (isPlayingAll) {
      stopAudio();
    } else {
      setIsPlayingAll(true);
      isPlayingAllRef.current = true;
      playSequence(activeArticle.content_paragraphs, 0);
    }
  };

  const handleCloseModal = () => {
    stopAudio();
    setActiveArticle(null);
    if (searchParams.get('article')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('article');
      setSearchParams(newParams, { replace: true });
    } else if (routeArticleId) {
      navigate('/reading', { replace: true });
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-sky-200" />
            <span>Pilar Bacaan • Graded Readers CEFR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bacaan Kontekstual Sesuai Level Bahasa Anda
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Tingkatkan pemahaman bahasa secara alami lewat artikel pilihan. Dilengkapi <strong>audio native per paragraf</strong> dan fitur ketuk kata untuk simpan langsung ke kartu hafalan!
          </p>
        </div>
      </div>

      {/* 2. CEFR Level Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Pilih Level Kemampuan
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {filteredArticles.length} Artikel Tersedia
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedLevel === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🌟 Semua Level
          </button>

          {Object.values(CEFR_LEVELS).map((lvl) => {
            const isSelected = selectedLevel === lvl.code;
            return (
              <button
                key={lvl.code}
                onClick={() => setSelectedLevel(lvl.code)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? `${lvl.badgeClass} ring-2 ring-indigo-500 shadow-xs font-extrabold`
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{lvl.badge}</span>
                <span>{lvl.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => {
          const lvlInfo = CEFR_LEVELS[article.cefr_level] || CEFR_LEVELS.B1;
          return (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${lvlInfo.badgeClass}`}>
                    <span>{lvlInfo.badge}</span>
                    <span>{lvlInfo.code} • {lvlInfo.role}</span>
                  </span>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.read_time}
                    </span>
                    <span className="hidden sm:inline">&bull;</span>
                    <span className="hidden sm:inline">{article.words_count} kata</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Baca &amp; Dengar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. Interactive Reading Modal with Full Paragraph Audio Player */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">
                  {CEFR_LEVELS[activeArticle.cefr_level]?.badge || '📖'}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                    Level {activeArticle.cefr_level} • {activeArticle.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Master Control Toolbar */}
            <div className="px-6 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlayAll}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    isPlayingAll
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {isPlayingAll ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Jeda Pembacaan</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Putar Seluruh Artikel</span>
                    </>
                  )}
                </button>

                {(isPlayingAll || activeParagraphIndex !== null) && (
                  <button
                    onClick={stopAudio}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
                    title="Hentikan Audio"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span className="text-slate-400 mr-1">Tempo:</span>
                {[
                  { rate: 0.85, label: '0.85x' },
                  { rate: 1.0, label: '1.0x' },
                  { rate: 1.15, label: '1.15x' },
                ].map((s) => (
                  <button
                    key={s.rate}
                    onClick={() => setSpeechRate(s.rate)}
                    className={`px-2 py-0.5 rounded-md transition ${
                      speechRate === s.rate
                        ? 'bg-indigo-600 text-white font-extrabold'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Article Content with Per-Paragraph Audio */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-slate-800 leading-relaxed text-sm sm:text-base">
              {activeArticle.content_paragraphs.map((paragraph, idx) => {
                const isPlayingThis = activeParagraphIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl transition-all relative ${
                      isPlayingThis
                        ? 'bg-indigo-50/80 border-2 border-indigo-500 shadow-xs'
                        : 'bg-slate-50/50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="leading-relaxed font-serif text-slate-800 text-base sm:text-lg flex-1">
                        {paragraph}
                      </p>

                      <button
                        onClick={() => handleToggleParagraph(paragraph, idx)}
                        className={`p-2 rounded-xl transition shrink-0 cursor-pointer ${
                          isPlayingThis
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'
                        }`}
                        title={isPlayingThis ? 'Hentikan audio' : 'Dengarkan paragraf ini'}
                      >
                        {isPlayingThis ? (
                          <Volume2 className="w-4 h-4 animate-pulse text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Vocabulary Vault Section */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm sm:text-base">
                    <Sparkles className="w-4 h-4" />
                    <span>Kosakata Kunci di Artikel Ini (Tap to Save)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {activeArticle.vocabulary.length} Kata Kunci
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeArticle.vocabulary.map((v) => {
                    const isSaved = savedVocab[v.word];
                    return (
                      <div
                        key={v.word}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-indigo-50/40 hover:border-indigo-200 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{v.word}</span>
                            <button
                              onClick={() => handleSpeakWord(v.word)}
                              title="Dengar pelafalan"
                              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleSaveVocab(v, activeArticle.title)}
                            disabled={isSaved}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isSaved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-3 h-3" />
                                <span>+ Kartu</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs font-semibold text-slate-600">
                          {v.meaning}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">
                          "{v.example}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Selesai membaca? Kosakata tersimpan siap dilatih di menu <strong>Latihan</strong>.
              </span>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
