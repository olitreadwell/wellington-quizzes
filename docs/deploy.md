# Deployment

- GitHub Pages: push to `main`; [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)
  runs `npm run build` and deploys the static `out/` directory. Enable Pages
  once in repo settings (Settings → Pages → Build and deployment → Source:
  GitHub Actions).
- The site lives at `https://<owner>.github.io/wellington-quizzes/`, so the
  Next.js config pins `basePath: '/wellington-quizzes'` and
  `output: 'export'`. Change both if the repo is renamed.
- No runtime environment variables: the site is fully static and the dataset
  is compiled in at build time.
