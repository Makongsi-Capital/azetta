<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute editor proyek sudah dibangun */
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { formatNumber } from '#lib/format.js';
	import { projectStatusLabel, projectStatusTone } from '#lib/labels.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const projects = data.projects;

	const perPage = 10;

	let q = $state('');
	let statusFilter = $state('all');
	let publishFilter = $state('all');
	let currentPage = $state(1);

	const counts = $derived({
		ongoing: projects.filter((project) => project.status === 'ONGOING').length,
		planned: projects.filter((project) => project.status === 'PLANNED').length,
		completed: projects.filter((project) => project.status === 'COMPLETED').length,
		units: projects.reduce((total, project) => total + (project.unitCount ?? 0), 0)
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return projects.filter((project) => {
			if (statusFilter !== 'all' && project.status !== statusFilter) return false;
			if (publishFilter === 'published' && !project.isPublished) return false;
			if (publishFilter === 'hidden' && project.isPublished) return false;
			if (!term) return true;

			return [project.title, project.city, project.location, project.slug]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term));
		});
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleProjects = $derived(
		filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
	);

	function resetFilters() {
		q = '';
		statusFilter = 'all';
		publishFilter = 'all';
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Proyek — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Portofolio"
	title="Proyek"
	description="Proyek yang tampil di halaman publik. Proyek terarsip tidak pernah ditampilkan meskipun sudah pernah terbit."
>
	{#snippet actions()}
		<a
			class="btn btn-ghost btn-sm"
			href="https://azetta.id/proyek"
			target="_blank"
			rel="noreferrer"
		>
			<span class="icon-[mdi--open-in-new] size-4"></span>
			Lihat halaman proyek
		</a>
		<a class="btn btn-primary btn-sm" href="/proyek/baru">
			<span class="icon-[mdi--plus] size-4"></span>
			Proyek baru
		</a>
	{/snippet}
</PageHeader>

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard
		label="Berjalan"
		value={counts.ongoing}
		icon="icon-[mdi--progress-wrench]"
		tone="success"
	/>
	<StatCard label="Direncanakan" value={counts.planned} icon="icon-[mdi--calendar-blank-outline]" />
	<StatCard label="Selesai" value={counts.completed} icon="icon-[mdi--check-decagram-outline]" />
	<StatCard
		label="Total unit"
		value={formatNumber(counts.units)}
		hint="Seluruh proyek"
		icon="icon-[mdi--home-group]"
	/>
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari nama, lokasi, atau slug…"
				aria-label="Cari proyek"
				bind:value={q}
				oninput={() => (currentPage = 1)}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter status proyek"
			bind:value={statusFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua status</option>
			{#each Object.entries(projectStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter publikasi proyek"
			bind:value={publishFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua publikasi</option>
			<option value="published">Tampil di situs</option>
			<option value="hidden">Disembunyikan</option>
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if visibleProjects.length === 0}
		<div class="p-6">
			<EmptyState
				title="Belum ada proyek yang cocok"
				description="Ubah filter atau tambahkan proyek baru."
				icon="icon-[mdi--office-building-outline]"
				actionLabel="Proyek baru"
				actionHref="/proyek/baru"
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Proyek</th>
						<th>Status</th>
						<th class="hidden md:table-cell">Tahun</th>
						<th class="hidden lg:table-cell">Skala</th>
						<th class="hidden xl:table-cell">Urutan</th>
						<th>Tampil</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleProjects as project (project.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-3">
									{#if project.coverImageUrl}
										<img
											src={project.coverImageUrl}
											alt=""
											class="size-12 shrink-0 border border-brand-line object-cover"
											loading="lazy"
										/>
									{:else}
										<span
											class="grid size-12 shrink-0 place-items-center border border-brand-line bg-base-200"
										>
											<span class="icon-[mdi--image-off-outline] size-5 text-brand-gray-500"></span>
										</span>
									{/if}
									<div class="min-w-0">
										<a class="block truncate font-bold" href="/proyek/{project.id}">
											{project.title}
										</a>
										<p class="truncate text-[11px] text-brand-gray-600">
											{project.location}, {project.city}
										</p>
									</div>
								</div>
							</td>
							<td>
								<StatusBadge
									label={projectStatusLabel[project.status]}
									tone={projectStatusTone[project.status]}
								/>
							</td>
							<td class="hidden text-xs whitespace-nowrap md:table-cell">
								{project.yearStarted ?? '—'}
								{#if project.yearCompleted}–{project.yearCompleted}{/if}
							</td>
							<td class="hidden text-xs lg:table-cell">
								{project.unitCount ?? '—'} unit
								<span class="block text-brand-gray-600">
									{project.landAreaM2 ? `${formatNumber(project.landAreaM2)} m²` : '—'}
								</span>
							</td>
							<td class="hidden text-xs tabular-nums xl:table-cell">{project.sortOrder}</td>
							<td>
								<span
									class="badge badge-sm border-0 {project.isPublished
										? 'badge-success'
										: 'badge-ghost'}"
								>
									{project.isPublished ? 'Ya' : 'Tidak'}
								</span>
							</td>
							<td class="text-right">
								<div class="flex justify-end gap-1">
									{#if project.isPublished}
										<a
											class="btn btn-ghost btn-xs"
											href="https://azetta.id/proyek/{project.slug}"
											target="_blank"
											rel="noreferrer"
											aria-label="Lihat {project.title} di situs publik"
										>
											<span class="icon-[mdi--open-in-new] size-4"></span>
										</a>
									{/if}
									<a class="btn btn-outline btn-xs" href="/proyek/{project.id}">Edit</a>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Pagination
			page={currentPage}
			{pageCount}
			total={filtered.length}
			onchange={(next) => (currentPage = next)}
		/>
	{/if}
</div>
