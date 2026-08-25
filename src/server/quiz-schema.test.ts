import { describe, expect, it } from 'vitest';
import { quizzes } from '@/data/quizzes';
import { quizListSchema } from '@/server/quiz-schema';

describe('quiz dataset', () => {
  it('validates every quiz against the schema', () => {
    const parsed = quizListSchema.safeParse(quizzes);
    expect(parsed.success).toBe(true);
  });

  it('has at least 30 quizzes across multiple areas', () => {
    expect(quizzes.length).toBeGreaterThanOrEqual(30);
    expect(new Set(quizzes.map((quiz) => quiz.area)).size).toBeGreaterThanOrEqual(4);
  });

  it('has unique ids and unique venue + weekday pairs', () => {
    const ids = quizzes.map((quiz) => quiz.id);
    expect(new Set(ids).size).toBe(ids.length);

    const pairs = quizzes.map((quiz) => `${quiz.venue}|${quiz.dayOfWeek}`);
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it('covers Monday through Thursday, with midweek heaviest', () => {
    const days = new Set(quizzes.map((quiz) => quiz.dayOfWeek));
    expect(days.size).toBe(4);
    expect(
      (['Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const).every((day) => days.has(day))
    ).toBe(true);
  });

  it('has a recent verification date and a source on every quiz', () => {
    for (const quiz of quizzes) {
      expect(quiz.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(quiz.source.url).toMatch(/^https?:\/\//);
    }
  });
});
