import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  BookOpen,
  Check,
  Bot,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AiSettingsModal({ isOpen, onClose }) {
  const user = useAppStore((state) => state.user);
  const aiConfig = useAppStore((state) => state.aiConfig);
  const setAiConfig = useAppStore((state) => state.setAiConfig);
  const testAiConnection = useAppStore((state) => state.testAiConnection);

  const [isEnabled, setIsEnabled] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success, latencyMs, reply, error }
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsEnabled(aiConfig?.isEnabled !== undefined ? aiConfig.isEnabled : true);
      setTestResult(null);
      setIsSaved(false);
      setIsTesting(false);
    }
  }, [isOpen, aiConfig]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isTesting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTesting, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  // Test connection to /api/ai
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testAiConnection({
        isEnabled: true,
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message || 'Gagal terhubung ke Lala AI Serverless',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save changes
  const handleSave = (e) => {
    e?.preventDefault();
    setAiConfig({
      isEnabled,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-[8px_8px_0px_#000] border-3 border-black overflow-hidden flex flex-col max-h-[92vh] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FFD166] text-black border-b-2.5 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.5] text-black" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight uppercase">
                Asisten Belajar Lala AI ⚡
              </h3>
              <p className="text-[11px] text-black/75 font-bold leading-tight">
                Ditenagai Cloud Serverless MyLala • Llama 3.3 70B
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Box */}
          <div className="p-3.5 rounded-2xl border-2 border-black bg-[#D4F63D]/30 shadow-[2px_2px_0px_#000] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D4F63D] border-2 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="font-black text-xs sm:text-sm text-black block">
                🟢 Lala AI Aktif & Terhubung
              </span>
              <p className="text-[11px] text-black/80 font-bold leading-snug">
                Seluruh fitur kecerdasan buatan telah dikonfigurasikan secara terpusat melalui server cloud MyLala. Kamu langsung bisa menikmati penjelasan materi dan latihan percakapan!
              </p>
            </div>
          </div>

          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
            <div>
              <span className="block font-black text-black text-xs sm:text-sm">
                Aktifkan Asisten Lala AI
              </span>
              <span className="block text-[11px] text-black/70 font-semibold">
                Tampilkan tombol tanya Lala AI pada Flashcard dan Roleplay
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#80ED99] border-2 border-black shadow-[1px_1px_0px_#000]"></div>
            </label>
          </div>

          {/* Capabilities Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-3 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400 mb-1 stroke-[2.5]" />
              <span className="font-black text-black text-xs">Respon Instan</span>
              <span className="text-[10px] text-black/70 font-bold">Llama 3.3 70B secepat kilat</span>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] flex flex-col items-center text-center">
              <BookOpen className="w-5 h-5 text-indigo-600 mb-1 stroke-[2.5]" />
              <span className="font-black text-black text-xs">Sesuai Level</span>
              <span className="text-[10px] text-black/70 font-bold">
                Adaptif level {user?.cefrLevel || 'A1'}
              </span>
            </div>
            <div className="p-3 rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] flex flex-col items-center text-center">
              <Bot className="w-5 h-5 text-[#FF85C0] mb-1 stroke-[2.5]" />
              <span className="font-black text-black text-xs">Roleplay Alami</span>
              <span className="text-[10px] text-black/70 font-bold">Percakapan & koreksi tata bahasa</span>
            </div>
          </div>

          {/* Test Connection Section */}
          <div className="pt-2 border-t-2 border-black/10">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-black bg-white hover:bg-[#D4F63D] active:translate-x-0.5 active:translate-y-0.5 text-black font-black text-xs transition cursor-pointer shadow-[2px_2px_0px_#000] disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                    <span>Menguji Server AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Uji Koneksi Lala AI</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-black/60 font-bold">
                Cek respon server cloud
              </span>
            </div>

            {/* Test Result Banner */}
            {testResult && (
              <div
                className={`mt-3 p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-[#80ED99]/40 text-black'
                    : 'bg-[#FF85C0]/40 text-black'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 stroke-[2.5] shrink-0 mt-0.5" />
                )}
                <div className="text-[11px] leading-snug space-y-0.5 font-bold">
                  <p className="font-black text-xs">
                    {testResult.success ? 'Koneksi AI Berhasil!' : 'Koneksi AI Belum Terhubung'}
                  </p>
                  <p>
                    {testResult.success
                      ? `Serverless AI merespon dengan lancar (Latency: ${testResult.latencyMs || 0}ms).`
                      : testResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Actions */}
          <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-black text-black bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#80ED99] hover:bg-[#68d783] active:translate-x-0.5 active:translate-y-0.5 text-black font-black text-xs transition border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
