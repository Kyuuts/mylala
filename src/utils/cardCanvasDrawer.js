/**
 * Ultra-Crisp Canvas Generator for MyLala Social Share Cards
 * 100% Neo-Brutalism Design System:
 * - High-contrast vibrant palettes
 * - Bold black borders (4px - 6px)
 * - Hard solid black drop-shadows (no blur)
 * - Sharp typography and clean badge pills
 * Generates 1080x1920 (Story 9:16) and 1080x1080 (Square 1:1) high-definition viral cards
 * for WhatsApp Status, Instagram Stories, LinkedIn, and Telegram.
 */

// Tier Themes with Vibrant Neo-Brutalist Color Accents
const TIER_THEMES = {
  Bronze: {
    bgCanvas: '#FFF1E6',
    accentColor: '#FFD166',
    badge: '🥉',
    title: 'Bronze League',
    tagBg: '#FF85C0',
  },
  Silver: {
    bgCanvas: '#F1F5F9',
    accentColor: '#70D6FF',
    badge: '🥈',
    title: 'Silver League',
    tagBg: '#D4F63D',
  },
  Gold: {
    bgCanvas: '#FEF9C3',
    accentColor: '#FFD166',
    badge: '🥇',
    title: 'Gold League',
    tagBg: '#FF85C0',
  },
  Platinum: {
    bgCanvas: '#E0F2FE',
    accentColor: '#70D6FF',
    badge: '💎',
    title: 'Platinum League',
    tagBg: '#D4F63D',
  },
  Diamond: {
    bgCanvas: '#F3E8FF',
    accentColor: '#B388FF',
    badge: '👑',
    title: 'Diamond League',
    tagBg: '#70D6FF',
  },
};

/**
 * Helper to draw rounded rectangle with fallback
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
 * Helper to draw a Neo-Brutalist Box with solid offset shadow & solid border
 */
