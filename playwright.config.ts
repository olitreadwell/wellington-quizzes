import { defineConfig, devices } from '@playwright/test';
import { createServer } from 'node:net';

/**
 * Pick a free localhost port so parallel worktrees and other dev servers
 * never fight over the default.
 *
 * @returns An available port
 */
async function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      probe.close(() => resolve(typeof address === 'object' && address ? address.port : 3100));
    });
  });
}

// Bundled Chromium is not supported on older macOS; use system Chrome there.
// CI (ubuntu) keeps the bundled browser via `npx playwright install`.
const channel =
  process.env.PLAYWRIGHT_CHANNEL ?? (process.platform === 'darwin' ? 'chrome' : undefined);
// Overridable so parallel worktrees do not fight over one port.
const port = Number(process.env.E2E_PORT ?? (await findFreePort()));

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
    url: `http://127.0.0.1:${port}/wellington-quizzes/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...(channel ? { channel } : {}) } },
  ],
});
