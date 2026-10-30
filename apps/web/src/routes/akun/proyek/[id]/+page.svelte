<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: rute tujuan belum dibangun */
	import { formatPrice } from '#lib/format.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const unit = $derived(data.unit);
	const paid = $derived(
		unit.payments
			.filter((payment) => payment.status === 'LUNAS')
			.reduce((total, payment) => total + payment.amount, 0)
	);
	const remaining = $derived(unit.price - paid);
	const nextPayment = $derived(unit.payments.find((payment) => payment.status === 'JATUH TEMPO'));
	const isDone = $derived(unit.progress === 100);

	const milestoneLabel: Record<string, string> = {
		SELESAI: 'Selesai',
		BERJALAN: 'Sedang berjalan',
		RENCANA: 'Direncanakan'
	};

	const paymentTone: Record<string, string> = {
		LUNAS: 'badge-success',
		'JATUH TEMPO': 'badge-warning',
		'AKAN DATANG': 'badge-outline'
	};

	const paymentLabel: Record<string, string> = {
		LUNAS: 'Lunas',
		'JATUH TEMPO': 'Jatuh tempo',
		'AKAN DATANG': 'Akan datang'
	};
</script>

<svelte:head>
	<title>Pantau {unit.unitTitle} — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content="Progres pembangunan, jadwal termin, dan dokumen unit {unit.unitTitle}."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<nav class="text-sm text-brand-gray-600" aria-label="Breadcrumb">
		<ol class="flex flex-wrap items-center gap-2">
			<li><a class="link link-hover" href="/akun">Akun</a></li>
			<li aria-hidden="true">/</li>
			<li><span class="font-bold text-base-content" aria-current="page">{unit.unitTitle}</span></li>
		</ol>
	</nav>

	<header class="mt-6">
		<div class="flex flex-wrap items-center gap-3">
			<span class="badge badge-sm border-0 {isDone ? 'badge-success' : 'badge-info'}">
				{isDone ? 'Serah terima selesai' : 'Sedang dibangun'}
			</span>
			<a class="text-sm text-brand-gray-600 link link-hover" href="/proyek/{unit.projectSlug}">
				{unit.projectTitle}
			</a>
			<p class="inline-flex items-center gap-1 text-sm text-brand-gray-600">
				<span class="icon-[mdi--map-marker-outline] size-4 shrink-0"></span>
				{unit.location}
			</p>
		</div>
		<h1 class="mt-3 text-3xl md:text-4xl">{unit.unitTitle}</h1>
	</header>

	<div class="mt-8 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10">
		<div>
			<div class="rounded-[1rem] border border-brand-line bg-white p-6">
				<div class="flex flex-wrap items-end justify-between gap-3">
					<div>
						<p class="text-xs text-brand-gray-600">Progres pembangunan</p>
						<p class="mt-1 text-3xl font-bold tabular-nums">{unit.progress}%</p>
					</div>
					<p class="text-sm text-brand-gray-600">
						Tahap saat ini: <span class="font-bold text-base-content">{unit.stage}</span>
					</p>
				</div>
				<div
					class="mt-4 h-2.5 rounded-full bg-brand-line"
					role="progressbar"
					aria-label="Progres {unit.unitTitle}"
					aria-valuenow={unit.progress}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div class="h-2.5 rounded-full bg-brand-ink" style="width: {unit.progress}%"></div>
				</div>
				<div class="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-brand-gray-600">
					<p>Mulai: <span class="font-bold text-base-content">{unit.startedAt}</span></p>
					<p>
						Target serah terima: <span class="font-bold text-base-content"
							>{unit.handoverTarget}</span
						>
					</p>
				</div>
			</div>

			<section class="mt-10">
				<h2 class="text-xl">Linimasa pekerjaan</h2>
				<ol class="mt-5">
					{#each unit.milestones as milestone, index (milestone.label)}
						<li class="relative flex gap-4 pb-6 last:pb-0">
							{#if index < unit.milestones.length - 1}
								<span
									class="absolute top-6 left-[11px] h-full w-px bg-brand-line"
									aria-hidden="true"
								></span>
							{/if}
							<span
								class="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border {milestone.status ===
								'SELESAI'
									? 'border-brand-ink bg-brand-ink text-brand-paper'
									: milestone.status === 'BERJALAN'
										? 'border-brand-ink bg-base-100'
										: 'border-brand-gray-300 bg-base-100'}"
							>
								{#if milestone.status === 'SELESAI'}
									<span class="icon-[mdi--check] size-3.5"></span>
								{:else if milestone.status === 'BERJALAN'}
									<span class="size-2 rounded-full bg-brand-ink"></span>
								{/if}
							</span>
							<div>
								<p
									class="text-sm font-bold {milestone.status === 'RENCANA'
										? 'text-brand-gray-600'
										: ''}"
								>
									{milestone.label}
								</p>
								<p class="text-xs text-brand-gray-600">
									{milestone.date} · {milestoneLabel[milestone.status]}
								</p>
								{#if milestone.note}
									<p class="mt-1 text-xs text-brand-gray-600">{milestone.note}</p>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			</section>

			<section class="mt-10">
				<h2 class="text-xl">Foto lapangan</h2>
				<ul class="mt-4 grid gap-3 sm:grid-cols-3">
					{#each unit.gallery as image, index (image)}
						<li>
							<img
								src={image}
								alt="Foto progres {unit.unitTitle} {index + 1}"
								width="600"
								height="450"
								loading="lazy"
								class="aspect-[4/3] w-full rounded-[0.5rem] border border-brand-line object-cover"
							/>
							<p class="mt-1 text-xs text-brand-gray-600">Foto {index + 1} · {unit.stage}</p>
						</li>
					{/each}
				</ul>
			</section>

			<section class="mt-10">
				<h2 class="text-xl">Termin pembayaran</h2>
				<div class="mt-4 overflow-x-auto rounded-[1rem] border border-brand-line bg-white">
					<table class="table">
						<thead>
							<tr>
								<th>Termin</th>
								<th>Jatuh tempo</th>
								<th class="text-right">Nominal</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each unit.payments as payment (payment.label)}
								<tr>
									<td class="font-bold">{payment.label}</td>
									<td class="text-brand-gray-600">{payment.dueDate}</td>
									<td class="text-right tabular-nums">{formatPrice(payment.amount)}</td>
									<td>
										<span class="badge badge-sm border-0 {paymentTone[payment.status]}">
											{paymentLabel[payment.status]}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr>
								<th colspan="2">Total terbayar</th>
								<th class="text-right tabular-nums">{formatPrice(paid)}</th>
								<th class="text-xs font-normal text-brand-gray-600">
									dari {formatPrice(unit.price)}
								</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</section>

			<section class="mt-10">
				<h2 class="text-xl">Dokumen</h2>
				<ul
					class="mt-4 divide-y divide-brand-line overflow-hidden rounded-[1rem] border border-brand-line bg-white"
				>
					{#each unit.documents as doc (doc.name)}
						<li class="flex flex-wrap items-center gap-3 p-4">
							<span class="icon-[mdi--file-document-outline] size-5 shrink-0"></span>
							<div class="mr-auto">
								<p class="text-sm font-bold {doc.available ? '' : 'text-brand-gray-600'}">
									{doc.name}
								</p>
								<p class="text-xs text-brand-gray-600">Diperbarui {doc.updatedAt}</p>
							</div>
							{#if doc.available}
								<button class="btn btn-ghost btn-xs" type="button">Unduh</button>
							{:else}
								<span class="badge badge-outline badge-sm">Belum tersedia</span>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		</div>

		<aside class="mt-10 space-y-5 lg:mt-0 lg:sticky lg:top-24">
			<div class="rounded-[1rem] border border-brand-line bg-white p-5">
				<p class="text-xs text-brand-gray-600">Harga unit</p>
				<p class="mt-1 text-xl font-bold tabular-nums">{formatPrice(unit.price)}</p>
				<dl class="mt-4 space-y-2 border-t border-brand-line pt-4 text-sm">
					<div class="flex items-start justify-between gap-3">
						<dt class="text-brand-gray-600">Terbayar</dt>
						<dd class="font-bold tabular-nums">{formatPrice(paid)}</dd>
					</div>
					<div class="flex items-start justify-between gap-3">
						<dt class="text-brand-gray-600">Sisa</dt>
						<dd class="font-bold tabular-nums">{formatPrice(remaining)}</dd>
					</div>
					<div class="flex items-start justify-between gap-3">
						<dt class="text-brand-gray-600">Termin berikutnya</dt>
						<dd class="text-right font-bold">
							{nextPayment ? `${formatPrice(nextPayment.amount)} · ${nextPayment.dueDate}` : '—'}
						</dd>
					</div>
				</dl>
			</div>

			<div class="rounded-[1rem] border border-brand-line bg-white p-5">
				<p class="font-bold">PIC proyek</p>
				<p class="mt-2 text-sm">{unit.pic.name}</p>
				<p class="text-xs text-brand-gray-600">{unit.pic.role}</p>
				<a class="btn btn-outline btn-sm mt-4 w-full" href="/kontak">Hubungi PIC</a>
			</div>

			<a class="btn btn-ghost btn-sm w-full" href="/rumah/{unit.unitSlug}">Lihat halaman unit</a>
			<a class="btn btn-ghost btn-sm w-full" href="/akun">Kembali ke ringkasan</a>
		</aside>
	</div>
</div>
