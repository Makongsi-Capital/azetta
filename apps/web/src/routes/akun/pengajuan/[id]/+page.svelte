<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import { formatDate } from '#lib/api/view.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lead = $derived(data.lead);
	const typeLabel: Record<string, string> = {
		BUY_DESIGN: 'Pembelian unit',
		LAND_OFFER: 'Penawaran lahan',
		INVEST: 'Informasi investasi',
		GENERAL: 'Pertanyaan umum'
	};

	const statusTone = $derived(
		lead.status === 'WON'
			? 'badge-success'
			: lead.status === 'LOST'
				? 'badge-outline'
				: 'badge-info'
	);

	const land = $derived(
		(lead.landSubmission ?? null) as Record<string, string | number | null> | null
	);
</script>

<svelte:head>
	<title>Pengajuan {lead.reference} — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta name="description" content="Status dan linimasa pengajuan {lead.reference}." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex flex-wrap items-center gap-2">
			<li><a class="link link-hover" href="/akun">Akun</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">{lead.reference}</span></li>
		</ol>
	</nav>

	<header class="mt-6">
		<div class="flex flex-wrap items-center gap-3">
			<span class="badge badge-sm border-0 {statusTone}">{lead.statusLabel}</span>
			<span class="badge badge-outline badge-sm">{typeLabel[lead.type] ?? lead.type}</span>
			<p class="text-sm text-brand-gray-600">Dikirim {formatDate(lead.createdAt)}</p>
		</div>
		<h1 class="mt-3 text-3xl md:text-4xl">
			{lead.design?.title ?? `Pengajuan ${lead.reference}`}
		</h1>
	</header>

	<div class="mt-8 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10">
		<div>
			{#if lead.message}
				<section class="rounded-[1rem] border border-brand-line bg-white p-6">
					<h2 class="text-xl">Pesan Anda</h2>
					<p class="mt-3 text-sm whitespace-pre-line text-brand-gray-600">{lead.message}</p>
				</section>
			{/if}

			{#if land}
				<section class="mt-6 rounded-[1rem] border border-brand-line bg-white p-6">
					<h2 class="text-xl">Detail lahan</h2>
					<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
						<div>
							<dt class="text-brand-gray-600">Alamat</dt>
							<dd class="font-bold">{land.address || '—'}</dd>
						</div>
						<div>
							<dt class="text-brand-gray-600">Kota / kabupaten</dt>
							<dd class="font-bold">{land.city || '—'}</dd>
						</div>
						<div>
							<dt class="text-brand-gray-600">Kecamatan</dt>
							<dd class="font-bold">{land.district || '—'}</dd>
						</div>
						<div>
							<dt class="text-brand-gray-600">Luas</dt>
							<dd class="font-bold">{land.areaM2 ?? '—'} m²</dd>
						</div>
						<div>
							<dt class="text-brand-gray-600">Kepemilikan</dt>
							<dd class="font-bold">{land.ownershipStatus || '—'}</dd>
						</div>
						<div>
							<dt class="text-brand-gray-600">Skema</dt>
							<dd class="font-bold">{land.expectedScheme || '—'}</dd>
						</div>
					</dl>
				</section>
			{/if}

			<section class="mt-6">
				<h2 class="text-xl">Linimasa</h2>
				{#if lead.timeline.length === 0}
					<p
						class="mt-4 rounded-[1rem] border border-brand-line bg-white p-6 text-sm text-brand-gray-600"
					>
						Belum ada pembaruan. Tim kami akan mencatat setiap perubahan status di sini.
					</p>
				{:else}
					<ol class="mt-5">
						{#each lead.timeline as item (item.createdAt + item.type)}
							<li class="relative flex gap-4 pb-6 last:pb-0">
								<span
									class="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-brand-ink bg-base-100"
								>
									<span class="icon-[mdi--progress-clock] size-3.5"></span>
								</span>
								<div>
									<p class="text-sm font-bold">{item.body ?? item.type}</p>
									<p class="text-xs text-brand-gray-600">{formatDate(item.createdAt)}</p>
								</div>
							</li>
						{/each}
					</ol>
				{/if}
			</section>
		</div>

		<aside class="mt-8 rounded-[1rem] border border-brand-line bg-white p-6 lg:mt-0">
			<p class="text-xs text-brand-gray-600">Nomor pengajuan</p>
			<p class="mt-1 text-lg font-bold">{lead.reference}</p>

			<dl class="mt-5 space-y-2 border-t border-brand-line pt-4 text-sm">
				<div class="flex items-start justify-between gap-4">
					<dt class="text-brand-gray-600">Status</dt>
					<dd class="font-bold">{lead.statusLabel}</dd>
				</div>
				<div class="flex items-start justify-between gap-4">
					<dt class="text-brand-gray-600">Jenis</dt>
					<dd class="text-right font-bold">{typeLabel[lead.type] ?? lead.type}</dd>
				</div>
				<div class="flex items-start justify-between gap-4">
					<dt class="text-brand-gray-600">Diperbarui</dt>
					<dd class="text-right font-bold">{formatDate(lead.updatedAt)}</dd>
				</div>
			</dl>

			{#if lead.design}
				<a class="btn btn-outline btn-sm mt-5 w-full" href="/rumah/{lead.design.slug}">
					Lihat unit
				</a>
			{/if}
			<a class="btn btn-primary btn-sm mt-2 w-full" href="/kontak">Hubungi tim</a>
		</aside>
	</div>
</div>
