<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import type { ApiUnitFilters } from '#lib/api/types.js';

	interface Props {
		filters: ApiUnitFilters | null;
		values?: Record<string, string>;
	}

	let { filters, values = {} }: Props = $props();

	const maxPriceOptions = [
		{ value: '', label: 'Tanpa batas' },
		{ value: '700000000', label: '< Rp 700 jt' },
		{ value: '1500000000', label: 'Rp 700 jt – Rp 1,5 M' },
		{ value: '3000000000', label: 'Rp 1,5 M – Rp 3 M' }
	];
</script>

<div class="space-y-6">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Proyek</legend>
		<select name="project" class="select select-sm w-full">
			<option value="">Semua proyek</option>
			{#each filters?.projects ?? [] as project (project.slug)}
				<option value={project.slug} selected={values.project === project.slug}>
					{project.title}
				</option>
			{/each}
		</select>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Kota</legend>
		<select name="city" class="select select-sm w-full">
			<option value="">Semua kota</option>
			{#each filters?.cities ?? [] as city (city)}
				<option value={city} selected={values.city === city}>{city}</option>
			{/each}
		</select>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Tipe</legend>
		<select name="type" class="select select-sm w-full">
			<option value="">Semua tipe</option>
			{#each filters?.types ?? [] as type (type)}
				<option value={type} selected={values.type === type}>{type}</option>
			{/each}
		</select>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Kamar tidur</legend>
		<select name="bedrooms" class="select select-sm w-full">
			<option value="">Semua</option>
			{#each [2, 3, 4] as count (count)}
				<option value={count} selected={values.bedrooms === String(count)}>≥ {count} KT</option>
			{/each}
		</select>
	</fieldset>

	<div class="grid grid-cols-2 gap-3">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Luas tanah min</legend>
			<input
				class="input input-sm w-full"
				type="number"
				name="minLandArea"
				min="0"
				placeholder="72"
				value={values.minLandArea ?? ''}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Luas bangunan min</legend>
			<input
				class="input input-sm w-full"
				type="number"
				name="minBuildingArea"
				min="0"
				placeholder="60"
				value={values.minBuildingArea ?? ''}
			/>
		</fieldset>
	</div>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Harga maksimum</legend>
		<select name="maxPrice" class="select select-sm w-full">
			{#each maxPriceOptions as option (option.value)}
				<option value={option.value} selected={values.maxPrice === option.value}>
					{option.label}
				</option>
			{/each}
		</select>
	</fieldset>

	<div class="flex gap-2">
		<button class="btn btn-primary btn-sm flex-1" type="submit">Terapkan</button>
		<a class="btn btn-ghost btn-sm" href="/rumah">Reset</a>
	</div>
</div>
