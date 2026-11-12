import React, { useState } from 'react';
import { BookOpen, Clock, Tag, Sparkles, Check, BookmarkPlus, ArrowRight, X, Volume2 } from 'lucide-react';
import { GRADED_ARTICLES } from '../services/readingArticlesData';
import { CEFR_LEVELS } from '../utils/moduleLevel';
import { useAppStore } from '../store/useAppStore';

export default function ReadingPage() {
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState(null);
  const [savedVocab, setSavedVocab] = useState({});
  const { addFlashcard, syncNotification } = useAppStore();

  const filteredArticles = selectedLevel === 'ALL'
    ? GRADED_ARTICLES
    : GRADED_ARTICLES.filter((a) => a.cefr_level === selectedLevel);

  const handleSaveVocab = (vocabItem, articleTitle) => {
    // Add vocabulary word directly to local/cloud flashcard deck
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

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
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
            Bacaan Sesuai Level Bahasa Anda
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Tingkatkan pemahaman bahasa secara alami lewat artikel pilihan. Ketuk kosakata sulit untuk melihat arti instan dan menyimpannya langsung ke kartu hafalan!
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
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. Interactive Reading Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">
                  {CEFR_LEVELS[activeArticle.cefr_level]?.badge || '📖'}
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                    Level {activeArticle.cefr_level} • {activeArticle.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 line-clamp-1">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base">
              {activeArticle.content_paragraphs.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed font-serif text-slate-700 text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}

              {/* Vocabulary Vault Section */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm sm:text-base">
                    <Sparkles className="w-4 h-4" />
                    <span>Kosakata Penting di Artikel Ini (Tap to Save)</span>
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
                              onClick={() => handleSpeak(v.word)}
                              title="Dengar pelafalan"
                              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleSaveVocab(v, activeArticle.title)}
                            disabled={isSaved}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
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
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
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
