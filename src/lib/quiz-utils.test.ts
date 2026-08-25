import { describe, expect, it } from 'vitest';
import { quizzes } from '@/data/quizzes';
import {
  buildMonthGrid,
  createDate,
  formatTime,
  getNextWeeklyDate,
  getNthWeekday,
  getQuizDatesInMonth,
  groupQuizzesByDay,
  quizRunsOn,
  quizWeekdayIndex,
  weekdayIndexToJsDay,
} from '@/lib/quiz-utils';

describe('formatTime', () => {
  it('formats 24-hour times as friendly 12-hour strings', () => {
    expect(formatTime('19:00')).toBe('7:00pm');
    expect(formatTime('18:30')).toBe('6:30pm');
    expect(formatTime('17:30')).toBe('5:30pm');
    expect(formatTime('00:00')).toBe('12:00am');
    expect(formatTime('12:15')).toBe('12:15pm');
  });
});

describe('calendar grid', () => {
  it('builds a Monday-first grid covering August 2026', () => {
    const weeks = buildMonthGrid(2026, 7);
    expect(weeks.length).toBe(6);
    expect(weeks[0][5]?.getDate()).toBe(1);
    expect(weeks[0][5]?.getDay()).toBe(6);
    const nonNull = weeks.flat().filter((date) => date !== null);
    expect(nonNull.length).toBe(31);
  });

  it('builds a 5-week grid for February 2026', () => {
    const weeks = buildMonthGrid(2026, 1);
    expect(weeks.length).toBeGreaterThanOrEqual(4);
    expect(weeks.flat().filter((date) => date !== null).length).toBe(28);
  });
});

describe('weekly occurrence logic', () => {
  const gibbons = quizzes.find((quiz) => quiz.id === 'gibbons-hotel');
  const moon = quizzes.find((quiz) => quiz.id === 'moon-bar-newtown');

  it('knows which weekday a quiz runs on', () => {
    expect(gibbons?.dayOfWeek).toBe('Tuesday');
    expect(quizRunsOn(gibbons!, createDate(2026, 7, 25))).toBe(true);
    expect(quizRunsOn(gibbons!, createDate(2026, 7, 26))).toBe(false);
    expect(quizWeekdayIndex(gibbons!)).toBe(1);
  });

  it('finds the next matching weekday', () => {
    const from = createDate(2026, 7, 21); // a Friday
    expect(getNextWeeklyDate(moon!, from).getDate()).toBe(24);
  });

  it('places weekly quizzes on every matching day in a month', () => {
    const dates = getQuizDatesInMonth(gibbons!, 2026, 7);
    expect(dates.map((date) => date.getDate())).toEqual([4, 11, 18, 25]);
  });

  it('returns no dates for a monthly quiz without a recognised pattern', () => {
    const madeUp = {
      ...gibbons!,
      id: 'made-up',
      cadence: 'monthly' as const,
      cadenceNote: undefined,
    };
    expect(getQuizDatesInMonth(madeUp, 2026, 7)).toEqual([]);
  });
});

describe('nth weekday occurrences', () => {
  it('finds the 4th Thursday of a month', () => {
    const date = getNthWeekday(2026, 7, 'Thursday', 4);
    expect(date?.getDate()).toBe(27);
  });

  it('finds the last Tuesday of a month', () => {
    const date = getNthWeekday(2026, 6, 'Tuesday', -1);
    expect(date?.getDate()).toBe(28);
  });

  it('places monthly quizzes on their single occurrence', () => {
    const omalleys = quizzes.find((quiz) => quiz.id === 'omalleys-bar-kitchen');
    const dates = getQuizDatesInMonth(omalleys!, 2026, 6);
    expect(dates).toHaveLength(1);
    expect(dates[0].getDate()).toBe(28);
  });
});

describe('grouping', () => {
  it('groups every quiz by its weekday', () => {
    const grouped = groupQuizzesByDay(quizzes);
    expect(grouped.size).toBe(4);
    const total = [...grouped.values()].reduce((sum, list) => sum + list.length, 0);
    expect(total).toBe(quizzes.length);
  });
});

describe('weekday helpers', () => {
  it('maps Monday-first indexes back to JS getDay values', () => {
    expect(weekdayIndexToJsDay(0)).toBe(1);
    expect(weekdayIndexToJsDay(6)).toBe(0);
  });
});
