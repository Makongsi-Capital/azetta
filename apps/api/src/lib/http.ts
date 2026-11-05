export type ApiErrorCode =
	| 'VALIDATION_ERROR'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'CONFLICT'
	| 'RATE_LIMITED'
	| 'INVALID_CAPTCHA'
	| 'INTERNAL_ERROR';

export interface ApiErrorDetail {
	field?: string;
	message: string;
}

export class ApiError extends Error {
	readonly status: number;
	readonly code: ApiErrorCode;
	readonly details?: ApiErrorDetail[];

	constructor(status: number, code: ApiErrorCode, message: string, details?: ApiErrorDetail[]) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

export const badRequest = (message: string, details?: ApiErrorDetail[]) =>
	new ApiError(400, 'VALIDATION_ERROR', message, details);
export const unauthorized = (message = 'Sesi tidak valid atau sudah berakhir.') =>
	new ApiError(401, 'UNAUTHORIZED', message);
export const forbidden = (message = 'Anda tidak memiliki akses ke sumber daya ini.') =>
	new ApiError(403, 'FORBIDDEN', message);
export const notFound = (message = 'Data tidak ditemukan.') =>
	new ApiError(404, 'NOT_FOUND', message);
export const conflict = (message: string) => new ApiError(409, 'CONFLICT', message);

export interface ListMeta {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export function ok<T>(data: T) {
	return { data };
}

export function list<T>(data: T[], meta: ListMeta) {
	return { data, meta };
}

export function envelopeError(
	error: { code: ApiErrorCode; message: string; details?: ApiErrorDetail[] },
	requestId: string
) {
	return { error: { ...error, requestId } };
}

interface PaginationOptions {
	defaultPerPage: number;
	maxPerPage: number;
}

export function parsePagination(
	query: Record<string, string | undefined>,
	{ defaultPerPage, maxPerPage }: PaginationOptions
): { page: number; perPage: number; skip: number; take: number } {
	const page = Math.max(1, toInt(query.page) ?? 1);
	const requested = toInt(query.perPage) ?? defaultPerPage;
	const perPage = Math.min(maxPerPage, Math.max(1, requested));
	return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}

export function toInt(value: string | undefined | null): number | undefined {
	if (value === undefined || value === null || value.trim() === '') return undefined;
	const parsed = Number(value);
	return Number.isInteger(parsed) ? parsed : undefined;
}

export function toStringArray(value: string | string[] | undefined): string[] {
	if (!value) return [];
	return (Array.isArray(value) ? value : value.split(','))
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/** Ambil nilai enum dari query; nilai tak dikenal diabaikan (lihat docs §2.2). */
export function pickEnum<T extends string>(
	value: string | undefined,
	allowed: readonly T[]
): T | undefined {
	return allowed.includes(value as T) ? (value as T) : undefined;
}

export function normalizeSearch(value: string | undefined): string | undefined {
	const term = value?.trim().replace(/\p{Cc}/gu, '');
	return term ? term.slice(0, 100) : undefined;
}
