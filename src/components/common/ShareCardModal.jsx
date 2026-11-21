import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Smartphone, Square, Flame, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTierFromXP } from '../../utils/rankSystem';
import { drawShareCard } from '../../utils/cardCanvasDrawer';

export default function ShareCardModal({ isOpen, onClose, customStats = null }) {
  const { user, weeklyXp, streak, userProgress } = useAppStore();
  const canvasRef = useRef(null);

  const [format, setFormat] = useState('story'); // 'story' (9:16) | 'square' (1:1)
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute stats to display
  const effectiveName = customStats?.name || user?.name || 'Imam';
  const effectiveUsername = customStats?.username || user?.username || 'imam';
  const effectiveWeeklyXp = customStats?.weeklyXp !== undefined ? customStats.weeklyXp : (weeklyXp || 0);
  const effectiveStreak = customStats?.streak !== undefined ? customStats.streak : (streak || 1);
  const effectiveRank = customStats?.rank || 1;

  // Compute mastered cards count from userProgress
  const masteredCount = customStats?.masteredCards !== undefined
    ? customStats.masteredCards
    : Object.values(userProgress || {}).filter((p) => p && p.status === 'Mastered').length;

  const currentTier = getTierFromXP(effectiveWeeklyXp);

  // Draw card on canvas whenever modal opens or format changes
  useEffect(() => {
    if (!isOpen) return;

    const renderCard = (avatarImg = null) => {
      if (canvasRef.current) {
        drawShareCard(canvasRef.current, {
          format,
          name: effectiveName,
          username: effectiveUsername,
          tierName: currentTier.name,
          rank: effectiveRank,
          weeklyXp: effectiveWeeklyXp,
          streak: effectiveStreak,
          masteredCards: masteredCount,
          avatarImage: avatarImg,
        });
      }
    };

    // If user has an avatar URL, preload it before rendering
    if (user?.avatarUrl) {
      const img = new Image();
      img.onload = () => renderCard(img);
      img.onerror = () => renderCard(null);
      img.src = user.avatarUrl;
    } else {
      const timer = setTimeout(() => {
        renderCard(null);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, format, effectiveName, effectiveUsername, currentTier.name, effectiveRank, effectiveWeeklyXp, effectiveStreak, masteredCount, user?.avatarUrl]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Download PNG Image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `MyLala-Pencapaian-${effectiveUsername}-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to download share card image:', e);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // 2. Share via Web Share API
  const handleShare = async () => {
    if (!canvasRef.current) return;
    setSharing(true);

    const shareTitle = `Pencapaian MyLala - ${effectiveName}`;
    const shareText = `🚀 Aku lagi rajin belajar bahasa di MyLala PWA! Peringkat #${effectiveRank} ${currentTier.name} dengan ${effectiveWeeklyXp} XP & ${effectiveStreak} hari streak!\n\nYuk saingan belajar Active Recall bareng aku (gratis & offline-ready):`;
    const shareUrl = 'https://mylala.vercel.app';

    try {
      if (navigator.share) {
        // Attempt sharing image file if supported
        if (canvasRef.current.toBlob && navigator.canShare) {
          canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], `mylala-pencapaian-${effectiveUsername}.png`, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: shareTitle,
                  text: shareText,
                  url: shareUrl,
                });
                return;
              } catch {
                // If file share cancelled or unsupported, fallback to text share below
              }
            }
            // Fallback to text + url share
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
            });
          });
        } else {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
        }
      } else {
        // Fallback: Copy to clipboard
        handleCopyText();
      }
    } catch (e) {
      console.warn('Share dismissed or not supported:', e);
    } finally {
      setSharing(false);
    }
  };

  // 3. Copy viral caption to clipboard
  const handleCopyText = async () => {
    const text = `🚀 Aku lagi rajin belajar bahasa di MyLala PWA!\n🏆 Posisi saat ini: ${currentTier.badge} ${currentTier.name} (Peringkat #${effectiveRank}) dengan ${effectiveWeeklyXp} XP & ${effectiveStreak} hari streak!\n\nYuk saingan belajar Active Recall bareng aku (gratis & jalan offline):\n👉 https://mylala.vercel.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col max-h-[92vh] text-black">
        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b-2.5 border-black flex items-center justify-between bg-[#FF85C0]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] text-black">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-black uppercase">Bagikan Pencapaian</h3>
              <p className="text-xs text-black/70 font-bold">Pamerkan progres liga &amp; kartu belajar kamu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 flex flex-col items-center bg-[#F8FAFC]">
          {/* Format Selector: Story (9:16) vs Square (1:1) */}
          <div className="grid grid-cols-2 p-1.5 bg-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] w-full max-w-xs text-xs font-black gap-1.5">
            <button
              onClick={() => setFormat('story')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                format === 'story'
                  ? 'bg-[#D4F63D] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Story (9:16)</span>
            </button>
            <button
              onClick={() => setFormat('square')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                format === 'square'
                  ? 'bg-[#D4F63D] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              <Square className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Persegi (1:1)</span>
            </button>
          </div>

          {/* Interactive Card Canvas Live Preview */}
          <div className="relative rounded-2xl overflow-hidden border-3 border-black shadow-[4px_4px_0px_#000] bg-[#FFFDF0] flex items-center justify-center max-h-[50vh]">
            <canvas
              ref={canvasRef}
              className={`block max-h-[48vh] w-auto h-auto object-contain transition-all duration-300 ${
                format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            />
          </div>

          <p className="text-[11px] text-black/70 font-bold text-center">
            Format dioptimalkan untuk Instagram Story, WhatsApp Status, LinkedIn &amp; Telegram.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t-2.5 border-black bg-white space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Download PNG Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-black shadow-[3px_3px_0px_#000] text-black font-black text-xs sm:text-sm active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{downloading ? 'Mengunduh...' : 'Unduh PNG'}</span>
            </button>

            {/* Native Share Button */}
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#70D6FF] hover:bg-[#5ac8f5] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>{sharing ? 'Membagikan...' : 'Bagikan Status'}</span>
            </button>
          </div>

          {/* Copy Caption Button */}
          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FFD166] hover:bg-[#f6c24b] border-2 border-black shadow-[2px_2px_0px_#000] text-black font-black text-xs active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Teks Status Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Salin Teks Status &amp; Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

