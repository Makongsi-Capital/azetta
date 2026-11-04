<script lang="ts">
	interface Props {
		page: number;
		pageCount: number;
		total: number;
		onchange: (page: number) => void;
	}

	let { page, pageCount, total, onchange }: Props = $props();

	const visiblePages = $derived.by(() => {
		if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

		const pages: (number | 'gap')[] = [1];
		const start = Math.max(2, page - 1);
		const end = Math.min(pageCount - 1, page + 1);

		if (start > 2) pages.push('gap');
		for (let current = start; current <= end; current += 1) pages.push(current);
		if (end < pageCount - 1) pages.push('gap');
		pages.push(pageCount);

		return pages;
	});
</script>

<div class="flex flex-wrap items-center justify-between gap-3 border-t border-brand-line px-4 py-3">
	<p class="text-xs text-brand-gray-600">
		Halaman {page} dari {pageCount} · {total} data
	</p>

	<div class="join">
		<button
			class="btn join-item btn-sm"
			type="button"
			disabled={page <= 1}
			aria-label="Halaman sebelumnya"
			onclick={() => onchange(page - 1)}
		>
			<span class="icon-[mdi--chevron-left] size-4"></span>
		</button>

		{#each visiblePages as item, index (item === 'gap' ? `gap-${index}` : item)}
			{#if item === 'gap'}
				<span class="btn join-item btn-sm btn-disabled">…</span>
			{:else}
				<button
					class="btn join-item btn-sm tabular-nums"
					class:btn-active={item === page}
					type="button"
					aria-current={item === page ? 'page' : undefined}
					onclick={() => onchange(item)}
				>
					{item}
				</button>
			{/if}
		{/each}

		<button
			class="btn join-item btn-sm"
			type="button"
			disabled={page >= pageCount}
			aria-label="Halaman berikutnya"
			onclick={() => onchange(page + 1)}
		>
			<span class="icon-[mdi--chevron-right] size-4"></span>
		</button>
	</div>
</div>
