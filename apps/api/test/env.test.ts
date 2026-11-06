import { describe, expect, it } from 'vitest';
import { EnvValidationError, loadEnv } from '../src/env';

const validEnv: Record<string, string> = {
	NODE_ENV: 'development',
	DATABASE_URL: 'postgresql://azetta:azetta@localhost:5432/azetta?schema=public',
	BETTER_AUTH_SECRET: 'dev-only-better-auth-secret-change-me',
	BETTER_AUTH_URL: 'http://localhost:3000',
	IP_HASH_SALT: 'dev-salt',
	OBJECT_STORAGE_ACCESS_KEY_ID: 'dev-key',
	OBJECT_STORAGE_SECRET_ACCESS_KEY: 'dev-secret',
	OBJECT_STORAGE_BUCKET: 'azetta-dev-media',
	OBJECT_STORAGE_PUBLIC_URL: 'http://localhost:9000/azetta-dev-media',
	TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
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
		expect(() => loadEnv({ ...validEnv, BETTER_AUTH_URL: 'bukan-url' })).toThrow(/BETTER_AUTH_URL/);
	});
});
