import { error } from '@sveltejs/kit';
import { findLead } from '#lib/mock/admin.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const lead = findLead(params.id);

	if (!lead) {
		error(404, 'Lead tidak ditemukan');
	}

	return { lead };
};
