<script lang="ts">
	interface Props {
		/** Tinggi mark dalam piksel; lebar dan wordmark mengikuti proporsi berkas resmi. */
		size?: number;
		wordmark?: boolean;
		class?: string;
	}

	let { size = 30, wordmark = true, class: className = '' }: Props = $props();

	// Proporsi lockup dari Brand Guidelines §02: mark 90×84, jarak 0,24 × lebar mark,
	// tinggi kapital wordmark 0,5 × tinggi mark (kapital Arial ≈ 0,688 em).
	let markWidth = $derived(size * (90 / 84));
	let gap = $derived(markWidth * 0.24);
	let fontSize = $derived((size * 0.5) / 0.688);
</script>

<span class="inline-flex items-center text-current {className}" style="gap: {gap}px">
	<svg
		viewBox="0 0 90 84"
		aria-hidden="true"
		class="shrink-0 fill-current"
		style="height: {size}px; width: {markWidth}px"
	>
		<path
			d="M62.2 0.3L72.6 6.3L73.7 7.1L73.8 7.6L60.1 30.8L59.5 32.8L60.1 34.2L60.7 34.9L62.4 35.5L89.5 35.5L90 36.7L90 48.1L89.5 49.1L62.7 49.1L60.5 48.7L59.1 47.8L58.1 46.7L48.2 29.6L47.4 26.9L48.2 23.9L61.2 1.6L62.2 0.3ZM28.4 0.5L28.9 0.7L29.8 1.8L42.8 23.9L43.5 27.2L42.8 29.5L32.8 46.6L31.7 47.8L30 48.9L28.1 49.1L1.4 49.1L0.5 48.8L0.2 48.1L0.2 36.7L0.4 36L0.9 35.6L28.5 35.5L30.1 35L30.8 34.4L31.3 32.8L30.8 30.8L17.1 7.5L18.3 6.2L28.3 0.5ZM34.5 51.1L56 51L56.9 51.2L58.4 52.1L59.7 53.3L73.7 77.2L73.5 77.8L72 78.7L62.8 83.9L61.8 83.8L61.2 83.2L48.7 61.6L46.8 59.2L45.8 58.9L44.2 59.1L43 60.2L29.1 83.8L27.7 83.8L17.3 77.8L17.3 76.9L30.2 54.8L32.3 52.2L34.5 51.1Z"
		/>
	</svg>
	{#if wordmark}
		<span class="font-bold" style="font-size: {fontSize}px; line-height: 1">AZETTA</span>
	{/if}
</span>
