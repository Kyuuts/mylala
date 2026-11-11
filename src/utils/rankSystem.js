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
 * Base peer contestants for the English League lobby
 */
export const PEER_CONTESTANTS = [
  { id: 'peer-1', name: 'Sarah Kirana', avatar: '👩‍🎓', streak: 9, weeklyXp: 340, cardsReviewed: 28 },
  { id: 'peer-2', name: 'Budi Santoso', avatar: '👨‍💻', streak: 6, weeklyXp: 285, cardsReviewed: 24 },
  { id: 'peer-3', name: 'Nadia Pratama', avatar: '👩‍💼', streak: 5, weeklyXp: 230, cardsReviewed: 19 },
  { id: 'peer-4', name: 'Rizky Dwi', avatar: '🧑‍🚀', streak: 4, weeklyXp: 195, cardsReviewed: 16 },
  { id: 'peer-5', name: 'Farhan Azhar', avatar: '👨‍🎨', streak: 3, weeklyXp: 160, cardsReviewed: 13 },
  { id: 'peer-6', name: 'Alya Maharani', avatar: '👩‍🔬', streak: 2, weeklyXp: 110, cardsReviewed: 9 },
  { id: 'peer-7', name: 'Dimas Aditya', avatar: '🧑‍💻', streak: 1, weeklyXp: 75, cardsReviewed: 6 },
  { id: 'peer-8', name: 'Tiara Safitri', avatar: '👩‍🎓', streak: 1, weeklyXp: 40, cardsReviewed: 3 },
  { id: 'peer-9', name: 'Kevin Christian', avatar: '👨‍🏫', streak: 0, weeklyXp: 20, cardsReviewed: 2 },
];

