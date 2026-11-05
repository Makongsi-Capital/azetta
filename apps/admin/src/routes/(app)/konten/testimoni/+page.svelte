<script lang="ts">
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import Modal from '#lib/components/admin/Modal.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import { formatDateTime, initials } from '#lib/format.js';
	import { submitAction } from '#lib/action.js';
	import type { TestimonialItem } from '#lib/mock/admin.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const MOCK_NOW = new Date();
	let items = $state<TestimonialItem[]>([...data.testimonials]);
	let q = $state('');
	let publishFilter = $state('all');
	let notice = $state('');

	let dialogOpen = $state(false);
	let editingId = $state<number | null>(null);
	let form = $state({
		name: '',
		role: '',
		projectName: '',
		quote: '',
		avatarUrl: '',
		isPublished: false,
		sortOrder: 1
	});

	let deleteTarget = $state<TestimonialItem | null>(null);

	const counts = $derived({
		total: items.length,
		published: items.filter((item) => item.isPublished).length,
		hidden: items.filter((item) => !item.isPublished).length,
		projects: new Set(items.map((item) => item.projectName).filter(Boolean)).size
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return items
			.filter((item) => {
				if (publishFilter === 'published' && !item.isPublished) return false;
				if (publishFilter === 'hidden' && item.isPublished) return false;
				if (!term) return true;

				return [item.name, item.role ?? '', item.projectName ?? '', item.quote]
					.filter(Boolean)
					.some((value) => value.toLowerCase().includes(term));
			})
			.sort((a, b) => a.sortOrder - b.sortOrder);
	});

	function openCreate() {
		editingId = null;
		form = {
			name: '',
			role: '',
			projectName: '',
			quote: '',
			avatarUrl: '',
			isPublished: false,
			sortOrder: items.length + 1
		};
		dialogOpen = true;
	}

	function openEdit(item: TestimonialItem) {
		editingId = item.id;
		form = {
			name: item.name,
			role: item.role ?? '',
			projectName: item.projectName ?? '',
			quote: item.quote,
			avatarUrl: item.avatarUrl ?? '',
			isPublished: item.isPublished,
			sortOrder: item.sortOrder
		};
		dialogOpen = true;
	}

	async function save(event: SubmitEvent) {
		event.preventDefault();

		const payload = {
			name: form.name,
			role: form.role || null,
			projectName: form.projectName || null,
			quote: form.quote,
			avatarUrl: form.avatarUrl || null,
			isPublished: form.isPublished,
			sortOrder: form.sortOrder,
			updatedAt: MOCK_NOW.toISOString()
		};

		const result =
			editingId === null
				? await submitAction('create', {
						...payload,
						role: form.role,
						projectName: form.projectName,
						avatarUrl: form.avatarUrl,
						isPublished: String(form.isPublished)
					})
				: await submitAction('update', {
						id: editingId,
						...payload,
						role: form.role,
						projectName: form.projectName,
						avatarUrl: form.avatarUrl,
						isPublished: String(form.isPublished)
					});

		if (!result.ok) {
			notice = result.message ?? 'Testimoni gagal disimpan.';
			return;
		}

		if (editingId === null) {
			const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
			items = [...items, { id: nextId, ...payload }];
		} else {
			items = items.map((item) => (item.id === editingId ? { ...item, ...payload } : item));
		}

		notice = result.message ?? 'Testimoni disimpan.';
		dialogOpen = false;
	}

	async function togglePublished(item: TestimonialItem) {
		const result = await submitAction('toggle', {
			id: item.id,
			isPublished: String(!item.isPublished)
		});
		if (!result.ok) {
			notice = result.message ?? 'Status testimoni gagal diubah.';
			return;
		}

		items = items.map((current) =>
			current.id === item.id
				? { ...current, isPublished: !current.isPublished, updatedAt: MOCK_NOW.toISOString() }
				: current
		);
		notice =
			result.message ??
			`Testimoni ${item.name} ${item.isPublished ? 'disembunyikan' : 'diterbitkan'}.`;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		const target = deleteTarget;
		const result = await submitAction('delete', { id: target.id });
		if (!result.ok) {
			notice = result.message ?? 'Testimoni gagal dihapus.';
			return;
		}
		items = items.filter((item) => item.id !== target.id);
		notice = `Testimoni ${target.name} dihapus.`;
		deleteTarget = null;
	}

	function resetFilters() {
		q = '';
		publishFilter = 'all';
	}
</script>

<svelte:head>
	<title>Testimoni — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Konten"
	title="Testimoni"
	description="Testimoni tampil di beranda dan halaman proyek. Hanya testimoni terbit yang ditampilkan."
