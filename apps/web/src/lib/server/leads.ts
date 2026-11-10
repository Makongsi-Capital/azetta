import { fail } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/api/client.js';
import type { ApiLeadReceipt, ApiMediaItem, LeadType } from '#lib/api/types.js';

export interface LeadActionData {
	success?: boolean;
	reference?: string;
	message?: string;
	values?: Record<string, string>;
}

interface SubmitOptions {
	cookie?: string | null;
	type: LeadType;
	unitId?: number;
	landingPath?: string;
	referrerUrl?: string | null;
	withLand?: boolean;
}

const text = (form: FormData, key: string): string => {
	const value = form.get(key);
	return typeof value === 'string' ? value.trim() : '';
};

const MAX_ATTACHMENTS = 5;

/** Unggah foto lahan satu per satu; API membatasi MIME dan ukuran (5 MB). */
async function uploadAttachments(files: File[], cookie?: string | null): Promise<string[]> {
	const keys: string[] = [];

	for (const file of files) {
		const body = new FormData();
		body.set('file', file);
		const result = await apiRequest<ApiMediaItem>('/api/v1/public/uploads', {
			cookie,
			method: 'POST',
			body
		});
		keys.push(result.data.key);
	}

	return keys;
}

/** Kirim lead publik ke API dan ubah hasilnya menjadi data form action. */
export async function submitLead(
	form: FormData,
	options: SubmitOptions
): Promise<LeadActionData | ReturnType<typeof fail>> {
	const values: Record<string, string> = {
		name: text(form, 'name'),
		phone: text(form, 'phone'),
		email: text(form, 'email'),
		city: text(form, 'city'),
		message: text(form, 'message')
	};

	if (!values.name || !values.phone) {
		return fail(400, {
			message: 'Nama dan nomor WhatsApp wajib diisi.',
			values
		});
	}
	if (form.get('consent') !== 'on') {
		return fail(400, {
			message: 'Persetujuan pemrosesan data wajib diberikan.',
			values
		});
	}

	const payload: Record<string, unknown> = {
		type: options.type,
		name: values.name,
		phone: values.phone,
		consent: true,
		honeypot: text(form, 'honeypot'),
		// Token Turnstile; input hidden-nya dibuat otomatis di dalam <form> oleh widget.
		turnstileToken: text(form, 'cf-turnstile-response'),
		idempotencyKey: crypto.randomUUID()
	};

	if (values.email) payload.email = values.email;
	if (values.city) payload.city = values.city;
	if (values.message) payload.message = values.message;
	if (options.unitId !== undefined) payload.unitId = options.unitId;
	if (options.landingPath) payload.landingPath = options.landingPath;
	if (options.referrerUrl) payload.referrerUrl = options.referrerUrl;

	const files = form
		.getAll('files')
		.filter((value): value is File => value instanceof File && value.size > 0);

	if (files.length > MAX_ATTACHMENTS) {
		return fail(400, { message: `Maksimal ${MAX_ATTACHMENTS} foto lahan.`, values });
	}

	let attachmentKeys: string[] = [];
	if (files.length > 0) {
		try {
			attachmentKeys = await uploadAttachments(files, options.cookie);
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return fail(400, { message: error.message, values });
			}
			throw error;
		}
	}

	if (options.withLand) {
		const land: Record<string, unknown> = {
			address: text(form, 'landAddress'),
			province: text(form, 'landProvince'),
			city: values.city,
			district: text(form, 'landDistrict'),
			areaM2: Number(text(form, 'landArea') || 0),
			ownershipStatus: text(form, 'landOwnership') || 'SHM',
			expectedScheme: text(form, 'landScheme') || 'BELUM_TAHU'
		};
		if (attachmentKeys.length > 0) land.attachmentKeys = attachmentKeys;

		values.landAddress = String(land.address ?? '');
		values.landProvince = String(land.province ?? '');
		values.landDistrict = String(land.district ?? '');
		values.landArea = text(form, 'landArea');
		values.landOwnership = String(land.ownershipStatus ?? '');
		values.landScheme = String(land.expectedScheme ?? '');
		payload.land = land;
	}

	try {
		const result = await apiRequest<ApiLeadReceipt>('/api/v1/public/leads', {
			cookie: options.cookie,
			method: 'POST',
			body: payload
		});
		return { success: true, reference: result.data.reference };
	} catch (error) {
		if (error instanceof ApiRequestError) {
			return fail(error.status === 429 ? 429 : 400, {
				message: error.message,
				values
			});
		}
		throw error;
	}
}
