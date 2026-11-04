<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		hint?: string;
		icon?: string;
		tone?: 'default' | 'warning' | 'danger' | 'success';
	}

	let {
		label,
		value,
		hint,
		icon = 'icon-[mdi--chart-box-outline]',
		tone = 'default'
	}: Props = $props();

	const toneClass = {
		default: 'text-base-content',
		warning: 'text-warning',
		danger: 'text-error',
		success: 'text-success'
	};
</script>

<div class="border border-brand-line bg-white p-5">
	<div class="flex items-start justify-between gap-3">
		<p class="text-xs font-bold tracking-wide text-brand-gray-600 uppercase">{label}</p>
		<span class="{icon} size-5 shrink-0 text-brand-gray-500"></span>
	</div>
	<p class="mt-3 text-3xl font-bold tabular-nums {toneClass[tone]}">{value}</p>
	{#if hint}
		<p class="mt-1 text-xs text-brand-gray-600">{hint}</p>
	{/if}
</div>
