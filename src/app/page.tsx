import { QuizCalendar } from '@/components/quiz-calendar';
import { quizzes } from '@/data/quizzes';
import { WEEKDAY_ORDER } from '@/lib/quiz-utils';

const LAST_UPDATED = '25 August 2026';

/**
 * Homepage: Wellington quiz calendar plus day-by-day listing.
 *
 * @returns The page content
 */
export default function HomePage() {
  const suburbCount = new Set(quizzes.map((quiz) => quiz.suburb)).size;
  const dayCounts = WEEKDAY_ORDER.map(
    (day) => `${quizzes.filter((quiz) => quiz.dayOfWeek === day).length}`
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold sm:text-4xl">WLG NZ Quizzes</h1>
        <p className="max-w-2xl text-neutral-600">
          {quizzes.length} recurring pub quizzes across {suburbCount} suburbs — every week (and some
          less often), on one calendar. Tap a quiz for details, map link, and an add-to- calendar
          file.
        </p>
        <p className="text-xs text-neutral-500">
          Last updated {LAST_UPDATED}. Schedules change — confirm with the venue before you head
          out.
        </p>
      </header>
      <QuizCalendar />
      <footer className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
        <p>
          Quiz counts by day: Mon {dayCounts[0]} · Tue {dayCounts[1]} · Wed {dayCounts[2]} · Thu{' '}
          {dayCounts[3]} · Fri {dayCounts[4]} · Sat {dayCounts[5]} · Sun {dayCounts[6]}.
        </p>
        <p>
          Data collected from public listings, primarily Believe it or Not’s find-a-quiz page. Spot
          a change or a missing quiz? Open an issue or send a pull request.
        </p>
      </footer>
    </main>
  );
}
