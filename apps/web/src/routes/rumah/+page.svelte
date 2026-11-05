<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import PropertyCard from '#lib/components/site/PropertyCard.svelte';
	import UnitFilters from '#lib/components/site/UnitFilters.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Rumah Dijual — Katalog Unit Azetta</title>
	<meta
		name="description"
		content="Lihat unit rumah tapak dari proyek Azetta di Makassar dan sekitarnya: tipe, luas tanah, harga mulai dari, dan status ketersediaan terbaru."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex items-center gap-2">
			<li><a class="link link-hover" href="/">Beranda</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">Rumah</span></li>
		</ol>
	</nav>

	<div class="mt-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl md:text-4xl">Rumah Dijual</h1>
			<p class="mt-3 max-w-2xl text-sm text-brand-gray-600">
				Harga yang tercantum adalah harga mulai dari dan dapat berubah. Status ketersediaan
				diperbarui oleh tim Azetta.
			</p>
		</div>
		<span class="badge badge-outline badge-lg border-brand-line bg-white">
			{data.meta.total} unit
		</span>
	</div>

	<form method="GET" class="mt-8">
		<div class="flex flex-wrap items-center gap-3">
			<label class="input flex w-full max-w-sm items-center gap-2">
				<span class="icon-[mdi--magnify] size-5 opacity-60"></span>
				<input
					type="search"
					name="q"
					class="grow"
					placeholder="Cari unit, tipe, atau gaya"
					value={data.query.q ?? ''}
				/>
			</label>
			<select
				name="sort"
				class="select ml-auto w-48"
				onchange={(event) => event.currentTarget.form?.requestSubmit()}
			>
				<option value="-publishedAt" selected={!data.query.sort}>Urutkan: Terbaru</option>
				<option value="priceFrom" selected={data.query.sort === 'priceFrom'}>Harga terendah</option>
				<option value="-priceFrom" selected={data.query.sort === '-priceFrom'}>
					Harga tertinggi
				</option>
				<option value="-landAreaM2" selected={data.query.sort === '-landAreaM2'}>
					Luas tanah terbesar
				</option>
			</select>
		</div>

		<div class="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
			<aside class="hidden lg:block">
				<div class="sticky top-24 border border-brand-line bg-white p-5">
					<div class="flex items-center justify-between">
						<p class="font-bold">Filter</p>
						<a class="btn btn-ghost btn-xs" href="/rumah">Reset</a>
					</div>
					<div class="mt-4">
						<UnitFilters filters={data.filters} values={data.query} />
					</div>
				</div>
			</aside>

			<div>
				<details class="mb-6 border border-brand-line bg-white p-4 lg:hidden">
					<summary class="cursor-pointer font-bold">Filter unit</summary>
					<div class="mt-4">
						<UnitFilters filters={data.filters} values={data.query} />
					</div>
				</details>

				{#if data.units.length === 0}
					<p
						class="rounded-[1rem] border border-brand-line bg-white p-6 text-sm text-brand-gray-600"
					>
						Tidak ada unit yang cocok dengan filter Anda. Coba longgarkan kriteria atau
						<a class="link link-hover font-bold" href="/rumah">lihat semua unit</a>.
					</p>
				{:else}
					<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{#each data.units as unit (unit.slug)}
							<PropertyCard {unit} />
						{/each}
					</div>
				{/if}

				{#if data.meta.totalPages > 1}
					<nav class="mt-8 flex items-center justify-between text-sm" aria-label="Paginasi">
						{#if data.meta.page > 1}
							<a class="btn btn-outline btn-sm" href={data.prevHref}>Sebelumnya</a>
						{:else}
							<span></span>
						{/if}
						<span class="text-brand-gray-600">
							Halaman {data.meta.page} dari {data.meta.totalPages}
						</span>
						{#if data.meta.page < data.meta.totalPages}
							<a class="btn btn-outline btn-sm" href={data.nextHref}>Berikutnya</a>
						{:else}
							<span></span>
						{/if}
					</nav>
				{/if}
			</div>
		</div>
	</form>
</div>
