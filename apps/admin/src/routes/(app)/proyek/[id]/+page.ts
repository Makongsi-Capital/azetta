import { error } from '@sveltejs/kit';
import { findProject } from '#lib/mock/admin.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const id = Number(params.id);
	const project = Number.isNaN(id) ? undefined : findProject(id);

	if (!project) {
		error(404, 'Proyek tidak ditemukan');
	}

	return { project };
};
