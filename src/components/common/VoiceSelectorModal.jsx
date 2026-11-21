import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check, X, RefreshCw, Trash2, Gauge, Zap, ChevronDown } from 'lucide-react';
import { ttsService, EDGE_AZURE_VOICES } from '../../services/ttsService';
import { getCacheStats, clearAudioCache } from '../../utils/audioCache';

export default function VoiceSelectorModal({ isOpen, onClose }) {
  const [ttsState, setTtsState] = useState({
    status: 'ready',
    preferredVoice: ttsService.getPreferredVoice(),
    preferredSpeed: ttsService.getPreferredSpeed(),
  });
  const [cacheCount, setCacheCount] = useState(0);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
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

  const handleSelectSpeed = (speed) => {
    ttsService.setPreferredSpeed(speed);
  };

  const currentVoiceId = ttsState.preferredVoice || 'en-US-JennyNeural';
  const selectedVoiceObj =
    EDGE_AZURE_VOICES.find((v) => v.id === currentVoiceId) || EDGE_AZURE_VOICES[0];

  const handleTestSelectedVoice = async () => {
    if (isTestingVoice) return;
    setIsTestingVoice(true);
    try {
      await ttsService.speak('Hello! Welcome to MyLala. Let us master English together!', {
        voice: currentVoiceId,
        speed: ttsState.preferredSpeed,
      });
      await loadStats();
    } finally {
      setIsTestingVoice(false);
    }
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
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border-3 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-5 overflow-hidden flex flex-col text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2.5 border-black bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 stroke-[2.5] text-black" />
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
                Suara AI Microsoft Azure Neural
              </h3>
              <p className="text-[10px] font-bold text-black/70">
                Studio-Grade Engine • 0 MB Download • Instan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan suara"
            className="w-7 h-7 rounded-lg bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Engine Performance Status Banner */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#80ED99]/30 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black">
            <Zap className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span>Status: 🟢 Aktif di Seluruh Ekosistem (~150 ms)</span>
          </div>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-[#D4F63D] border border-black text-black">
            Bebas Lag di HP
          </span>
        </div>

        {/* Compact Dropdown Selection Section */}
        <div className="mt-3 space-y-2 shrink-0">
          <label htmlFor="voice-select-dropdown" className="block text-xs font-black uppercase tracking-wider text-black">
            PILIH KARAKTER SUARA AI:
          </label>

          <div className="relative">
            <select
              id="voice-select-dropdown"
              value={currentVoiceId}
              onChange={(e) => handleSelectVoice(e.target.value)}
              className="w-full appearance-none bg-white p-3 pr-10 rounded-2xl border-2.5 border-black shadow-[3px_3px_0px_#000] font-black text-xs text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <optgroup label="🇺🇸 American English">
                {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-US').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.flag} {v.name} ({v.gender}) • {v.badge}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🇬🇧 British English">
                {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-GB').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.flag} {v.name} ({v.gender}) • {v.badge}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🇦🇺 Australian English">
                {EDGE_AZURE_VOICES.filter((v) => v.locale === 'en-AU').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.flag} {v.name} ({v.gender}) • {v.badge}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Active Voice Info & Instant Test Button */}
          {selectedVoiceObj && (
            <div className="p-3 rounded-2xl bg-[#D4F63D]/25 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base">{selectedVoiceObj.flag}</span>
                  <span className="font-black text-xs text-black">{selectedVoiceObj.name}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-white border border-black text-[9px] font-black text-black">
                    {selectedVoiceObj.badge}
                  </span>
                  <span className="text-[9px] font-bold text-black/60">
                    {selectedVoiceObj.gender} &bull; {selectedVoiceObj.locale}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-black/80 truncate mt-0.5">
                  {selectedVoiceObj.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestSelectedVoice}
                disabled={isTestingVoice}
                title="Dengarkan contoh suara ini"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FF85C0] text-black font-black text-[11px] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isTestingVoice ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 stroke-[2.5] animate-spin" />
                    <span>Memutar...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Tes Audio</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Speed Adjustment Control */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#F8FAFC] border-2 border-black space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 stroke-[2.5]" /> Kecepatan Artikulasi:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFD166] border border-black text-[10px] font-black">
              {ttsState.preferredSpeed || 1.0}x
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {[0.8, 0.9, 1.0, 1.1].map((s) => {
              const isSpeedActive = (ttsState.preferredSpeed || 1.0) === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectSpeed(s)}
                  className={`py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-black border-2 border-black transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex flex-col items-center justify-center leading-tight ${
                    isSpeedActive
                      ? 'bg-[#FF85C0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-slate-100 text-black'
                  }`}
                >
                  <span>{s}x</span>
                  <span className="text-[9px] font-bold text-black/70">
                    {s === 1.0 ? 'Normal' : s < 1.0 ? 'Lambat' : 'Cepat'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cache & Footer Information */}
        <div className="mt-3 pt-3 border-t-2 border-black flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="text-[10px] font-bold text-black/70">
            💾 Audio Tersimpan:{' '}
            <span className="font-black text-black">{cacheCount} klip</span> (Instan 0 ms offline)
          </div>
          {cacheCount > 0 && (
            <button
              type="button"
              disabled={clearingCache}
              onClick={handleClearCache}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-rose-100 border-2 border-black text-[10px] font-black text-rose-600 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan Cache
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
