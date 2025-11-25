import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  testMatch: ['**/*.spec.ts'],
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    headless: true,
  },
  webServer: {
    command: 'wsl bash -lc "cd /mnt/d/projetos/zappro-ajudatec-wilrefrimix/zappro-ajudatec-wilrefrimix/apps/saas && ADMIN_PASSWORD_HASH=\$2a\$10\$DWgPqmoyJ/MTKWjNWTev5OmJSIwS04THubvwj/N4BkzJgmt9cPdZe ADMIN_SESSION_SECRET=dev-admin-secret-3001 ALLOWED_ORIGIN=http://localhost:3001 NEXT_PUBLIC_WEBSITE_URL=http://localhost:3001 NEXT_PUBLIC_FAKE_AUTH_EMAIL=test@test.com NEXT_PUBLIC_FAKE_AUTH_PASSWORD=12345678A ./node_modules/.bin/next dev -p 3001"',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120000,
  },
  reporter: 'line',
})
