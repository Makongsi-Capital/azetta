<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	/* eslint-disable svelte/no-at-html-tags -- deskripsi unit berasal dari API dan disanitasi saat penyimpanan */
	import PropertyCard from '#lib/components/site/PropertyCard.svelte';
	import LeadForm from '#lib/components/site/LeadForm.svelte';
	import SectionHeading from '#lib/components/site/SectionHeading.svelte';
	import { formatPrice } from '#lib/format.js';
	import { jsonLdScript } from '#lib/seo.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const unit = $derived(data.unit);
	const gallery = $derived(unit.gallery.slice(0, 4));
	const floors = $derived(Array.from({ length: unit.floors }, (_, index) => index + 1));

	const statusLabel = $derived(
		unit.status === 'TERSEDIA' ? 'Tersedia' : unit.status === 'INDENT' ? 'Indent' : 'Terjual'
	);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Residence',
		name: unit.title,
		description: unit.summary,
		image: gallery,
		address: {
			'@type': 'PostalAddress',
			addressLocality: unit.city,
			addressRegion: 'Sulawesi Selatan',
			addressCountry: 'ID'
		},
		numberOfRooms: unit.bedrooms,
		floorSize: { '@type': 'QuantitativeValue', value: unit.buildingAreaM2, unitCode: 'MTK' }
	});
</script>

<svelte:head>
	<title>{unit.title} — Rumah {unit.type} di {unit.city} | Azetta</title>
	<meta name="description" content={unit.summary} />
	{@html jsonLdScript(jsonLd)}
</svelte:head>

