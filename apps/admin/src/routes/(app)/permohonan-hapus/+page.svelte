<script lang="ts">
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import Modal from '#lib/components/admin/Modal.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { formatDateTime, initials } from '#lib/format.js';
	import { deletionStatusLabel, deletionStatusTone } from '#lib/labels.js';
	import {
		currentUser,
		deletionRequests as seedRequests,
		MOCK_NOW,
		type DeletionRequest
	} from '#lib/mock/admin.js';

	let items = $state<DeletionRequest[]>([...seedRequests]);
	let statusFilter = $state('all');
	let q = $state('');
	let notice = $state('');

	let processTarget = $state<DeletionRequest | null>(null);
	let processAction = $state<'COMPLETED' | 'REJECTED'>('COMPLETED');
	let processNote = $state('');

	const counts = $derived({
		pending: items.filter((item) => item.status === 'PENDING').length,
		completed: items.filter((item) => item.status === 'COMPLETED').length,
		rejected: items.filter((item) => item.status === 'REJECTED').length,
		total: items.length
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return items
			.filter((item) => {
				if (statusFilter !== 'all' && item.status !== statusFilter) return false;
				if (!term) return true;
				return [item.name, item.email, item.reason ?? '']
					.filter(Boolean)
					.some((value) => value.toLowerCase().includes(term));
			})
			.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
	});

	function openProcess(item: DeletionRequest, action: 'COMPLETED' | 'REJECTED') {
		processTarget = item;
		processAction = action;
		processNote = '';
	}

	function submitProcess(event: SubmitEvent) {
		event.preventDefault();
		if (!processTarget) return;

		items = items.map((item) =>
			item.id === processTarget?.id
				? {
						...item,
						status: processAction,
						handledAt: MOCK_NOW.toISOString(),
						handledByName: currentUser.name,
						note: processNote.trim() || null
					}
				: item
		);

		notice = `Permohonan ${processTarget.name} ditandai ${deletionStatusLabel[processAction].toLowerCase()} (demo).`;
		processTarget = null;
	}

	function resetFilters() {
		statusFilter = 'all';
		q = '';
	}
</script>

<svelte:head>
	<title>Permohonan hapus — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Privasi"
	title="Permohonan hapus akun"
	description="Tinjau permintaan penghapusan data pelanggan. Tidak ada penghapusan otomatis; akun tetap aktif sampai diproses."
/>

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

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard label="Menunggu" value={counts.pending} icon="icon-[mdi--timer-sand]" tone="warning" />
	<StatCard
		label="Selesai"
		value={counts.completed}
		icon="icon-[mdi--check-circle-outline]"
		tone="success"
	/>
	<StatCard
		label="Ditolak"
		value={counts.rejected}
		icon="icon-[mdi--close-circle-outline]"
		tone="danger"
	/>
	<StatCard
		label="Total permohonan"
		value={counts.total}
		icon="icon-[mdi--account-remove-outline]"
	/>
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari nama, email, atau alasan…"
				aria-label="Cari permohonan"
				bind:value={q}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter status"
			bind:value={statusFilter}
		>
			<option value="all">Semua status</option>
			{#each Object.entries(deletionStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if filtered.length === 0}
		<div class="p-6">
			<EmptyState
				title="Tidak ada permohonan"
				description="Belum ada permohonan hapus akun yang cocok dengan filter."
				icon="icon-[mdi--shield-check-outline]"
				actionLabel="Reset filter"
				onaction={resetFilters}
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Pemohon</th>
						<th>Alasan</th>
						<th class="hidden md:table-cell">Diajukan</th>
						<th>Status</th>
						<th class="hidden lg:table-cell">Ditangani</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as item (item.id)}
						<tr class="border-brand-line align-top hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-3">
									<span
										class="grid size-9 shrink-0 place-items-center rounded-full bg-base-200 text-[11px] font-bold"
									>
										{initials(item.name)}
									</span>
									<div class="min-w-0">
										<p class="truncate text-sm font-bold">{item.name}</p>
										<p class="truncate text-[11px] text-brand-gray-600">{item.email}</p>
									</div>
								</div>
							</td>
							<td class="max-w-sm text-xs text-brand-gray-600">
								{item.reason ?? 'Tanpa alasan'}
							</td>
							<td class="hidden text-xs whitespace-nowrap md:table-cell">
								{formatDateTime(item.requestedAt)}
							</td>
							<td>
								<StatusBadge
									label={deletionStatusLabel[item.status]}
									tone={deletionStatusTone[item.status]}
								/>
							</td>
							<td class="hidden text-xs lg:table-cell">
								{#if item.handledAt}
									<span class="block">{formatDateTime(item.handledAt)}</span>
									<span class="block text-brand-gray-600">{item.handledByName}</span>
								{:else}
									<span class="text-brand-gray-600">—</span>
								{/if}
							</td>
							<td class="text-right">
								{#if item.status === 'PENDING'}
									<div class="flex justify-end gap-1">
										<button
											class="btn btn-outline btn-xs"
											type="button"
											onclick={() => openProcess(item, 'COMPLETED')}
										>
											Tandai selesai
										</button>
										<button
											class="btn btn-ghost btn-xs text-error"
											type="button"
											onclick={() => openProcess(item, 'REJECTED')}
										>
											Tolak
										</button>
									</div>
								{:else if item.note}
									<p class="max-w-48 text-left text-[11px] text-brand-gray-600">
										{item.note}
									</p>
								{:else}
									<span class="text-xs text-brand-gray-500">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<p class="mt-3 text-xs text-brand-gray-600">
	Catatan internal disimpan bersama permohonan dan tercatat di audit log. Data transaksi yang wajib
	diarsipkan tetap dipertahankan.
</p>

<Modal
	open={processTarget !== null}
	title={processAction === 'COMPLETED' ? 'Tandai permohonan selesai' : 'Tolak permohonan'}
	description={processTarget
		? `${processTarget.name} · ${processTarget.email}`
		: 'Tinjau permohonan sebelum menyimpan keputusan.'}
	onclose={() => (processTarget = null)}
>
	<form id="deletion-process-form" class="grid gap-4" onsubmit={submitProcess}>
		{#if processAction === 'REJECTED'}
			<div class="alert alert-warning border-0 text-sm">
				<span class="icon-[mdi--alert-outline] size-5"></span>
				<span>Permohonan ditolak; akun tetap aktif dan pengguna dapat mengajukan ulang.</span>
			</div>
		{:else}
			<div class="alert alert-info border-0 text-sm">
				<span class="icon-[mdi--information-outline] size-5"></span>
				<span>Tandai selesai setelah data pribadi ditinjau sesuai kebijakan retensi.</span>
			</div>
		{/if}

		{#if processTarget?.reason}
			<div class="border border-brand-line p-3 text-sm">
				<p class="text-xs font-bold text-brand-gray-600">Alasan pemohon</p>
				<p class="mt-1">{processTarget.reason}</p>
			</div>
		{/if}

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Catatan internal</legend>
			<textarea
				class="textarea min-h-24 w-full"
				rows="3"
				placeholder="Contoh: data dihapus kecuali catatan transaksi sesuai kewajiban arsip."
				bind:value={processNote}></textarea>
		</fieldset>
	</form>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (processTarget = null)}>
			Batal
		</button>
		<button
			class="btn btn-sm {processAction === 'COMPLETED' ? 'btn-primary' : 'btn-error'}"
			type="submit"
			form="deletion-process-form"
		>
			{processAction === 'COMPLETED' ? 'Tandai selesai' : 'Tolak permohonan'}
		</button>
	{/snippet}
</Modal>
