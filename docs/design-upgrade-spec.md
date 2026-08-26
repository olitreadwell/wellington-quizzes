# Design upgrade spec

Audit run with the `redesign-existing-projects` skill (taste-skill) on
2026-08-26. The site is a data utility (calendar + listing), so the audit
applies selectively: typography, color warmth, states, and a11y polish, not a
marketing-page redesign.

## Findings

- No custom font: browser default body, no display type. Headlines lack
  presence; times are proportional figures.
- Cool gray (`neutral`) palette everywhere. Consistent, but sterile for a pub
  quiz site; no warmth.
- No `transition` or pressed-state feedback on interactive elements.
- No visible `:focus-visible` styling (keyboard users get nothing).
- No skip-to-content link.
- No custom 404 page (static export serves the default).
- No favicon; no Open Graph tags.
- Empty template dirs `src/app/api/hello` and `src/app/health` (dead code).

## Changes

1. **Typography**: `Fraunces` (display serif, pub-sign warmth) for headings,
   `Geist` for body, via `next/font/google`. Bigger `h1` with tight tracking
   and `text-wrap: balance`. `tabular-nums` on all times.
2. **Color**: swap `neutral-*` for `stone-*` (warm gray family). Keep the
   single amber accent.
3. **States**: `transition-colors` + `active:scale-[0.98]` on buttons; global
   `:focus-visible` ring.
4. **A11y**: skip-to-content link; axe test on the homepage.
5. **404**: playful `not-found.tsx` ("this page is a trick question").
6. **Meta**: SVG favicon (`app/icon.svg`), Open Graph tags.
7. **Cleanup**: remove empty `api/hello` and `health` dirs.

## Out of scope

- No new dependencies (fonts come from `next/font`).
- No layout overhaul: the calendar grid and listing structure stay.
- No `og:image` (no raster asset; would need a generated image).

## Verification

- `npm run check` green (format, lint, typecheck, coverage, build, smoke,
  e2e, links).
- New axe test on `QuizDetail` passes with zero violations (axe on the full
  calendar DOM is too slow under coverage instrumentation).
