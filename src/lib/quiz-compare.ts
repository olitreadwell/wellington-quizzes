import { formatTime } from '@/lib/quiz-utils';
import type { Quiz } from '@/server/quiz-schema';

/** One attribute row in the compare table. */
export interface CompareRow {
  /** Attribute name, e.g. "Day". */
  label: string;
  /** One value per compared quiz, in the same order as the input. */
  values: string[];
}

const FALLBACK = '—';

/**
 * Build the attribute matrix for a set of quizzes being compared.
 *
 * @param quizzes - Quizzes to compare (2-5)
 * @returns Rows in display order, one value per quiz
 */
export function buildCompareRows(quizzes: Quiz[]): CompareRow[] {
  const pick = (value: string | undefined): string => value ?? FALLBACK;
  const rows: Array<[string, (quiz: Quiz) => string]> = [
    ['Area', (quiz) => quiz.area],
    ['Suburb', (quiz) => quiz.suburb],
    ['Day', (quiz) => quiz.dayOfWeek],
    ['Start', (quiz) => formatTime(quiz.startTime)],
    [
      'Schedule',
      (quiz) => (quiz.cadence === 'weekly' ? 'Weekly' : pick(quiz.cadenceNote ?? quiz.cadence)),
    ],
    ['Run by', (quiz) => pick(quiz.operator)],
    ['Format', (quiz) => pick(quiz.format)],
    ['Team size', (quiz) => pick(quiz.teamSize)],
    ['Prizes', (quiz) => pick(quiz.prizes)],
    ['Booking', (quiz) => pick(quiz.booking)],
    ['Notes', (quiz) => pick(quiz.notes)],
    ['Tags', (quiz) => (quiz.tags.length > 0 ? quiz.tags.join(', ') : FALLBACK)],
    ['Verified', (quiz) => quiz.lastVerified],
  ];
  return rows.map(([label, read]) => ({
    label,
    values: quizzes.map((quiz) => read(quiz)),
  }));
}

/**
 * Average community rating for a quiz, or null when it has no reviews.
 *
 * @param quiz - Quiz with optional reviews
 * @returns Average rating rounded to one decimal
 */
export function getAverageRating(quiz: Quiz): number | null {
  if (quiz.reviews.length === 0) return null;
  const total = quiz.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / quiz.reviews.length) * 10) / 10;
}
