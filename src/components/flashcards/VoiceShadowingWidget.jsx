import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RotateCcw, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  getSpeechRecognitionInstance,
  evaluatePronunciation,
} from '../../utils/speechRecognition';
import { useAppStore } from '../../store/useAppStore';

export default function VoiceShadowingWidget({ targetSentence, cardId, isFlipped }) {
  const { addXP } = useAppStore();

  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [awardedXP, setAwardedXP] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  const recognitionRef = useRef(null);

  // Check support on mount
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  // Reset state when card changes
  useEffect(() => {
    setIsListening(false);
    setLiveTranscript('');
    setEvaluation(null);
    setAwardedXP(false);
    setErrorNotice(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
  }, [cardId]);

  // Clean reference sentence (strips fill-in-the-blank underscores or brackets)
  const cleanTarget = (targetSentence || '')
    .replace(/_+/g, ' ')
    .replace(/\(Pilihan:.*?\)/gi, '')
    .replace(/[*_`#]/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Play reference native audio
  const playReferenceAudio = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanTarget);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 2. Start speech recognition recording
  const startRecording = (e) => {
    if (e) e.stopPropagation();
    setErrorNotice(null);
    setLiveTranscript('');
    setEvaluation(null);

    const recognition = getSpeechRecognitionInstance();
    if (!recognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const current = (finalTranscript || interimTranscript).trim();
      setLiveTranscript(current);

      // If we got a final transcript, evaluate immediately
      if (finalTranscript) {
        handleFinishSpeaking(finalTranscript);
      }
    };

    recognition.onerror = (err) => {
      console.warn('Speech recognition error:', err.error);
      setIsListening(false);
      if (err.error === 'not-allowed') {
        setErrorNotice('Izin mikrofon belum diberikan. Silakan izinkan akses mikrofon di browser.');
      } else if (err.error === 'no-speech') {
        setErrorNotice('Tidak ada suara terdengar. Silakan coba lagi lebih dekat.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Fallback: evaluate liveTranscript if recognition ended without final flag
      setLiveTranscript((prev) => {
        if (prev && !evaluation) {
          handleFinishSpeaking(prev);
        }
        return prev;
      });
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setIsListening(false);
    }
  };

  // 3. Stop speech recognition manually
  const stopRecording = (e) => {
    if (e) e.stopPropagation();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // 4. Finish and evaluate speech
  const handleFinishSpeaking = (spokenText) => {
    const result = evaluatePronunciation(cleanTarget, spokenText);
    setEvaluation(result);

    // Award bonus XP if score >= 65% (only once per card session)
    if (result.xpBonus > 0 && !awardedXP) {
      addXP(result.xpBonus, `Latihan Pelafalan Suara (${result.score}%)`);
      setAwardedXP(true);
    }
  };

  if (!cleanTarget) return null;

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-800 text-white shadow-md space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>Voice Shadowing &amp; Pelafalan</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/60 text-indigo-200 font-normal">
                AI Pronunciation
              </span>
            </h4>
          </div>
        </div>

        {/* Listen native reference audio */}
        <button
          onClick={playReferenceAudio}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold transition"
          title="Dengarkan contoh pengucapan native"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Contoh Audio</span>
        </button>
      </div>

      {/* Target reference text to shadow */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Target Kalimat yang Ditirukan:
        </p>
        <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic">
          "{cleanTarget}"
        </p>
      </div>

      {/* Unsupported browser fallback */}
      {!isSupported && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Speech Recognition didukung penuh di Google Chrome, Edge, dan Safari. Silakan gunakan browser tersebut untuk latihan suara.
          </span>
        </div>
      )}

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Mic Record Button & Audio Wave Animation */}
      {isSupported && (
        <div className="flex flex-col items-center justify-center pt-1 space-y-2">
          {isListening ? (
            <div className="flex flex-col items-center gap-2">
              {/* Pulsing Recording Button */}
              <button
                onClick={stopRecording}
                className="relative p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition active:scale-95 cursor-pointer animate-pulse"
                title="Tekan untuk selesai berbicara"
              >
                <span className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping" />
                <Mic className="w-6 h-6 relative z-10" />
              </button>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Mendengarkan ucapan Anda... Klik mic saat selesai</span>
              </div>
            </div>
          ) : (
            <button
              onClick={startRecording}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>{evaluation ? 'Ulangi Latihan Suara' : 'Mulai Latih Pelafalan (Bicara)'}</span>
            </button>
          )}

          {/* Live transcript while speaking */}
          {liveTranscript && (
            <div className="w-full text-center text-xs text-indigo-200 bg-slate-950/60 p-2 rounded-lg italic">
              "{liveTranscript}"
            </div>
          )}
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 animate-fade-in">
          {/* Score & Badge Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  evaluation.score >= 85
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : evaluation.score >= 65
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                Akurasi: {evaluation.score}%
              </span>
              {evaluation.xpBonus > 0 && (
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> +{evaluation.xpBonus} XP Bonus!
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {evaluation.grade === 'perfect' ? '🌟 Sempurna' : evaluation.grade === 'good' ? '👍 Bagus' : '💪 Coba Lagi'}
            </span>
          </div>

          <p className="text-xs text-slate-200">{evaluation.feedback}</p>

          {/* Word-by-word visual color feedback */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 block mb-1">Analisis Kata per Kata:</span>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.words.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                    item.isMatch
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                  title={item.isMatch ? 'Pengucapan tepat' : 'Perlu diperbaiki'}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

