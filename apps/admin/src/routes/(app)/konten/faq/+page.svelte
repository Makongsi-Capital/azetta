<script lang="ts">
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import Modal from '#lib/components/admin/Modal.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import { formatDateTime } from '#lib/format.js';
	import { submitAction } from '#lib/action.js';
	import type { FaqItem } from '#lib/mock/admin.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const MOCK_NOW = new Date();
	let items = $state<FaqItem[]>([...data.faqs]);
	let q = $state('');
	let categoryFilter = $state('all');
	let notice = $state('');

	let dialogOpen = $state(false);
	let editingId = $state<number | null>(null);
	let form = $state({
		question: '',
		answer: '',
		category: 'umum',
		sortOrder: 1,
		isActive: true
	});

	let deleteTarget = $state<FaqItem | null>(null);

	const categories = $derived([...new Set(items.map((item) => item.category))].sort());

	const counts = $derived({
		total: items.length,
		active: items.filter((item) => item.isActive).length,
		inactive: items.filter((item) => !item.isActive).length,
		categories: categories.length
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return items
			.filter((item) => {
				if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
				if (!term) return true;
				return (
					item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)
				);
			})
			.sort((a, b) => a.sortOrder - b.sortOrder);
	});

	function openCreate() {
		editingId = null;
		form = {
			question: '',
			answer: '',
			category: categoryFilter === 'all' ? 'umum' : categoryFilter,
			sortOrder: items.length + 1,
			isActive: true
		};
		dialogOpen = true;
	}

	function openEdit(item: FaqItem) {
		editingId = item.id;
		form = {
			question: item.question,
			answer: item.answer,
			category: item.category,
			sortOrder: item.sortOrder,
			isActive: item.isActive
		};
		dialogOpen = true;
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();

		const result =
			editingId === null
				? await submitAction('create', {
						question: form.question,
						answer: form.answer,
						category: form.category,
						sortOrder: form.sortOrder,
						isActive: String(form.isActive)
					})
				: await submitAction('update', {
						id: editingId,
						question: form.question,
						answer: form.answer,
						category: form.category,
						sortOrder: form.sortOrder,
						isActive: String(form.isActive)
					});

		if (!result.ok) {
			notice = result.message ?? 'FAQ gagal disimpan.';
			return;
		}

		if (editingId === null) {
			const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
			items = [...items, { id: nextId, ...form, updatedAt: MOCK_NOW.toISOString() }];
		} else {
			items = items.map((item) =>
				item.id === editingId ? { ...item, ...form, updatedAt: MOCK_NOW.toISOString() } : item
			);
		}

		notice = result.message ?? 'FAQ disimpan.';
		dialogOpen = false;
	}

	async function toggleActive(item: FaqItem) {
		const result = await submitAction('toggle', {
			id: item.id,
			isActive: String(!item.isActive)
		});
		if (!result.ok) {
			notice = result.message ?? 'Status FAQ gagal diubah.';
			return;
		}

		items = items.map((current) =>
			current.id === item.id
				? { ...current, isActive: !current.isActive, updatedAt: MOCK_NOW.toISOString() }
				: current
		);
		notice = result.message ?? 'Status FAQ diperbarui.';
	}

	async function move(item: FaqItem, direction: -1 | 1) {
		const ordered = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
		const index = ordered.findIndex((current) => current.id === item.id);
		const target = ordered[index + direction];
		if (!target) return;

		const [first, second] = await Promise.all([
			submitAction('update', {
				id: item.id,
				question: item.question,
				answer: item.answer,
				category: item.category,
				sortOrder: target.sortOrder,
				isActive: String(item.isActive)
			}),
			submitAction('update', {
				id: target.id,
				question: target.question,
				answer: target.answer,
				category: target.category,
				sortOrder: item.sortOrder,
				isActive: String(target.isActive)
			})
		]);
		if (!first.ok || !second.ok) {
			notice = first.message ?? second.message ?? 'Urutan FAQ gagal disimpan.';
			return;
		}

		items = items.map((current) => {
			if (current.id === item.id) return { ...current, sortOrder: target.sortOrder };
			if (current.id === target.id) return { ...current, sortOrder: item.sortOrder };
			return current;
		});
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		const target = deleteTarget;
		const result = await submitAction('delete', { id: target.id });
		if (!result.ok) {
			notice = result.message ?? 'FAQ gagal dihapus.';
			return;
		}
		items = items.filter((item) => item.id !== target.id);
		notice = `FAQ "${target.question}" dihapus.`;
		deleteTarget = null;
	}

	function resetFilters() {
		q = '';
		categoryFilter = 'all';
	}
</script>

<svelte:head>
	<title>FAQ — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Konten"
	title="Pertanyaan umum"
	description="Kelola FAQ publik. Hanya entri aktif yang tampil di situs, diurutkan sesuai nomor urut."
