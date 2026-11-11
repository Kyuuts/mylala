/**
 * Spaced Repetition System (SRS) - SuperMemo-2 (SM-2) Enhanced Algorithm
 * Handles spaced-repetition scheduling for active recall flashcards.
 */

export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;
export const MAX_EASE_FACTOR = 3.0;

/**
 * Calculates new interval, repetitions, ease factor, status, and next review date.
 *
 * @param {Object} currentProgress Current card progress metadata
 * @param {'Hard'|'Good'|'Easy'} rating User feedback rating
 * @returns {Object} Updated progress record
 */
export function calculateSRS(currentProgress = {}, rating) {
  const now = new Date();

  // Current values or defaults
  const repetitions = currentProgress.repetitions || 0;
  const easeFactor = currentProgress.easeFactor || DEFAULT_EASE_FACTOR;
  const interval = currentProgress.interval || 0; // interval in days

  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval = 1; // days
  let newStatus = 'Learning';

  switch (rating) {
    case 'Hard': {
      // Recall failed or required extreme effort
      newRepetitions = 0;
      // Re-review in 15 minutes (or 0.01 days) to solidify memory today
      newInterval = 0.01;
      newEaseFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
      newStatus = 'Learning';
      break;
    }

    case 'Good': {
      // Successful recall with moderate effort
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 3;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }

      newRepetitions = repetitions + 1;
      // Slight maintenance of ease factor
      newEaseFactor = easeFactor;
      newStatus = newRepetitions >= 3 ? 'Mastered' : 'Review';
      break;
    }

    case 'Easy': {
      // Immediate, effortless recall
      if (repetitions === 0) {
        newInterval = 3;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor * 1.3);
      }

      newRepetitions = repetitions + 1;
      newEaseFactor = Math.min(MAX_EASE_FACTOR, easeFactor + 0.15);
      newStatus = newRepetitions >= 2 ? 'Mastered' : 'Review';
      break;
    }

    default:
      newInterval = 1;
      newStatus = 'Learning';
  }

  // Calculate next review timestamp
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    repetitions: newRepetitions,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    interval: Number(newInterval.toFixed(2)),
    status: newStatus,
    next_review_date: nextReviewDate.toISOString(),
    last_reviewed_at: now.toISOString(),
  };
}

/**
 * Checks whether a card is currently due for review
 * @param {string|Date} nextReviewDate
 * @returns {boolean}
 */
export function isCardDue(nextReviewDate) {
  if (!nextReviewDate) return true;
  return new Date(nextReviewDate) <= new Date();
}

/**
 * Formats review schedule into friendly human-readable text
 * @param {string|Date} nextReviewDate
 * @returns {string}
 */
export function formatNextReviewText(nextReviewDate) {
  if (!nextReviewDate) return 'Sekarang';

  const diffMs = new Date(nextReviewDate) - new Date();
  if (diffMs <= 0) return 'Hari ini (Siap Review)';

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return diffHours <= 1 ? 'Dalam 1 jam' : `Dalam ${diffHours} jam`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Besok';
  if (diffDays <= 7) return `${diffDays} hari lagi`;
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} minggu lagi`;
}
