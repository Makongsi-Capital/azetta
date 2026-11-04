<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute tujuan sudah dibangun di app admin */
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { formatDate, formatDateTime, formatNumber, formatRelative } from '#lib/format.js';
	import {
		leadPriorityLabel,
		leadPriorityTone,
		leadSourceLabel,
		leadStatusLabel,
		leadStatusTone,
		leadTypeLabel
	} from '#lib/labels.js';
	import {
		leadSeries,
		leadStats,
		leads,
		leadsByStatus,
		leadsByType,
		MOCK_NOW,
		upcomingFollowUps
	} from '#lib/mock/admin.js';

	const maxCount = Math.max(1, ...leadSeries.map((point) => point.count));
	const maxStatus = Math.max(1, ...leadsByStatus.map((row) => row.count));
	const typeTotal = leadsByType.reduce((total, row) => total + row.count, 0);
	const chartTotal = leadSeries.reduce((total, point) => total + point.count, 0);

	const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

	const followUps = upcomingFollowUps.slice(0, 4);

	const pointDate = (date: string) => `${date}T00:00:00+07:00`;
	const rangeStart = leadSeries[0]?.date;
</script>

<svelte:head>
	<title>Dashboard — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Ringkasan operasional"
	title="Dashboard"
	description="Pantau lead masuk, pipeline, dan follow-up terdekat. Angka di halaman ini dihitung dari data yang sama dengan daftar lead."
>
	{#snippet actions()}
		<span class="badge badge-outline badge-sm">
			Diperbarui {formatDateTime(MOCK_NOW)}
		</span>
		<a class="btn btn-sm" href="/leads">Buka lead</a>
		<a class="btn btn-primary btn-sm" href="/unit/baru">Tambah unit</a>
	{/snippet}
</PageHeader>

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard
		label="Lead baru hari ini"
		value={leadStats.newToday}
		hint="Masuk sejak 00.00 WIB"
		icon="icon-[mdi--account-plus-outline]"
		tone="success"
	/>
	<StatCard
		label="Belum dihubungi"
		value={leadStats.notContacted}
		hint="Status baru tanpa kontak tercatat"
		icon="icon-[mdi--phone-off-outline]"
		tone="warning"
	/>
	<StatCard
		label="Lewat 24 jam"
		value={leadStats.staleOver24h}
		hint="Belum dihubungi lebih dari sehari"
		icon="icon-[mdi--timer-alert-outline]"
		tone="danger"
	/>
	<StatCard
		label="Median respons pertama"
		value="{leadStats.medianFirstResponseMinutes} mnt"
		hint="Target internal di bawah 2 jam"
		icon="icon-[mdi--clock-fast]"
	/>
</section>

<div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
	<Panel title="Lead masuk — 30 hari terakhir" description="Jumlah lead baru per hari.">
		{#snippet actions()}
			<span class="text-xs text-brand-gray-600">{formatNumber(chartTotal)} lead</span>
		{/snippet}

		<div
			class="flex h-48 items-end gap-1"
			role="img"
			aria-label="Grafik batang jumlah lead masuk per hari selama 30 hari terakhir"
		>
			{#each leadSeries as point (point.date)}
				<div class="group flex h-full flex-1 items-end">
					<div
						class="w-full bg-brand-line transition-colors group-hover:bg-brand-ink"
						style="height: {Math.max(3, (point.count / maxCount) * 100)}%"
						title="{formatDate(pointDate(point.date))}: {point.count} lead"
					></div>
				</div>
			{/each}
		</div>

		<div class="mt-2 flex justify-between text-[11px] text-brand-gray-600">
			<span>{rangeStart ? formatDate(pointDate(rangeStart)) : '—'}</span>
			<span>Hari ini</span>
		</div>
	</Panel>

	<Panel title="Pipeline lead" description="Sebaran status seluruh lead aktif.">
		<div class="grid gap-3">
			{#each leadsByStatus as row (row.status)}
				<div class="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3">
					<span class="text-xs">{leadStatusLabel[row.status]}</span>
					<div class="h-2 w-full bg-base-200" aria-hidden="true">
						<div
							class="h-2 bg-brand-ink"
							style="width: {Math.round((row.count / maxStatus) * 100)}%"
						></div>
					</div>
					<span class="text-right text-xs font-bold tabular-nums">{row.count}</span>
				</div>
			{/each}
		</div>

		<div class="mt-5 border-t border-brand-line pt-4">
			<p class="eyebrow">Jenis lead</p>
			<ul class="mt-3 grid gap-2">
				{#each leadsByType as row (row.type)}
					<li class="flex items-center justify-between gap-3 text-xs">
						<span>{leadTypeLabel[row.type]}</span>
						<span class="text-brand-gray-600 tabular-nums">
							{row.count} · {Math.round((row.count / typeTotal) * 100)}%
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</Panel>
</div>

<div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
	<Panel title="Lead terbaru" description="Enam lead terakhir yang masuk." padded={false}>
		{#snippet actions()}
			<a class="btn btn-ghost btn-xs" href="/leads">Lihat semua</a>
		{/snippet}

		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Nama</th>
						<th class="hidden sm:table-cell">Tipe</th>
						<th>Status</th>
						<th class="hidden md:table-cell">Sumber</th>
						<th class="text-right">Waktu</th>
					</tr>
				</thead>
				<tbody>
					{#each recentLeads as lead (lead.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<a class="block font-bold" href="/leads/{lead.id}">{lead.name}</a>
								<span class="text-[11px] text-brand-gray-600">{lead.reference}</span>
							</td>
							<td class="hidden text-xs sm:table-cell">{leadTypeLabel[lead.type]}</td>
							<td>
								<StatusBadge
									label={leadStatusLabel[lead.status]}
									tone={leadStatusTone[lead.status]}
								/>
							</td>
							<td class="hidden text-xs md:table-cell">{leadSourceLabel[lead.source]}</td>
							<td class="text-right text-xs whitespace-nowrap text-brand-gray-600">
								{formatRelative(lead.createdAt, MOCK_NOW)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Panel>

	<Panel title="Follow-up terdekat" description="Diurutkan dari jadwal paling awal.">
		{#if followUps.length === 0}
			<p class="text-sm text-brand-gray-600">Tidak ada follow-up terjadwal.</p>
		{:else}
			<ul class="grid gap-3">
				{#each followUps as lead (lead.id)}
					<li class="border-b border-brand-line pb-3 last:border-0 last:pb-0">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0">
								<a class="block truncate text-sm font-bold" href="/leads/{lead.id}">{lead.name}</a>
								<p class="mt-0.5 text-xs text-brand-gray-600">
									{lead.city ?? 'Kota belum diisi'} · {leadSourceLabel[lead.source]}
								</p>
							</div>
							<StatusBadge
								label={leadPriorityLabel[lead.priority]}
								tone={leadPriorityTone[lead.priority]}
							/>
						</div>
						<p class="mt-2 inline-flex items-center gap-1 text-xs text-brand-gray-600">
							<span class="icon-[mdi--calendar-clock-outline] size-3.5"></span>
							{lead.nextFollowUpAt ? formatDateTime(lead.nextFollowUpAt) : 'Belum dijadwalkan'}
						</p>
					</li>
				{/each}
			</ul>
		{/if}

		<a class="btn btn-outline btn-sm mt-4 w-full" href="/leads">Kelola semua lead</a>
	</Panel>
</div>
