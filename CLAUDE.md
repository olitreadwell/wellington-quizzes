# CLAUDE.md

Stack-specific notes for this repo.

- Node 22 (`.nvmrc` is the source of truth; `mise` and `asdf` read it).
- npm with a committed `package-lock.json`. Pick one package manager per repo.
- Next.js static export (`output: 'export'`, `basePath: '/wellington-quizzes'`);
  no API routes, no server runtime. Deployed by `.github/workflows/pages.yml`.
- Vitest coverage gates live in `vitest.config.ts` (v8, 80% lines).
- Playwright config in `playwright.config.ts`; specs in `e2e/`.
- Tailwind 4 via `@tailwindcss/postcss`; shadcn aliases in `components.json`.
- `src/data/quizzes.ts` = the quiz dataset (source of truth for the calendar);
  `src/server/quiz-schema.ts` = zod boundary validation; `src/lib` = pure
  calendar/date logic; `src/app` = routes only.
