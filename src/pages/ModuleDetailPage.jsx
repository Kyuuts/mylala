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
          markModuleRead(id);
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
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <Link
            to={`/flashcards/${module.id}`}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition shadow-xs"
          >
            <Layers className="w-4 h-4" /> Latihan Flashcard
          </Link>
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryBadge(
                module.category
              )}`}
            >
              {module.category}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">1-Page Active Cheat Sheet</span>
          </div>

          {/* Level Badge in Detail Banner */}
          {(() => {
            const levelInfo = getModuleLevel(module);
            return (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${levelInfo.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${levelInfo.dotClass} animate-pulse`} />
                {levelInfo.display}
              </span>
            );
          })()}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {module.title}
        </h1>
      </div>

      {/* Markdown Cheat Sheet Content */}
      <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <MarkdownViewer content={module.content_markdown} />
      </article>

      {/* Bottom Practice & Completion Action Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            Siap Menguji Pemahaman Anda?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {isCompleted
              ? 'Materi ini telah Anda tandai selesai dibaca. Latih retensi jangka panjang dengan flashcard di samping!'
              : 'Tandai materi ini selesai dibaca untuk memenuhi syarat Ujian Kelulusan Level.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => toggleModuleCompleted(module.id)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-xs cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isCompleted ? '✓ Selesai Dibaca' : 'Tandai Selesai (+20 XP)'}</span>
          </button>

          <Link
            to={`/flashcards/${module.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 shrink-0"
          >
            <Layers className="w-4 h-4" /> Latihan Flashcard
          </Link>
        </div>
      </div>
    </div>
  );
}
