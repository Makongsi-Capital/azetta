<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute editor unit sudah dibangun */
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { formatDate, formatNumber, formatRupiahShort } from '#lib/format.js';
	import {
		unitPublishStatusLabel,
		unitPublishStatusTone,
		unitSalesStatusLabel,
		unitSalesStatusTone
	} from '#lib/labels.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const units = data.units;
	const MOCK_NOW = new Date();

	const perPage = 10;

	let q = $state('');
	let publishFilter = $state('all');
	let salesFilter = $state('all');
	let currentPage = $state(1);

	const counts = $derived({
		published: units.filter((unit) => unit.publishStatus === 'PUBLISHED').length,
		draft: units.filter((unit) => unit.publishStatus === 'DRAFT').length,
		archived: units.filter((unit) => unit.publishStatus === 'ARCHIVED').length,
		views: units.reduce((total, unit) => total + unit.viewCount, 0)
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return units.filter((unit) => {
			if (publishFilter !== 'all' && unit.publishStatus !== publishFilter) return false;
			if (salesFilter !== 'all' && unit.salesStatus !== salesFilter) return false;
			if (!term) return true;

			return [
				unit.title,
				unit.slug,
				unit.unitCode,
				unit.typeName,
				unit.projectTitle,
				unit.subtitle ?? ''
			]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term));
		});
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleUnits = $derived(filtered.slice((currentPage - 1) * perPage, currentPage * perPage));

	function resetFilters() {
		q = '';
		publishFilter = 'all';
		salesFilter = 'all';
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Unit — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Katalog"
	title="Unit rumah"
	description="Kelola unit yang tampil di katalog publik. Perubahan status ketersediaan tidak memerlukan publikasi ulang."
>
	{#snippet actions()}
		<a class="btn btn-ghost btn-sm" href="https://azetta.id/rumah" target="_blank" rel="noreferrer">
			<span class="icon-[mdi--open-in-new] size-4"></span>
			Lihat katalog
		</a>
		<a class="btn btn-primary btn-sm" href="/unit/baru">
			<span class="icon-[mdi--plus] size-4"></span>
			Unit baru
		</a>
	{/snippet}
</PageHeader>

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard label="Terbit" value={counts.published} icon="icon-[mdi--check-decagram-outline]" />
	<StatCard label="Draf" value={counts.draft} icon="icon-[mdi--file-edit-outline]" tone="warning" />
	<StatCard label="Diarsipkan" value={counts.archived} icon="icon-[mdi--archive-outline]" />
	<StatCard
		label="Total dilihat"
		value={formatNumber(counts.views)}
		hint="30 hari terakhir (demo)"
		icon="icon-[mdi--eye-outline]"
	/>
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari judul, kode, tipe, atau proyek…"
				aria-label="Cari unit"
				bind:value={q}
				oninput={() => (currentPage = 1)}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter status publish"
			bind:value={publishFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua status</option>
			{#each Object.entries(unitPublishStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter ketersediaan"
			bind:value={salesFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua ketersediaan</option>
			{#each Object.entries(unitSalesStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if visibleUnits.length === 0}
		<div class="p-6">
			<EmptyState
				title="Belum ada unit yang cocok"
				description="Ubah filter atau buat unit baru untuk mulai mengisi katalog."
				icon="icon-[mdi--home-search-outline]"
				actionLabel="Tambah unit"
				actionHref="/unit/baru"
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Unit</th>
						<th class="hidden md:table-cell">Tipe / kode</th>
						<th class="hidden lg:table-cell">Spesifikasi</th>
						<th>Harga mulai</th>
						<th>Status</th>
						<th class="hidden xl:table-cell">Dilihat</th>
						<th class="hidden xl:table-cell">Diperbarui</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleUnits as unit (unit.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-3">
									<img
										src={unit.cover}
										alt=""
										class="size-12 shrink-0 border border-brand-line object-cover"
										loading="lazy"
									/>
									<div class="min-w-0">
										<a class="block truncate font-bold" href="/unit/{unit.id}">{unit.title}</a>
										<p class="truncate font-mono text-[11px] text-brand-gray-600">
											/{unit.slug}
										</p>
										{#if unit.featured}
											<span class="badge badge-outline badge-xs mt-1">Unggulan</span>
										{/if}
									</div>
								</div>
							</td>
							<td class="hidden text-xs md:table-cell">
								{unit.typeName}
								<span class="block font-mono text-brand-gray-600">{unit.unitCode}</span>
							</td>
							<td class="hidden text-xs lg:table-cell">
								{unit.bedrooms} KT · {unit.bathrooms} KM
								<span class="block text-brand-gray-600">
									{unit.buildingAreaM2} m² / {unit.landAreaM2} m²
								</span>
							</td>
							<td class="text-xs font-bold whitespace-nowrap tabular-nums">
								{unit.priceFrom ? formatRupiahShort(unit.priceFrom) : '—'}
							</td>
							<td>
								<div class="flex flex-col items-start gap-1">
									<StatusBadge
										label={unitPublishStatusLabel[unit.publishStatus]}
										tone={unitPublishStatusTone[unit.publishStatus]}
									/>
									<StatusBadge
										label={unitSalesStatusLabel[unit.salesStatus]}
										tone={unitSalesStatusTone[unit.salesStatus]}
									/>
								</div>
							</td>
							<td class="hidden text-xs tabular-nums xl:table-cell">
								{formatNumber(unit.viewCount)}
							</td>
							<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 xl:table-cell">
								{formatDate(unit.updatedAt)}
							</td>
							<td class="text-right">
								<div class="flex justify-end gap-1">
									{#if unit.publishStatus === 'PUBLISHED'}
										<a
											class="btn btn-ghost btn-xs"
											href="https://azetta.id/rumah/{unit.slug}"
											target="_blank"
											rel="noreferrer"
											aria-label="Lihat {unit.title} di situs publik"
										>
											<span class="icon-[mdi--open-in-new] size-4"></span>
										</a>
									{/if}
									<a class="btn btn-outline btn-xs" href="/unit/{unit.id}">Edit</a>
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

<p class="mt-3 text-xs text-brand-gray-600">
	Data pratinjau diperbarui {formatDate(MOCK_NOW)}. Status, harga, dan media pada demo belum
	tersambung ke API.
</p>
