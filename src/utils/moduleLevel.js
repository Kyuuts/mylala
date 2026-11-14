/**
 * CEFR-Aligned Curriculum Level Framework for MyLala
 * Standards: A1 (Breakthrough) -> C1 (Operational Proficiency)
 */

export const CEFR_LEVELS = {
  A1: {
    id: 'A1',
    code: 'A1',
    title: 'The Explorer',
    role: 'Penjelajah',
    shortLabel: 'A1 Explorer',
    badge: '🌱',
    tagline: 'Survival English & Fondasi Kalimat',
    description: 'Perkenalan diri, pesan makanan, dan tanya arah tanpa panik.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    badgeDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
    borderCard: 'hover:border-emerald-300',
    color: 'emerald',
  },
  A2: {
    id: 'A2',
    code: 'A2',
    title: 'The Voyager',
    role: 'Pengelana Mandiri',
    shortLabel: 'A2 Voyager',
    badge: '🧭',
    tagline: 'Daily Life & Percakapan Rutin',
    description: 'Belanja, ceritakan rutinitas, dan pahami instruksi sehari-hari.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/90',
    badgeDark: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    dotClass: 'bg-teal-500',
    borderCard: 'hover:border-teal-300',
    color: 'teal',
  },
  B1: {
    id: 'B1',
    code: 'B1',
    title: 'The Global Citizen',
    role: 'Warga Global',
    shortLabel: 'B1 Citizen',
    badge: '🌍',
    tagline: 'Work, Travel & Fluency',
    description: 'Utarakan opini, ceritakan impian, dan meeting santai di tempat kerja.',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/90',
    badgeDark: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    dotClass: 'bg-sky-500',
    borderCard: 'hover:border-sky-300',
    color: 'sky',
  },
  B2: {
    id: 'B2',
    code: 'B2',
    title: 'The Diplomat',
    role: 'Negosiator Lihai',
    shortLabel: 'B2 Diplomat',
    badge: '💼',
    tagline: 'Professional & Academic Fluency',
    description: 'Wawancara kerja, diskusi profesional, dan tonton podcast tanpa subtitle.',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/90',
    badgeDark: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-500',
    borderCard: 'hover:border-indigo-300',
    color: 'indigo',
  },
  C1: {
    id: 'C1',
    code: 'C1',
    title: 'The Mastermind',
    role: 'Pakar Bahasa',
    shortLabel: 'C1 Mastermind',
    badge: '👑',
    tagline: 'Nuance & Advanced Mastery',
    description: 'Inversi formal, idiom tingkat tinggi, debat tajam, dan baca jurnal ilmiah.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/90',
    badgeDark: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-500',
    borderCard: 'hover:border-purple-300',
    color: 'purple',
  },
};

// Backward-compatible mapping for existing filters
export const MODULE_LEVELS = {
  STARTER: CEFR_LEVELS.A1,
  INTERMEDIATE: CEFR_LEVELS.B1,
  ADVANCED: CEFR_LEVELS.C1,
};

export const CEFR_LEVEL_LIST = [
  CEFR_LEVELS.A1,
  CEFR_LEVELS.A2,
  CEFR_LEVELS.B1,
  CEFR_LEVELS.B2,
  CEFR_LEVELS.C1,
];

export const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Evaluates the module's CEFR level against the user's active CEFR level:
 * - 'current': matches user level (green emerald, recommended)
 * - 'next': 1 level above user (amber, next challenge, soft lock advisory)
 * - 'advanced': 2+ levels above user (slate, not recommended yet, soft lock advisory)
 * - 'passed': level below user (teal/slate, foundation mastered)
 */
export const getModuleJourneyStatus = (moduleCefrCode, userCefrCode = 'A1') => {
  const modCode = (moduleCefrCode || 'A1').toUpperCase();
  const userCode = (userCefrCode || 'A1').toUpperCase();

  const modIdx = CEFR_ORDER.indexOf(modCode);
  const userIdx = CEFR_ORDER.indexOf(userCode);

  if (modIdx === -1 || userIdx === -1 || modIdx === userIdx) {
    return {
      status: 'current',
      isCurrentLevel: true,
      badgeText: '🟢 JALUR UTAMAMU',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30',
      softLock: false,
    };
  }

  if (modIdx === userIdx + 1) {
    return {
      status: 'next',
      isNextLevel: true,
      badgeText: '⏳ TANTANGAN BERIKUTNYA',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/20',
      softLock: true,
    };
  }

  if (modIdx > userIdx + 1) {
    return {
      status: 'advanced',
      isAdvanced: true,
      badgeText: '🔒 BELUM DISARANKAN',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      softLock: true,
    };
  }

  // modIdx < userIdx (Foundation already mastered)
  return {
    status: 'passed',
    isPassed: true,
    badgeText: '✓ DASAR DIKUASAI',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    softLock: false,
  };
};

/**
 * Detects the CEFR level of a given module
 */
export const getModuleLevel = (module) => {
  if (!module) return CEFR_LEVELS.B1;

  // Direct CEFR code property
  const explicitCefr = (module.cefr_level || module.cefr || '').toUpperCase();
  if (CEFR_LEVELS[explicitCefr]) {
    return CEFR_LEVELS[explicitCefr];
  }

  const levelProp = (module.level || '').toLowerCase();
  const id = (module.id || '').toLowerCase();
  const title = (module.title || '').toLowerCase();

  // A1: Starter SVO, Greetings
  if (
    id.includes('starter-svo') ||
    title.includes('fondasi struktur') ||
    title.includes('subjek') ||
    levelProp === 'a1'
  ) {
    return CEFR_LEVELS.A1;
  }

  // A2: Starter Tenses, Everyday conversation
  if (
    id.includes('starter-tenses') ||
    id.includes('starter-conversation') ||
    title.includes('tenses utama') ||
    title.includes('percakapan sehari-hari') ||
    levelProp === 'a2' ||
    levelProp === 'starter' ||
    levelProp === 'pemula'
  ) {
    return CEFR_LEVELS.A2;
  }

  // B1: General Idioms, Expressing Opinions
  if (
    id.includes('conv-idioms') ||
    id.includes('conv-opinions') ||
    title.includes('opini') ||
    levelProp === 'b1' ||
    levelProp === 'intermediate'
  ) {
    return CEFR_LEVELS.B1;
  }

  // B2: Professional meetings, complex agreement
  if (
    id.includes('conv-meetings') ||
    id.includes('toefl-sv-agreement') ||
    id.includes('conjunction') ||
    levelProp === 'b2'
  ) {
    return CEFR_LEVELS.B2;
  }

  // C1: Negative Inversion, Reduced clauses, Subjunctive, AWL
  if (
    id.includes('toefl-inversion') ||
    id.includes('toefl-reduced') ||
    id.includes('toefl-subjunctive') ||
    id.includes('toefl-awl') ||
    levelProp === 'c1' ||
    levelProp === 'advanced'
  ) {
    return CEFR_LEVELS.C1;
  }

  return CEFR_LEVELS.B1;
};