>
	{#snippet actions()}
		<button class="btn btn-primary btn-sm" type="button" onclick={openCreate}>
			<span class="icon-[mdi--plus] size-4"></span>
			Tambah testimoni
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
	<StatCard label="Total" value={counts.total} icon="icon-[mdi--comment-quote-outline]" />
	<StatCard
		label="Terbit"
		value={counts.published}
		icon="icon-[mdi--check-decagram-outline]"
		tone="success"
	/>
	<StatCard label="Disembunyikan" value={counts.hidden} icon="icon-[mdi--eye-off-outline]" />
	<StatCard
		label="Proyek tercakup"
		value={counts.projects}
		icon="icon-[mdi--office-building-outline]"
	/>
</section>

<div class="mt-4 flex flex-wrap items-center gap-2 border border-brand-line bg-white p-3">
	<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
		<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
		<input
			type="search"
			class="grow"
			placeholder="Cari nama, proyek, atau kutipan…"
			aria-label="Cari testimoni"
			bind:value={q}
		/>
	</label>

	<select
		class="select select-sm border-brand-line"
		aria-label="Filter publikasi testimoni"
		bind:value={publishFilter}
	>
		<option value="all">Semua</option>
		<option value="published">Terbit</option>
		<option value="hidden">Disembunyikan</option>
	</select>

	<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
</div>

{#if filtered.length === 0}
	<div class="mt-6">
		<EmptyState
			title="Belum ada testimoni yang cocok"
			description="Ubah filter atau tambahkan testimoni baru."
			icon="icon-[mdi--comment-quote-outline]"
			actionLabel="Tambah testimoni"
			onaction={openCreate}
		/>
	</div>
{:else}
	<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each filtered as item (item.id)}
			<article class="flex flex-col border border-brand-line bg-white p-5">
				<div class="flex items-start justify-between gap-3">
					<span
						class="badge badge-sm border-0 {item.isPublished ? 'badge-success' : 'badge-ghost'}"
					>
						{item.isPublished ? 'Terbit' : 'Disembunyikan'}
					</span>
					<span class="text-[11px] text-brand-gray-500 tabular-nums">#{item.sortOrder}</span>
				</div>

				<blockquote class="mt-3 flex-1 border-l-2 border-brand-line pl-3 text-sm">
					“{item.quote}”
				</blockquote>

				<div class="mt-4 flex items-center gap-3 border-t border-brand-line pt-4">
					{#if item.avatarUrl}
						<img src={item.avatarUrl} alt="" class="size-9 rounded-full object-cover" />
					{:else}
						<span
							class="grid size-9 place-items-center rounded-full bg-base-200 text-[11px] font-bold"
						>
							{initials(item.name)}
						</span>
					{/if}
					<div class="min-w-0">
						<p class="truncate text-sm font-bold">{item.name}</p>
						<p class="truncate text-xs text-brand-gray-600">
							{item.role ?? 'Tanpa peran'}{#if item.projectName}
								· {item.projectName}{/if}
						</p>
					</div>
				</div>

				<p class="mt-3 text-[11px] text-brand-gray-600">
					Diperbarui {formatDateTime(item.updatedAt)}
				</p>

				<div class="mt-4 flex flex-wrap gap-1">
					<button class="btn btn-outline btn-xs" type="button" onclick={() => openEdit(item)}>
						Edit
					</button>
					<button class="btn btn-ghost btn-xs" type="button" onclick={() => togglePublished(item)}>
						{item.isPublished ? 'Sembunyikan' : 'Terbitkan'}
					</button>
					<button
						class="btn btn-ghost btn-xs ml-auto text-error"
						type="button"
						onclick={() => (deleteTarget = item)}
					>
						Hapus
					</button>
				</div>
			</article>
		{/each}
	</div>
{/if}

<Modal
	open={dialogOpen}
	title={editingId === null ? 'Tambah testimoni' : 'Ubah testimoni'}
	description="Kutipan ditampilkan apa adanya; hindari data pribadi yang sensitif."
	onclose={() => (dialogOpen = false)}
>
	<form id="testimonial-form" class="grid gap-4" onsubmit={save}>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Nama *</legend>
			<input class="input w-full" required bind:value={form.name} />
		</fieldset>

		<div class="grid gap-4 sm:grid-cols-2">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Peran</legend>
				<input class="input w-full" placeholder="Pembeli unit" bind:value={form.role} />
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Proyek</legend>
				<input class="input w-full" placeholder="Azetta Residence" bind:value={form.projectName} />
			</fieldset>
		</div>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Kutipan *</legend>
			<textarea class="textarea min-h-28 w-full" required rows="4" bind:value={form.quote}
			></textarea>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">URL avatar</legend>
			<input
				class="input w-full font-mono text-xs"
				placeholder="https://… (opsional)"
				bind:value={form.avatarUrl}
			/>
		</fieldset>

		<div class="grid gap-4 sm:grid-cols-2">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Nomor urut</legend>
				<input class="input w-full" type="number" min="1" bind:value={form.sortOrder} />
			</fieldset>
			<label class="flex cursor-pointer items-center gap-3 border border-brand-line p-3">
				<input class="checkbox checkbox-sm" type="checkbox" bind:checked={form.isPublished} />
				<span class="text-sm">Terbitkan</span>
			</label>
		</div>
	</form>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (dialogOpen = false)}>
			Batal
		</button>
		<button class="btn btn-primary btn-sm" type="submit" form="testimonial-form">
			{editingId === null ? 'Tambah' : 'Simpan'}
		</button>
	{/snippet}
</Modal>

<Modal
	open={deleteTarget !== null}
	title="Hapus testimoni?"
	description="Tindakan ini tidak dapat dibatalkan."
	onclose={() => (deleteTarget = null)}
>
	<p class="text-sm">
		Hapus testimoni dari <span class="font-bold">{deleteTarget?.name}</span>?
	</p>

	{#snippet footer()}
		<button class="btn btn-ghost btn-sm" type="button" onclick={() => (deleteTarget = null)}>
			Batal
		</button>
		<button class="btn btn-error btn-sm" type="button" onclick={confirmDelete}>Hapus</button>
	{/snippet}
</Modal>
