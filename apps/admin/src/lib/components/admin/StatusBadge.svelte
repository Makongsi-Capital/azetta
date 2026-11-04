<script lang="ts">
	interface Props {
		label: string;
		tone?: string;
	}

	let { label, tone = 'badge-ghost' }: Props = $props();
</script>

<span class="badge badge-sm border-0 whitespace-nowrap {tone}">{label}</span>
