/**
 * Weekly Ranked Arena & Gamification System for MyLala
 * Mimics competitive game leagues (Bronze -> Diamond) with weekly resets every Sunday 23:59 WIB.
 */

export const TIERS = {
  BRONZE: {
    id: 'Bronze',
    name: 'Bronze League',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    badge: '🥉',
    minXp: 0,
    maxXp: 250,
    nextTier: 'Silver League',
    gradient: 'from-amber-700 to-amber-900',
  },
  SILVER: {
    id: 'Silver',
    name: 'Silver League',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    badge: '🥈',
    minXp: 251,
    maxXp: 650,
    nextTier: 'Gold League',
    gradient: 'from-slate-500 to-slate-700',
  },
  GOLD: {
    id: 'Gold',
    name: 'Gold League',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    badge: '🥇',
    minXp: 651,
    maxXp: 1300,
    nextTier: 'Platinum League',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
  },
  PLATINUM: {
    id: 'Platinum',
    name: 'Platinum League',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-300',
    badge: '💎',
    minXp: 1301,
    maxXp: 2500,
    nextTier: 'Diamond League',
    gradient: 'from-cyan-500 to-blue-600',
  },
  DIAMOND: {
    id: 'Diamond',
    name: 'Diamond League',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    badge: '👑',
    minXp: 2501,
    maxXp: Infinity,
    nextTier: null,
    gradient: 'from-purple-600 via-indigo-600 to-pink-600',
  },
};

export const getTierFromXP = (xp = 0) => {
  if (xp >= 2501) return TIERS.DIAMOND;
  if (xp >= 1301) return TIERS.PLATINUM;
  if (xp >= 651) return TIERS.GOLD;
  if (xp >= 251) return TIERS.SILVER;
  return TIERS.BRONZE;
};

/**
 * Calculates current ISO Week Identifier (e.g., '2026-W45')
 */
export const getCurrentWeekId = () => {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
};

/**
 * Computes remaining time until upcoming Sunday 23:59:59 WIB (UTC+7)
 */
export const getTimeUntilWeeklyReset = () => {
  const now = new Date();
  // Target: next Sunday 23:59:59
  const dayOfWeek = now.getDay(); // 0 is Sunday
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);

  if (target <= now) {
    target.setDate(target.getDate() + 7);
  }

  const diffMs = target - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return {
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    formatted: `${diffDays}h ${diffHours}j ${diffMinutes}m`,
  };
};

/**
 * Base peer contestants for the English League lobby (Empty for pure real-time data)
 */
export const PEER_CONTESTANTS = [];