>
	{#snippet actions()}
		<button class="btn btn-primary btn-sm" type="button" onclick={openCreate}>
			<span class="icon-[mdi--plus] size-4"></span>
			Tambah FAQ
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

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard label="Total FAQ" value={counts.total} icon="icon-[mdi--help-circle-outline]" />
	<StatCard
		label="Aktif"
		value={counts.active}
		icon="icon-[mdi--check-circle-outline]"
		tone="success"
	/>
	<StatCard label="Nonaktif" value={counts.inactive} icon="icon-[mdi--eye-off-outline]" />
	<StatCard label="Kategori" value={counts.categories} icon="icon-[mdi--tag-multiple-outline]" />
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari pertanyaan atau jawaban…"
				aria-label="Cari FAQ"
				bind:value={q}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter kategori FAQ"
			bind:value={categoryFilter}
		>
			<option value="all">Semua kategori</option>
			{#each categories as category (category)}
				<option value={category}>{category}</option>
			{/each}
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if filtered.length === 0}
		<div class="p-6">
			<EmptyState
				title="Belum ada FAQ yang cocok"
				description="Ubah filter atau tambahkan pertanyaan baru."
				icon="icon-[mdi--comment-question-outline]"
				actionLabel="Tambah FAQ"
				onaction={openCreate}
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th class="w-20">Urutan</th>
						<th>Pertanyaan</th>
						<th class="hidden md:table-cell">Kategori</th>
						<th class="hidden lg:table-cell">Diperbarui</th>
						<th>Status</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as item, index (item.id)}
						<tr class="border-brand-line align-top hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-1">
									<span class="w-5 text-xs font-bold tabular-nums">{index + 1}</span>
									<button
										class="btn btn-ghost btn-xs btn-square"
										type="button"
										disabled={index === 0}
										aria-label="Naikkan urutan"
										onclick={() => move(item, -1)}
									>
										<span class="icon-[mdi--arrow-up] size-3.5"></span>
									</button>
									<button
										class="btn btn-ghost btn-xs btn-square"
										type="button"
										disabled={index === filtered.length - 1}
										aria-label="Turunkan urutan"
										onclick={() => move(item, 1)}
									>
										<span class="icon-[mdi--arrow-down] size-3.5"></span>
									</button>
								</div>
							</td>
							<td class="max-w-md">
								<p class="font-bold">{item.question}</p>
								<p class="mt-1 line-clamp-2 text-xs text-brand-gray-600">{item.answer}</p>
							</td>
							<td class="hidden md:table-cell">
								<span class="badge badge-outline badge-sm">{item.category}</span>
							</td>
							<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 lg:table-cell">
								{formatDateTime(item.updatedAt)}
							</td>
							<td>
								<button
									class="badge badge-sm border-0 {item.isActive ? 'badge-success' : 'badge-ghost'}"
									type="button"
									onclick={() => toggleActive(item)}
									title="Ubah status tampil"
								>
									{item.isActive ? 'Aktif' : 'Nonaktif'}
								</button>
							</td>
							<td class="text-right">
								<div class="flex justify-end gap-1">
									<button
										class="btn btn-outline btn-xs"
										type="button"
										onclick={() => openEdit(item)}
									>
										Edit
									</button>
									<button
										class="btn btn-ghost btn-xs text-error"
										type="button"
										onclick={() => (deleteTarget = item)}
									>
										Hapus
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<Modal
	open={dialogOpen}
	title={editingId === null ? 'Tambah FAQ' : 'Ubah FAQ'}
	description="Jawaban berupa teks biasa, bukan HTML."
	onclose={() => (dialogOpen = false)}
>
	<form id="faq-form" class="grid gap-4" onsubmit={save}>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Pertanyaan *</legend>
			<input class="input w-full" required bind:value={form.question} />
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Jawaban *</legend>
			<textarea class="textarea min-h-28 w-full" required rows="5" bind:value={form.answer}
			></textarea>
		</fieldset>

		<div class="grid gap-4 sm:grid-cols-2">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Kategori *</legend>
				<input class="input w-full" required list="faq-categories" bind:value={form.category} />
				<datalist id="faq-categories">
					{#each categories as category (category)}
						<option value={category}></option>
					{/each}
				</datalist>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Nomor urut</legend>
				<input class="input w-full" type="number" min="1" bind:value={form.sortOrder} />
			</fieldset>
		</div>

		<label class="flex cursor-pointer items-center gap-3 border border-brand-line p-3">
			<input class="checkbox checkbox-sm" type="checkbox" bind:checked={form.isActive} />
			<span class="text-sm">Tampilkan di situs publik</span>
		</label>
	</form>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (dialogOpen = false)}>
			Batal
		</button>
		<button class="btn btn-primary btn-sm" type="submit" form="faq-form">
			{editingId === null ? 'Tambah' : 'Simpan'}
		</button>
	{/snippet}
</Modal>

<Modal
	open={deleteTarget !== null}
	title="Hapus FAQ?"
	description="Tindakan ini tidak dapat dibatalkan."
	onclose={() => (deleteTarget = null)}
>
	<p class="text-sm">
		Hapus pertanyaan <span class="font-bold">“{deleteTarget?.question}”</span> dari daftar FAQ?
	</p>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (deleteTarget = null)}>
			Batal
		</button>
		<button class="btn btn-error btn-sm" type="button" onclick={confirmDelete}>Hapus</button>
	{/snippet}
</Modal>
