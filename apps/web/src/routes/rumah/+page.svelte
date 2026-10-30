<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import PropertyCard from '#lib/components/site/PropertyCard.svelte';
	import UnitFilters from '#lib/components/site/UnitFilters.svelte';
	import { units } from '#lib/mock/site.js';
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
			{units.length} unit
		</span>
	</div>

	<div class="mt-8 flex flex-wrap items-center gap-3">
		<label class="input flex w-full max-w-sm items-center gap-2">
			<span class="icon-[mdi--magnify] size-5 opacity-60"></span>
			<input type="search" class="grow" placeholder="Cari unit, proyek, atau kecamatan" />
		</label>
		<select class="select ml-auto w-48">
			<option>Urutkan: Terbaru</option>
			<option>Harga terendah</option>
			<option>Harga tertinggi</option>
			<option>Luas tanah terbesar</option>
		</select>
	</div>

	<div class="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
		<aside class="hidden lg:block">
			<div class="sticky top-24 border border-brand-line bg-white p-5">
				<div class="flex items-center justify-between">
					<p class="font-bold">Filter</p>
					<button class="btn btn-ghost btn-xs" type="button">Reset</button>
				</div>
				<div class="mt-4">
					<UnitFilters />
				</div>
			</div>
		</aside>

		<div>
			<details class="mb-6 border border-brand-line bg-white p-4 lg:hidden">
				<summary class="cursor-pointer font-bold">Filter unit</summary>
				<div class="mt-4">
					<UnitFilters />
				</div>
			</details>

			<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{#each units as unit (unit.slug)}
					<PropertyCard {unit} />
				{/each}
			</div>
		</div>
	</div>
</div>
