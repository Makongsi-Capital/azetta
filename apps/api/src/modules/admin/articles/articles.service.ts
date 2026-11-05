import { ArticleStatus, type Prisma } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import {
	badRequest,
	conflict,
	list,
	normalizeSearch,
	notFound,
	ok,
	parsePagination,
	pickEnum
} from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { serializeArticle } from '../../../lib/serialize';
import { sanitizeHtml } from '../../../lib/sanitize';
import { recordAudit } from '../../../lib/audit';

const ARTICLE_STATUSES = Object.values(ArticleStatus);
const articleInclude = { author: { select: { id: true, name: true } } };

type Query = Record<string, string | undefined>;

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function parseTags(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value
			.map(String)
			.map((tag) => tag.trim())
			.filter(Boolean);
	}
	if (typeof value === 'string') {
		return value
			.split(',')
			.map((tag) => tag.trim())
			.filter(Boolean);
	}
	return [];
}

export async function listArticles(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 20,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const status = pickEnum(query.status, ARTICLE_STATUSES);

	const where: Prisma.ArticleWhereInput = {
		deletedAt: null,
		...(status ? { status } : {}),
		...(term
			? {
					OR: [
						{ title: { contains: term, mode: 'insensitive' } },
						{ slug: { contains: term, mode: 'insensitive' } }
					]
				}
			: {})
	};

	const [rows, total] = await Promise.all([
		prisma.article.findMany({
			where,
			include: articleInclude,
			orderBy: { updatedAt: 'desc' },
			skip,
			take
		}),
		prisma.article.count({ where })
	]);

	return list(rows.map(serializeArticle), {
		page,
		perPage,
		total,
		totalPages: Math.max(1, Math.ceil(total / perPage))
	});
}

export async function createArticle(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const title = typeof payload.title === 'string' ? payload.title.trim() : '';
	if (!title) throw badRequest('Judul artikel wajib diisi.');

	const slug = slugify(String(payload.slug ?? title));
	if (await prisma.article.findUnique({ where: { slug } })) {
		throw conflict(`Slug "${slug}" sudah dipakai.`);
	}

	const article = await prisma.article.create({
		data: {
			slug,
			title,
			excerpt: typeof payload.excerpt === 'string' && payload.excerpt ? payload.excerpt : null,
			content: sanitizeHtml(String(payload.content ?? '')),
			coverImageUrl:
				typeof payload.coverImageUrl === 'string' && payload.coverImageUrl
					? payload.coverImageUrl
					: null,
			tags: parseTags(payload.tags),
			readingMinutes: typeof payload.readingMinutes === 'number' ? payload.readingMinutes : null,
			seoTitle: typeof payload.seoTitle === 'string' && payload.seoTitle ? payload.seoTitle : null,
			seoDescription:
				typeof payload.seoDescription === 'string' && payload.seoDescription
					? payload.seoDescription
					: null,
			authorId:
				typeof payload.authorId === 'string' && payload.authorId ? payload.authorId : actor.id
		},
		include: articleInclude
	});

	await recordAudit({
		action: 'article.create',
		entityType: 'Article',
		entityId: article.id,
		actorId: actor.id,
		ipHash,
		after: { title, slug }
	});
	return ok(serializeArticle(article));
}

export async function getArticle(id: string) {
	const article = await prisma.article.findFirst({
		where: { id: Number(id), deletedAt: null },
		include: articleInclude
	});
	if (!article) throw notFound('Artikel tidak ditemukan.');
	return ok(serializeArticle(article));
}

export async function updateArticle(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.article.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Artikel tidak ditemukan.');

	const data: Prisma.ArticleUpdateInput = {};
	if (typeof payload.title === 'string' && payload.title.trim()) data.title = payload.title.trim();
	if (typeof payload.slug === 'string' && payload.slug.trim()) {
		const slug = slugify(payload.slug);
		if (slug !== existing.slug) {
			if (await prisma.article.findUnique({ where: { slug } })) {
				throw conflict(`Slug "${slug}" sudah dipakai.`);
			}
			data.slug = slug;
		}
	}
	if ('excerpt' in payload) data.excerpt = payload.excerpt ? String(payload.excerpt) : null;
	if (typeof payload.content === 'string') data.content = sanitizeHtml(payload.content);
	if ('coverImageUrl' in payload) {
		data.coverImageUrl = payload.coverImageUrl ? String(payload.coverImageUrl) : null;
	}
	if ('tags' in payload) data.tags = parseTags(payload.tags);
	if ('readingMinutes' in payload) {
		data.readingMinutes =
			payload.readingMinutes === null || payload.readingMinutes === ''
				? null
				: Number(payload.readingMinutes);
	}
	if ('seoTitle' in payload) data.seoTitle = payload.seoTitle ? String(payload.seoTitle) : null;
	if ('seoDescription' in payload) {
		data.seoDescription = payload.seoDescription ? String(payload.seoDescription) : null;
	}
	if ('authorId' in payload && typeof payload.authorId === 'string' && payload.authorId) {
		data.author = { connect: { id: payload.authorId } };
	}

	const updated = await prisma.article.update({
		where: { id: existing.id },
		data,
		include: articleInclude
	});
	await recordAudit({
		action: 'article.update',
		entityType: 'Article',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { title: existing.title, status: existing.status },
		after: { title: updated.title, status: updated.status }
	});
	return ok(serializeArticle(updated));
}

export async function archiveArticle(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.article.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Artikel tidak ditemukan.');

	await prisma.article.update({
		where: { id: existing.id },
		data: { status: 'ARCHIVED', deletedAt: new Date() }
	});
	await recordAudit({
		action: 'article.archive',
		entityType: 'Article',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: 'ARCHIVED' }
	});
	return ok({ id: existing.id, archived: true });
}

export async function publishArticle(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.article.findFirst({
		where: { id: Number(id), deletedAt: null }
	});
	if (!existing) throw notFound('Artikel tidak ditemukan.');
	if (!existing.excerpt) throw badRequest('Ringkasan artikel wajib diisi sebelum publish.');

	const updated = await prisma.article.update({
		where: { id: existing.id },
		data: { status: 'PUBLISHED', publishedAt: existing.publishedAt ?? new Date() },
		include: articleInclude
	});
	await recordAudit({
		action: 'article.publish',
		entityType: 'Article',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { status: existing.status },
		after: { status: 'PUBLISHED' }
	});
	return ok(serializeArticle(updated));
}
