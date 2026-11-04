<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- tombol kembali menuju rute proyek */
	import { untrack } from 'svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import { formatDate, slugify } from '#lib/format.js';
	import { projectStatusLabel } from '#lib/labels.js';
	import type { ProjectItem } from '#lib/mock/admin.js';

	interface Props {
		project?: ProjectItem;
		mode: 'create' | 'edit';
	}

	let { project, mode }: Props = $props();

	// Nilai awal formulir sengaja diambil sekali; perubahan prop tidak menimpa editan pengguna.
	const initial = untrack(() => project);

	let title = $state(initial?.title ?? '');
	let slug = $state(initial?.slug ?? '');
	let summary = $state(initial?.summary ?? '');
	let description = $state(initial?.description ?? '');
	let location = $state(initial?.location ?? '');
	let city = $state(initial?.city ?? '');
	let province = $state(initial?.province ?? '');
	let status = $state<string>(initial?.status ?? 'PLANNED');
	let yearStarted = $state(initial?.yearStarted ?? new Date().getFullYear());
	let yearCompleted = $state(initial?.yearCompleted ?? 0);
	let landAreaM2 = $state(initial?.landAreaM2 ?? 0);
	let unitCount = $state(initial?.unitCount ?? 0);
	let coverImageUrl = $state(initial?.coverImageUrl ?? '');
	let galleryUrls = $state<string[]>([...(initial?.galleryUrls ?? [])]);
	let newImage = $state('');
	let isPublished = $state(initial?.isPublished ?? false);
	let sortOrder = $state(initial?.sortOrder ?? 0);
	let seoTitle = $state(initial?.seoTitle ?? '');
	let seoDescription = $state(initial?.seoDescription ?? '');

	let notice = $state('');
	let errorMessage = $state('');

	const publishChecks = $derived([
		{ label: 'Gambar utama terisi', ok: coverImageUrl.trim().length > 0 },
		{ label: 'Ringkasan terisi', ok: summary.trim().length > 0 },
		{ label: 'Lokasi dan kota terisi', ok: location.trim().length > 0 && city.trim().length > 0 },
		{ label: 'Galeri maksimal 10 gambar', ok: galleryUrls.length <= 10 }
	]);

	const canPublish = $derived(publishChecks.every((check) => check.ok));

	function fillSlug() {
		slug = slugify(title);
	}

	function addImage() {
		const url = newImage.trim();
		if (!url) return;
		galleryUrls = [...galleryUrls, url];
		newImage = '';
	}

	function removeImage(index: number) {
		galleryUrls = galleryUrls.filter((_, current) => current !== index);
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		notice = '';
		errorMessage = '';

		if (isPublished && !canPublish) {
			errorMessage = 'Lengkapi checklist publikasi sebelum menampilkan proyek di situs.';
			return;
		}

		notice =
			mode === 'create'
				? 'Proyek baru disimpan (demo). Data belum dikirim ke API.'
				: 'Perubahan proyek disimpan (demo). Data belum dikirim ke API.';
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
						<legend class="fieldset-legend">Nama proyek *</legend>
						<input
							class="input w-full"
							required
							placeholder="Azetta Residence"
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
								placeholder="azetta-residence"
								bind:value={slug}
							/>
							<button class="btn join-item" type="button" onclick={fillSlug}>Dari judul</button>
						</div>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Ringkasan</legend>
						<textarea
							class="textarea w-full"
							rows="2"
							maxlength="180"
							placeholder="Satu kalimat untuk kartu proyek"
							bind:value={summary}></textarea>
					</fieldset>

					<div class="grid gap-4 sm:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Lokasi *</legend>
							<input class="input w-full" placeholder="Jl. Kaliurang KM 9" bind:value={location} />
						</fieldset>
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Kota *</legend>
							<input class="input w-full" placeholder="Sleman" bind:value={city} />
						</fieldset>
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Provinsi *</legend>
							<input class="input w-full" placeholder="DI Yogyakarta" bind:value={province} />
						</fieldset>
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Status *</legend>
							<select class="select w-full" bind:value={status}>
								{#each Object.entries(projectStatusLabel) as [value, label] (value)}
									<option {value}>{label}</option>
								{/each}
							</select>
						</fieldset>
					</div>
				</div>
			</Panel>

			<Panel title="Deskripsi" description="HTML dari editor Tiptap; disanitasi saat disimpan.">
				<textarea
					class="textarea min-h-40 w-full font-mono text-sm"
					rows="8"
					placeholder="<p>Cerita singkat proyek…</p>"
					bind:value={description}></textarea>
			</Panel>

			<Panel title="Media">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">URL gambar utama *</legend>
						<input
							class="input w-full font-mono text-xs"
							placeholder="https://…"
							bind:value={coverImageUrl}
						/>
					</fieldset>

					{#if coverImageUrl}
						<img
							src={coverImageUrl}
							alt="Pratinjau gambar utama"
							class="aspect-[16/9] w-full border border-brand-line object-cover"
						/>
					{/if}

					<div>
						<p class="mb-2 text-xs font-bold text-brand-gray-600">
							Galeri ({galleryUrls.length}/10)
						</p>
						<ul class="grid min-w-0 gap-2">
							{#each galleryUrls as url, index (url + index)}
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
							<button
								class="btn join-item"
								type="button"
								disabled={galleryUrls.length >= 10}
								onclick={addImage}
							>
								Tambah
							</button>
						</div>
					</div>
				</div>
			</Panel>
		</div>

		<div class="grid min-w-0 content-start gap-6">
			<Panel title="Publikasi">
				<div class="grid gap-4">
					<label class="flex cursor-pointer items-center gap-3 border border-brand-line p-3">
						<input class="checkbox checkbox-sm" type="checkbox" bind:checked={isPublished} />
						<span>
							<span class="block text-sm font-bold">Tampilkan di situs publik</span>
							<span class="block text-xs text-brand-gray-600">
								Wajib punya gambar utama dan ringkasan.
							</span>
						</span>
					</label>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Urutan tampil</legend>
						<input class="input w-full" type="number" min="0" bind:value={sortOrder} />
						<p class="mt-1 text-xs text-brand-gray-600">Angka kecil tampil lebih dulu.</p>
					</fieldset>

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

			<Panel title="Skala proyek">
				<div class="grid gap-4 sm:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Tahun mulai *</legend>
						<input
							class="input w-full"
							type="number"
							min="2000"
							max="2100"
							bind:value={yearStarted}
						/>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Tahun selesai</legend>
						<input
							class="input w-full"
							type="number"
							min="2000"
							max="2100"
							bind:value={yearCompleted}
						/>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Luas lahan (m²)</legend>
						<input class="input w-full" type="number" min="0" bind:value={landAreaM2} />
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Jumlah unit</legend>
						<input class="input w-full" type="number" min="0" bind:value={unitCount} />
					</fieldset>
				</div>
			</Panel>

			<Panel title="SEO">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Judul SEO</legend>
						<input
							class="input w-full"
							maxlength="70"
							placeholder="{title || 'Nama proyek'} — Azetta"
							bind:value={seoTitle}
						/>
					</fieldset>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Deskripsi SEO</legend>
						<textarea
							class="textarea w-full"
							rows="4"
							maxlength="160"
							placeholder="Ringkasan 150–160 karakter"
							bind:value={seoDescription}></textarea>
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
				? 'Proyek baru tersimpan sebagai draf sampai ditampilkan di situs.'
				: `Terakhir diperbarui ${initial?.updatedAt ? formatDate(initial.updatedAt) : '—'}.`}
		</p>
		<div class="flex flex-wrap gap-2">
			<a class="btn btn-ghost btn-sm" href="/proyek">Kembali</a>
			<button class="btn btn-primary btn-sm" type="submit">
				{mode === 'create' ? 'Simpan proyek' : 'Simpan perubahan'}
			</button>
		</div>
	</div>
</form>
