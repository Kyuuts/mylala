import React from 'react';
import { RotateCw, Volume2, Mic, Sparkles } from 'lucide-react';
import { getTargetSpeechSentence, isIndonesianText } from '../../utils/speechRecognition';
import { ttsService } from '../../services/ttsService';

/**
 * Parses front card text into categoryHint and mainText so that Indonesian prefixes
 * like "Subjek jamak:" or "Pasif masa lampau:" appear as elegant pill badges rather than
 * cluttering the English question text or being read aloud by TTS.
 */
export const parseFrontCardText = (frontText = '') => {
  if (!frontText) return { categoryHint: null, mainText: '' };

  // Pattern 1: [Category]: "[Quoted Sentence]"
  const colonQuoteMatch = frontText.match(/^([^:]+):\s*"([^"]+)"$/);
  if (colonQuoteMatch) {
    return {
      categoryHint: colonQuoteMatch[1].trim(),
      mainText: colonQuoteMatch[2].trim(),
    };
  }

  // Pattern 2: [Category]: [English Sentence starting with capital letter or blank]
  const colonSimpleMatch = frontText.match(/^([^:]+):\s*([A-Z0-9_].*)$/);
  if (colonSimpleMatch && colonSimpleMatch[2].length > 5 && !isIndonesianText(colonSimpleMatch[2])) {
    return {
      categoryHint: colonSimpleMatch[1].trim(),
      mainText: colonSimpleMatch[2].trim(),
    };
  }

  return {
    categoryHint: null,
    mainText: frontText,
  };
};

/**
 * Prepares clean speech text for Web Speech Synthesis.
 * - ZERO Indonesian words: Automatically strips Indonesian prefixes like "Subjek jamak:" or "Pasif:".
 * - If the front text is an Indonesian prompt (e.g. translation exercises), falls back to speaking the English target sentence.
 * - Replaces fill-in-the-blank underscores (____) with a natural silent breathing pause on the front.
 * - On the flipped back side, plays the completed pure English sentence (never Indonesian explanation).
 */
