import { defineConfig, devices } from '@playwright/test';

// Bundled Chromium is not supported on older macOS; use system Chrome there.
// CI (ubuntu) keeps the bundled browser via `npx playwright install`.
const channel =
  process.env.PLAYWRIGHT_CHANNEL ?? (process.platform === 'darwin' ? 'chrome' : undefined);
// Overridable (E2E_PORT=3101 npm run test:e2e) if the default is taken.
const port = Number(process.env.E2E_PORT ?? 3200);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run dev -- -p ${port}`,
    url: `http://127.0.0.1:${port}/wlg-nz-quizzes/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...(channel ? { channel } : {}) } },
  ],
});
