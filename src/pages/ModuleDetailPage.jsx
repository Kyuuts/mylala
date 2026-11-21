import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, RefreshCw, AlertCircle, Share2, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MarkdownViewer from '../components/modules/MarkdownViewer';
import { getModuleLevel } from '../utils/moduleLevel';

export default function ModuleDetailPage() {
  const { id } = useParams();
  const { fetchModuleById, markModuleRead, completedModules, toggleModuleCompleted } = useAppStore();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const isCompleted = completedModules?.includes(id);

  // Pastikan posisi scroll selalu berada di bagian paling atas saat membuka modul
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    async function loadModule() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await fetchModuleById(id);
        if (err || !data) {
          setError('Modul tidak ditemukan atau gagal dimuat.');
        } else {
          setModule(data);
        }
      } catch (e) {
        setError('Terjadi kendala saat memuat modul.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadModule();
    }
  }, [fetchModuleById, id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Grammar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vocab':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Templates':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Memuat materi cheat sheet...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Modul Tidak Ditemukan</h2>
        <p className="text-sm text-slate-600">{error || 'Data modul tidak tersedia.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm transition hover:bg-indigo-700 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-2">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs sm:text-sm font-black active:translate-x-0.5 active:translate-y-0.5 transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Kembali ke Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] bg-white hover:bg-slate-50 text-black text-xs font-black active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <Link
            to={`/flashcards/${module.id}`}
            className="inline-flex items-center gap-1.5 bg-[#FF85C0] hover:bg-[#ff6fae] text-black text-xs sm:text-sm font-black px-4 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" /> Latihan Flashcard
          </Link>
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="bg-[#70D6FF] p-6 sm:p-8 rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black shadow-[1px_1px_0px_#000]">
              {module.category}
            </span>
            <span className="text-xs text-black/70 font-black hidden sm:inline">1-Page Active Cheat Sheet</span>
          </div>

          {/* Level Badge in Detail Banner */}
          {(() => {
            const levelInfo = getModuleLevel(module);
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#FFD166] text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                {levelInfo.display}
              </span>
            );
          })()}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          {module.title}
        </h1>
      </div>

      {/* Markdown Cheat Sheet Content */}
      <article className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-black shadow-[6px_6px_0px_#000]">
        <MarkdownViewer content={module.content_markdown} />
      </article>

      {/* Bottom Practice & Completion Action Banner */}
      <div className="bg-[#D4F63D] border-3 border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-black text-black text-base sm:text-lg uppercase">
            Siap Menguji Pemahaman Anda?
          </h3>
          <p className="text-xs sm:text-sm text-black/80 font-bold">
            {isCompleted
              ? 'Materi ini telah Anda tandai selesai dibaca. Latih retensi jangka panjang dengan flashcard di samping!'
              : 'Tandai materi ini selesai dibaca untuk memenuhi syarat Ujian Kelulusan Level.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => toggleModuleCompleted(id)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer ${
              isCompleted
                ? 'bg-[#80ED99] text-black'
                : 'bg-white text-black hover:bg-slate-50'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{isCompleted ? '✓ Selesai Dibaca' : 'Tandai Selesai (+20 XP)'}</span>
          </button>

          <Link
            to={`/flashcards/${module.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FF85C0] hover:bg-[#ff6fae] text-black text-xs sm:text-sm font-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition shrink-0"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" /> Latihan Flashcard
          </Link>
        </div>
      </div>
    </div>
  );
}
