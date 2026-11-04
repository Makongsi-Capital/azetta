import { error } from '@sveltejs/kit';
import { findUnit } from '#lib/mock/admin.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const id = Number(params.id);
	const unit = Number.isNaN(id) ? undefined : findUnit(id);

	if (!unit) {
		error(404, 'Unit tidak ditemukan');
	}

	return { unit };
};
