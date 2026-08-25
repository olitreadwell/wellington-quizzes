# WLG NZ Quizzes - Project Context

Snapshot for agents and future sessions. Read `AGENTS.md` and
`docs/contributing/00-index.md` for rules; this file captures state, sources,
gotchas, and where the project is headed.

## Identity

- Repo: `olitreadwell/wlg-nz-quizzes` (renamed from `wellington-quizzes`, Aug 2026)
- Local path: `/Users/olitreadwell/code/wlg-nz-quizzes`
- Site: https://olitreadwell.github.io/wlg-nz-quizzes/ (GitHub Pages, static export)
- Old site URL 404s - GitHub Pages does not redirect on repo rename

## What it is

Static GitHub Pages calendar of recurring pub quizzes around Wellington
(WLG), NZ - venues, days, times, details, map links, add-to-calendar files.
Visitors can search, filter (area/day/schedule/tag), sort, compare up to five
quizzes side by side, and submit community reviews via PR.

## Stack

- Next.js 16 App Router, React 19, TS strict, `output: 'export'`,
  `basePath: '/wlg-nz-quizzes'`
- Tailwind 4, Vitest + Testing Library + coverage gate (80% lines on
  `src/lib` + `src/server`), Playwright e2e, ESLint 9 + Prettier, husky,
  zod boundary validation
- No API routes, no server runtime, no Dockerfile (static export only)

## Commands

- `npm run dev` - dev server at http://localhost:3000/wlg-nz-quizzes
- `npm run build` - static export to `out/`
- `npm run smoke` - serves `out/` on port 3521 and curls routes
- `npm run test:e2e` - Playwright (dev server on port 3200)
- `npm run check` - full gate: format, lint, typecheck, coverage, build,
  smoke, e2e, links
- `npm run audit` - dependency audit

CI mirrors `npm run check` plus actionlint, yamllint, codespell, audit.
Pages deploys `out/` on every push to `main` (`.github/workflows/pages.yml`).

## Data model

- Dataset: `src/data/quizzes.ts` - 57 recurring quizzes
- Schema: `src/server/quiz-schema.ts` (zod). Fields: id, venue, suburb,
  address, area (6 areas incl. Kapiti Coast + Wairarapa), dayOfWeek,
  startTime (24h), cadence (weekly / fortnightly / monthly / seasonal),
  cadenceNote, cost, prizes, format, teamSize, booking, notes, operator,
  tags (curated enum: biggest, big prizes, book ahead, early start,
  political, waterfront, seasonal, monthly, fortnightly, reported), reviews,
  source {label, url}, lastVerified
- Calendar math: `src/lib/quiz-utils.ts` (Monday-first grid, nth/last weekday
  occurrences); filters/sort: `src/lib/quiz-filter.ts`; compare:
  `src/lib/quiz-compare.ts`
- UI: `src/components/quiz-calendar.tsx`, `quiz-detail.tsx`,
  `quiz-compare-dialog.tsx`

## Data rules (non-negotiable)

- Every entry needs a source URL + `lastVerified` date; only add a detail
  field when a public source supports it
- Tags stay inside the curated enum in `quiz-schema.ts` - extend the enum
  deliberately, not per-entry
- Reviews are PR-contributed; never invent reviews or ratings
- Only list quizzes with a published day/time. Facebook/Instagram-only
  venues are excluded unless a schedule is scrapeable
- One-off events (fundraisers, one-night specials) are out of scope - the
  calendar is recurring-only

## Sources so far

- Believe it or Not find-a-quiz JSON (believeitornot.co.nz) - ~37 venues
- Eventfinda Wellington Region search (recurring quiz events + venue pages):
  Kelburn Village Pub, Amador, Three Sisters Brewery, Crooked Elm, Realm,
  Parrotdog, Fermented, Mama's Sizzler, Eastbourne Sports & Services Club,
  Abandoned Taproom, Lovy's Eatery, Kai Tahi, The Office, Waitoa,
  Johnsonville Club, and more
- Venue/operator sites: Star Group (Hotel Bristol, Southern Cross), Eva Pub
  (Gee Quiz), Gibbons Hotel, The Old Bailey
- r/Wellington reported: Moon (Newtown), unverified

## Known gaps / candidates

- Wairarapa thin (1 entry: Grill at Solway Park) - check Masterton /
  Carterton / Greytown pubs and clubs (Nara Martinborough quiz was a one-off)
- Facebook-only venues with quiz nights but no public schedule: Four Kings /
  Jack Hackett's (= Gibbons group, already listed), Kitty O'Brien's,
  Golding's Free Dive, Bad Grannies, Crafty Tavern, Mishmosh
- Special/one-off quizzes (BATS fundraiser, Featherston History Quiz,
  Disney Pub Trivia at Dakota) deliberately not included

## Gotchas

- E2E default port is 3200 - 3100 is used by the user's `wlg-house-hunt` dev
  server; never kill user processes
- `out/` and `node_modules` are gitignored; `src/data` is tracked (the
  template's blanket `data` gitignore rule was fixed to `/data`)
- Prettier must run on `src/data/quizzes.ts` after edits (CI enforces)
- GitHub Pages: enable Source: GitHub Actions in repo settings; old site URL
  not redirected

## Recent history

- 2026-08-25: scaffolded from `olitreadwell/template`, 36 quizzes
- 2026-08-25: filters, compare, reviews, tags, +Kapiti/Wairarapa (41)
- 2026-08-26: +11 Eventfinda/venue-site quizzes (52)
- 2026-08-26: +5 more (Waitoa, Kai Tahi, Lovy's, The Office, Johnsonville
  Club) - 57 total
- 2026-08-26: renamed to `wlg-nz-quizzes` + "WLG NZ Quizzes" branding

## Natural next steps

- Verify/sync Believe it or Not baseline entries (may be stale)
- Enrich more entries with cost/prizes/booking from venue pages
- Wairarapa + Otaki/Kapiti coverage
- Community reviews: seed via PRs, then surface average rating in compare
