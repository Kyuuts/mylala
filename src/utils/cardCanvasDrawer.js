/**
 * Ultra-Crisp Canvas Generator for MyLala Social Share Cards
 * Generates 1080x1920 (Story 9:16) and 1080x1080 (Square 1:1) high-definition viral cards
 * for WhatsApp Status, Instagram Stories, LinkedIn, and Telegram.
 */

// Theme palettes mapped by League Tier
const TIER_THEMES = {
  Bronze: {
    bgTop: '#1E140A',
    bgBottom: '#451A03',
    glowColor: 'rgba(217, 119, 6, 0.35)',
    accent: '#F59E0B',
    accentLight: '#FDE68A',
    badge: '🥉',
    title: 'Bronze League',
  },
  Silver: {
    bgTop: '#0F172A',
    bgBottom: '#1E293B',
    glowColor: 'rgba(148, 163, 184, 0.35)',
    accent: '#94A3B8',
    accentLight: '#F1F5F9',
    badge: '🥈',
    title: 'Silver League',
  },
  Gold: {
    bgTop: '#1C1300',
    bgBottom: '#713F12',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    accent: '#FBBF24',
    accentLight: '#FEF3C7',
    badge: '🥇',
    title: 'Gold League',
  },
  Platinum: {
    bgTop: '#022C22',
    bgBottom: '#0E4F5A',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accent: '#22D3EE',
    accentLight: '#CFFAFE',
    badge: '💎',
    title: 'Platinum League',
  },
  Diamond: {
    bgTop: '#17092B',
    bgBottom: '#4C1D95',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    accent: '#C084FC',
    accentLight: '#F3E8FF',
    badge: '👑',
    title: 'Diamond League',
  },
};

/**
 * Helper to draw rounded rectangle with fallback for older canvas implementations
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draw complete viral share card onto HTML5 Canvas
 */
