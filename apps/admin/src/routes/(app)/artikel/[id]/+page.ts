import { error } from '@sveltejs/kit';
import { findArticle } from '#lib/mock/admin.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const id = Number(params.id);
	const article = Number.isNaN(id) ? undefined : findArticle(id);

	if (!article) {
		error(404, 'Artikel tidak ditemukan');
	}

	return { article };
};
