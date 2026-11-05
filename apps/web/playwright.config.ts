import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: { baseURL: 'http://localhost:4173' },
	webServer: [
		{
			command: 'bun --env-file=../../.env ../api/src/index.ts',
			url: 'http://localhost:3000/health',
			reuseExistingServer: true,
			timeout: 60_000
		},
		{
			command: 'bun run build && bun run preview',
			port: 4173,
			reuseExistingServer: true,
			timeout: 180_000
		}
	],
	testMatch: '**/*.e2e.{ts,js}'
});
