import type { Quiz } from '@/server/quiz-schema';

/**
 * Pick a stable "quiz of the day" from a list, so the same date always
 * features the same quiz without any server state.
 *
 * @param quizzes - Quizzes to pick from
 * @param date - Date to seed the pick with
 * @returns The featured quiz
 */
export function getQuizOfTheDay(quizzes: Quiz[], date: Date): Quiz {
  const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return quizzes[hash % quizzes.length];
}
