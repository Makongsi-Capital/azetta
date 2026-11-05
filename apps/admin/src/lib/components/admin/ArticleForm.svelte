<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve, svelte/no-at-html-tags -- tombol kembali menuju daftar artikel; pratinjau merender HTML dari editor lokal */
	import { tick, untrack } from 'svelte';
	import MediaUpload from '#lib/components/admin/MediaUpload.svelte';
	import Panel from '#lib/components/admin/Panel.svelte';
	import { formatDate, slugify } from '#lib/format.js';
	import { articleStatusLabel } from '#lib/labels.js';
	import { submitAction } from '#lib/action.js';
	import type { ArticleItem } from '#lib/mock/admin.js';

	interface Props {
		article?: ArticleItem;
		mode: 'create' | 'edit';
		staffUsers: { id: string; name: string }[];
	}

	let { article, mode, staffUsers }: Props = $props();

	// Nilai awal formulir sengaja diambil sekali; perubahan prop tidak menimpa editan pengguna.
	const initial = untrack(() => article);

	let title = $state(initial?.title ?? '');
	let slug = $state(initial?.slug ?? '');
	let excerpt = $state(initial?.excerpt ?? '');
	let content = $state(initial?.content ?? '');
	let coverImageUrl = $state(initial?.coverImageUrl ?? '');
	let status = $state<string>(initial?.status ?? 'DRAFT');
	let tags = $state(initial?.tags.join(', ') ?? '');
	let readingMinutes = $state(initial?.readingMinutes ?? 5);
	let authorId = $state(initial?.authorId ?? staffUsers[0]?.id ?? '');
	let seoTitle = $state(initial?.seoTitle ?? '');
	let seoDescription = $state(initial?.seoDescription ?? '');

	let showPreview = $state(false);
	let contentEl = $state<HTMLTextAreaElement>();
	let notice = $state('');
	let errorMessage = $state('');

	const publishChecks = $derived([
		{
			label: 'Isi artikel minimal 50 karakter',
			ok: content.replace(/<[^>]*>/g, '').trim().length >= 50
		},
		{ label: 'Ringkasan terisi', ok: excerpt.trim().length > 0 },
		{ label: 'Gambar sampul terisi', ok: coverImageUrl.trim().length > 0 },
		{ label: 'Penulis dipilih', ok: authorId.trim().length > 0 }
	]);

	const canPublish = $derived(publishChecks.every((check) => check.ok));
	const textLength = $derived(content.replace(/<[^>]*>/g, '').trim().length);

	function fillSlug() {
		slug = slugify(title);
	}

	async function wrapSelection(before: string, after = '') {
		const el = contentEl;
		if (!el) return;

		const start = el.selectionStart;
		const end = el.selectionEnd;
		const selected = content.slice(start, end) || 'teks';

		content = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;

		await tick();
		el.focus();
		el.selectionStart = start + before.length;
		el.selectionEnd = start + before.length + selected.length;
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		notice = '';
		errorMessage = '';

		if (status === 'PUBLISHED' && !canPublish) {
			errorMessage = 'Lengkapi checklist publikasi sebelum menerbitkan artikel.';
			return;
		}

		const body = new FormData();
		body.set('title', title);
		body.set('slug', slug || title);
		body.set('excerpt', excerpt);
		body.set('content', content);
		body.set('coverImageUrl', coverImageUrl);
		body.set('status', status);
		body.set('tags', tags);
		body.set('readingMinutes', String(readingMinutes));
		body.set('authorId', authorId);
		body.set('seoTitle', seoTitle);
		body.set('seoDescription', seoDescription);

		const result = await submitAction('save', body);
		if (!result.ok) {
			errorMessage = result.message ?? 'Artikel gagal disimpan.';
			return;
		}
		notice = result.message ?? 'Artikel disimpan.';
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
	<div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
		<div class="grid min-w-0 content-start gap-6">
			<Panel title="Informasi artikel">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Judul *</legend>
						<input class="input w-full" required placeholder="Judul artikel" bind:value={title} />
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Slug *</legend>
						<div class="join w-full">
							<input
								class="input join-item w-full"
								required
								pattern="[a-z0-9\-]+"
								placeholder="judul-artikel"
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
							maxlength="200"
							placeholder="Satu atau dua kalimat untuk kartu artikel"
							bind:value={excerpt}></textarea>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">URL gambar sampul</legend>
						<input
							class="input w-full font-mono text-xs"
							placeholder="https://…"
							bind:value={coverImageUrl}
						/>
						<div class="mt-2">
							<MediaUpload
								folder="articles"
								hint="Unggah gambar sampul (maks 10 MB) atau tempel URL di atas."
								onUploaded={(media) => (coverImageUrl = media.url)}
							/>
						</div>
					</fieldset>

					{#if coverImageUrl}
						<img
							src={coverImageUrl}
							alt="Pratinjau sampul"
							class="aspect-[2/1] w-full border border-brand-line object-cover"
						/>
					{/if}

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Tag</legend>
						<input class="input w-full" placeholder="panduan, pembeli" bind:value={tags} />
						<p class="mt-1 text-xs text-brand-gray-600">Pisahkan dengan koma.</p>
					</fieldset>
				</div>
			</Panel>

			<Panel title="Isi artikel" description="Editor HTML sederhana untuk pratinjau demo.">
				<div class="flex flex-wrap gap-1 border border-b-0 border-brand-line bg-base-200/60 p-2">
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<h2>', '</h2>')}>H2</button
					>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<h3>', '</h3>')}>H3</button
					>
					<span class="mx-1 w-px bg-brand-line"></span>
					<button
						class="btn btn-ghost btn-xs font-bold"
						type="button"
						onclick={() => wrapSelection('<strong>', '</strong>')}>B</button
					>
					<button
						class="btn btn-ghost btn-xs italic"
						type="button"
						onclick={() => wrapSelection('<em>', '</em>')}>I</button
					>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<a href="https://">', '</a>')}>Tautan</button
					>
					<span class="mx-1 w-px bg-brand-line"></span>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<ul>\n\t<li>', '</li>\n</ul>')}>Daftar</button
					>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<ol>\n\t<li>', '</li>\n</ol>')}>Nomor</button
					>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => wrapSelection('<blockquote>', '</blockquote>')}>Kutipan</button
					>
					<span class="mx-1 w-px bg-brand-line"></span>
					<button
						class="btn btn-ghost btn-xs"
						type="button"
						onclick={() => (showPreview = !showPreview)}
					>
						{showPreview ? 'Tulis' : 'Pratinjau'}
					</button>
				</div>

				{#if showPreview}
					<div
						class="min-h-40 border border-brand-line bg-white p-4 text-sm [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-brand-line [&_blockquote]:pl-3 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:font-bold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mt-2"
					>
						{@html content}
					</div>
				{:else}
					<textarea
						bind:this={contentEl}
						class="textarea min-h-72 w-full border-brand-line font-mono text-sm"
						rows="14"
						placeholder="<h2>Subjudul</h2><p>Isi artikel…</p>"
						bind:value={content}></textarea>
				{/if}

				<p class="mt-2 text-xs text-brand-gray-600">
					{textLength} karakter teks · HTML disanitasi dengan allowlist sebelum disimpan.
				</p>
			</Panel>
		</div>

		<div class="grid min-w-0 content-start gap-6">
			<Panel title="Publikasi">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Status</legend>
						<select class="select w-full" bind:value={status}>
							{#each Object.entries(articleStatusLabel) as [value, label] (value)}
								<option {value}>{label}</option>
							{/each}
						</select>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Penulis</legend>
						<select class="select w-full" bind:value={authorId}>
							{#each staffUsers as user (user.id)}
								<option value={user.id}>{user.name}</option>
							{/each}
						</select>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Estimasi waktu baca (menit)</legend>
						<input class="input w-full" type="number" min="1" bind:value={readingMinutes} />
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

			<Panel title="SEO">
				<div class="grid gap-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Judul SEO</legend>
						<input
							class="input w-full"
							maxlength="70"
							placeholder="{title || 'Judul artikel'} — Azetta"
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
				? 'Artikel baru disimpan sebagai draf kecuali status diubah.'
				: `Terakhir diperbarui ${initial?.updatedAt ? formatDate(initial.updatedAt) : '—'}.`}
		</p>
		<div class="flex flex-wrap gap-2">
			<a class="btn btn-ghost btn-sm" href="/artikel">Kembali</a>
			<button class="btn btn-primary btn-sm" type="submit">
				{mode === 'create' ? 'Simpan artikel' : 'Simpan perubahan'}
			</button>
		</div>
	</div>
</form>
