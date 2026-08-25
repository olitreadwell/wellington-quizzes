import type { Quiz } from '@/server/quiz-schema';

export const WEEKDAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Map a quiz day label to the JS Date getDay() value (0 = Sunday). */
const DAY_JS_DAY: Record<(typeof WEEKDAY_ORDER)[number], number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

/** Map a zero-based weekday (Monday = 0) back to the JS getDay() value. */
const WEEKDAY_INDEX_TO_JS_DAY = [1, 2, 3, 4, 5, 6, 0];

/** Ordinal words used in monthly cadence notes, e.g. "Fourth Thursday". */
const ORDINAL_WORDS: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  last: -1,
};

/**
 * Build a plain date for a year/month/day without timezone surprises.
 *
 * @param year - Calendar year
 * @param month - Zero-based month
 * @param day - Day of month
 * @returns A Date at local midnight
 */
export function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Format a 24-hour time like "19:00" as "7:00pm".
 *
 * @param time - 24-hour HH:MM string
 * @returns Friendly 12-hour display
 */
export function formatTime(time: string): string {
  const [hoursRaw, minutes] = time.split(':');
  const hours = Number(hoursRaw);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes}${period}`;
}

/** Whether a quiz runs on a given date (weekday match only). */
export function quizRunsOn(quiz: Quiz, date: Date): boolean {
  return DAY_JS_DAY[quiz.dayOfWeek] === date.getDay();
}

/** Zero-based weekday of a quiz, Monday = 0. */
export function quizWeekdayIndex(quiz: Quiz): number {
  return WEEKDAY_ORDER.indexOf(quiz.dayOfWeek);
}

/** Convert a zero-based weekday index (Monday = 0) to a Date.getDay() value. */
export function weekdayIndexToJsDay(index: number): number {
  return WEEKDAY_INDEX_TO_JS_DAY[index] ?? 0;
}

/**
 * Next date on or after `from` that matches a plain weekly weekday.
 *
 * @param quiz - Weekly quiz
 * @param from - Start searching from this date
 * @returns The matching date
 */
export function getNextWeeklyDate(quiz: Quiz, from: Date): Date {
  const candidate = new Date(from);
  while (!quizRunsOn(quiz, candidate)) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

/**
 * Find a numbered weekday occurrence in a month, e.g. the 4th Thursday.
 *
 * @param year - Calendar year
 * @param month - Zero-based month
 * @param dayOfWeek - Weekday name
 * @param nth - 1..4 for first..fourth, -1 for last
 * @returns The matching date, or null when the month has none
 */
export function getNthWeekday(
  year: number,
  month: number,
  dayOfWeek: (typeof WEEKDAY_ORDER)[number],
  nth: number
): Date | null {
  const dayValue = DAY_JS_DAY[dayOfWeek];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matching = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = createDate(year, month, day);
    if (date.getDay() === dayValue) matching.push(date);
  }
  if (nth === -1) return matching.at(-1) ?? null;
  return matching[nth - 1] ?? null;
}

/**
 * Parse a monthly cadence note into an occurrence descriptor.
 *
 * @param quiz - Quiz with a monthly cadence
 * @returns An ordinal, or null when the note has no recognised pattern
 */
export function getMonthlyOrdinal(quiz: Quiz): number | null {
  const note = quiz.cadenceNote?.toLowerCase() ?? '';
  for (const [word, ordinal] of Object.entries(ORDINAL_WORDS)) {
    if (note.includes(word)) return ordinal;
  }
  return null;
}

/**
 * Dates a quiz appears on inside a calendar month.
 *
 * Weekly quizzes appear every matching weekday. Monthly quizzes appear on
 * their nth weekday. Fortnightly and seasonal quizzes appear every matching
 * weekday with their cadence surfaced in the UI.
 *
 * @param quiz - Quiz to place
 * @param year - Calendar year
 * @param month - Zero-based month
 * @returns Dates in the month the quiz runs
 */
export function getQuizDatesInMonth(quiz: Quiz, year: number, month: number): Date[] {
  if (quiz.cadence === 'monthly') {
    const ordinal = getMonthlyOrdinal(quiz);
    if (ordinal === null) return [];
    const date = getNthWeekday(year, month, quiz.dayOfWeek, ordinal);
    return date ? [date] : [];
  }
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: Date[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const candidate = createDate(year, month, day);
    if (quizRunsOn(quiz, candidate)) dates.push(candidate);
  }
  return dates;
}

/**
 * Build a Monday-first week grid covering a month.
 *
 * Cells before the 1st and after the last day are null so the grid always
 * renders as full rows.
 *
 * @param year - Calendar year
 * @param month - Zero-based month
 * @returns Rows of dates (null for cells outside the month)
 */
export function buildMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstOfMonth = createDate(year, month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const start = createDate(year, month, 1 - mondayOffset);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (Date | null)[][] = [];
  let row: (Date | null)[] = [];
  for (let offset = 0; offset < mondayOffset + daysInMonth; offset += 1) {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + offset);
    row.push(cellDate.getMonth() === month ? cellDate : null);
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  }
  while (row.length > 0 && row.length < 7) {
    row.push(null);
    if (row.length === 7) weeks.push(row);
  }
  return weeks;
}

/**
 * Group quizzes by the weekday they run on, for the "by day" summary.
 *
 * @param quizzes - Quiz list
 * @returns Map of weekday name to quizzes
 */
export function groupQuizzesByDay(quizzes: Quiz[]): Map<string, Quiz[]> {
  const grouped = new Map<string, Quiz[]>();
  for (const quiz of quizzes) {
    const day = quiz.dayOfWeek;
    const bucket = grouped.get(day) ?? [];
    bucket.push(quiz);
    grouped.set(day, bucket);
  }
  return grouped;
}
