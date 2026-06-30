import { defineConfig } from '@playwright/test'

const backendPort = process.env.PLAYWRIGHT_BACKEND_PORT || '3001'
const frontendPort = process.env.PLAYWRIGHT_FRONTEND_PORT || '4174'
const backendUrl = `http://127.0.0.1:${backendPort}`
const frontendUrl = `http://127.0.0.1:${frontendPort}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || frontendUrl,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `PORT=${backendPort} npm start`,
      cwd: './backend',
      url: `${backendUrl}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: `npm run preview -- --host 127.0.0.1 --port ${frontendPort}`,
      cwd: './frontend',
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
})
