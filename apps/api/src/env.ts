import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const EnvSchema = Type.Object({
	NODE_ENV: Type.Union(
		[Type.Literal('development'), Type.Literal('test'), Type.Literal('production')],
		{ default: 'development' }
	),
	PORT: Type.Number({ default: 3000, minimum: 1, maximum: 65535 }),
	DATABASE_URL: Type.String({ minLength: 1 }),
	BETTER_AUTH_SECRET: Type.String({ minLength: 32 }),
	BETTER_AUTH_URL: Type.String({ minLength: 1 }),
	WEB_ORIGIN: Type.String({ minLength: 1 }),
	ADMIN_ORIGIN: Type.String({ minLength: 1 }),
	COOKIE_DOMAIN: Type.String({ default: '' }),
	IP_HASH_SALT: Type.String({ minLength: 1 }),
	R2_ACCOUNT_ID: Type.String({ minLength: 1 }),
	R2_ACCESS_KEY_ID: Type.String({ minLength: 1 }),
	R2_SECRET_ACCESS_KEY: Type.String({ minLength: 1 }),
	R2_BUCKET: Type.String({ minLength: 1 }),
	R2_PUBLIC_BASE_URL: Type.String({ minLength: 1 }),
	TURNSTILE_SECRET_KEY: Type.String({ minLength: 1 }),
	PUBLIC_TURNSTILE_SITE_KEY: Type.String({ minLength: 1 }),
	PUBLIC_API_BASE_URL: Type.String({ minLength: 1 }),
	RESEND_API_KEY: Type.String({ minLength: 1 }),
	MAIL_FROM: Type.String({ minLength: 1 }),
	SALES_NOTIFY_EMAIL: Type.String({ minLength: 1 }),
	SENTRY_DSN: Type.Optional(Type.String()),
	CLOUDFLARE_ZONE_ID: Type.Optional(Type.String()),
	CLOUDFLARE_PURGE_TOKEN: Type.Optional(Type.String()),
	RESEND_WEBHOOK_SECRET: Type.Optional(Type.String()),
	ADMIN_BOOTSTRAP_EMAIL: Type.Optional(Type.String()),
	ADMIN_BOOTSTRAP_PASSWORD: Type.Optional(Type.String())
});

export type Env = Static<typeof EnvSchema>;

export class EnvValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EnvValidationError';
	}
}

const REQUIRED_KEYS = [
	'DATABASE_URL',
	'BETTER_AUTH_SECRET',
	'BETTER_AUTH_URL',
	'WEB_ORIGIN',
	'ADMIN_ORIGIN',
	'IP_HASH_SALT',
	'R2_ACCOUNT_ID',
	'R2_ACCESS_KEY_ID',
	'R2_SECRET_ACCESS_KEY',
	'R2_BUCKET',
	'R2_PUBLIC_BASE_URL',
	'TURNSTILE_SECRET_KEY',
	'PUBLIC_TURNSTILE_SITE_KEY',
	'PUBLIC_API_BASE_URL',
	'RESEND_API_KEY',
	'MAIL_FROM',
	'SALES_NOTIFY_EMAIL'
] as const;

const URL_KEYS = [
	'BETTER_AUTH_URL',
	'WEB_ORIGIN',
	'ADMIN_ORIGIN',
	'R2_PUBLIC_BASE_URL',
	'PUBLIC_API_BASE_URL'
] as const;

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
	const missing = REQUIRED_KEYS.filter((key) => (source[key] ?? '').trim() === '');
	if (missing.length > 0) {
		throw new EnvValidationError(`Variabel environment wajib belum diisi: ${missing.join(', ')}`);
	}

	const input: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(source)) {
		if (value !== undefined) input[key] = value;
	}

	const parsed = Value.Convert(EnvSchema, Value.Default(EnvSchema, input));

	if (!Value.Check(EnvSchema, parsed)) {
		const details = [...Value.Errors(EnvSchema, parsed)].map(
			(error) => `${error.path === '' ? 'env' : error.path}: ${error.message}`
		);
		throw new EnvValidationError(`Konfigurasi environment tidak valid:\n- ${details.join('\n- ')}`);
	}

	const invalidUrls = URL_KEYS.filter((key) => {
		try {
			new URL(String(parsed[key]));
			return false;
		} catch {
			return true;
		}
	});
	if (invalidUrls.length > 0) {
		throw new EnvValidationError(`Nilai URL tidak valid: ${invalidUrls.join(', ')}`);
	}

	return parsed as Env;
}

let cached: Env | undefined;

export function getEnv(): Env {
	cached ??= loadEnv();
	return cached;
}
