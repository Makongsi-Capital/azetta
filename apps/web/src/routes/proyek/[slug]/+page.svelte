<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve, svelte/no-at-html-tags -- mockup: sebagian rute belum dibangun; JSON-LD berasal dari konstanta yang di-escape. */
	import PropertyCard from '#lib/components/site/PropertyCard.svelte';
	import SectionHeading from '#lib/components/site/SectionHeading.svelte';
	import { jsonLdScript } from '#lib/seo.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const project = $derived(data.project);
	const isCompleted = $derived(project.status === 'SELESAI');
	const period = $derived(
		project.yearCompleted
			? `${project.yearStarted}–${project.yearCompleted}`
			: `${project.yearStarted}–sekarang`
	);
	const area = $derived(new Intl.NumberFormat('id-ID').format(project.landAreaM2));

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.summary,
		image: project.cover,
		dateCreated: String(project.yearStarted),
		locationCreated: {
			'@type': 'Place',
			name: `${project.location}, ${project.city}`
		}
	});
</script>

<svelte:head>
	<title>{project.title} — Proyek Azetta di {project.city}</title>
	<meta name="description" content={project.summary} />
	{@html jsonLdScript(jsonLd)}
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex flex-wrap items-center gap-2">
			<li><a class="link link-hover" href="/">Beranda</a></li>
			<li aria-hidden="true">/</li>
			<li><a class="link link-hover" href="/proyek">Proyek</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">{project.title}</span></li>
		</ol>
	</nav>

	<header class="mt-6">
		<div class="flex flex-wrap items-center gap-3">
			<span class="badge badge-sm border-0 {isCompleted ? 'badge-outline bg-white' : 'badge-info'}">
				{isCompleted ? 'Selesai' : 'Sedang berjalan'}
			</span>
			<p class="inline-flex items-center gap-1 text-sm text-brand-gray-600">
				<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
				{project.location}, {project.city}
			</p>
		</div>

		<h1 class="mt-3 text-3xl md:text-4xl">{project.title}</h1>
		<p class="mt-3 max-w-2xl text-brand-gray-600">{project.summary}</p>
	</header>

	<figure class="mt-8 overflow-hidden rounded-[1rem] border border-brand-line bg-brand-mist">
		<img
			src={project.cover}
			alt="Proyek {project.title}"
			width="1200"
			height="514"
			fetchpriority="high"
			class="aspect-[21/9] w-full object-cover"
		/>
	</figure>

	<dl
		class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line sm:grid-cols-4"
	>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Tahun</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{period}</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Jumlah unit</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{project.unitCount} unit</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Luas lahan</dt>
			<dd class="mt-1 text-lg font-bold tabular-nums">{area} m²</dd>
		</div>
		<div class="bg-white p-4">
			<dt class="text-xs text-brand-gray-600">Status</dt>
			<dd class="mt-1 text-lg font-bold">{isCompleted ? 'Selesai' : 'Berjalan'}</dd>
		</div>
	</dl>

	<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
		<div>
			<h2 class="text-xl">Tentang proyek</h2>
			<p class="mt-3 text-brand-gray-600">
				{project.title} dikembangkan di {project.location}, {project.city}, dengan {project.unitCount}
				unit pada lahan seluas {area} m². Tata letak dibuat agar setiap unit mendapat akses jalan lingkungan
				dan saluran air hujan yang memadai.
			</p>
			<p class="mt-3 text-brand-gray-600">
				Progres dilaporkan berkala kepada pembeli dan pemilik lahan: foto lapangan, tahap pekerjaan,
				dan perkiraan serah terima. Dokumen legalitas ditunjukkan sebelum tanda tangan, bukan
				setelahnya.
			</p>

			<h2 class="mt-8 text-xl">Yang perlu diketahui</h2>
			<ul class="mt-3 space-y-2 text-brand-gray-600">
				<li class="flex gap-2">
					<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
					Harga unit bersifat indikatif dan ditetapkan per tipe, bukan per unit.
				</li>
				<li class="flex gap-2">
					<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
					Perubahan spesifikasi hanya dapat diminta sebelum pekerjaan struktur dimulai.
				</li>
				<li class="flex gap-2">
					<span class="icon-[mdi--check-decagram-outline] mt-0.5 size-4 shrink-0"></span>
					Skema pembayaran dan jadwal serah terima ditulis dalam kesepakatan, tidak lisan.
				</li>
			</ul>
		</div>

		<aside class="rounded-[1rem] border border-brand-line bg-white p-6 lg:sticky lg:top-24">
			<p class="font-bold">Tertarik dengan proyek ini?</p>
			<p class="mt-2 text-sm text-brand-gray-600">
				Kami kirim daftar unit yang tersedia beserta denah dan skema pembayarannya.
			</p>
			<div class="mt-5 grid gap-2">
				<a class="btn btn-primary w-full" href="/kontak">Hubungi kami</a>
				<a class="btn btn-outline w-full" href="/rumah">Lihat semua unit</a>
			</div>
		</aside>
	</div>
</div>

<section class="border-t border-brand-line bg-brand-mist">
	<div class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading
			title="Unit di proyek ini"
			description={data.units.length > 0
				? `${data.units.length} unit ditampilkan dari proyek ${project.title}.`
				: 'Unit untuk proyek ini belum dipublikasikan.'}
			href="/rumah"
			linkLabel="Lihat semua unit"
		/>

		{#if data.units.length > 0}
			<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.units as unit (unit.slug)}
					<PropertyCard {unit} />
				{/each}
			</div>
		{:else}
			<p
				class="mt-6 rounded-[1rem] border border-brand-line bg-white p-6 text-sm text-brand-gray-600"
			>
				Proyek ini tidak memiliki unit yang dijual saat ini. Hubungi kami untuk informasi tahap
				berikutnya.
			</p>
		{/if}
	</div>
</section>
