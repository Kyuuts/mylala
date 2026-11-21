import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check, X, RefreshCw, Cpu, Trash2 } from 'lucide-react';
import { ttsService, KOKORO_VOICES } from '../../services/ttsService';
import { getCacheStats, clearAudioCache } from '../../utils/audioCache';

export default function VoiceSelectorModal({ isOpen, onClose }) {
  const [ttsState, setTtsState] = useState({
    status: 'idle',
    progress: { percent: 0, file: '' },
    preferredVoice: ttsService.getPreferredVoice(),
    isKokoroReady: ttsService.isReady(),
  });
  const [cacheCount, setCacheCount] = useState(0);
  const [testingVoiceId, setTestingVoiceId] = useState(null);
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((state) => {
      setTtsState(state);
    });
    loadStats();
    return () => unsubscribe();
  }, []);

  const loadStats = async () => {
    const stats = await getCacheStats();
    setCacheCount(stats.count || 0);
  };

  const handleSelectVoice = (voiceId) => {
    ttsService.setPreferredVoice(voiceId);
  };

  const handleTestVoice = async (voiceId, e) => {
    e.stopPropagation();
    setTestingVoiceId(voiceId);
    try {
      await ttsService.speak('Hello! Welcome to MyLala. Let us master English together!', {
        voice: voiceId,
      });
    } finally {
      setTestingVoiceId(null);
    }
  };

  const handlePreloadModel = () => {
    ttsService.initKokoro().catch(() => {});
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    await clearAudioCache();
    await loadStats();
    setClearingCache(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border-3 border-black shadow-[8px_8px_0px_#000] p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2.5] text-black" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Suara AI Kokoro-82M
              </h3>
              <p className="text-[10px] font-bold text-black/70">
                Studio-Grade On-Device AI Voice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Model Status Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[2px_2px_0px_#000] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-black">
              <Cpu className="w-3.5 h-3.5 stroke-[2.5]" /> Status Engine AI:
            </span>
            {ttsState.isKokoroReady ? (
              <span className="px-2 py-0.5 rounded-lg bg-[#80ED99] border-2 border-black text-[10px] font-black text-black">
                🟢 Model Siap (WebGPU)
              </span>
            ) : ttsState.status === 'loading' ? (
              <span className="px-2 py-0.5 rounded-lg bg-[#FFD166] border-2 border-black text-[10px] font-black text-black animate-pulse">
                📥 Mengunduh {ttsState.progress.percent}%
              </span>
            ) : (
              <button
                type="button"
                onClick={handlePreloadModel}
                className="px-2 py-0.5 rounded-lg bg-[#70D6FF] border-2 border-black text-[10px] font-black text-black hover:bg-[#D4F63D] transition cursor-pointer"
              >
                ⚡ Unduh Model Sekarang
              </button>
            )}
          </div>

          {ttsState.status === 'loading' && (
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-black">
              <div
                className="bg-[#D4F63D] h-full transition-all duration-300"
                style={{ width: `${ttsState.progress.percent}%` }}
              />
            </div>
          )}

          <p className="text-[10px] text-black/70 leading-relaxed">
            {ttsState.isKokoroReady
              ? '✅ Model Kokoro 82M aktif di perangkat lokal. Audio diproses offline tanpa kuota API.'
              : '⚡ Selagi model diunduh (~80MB sekali saja), aplikasi otomatis menggunakan suara Natural Browser.'}
          </p>
        </div>

        {/* Voice List */}
        <div className="mt-4 space-y-2.5 overflow-y-auto pr-1 flex-1">
          <label className="text-[11px] font-black uppercase text-black block">
            Pilih Karakter Vokal:
          </label>
          {KOKORO_VOICES.map((v) => {
            const isSelected = ttsState.preferredVoice === v.id;
            const isTesting = testingVoiceId === v.id;

            return (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectVoice(v.id)}
                className={`p-3 rounded-2xl border-2 border-black transition cursor-pointer flex items-center justify-between gap-3 text-left ${
                  isSelected
                    ? 'bg-[#D4F63D] shadow-[4px_4px_0px_#000] -translate-y-0.5'
                    : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-xs text-black">{v.name}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-white border border-black text-[9px] font-black text-black">
                      {v.badge}
                    </span>
                    <span className="text-[9px] font-bold text-black/60">
                      {v.accent}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-black/75 truncate mt-0.5">
                    {v.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    title="Tes Suara"
                    onClick={(e) => handleTestVoice(v.id, e)}
                    className="p-1.5 rounded-lg bg-white border-2 border-black shadow-[1px_1px_0px_#000] hover:bg-[#FF85C0] text-black transition cursor-pointer"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 stroke-[2.5] animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>

                  <div
                    className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${
                      isSelected ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cache & Footer Information */}
        <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between gap-2 text-xs">
          <div className="text-[10px] font-bold text-black/70">
            💾 Audio Tersimpan:{' '}
            <span className="font-black text-black">{cacheCount} klip</span> (Instan 0 ms)
          </div>
          {cacheCount > 0 && (
            <button
              type="button"
              disabled={clearingCache}
              onClick={handleClearCache}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-red-100 border border-black text-[10px] font-black text-red-600 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
