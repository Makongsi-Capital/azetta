<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import type { MockProject } from '#lib/mock/site.js';

	interface Props {
		project: MockProject;
	}

	let { project }: Props = $props();

	const isCompleted = $derived(project.status === 'SELESAI');
</script>

<a
	class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
	href="/proyek/{project.slug}"
	aria-label="{project.title} di {project.location}, {project.city}"
>
	<figure class="relative aspect-[16/10] overflow-hidden rounded-t-[1rem] bg-brand-mist">
		<img
			src={project.cover}
			alt="Proyek {project.title}"
			width="900"
			height="563"
			loading="lazy"
			class="h-full w-full object-cover"
		/>
		<span
			class="badge badge-sm {isCompleted
				? 'badge-outline bg-white/90'
				: 'badge-info'} absolute top-3 left-3 border-0"
		>
			{isCompleted ? 'Selesai' : 'Sedang berjalan'}
		</span>
	</figure>

	<div class="card-body gap-2 p-5">
		<h3 class="text-base font-bold">{project.title}</h3>
		<p class="inline-flex items-center gap-1 text-sm text-brand-gray-600">
			<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
			{project.location}, {project.city}
		</p>
		<p class="text-sm text-brand-gray-600">{project.summary}</p>
		<p class="mt-2 text-xs text-brand-gray-600 tabular-nums">
			{project.yearStarted}{project.yearCompleted ? `–${project.yearCompleted}` : ''} ·
			{project.unitCount} unit
		</p>
	</div>
</a>
