import type { StaffActor } from '../../../lib/guard';
import { list, ok, parsePagination } from '../../../lib/http';
import { storage } from '../../../lib/storage.service';

const FOLDERS = new Set(['units', 'projects', 'articles', 'settings', 'media']);

type Query = Record<string, string | undefined>;

export async function uploadMedia(actor: StaffActor, file: File, folder?: string) {
	const target = folder && FOLDERS.has(folder) ? folder : 'media';
	return ok(await storage.uploadFile({ file, folder: target, uploadedBy: actor.id }));
}

export async function listMedia(query: Query) {
	const { page, perPage } = parsePagination(query, { defaultPerPage: 24, maxPerPage: 100 });
	const folder = query.folder && FOLDERS.has(query.folder) ? query.folder : undefined;

	const result = await storage.listMedia({ folder, page, pageSize: perPage });
	return list(result.items, {
		page,
		perPage,
		total: result.total,
		totalPages: Math.max(1, Math.ceil(result.total / perPage))
	});
}

export async function deleteMedia(id: string) {
	return ok(await storage.deleteMedia(id));
}
