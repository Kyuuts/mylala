import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import { ttsService } from '../services/ttsService';
import VoiceSelectorModal from '../components/common/VoiceSelectorModal';

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
  const [showVoiceModal, setShowVoiceModal] = useState(false);
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
      ttsService.stop();
    };
  }, [activeArticle]);

  // Lock body scroll when reading modal is active
  useEffect(() => {
    if (activeArticle && typeof document !== 'undefined') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
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
    isPlayingAllRef.current = false;
    setIsPlayingAll(false);
    setActiveParagraphIndex(null);
    ttsService.stop();
  };

  const handleSpeakWord = (text) => {
    stopAudio();
    ttsService.speak(text);
  };

  const handleToggleParagraph = async (text, index) => {
    if (activeParagraphIndex === index) {
      stopAudio();
    } else {
      stopAudio();
      setActiveParagraphIndex(index);
      try {
        await ttsService.speak(text, { speed: speechRate });
      } catch (err) {
        console.error('TTS error on paragraph:', err);
      } finally {
        setActiveParagraphIndex((curr) => (curr === index ? null : curr));
      }
    }
  };

  const handleTogglePlayAll = async () => {
    if (!activeArticle || !activeArticle.content_paragraphs?.length) return;

    if (isPlayingAll) {
      stopAudio();
      return;
    }

    // Stop any existing single paragraph playback
    ttsService.stop();
    setIsPlayingAll(true);
    isPlayingAllRef.current = true;

    const paragraphs = activeArticle.content_paragraphs;

    // Pre-cache all paragraphs in background for zero-latency sequential playback
    ttsService.prefetchSentences(paragraphs).catch(() => {});

    for (let i = 0; i < paragraphs.length; i++) {
      if (!isPlayingAllRef.current) break;

      setActiveParagraphIndex(i);

      // Smooth scroll the reading view to follow active paragraph
      try {
        const activeEl = document.getElementById(`reading-paragraph-${i}`);
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {}

      try {
        await ttsService.speak(paragraphs[i], { speed: speechRate });
      } catch (err) {
        console.error(`Error playing paragraph ${i} in sequence:`, err);
      }

      if (!isPlayingAllRef.current) break;

      // Small natural breathing pause between paragraphs
      if (i < paragraphs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    // When the whole article finishes naturally or stopped
    if (isPlayingAllRef.current) {
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      setActiveParagraphIndex(null);
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
      {/* 1. Header Banner - Neo-Brutalism Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-[#70D6FF] text-black p-6 sm:p-8 border-3 border-black shadow-[6px_6px_0px_#000]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black uppercase">
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pilar Bacaan • Graded Readers CEFR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            BACAAN KONTEKSTUAL SESUAI LEVEL BAHASA ANDA
          </h1>
          <p className="text-xs sm:text-sm text-black/80 font-bold leading-relaxed">
            Tingkatkan pemahaman bahasa secara alami lewat artikel pilihan. Dilengkapi <strong>audio native per paragraf</strong> dan fitur ketuk kata untuk simpan langsung ke kartu hafalan!
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4F63D] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 hover:bg-white transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              <span>Pengaturan Suara AI Microsoft</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CEFR Level Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black text-black uppercase tracking-wider">
            PILIH LEVEL KEMAMPUAN
          </h2>
          <span className="text-xs font-black px-2 py-0.5 rounded-md bg-black text-white">
            {filteredArticles.length} Artikel Tersedia
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer border-2 border-black ${
              selectedLevel === 'ALL'
                ? 'bg-black text-white shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]'
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer border-2 border-black ${
                  isSelected
                    ? 'bg-[#D4F63D] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]'
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
              className="bg-white rounded-3xl border-2.5 border-black p-5 sm:p-6 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] bg-[#FFD166] text-black">
                    <span>{lvlInfo.badge}</span>
                    <span>{lvlInfo.code} • {lvlInfo.role}</span>
                  </span>

                  <div className="flex items-center gap-2 text-xs text-black/70 font-black">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                      {article.read_time}
                    </span>
                    <span>&bull;</span>
                    <span>{article.words_count} kata</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-black group-hover:text-indigo-600 transition leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-black/80 font-bold line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-black/15 flex items-center justify-between">
                <span className="text-[11px] font-black text-black/70 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                  {article.category}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4F63D] text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black group-hover:translate-x-0.5 transition-transform">
                  <span>Baca &amp; Dengar</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. Interactive Reading Modal with Full Paragraph Audio Player */}
      {activeArticle &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-black shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col h-[94vh] max-h-[94vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-b-2 sm:border-b-2.5 border-black flex items-center justify-between bg-[#FFD166] text-black shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl sm:text-2xl shrink-0">
                    {CEFR_LEVELS[activeArticle.cefr_level]?.badge || '📖'}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white inline-block mb-0.5">
                      Level {activeArticle.cefr_level} • {activeArticle.category}
                    </span>
                    <h3 className="text-sm sm:text-lg font-black text-black truncate leading-tight">
                      {activeArticle.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Audio Master Control Toolbar - Structured for Mobile */}
              <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[#18181B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b-2 border-black shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlayAll}
                    className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                      isPlayingAll
                        ? 'bg-[#FF85C0] text-black'
                        : 'bg-[#D4F63D] text-black'
                    }`}
                  >
                    {isPlayingAll ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                        <span>Jeda Pembacaan</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                        <span>Putar Seluruh Artikel</span>
                      </>
                    )}
                  </button>

                  {(isPlayingAll || activeParagraphIndex !== null) && (
                    <button
                      onClick={stopAudio}
                      className="p-1.5 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer shrink-0"
                      title="Hentikan Audio"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>

                {/* Speed Selector & Voice Modal Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t border-white/10 sm:border-t-0">
                  <div className="flex items-center gap-1 text-[11px] font-black">
                    <span className="text-white/70 mr-1 uppercase text-[10px]">Tempo:</span>
                    {[
                      { rate: 0.85, label: '0.85x' },
                      { rate: 1.0, label: '1.0x' },
                      { rate: 1.15, label: '1.15x' },
                    ].map((s) => (
                      <button
                        key={s.rate}
                        onClick={() => setSpeechRate(s.rate)}
                        className={`px-2 py-0.5 rounded-md border text-[11px] font-black transition cursor-pointer ${
                          speechRate === s.rate
                            ? 'bg-[#70D6FF] text-black border-white'
                            : 'bg-white/10 text-white border-transparent hover:bg-white/20'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowVoiceModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black bg-[#FF85C0] text-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer shrink-0"
                    title="Pilih Karakter Suara AI Microsoft Azure Neural"
                  >
                    <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Suara AI</span>
                  </button>
                </div>
              </div>

              {/* Modal Body: Article Content with Per-Paragraph Audio */}
              <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 text-black leading-relaxed flex-1">
                {activeArticle.content_paragraphs.map((paragraph, idx) => {
                  const isPlayingThis = activeParagraphIndex === idx;

                  return (
                    <div
                      key={idx}
                      id={`reading-paragraph-${idx}`}
                      className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all relative border-2 ${
                        isPlayingThis
                          ? 'bg-[#D4F63D]/30 border-black shadow-[3px_3px_0px_#000]'
                          : 'bg-[#F8FAFC] border-black/15 hover:border-black shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="leading-relaxed font-bold text-black text-sm sm:text-base flex-1">
                          {paragraph}
                        </p>

                        <button
                          onClick={() => handleToggleParagraph(paragraph, idx)}
                          className={`p-2 rounded-xl transition shrink-0 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                            isPlayingThis
                              ? 'bg-[#D4F63D] text-black'
                              : 'bg-white text-black hover:bg-slate-100'
                          }`}
                          title={isPlayingThis ? 'Hentikan audio' : 'Dengarkan paragraf ini'}
                        >
                          {isPlayingThis ? (
                            <Volume2 className="w-4 h-4 animate-pulse stroke-[2.5]" />
                          ) : (
                            <Volume2 className="w-4 h-4 stroke-[2.5]" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Vocabulary Vault Section */}
                <div className="mt-6 pt-4 border-t-2 border-black space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-black font-black text-xs sm:text-sm uppercase tracking-tight">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>Kosakata Kunci (Tap to Save)</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFD166] text-black border border-black">
                      {activeArticle.vocabulary.length} Kata
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeArticle.vocabulary.map((v) => {
                      const isSaved = savedVocab[v.word];
                      return (
                        <div
                          key={v.word}
                          className="p-3 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-black text-xs sm:text-sm">{v.word}</span>
                              <button
                                onClick={() => handleSpeakWord(v.word)}
                                title="Dengar pelafalan"
                                className="text-black hover:text-indigo-600 p-0.5 transition cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleSaveVocab(v, activeArticle.title)}
                              disabled={isSaved}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[11px] font-black transition cursor-pointer border-2 border-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                                isSaved
                                  ? 'bg-[#80ED99] text-black'
                                  : 'bg-[#FF85C0] text-black hover:bg-[#D4F63D]'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>Tersimpan</span>
                                </>
                              ) : (
                                <>
                                  <BookmarkPlus className="w-3 h-3 stroke-[2.5]" />
                                  <span>+ Kartu</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-xs font-bold text-black/80">
                            {v.meaning}
                          </p>
                          <p className="text-[10px] font-medium text-black/60 italic">
                            "{v.example}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Mobile Friendly */}
              <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t-2 border-black bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] font-bold text-black/70 text-center sm:text-left">
                  Selesai membaca? Kosakata tersimpan siap dilatih di menu <strong>Latihan</strong>.
                </span>
                <button
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer shrink-0"
                >
                  Tutup Bacaan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Kokoro AI Voice Selector Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
