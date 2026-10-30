import { error } from '@sveltejs/kit';
import { findProject, unitsOfProject } from '#lib/mock/site.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = findProject(params.slug);

	if (!project) error(404, 'Proyek tidak ditemukan');

	return { project, units: unitsOfProject(project.slug) };
};
