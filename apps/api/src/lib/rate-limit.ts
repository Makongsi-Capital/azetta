interface Bucket {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
	allowed: boolean;
	retryAfterSeconds: number;
}

/** Rate limiter in-memory sederhana (docs §6). Cukup untuk satu instance API. */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
	}

	bucket.count += 1;
	if (bucket.count > limit) {
		return {
			allowed: false,
			retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
		};
	}
	return { allowed: true, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}

export function clientIp(headers: Headers): string {
	return (
		headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
	);
}

/** Bersihkan bucket kedaluwarsa secara berkala agar memori tidak tumbuh. */
export function pruneRateLimits(): void {
	const now = Date.now();
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}
