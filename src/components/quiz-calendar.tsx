'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { quizzes } from '@/data/quizzes';
import { WEEKDAY_ORDER, buildMonthGrid, formatTime, getQuizDatesInMonth } from '@/lib/quiz-utils';
import { quizAreaSchema, type Quiz } from '@/server/quiz-schema';
import { QuizDetail } from '@/components/quiz-detail';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const AREAS = quizAreaSchema.options;

/** Shorthand shown on calendar chips for non-weekly cadences. */
function getCadenceShorthand(quiz: Quiz): string | null {
  if (quiz.cadence === 'weekly') return null;
  return quiz.cadenceNote ?? quiz.cadence;
}

/** Quizzes that run on a specific date, plus which date they were placed on. */
function getQuizzesForDate(date: Date): Array<{ quiz: Quiz; date: Date }> {
  return quizzes.flatMap((quiz) =>
    getQuizDatesInMonth(quiz, date.getFullYear(), date.getMonth())
      .filter((occurrence) => occurrence.getDate() === date.getDate())
      .map((occurrence) => ({ quiz, date: occurrence }))
  );
}

/**
 * Interactive month calendar of Wellington quizzes.
 *
 * @returns The calendar page body
 */
export function QuizCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [dayFilter, setDayFilter] = useState<string>('All');
  const [selected, setSelected] = useState<{ quiz: Quiz; date: Date } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const visibleQuizzes = useMemo(
    () =>
      quizzes.filter(
        (quiz) =>
          (areaFilter === 'All' || quiz.area === areaFilter) &&
          (dayFilter === 'All' || quiz.dayOfWeek === dayFilter)
      ),
    [areaFilter, dayFilter]
  );

  const weeks = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  useEffect(() => {
    if (!selected) return;
    dialogRef.current?.showModal();
  }, [selected]);

  const shiftMonth = (delta: number): void => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const goToToday = (): void => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const closeDialog = (): void => {
    dialogRef.current?.close();
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {['All', ...AREAS].map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setAreaFilter(area)}
              aria-pressed={areaFilter === area}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                areaFilter === area
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white hover:bg-neutral-100'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...WEEKDAY_ORDER].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setDayFilter(day)}
              aria-pressed={dayFilter === day}
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                dayFilter === day
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white hover:bg-neutral-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            >
              Today
            </button>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200">
          {WEEKDAY_ORDER.map((day) => (
            <div key={day} className="bg-neutral-100 px-2 py-1 text-center text-xs font-semibold">
              {day.slice(0, 2)}
            </div>
          ))}
          {weeks.flatMap((week, weekIndex) =>
            week.map((date, dayIndex) => {
              if (!date) {
                return (
                  <div key={`${weekIndex}-${dayIndex}`} className="min-h-24 bg-neutral-50 p-1" />
                );
              }
              const dayQuizzes = getQuizzesForDate(date).filter(({ quiz }) =>
                visibleQuizzes.includes(quiz)
              );
              const isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();
              return (
                <div key={`${weekIndex}-${dayIndex}`} className="min-h-24 space-y-1 bg-white p-1">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday ? 'bg-neutral-900 font-semibold text-white' : 'text-neutral-500'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dayQuizzes.map(({ quiz, date: occurrence }) => {
                    const shorthand = getCadenceShorthand(quiz);
                    return (
                      <button
                        key={quiz.id}
                        type="button"
                        title={`${quiz.venue} — ${formatTime(quiz.startTime)}${
                          shorthand ? ` (${shorthand})` : ''
                        }`}
                        onClick={() => setSelected({ quiz, date: occurrence })}
                        className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${
                          shorthand
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-neutral-900 text-white hover:bg-neutral-700'
                        }`}
                      >
                        {formatTime(quiz.startTime)} {quiz.venue}
                        {shorthand ? ` · ${shorthand}` : ''}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          Amber chips run less often than weekly — hover for the pattern, open for details.
        </p>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">All quizzes by day</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WEEKDAY_ORDER.map((day) => {
            const dayQuizzes = visibleQuizzes
              .filter((quiz) => quiz.dayOfWeek === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <div key={day}>
                <h3 className="mb-1 text-sm font-semibold text-neutral-500">{day}</h3>
                {dayQuizzes.length === 0 ? (
                  <p className="text-sm text-neutral-400">No quizzes listed</p>
                ) : (
                  <ul className="space-y-1">
                    {dayQuizzes.map((quiz) => (
                      <li key={quiz.id}>
                        <button
                          type="button"
                          onClick={() => {
                            const occurrence =
                              getQuizDatesInMonth(quiz, viewYear, viewMonth)[0] ?? today;
                            setDayFilter('All');
                            setSelected({ quiz, date: occurrence });
                          }}
                          className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-neutral-100"
                        >
                          <span className="font-medium">{formatTime(quiz.startTime)}</span>{' '}
                          {quiz.venue}
                          <span className="text-neutral-500"> · {quiz.suburb}</span>
                          {getCadenceShorthand(quiz) ? (
                            <span className="text-amber-700"> · {getCadenceShorthand(quiz)}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-label="Quiz details"
        onClose={closeDialog}
        className="w-full max-w-md rounded-xl p-6 backdrop:bg-black/40"
      >
        {selected ? (
          <>
            <QuizDetail quiz={selected.quiz} date={selected.date} />
            <button
              type="button"
              onClick={closeDialog}
              className="mt-4 w-full rounded-md bg-neutral-900 px-3 py-2 font-medium text-white hover:bg-neutral-700"
            >
              Close
            </button>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
