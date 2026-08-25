# Wellington Quizzes

[![CI](https://github.com/olitreadwell/wellington-quizzes/actions/workflows/ci.yml/badge.svg)](https://github.com/olitreadwell/wellington-quizzes/actions/workflows/ci.yml)
[![Site](https://github.com/olitreadwell/wellington-quizzes/actions/workflows/pages.yml/badge.svg)](https://github.com/olitreadwell/wellington-quizzes/actions/workflows/pages.yml)

Every pub quiz around Wellington on one calendar. Venues, start times, and
details for recurring quiz nights across Wellington City, the Hutt Valley,
and Porirua — with a map link and add-to-calendar file for each one.

Live at: <https://olitreadwell.github.io/wellington-quizzes/>

## Data

- The dataset lives in [`src/data/quizzes.ts`](src/data/quizzes.ts), validated
  by the zod schema in [`src/server/quiz-schema.ts`](src/server/quiz-schema.ts).
- Baseline comes from the Believe it or Not find-a-quiz list
  (<https://believeitornot.co.nz/findaquiz.html>), retrieved 2026-08-25, plus
  entries verified from venue or operator pages.
- Every quiz carries its source URL and a `lastVerified` date. Schedules
  change — the site tells readers to confirm with the venue before heading out.

### Add or fix a quiz

1. Edit [`src/data/quizzes.ts`](src/data/quizzes.ts) — one object per quiz.
2. Set the source and bump `lastVerified` to today.
3. Run `npm run check`; the dataset tests fail on bad days, times, or
   duplicate venue/day pairs.
4. Open a pull request.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:3000/wellington-quizzes |
| `npm run build` | Static export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier check |
| `npm test` | Vitest unit/component tests |
| `npm run test:coverage` | Coverage gate |
| `npm run test:e2e` | Playwright |
| `npm run smoke` | Serve `out/` + curl routes |
| `npm run check:links` | Internal link integrity |
| **`npm run check`** | All of the above |
| `npm run audit` | Dependency audit |

## Deploy

`npm run build` produces a fully static export (`out/`), deployed to GitHub
Pages by [`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every
push to `main`. Pages must be enabled once in repo settings (Settings → Pages
→ Build and deployment → Source: GitHub Actions).

The site runs under the `/wellington-quizzes/` base path (see
`next.config.ts`), matching its GitHub Pages project URL.

## Stack

- Next.js App Router, React 19, TypeScript strict, static export
- Tailwind CSS 4
- Vitest + Testing Library; Playwright e2e
- ESLint 9 flat config + Prettier; husky pre-commit/pre-push
- Zod validation at the data boundary

## Documentation

- [Engineering standards](docs/engineering.md)
- [Testing guide](docs/testing.md)
- [Deployment](docs/deploy.md)
- [Contributing guide](docs/contributing/00-index.md)
