<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import { formatPrice } from '#lib/format.js';
	import type { MockUnit } from '#lib/mock/site.js';

	interface Props {
		unit: MockUnit;
	}

	let { unit }: Props = $props();

	const statusLabel: Record<MockUnit['status'], string> = {
		TERSEDIA: 'Tersedia',
		INDENT: 'Indent',
		TERJUAL: 'Terjual'
	};

	const statusClass: Record<MockUnit['status'], string> = {
		TERSEDIA: 'badge-success',
		INDENT: 'badge-warning',
		TERJUAL: 'badge-error'
	};
</script>

<a
	class="card border border-brand-line bg-white transition-colors hover:border-brand-gray-300"
	href="/rumah/{unit.slug}"
	aria-label="{unit.title} — {unit.type} di {unit.district}, {unit.city}"
>
	<figure class="relative aspect-[4/3] overflow-hidden rounded-t-[1rem] bg-brand-mist">
		<img
			src={unit.cover}
			alt="Tampak depan {unit.title}"
			width="900"
			height="675"
			loading="lazy"
			class="h-full w-full object-cover"
		/>
		<span class="badge badge-sm {statusClass[unit.status]} absolute top-3 left-3 border-0">
			{statusLabel[unit.status]}
		</span>
	</figure>

	<div class="card-body gap-2 p-5">
		<p class="text-xs text-brand-gray-600">
			{unit.project} · {unit.type} · {unit.floors} lantai
		</p>
		<h3 class="text-base font-bold">{unit.title}</h3>
		<p class="inline-flex items-center gap-1 text-sm text-brand-gray-600">
			<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
			{unit.district}, {unit.city}
		</p>

		<ul class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-gray-600">
			<li class="inline-flex items-center gap-1">
				<span class="icon-[mdi--bed-outline] size-4"></span>{unit.bedrooms} KT
			</li>
			<li class="inline-flex items-center gap-1">
				<span class="icon-[mdi--shower] size-4"></span>{unit.bathrooms} KM
			</li>
			<li class="inline-flex items-center gap-1">
				<span class="icon-[mdi--ruler-square] size-4"></span>LT {unit.landAreaM2} m²
			</li>
			<li class="inline-flex items-center gap-1">
				<span class="icon-[mdi--floor-plan] size-4"></span>LB {unit.buildingAreaM2} m²
			</li>
		</ul>

		<div class="mt-3 flex items-end justify-between border-t border-brand-line pt-3">
			<div>
				<p class="text-xs text-brand-gray-600">Mulai dari</p>
				<p class="text-base font-bold tabular-nums">{formatPrice(unit.priceFrom)}</p>
			</div>
			<span class="btn btn-outline btn-sm">Detail</span>
		</div>
	</div>
</a>
