<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- tautan ke halaman permohonan hapus */
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { downloadCsv, formatDateTime, initials } from '#lib/format.js';
	import { currentUser, customers } from '#lib/mock/admin.js';

	const perPage = 10;

	let q = $state('');
	let verifiedFilter = $state('all');
	let currentPage = $state(1);
	let notice = $state('');

	const counts = $derived({
		total: customers.length,
		verified: customers.filter((customer) => customer.emailVerified).length,
		unverified: customers.filter((customer) => !customer.emailVerified).length,
		banned: customers.filter((customer) => customer.banned).length
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return customers.filter((customer) => {
			if (verifiedFilter === 'verified' && !customer.emailVerified) return false;
			if (verifiedFilter === 'unverified' && customer.emailVerified) return false;
			if (!term) return true;

			return [customer.name, customer.email, customer.phone ?? '', customer.city ?? '']
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term));
		});
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleCustomers = $derived(
		filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
	);

	function exportCsv() {
		const header = [
			'nama',
			'email',
			'telepon',
			'kota',
			'terverifikasi',
			'status',
			'jumlahLead',
			'terdaftar'
		];

		const body = filtered.map((customer) => [
			customer.name,
			customer.email,
			customer.phone,
			customer.city,
			customer.emailVerified ? 'ya' : 'belum',
			customer.banned ? 'nonaktif' : 'aktif',
			customer.leadCount,
			customer.createdAt
		]);

		downloadCsv(`azetta-pelanggan-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...body]);
		notice = `${filtered.length} pelanggan diekspor ke CSV (demo).`;
	}

	function resetFilters() {
		q = '';
		verifiedFilter = 'all';
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Pelanggan — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Akses"
	title="Pelanggan"
	description="Daftar akun publik yang terdaftar di situs. Halaman ini bersifat baca saja; permintaan hapus data ditangani terpisah."
>
	{#snippet actions()}
		{#if currentUser.role === 'super_admin'}
			<button class="btn btn-primary btn-sm" type="button" onclick={exportCsv}>
				<span class="icon-[mdi--download-outline] size-4"></span>
				Ekspor CSV
			</button>
		{/if}
	{/snippet}
</PageHeader>

{#if currentUser.role !== 'super_admin'}
	<div class="mt-6">
		<Panel title="Akses terbatas">
			<p class="text-sm text-brand-gray-600">
				Daftar pelanggan hanya dapat dibuka oleh super admin. Data pelanggan tidak dapat diubah dari
				panel.
			</p>
		</Panel>
	</div>
{:else}
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
		<StatCard label="Total akun" value={counts.total} icon="icon-[mdi--account-group-outline]" />
		<StatCard
			label="Email terverifikasi"
			value={counts.verified}
			icon="icon-[mdi--email-check-outline]"
			tone="success"
		/>
		<StatCard
			label="Belum verifikasi"
			value={counts.unverified}
			icon="icon-[mdi--email-alert-outline]"
			tone="warning"
		/>
		<StatCard
			label="Diblokir"
			value={counts.banned}
			icon="icon-[mdi--account-cancel-outline]"
			tone="danger"
		/>
	</section>

	<div class="mt-6 border border-brand-line bg-white">
		<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
			<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
				<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
				<input
					type="search"
					class="grow"
					placeholder="Cari nama, email, telepon, atau kota…"
					aria-label="Cari pelanggan"
					bind:value={q}
					oninput={() => (currentPage = 1)}
				/>
			</label>

			<select
				class="select select-sm border-brand-line"
				aria-label="Filter verifikasi email"
				bind:value={verifiedFilter}
				onchange={() => (currentPage = 1)}
			>
				<option value="all">Semua akun</option>
				<option value="verified">Terverifikasi</option>
				<option value="unverified">Belum verifikasi</option>
			</select>

			<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
		</div>

		{#if visibleCustomers.length === 0}
			<div class="p-6">
				<EmptyState
					title="Tidak ada pelanggan yang cocok"
					description="Ubah kata kunci atau filter verifikasi."
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
							<th>Pelanggan</th>
							<th class="hidden md:table-cell">Kontak</th>
							<th class="hidden lg:table-cell">Kota</th>
							<th>Lead</th>
							<th>Verifikasi</th>
							<th class="hidden xl:table-cell">Terdaftar</th>
							<th class="hidden xl:table-cell">Login terakhir</th>
						</tr>
					</thead>
					<tbody>
						{#each visibleCustomers as customer (customer.id)}
							<tr class="border-brand-line hover:bg-base-200/50">
								<td>
									<div class="flex items-center gap-3">
										<span
											class="grid size-9 shrink-0 place-items-center rounded-full bg-base-200 text-[11px] font-bold"
										>
											{initials(customer.name)}
										</span>
										<div class="min-w-0">
											<p class="truncate text-sm font-bold">{customer.name}</p>
											<p class="truncate text-[11px] text-brand-gray-600">{customer.email}</p>
										</div>
									</div>
								</td>
								<td class="hidden text-xs whitespace-nowrap md:table-cell">
									{customer.phone ?? '—'}
									{#if customer.banned}
										<span class="badge badge-error badge-xs ml-1 border-0">Diblokir</span>
									{/if}
								</td>
								<td class="hidden text-xs lg:table-cell">{customer.city ?? '—'}</td>
								<td class="text-xs tabular-nums">{customer.leadCount}</td>
								<td>
									<StatusBadge
										label={customer.emailVerified ? 'Terverifikasi' : 'Belum'}
										tone={customer.emailVerified ? 'badge-success' : 'badge-warning'}
									/>
								</td>
								<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 xl:table-cell">
									{formatDateTime(customer.createdAt)}
								</td>
								<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 xl:table-cell">
									{customer.lastLoginAt ? formatDateTime(customer.lastLoginAt) : 'Belum pernah'}
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

	<p class="mt-3 text-xs text-brand-gray-600">
		Data pelanggan hanya dapat dibaca. Untuk penghapusan akun, buka
		<a class="link link-hover font-bold" href="/permohonan-hapus">Permohonan hapus</a>.
	</p>
{/if}