<div class="pb-24 lg:pb-0">
	<div class="mx-auto max-w-6xl px-4 py-8">
		<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
			<ol class="flex flex-wrap items-center gap-2">
				<li><a class="link link-hover" href="/">Beranda</a></li>
				<li aria-hidden="true">/</li>
				<li><a class="link link-hover" href="/rumah">Rumah</a></li>
				<li aria-hidden="true">/</li>
				<li><span class="font-bold text-base-content" aria-current="page">{unit.title}</span></li>
			</ol>
		</nav>

		<div class="mt-6 lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">
			<div>
				<figure class="overflow-hidden rounded-[1rem] border border-brand-line bg-brand-mist">
					{#if gallery[0]}
						<img
							src={gallery[0].url}
							alt={gallery[0].alt}
							width="1200"
							height="800"
							fetchpriority="high"
							class="aspect-[3/2] w-full object-cover"
						/>
					{:else}
						<span class="grid aspect-[3/2] w-full place-items-center text-sm text-brand-gray-600">
							Foto belum tersedia
						</span>
					{/if}
				</figure>

				<ul class="mt-3 grid grid-cols-4 gap-3">
					{#each gallery as image, index (image.url)}
						<li>
							<img
								src={image.url}
								alt={image.alt || `Foto ${index + 1} ${unit.title}`}
								width="300"
								height="225"
								loading="lazy"
								class="aspect-[4/3] w-full rounded-[0.5rem] border object-cover {index === 0
									? 'border-brand-ink'
									: 'border-brand-line'}"
							/>
						</li>
					{/each}
				</ul>

				<div class="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-gray-600">
					{#if unit.projectSlug}
						<a class="link link-hover" href="/proyek/{unit.projectSlug}">{unit.project}</a>
					{:else}
						<span>{unit.project}</span>
					{/if}
					<span aria-hidden="true">·</span>
					<span>{unit.type}</span>
					<span aria-hidden="true">·</span>
					<span>{unit.floors} lantai</span>
				</div>

				<div class="mt-2 flex flex-wrap items-center gap-3">
					<h1 class="text-3xl md:text-4xl">{unit.title}</h1>
					<span
						class="badge badge-sm border-0 {unit.status === 'TERSEDIA'
							? 'badge-success'
							: unit.status === 'INDENT'
								? 'badge-warning'
								: 'badge-error'}"
					>
						{statusLabel}
					</span>
				</div>

				<p class="mt-2 inline-flex items-center gap-1 text-brand-gray-600">
					<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
					{[unit.district, unit.city].filter(Boolean).join(', ')}
				</p>

				<dl
					class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line sm:grid-cols-4"
				>
					<div class="bg-white p-4">
						<dt class="text-xs text-brand-gray-600">Kamar tidur</dt>
						<dd class="mt-1 text-lg font-bold tabular-nums">{unit.bedrooms} KT</dd>
					</div>
					<div class="bg-white p-4">
						<dt class="text-xs text-brand-gray-600">Kamar mandi</dt>
						<dd class="mt-1 text-lg font-bold tabular-nums">{unit.bathrooms} KM</dd>
					</div>
					<div class="bg-white p-4">
						<dt class="text-xs text-brand-gray-600">Luas bangunan</dt>
						<dd class="mt-1 text-lg font-bold tabular-nums">{unit.buildingAreaM2} m²</dd>
					</div>
					<div class="bg-white p-4">
						<dt class="text-xs text-brand-gray-600">Luas tanah</dt>
						<dd class="mt-1 text-lg font-bold tabular-nums">{unit.landAreaM2} m²</dd>
					</div>
				</dl>

				<section class="mt-10">
					<h2 class="text-xl">Tentang unit ini</h2>
					{#if unit.descriptionHtml}
						<div class="prose mt-3 text-brand-gray-600">{@html unit.descriptionHtml}</div>
					{:else if unit.summary}
						<p class="mt-3 text-brand-gray-600">{unit.summary}</p>
					{/if}
					<p class="mt-3 text-brand-gray-600">
						Spesifikasi di halaman ini adalah standar {unit.type}. Perubahan material dapat diminta
						sebelum pekerjaan struktur dimulai dan akan memengaruhi harga akhir. Denah, legalitas,
						dan jadwal serah terima dikirim lengkap sebelum Anda membayar tanda jadi.
					</p>
				</section>

				<section class="mt-10">
					<h2 class="text-xl">Denah</h2>
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						{#each floors as floor (floor)}
							<div
								class="grid aspect-[4/3] place-items-center rounded-[1rem] border border-brand-line bg-brand-mist text-sm text-brand-gray-600"
							>
								Denah lantai {floor} · {unit.buildingAreaM2} m²
							</div>
						{/each}
					</div>
				</section>

				<section id="tanya" class="mt-10 rounded-[1rem] border border-brand-line bg-white p-6">
					<h2 class="text-xl">Tanya unit ini</h2>
					<p class="mt-2 text-sm text-brand-gray-600">
						Diisi kurang dari satu menit. Balasan pada jam kerja, maksimal 2 jam.
					</p>

					<div class="mt-6">
						<LeadForm
							type="BUY_UNIT"
							unitId={unit.id}
							submitLabel="Kirim pertanyaan"
							messagePlaceholder="Saya ingin melihat unit {unit.title} dan menanyakan skema pembayaran."
							{form}
						/>
					</div>
				</section>
			</div>

			<aside class="mt-10 lg:mt-0">
				<div class="rounded-[1rem] border border-brand-line bg-white p-6 lg:sticky lg:top-24">
					<p class="text-xs text-brand-gray-600">Harga mulai dari</p>
					<p class="mt-1 text-2xl font-bold tabular-nums">
						{unit.priceFrom === null ? 'Hubungi kami' : formatPrice(unit.priceFrom)}
					</p>
					<p class="mt-2 text-xs text-brand-gray-600">
						Indikatif, belum termasuk biaya KPR, pajak, dan biaya akad.
					</p>

					<div class="mt-5 grid gap-2">
						<a class="btn btn-primary w-full" href="#tanya">Tanya unit ini</a>
						<a class="btn btn-outline w-full" href="/kontak">Jadwalkan survei</a>
					</div>

					<dl class="mt-6 space-y-2 border-t border-brand-line pt-4 text-sm">
						<div class="flex items-start justify-between gap-4">
							<dt class="text-brand-gray-600">Ketersediaan</dt>
							<dd class="font-bold">{statusLabel}</dd>
						</div>
						<div class="flex items-start justify-between gap-4">
							<dt class="text-brand-gray-600">Proyek</dt>
							<dd class="text-right font-bold">{unit.project}</dd>
						</div>
						<div class="flex items-start justify-between gap-4">
							<dt class="text-brand-gray-600">Lantai</dt>
							<dd class="font-bold tabular-nums">{unit.floors}</dd>
						</div>
					</dl>
				</div>
			</aside>
		</div>
	</div>

	<section class="mx-auto max-w-6xl px-4 pb-16">
		<SectionHeading
			title="Unit lain yang mungkin cocok"
			description="Harga dan ketersediaan diperbarui oleh tim Azetta."
			href="/rumah"
			linkLabel="Lihat semua unit"
		/>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.related as item (item.slug)}
				<PropertyCard unit={item} />
			{/each}
		</div>
	</section>
</div>

<div
	class="fixed inset-x-0 bottom-0 z-30 border-t border-brand-line bg-base-100/95 backdrop-blur lg:hidden"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
		<div>
			<p class="text-xs text-brand-gray-600">Mulai dari</p>
			<p class="text-base font-bold tabular-nums">
				{unit.priceFrom === null ? 'Hubungi kami' : formatPrice(unit.priceFrom)}
			</p>
		</div>
		<a class="btn btn-primary btn-sm" href="#tanya">Tanya unit</a>
	</div>
</div>
