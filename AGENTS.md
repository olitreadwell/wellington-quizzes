# AGENTS.md

Instructions for AI coding agents working in this repo. Read this before
editing anything.

## Where the rules live

- `docs/contributing/` is the shared contributing standard for every change:
  principles, workflow, quality, testing, git, security, documentation,
  verification. Read `docs/contributing/00-index.md` first.
- This file and `CLAUDE.md` hold stack-specific rules. Where they conflict
  with the generic guide, the stack-specific rules win.
- `docs/style-guide.md` and `docs/llm-agent-optimization.md` are the writing
  rules that make this repo navigable by humans and agents alike.

## What this is

A static GitHub Pages site listing recurring pub quizzes around Wellington
on a calendar. The quiz dataset is the product: it lives in
`src/data/quizzes.ts`, is validated by the zod schema in
`src/server/quiz-schema.ts`, and every entry must carry a source URL and a
`lastVerified` date. When adding a quiz, bump `lastVerified` to today and
point `source` at where the listing was found. The dataset tests
(`src/server/quiz-schema.test.ts`) enforce uniqueness and shape.

The site is a Next.js static export (`output: 'export'`,
`basePath: '/wellington-quizzes'`) — no API routes, no server runtime, no
Dockerfile. GitHub Pages deploys `out/` via `.github/workflows/pages.yml`.

Quiz entries can carry optional detail fields (`operator`, `format`,
`prizes`, `booking`, `teamSize`, `tags`, `reviews`) — only add a field when a
public source supports it, and keep `tags` inside the curated vocabulary in
`src/server/quiz-schema.ts`. Community reviews are PR-contributed and stay in
the same file; never invent reviews or ratings. Filter, sort, and compare
logic lives in `src/lib/quiz-filter.ts` and `src/lib/quiz-compare.ts`.

## Non-negotiables

- The one-command contract is `npm run check` = format:check + lint +
  typecheck + test:coverage + build + smoke + e2e + check:links. CI mirrors
  it exactly. A green CI must mean the same as a green local `check`.
- Run `npm run check` before and after every change.
- Pin exact dependency versions. No `^` or `~` ranges.
- No dead code, no commented-out code, no unused dependencies.
- Every exported symbol has a JSDoc comment good enough for IDE hover/peek:
  params and return value where useful.
- Comments explain WHY and HOW, never WHAT the code obviously does.
- Tests prove every behavior change; run them, do not eyeball.
- Input validation at the boundary (zod), structured logs (pino),
  centralized error handling (src/lib/errors.ts).
- Every internal markdown link must resolve; `npm run check:links` enforces it.

## Naming and discoverability

- 2-3 word, domain-prefixed export names (`getUserProfileById`, not `get`).
- One spelling per concept, everywhere.
- No `any` / untyped escape hatches.
- Test files sit next to their source (`logger.test.ts` tests `logger.ts`).

## Workflow

1. Read `docs/contributing/00-index.md`, then this file, `CLAUDE.md`,
   `docs/engineering.md`, `docs/style-guide.md`.
2. Make the smallest change that does the job.
3. Update docs in the same change as the behavior they describe.
4. Commit with conventional messages (`feat:`, `fix:`, `docs:`, `ci:`, ...).
5. Run `npm run check`. Fix failures. Repeat until green.

## Branch policy

- Feature work happens on short-lived branches; PRs merge into `development`.
- `development` -> `main` is the single integration PR, kept up to date.
- After merge, feature branches are deleted.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
