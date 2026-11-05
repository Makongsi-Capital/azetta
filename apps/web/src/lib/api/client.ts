import { PUBLIC_API_BASE_URL } from '$app/env/public';

const DEFAULT_BASE = 'http://localhost:3000';

/** Basis URL API; dipakai untuk SSR maupun panggilan dari browser. */
export function apiBaseUrl(): string {
	return (PUBLIC_API_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
}

export interface ListMeta {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export interface ApiUser {
	id: string;
	name: string;
	email: string;
	role: string;
	emailVerified: boolean;
	phone?: string | null;
	whatsapp?: string | null;
	city?: string | null;
	company?: string | null;
}

export interface ApiErrorBody {
	code?: string;
	message?: string;
	details?: { field?: string; message: string }[];
}

export class ApiRequestError extends Error {
	readonly status: number;
	readonly code: string;
	readonly details?: { field?: string; message: string }[];

	constructor(status: number, body: ApiErrorBody | null) {
		super(body?.message ?? 'Permintaan ke API gagal.');
		this.name = 'ApiRequestError';
		this.status = status;
		this.code = body?.code ?? 'INTERNAL_ERROR';
		this.details = body?.details;
	}
}

export type QueryValue = string | number | boolean | undefined | null;

export interface ApiResult<T> {
	data: T;
	meta?: ListMeta;
	setCookies: string[];
}

interface ApiOptions {
	fetcher?: typeof fetch;
	cookie?: string | null;
	query?: Record<string, QueryValue>;
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: unknown;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
	const url = `${apiBaseUrl()}${path}`;
	if (!query) return url;

	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null || value === '') continue;
		params.set(key, String(value));
	}
	const search = params.toString();
	return search ? `${url}?${search}` : url;
}

async function send(path: string, options: ApiOptions) {
	const fetcher = options.fetcher ?? fetch;
	const headers = new Headers({ accept: 'application/json' });
	const isFormData = options.body instanceof FormData;
	if (options.body !== undefined && !isFormData) headers.set('content-type', 'application/json');
	if (options.cookie) headers.set('cookie', options.cookie);

	const response = await fetcher(buildUrl(path, options.query), {
		method: options.method ?? 'GET',
		headers,
		body:
			options.body === undefined
				? undefined
				: isFormData
					? (options.body as FormData)
					: JSON.stringify(options.body)
	});

	const setCookies =
		typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
	const text = await response.text();
	const payload = text ? (JSON.parse(text) as unknown) : null;

	if (!response.ok) {
		const errorBody =
			payload && typeof payload === 'object' && 'error' in payload
				? ((payload as { error: ApiErrorBody }).error ?? null)
				: null;
		throw new ApiRequestError(response.status, errorBody);
	}

	return { payload, setCookies };
}

/** Panggilan endpoint ber-amplop `{ data, meta }`. */
export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
	const { payload, setCookies } = await send(path, options);
	const envelope = (payload ?? {}) as { data?: T; meta?: ListMeta };
	return { data: envelope.data as T, meta: envelope.meta, setCookies };
}

/** Panggilan endpoint Better Auth yang tidak memakai amplop `{ data }`. */
export async function apiRequestRaw<T>(
	path: string,
	options: ApiOptions = {}
): Promise<{ data: T | null; setCookies: string[] }> {
	const { payload, setCookies } = await send(path, options);
	return { data: payload as T | null, setCookies };
}

export async function fetchSession(
	cookie: string | null | undefined,
	fetcher?: typeof fetch
): Promise<{ user: ApiUser | null; setCookies: string[] }> {
	if (!cookie) return { user: null, setCookies: [] };

	try {
		const result = await apiRequestRaw<{ session: unknown; user: ApiUser }>(
			'/api/auth/get-session',
			{ cookie, fetcher }
		);
		return { user: result.data?.user ?? null, setCookies: result.setCookies };
	} catch (error) {
		console.warn('[api] get-session gagal', error);
		return { user: null, setCookies: [] };
	}
}

export async function signOut(cookie: string | null | undefined, fetcher?: typeof fetch) {
	try {
		await apiRequest('/api/auth/sign-out', { method: 'POST', cookie, body: {}, fetcher });
	} catch {
		// Sesi mungkin sudah tidak valid; cookie tetap dibersihkan.
	}
}

export interface ParsedCookie {
	name: string;
	value: string;
	options: {
		path: string;
		domain?: string;
		maxAge?: number;
		expires?: Date;
		httpOnly?: boolean;
		secure?: boolean;
		sameSite?: 'strict' | 'lax' | 'none';
	};
}

/** Pecah header Set-Cookie Better Auth agar bisa diteruskan lewat cookie SvelteKit. */
export function parseSetCookie(header: string): ParsedCookie | null {
	const [pair, ...attributes] = header.split(';').map((part) => part.trim());
	if (!pair) return null;
	const separator = pair.indexOf('=');
	if (separator === -1) return null;

	const name = pair.slice(0, separator);
	const rawValue = pair.slice(separator + 1);
	let value: string;
	try {
		value = decodeURIComponent(rawValue);
	} catch {
		value = rawValue;
	}
	const options: ParsedCookie['options'] = { path: '/' };

	for (const attribute of attributes) {
		const index = attribute.indexOf('=');
		const key = (index === -1 ? attribute : attribute.slice(0, index)).toLowerCase();
		const attributeValue = index === -1 ? '' : attribute.slice(index + 1);

		if (key === 'path' && attributeValue) options.path = attributeValue;
		else if (key === 'domain' && attributeValue) options.domain = attributeValue;
		else if (key === 'max-age' && attributeValue) options.maxAge = Number(attributeValue);
		else if (key === 'expires' && attributeValue) options.expires = new Date(attributeValue);
		else if (key === 'httponly') options.httpOnly = true;
		else if (key === 'secure') options.secure = true;
		else if (key === 'samesite') {
			const sameSite = attributeValue.toLowerCase();
			if (sameSite === 'strict' || sameSite === 'lax' || sameSite === 'none') {
				options.sameSite = sameSite;
			}
		}
	}

	return { name, value, options };
}