export function drawShareCard(canvas, data) {
  if (!canvas) return;

  const {
    format = 'story', // 'story' (9:16) | 'square' (1:1)
    name = 'Pembelajar MyLala',
    username = 'learner',
    tierName = 'Bronze League',
    rank = 1,
    weeklyXp = 0,
    streak = 1,
    masteredCards = 0,
    avatarImage = null,
  } = data;

  const isStory = format === 'story';
  const width = 1080;
  const height = isStory ? 1920 : 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Determine tier theme
  const tierKey = Object.keys(TIER_THEMES).find((k) =>
    (tierName || '').toLowerCase().includes(k.toLowerCase())
  ) || 'Bronze';
  const theme = TIER_THEMES[tierKey];

  // ==========================================
  // 1. BACKGROUND WITH VIBRANT RADIAL GLOWS
  // ==========================================
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, theme.bgTop);
  bgGrad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Ambient top light glow
  const topGlow = ctx.createRadialGradient(width * 0.5, isStory ? 350 : 250, 50, width * 0.5, isStory ? 350 : 250, 700);
  topGlow.addColorStop(0, theme.glowColor);
  topGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle bottom accent glow
  const bottomGlow = ctx.createRadialGradient(width * 0.8, height * 0.85, 50, width * 0.8, height * 0.85, 600);
  bottomGlow.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
  bottomGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, width, height);

  // ==========================================
  // 2. BRAND WATERMARK & APP IDENTITY
  // ==========================================
  const topMargin = isStory ? 130 : 70;

  // App Brand Capsule
  const brandPillY = topMargin;
  ctx.save();
  drawRoundedRect(ctx, width / 2 - 240, brandPillY, 480, 72, 36);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MyLala • Active Recall', width / 2, brandPillY + 36);

  // ==========================================
  // 3. USER HERO PROFILE & BADGE
  // ==========================================
  const heroY = isStory ? 340 : 210;

  // Outer glowing ring for avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, heroY, 78, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fill();
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 6;
  ctx.shadowColor = theme.accent;
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.restore();

  // Avatar inside circle (User Photo/Avatar if provided, else Tier Badge)
  if (avatarImage && avatarImage.complete && avatarImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, heroY, 74, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImage, width / 2 - 74, heroY - 74, 148, 148);
    ctx.restore();
  } else {
    ctx.font = '72px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(theme.badge || '🌟', width / 2, heroY + 4);
  }

  // User Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const nameY = heroY + 120;
  ctx.fillText(name, width / 2, nameY);

  // User Tagline / Campus identity
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '500 28px system-ui, -apple-system, sans-serif';
  ctx.fillText(`@${username} • Active Language Learner`, width / 2, nameY + 44);

  // ==========================================
  // 4. MAIN ACHIEVEMENT HIGHLIGHT CARD
  // ==========================================
  const cardX = 90;
  const cardW = width - cardX * 2;
  const cardY = isStory ? 600 : 410;
  const cardH = isStory ? 760 : 430;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Tier Banner inside card
  const bannerY = cardY + 60;
  ctx.fillStyle = theme.accentLight;
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PENCAPAIAN LIGA MINGGUAN', width / 2, bannerY);

  // Current League Title with Badge
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'extrabold 56px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${theme.badge} ${theme.title}`, width / 2, bannerY + 65);

  // Divider Line inside card
  ctx.beginPath();
  ctx.moveTo(cardX + 60, bannerY + 105);
  ctx.lineTo(cardX + cardW - 60, bannerY + 105);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ==========================================
  // 5. STATS 4-GRID (Rank, Weekly XP, Streak, Mastered)
  // ==========================================
  const statsStartY = bannerY + 140;

  if (isStory) {
    // 2x2 Grid for vertical 9:16 layout
    const gridCols = [cardX + 50, cardX + cardW / 2 + 20];
    const colW = cardW / 2 - 70;
    const cellH = 175;

    const statsList = [
      { label: 'Peringkat', val: `#${rank}`, sub: 'di Klasemen', color: theme.accent, icon: '🏆' },
      { label: 'XP Mingguan', val: `${weeklyXp}`, sub: 'Poin Belajar', color: '#38BDF8', icon: '⚡' },
      { label: 'Daily Streak', val: `${streak} Hari`, sub: 'Belajar Konsisten', color: '#FB923C', icon: '🔥' },
      { label: 'Kartu Dikuasai', val: `${masteredCards}`, sub: 'Active Recall SM-2', color: '#4ADE80', icon: '🧠' },
    ];

    statsList.forEach((stat, idx) => {
      const colX = gridCols[idx % 2];
      const rowY = statsStartY + Math.floor(idx / 2) * (cellH + 25);

      ctx.save();
      drawRoundedRect(ctx, colX, rowY, colW, cellH, 24);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Icon & Label
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 24px system-ui, sans-serif';
      ctx.fillText(`${stat.icon} ${stat.label}`, colX + 28, rowY + 44);

      // Value
      ctx.fillStyle = stat.color;
      ctx.font = 'extrabold 48px system-ui, -apple-system, sans-serif';
      ctx.fillText(stat.val, colX + 28, rowY + 104);

      // Subtext
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '500 20px system-ui, sans-serif';
      ctx.fillText(stat.sub, colX + 28, rowY + 142);
    });
  } else {
    // 4 Columns horizontal row for 1:1 Square layout
    const itemW = (cardW - 80) / 4;
    const statsList = [
      { label: 'Peringkat', val: `#${rank}`, color: theme.accent },
      { label: 'Weekly XP', val: `${weeklyXp}`, color: '#38BDF8' },
      { label: 'Streak', val: `${streak} Hari`, color: '#FB923C' },
      { label: 'Mastered', val: `${masteredCards}`, color: '#4ADE80' },
    ];

    statsList.forEach((stat, idx) => {
      const itemX = cardX + 40 + idx * itemW;
      const boxW = itemW - 16;
      const boxY = statsStartY + 10;
      const boxH = 140;

      ctx.save();
      drawRoundedRect(ctx, itemX, boxY, boxW, boxH, 20);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(stat.label, itemX + boxW / 2, boxY + 42);

      ctx.fillStyle = stat.color;
      ctx.font = 'extrabold 44px system-ui, -apple-system, sans-serif';
      ctx.fillText(stat.val, itemX + boxW / 2, boxY + 102);
    });
  }

  // ==========================================
  // 6. MOTIVATIONAL QUOTE & CALL TO ACTION
  // ==========================================
  if (isStory) {
    const quoteY = cardY + cardH + 75;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'italic 30px system-ui, -apple-system, sans-serif';
    ctx.fillText('“15 menit belajar aktif sehari, kuasai bahasa baru tanpa pusing.”', width / 2, quoteY);

    // Call To Action Box (Bottom)
    const ctaY = height - 240;
    ctx.save();
    drawRoundedRect(ctx, cardX, ctaY, cardW, 130, 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 30;
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'extrabold 32px system-ui, -apple-system, sans-serif';
    ctx.fillText('Ayo Saingan Belajar Bareng Aku! 🚀', width / 2, ctaY + 52);

    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('Kunjungi: mylala.vercel.app (Gratis & Offline)', width / 2, ctaY + 94);

    // Footer copyright / signature
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText('MyLala PWA • Active Recall & Spaced Repetition', width / 2, height - 55);
  } else {
    // Square bottom bar
    const ctaY = height - 140;
    ctx.save();
    drawRoundedRect(ctx, cardX, ctaY, cardW, 85, 24);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'extrabold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('Kuasai Bahasa Asing di 👉 mylala.vercel.app', width / 2, ctaY + 48);
  }
}

