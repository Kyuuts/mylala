import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check, X, RefreshCw, Cpu, Trash2, Gauge, Zap } from 'lucide-react';
import { ttsService, EDGE_AZURE_VOICES } from '../../services/ttsService';
import { getCacheStats, clearAudioCache } from '../../utils/audioCache';

export default function VoiceSelectorModal({ isOpen, onClose }) {
  const [ttsState, setTtsState] = useState({
    status: 'ready',
    preferredVoice: ttsService.getPreferredVoice(),
    preferredSpeed: ttsService.getPreferredSpeed(),
  });
  const [cacheCount, setCacheCount] = useState(0);
  const [testingVoiceId, setTestingVoiceId] = useState(null);
  const [clearingCache, setClearingCache] = useState(false);
  const [accentFilter, setAccentFilter] = useState('ALL'); // 'ALL' | 'en-US' | 'en-GB' | 'en-AU'

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

  const handleTestVoice = async (voiceId, e) => {
    e.stopPropagation();
    setTestingVoiceId(voiceId);
    try {
      await ttsService.speak('Hello! Welcome to MyLala. Let us master English together!', {
        voice: voiceId,
        speed: ttsState.preferredSpeed,
      });
      await loadStats();
    } finally {
      setTestingVoiceId(null);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    await clearAudioCache();
    await loadStats();
    setClearingCache(false);
  };

  if (!isOpen) return null;

  const filteredVoices = EDGE_AZURE_VOICES.filter((v) => {
    if (accentFilter === 'ALL') return true;
    return v.locale === accentFilter;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2.5 border-black bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2.5] text-black" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Suara AI Microsoft Azure Neural
              </h3>
              <p className="text-[10px] font-bold text-black/70">
                Studio-Grade Neural Engine • 0 MB Download • Instan
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

        {/* Engine Performance Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-[#80ED99]/30 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black">
            <Zap className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Status: 🟢 Aktif di Seluruh Ekosistem (~150 ms)</span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#D4F63D] border border-black text-black">
            Bebas Lag di HP
          </span>
        </div>

        {/* Speed Adjustment Control */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#F8FAFC] border-2 border-black space-y-1.5">
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
                  className={`py-1 rounded-xl text-xs font-black border-2 border-black transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                    isSpeedActive
                      ? 'bg-[#FF85C0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-slate-100 text-black'
                  }`}
                >
                  {s}x {s === 1.0 ? '(Normal)' : s < 1.0 ? '(Lambat)' : '(Cepat)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Filter Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'ALL', label: 'Semua Aksen' },
            { id: 'en-US', label: '🇺🇸 American' },
            { id: 'en-GB', label: '🇬🇧 British' },
            { id: 'en-AU', label: '🇦🇺 Australian' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAccentFilter(tab.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-black border-2 border-black shrink-0 transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                accentFilter === tab.id
                  ? 'bg-[#70D6FF] text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black/70 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Voice List */}
        <div className="mt-2 space-y-2 overflow-y-auto pr-1 flex-1">
          {filteredVoices.map((v) => {
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
                    ? 'bg-[#D4F63D] shadow-[3px_3px_0px_#000] -translate-y-0.5'
                    : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm">{v.flag}</span>
                    <span className="font-black text-xs text-black">{v.name}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-white border border-black text-[9px] font-black text-black">
                      {v.badge}
                    </span>
                    <span className="text-[9px] font-bold text-black/60">
                      {v.gender} &bull; {v.locale}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-black/75 truncate mt-0.5">
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
        <div className="mt-3 pt-3 border-t-2 border-black flex items-center justify-between gap-2 text-xs">
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
