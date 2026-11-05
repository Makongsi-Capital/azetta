<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- tombol kembali menuju rute unit */
	import { untrack } from 'svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import { formatDate, formatRupiah, slugify } from '#lib/format.js';
	import { designCategoryLabel, designStatusLabel } from '#lib/labels.js';
	import { submitAction } from '#lib/action.js';
	import type { DesignUnit } from '#lib/mock/admin.js';

	interface Props {
		unit?: DesignUnit;
		mode: 'create' | 'edit';
	}

	let { unit, mode }: Props = $props();

	// Nilai awal formulir sengaja diambil sekali; perubahan prop tidak menimpa editan pengguna.
	const initial = untrack(() => unit);

	let title = $state(initial?.title ?? '');
	let slug = $state(initial?.slug ?? '');
	let subtitle = $state(initial?.subtitle ?? '');
	let category = $state<string>(initial?.category ?? 'RESIDENTIAL');
	let style = $state(initial?.style ?? '');
	let status = $state<string>(initial?.status ?? 'DRAFT');
	let featured = $state(initial?.featured ?? false);

	let floors = $state(initial?.floors ?? 1);
	let bedrooms = $state(initial?.bedrooms ?? 0);
	let bathrooms = $state(initial?.bathrooms ?? 0);
	let carports = $state(initial?.carports ?? 0);
	let buildingAreaM2 = $state(initial?.buildingAreaM2 ?? 0);
	let landAreaMinM2 = $state(initial?.landAreaMinM2 ?? 0);

	let priceFrom = $state(initial?.priceFrom ?? 0);
	let estimatedBuildCostMin = $state(initial?.estimatedBuildCostMin ?? 0);
	let estimatedBuildCostMax = $state(initial?.estimatedBuildCostMax ?? 0);

	let description = $state(initial?.description ?? '');
	let cover = $state(initial?.cover ?? '');
	let gallery = $state<string[]>([...(initial?.gallery ?? [])]);
	let newImage = $state('');
	let tags = $state(initial?.tags.join(', ') ?? '');

	let seoTitle = $state(initial?.seoTitle ?? '');
	let seoDescription = $state(initial?.seoDescription ?? '');

	let notice = $state('');
	let errorMessage = $state('');

	const publishChecks = $derived([
		{
			label: 'Deskripsi minimal 50 karakter',
			ok: description.replace(/<[^>]*>/g, '').trim().length >= 50
		},
		{ label: 'Minimal satu media', ok: cover.trim().length > 0 || gallery.length > 0 },
		{ label: 'Judul SEO terisi', ok: seoTitle.trim().length > 0 },
		{ label: 'Deskripsi SEO terisi', ok: seoDescription.trim().length > 0 },
		{ label: 'Harga mulai terisi', ok: priceFrom > 0 }
	]);

	const canPublish = $derived(publishChecks.every((check) => check.ok));

	function fillSlug() {
		slug = slugify(title);
	}

	function addImage() {
		const url = newImage.trim();
		if (!url) return;
		gallery = [...gallery, url];
		newImage = '';
	}

	function removeImage(index: number) {
		gallery = gallery.filter((_, current) => current !== index);
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		notice = '';
		errorMessage = '';

		if (status === 'PUBLISHED' && !canPublish) {
			errorMessage = 'Lengkapi checklist publikasi sebelum menerbitkan unit.';
			return;
		}

		const body = new FormData();
		body.set('title', title);
		body.set('slug', slug || title);
		body.set('subtitle', subtitle);
		body.set('category', category);
		body.set('style', style);
		body.set('status', status);
		body.set('featured', String(featured));
		body.set('floors', String(floors));
		body.set('bedrooms', String(bedrooms));
		body.set('bathrooms', String(bathrooms));
		body.set('carports', String(carports));
		body.set('buildingAreaM2', String(buildingAreaM2));
		body.set('landAreaMinM2', String(landAreaMinM2));
		body.set('priceFrom', String(priceFrom));
		body.set('estimatedBuildCostMin', String(estimatedBuildCostMin));
		body.set('estimatedBuildCostMax', String(estimatedBuildCostMax));
		body.set('description', description);
		body.set('cover', cover);
		for (const url of gallery) body.append('gallery', url);
		body.set('tags', tags);
		body.set('seoTitle', seoTitle);
		body.set('seoDescription', seoDescription);

		const result = await submitAction('save', body);
		if (!result.ok) {
			errorMessage = result.message ?? 'Unit gagal disimpan.';
			return;
		}
		notice = result.message ?? 'Unit disimpan.';
	}
