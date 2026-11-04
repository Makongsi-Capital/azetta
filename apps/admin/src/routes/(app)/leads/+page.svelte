<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute detail lead sudah dibangun */
	import { page } from '$app/state';
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import Modal from '#lib/components/admin/Modal.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { downloadCsv, formatDateTime, formatRelative, initials } from '#lib/format.js';
	import {
		leadPriorityLabel,
		leadPriorityTone,
		leadSourceLabel,
		leadStatusLabel,
		leadStatusTone,
		leadTypeLabel,
		leadTypeShort
	} from '#lib/labels.js';
	import {
		currentUser,
		leads as seedLeads,
		MOCK_NOW,
		type Lead,
		type LeadPriority,
		type LeadType
	} from '#lib/mock/admin.js';

	type Tab = 'all' | 'new' | 'uncontacted' | 'mine';

	const perPage = 8;

	let q = $state(page.url.searchParams.get('q') ?? '');
	let tab = $state<Tab>('all');
	let typeFilter = $state('all');
	let statusFilter = $state('all');
	let sourceFilter = $state('all');
	let sort = $state('-createdAt');
	let currentPage = $state(1);

	let manualLeads = $state<Lead[]>([]);
	let notice = $state('');

	let dialogOpen = $state(false);
	let manualForm = $state({
		name: '',
		phone: '',
		email: '',
		city: '',
		type: 'BUY_DESIGN',
		priority: 'NORMAL',
		message: ''
	});

	const rows = $derived([...manualLeads, ...seedLeads]);

	const counts = $derived({
		all: rows.length,
		new: rows.filter((lead) => lead.status === 'NEW').length,
		uncontacted: rows.filter((lead) => lead.status === 'NEW' && !lead.firstContactedAt).length,
		mine: rows.filter((lead) => lead.assignedToId === currentUser.id).length
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		const matched = rows.filter((lead) => {
			if (tab === 'new' && lead.status !== 'NEW') return false;
			if (tab === 'uncontacted' && !(lead.status === 'NEW' && !lead.firstContactedAt)) return false;
			if (tab === 'mine' && lead.assignedToId !== currentUser.id) return false;
			if (typeFilter !== 'all' && lead.type !== typeFilter) return false;
			if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
			if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
			if (!term) return true;

			return [lead.name, lead.phone, lead.email, lead.reference, lead.city]
				.filter(Boolean)
				.some((value) => value!.toLowerCase().includes(term));
		});

		return matched.sort((a, b) => {
			if (sort === 'createdAt') return a.createdAt.localeCompare(b.createdAt);
			if (sort === 'nextFollowUpAt') {
				return (a.nextFollowUpAt ?? '9999').localeCompare(b.nextFollowUpAt ?? '9999');
			}
			return b.createdAt.localeCompare(a.createdAt);
		});
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleRows = $derived(filtered.slice((currentPage - 1) * perPage, currentPage * perPage));

	const tabs: { id: Tab; label: string; count: number }[] = $derived([
		{ id: 'all', label: 'Semua', count: counts.all },
		{ id: 'new', label: 'Baru', count: counts.new },
		{ id: 'uncontacted', label: 'Belum dihubungi', count: counts.uncontacted },
		{ id: 'mine', label: 'Milik saya', count: counts.mine }
	]);

	function setTab(next: Tab) {
		tab = next;
		currentPage = 1;
	}

	function resetFilters() {
		q = '';
		tab = 'all';
		typeFilter = 'all';
		statusFilter = 'all';
		sourceFilter = 'all';
		sort = '-createdAt';
		currentPage = 1;
	}

	function exportCsv() {
		const header = [
			'reference',
			'createdAt',
			'type',
			'status',
			'priority',
			'name',
			'phone',
			'email',
			'city',
			'source',
			'estimatedValue'
		];

		const body = filtered.map((lead) => [
			lead.reference,
			lead.createdAt,
			leadTypeLabel[lead.type],
			leadStatusLabel[lead.status],
			leadPriorityLabel[lead.priority],
			lead.name,
			lead.phone,
			lead.email,
			lead.city,
			leadSourceLabel[lead.source],
			lead.estimatedValue
		]);

		downloadCsv(`azetta-lead-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...body]);
		notice = `${filtered.length} lead diekspor ke CSV (demo).`;
	}

	function addManualLead(event: SubmitEvent) {
		event.preventDefault();

		const index = manualLeads.length + 1;
		const newLead: Lead = {
			id: `ld-manual-${index}`,
			reference: `AZT-LD-2611-M${String(index).padStart(4, '0')}`,
			type: manualForm.type as LeadType,
			status: 'NEW',
			priority: manualForm.priority as LeadPriority,
			name: manualForm.name,
			phone: manualForm.phone,
			email: manualForm.email || null,
			city: manualForm.city || null,
			message: manualForm.message || null,
			designId: null,
			designTitle: null,
			source: 'OTHER',
			assignedToId: currentUser.id,
			assignedToName: currentUser.name,
			estimatedValue: null,
			lostReason: null,
			firstContactedAt: null,
			lastContactedAt: null,
			nextFollowUpAt: null,
			createdAt: MOCK_NOW.toISOString(),
			updatedAt: MOCK_NOW.toISOString(),
			landSubmission: null,
			investmentInterest: null,
			attachments: [],
			activities: [
				{
					id: Date.now(),
					type: 'SYSTEM',
					body: 'Lead dibuat manual oleh admin.',
					actorName: currentUser.name,
					createdAt: MOCK_NOW.toISOString()
				}
			],
			customerNote: null
		};

		manualLeads = [newLead, ...manualLeads];
		dialogOpen = false;
		notice = `Lead ${newLead.name} ditambahkan ke daftar (demo).`;
		manualForm = {
			name: '',
			phone: '',
			email: '',
			city: '',
			type: 'BUY_DESIGN',
			priority: 'NORMAL',
			message: ''
		};
	}
</script>

<svelte:head>
	<title>Lead — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="CRM"
	title="Lead"
	description="Semua pengajuan dari situs publik, WhatsApp, dan input manual. Satu lead satu PIC agar tidak ada follow-up ganda."
>
	{#snippet actions()}
		<button class="btn btn-sm" type="button" onclick={() => (dialogOpen = true)}>
			<span class="icon-[mdi--plus] size-4"></span>
			Lead manual
		</button>
		<button class="btn btn-primary btn-sm" type="button" onclick={exportCsv}>
			<span class="icon-[mdi--download-outline] size-4"></span>
			Ekspor CSV
		</button>
	{/snippet}
</PageHeader>

{#if notice}
	<div class="alert alert-info mt-6 border border-brand-line">
		<span class="icon-[mdi--check-circle-outline] size-5"></span>
		<span class="text-sm">{notice}</span>
		<button
			class="btn btn-ghost btn-xs"
			type="button"
			onclick={() => (notice = '')}
			aria-label="Tutup notifikasi"
		>
			<span class="icon-[mdi--close] size-4"></span>
		</button>
	</div>
{/if}

<div class="mt-6 flex flex-wrap gap-1 border-b border-brand-line">
	{#each tabs as item (item.id)}
		<button
			class="flex items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors {tab === item.id
				? 'border-brand-ink font-bold'
				: 'border-transparent text-brand-gray-600 hover:border-brand-gray-300'}"
			type="button"
			aria-pressed={tab === item.id}
			onclick={() => setTab(item.id)}
		>
			{item.label}
			<span
				class="badge badge-sm border-0 tabular-nums {tab === item.id
					? 'bg-brand-ink text-brand-paper'
					: 'bg-base-200'}"
			>
				{item.count}
			</span>
		</button>
	{/each}
</div>

<div class="mt-4 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari nama, nomor, email, atau referensi…"
				aria-label="Cari lead"
				bind:value={q}
				oninput={() => (currentPage = 1)}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter jenis lead"
			bind:value={typeFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua jenis</option>
			{#each Object.entries(leadTypeLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter status lead"
			bind:value={statusFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua status</option>
			{#each Object.entries(leadStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select
			class="select select-sm hidden border-brand-line sm:block"
			aria-label="Filter sumber lead"
			bind:value={sourceFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua sumber</option>
			{#each Object.entries(leadSourceLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select
			class="select select-sm border-brand-line"
			aria-label="Urutkan lead"
			bind:value={sort}
			onchange={() => (currentPage = 1)}
		>
			<option value="-createdAt">Terbaru</option>
			<option value="createdAt">Terlama</option>
			<option value="nextFollowUpAt">Follow-up terdekat</option>
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if visibleRows.length === 0}
		<div class="p-6">
			<EmptyState
				title="Tidak ada lead yang cocok"
				description="Ubah kata kunci atau reset filter untuk melihat seluruh lead."
				icon="icon-[mdi--account-search-outline]"
				actionLabel="Reset filter"
				onaction={resetFilters}
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th class="w-16">Tipe</th>
						<th>Nama</th>
						<th class="hidden md:table-cell">Kota</th>
						<th>Status</th>
						<th class="hidden lg:table-cell">Sumber</th>
						<th class="hidden xl:table-cell">PIC</th>
						<th class="text-right">Waktu</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleRows as lead (lead.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<span
									class="inline-flex size-8 items-center justify-center rounded-lg border border-brand-line text-[11px] font-bold"
									title={leadTypeLabel[lead.type]}
								>
									{leadTypeShort[lead.type]}
								</span>
							</td>
							<td class="min-w-48">
								<a class="font-bold" href="/leads/{lead.id}">{lead.name}</a>
								<div
									class="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-brand-gray-600"
								>
									<span class="font-mono">{lead.reference}</span>
									{#if lead.priority !== 'NORMAL'}
										<StatusBadge
											label={leadPriorityLabel[lead.priority]}
											tone={leadPriorityTone[lead.priority]}
										/>
									{/if}
								</div>
							</td>
							<td class="hidden text-xs md:table-cell">{lead.city ?? '—'}</td>
							<td>
								<StatusBadge
									label={leadStatusLabel[lead.status]}
									tone={leadStatusTone[lead.status]}
								/>
							</td>
							<td class="hidden text-xs lg:table-cell">{leadSourceLabel[lead.source]}</td>
							<td class="hidden xl:table-cell">
								{#if lead.assignedToName}
									<span class="inline-flex items-center gap-2 text-xs">
										<span
											class="grid size-6 place-items-center rounded-full bg-base-200 text-[10px] font-bold"
										>
											{initials(lead.assignedToName)}
										</span>
										{lead.assignedToName}
									</span>
								{:else}
									<span class="badge badge-outline badge-sm">Belum</span>
								{/if}
							</td>
							<td class="text-right text-xs whitespace-nowrap text-brand-gray-600">
								{formatRelative(lead.createdAt, MOCK_NOW)}
								<span class="hidden xl:block">
									{formatDateTime(lead.createdAt)}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<Pagination
			page={currentPage}
			{pageCount}
			total={filtered.length}
			onchange={(next) => (currentPage = next)}
		/>
	{/if}
</div>

<Modal
	open={dialogOpen}
	title="Tambah lead manual"
	description="Untuk pengajuan yang masuk lewat telepon atau kunjungan langsung."
	onclose={() => (dialogOpen = false)}
>
	<form id="manual-lead-form" class="grid gap-4 sm:grid-cols-2" onsubmit={addManualLead}>
		<fieldset class="fieldset sm:col-span-2">
			<legend class="fieldset-legend">Nama *</legend>
			<input
				class="input w-full"
				required
				placeholder="Nama lengkap"
				bind:value={manualForm.name}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Nomor telepon *</legend>
			<input
				class="input w-full"
				required
				inputmode="tel"
				placeholder="08…"
				bind:value={manualForm.phone}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email</legend>
			<input
				class="input w-full"
				type="email"
				placeholder="nama@email.com"
				bind:value={manualForm.email}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Jenis</legend>
			<select class="select w-full" bind:value={manualForm.type}>
				{#each Object.entries(leadTypeLabel) as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Prioritas</legend>
			<select class="select w-full" bind:value={manualForm.priority}>
				{#each Object.entries(leadPriorityLabel) as [value, label] (value)}
					<option {value}>{label}</option>
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset sm:col-span-2">
			<legend class="fieldset-legend">Kota</legend>
			<input class="input w-full" placeholder="Kota domisili" bind:value={manualForm.city} />
		</fieldset>

		<fieldset class="fieldset sm:col-span-2">
			<legend class="fieldset-legend">Catatan awal</legend>
			<textarea
				class="textarea w-full"
				rows="3"
				placeholder="Kebutuhan atau konteks pembicaraan"
				bind:value={manualForm.message}></textarea>
		</fieldset>
	</form>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (dialogOpen = false)}>
			Batal
		</button>
		<button class="btn btn-primary btn-sm" type="submit" form="manual-lead-form">Simpan lead</button
		>
	{/snippet}
</Modal>
