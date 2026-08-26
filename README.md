# WLG NZ Quizzes

[![CI](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/ci.yml/badge.svg)](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/ci.yml)
[![Site](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/pages.yml/badge.svg)](https://github.com/olitreadwell/wlg-nz-quizzes/actions/workflows/pages.yml)

Every pub quiz around Wellington on one calendar. Venues, start times, and
details for recurring quiz nights across Wellington City, the Hutt Valley,
Porirua, the Kapiti Coast, and Wairarapa — with a map link and
add-to-calendar file for each one.

Filter by area, day, schedule, or tag; search by venue or suburb; compare up
to five quizzes side by side; and leave a review for a quiz you have tried.

Live at: <https://olitreadwell.github.io/wlg-nz-quizzes/>

## Data

- The dataset lives in [`src/data/quizzes.ts`](src/data/quizzes.ts), validated
  by the zod schema in [`src/server/quiz-schema.ts`](src/server/quiz-schema.ts).
  Each quiz can carry details like operator, format, prizes, booking advice,
  curated tags, and community reviews.
- Baseline comes from the Believe it or Not find-a-quiz list
  (<https://believeitornot.co.nz/findaquiz.html>), retrieved 2026-08-25, plus
  entries verified from venue or operator pages, plus currently listed
  recurring quiz events from Eventfinda (Wellington Region) and venue sites
  such as Star Group, Eva Pub, and The Old Bailey.
- Every quiz carries its source URL and a `lastVerified` date. Schedules
  change — the site tells readers to confirm with the venue before heading out.

### Add, fix, or review a quiz

1. Edit [`src/data/quizzes.ts`](src/data/quizzes.ts) — one object per quiz.
2. Set the source and bump `lastVerified` to today.
3. Run `npm run check`; the dataset tests fail on bad days, times, or
   duplicate venue/day pairs.
4. Open a pull request.

Reviews are stored inside the same data file (see the `reviews` field in the
schema): one object per review with an author, 1-5 star rating, a one-liner,
and a date. The site links straight to a prefilled review issue from every
quiz detail sheet.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:3000/wlg-nz-quizzes |
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

The same build deploys to Vercel: the `VERCEL` build env flips `basePath` to
the root so the site serves from the domain apex. See `docs/deploy.md`.

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
