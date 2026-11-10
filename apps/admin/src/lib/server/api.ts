const API_BASE = (process.env.PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Better Auth menolak POST ber-cookie tanpa `Origin` tepercaya. */
const API_ORIGIN = (() => {
	try {
		return new URL(API_BASE).origin;
	} catch {
		return API_BASE;
	}
})();

export interface ApiUser {
	id: string;
	name: string;
	email: string;
	role: string;
	emailVerified: boolean;
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

export interface ApiResult<T> {
	data: T;
	meta?: { page: number; perPage: number; total: number; totalPages: number };
	setCookies: string[];
}

interface ApiOptions {
	cookie?: string | null;
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: unknown;
	fetcher?: typeof fetch;
}

function requestBody(body: unknown): BodyInit | undefined {
	if (body === undefined) return undefined;
	// FormData mengatur boundary multipart sendiri; jangan set content-type manual.
	return body instanceof FormData ? body : JSON.stringify(body);
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
	const fetcher = options.fetcher ?? fetch;
	const headers = new Headers({ accept: 'application/json' });
	if (options.body !== undefined && !(options.body instanceof FormData)) {
		headers.set('content-type', 'application/json');
	}
	if (options.cookie) headers.set('cookie', options.cookie);
	headers.set('origin', API_ORIGIN);

	const response = await fetcher(`${API_BASE}${path}`, {
		method: options.method ?? 'GET',
		headers,
		body: requestBody(options.body)
	});

	const setCookies =
		typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
	const text = await response.text();
	const payload = text ? (JSON.parse(text) as unknown) : null;

	if (!response.ok) {
		const errorBody =
			payload && typeof payload === 'object' && 'error' in payload
				? ((payload as { error: ApiErrorBody }).error as ApiErrorBody)
				: null;
		throw new ApiRequestError(response.status, errorBody);
	}

	const envelope = (payload ?? {}) as { data?: T; meta?: ApiResult<T>['meta'] };
	return { data: envelope.data as T, meta: envelope.meta, setCookies };
}

/** Varian untuk endpoint Better Auth yang tidak memakai amplop `{ data }`. */
export async function apiRequestRaw<T>(
	path: string,
	options: ApiOptions = {}
): Promise<{ data: T | null; setCookies: string[] }> {
	const fetcher = options.fetcher ?? fetch;
	const headers = new Headers({ accept: 'application/json' });
	if (options.body !== undefined && !(options.body instanceof FormData)) {
		headers.set('content-type', 'application/json');
	}
	if (options.cookie) headers.set('cookie', options.cookie);
	headers.set('origin', API_ORIGIN);

	const response = await fetcher(`${API_BASE}${path}`, {
		method: options.method ?? 'GET',
		headers,
		body: requestBody(options.body)
	});

	const setCookies =
		typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
	const text = await response.text();
	const payload = text ? (JSON.parse(text) as unknown) : null;

	if (!response.ok) {
		const errorBody =
			payload && typeof payload === 'object' && 'error' in payload
				? ((payload as { error: ApiErrorBody }).error as ApiErrorBody)
				: null;
		throw new ApiRequestError(response.status, errorBody);
	}

	return { data: payload as T | null, setCookies };
}

export async function fetchSession(
	cookie: string | null | undefined,
	fetcher?: typeof fetch
): Promise<{ user: ApiUser | null; setCookies: string[] }> {
	if (!cookie) return { user: null, setCookies: [] };

	try {
		const result = await apiRequestRaw<{
			session: unknown;
			user: ApiUser;
		}>('/api/auth/get-session', { cookie, fetcher });
		return { user: result.data?.user ?? null, setCookies: result.setCookies };
	} catch (error) {
		console.warn('[api] get-session gagal', error);
		return { user: null, setCookies: [] };
	}
}

export async function signOut(cookie: string | null | undefined, fetcher?: typeof fetch) {
	try {
		await apiRequest('/api/auth/sign-out', {
			method: 'POST',
			cookie,
			body: {},
			fetcher
		});
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
		// SvelteKit meng-encode nilai cookie sekali lagi saat cookies.set().
		value = decodeURIComponent(rawValue);
	} catch {
		value = rawValue;
	}
	const options: ParsedCookie['options'] = { path: '/' };

	for (const attribute of attributes) {
		const index = attribute.indexOf('=');
		const key = (index === -1 ? attribute : attribute.slice(0, index)).toLowerCase();
		const rawValue = index === -1 ? '' : attribute.slice(index + 1);

		if (key === 'path' && rawValue) options.path = rawValue;
		else if (key === 'domain' && rawValue) options.domain = rawValue;
		else if (key === 'max-age' && rawValue) options.maxAge = Number(rawValue);
		else if (key === 'expires' && rawValue) options.expires = new Date(rawValue);
		else if (key === 'httponly') options.httpOnly = true;
		else if (key === 'secure') options.secure = true;
		else if (key === 'samesite') {
			const sameSite = rawValue.toLowerCase();
			if (sameSite === 'strict' || sameSite === 'lax' || sameSite === 'none') {
				options.sameSite = sameSite;
			}
		}
	}

	return { name, value, options };
}
