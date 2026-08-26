# Deployment

- GitHub Pages: push to `main`; [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)
  runs `npm run build` and deploys the static `out/` directory. Enable Pages
  once in repo settings (Settings → Pages → Build and deployment → Source:
  GitHub Actions).
- The site lives at `https://<owner>.github.io/wlg-nz-quizzes/`, so the
  Next.js config defaults `basePath: '/wlg-nz-quizzes'` and
  `output: 'export'`. Change the default if the repo is renamed.
- Vercel: import the repo (or `vercel deploy` from this directory). The
  `VERCEL` build env is set automatically, which flips `basePath` to the root
  so the site serves from the domain apex. Next.js is auto-detected and the
  static export is served as-is.
- Vercel git deploys are restricted to `main` (production) and `development`
  (preview) by [`vercel.json`](../vercel.json) (`git.deploymentEnabled`);
  pushes to any other branch are ignored. `github.autoJobCancelation` keeps
  the default behaviour: a new commit on a branch cancels queued and
  in-progress builds for that branch so only the latest commit deploys.
- No runtime environment variables: the site is fully static and the dataset
  is compiled in at build time.
