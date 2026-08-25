import { formatTime } from '@/lib/quiz-utils';
import type { Quiz } from '@/server/quiz-schema';

/** Build a Google Maps search URL for a quiz venue. */
export function getMapsUrl(quiz: Quiz): string {
  const query = encodeURIComponent(`${quiz.venue}, ${quiz.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Build a prefilled GitHub issue link for adding a review. */
export function getReviewUrl(quiz: Quiz): string {
  const title = encodeURIComponent(`Review: ${quiz.venue}`);
  const body = encodeURIComponent(
    `Review for **${quiz.venue}** (${quiz.dayOfWeek}s, ${formatTime(quiz.startTime)}).\n\n` +
      `Rating (1-5): \nComment: \nDate visited: `
  );
  return `https://github.com/olitreadwell/wlg-nz-quizzes/issues/new?title=${title}&body=${body}`;
}

/** Build a single-event .ics calendar download for a quiz occurrence. */
export function getIcsUrl(quiz: Quiz, date: Date): string {
  const [hours, minutes] = quiz.startTime.split(':').map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (value: Date): string =>
    value
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WLG NZ Quizzes//EN',
    'BEGIN:VEVENT',
    `UID:${quiz.id}-${stamp(start)}@wlg-nz-quizzes`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Quiz night at ${quiz.venue}`,
    `LOCATION:${quiz.address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/**
 * Detail sheet shown in the quiz modal.
 *
 * @param props - Component props
 * @param props.quiz - Quiz being viewed
 * @param props.date - Occurrence date the quiz was opened from
 * @returns The detail body
 */
export function QuizDetail({ quiz, date }: { quiz: Quiz; date: Date }) {
  const rows: Array<[string, string]> = [
    ['Area', quiz.area],
    ['Suburb', quiz.suburb],
    ['When', `${quiz.dayOfWeek}s, ${formatTime(quiz.startTime)}`],
    ...(quiz.cadenceNote ? [['Schedule', quiz.cadenceNote] as [string, string]] : []),
    ...(quiz.cost ? [['Cost', quiz.cost] as [string, string]] : []),
    ...(quiz.prizes ? [['Prizes', quiz.prizes] as [string, string]] : []),
    ...(quiz.format ? [['Format', quiz.format] as [string, string]] : []),
    ...(quiz.teamSize ? [['Team size', quiz.teamSize] as [string, string]] : []),
    ...(quiz.booking ? [['Booking', quiz.booking] as [string, string]] : []),
    ...(quiz.operator ? [['Run by', quiz.operator] as [string, string]] : []),
    ...(quiz.notes ? [['Notes', quiz.notes] as [string, string]] : []),
    ...(quiz.tags.length > 0 ? [['Best for', quiz.tags.join(', ')] as [string, string]] : []),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">{quiz.venue}</h3>
        <p className="text-neutral-600">{quiz.address}</p>
      </div>
      <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-medium text-neutral-500">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2 text-sm">
        <a
          className="rounded-md bg-neutral-900 px-3 py-2 font-medium text-white hover:bg-neutral-700"
          href={getMapsUrl(quiz)}
          target="_blank"
          rel="noreferrer"
        >
          Map
        </a>
        <a
          className="rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100"
          href={getIcsUrl(quiz, date)}
          download={`${quiz.id}.ics`}
        >
          Add to calendar
        </a>
        <a
          className="rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100"
          href={quiz.source.url}
          target="_blank"
          rel="noreferrer"
        >
          Source: {quiz.source.label}
        </a>
        <a
          className="rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100"
          href={getReviewUrl(quiz)}
          target="_blank"
          rel="noreferrer"
        >
          Add your review
        </a>
      </div>
      {quiz.reviews.length > 0 ? (
        <section>
          <h4 className="mb-2 text-sm font-semibold">Community reviews</h4>
          <ul className="space-y-2">
            {quiz.reviews.map((review) => (
              <li key={`${review.author}-${review.date}`} className="rounded-md bg-neutral-100 p-3">
                <p className="text-sm font-medium">
                  {review.author} · {'★'.repeat(review.rating)}
                  <span className="text-neutral-400"> · {review.date}</span>
                </p>
                <p className="text-sm text-neutral-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-xs text-neutral-500">
          No reviews yet. Tried this quiz? Add a one-line review and it can appear here after a
          maintainer merges it.
        </p>
      )}
      <p className="text-xs text-neutral-500">
        Last verified {quiz.lastVerified}. Confirm with the venue before heading out — schedules
        change.
      </p>
    </div>
  );
}
