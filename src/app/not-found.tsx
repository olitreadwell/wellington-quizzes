import Link from 'next/link';

/**
 * Playful 404 page for the static export.
 *
 * @returns The not-found page content
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-amber-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-balance">
        This page is a trick question.
      </h1>
      <p className="mt-2 text-stone-600">
        No quiz runs here. Head back to the calendar and pick a real one.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700"
      >
        Back to the quizzes
      </Link>
    </main>
  );
}