export const getCleanSpeechText = (card, isFlipped) => {
  if (!card) return '';

  if (isFlipped) {
    return getTargetSpeechSentence(card);
  }

  const { front_text = '' } = card;

  // 1. If front_text has quoted English sentence (e.g. Subjek jamak: "My colleague and ______ attended...")
  const quoteMatch = front_text.match(/"([^"]+)"/);
  if (quoteMatch && quoteMatch[1]) {
    const candidate = quoteMatch[1];
    if (!isIndonesianText(candidate)) {
      return candidate
        .replace(/_+/g, ' ... ')
        .replace(/\(Pilihan:.*?\)/gi, '')
        .replace(/[*_`#]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  // 2. If front_text has colon (e.g. "Possessive pronoun: That blue umbrella...")
  if (front_text.includes(':')) {
    const afterColon = front_text.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
    if (afterColon && !isIndonesianText(afterColon)) {
      return afterColon
        .replace(/_+/g, ' ... ')
        .replace(/\(Pilihan:.*?\)/gi, '')
        .replace(/[*_`#]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  // 3. If front_text itself is primarily English (not an Indonesian prompt)
  if (!isIndonesianText(front_text)) {
    return front_text
      .replace(/_+/g, ' ... ')
      .replace(/\(Pilihan:.*?\)/gi, '')
      .replace(/[*_`#]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 4. Fallback for Indonesian prompts (e.g. "Template perkenalan diri...", "Ungkapan sopan: 'Saya paham...'"):
  // Speaks the English target sentence from the card so the learner hears native English, NEVER Indonesian!
  return getTargetSpeechSentence(card);
};

export default function Flashcard({
  card,
  isFlipped,
  onFlip,
  onToggleShadowing,
  isShadowingActive,
  onToggleAiExplainer,
  isAiExplainerActive,
}) {
  if (!card) return null;

  const { categoryHint, mainText } = parseFrontCardText(card.front_text);

  const handleCardClick = (e) => {
    // Physical haptic micro-vibration on mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(14);
      } catch {}
    }
    if (onFlip) onFlip(e);
  };

  const playPronunciation = (e) => {
    e.stopPropagation();
    const textToSpeak = getCleanSpeechText(card, isFlipped);
    if (!textToSpeak) return;
    ttsService.speak(textToSpeak);
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
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          handleCardClick(e);
        }
      }}
      className="w-full max-w-lg mx-auto h-[420px] sm:h-[460px] min-h-[410px] sm:min-h-[450px] cursor-pointer perspective-1000 select-none group focus:outline-none focus:ring-3 focus:ring-black rounded-3xl active:scale-[0.985] active:translate-y-0.5 transition-all duration-150"
    >
      <div
        className={`relative w-full h-full card-flip-inner ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE (English Active Recall) */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-5 sm:p-7 flex flex-col justify-between items-center text-center border-3 border-black shadow-[6px_6px_0px_#000] group-hover:shadow-[9px_9px_0px_#000] group-hover:-translate-y-0.5 group-active:shadow-[2px_2px_0px_#000] group-active:translate-y-1 transition-all duration-200 backface-hidden overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs shrink-0">
            <span className="font-black tracking-wider text-black bg-[#D4F63D] border-2 border-black shadow-[1px_1px_0px_#000] px-3 py-1 rounded-lg uppercase">
              English
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleAiExplainer) onToggleAiExplainer();
                }}
                title="Tanya Lala AI tentang kartu ini"
                aria-label="Tanya Lala AI tentang kartu ini"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black transition cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isAiExplainerActive
                    ? 'bg-[#FFD166] text-black'
                    : 'bg-white hover:bg-[#FFD166] text-black'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-black text-black" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleShadowing) onToggleShadowing();
                }}
                title="Latih pengucapan suara (Voice Shadowing)"
                aria-label="Latih pengucapan suara (Voice Shadowing)"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black transition cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isShadowingActive ? 'bg-[#70D6FF] text-black' : 'bg-white hover:bg-[#70D6FF] text-black'
                }`}
              >
                <Mic className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={playPronunciation}
                title="Dengarkan pengucapan audio"
                aria-label="Dengarkan pengucapan audio"
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-[#D4F63D] text-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="my-auto px-2 sm:px-4 space-y-2.5 w-full max-h-[250px] sm:max-h-[290px] overflow-y-auto overflow-x-hidden scrollbar-thin">
            {categoryHint && (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black px-3 py-1 rounded-lg bg-[#FF85C0] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                  📌 {categoryHint}
                </span>
              </div>
            )}
            <h2 className={`${
              (mainText || '').length > 70
                ? 'text-lg sm:text-xl'
                : 'text-xl sm:text-2xl md:text-3xl'
            } font-black text-black leading-snug break-words`}>
              {mainText}
            </h2>
            <p className="text-xs text-black/70 font-bold">Tebak arti &amp; jawabannya sebelum membalik kartu</p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs font-black text-black border-2 border-black px-3.5 py-1.5 rounded-xl bg-[#D4F63D] shadow-[2px_2px_0px_#000] group-hover:bg-[#FF85C0] group-hover:shadow-[3px_3px_0px_#000] group-active:translate-x-0.5 group-active:translate-y-0.5 transition-all duration-200">
            <RotateCw className="w-3.5 h-3.5 stroke-[2.5] group-hover:rotate-180 transition-transform duration-500" />
            <span>Klik atau Spasi untuk membalik</span>
          </div>
        </div>

        {/* BACK SIDE (Indonesian Meaning & Completed Context Sentence) */}
        <div className="absolute inset-0 w-full h-full bg-[#B388FF] text-black rounded-3xl p-5 sm:p-7 flex flex-col justify-between items-center text-center border-3 border-black shadow-[6px_6px_0px_#000] group-hover:shadow-[9px_9px_0px_#000] group-hover:-translate-y-0.5 group-active:shadow-[2px_2px_0px_#000] group-active:translate-y-1 transition-all duration-200 backface-hidden rotate-y-180 overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs shrink-0">
            <span className="font-black tracking-wider text-black bg-white border-2 border-black shadow-[1px_1px_0px_#000] px-3 py-1 rounded-lg uppercase">
              Arti &amp; Kunci Jawaban
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleAiExplainer) onToggleAiExplainer();
                }}
                title="Tanya Lala AI tentang kartu ini"
                aria-label="Tanya Lala AI tentang kartu ini"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black transition cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isAiExplainerActive
                    ? 'bg-[#FFD166] text-black'
                    : 'bg-white hover:bg-[#FFD166] text-black'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-black text-black" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleShadowing) onToggleShadowing();
                }}
                title="Latih pengucapan suara (Voice Shadowing)"
                aria-label="Latih pengucapan suara (Voice Shadowing)"
                className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black transition cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isShadowingActive ? 'bg-[#70D6FF] text-black' : 'bg-white hover:bg-[#70D6FF] text-black'
                }`}
              >
                <Mic className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={playPronunciation}
                title="Dengarkan pelafalan kalimat lengkap"
                aria-label="Dengarkan pelafalan kalimat lengkap"
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-[#D4F63D] text-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="my-auto px-2 sm:px-4 space-y-2.5 sm:space-y-3.5 w-full max-h-[250px] sm:max-h-[290px] overflow-y-auto overflow-x-hidden scrollbar-thin">
            <p className={`${
              (card.back_text || '').length > 60
                ? 'text-base sm:text-lg'
                : 'text-xl sm:text-2xl'
            } font-black text-black leading-relaxed break-words`}>
              {card.back_text}
            </p>

            {card.example_sentence && (
              <div className="bg-white rounded-2xl p-3 sm:p-3.5 border-2 border-black shadow-[3px_3px_0px_#000] max-w-sm mx-auto text-center">
                <p className="text-xs sm:text-[13px] text-black italic leading-snug font-bold break-words">
                  "{card.example_sentence}"
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-black text-black border-2 border-black px-3 py-1 rounded-xl bg-white shadow-[2px_2px_0px_#000] group-hover:bg-[#D4F63D] transition-colors">
            <RotateCw className="w-3.5 h-3.5 stroke-[2.5] group-hover:rotate-180 transition-transform duration-500" />
            <span>Pilih evaluasi di bawah atau ketuk untuk balik lagi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
