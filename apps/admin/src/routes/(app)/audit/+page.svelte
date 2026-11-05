<script lang="ts">
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import { formatDateInput, formatDateTime } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const auditLogs = data.logs;
	const MOCK_NOW = new Date(data.now);

	const perPage = 10;

	let q = $state('');
	let entityFilter = $state('all');
	let actorFilter = $state('all');
	let currentPage = $state(1);

	const entities = $derived([...new Set(auditLogs.map((log) => log.entityType))].sort());
	const actors = $derived(
		[...new Set(auditLogs.map((log) => log.actorName).filter(Boolean))].sort() as string[]
	);

	const counts = $derived({
		total: auditLogs.length,
		today: auditLogs.filter((log) => formatDateInput(log.createdAt) === formatDateInput(MOCK_NOW))
			.length,
		actors: actors.length,
		entities: entities.length
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return auditLogs
			.filter((log) => {
				if (entityFilter !== 'all' && log.entityType !== entityFilter) return false;
				if (actorFilter !== 'all' && log.actorName !== actorFilter) return false;
				if (!term) return true;

				return [log.action, log.entityType, log.entityId, log.actorName ?? '']
					.filter(Boolean)
					.some((value) => value.toLowerCase().includes(term));
			})
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleLogs = $derived(filtered.slice((currentPage - 1) * perPage, currentPage * perPage));

	function resetFilters() {
		q = '';
		entityFilter = 'all';
		actorFilter = 'all';
		currentPage = 1;
	}

	function formatSnapshot(snapshot: Record<string, unknown> | null): string {
		return snapshot ? JSON.stringify(snapshot, null, 2) : '—';
	}
</script>

<svelte:head>
	<title>Audit log — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Sistem"
	title="Audit log"
	description="Riwayat tindakan admin pada lead, katalog, konten, pengguna, dan pengaturan. Snapshot sebelum dan sesudah disimpan untuk penelusuran."
>
	{#snippet actions()}
		<span class="badge badge-outline badge-sm">Retensi 90 hari</span>
	{/snippet}
</PageHeader>

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard label="Total entri" value={counts.total} icon="icon-[mdi--history]" />
	<StatCard label="Hari ini" value={counts.today} icon="icon-[mdi--calendar-today-outline]" />
	<StatCard label="Aktor" value={counts.actors} icon="icon-[mdi--account-multiple-outline]" />
	<StatCard label="Jenis entitas" value={counts.entities} icon="icon-[mdi--database-outline]" />
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari aksi, entitas, atau ID…"
				aria-label="Cari audit log"
				bind:value={q}
				oninput={() => (currentPage = 1)}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter entitas"
			bind:value={entityFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua entitas</option>
			{#each entities as entity (entity)}
				<option value={entity}>{entity}</option>
			{/each}
		</select>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter aktor"
			bind:value={actorFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua aktor</option>
			{#each actors as actor (actor)}
				<option value={actor}>{actor}</option>
			{/each}
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if visibleLogs.length === 0}
		<div class="p-6">
			<EmptyState
				title="Tidak ada entri audit"
				description="Ubah kata kunci atau filter untuk melihat riwayat lain."
				icon="icon-[mdi--history]"
				actionLabel="Reset filter"
				onaction={resetFilters}
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Waktu</th>
						<th>Aktor</th>
						<th>Aksi</th>
						<th class="hidden md:table-cell">Entitas</th>
						<th class="hidden xl:table-cell">IP hash</th>
						<th>Detail</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleLogs as log (log.id)}
						<tr class="border-brand-line align-top hover:bg-base-200/50">
							<td class="text-xs whitespace-nowrap text-brand-gray-600">
								{formatDateTime(log.createdAt)}
							</td>
							<td class="text-xs whitespace-nowrap">{log.actorName ?? 'Sistem'}</td>
							<td>
								<span class="font-mono text-[11px] font-bold">{log.action}</span>
							</td>
							<td class="hidden text-xs md:table-cell">
								{log.entityType}
								<span class="block font-mono text-[11px] text-brand-gray-600">
									{log.entityId}
								</span>
							</td>
							<td class="hidden font-mono text-[11px] text-brand-gray-600 xl:table-cell">
								{log.ipHash ?? '—'}
							</td>
							<td>
								<details>
									<summary class="cursor-pointer text-xs font-bold">Lihat</summary>
									<div class="mt-2 grid gap-2">
										<div>
											<p class="text-[11px] font-bold text-brand-gray-600">Sebelum</p>
											<pre
												class="mt-1 max-w-xs overflow-x-auto bg-base-200 p-2 text-[11px]">{formatSnapshot(
													log.before
												)}</pre>
										</div>
										<div>
											<p class="text-[11px] font-bold text-brand-gray-600">Sesudah</p>
											<pre
												class="mt-1 max-w-xs overflow-x-auto bg-base-200 p-2 text-[11px]">{formatSnapshot(
													log.after
												)}</pre>
										</div>
									</div>
								</details>
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
