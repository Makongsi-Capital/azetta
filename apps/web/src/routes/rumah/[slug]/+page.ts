import { error } from '@sveltejs/kit';
import { findUnit, relatedUnitsOf } from '#lib/mock/site.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const unit = findUnit(params.slug);

	if (!unit) error(404, 'Unit tidak ditemukan');

	return { unit, related: relatedUnitsOf(unit) };
};
