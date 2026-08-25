'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { QuizCompareDialog } from '@/components/quiz-compare-dialog';
import { QuizDetail } from '@/components/quiz-detail';
import { quizzes } from '@/data/quizzes';
import {
  CADENCE_OPTIONS,
  ALL_FILTERS,
  filterQuizzes,
  getAvailableTags,
  sortQuizzes,
  type QuizFilters,
} from '@/lib/quiz-filter';
import { WEEKDAY_ORDER, buildMonthGrid, formatTime, getQuizDatesInMonth } from '@/lib/quiz-utils';
import { quizAreaSchema, type Quiz } from '@/server/quiz-schema';

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
const MAX_COMPARE = 5;

/** Shorthand shown on calendar chips for non-weekly cadences. */
function getCadenceShorthand(quiz: Quiz): string | null {
  if (quiz.cadence === 'weekly') return null;
  return quiz.cadenceNote ?? quiz.cadence;
}

/** Quizzes that run on a specific date, plus which date they were placed on. */
function getQuizzesForDate(date: Date, visible: Quiz[]): Array<{ quiz: Quiz; date: Date }> {
  return visible.flatMap((quiz) =>
    getQuizDatesInMonth(quiz, date.getFullYear(), date.getMonth())
      .filter((occurrence) => occurrence.getDate() === date.getDate())
      .map((occurrence) => ({ quiz, date: occurrence }))
  );
}

/**
 * Interactive month calendar of Wellington quizzes with filters,
 * compare, and review support.
 *
 * @returns The calendar page body
 */
export function QuizCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [filters, setFilters] = useState<QuizFilters>(ALL_FILTERS);
  const [sortKey, setSortKey] = useState<'time' | 'venue' | 'area'>('time');
  const [selected, setSelected] = useState<{ quiz: Quiz; date: Date } | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const availableTags = useMemo(() => getAvailableTags(quizzes), []);
  const visibleQuizzes = useMemo(
    () => sortQuizzes(filterQuizzes(quizzes, filters), sortKey),
    [filters, sortKey]
  );
  const compareQuizzes = useMemo(
    () => compareIds.map((id) => quizzes.find((quiz) => quiz.id === id)).filter(Boolean) as Quiz[],
    [compareIds]
  );
  const weeks = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  useEffect(() => {
    if (!selected) return;
    dialogRef.current?.showModal();
  }, [selected]);

  const updateFilter = (key: keyof QuizFilters, value: string): void => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

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

  const toggleCompare = (quizId: string): void => {
    setCompareIds((current) =>
      current.includes(quizId)
        ? current.filter((id) => id !== quizId)
        : current.length >= MAX_COMPARE
          ? current
          : [...current, quizId]
    );
  };

  const filterChips = (
    items: string[],
    active: string,
    onSelect: (value: string) => void,
    compact = false
  ) =>
    items.map((item) => (
      <button
        key={item}
        type="button"
        onClick={() => onSelect(item)}
        aria-pressed={active === item}
        className={`rounded-full border font-medium ${
          compact ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'
        } ${active === item ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white hover:bg-neutral-100'}`}
      >
        {item}
      </button>
    ));

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="quiz-search">
            Search quizzes
          </label>
          <input
            id="quiz-search"
            type="search"
            placeholder="Search venue, suburb, or area…"
            value={filters.query}
            onChange={(event) => updateFilter('query', event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm sm:w-64"
          />
          <label htmlFor="quiz-sort" className="sr-only">
            Sort quizzes
          </label>
          <select
            id="quiz-sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as 'time' | 'venue' | 'area')}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="time">Sort by time</option>
            <option value="venue">Sort by venue</option>
            <option value="area">Sort by area</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips(['All', ...AREAS], filters.area, (value) => updateFilter('area', value))}
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips(
            ['All', ...WEEKDAY_ORDER],
            filters.day,
            (value) => updateFilter('day', value),
            true
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips(
            [...CADENCE_OPTIONS].map((cadence) => (cadence === 'All' ? 'Any schedule' : cadence)),
            filters.cadence === 'All' ? 'Any schedule' : filters.cadence,
            (value) => updateFilter('cadence', value === 'Any schedule' ? 'All' : value),
            true
          )}
        </div>
        {availableTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filterChips(
              ['All', ...availableTags],
              filters.tag,
              (value) => updateFilter('tag', value),
              true
            )}
          </div>
        ) : null}
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
              const dayQuizzes = getQuizzesForDate(date, visibleQuizzes);
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
        <p className="mb-3 text-sm text-neutral-500">
          {visibleQuizzes.length} of {quizzes.length} quizzes match your filters. Tick up to five to
          compare them side by side.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WEEKDAY_ORDER.map((day) => {
            const dayQuizzes = visibleQuizzes.filter((quiz) => quiz.dayOfWeek === day);
            return (
              <div key={day}>
                <h3 className="mb-1 text-sm font-semibold text-neutral-500">{day}</h3>
                {dayQuizzes.length === 0 ? (
                  <p className="text-sm text-neutral-400">No quizzes match</p>
                ) : (
                  <ul className="space-y-1">
                    {dayQuizzes.map((quiz) => {
                      const compareSelected = compareIds.includes(quiz.id);
                      const shorthand = getCadenceShorthand(quiz);
                      return (
                        <li key={quiz.id} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            aria-label={`Compare ${quiz.venue}`}
                            checked={compareSelected}
                            onChange={() => toggleCompare(quiz.id)}
                            className="mt-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const occurrence =
                                getQuizDatesInMonth(quiz, viewYear, viewMonth)[0] ?? today;
                              setSelected({ quiz, date: occurrence });
                            }}
                            className="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-neutral-100"
                          >
                            <span className="font-medium">{formatTime(quiz.startTime)}</span>{' '}
                            {quiz.venue}
                            <span className="text-neutral-500"> · {quiz.suburb}</span>
                            {shorthand ? (
                              <span className="text-amber-700"> · {shorthand}</span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {compareIds.length > 0 ? (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
            <span className="text-sm font-medium">
              {compareIds.length} selected{compareIds.length === MAX_COMPARE ? ' (max)' : ''}
            </span>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Compare
            </button>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label="Quiz details"
        onClose={closeDialog}
        className="w-full max-w-md rounded-xl p-6 backdrop:bg-black/40"
      >
        {selected ? (
          <>
            <QuizDetail quiz={selected.quiz} date={selected.date} />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => toggleCompare(selected.quiz.id)}
                disabled={
                  !compareIds.includes(selected.quiz.id) && compareIds.length >= MAX_COMPARE
                }
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100 disabled:opacity-50"
              >
                {compareIds.includes(selected.quiz.id) ? 'Remove from compare' : 'Add to compare'}
              </button>
              <button
                type="button"
                onClick={closeDialog}
                className="flex-1 rounded-md bg-neutral-900 px-3 py-2 font-medium text-white hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </>
        ) : null}
      </dialog>

      {compareOpen ? (
        <QuizCompareDialog quizzes={compareQuizzes} onClose={() => setCompareOpen(false)} />
      ) : null}
    </div>
  );
}
