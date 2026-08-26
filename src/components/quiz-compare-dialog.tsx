import { useEffect, useRef } from 'react';
import { buildCompareRows } from '@/lib/quiz-compare';
import type { Quiz } from '@/server/quiz-schema';

/**
 * Side-by-side comparison table for the quizzes a visitor selected.
 *
 * @param props - Component props
 * @param props.quizzes - Quizzes to compare
 * @param props.onClose - Called when the dialog closes
 * @returns The compare dialog
 */
export function QuizCompareDialog({ quizzes, onClose }: { quizzes: Quiz[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rows = buildCompareRows(quizzes);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = (): void => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Compare quizzes"
      onClose={onClose}
      className="w-full max-w-3xl rounded-xl p-6 backdrop:bg-black/40"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold tracking-tight">Compare quizzes</h2>
        <button
          type="button"
          onClick={close}
          className="rounded-md border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100"
        >
          Close
        </button>
      </div>
      <div className="max-h-[70vh] overflow-auto rounded-lg border border-stone-200">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-stone-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-stone-500">Attribute</th>
              {quizzes.map((quiz) => (
                <th key={quiz.id} className="min-w-40 px-3 py-2 text-left font-semibold">
                  {quiz.venue}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                <td className="px-3 py-2 align-top font-medium text-stone-500">{row.label}</td>
                {row.values.map((value, column) => (
                  <td key={column} className="px-3 py-2 align-top">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Compare up to five quizzes at a time. Pick from the day-by-day list or a quiz’s detail
        sheet.
      </p>
    </dialog>
  );
}
