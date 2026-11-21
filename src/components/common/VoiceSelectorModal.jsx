import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, RefreshCw, Trash2, Gauge, Play, Pause } from 'lucide-react';
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

  // Active accent tab filter: 'all' | 'en-US' | 'en-GB' | 'en-AU'
  const [selectedLocale, setSelectedLocale] = useState('en-US');

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

  const currentVoiceId = ttsState.preferredVoice || 'en-US-JennyNeural';

  // Automatically switch tab to match current active voice on open
  useEffect(() => {
    if (isOpen) {
      const activeVoice = EDGE_AZURE_VOICES.find((v) => v.id === currentVoiceId);
      if (activeVoice) {
        setSelectedLocale(activeVoice.locale);
      }
      loadStats();
    }
  }, [isOpen, currentVoiceId]);

  const handleSelectVoice = (voiceId) => {
    ttsService.setPreferredVoice(voiceId);
  };

  const handleSelectSpeed = (speed) => {
    ttsService.setPreferredSpeed(speed);
  };

  const handleTestVoice = async (voiceObj, e) => {
    e?.stopPropagation();
    if (testingVoiceId === voiceObj.id) {
      ttsService.stop();
      setTestingVoiceId(null);
      return;
    }

    setTestingVoiceId(voiceObj.id);
    try {
      const sampleGreeting = voiceObj.locale === 'en-GB'
        ? "Hello! Lovely to meet you. Let's master British English together."
        : voiceObj.locale === 'en-AU'
        ? "G'day! Welcome to MyLala. Let's practice English together."
        : "Hello! Welcome to MyLala. Let's master English conversation together.";

      await ttsService.speak(sampleGreeting, {
        voice: voiceObj.id,
        speed: ttsState.preferredSpeed,
      });
      await loadStats();
    } catch (err) {
      console.warn('Voice preview playback note:', err);
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

  const filteredVoices = selectedLocale === 'all'
    ? EDGE_AZURE_VOICES
    : EDGE_AZURE_VOICES.filter((v) => v.locale === selectedLocale);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-6 overflow-hidden flex flex-col text-black max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2.5 border-black shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-black">
                Pilihan Suara Pembelajaran
              </h3>
              <p className="text-[11px] font-bold text-black/60">
                Pilih aksen dan narator native yang nyaman didengar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan suara"
            className="w-8 h-8 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Accent Filter Tabs */}
        <div className="mt-3.5 flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 text-xs font-black">
          <button
            type="button"
            onClick={() => setSelectedLocale('en-US')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${
              selectedLocale === 'en-US'
                ? 'bg-[#D4F63D] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            🇺🇸 American
          </button>
          <button
            type="button"
            onClick={() => setSelectedLocale('en-GB')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${
              selectedLocale === 'en-GB'
                ? 'bg-[#70D6FF] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            🇬🇧 British
          </button>
          <button
            type="button"
            onClick={() => setSelectedLocale('en-AU')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${
              selectedLocale === 'en-AU'
                ? 'bg-[#FF85C0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'text-black/70 hover:text-black border-2 border-transparent'
            }`}
          >
            🇦🇺 Australian
          </button>
        </div>

        {/* Clean Voice Cards List */}
        <div className="mt-3 space-y-2 overflow-y-auto pr-1 flex-1 min-h-[180px] max-h-[38vh]">
          {filteredVoices.map((voice) => {
            const isSelected = voice.id === currentVoiceId;
            const isPlayingThis = testingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectVoice(voice.id)}
                className={`p-3 rounded-2xl border-2 border-black transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#FFFDF0] shadow-[3px_3px_0px_#000] border-black ring-2 ring-black'
                    : 'bg-white hover:bg-slate-50 shadow-[1.5px_1.5px_0px_#000]'
                }`}
              >
                {/* Left: Avatar & Details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center text-base shrink-0 ${
                      isSelected ? 'bg-[#D4F63D]' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    {voice.gender === 'Female' ? '👩' : '👨'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-sm text-black">
                        {voice.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-black text-black">
                        {voice.gender}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-[#D4F63D] border border-black text-black">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-black/70 truncate mt-0.5">
                      {voice.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Audio Sample & Selection Radio */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleTestVoice(voice, e)}
                    title={isPlayingThis ? 'Hentikan sampel' : 'Dengarkan contoh suara'}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-black text-xs border-2 border-black active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer ${
                      isPlayingThis
                        ? 'bg-[#FF85C0] text-black shadow-[1.5px_1.5px_0px_#000]'
                        : 'bg-white hover:bg-slate-100 text-black shadow-[1.5px_1.5px_0px_#000]'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[10px]">Putar...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-black text-black" />
                        <span className="text-[10px]">Tes</span>
                      </>
                    )}
                  </button>

                  <div
                    className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition shrink-0 ${
                      isSelected ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speed Adjustment Control */}
        <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFC] border-2 border-black space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 text-black">
              <Gauge className="w-4 h-4 stroke-[2.5]" /> Kecepatan Artikulasi:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFD166] border border-black text-[11px] font-black">
              {ttsState.preferredSpeed || 1.0}x {ttsState.preferredSpeed === 1.0 ? '(Normal)' : ''}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.8, 0.9, 1.0, 1.1].map((s) => {
              const isSpeedActive = (ttsState.preferredSpeed || 1.0) === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectSpeed(s)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-black border-2 border-black transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex flex-col items-center justify-center leading-tight ${
                    isSpeedActive
                      ? 'bg-[#FF85C0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-slate-100 text-black'
                  }`}
                >
                  <span>{s}x</span>
                  <span className="text-[9px] font-bold text-black/60">
                    {s === 1.0 ? 'Normal' : s < 1.0 ? 'Lambat' : 'Cepat'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer & Close */}
        <div className="mt-3 pt-3 border-t-2 border-black flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="text-[11px] font-bold text-black/60">
            💾 Tersimpan offline: <span className="font-black text-black">{cacheCount} klip</span>
          </div>

          <div className="flex items-center gap-2">
            {cacheCount > 0 && (
              <button
                type="button"
                disabled={clearingCache}
                onClick={handleClearCache}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 border-2 border-black text-[10px] font-black text-rose-600 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Bersihkan
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#D4F63D] hover:bg-[#bce228] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
            >
              Simpan &amp; Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
