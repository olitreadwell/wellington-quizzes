import type { Quiz } from '@/server/quiz-schema';

/** Active filter state for the quiz list and calendar. */
export interface QuizFilters {
  /** Free-text search against venue, suburb, and area. */
  query: string;
  /** Area name, or 'All'. */
  area: string;
  /** Weekday name, or 'All'. */
  day: string;
  /** Cadence, or 'All'. */
  cadence: string;
  /** Tag label, or 'All'. */
  tag: string;
}

export const ALL_FILTERS: QuizFilters = {
  query: '',
  area: 'All',
  day: 'All',
  cadence: 'All',
  tag: 'All',
};

/** Filter options the UI offers for a field. */
export type FilterOption = 'All' | string;

/**
 * Apply area, day, cadence, tag, and text filters to a quiz list.
 *
 * @param quizzes - Quiz list to filter
 * @param filters - Active filters
 * @returns Matching quizzes
 */
export function filterQuizzes(quizzes: Quiz[], filters: QuizFilters): Quiz[] {
  const query = filters.query.trim().toLowerCase();
  return quizzes.filter((quiz) => {
    if (filters.area !== 'All' && quiz.area !== filters.area) return false;
    if (filters.day !== 'All' && quiz.dayOfWeek !== filters.day) return false;
    if (filters.cadence !== 'All' && quiz.cadence !== filters.cadence) return false;
    if (filters.tag !== 'All' && !quiz.tags.includes(filters.tag as Quiz['tags'][number]))
      return false;
    if (query && !`${quiz.venue} ${quiz.suburb} ${quiz.area}`.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
}

/**
 * Sort quizzes for the day-by-day list.
 *
 * @param quizzes - Quiz list to sort
 * @param key - Sort order
 * @returns Sorted quizzes
 */
export function sortQuizzes(quizzes: Quiz[], key: 'time' | 'venue' | 'area'): Quiz[] {
  const sorted = [...quizzes];
  if (key === 'time') {
    sorted.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.venue.localeCompare(b.venue));
  } else if (key === 'venue') {
    sorted.sort((a, b) => a.venue.localeCompare(b.venue));
  } else {
    sorted.sort((a, b) => a.area.localeCompare(b.area) || a.suburb.localeCompare(b.suburb));
  }
  return sorted;
}

/**
 * Unique tags present in a quiz list, in data order.
 *
 * @param quizzes - Quiz list
 * @returns Tag labels
 */
export function getAvailableTags(quizzes: Quiz[]): string[] {
  return [...new Set(quizzes.flatMap((quiz) => quiz.tags))];
}

/** Cadence options for the filter row, always including "All". */
export const CADENCE_OPTIONS = ['All', 'weekly', 'fortnightly', 'monthly', 'seasonal'] as const;
