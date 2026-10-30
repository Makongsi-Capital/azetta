import { error } from '@sveltejs/kit';
import { findOwnedUnit } from '#lib/mock/account.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const unit = findOwnedUnit(params.id);

	if (!unit) error(404, 'Proyek tidak ditemukan');

	return { unit };
};
