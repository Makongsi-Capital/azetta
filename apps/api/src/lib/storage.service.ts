import { randomBytes } from 'node:crypto';
import { getEnv } from '../env';
import { badRequest, notFound } from './http';
import { buildPublicUrl, deleteObject, putObject } from './object-storage';
import { prisma } from './prisma';
import type { ListMediaInput, ListMediaResult, MediaItem, UploadFileInput } from './upload.type';

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif',
	'image/svg+xml': 'svg',
	'application/pdf': 'pdf'
};

const FOLDER_PATTERN = /^[a-z0-9][a-z0-9_-]{0,30}$/;

function defaultMaxUploadBytes(): number {
	return getEnv().OBJECT_STORAGE_MAX_UPLOAD_BYTES ?? 2 * 1024 * 1024;
}

function generateKey(folder: string, ext: string): string {
	const now = new Date();
	const yyyy = now.getUTCFullYear();
	const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
	const id = randomBytes(12).toString('base64url');
	return `${folder}/${yyyy}/${mm}/${id}.${ext}`;
}

function validateFolder(folder: string): string {
	const normalized = folder.trim().toLowerCase();
	if (!FOLDER_PATTERN.test(normalized)) {
		throw badRequest('Folder hanya boleh huruf, angka, underscore, dan dash (maks 31 karakter).');
	}
	return normalized;
}

function validateFile(file: File, maxBytes: number): { mime: string; ext: string } {
	const mime = file.type;
	if (!mime) throw badRequest('Berkas harus memiliki content-type.');
	if (file.size <= 0) throw badRequest('Berkas kosong.');

	const ext = ALLOWED_MIME_TO_EXT[mime];
	if (!ext) throw badRequest(`Tipe berkas ${mime} tidak diizinkan.`);
	if (file.size > maxBytes) {
		throw badRequest(`Ukuran berkas melebihi batas (${(maxBytes / 1024 / 1024).toFixed(0)} MB).`);
	}

	return { mime, ext };
}

async function uploadFile(input: UploadFileInput): Promise<MediaItem> {
	const folder = validateFolder(input.folder);
	const { mime, ext } = validateFile(input.file, input.maxBytes ?? defaultMaxUploadBytes());

	const key = generateKey(folder, ext);
	const body = new Uint8Array(await input.file.arrayBuffer());
	await putObject({ key, body, contentType: mime });

	try {
		return await prisma.media.create({
			data: {
				key,
				url: buildPublicUrl(key),
				mime,
				size: input.file.size,
				folder,
				original_name: input.file.name || null,
				uploaded_by: input.uploadedBy
			}
		});
	} catch (error) {
		await deleteObject(key).catch(() => undefined);
		throw error;
	}
}

async function listMedia(input: ListMediaInput): Promise<ListMediaResult> {
	const where = input.folder ? { folder: input.folder } : {};
	const skip = (input.page - 1) * input.pageSize;

	const [items, total] = await Promise.all([
		prisma.media.findMany({ where, orderBy: { created_at: 'desc' }, skip, take: input.pageSize }),
		prisma.media.count({ where })
	]);

	return { items, total, page: input.page, pageSize: input.pageSize };
}

async function getMediaById(id: string): Promise<MediaItem> {
	const media = await prisma.media.findUnique({ where: { id } });
	if (!media) throw notFound('Media tidak ditemukan.');
	return media;
}

async function deleteMedia(id: string): Promise<MediaItem> {
	const media = await getMediaById(id);
	await deleteObject(media.key);
	await prisma.media.delete({ where: { id } });
	return media;
}

export const storage = { uploadFile, listMedia, getMediaById, deleteMedia };
