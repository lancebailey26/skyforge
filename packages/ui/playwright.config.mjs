import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';

/** Config file directory (not `process.cwd()`), so `playwright test -c packages/ui/playwright.config.mjs` works from the monorepo root. */
const uiRoot = path.dirname(fileURLToPath(import.meta.url));

const isCi = !!process.env.CI;

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.spec.tsx',
  /** Tiny suite: one worker / sequential avoids extra CT browser reuse cost. Raise when you add many specs. */
  workers: 1,
  fullyParallel: false,
  forbidOnly: isCi,
  retries: 0,
  reporter: isCi ? 'github' : 'dot',
  use: {
    trace: 'off',
    video: 'off',
    screenshot: 'off',
    ctViteConfig: {
      plugins: [react()],
      resolve: {
        alias: {
          '@lancebailey26/skyforge-ui': path.join(uiRoot, 'src'),
        },
      },
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
