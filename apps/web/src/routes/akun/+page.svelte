<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import { formatDate } from '#lib/api/view.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const firstName = $derived(data.user.name.split(' ')[0]);
	const activeLeads = $derived(
		data.leads.filter((lead) => lead.status !== 'WON' && lead.status !== 'LOST')
	);
	const completedLeads = $derived(data.leads.filter((lead) => lead.status === 'WON'));

	const statusTone = (status: string) =>
		status === 'WON' ? 'badge-success' : status === 'LOST' ? 'badge-outline' : 'badge-info';

	const typeLabel: Record<string, string> = {
		BUY_UNIT: 'Pembelian unit',
		LAND_OFFER: 'Penawaran lahan',
		GENERAL: 'Pertanyaan umum'
	};
</script>

<svelte:head>
	<title>Akun Saya — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta name="description" content="Pantau status pengajuan unit dan lahan Anda di Azetta." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl md:text-4xl">Akun Anda</h1>
			<p class="mt-3 max-w-2xl text-sm text-brand-gray-600">
				Halo {firstName}. Berikut profil dan pengajuan yang tercatat atas nama Anda.
			</p>
		</div>
	</div>

	{#if !data.verified}
		<div role="alert" class="alert alert-warning mt-6">
			<span class="icon-[mdi--email-alert-outline] size-5 shrink-0"></span>
			<span>
				Email Anda belum terverifikasi. Buka tautan verifikasi yang kami kirim ke
				<strong>{data.user.email}</strong> untuk melihat detail pengajuan.
			</span>
		</div>
	{:else}
		<dl
			class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] border border-brand-line bg-brand-line sm:grid-cols-4"
		>
			<div class="bg-white p-4">
				<dt class="text-xs text-brand-gray-600">Total pengajuan</dt>
				<dd class="mt-1 text-lg font-bold tabular-nums">{data.leads.length}</dd>
			</div>
			<div class="bg-white p-4">
				<dt class="text-xs text-brand-gray-600">Sedang diproses</dt>
				<dd class="mt-1 text-lg font-bold tabular-nums">{activeLeads.length}</dd>
			</div>
			<div class="bg-white p-4">
				<dt class="text-xs text-brand-gray-600">Selesai</dt>
				<dd class="mt-1 text-lg font-bold tabular-nums">{completedLeads.length}</dd>
			</div>
			<div class="bg-white p-4">
				<dt class="text-xs text-brand-gray-600">Status email</dt>
				<dd class="mt-1 text-sm font-bold">
					{data.profile?.emailVerified ? 'Terverifikasi' : 'Belum terverifikasi'}
				</dd>
			</div>
		</dl>

		<div class="mt-10 grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
			<section>
				<h2 class="text-2xl">Pengajuan Anda</h2>
				<p class="mt-2 text-sm text-brand-gray-600">
					Status pengajuan unit dan lahan yang pernah Anda kirim.
				</p>

				{#if data.leads.length === 0}
					<p
						class="mt-6 rounded-[1rem] border border-brand-line bg-white p-6 text-sm text-brand-gray-600"
					>
						Belum ada pengajuan. Mulai dari
						<a class="link link-hover font-bold" href="/rumah">katalog unit</a> atau
						<a class="link link-hover font-bold" href="/kerja-sama-lahan">pengajuan lahan</a>.
					</p>
				{:else}
					<ul
						class="mt-6 divide-y divide-brand-line overflow-hidden rounded-[1rem] border border-brand-line bg-white"
					>
						{#each data.leads as lead (lead.id)}
							<li class="flex flex-wrap items-center gap-3 p-4">
								<span class="badge badge-outline badge-sm">
									{typeLabel[lead.type] ?? lead.type}
								</span>
								<div class="mr-auto min-w-0">
									<p class="text-sm font-bold">{lead.unit?.title ?? lead.reference}</p>
									<p class="text-xs text-brand-gray-600">
										{lead.reference} · dikirim {formatDate(lead.createdAt)}
									</p>
									{#if lead.message}
										<p class="mt-1 line-clamp-2 text-xs text-brand-gray-600">{lead.message}</p>
									{/if}
								</div>
								<span class="badge badge-sm border-0 {statusTone(lead.status)}">
									{lead.statusLabel}
								</span>
								<a class="btn btn-ghost btn-xs" href="/akun/pengajuan/{lead.id}">Detail</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<aside class="rounded-[1rem] border border-brand-line bg-white p-6">
				<p class="font-bold">Profil</p>
				<dl class="mt-4 space-y-2 text-sm">
					<div class="flex items-start justify-between gap-3">
						<dt class="text-brand-gray-600">Nama</dt>
						<dd class="text-right font-bold">{data.profile?.name ?? data.user.name}</dd>
					</div>
					<div class="flex items-start justify-between gap-3">
						<dt class="text-brand-gray-600">Email</dt>
						<dd class="text-right font-bold break-all">{data.user.email}</dd>
					</div>
					{#if data.profile?.phone}
						<div class="flex items-start justify-between gap-3">
							<dt class="text-brand-gray-600">Telepon</dt>
							<dd class="text-right font-bold">{data.profile.phone}</dd>
						</div>
					{/if}
					{#if data.profile?.city}
						<div class="flex items-start justify-between gap-3">
							<dt class="text-brand-gray-600">Kota</dt>
							<dd class="text-right font-bold">{data.profile.city}</dd>
						</div>
					{/if}
				</dl>
				<a class="btn btn-outline btn-sm mt-5 w-full" href="/kontak">Perbarui data</a>
			</aside>
		</div>
	{/if}

	<div class="mt-12 rounded-[1rem] border border-brand-line bg-white p-6">
		<p class="font-bold">Ada unit atau lahan lain yang ingin Anda tinjau?</p>
		<p class="mt-2 text-sm text-brand-gray-600">
			Kami bisa mengirim daftar unit terbaru atau menjadwalkan survei lokasi.
		</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi kami</a>
			<a class="btn btn-ghost btn-sm" href="/rumah">Lihat katalog</a>
		</div>
	</div>
</div>
