import { describe, expect, it } from 'vitest';
import { EnvValidationError, loadEnv } from '../src/env';

const validEnv: Record<string, string> = {
	NODE_ENV: 'development',
	DATABASE_URL: 'postgresql://azetta:azetta@localhost:5432/azetta?schema=public',
	BETTER_AUTH_SECRET: 'dev-only-better-auth-secret-change-me',
	BETTER_AUTH_URL: 'http://localhost:3000',
	WEB_ORIGIN: 'http://localhost:5173',
	ADMIN_ORIGIN: 'http://localhost:5174',
	IP_HASH_SALT: 'dev-salt',
	R2_ACCOUNT_ID: 'dev-account',
	R2_ACCESS_KEY_ID: 'dev-key',
	R2_SECRET_ACCESS_KEY: 'dev-secret',
	R2_BUCKET: 'azetta-dev-media',
	R2_PUBLIC_BASE_URL: 'http://localhost:9000/azetta-dev-media',
	TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
	PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
	PUBLIC_API_BASE_URL: 'http://localhost:3000',
	RESEND_API_KEY: 're_dev_placeholder',
	MAIL_FROM: 'no-reply@azetta.test',
	SALES_NOTIFY_EMAIL: 'sales@azetta.test'
};

describe('loadEnv', () => {
	it('menerima konfigurasi lengkap dan menerapkan nilai default', () => {
		const env = loadEnv(validEnv);

		expect(env.PORT).toBe(3000);
		expect(env.COOKIE_DOMAIN).toBe('');
		expect(env.NODE_ENV).toBe('development');
	});

	it('mengubah PORT menjadi angka', () => {
		const env = loadEnv({ ...validEnv, PORT: '8080' });

		expect(env.PORT).toBe(8080);
	});

	it('menolak start bila variabel wajib kosong', () => {
		const { DATABASE_URL: _removed, ...withoutDatabase } = validEnv;

		expect(() => loadEnv(withoutDatabase)).toThrow(EnvValidationError);
		expect(() => loadEnv(withoutDatabase)).toThrow(/DATABASE_URL/);
	});

	it('menolak BETTER_AUTH_SECRET yang kurang dari 32 karakter', () => {
		expect(() => loadEnv({ ...validEnv, BETTER_AUTH_SECRET: 'terlalu-pendek' })).toThrow(
			EnvValidationError
		);
	});

	it('menolak URL yang tidak valid', () => {
		expect(() => loadEnv({ ...validEnv, WEB_ORIGIN: 'bukan-url' })).toThrow(/WEB_ORIGIN/);
	});
});
