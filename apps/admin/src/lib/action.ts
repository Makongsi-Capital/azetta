/* eslint-disable svelte/no-navigation-without-resolve -- lokasi redirect berasal dari form action server */
import { goto, invalidateAll } from '$app/navigation';

export interface ActionResult {
	ok: boolean;
	message?: string;
}

type Fields = Record<string, string | number | boolean | null | undefined>;

function toFormData(fields: Fields): FormData {
	const form = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		if (value === null || value === undefined) continue;
		form.set(key, String(value));
	}
	return form;
}

/**
 * Panggil form action SvelteKit dari fungsi komponen tanpa harus membuat
 * markup form baru. Mengembalikan pesan error/sukses dari server.
 */
export async function submitAction(
	name: string,
	fields: Fields | FormData,
	options: { refresh?: boolean } = {}
): Promise<ActionResult> {
	const body = fields instanceof FormData ? fields : toFormData(fields);
	const response = await fetch(`?/${name}`, {
		method: 'POST',
		body,
		headers: { accept: 'application/json' }
	});

	const result = (await response.json()) as {
		type: 'success' | 'failure' | 'redirect' | 'error';
		data?: { message?: string; success?: boolean };
		location?: string;
	};

	if (result.type === 'redirect' && result.location) {
		await goto(result.location);
		return { ok: true, message: result.data?.message };
	}

	if (result.type === 'failure' || result.type === 'error' || result.data?.success === false) {
		return { ok: false, message: result.data?.message ?? 'Perubahan gagal disimpan.' };
	}

	if (options.refresh !== false) await invalidateAll();
	return { ok: true, message: result.data?.message };
}
