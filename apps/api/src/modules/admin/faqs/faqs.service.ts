import type { Prisma } from '@azetta/db';
import { prisma } from '../../../lib/prisma';
import {
	badRequest,
	list,
	normalizeSearch,
	notFound,
	ok,
	parsePagination
} from '../../../lib/http';
import type { StaffActor } from '../../../lib/guard';
import { recordAudit } from '../../../lib/audit';

type Query = Record<string, string | undefined>;

export async function listFaqs(query: Query) {
	const { page, perPage, skip, take } = parsePagination(query, {
		defaultPerPage: 100,
		maxPerPage: 100
	});
	const term = normalizeSearch(query.q);
	const where: Prisma.FaqWhereInput = {
		...(query.category ? { category: query.category } : {}),
		...(term ? { question: { contains: term, mode: 'insensitive' } } : {})
	};
	const [rows, total] = await Promise.all([
		prisma.faq.findMany({ where, orderBy: { sortOrder: 'asc' }, skip, take }),
		prisma.faq.count({ where })
	]);
	return list(rows, { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) });
}

export async function createFaq(
	actor: StaffActor,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const question = typeof payload.question === 'string' ? payload.question.trim() : '';
	const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
	if (!question || !answer) throw badRequest('Pertanyaan dan jawaban wajib diisi.');

	const faq = await prisma.faq.create({
		data: {
			question,
			answer,
			category:
				typeof payload.category === 'string' && payload.category ? payload.category : 'umum',
			sortOrder: Number(payload.sortOrder ?? 0) || 0,
			isActive: payload.isActive !== false
		}
	});
	await recordAudit({
		action: 'faq.create',
		entityType: 'Faq',
		entityId: faq.id,
		actorId: actor.id,
		ipHash,
		after: { question }
	});
	return ok(faq);
}

export async function updateFaq(
	actor: StaffActor,
	id: string,
	payload: Record<string, unknown>,
	ipHash: string | null
) {
	const existing = await prisma.faq.findUnique({ where: { id: Number(id) } });
	if (!existing) throw notFound('FAQ tidak ditemukan.');

	const faq = await prisma.faq.update({
		where: { id: existing.id },
		data: {
			...(typeof payload.question === 'string' ? { question: payload.question } : {}),
			...(typeof payload.answer === 'string' ? { answer: payload.answer } : {}),
			...(typeof payload.category === 'string' ? { category: payload.category } : {}),
			...(payload.sortOrder !== undefined ? { sortOrder: Number(payload.sortOrder) || 0 } : {}),
			...(typeof payload.isActive === 'boolean' ? { isActive: payload.isActive } : {})
		}
	});
	await recordAudit({
		action: 'faq.update',
		entityType: 'Faq',
		entityId: faq.id,
		actorId: actor.id,
		ipHash,
		before: { question: existing.question },
		after: { question: faq.question }
	});
	return ok(faq);
}

export async function deleteFaq(actor: StaffActor, id: string, ipHash: string | null) {
	const existing = await prisma.faq.findUnique({ where: { id: Number(id) } });
	if (!existing) throw notFound('FAQ tidak ditemukan.');
	await prisma.faq.delete({ where: { id: existing.id } });
	await recordAudit({
		action: 'faq.delete',
		entityType: 'Faq',
		entityId: existing.id,
		actorId: actor.id,
		ipHash,
		before: { question: existing.question }
	});
	return ok({ id: existing.id, deleted: true });
}