function drawNeoBox(ctx, x, y, width, height, radius, bgColor, shadowOffset = 8, borderWidth = 4) {
  // 1. Solid Black Offset Shadow
  if (shadowOffset > 0) {
    ctx.save();
    drawRoundedRect(ctx, x + shadowOffset, y + shadowOffset, width, height, radius);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.restore();
  }

  // 2. Main Box Fill & Solid Black Stroke
  ctx.save();
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = borderWidth;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw complete viral share card onto HTML5 Canvas in Neo-Brutalism Aesthetic
 */
export function drawShareCard(canvas, data) {
  if (!canvas) return;

  const {
    format = 'story', // 'story' (9:16) | 'square' (1:1)
    name = 'Pembelajar MyLala',
    username = 'learner',
    tierName = 'Gold League',
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
  const tierKey =
    Object.keys(TIER_THEMES).find((k) =>
      (tierName || '').toLowerCase().includes(k.toLowerCase())
    ) || 'Gold';
  const theme = TIER_THEMES[tierKey];

  // ==========================================
  // 1. BASE BACKGROUND & RETRO DOT GRID
  // ==========================================
  ctx.fillStyle = theme.bgCanvas;
  ctx.fillRect(0, 0, width, height);

  // Subtle Neo-Brutalist dot grid pattern
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  const dotSpacing = 36;
  for (let x = 18; x < width; x += dotSpacing) {
    for (let y = 18; y < height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer framing border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // ==========================================
  // 2. BRAND WATERMARK CAPSULE
  // ==========================================
  const topMargin = isStory ? 110 : 55;
  const pillW = 440;
  const pillH = 64;
  const pillX = (width - pillW) / 2;
  const pillY = topMargin;

  drawNeoBox(ctx, pillX, pillY, pillW, pillH, 20, '#D4F63D', 6, 4);

  ctx.fillStyle = '#000000';
  ctx.font = '900 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ MYLALA • ACTIVE RECALL', width / 2, pillY + pillH / 2);

  // ==========================================
  // 3. USER HERO PROFILE
  // ==========================================
  const heroY = isStory ? 320 : 190;
  const avatarRadius = 76;

  // Avatar shadow & border
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2 + 8, heroY + 8, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, heroY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.stroke();

  if (avatarImage && avatarImage.complete && avatarImage.naturalWidth > 0) {
    ctx.clip();
    ctx.drawImage(
      avatarImage,
      width / 2 - avatarRadius,
      heroY - avatarRadius,
      avatarRadius * 2,
      avatarRadius * 2
    );
  } else {
    ctx.font = '72px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(theme.badge || '🌟', width / 2, heroY + 4);
  }
  ctx.restore();

  // User Name
  ctx.fillStyle = '#000000';
  ctx.font = '900 52px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const nameY = heroY + 115;
  ctx.fillText(name, width / 2, nameY);

  // Username Pill Badge
  const userTagW = 380;
  const userTagH = 46;
  const userTagX = (width - userTagW) / 2;
  const userTagY = nameY + 16;
  drawNeoBox(ctx, userTagX, userTagY, userTagW, userTagH, 14, '#FFFFFF', 4, 3);

  ctx.fillStyle = '#000000';
  ctx.font = '800 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`@${username} • Language Achiever`, width / 2, userTagY + userTagH / 2);

  // ==========================================
  // 4. MAIN ACHIEVEMENT HIGHLIGHT CARD
  // ==========================================
  const cardX = 80;
  const cardW = width - cardX * 2;
  const cardY = isStory ? 580 : 380;
  const cardH = isStory ? 790 : 470;

  drawNeoBox(ctx, cardX, cardY, cardW, cardH, 36, '#FFFFFF', 10, 5);

  // League Sub-Badge
  const bannerW = 460;
  const bannerH = 50;
  const bannerX = (width - bannerW) / 2;
  const bannerY = cardY + 45;
  drawNeoBox(ctx, bannerX, bannerY, bannerW, bannerH, 16, '#FFD166', 4, 3);

  ctx.fillStyle = '#000000';
  ctx.font = '900 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏆 PENCAPAIAN LIGA MINGGUAN', width / 2, bannerY + bannerH / 2);

  // Big League Title
  ctx.fillStyle = '#000000';
  ctx.font = '900 58px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`${theme.badge} ${theme.title}`, width / 2, bannerY + 120);

  // Divider Line
  ctx.beginPath();
  ctx.moveTo(cardX + 50, bannerY + 155);
  ctx.lineTo(cardX + cardW - 50, bannerY + 155);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // ==========================================
  // 5. STATS 4-GRID (Rank, Weekly XP, Streak, Mastered)
  // ==========================================
  const statsStartY = bannerY + 185;

  if (isStory) {
    // 2x2 Grid for vertical 9:16 layout
    const gridCols = [cardX + 45, cardX + cardW / 2 + 15];
    const colW = cardW / 2 - 60;
    const cellH = 185;

    const statsList = [
      { label: 'Peringkat', val: `#${rank}`, sub: 'di Klasemen', bg: '#FFD166', icon: '🏆' },
      { label: 'XP Mingguan', val: `${weeklyXp}`, sub: 'Poin Belajar', bg: '#70D6FF', icon: '⚡' },
      { label: 'Daily Streak', val: `${streak} Hari`, sub: 'Belajar Konsisten', bg: '#FF85C0', icon: '🔥' },
      { label: 'Kartu Dikuasai', val: `${masteredCards}`, sub: 'Active Recall SM-2', bg: '#D4F63D', icon: '🧠' },
    ];

    statsList.forEach((stat, idx) => {
      const colX = gridCols[idx % 2];
      const rowY = statsStartY + Math.floor(idx / 2) * (cellH + 24);

      drawNeoBox(ctx, colX, rowY, colW, cellH, 24, stat.bg, 6, 4);

      // Icon & Label
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#000000';
      ctx.font = '800 24px system-ui, sans-serif';
      ctx.fillText(`${stat.icon} ${stat.label}`, colX + 26, rowY + 46);

      // Value
      ctx.fillStyle = '#000000';
      ctx.font = '900 48px system-ui, -apple-system, sans-serif';
      ctx.fillText(stat.val, colX + 26, rowY + 112);

      // Subtext
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.fillText(stat.sub, colX + 26, rowY + 152);
    });
  } else {
    // 4 Columns horizontal row for 1:1 Square layout
    const itemW = (cardW - 80) / 4;
    const statsList = [
      { label: 'Peringkat', val: `#${rank}`, bg: '#FFD166', icon: '🏆' },
      { label: 'Weekly XP', val: `${weeklyXp}`, bg: '#70D6FF', icon: '⚡' },
      { label: 'Streak', val: `${streak} Hari`, bg: '#FF85C0', icon: '🔥' },
      { label: 'Mastered', val: `${masteredCards}`, bg: '#D4F63D', icon: '🧠' },
    ];

    statsList.forEach((stat, idx) => {
      const itemX = cardX + 35 + idx * itemW;
      const boxW = itemW - 14;
      const boxY = statsStartY + 10;
      const boxH = 150;

      drawNeoBox(ctx, itemX, boxY, boxW, boxH, 20, stat.bg, 5, 3.5);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#000000';
      ctx.font = '800 22px system-ui, sans-serif';
      ctx.fillText(`${stat.icon} ${stat.label}`, itemX + boxW / 2, boxY + 45);

      ctx.fillStyle = '#000000';
      ctx.font = '900 42px system-ui, -apple-system, sans-serif';
      ctx.fillText(stat.val, itemX + boxW / 2, boxY + 108);
    });
  }

  // ==========================================
  // 6. MOTIVATIONAL QUOTE & CALL TO ACTION
  // ==========================================
  if (isStory) {
    // Speech Bubble Quote
    const quoteW = cardW;
    const quoteH = 95;
    const quoteX = cardX;
    const quoteY = cardY + cardH + 45;

    drawNeoBox(ctx, quoteX, quoteY, quoteW, quoteH, 24, '#FFFFFF', 6, 3.5);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.font = 'italic 800 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('“15 menit belajar aktif sehari, kuasai bahasa tanpa pusing.”', width / 2, quoteY + quoteH / 2);

    // Call To Action Box (Bottom)
    const ctaW = cardW;
    const ctaH = 145;
    const ctaX = cardX;
    const ctaY = height - 260;

    drawNeoBox(ctx, ctaX, ctaY, ctaW, ctaH, 28, '#D4F63D', 8, 4.5);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#000000';
    ctx.font = '900 36px system-ui, -apple-system, sans-serif';
    ctx.fillText('Ayo Saingan Belajar Bareng Aku! 🚀', width / 2, ctaY + 62);

    ctx.fillStyle = '#000000';
    ctx.font = '800 26px system-ui, -apple-system, sans-serif';
    ctx.fillText('mylala.vercel.app • Gratis & Jalan Offline', width / 2, ctaY + 110);

    // Footer copyright / signature
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.font = '700 22px system-ui, sans-serif';
    ctx.fillText('MyLala PWA • Active Recall & Spaced Repetition', width / 2, height - 48);
  } else {
    // Square bottom bar
    const ctaW = cardW;
    const ctaH = 90;
    const ctaX = cardX;
    const ctaY = height - 135;

    drawNeoBox(ctx, ctaX, ctaY, ctaW, ctaH, 22, '#D4F63D', 6, 4);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.font = '900 30px system-ui, -apple-system, sans-serif';
    ctx.fillText('Kuasai Bahasa Asing di 👉 mylala.vercel.app (Gratis & Offline)', width / 2, ctaY + ctaH / 2);
  }
}
