<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- rute editor artikel sudah dibangun */
	import EmptyState from '#lib/components/admin/EmptyState.svelte';
	import PageHeader from '#lib/components/admin/PageHeader.svelte';
	import Pagination from '#lib/components/admin/Pagination.svelte';
	import StatCard from '#lib/components/admin/StatCard.svelte';
	import StatusBadge from '#lib/components/admin/StatusBadge.svelte';
	import { formatDate, formatNumber } from '#lib/format.js';
	import { articleStatusLabel, articleStatusTone } from '#lib/labels.js';
	import { articles } from '#lib/mock/admin.js';

	const perPage = 10;

	let q = $state('');
	let statusFilter = $state('all');
	let currentPage = $state(1);

	const counts = $derived({
		published: articles.filter((article) => article.status === 'PUBLISHED').length,
		draft: articles.filter((article) => article.status === 'DRAFT').length,
		archived: articles.filter((article) => article.status === 'ARCHIVED').length,
		views: articles.reduce((total, article) => total + article.viewCount, 0)
	});

	const filtered = $derived.by(() => {
		const term = q.trim().toLowerCase();

		return articles.filter((article) => {
			if (statusFilter !== 'all' && article.status !== statusFilter) return false;
			if (!term) return true;

			return [article.title, article.slug, article.authorName ?? '', ...article.tags]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term));
		});
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	const visibleArticles = $derived(
		filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
	);

	function resetFilters() {
		q = '';
		statusFilter = 'all';
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Artikel — Azetta Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	eyebrow="Konten"
	title="Artikel"
	description="Tulisan edukasi dan kabar proyek. Artikel draf tidak tampil di situs sampai diterbitkan."
>
	{#snippet actions()}
		<a
			class="btn btn-ghost btn-sm"
			href="https://azetta.id/artikel"
			target="_blank"
			rel="noreferrer"
		>
			<span class="icon-[mdi--open-in-new] size-4"></span>
			Lihat blog
		</a>
		<a class="btn btn-primary btn-sm" href="/artikel/baru">
			<span class="icon-[mdi--plus] size-4"></span>
			Artikel baru
		</a>
	{/snippet}
</PageHeader>

<section
	class="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-4"
>
	<StatCard label="Terbit" value={counts.published} icon="icon-[mdi--newspaper-variant-outline]" />
	<StatCard label="Draf" value={counts.draft} icon="icon-[mdi--file-edit-outline]" tone="warning" />
	<StatCard label="Diarsipkan" value={counts.archived} icon="icon-[mdi--archive-outline]" />
	<StatCard
		label="Total dibaca"
		value={formatNumber(counts.views)}
		hint="Seluruh artikel"
		icon="icon-[mdi--eye-outline]"
	/>
</section>

<div class="mt-6 border border-brand-line bg-white">
	<div class="flex flex-wrap items-center gap-2 border-b border-brand-line p-3">
		<label class="input input-sm flex min-w-56 flex-1 items-center gap-2 border-brand-line">
			<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
			<input
				type="search"
				class="grow"
				placeholder="Cari judul, penulis, atau tag…"
				aria-label="Cari artikel"
				bind:value={q}
				oninput={() => (currentPage = 1)}
			/>
		</label>

		<select
			class="select select-sm border-brand-line"
			aria-label="Filter status artikel"
			bind:value={statusFilter}
			onchange={() => (currentPage = 1)}
		>
			<option value="all">Semua status</option>
			{#each Object.entries(articleStatusLabel) as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>

		<button class="btn btn-ghost btn-sm" type="button" onclick={resetFilters}>Reset</button>
	</div>

	{#if visibleArticles.length === 0}
		<div class="p-6">
			<EmptyState
				title="Belum ada artikel yang cocok"
				description="Ubah filter atau tulis artikel baru."
				icon="icon-[mdi--file-document-outline]"
				actionLabel="Artikel baru"
				actionHref="/artikel/baru"
			/>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr class="border-brand-line text-xs">
						<th>Artikel</th>
						<th>Status</th>
						<th class="hidden md:table-cell">Penulis</th>
						<th class="hidden lg:table-cell">Tag</th>
						<th class="hidden xl:table-cell">Dibaca</th>
						<th class="hidden xl:table-cell">Terbit</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each visibleArticles as article (article.id)}
						<tr class="border-brand-line hover:bg-base-200/50">
							<td>
								<div class="flex items-center gap-3">
									{#if article.coverImageUrl}
										<img
											src={article.coverImageUrl}
											alt=""
											class="size-12 shrink-0 border border-brand-line object-cover"
											loading="lazy"
										/>
									{/if}
									<div class="min-w-0 max-w-md">
										<a class="block font-bold" href="/artikel/{article.id}">{article.title}</a>
										<p class="truncate font-mono text-[11px] text-brand-gray-600">
											/{article.slug}
										</p>
									</div>
								</div>
							</td>
							<td>
								<StatusBadge
									label={articleStatusLabel[article.status]}
									tone={articleStatusTone[article.status]}
								/>
							</td>
							<td class="hidden text-xs whitespace-nowrap md:table-cell">
								{article.authorName ?? '—'}
							</td>
							<td class="hidden lg:table-cell">
								<div class="flex max-w-48 flex-wrap gap-1">
									{#each article.tags.slice(0, 2) as tag (tag)}
										<span class="badge badge-outline badge-xs">{tag}</span>
									{/each}
								</div>
							</td>
							<td class="hidden text-xs tabular-nums xl:table-cell">
								{formatNumber(article.viewCount)}
							</td>
							<td class="hidden text-xs whitespace-nowrap text-brand-gray-600 xl:table-cell">
								{article.publishedAt ? formatDate(article.publishedAt) : '—'}
							</td>
							<td class="text-right">
								<div class="flex justify-end gap-1">
									{#if article.status === 'PUBLISHED'}
										<a
											class="btn btn-ghost btn-xs"
											href="https://azetta.id/artikel/{article.slug}"
											target="_blank"
											rel="noreferrer"
											aria-label="Lihat {article.title} di situs publik"
										>
											<span class="icon-[mdi--open-in-new] size-4"></span>
										</a>
									{/if}
									<a class="btn btn-outline btn-xs" href="/artikel/{article.id}">Edit</a>
								</div>
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
