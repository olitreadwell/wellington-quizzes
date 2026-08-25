import { describe, expect, it } from 'vitest';
import { quizzes } from '@/data/quizzes';
import {
  ALL_FILTERS,
  filterQuizzes,
  getAvailableTags,
  sortQuizzes,
  type QuizFilters,
} from '@/lib/quiz-filter';

const baseFilters: QuizFilters = { ...ALL_FILTERS };

describe('filterQuizzes', () => {
  it('returns everything with no active filters', () => {
    expect(filterQuizzes(quizzes, baseFilters)).toHaveLength(quizzes.length);
  });

  it('filters by area', () => {
    const result = filterQuizzes(quizzes, { ...baseFilters, area: 'Kapiti Coast' });
    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result.every((quiz) => quiz.area === 'Kapiti Coast')).toBe(true);
  });

  it('filters by day', () => {
    const result = filterQuizzes(quizzes, { ...baseFilters, day: 'Thursday' });
    expect(result.every((quiz) => quiz.dayOfWeek === 'Thursday')).toBe(true);
  });

  it('filters by cadence', () => {
    const result = filterQuizzes(quizzes, { ...baseFilters, cadence: 'monthly' });
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.every((quiz) => quiz.cadence === 'monthly')).toBe(true);
  });

  it('filters by tag', () => {
    const result = filterQuizzes(quizzes, { ...baseFilters, tag: 'big prizes' });
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.every((quiz) => quiz.tags.includes('big prizes'))).toBe(true);
  });

  it('searches venue, suburb, and area text', () => {
    expect(
      filterQuizzes(quizzes, { ...baseFilters, query: 'petone' }).length
    ).toBeGreaterThanOrEqual(2);
    expect(filterQuizzes(quizzes, { ...baseFilters, query: 'kāpiti' }).length).toBe(0);
    expect(
      filterQuizzes(quizzes, { ...baseFilters, query: 'kapiti' }).length
    ).toBeGreaterThanOrEqual(4);
  });
});

describe('sortQuizzes', () => {
  it('sorts by start time then venue', () => {
    const sorted = sortQuizzes(quizzes, 'time');
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      const order = previous.startTime.localeCompare(current.startTime);
      expect(order <= 0).toBe(true);
      if (order === 0) {
        expect(previous.venue.localeCompare(current.venue) <= 0).toBe(true);
      }
    }
  });

  it('sorts by venue', () => {
    const sorted = sortQuizzes(quizzes, 'venue');
    const names = sorted.map((quiz) => quiz.venue);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe('getAvailableTags', () => {
  it('returns unique tags in data order', () => {
    const tags = getAvailableTags(quizzes);
    expect(tags.length).toBeGreaterThanOrEqual(6);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags).toContain('big prizes');
  });
});