</script>

{#if notice}
	<div class="alert alert-info mt-6 border border-brand-line">
		<span class="icon-[mdi--check-circle-outline] size-5"></span>
		<span class="text-sm">{notice}</span>
	</div>
{/if}

{#if errorMessage}
	<div class="alert alert-error mt-6 border-0">
		<span class="icon-[mdi--alert-circle-outline] size-5"></span>
		<span class="text-sm">{errorMessage}</span>
	</div>
{/if}

<form onsubmit={submit}>
	<div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
		<div class="grid min-w-0 content-start gap-6">
			<Panel title="Informasi dasar">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Judul unit *</legend>
						<input
							class="input w-full"
							required
							placeholder="Contoh: Azetta Residence A1"
							bind:value={title}
						/>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Slug *</legend>
						<div class="join w-full">
							<input
								class="input join-item w-full"
								required
								pattern="[a-z0-9\-]+"
								placeholder="azetta-residence-a1"
								bind:value={slug}
							/>
							<button class="btn join-item" type="button" onclick={fillSlug}>Dari judul</button>
						</div>
						<p class="mt-1 text-xs text-brand-gray-600">
							Huruf kecil, angka, dan tanda hubung. Dipakai pada URL publik.
						</p>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Subjudul</legend>
						<input class="input w-full" placeholder="Satu kalimat pendek" bind:value={subtitle} />
					</fieldset>

					<div class="grid gap-4 sm:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Kategori *</legend>
							<select class="select w-full" bind:value={category}>
								{#each Object.entries(designCategoryLabel) as [value, label] (value)}
									<option {value}>{label}</option>
								{/each}
							</select>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Gaya</legend>
							<input class="input w-full" placeholder="Modern tropis" bind:value={style} />
						</fieldset>
					</div>
				</div>
			</Panel>

			<Panel title="Spesifikasi">
				<div class="grid gap-4 sm:grid-cols-3">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Lantai</legend>
						<input class="input w-full" type="number" min="1" bind:value={floors} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Kamar tidur</legend>
						<input class="input w-full" type="number" min="0" bind:value={bedrooms} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Kamar mandi</legend>
						<input class="input w-full" type="number" min="0" bind:value={bathrooms} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Carport</legend>
						<input class="input w-full" type="number" min="0" bind:value={carports} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Luas bangunan (m²)</legend>
						<input class="input w-full" type="number" min="0" bind:value={buildingAreaM2} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Luas lahan min. (m²)</legend>
						<input class="input w-full" type="number" min="0" bind:value={landAreaMinM2} />
					</fieldset>
				</div>
			</Panel>

			<Panel title="Deskripsi" description="HTML dari editor Tiptap; disanitasi saat disimpan.">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Isi deskripsi</legend>
					<textarea
						class="textarea min-h-40 w-full font-mono text-sm"
						rows="8"
						placeholder="<p>Deskripsi unit…</p>"
						bind:value={description}></textarea>
					<p class="mt-1 text-xs text-brand-gray-600">
						{description.replace(/<[^>]*>/g, '').trim().length} karakter teks · minimal 50 untuk publikasi.
					</p>
				</fieldset>
			</Panel>

			<Panel title="Media">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">URL gambar utama *</legend>
						<input
							class="input w-full font-mono text-xs"
							placeholder="https://…"
							bind:value={cover}
						/>
					</fieldset>

					{#if cover}
						<img
							src={cover}
							alt="Pratinjau gambar utama"
							class="aspect-[16/9] w-full border border-brand-line object-cover"
						/>
					{/if}

					<div>
						<p class="mb-2 text-xs font-bold text-brand-gray-600">Galeri</p>
						<ul class="grid min-w-0 gap-2">
							{#each gallery as url, index (url + index)}
								<li class="flex min-w-0 items-center gap-2 border border-brand-line p-2">
									<img src={url} alt="" class="size-10 shrink-0 object-cover" />
									<span class="min-w-0 flex-1 truncate font-mono text-xs">{url}</span>
									<button
										class="btn btn-ghost btn-xs"
										type="button"
										onclick={() => removeImage(index)}
									>
										Hapus
									</button>
								</li>
							{/each}
						</ul>

						<div class="join mt-2 w-full">
							<input
								class="input join-item w-full font-mono text-xs"
								placeholder="Tempel URL gambar galeri"
								bind:value={newImage}
							/>
							<button class="btn join-item" type="button" onclick={addImage}>Tambah</button>
						</div>
						<p class="mt-1 text-xs text-brand-gray-600">
							Demo: unggahan presign R2 belum tersambung.
						</p>
					</div>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Tag</legend>
						<input
							class="input w-full"
							placeholder="2 lantai, taman, siap huni"
							bind:value={tags}
						/>
						<p class="mt-1 text-xs text-brand-gray-600">Pisahkan dengan koma.</p>
					</fieldset>
				</div>
			</Panel>
		</div>

		<div class="grid min-w-0 content-start gap-6">
			<Panel title="Publikasi">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Status</legend>
						<select class="select w-full" bind:value={status}>
							{#each Object.entries(designStatusLabel) as [value, label] (value)}
								<option {value}>{label}</option>
							{/each}
						</select>
					</fieldset>

					<label class="flex cursor-pointer items-center gap-3 border border-brand-line p-3">
						<input class="checkbox checkbox-sm" type="checkbox" bind:checked={featured} />
						<span>
							<span class="block text-sm font-bold">Tampilkan sebagai unggulan</span>
							<span class="block text-xs text-brand-gray-600">
								Muncul di beranda dan katalog bagian atas.
							</span>
						</span>
					</label>

					<div class="border-t border-brand-line pt-3">
						<p class="text-xs font-bold text-brand-gray-600">Checklist publikasi</p>
						<ul class="mt-2 grid gap-2">
							{#each publishChecks as check (check.label)}
								<li class="flex items-start gap-2 text-xs">
									<span
										class="{check.ok
											? 'icon-[mdi--check-circle] text-success'
											: 'icon-[mdi--circle-outline] text-brand-gray-300'} mt-0.5 size-4 shrink-0"
									></span>
									<span class:text-brand-gray-600={!check.ok}>{check.label}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</Panel>

			<Panel title="Harga">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Harga mulai (Rp)</legend>
						<input
							class="input w-full"
							type="number"
							min="0"
							step="1000000"
							bind:value={priceFrom}
						/>
						<p class="mt-1 text-xs text-brand-gray-600">{formatRupiah(priceFrom)}</p>
					</fieldset>

					<div class="grid gap-4 sm:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Estimasi biaya min.</legend>
							<input
								class="input w-full"
								type="number"
								min="0"
								step="1000000"
								bind:value={estimatedBuildCostMin}
							/>
						</fieldset>
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Estimasi biaya maks.</legend>
							<input
								class="input w-full"
								type="number"
								min="0"
								step="1000000"
								bind:value={estimatedBuildCostMax}
							/>
						</fieldset>
					</div>
				</div>
			</Panel>

			<Panel title="SEO" description="Dapat diturunkan otomatis bila dibiarkan kosong.">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Judul SEO</legend>
						<input
							class="input w-full"
							maxlength="70"
							placeholder="{title || 'Judul unit'} — Azetta"
							bind:value={seoTitle}
						/>
						<p class="mt-1 text-xs text-brand-gray-600">{seoTitle.length}/70 karakter</p>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Deskripsi SEO</legend>
						<textarea
							class="textarea w-full"
							rows="4"
							maxlength="160"
							placeholder="Ringkasan 150–160 karakter"
							bind:value={seoDescription}></textarea>
						<p class="mt-1 text-xs text-brand-gray-600">
							{seoDescription.length}/160 karakter
						</p>
					</fieldset>
				</div>
			</Panel>
		</div>
	</div>

	<div
		class="sticky bottom-0 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 border border-brand-line bg-base-100/95 p-3 backdrop-blur"
	>
		<p class="text-xs text-brand-gray-600">
			{mode === 'create'
				? 'Unit baru disimpan sebagai draf kecuali status diubah.'
				: `Terakhir diperbarui ${initial?.updatedAt ? formatDate(initial.updatedAt) : '—'}.`}
		</p>
		<div class="flex flex-wrap gap-2">
			<a class="btn btn-ghost btn-sm" href="/unit">Kembali</a>
			<button class="btn btn-primary btn-sm" type="submit">
				{mode === 'create' ? 'Simpan unit' : 'Simpan perubahan'}
			</button>
		</div>
	</div>
</form>
