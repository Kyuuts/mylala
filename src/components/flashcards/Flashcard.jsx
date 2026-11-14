import React from 'react';
import { RotateCw, Volume2, Mic } from 'lucide-react';
import { getTargetSpeechSentence } from '../../utils/speechRecognition';

/**
 * Prepares clean speech text for Web Speech Synthesis.
 * - Replaces fill-in-the-blank underscores (____) with a natural silent breathing pause on the front.
 * - On the flipped back side, plays the completed pure English sentence (never Indonesian explanation).
 */
export const getCleanSpeechText = (card, isFlipped) => {
  if (!card) return '';

  if (isFlipped) {
    return getTargetSpeechSentence(card);
  }

  // Front card: pause on blanks
  return (card.front_text || '')
    .replace(/_+/g, ' ... ')
    .replace(/\(Pilihan:.*?\)/gi, '')
    .replace(/[*_`#]/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function Flashcard({ card, isFlipped, onFlip, onToggleShadowing, isShadowingActive }) {
  if (!card) return null;

  const playPronunciation = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = getCleanSpeechText(card, isFlipped);
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.88; // clear, comfortable listening pace
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? 'Sisi Belakang Kartu: Jawaban dan Arti. Tekan Enter atau Spasi untuk membalik ke depan'
          : 'Sisi Depan Kartu: Pertanyaan Active Recall. Tekan Enter atau Spasi untuk membalik ke belakang'
      }
      aria-pressed={isFlipped}
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
      className="w-full max-w-lg mx-auto h-84 sm:h-96 cursor-pointer perspective-1000 select-none group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-3xl"
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE (English Active Recall) */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-md border-2 border-slate-200 group-hover:border-indigo-300 transition-colors backface-hidden">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-bold tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase">
              English
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleShadowing) onToggleShadowing();
                }}
                title="Latih pengucapan suara (Voice Shadowing)"
                aria-label="Latih pengucapan suara (Voice Shadowing)"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition cursor-pointer ${
                  isShadowingActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={playPronunciation}
                title="Dengarkan pengucapan audio (jeda otomatis pada titik kosong)"
                aria-label="Dengarkan pengucapan audio"
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="my-auto px-4 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {card.front_text}
            </h2>
            <p className="text-xs text-slate-600 font-medium">Tebak arti &amp; jawabannya sebelum membalik kartu</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition">
            <RotateCw className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            <span>Klik atau tekan Spasi untuk membalik</span>
          </div>
        </div>

        {/* BACK SIDE (Indonesian Meaning & Completed Context Sentence) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-lg backface-hidden rotate-y-180">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-bold tracking-wider text-indigo-200 bg-white/10 px-3 py-1 rounded-full uppercase">
              Arti &amp; Kunci Jawaban
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleShadowing) onToggleShadowing();
                }}
                title="Latih pengucapan suara (Voice Shadowing)"
                aria-label="Latih pengucapan suara (Voice Shadowing)"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full transition cursor-pointer ${
                  isShadowingActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-indigo-200 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={playPronunciation}
                title="Dengarkan pelafalan kalimat lengkap"
                aria-label="Dengarkan pelafalan kalimat lengkap"
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 text-indigo-200 hover:text-white transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="my-auto px-4 space-y-4">
            <p className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed">
              {card.back_text}
            </p>

            {card.example_sentence && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 max-w-sm mx-auto">
                <p className="text-xs sm:text-sm text-indigo-100 italic leading-relaxed">
                  "{card.example_sentence}"
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-indigo-200/80 font-medium">
            Evaluasi ingatanmu dengan memilih tombol di bawah
          </div>
        </div>
      </div>
    </div>
  );
}
