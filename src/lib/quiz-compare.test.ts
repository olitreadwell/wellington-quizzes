import { describe, expect, it } from 'vitest';
import { quizzes } from '@/data/quizzes';
import { buildCompareRows, getAverageRating } from '@/lib/quiz-compare';

describe('buildCompareRows', () => {
  it('builds attribute rows for two quizzes', () => {
    const two = quizzes.filter((quiz) => ['hotel-bristol', 'southern-cross'].includes(quiz.id));
    expect(two).toHaveLength(2);
    const rows = buildCompareRows(two);
    const labels = rows.map((row) => row.label);
    expect(labels).toContain('Area');
    expect(labels).toContain('Start');
    expect(labels).toContain('Prizes');
    expect(labels).toContain('Verified');

    const dayRow = rows.find((row) => row.label === 'Day');
    expect(dayRow?.values).toEqual(['Thursday', 'Tuesday']);
    const prizesRow = rows.find((row) => row.label === 'Prizes');
    expect(prizesRow?.values[0]).toContain('Star Points');
  });

  it('uses a dash for missing attributes', () => {
    const minimal = quizzes.filter((quiz) => quiz.id === '1841-bar-restaurant');
    const rows = buildCompareRows(minimal);
    const prizesRow = rows.find((row) => row.label === 'Prizes');
    expect(prizesRow?.values).toEqual(['—']);
  });
});

describe('getAverageRating', () => {
  it('returns null when there are no reviews', () => {
    const noReviews = quizzes.find((quiz) => quiz.reviews.length === 0);
    expect(getAverageRating(noReviews!)).toBeNull();
  });

  it('averages ratings from community reviews', () => {
    const base = quizzes[0];
    const reviewed = {
      ...base,
      reviews: [
        { author: 'A', rating: 4, comment: 'Great night', date: '2026-08-01' },
        { author: 'B', rating: 5, comment: 'Best in town', date: '2026-08-02' },
      ],
    };
    expect(getAverageRating(reviewed)).toBe(4.5);
  });
});
