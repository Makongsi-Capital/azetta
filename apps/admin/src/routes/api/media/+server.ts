import { json } from '@sveltejs/kit';
import { ApiRequestError, apiRequest } from '#lib/server/api.js';
import type { UploadedMedia } from '#lib/upload.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const inbound = await request.formData();
	const file = inbound.get('file');
	const folder = String(inbound.get('folder') ?? 'media');

	if (!(file instanceof File) || file.size === 0) {
		return json({ message: 'Pilih berkas yang akan diunggah.' }, { status: 400 });
	}

	const outbound = new FormData();
	outbound.set('file', file);
	outbound.set('folder', folder);

	try {
		const result = await apiRequest<UploadedMedia>('/api/v1/admin/media', {
			method: 'POST',
			body: outbound,
			cookie: request.headers.get('cookie'),
			fetcher: fetch
		});
		return json({ media: result.data });
	} catch (error) {
		if (error instanceof ApiRequestError) {
			return json({ message: error.message }, { status: error.status });
		}
		throw error;
	}
};
