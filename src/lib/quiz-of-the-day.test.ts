import { describe, expect, it } from 'vitest';
import { getQuizOfTheDay } from '@/lib/quiz-of-the-day';
import { quizzes } from '@/data/quizzes';

describe('getQuizOfTheDay', () => {
  it('returns the same quiz for the same date', () => {
    const date = new Date(2026, 7, 26);
    expect(getQuizOfTheDay(quizzes, date)).toBe(getQuizOfTheDay(quizzes, date));
  });

  it('returns a quiz from the given list', () => {
    const picked = getQuizOfTheDay(quizzes, new Date(2026, 7, 26));
    expect(quizzes).toContain(picked);
  });

  it('spreads picks across dates', () => {
    const picked = new Set(
      Array.from(
        { length: 30 },
        (_, day) => getQuizOfTheDay(quizzes, new Date(2026, 7, 1 + day)).id
      )
    );
    expect(picked.size).toBeGreaterThan(1);
  });
});
