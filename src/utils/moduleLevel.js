/**
 * Helper to determine and format difficulty levels for MyLala modules.
 */

export const MODULE_LEVELS = {
  STARTER: {
    id: 'Starter',
    label: 'Pemula',
    display: 'Starter (Pemula)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
    borderCard: 'hover:border-emerald-300',
  },
  INTERMEDIATE: {
    id: 'Intermediate',
    label: 'Menengah',
    display: 'Intermediate',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500',
    borderCard: 'hover:border-amber-300',
  },
  ADVANCED: {
    id: 'Advanced',
    label: 'TOEFL 600+',
    display: 'Advanced (TOEFL 600+)',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
    dotClass: 'bg-purple-500',
    borderCard: 'hover:border-purple-300',
  },
};

export const getModuleLevel = (module) => {
  if (!module) return MODULE_LEVELS.INTERMEDIATE;
  
  const levelProp = (module.level || '').toLowerCase();
  const id = (module.id || '').toLowerCase();
  const title = (module.title || '').toLowerCase();

  if (
    levelProp === 'starter' ||
    levelProp === 'pemula' ||
    id.includes('starter') ||
    title.includes('starter') ||
    title.includes('pemula')
  ) {
    return MODULE_LEVELS.STARTER;
  }

  if (
    levelProp === 'advanced' ||
    id.includes('toefl-inversion') ||
    id.includes('toefl-reduced') ||
    id.includes('toefl-subjunctive') ||
    id.includes('toefl-awl') ||
    id.includes('meetings') ||
    title.includes('inversion') ||
    title.includes('subjunctive') ||
    title.includes('reduced') ||
    title.includes('awl')
  ) {
    return MODULE_LEVELS.ADVANCED;
  }

  return MODULE_LEVELS.INTERMEDIATE;
};

