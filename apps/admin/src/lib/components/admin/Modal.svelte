<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, description, onclose, children, footer }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	class="modal"
	aria-labelledby="modal-title"
	oncancel={(event) => {
		event.preventDefault();
		onclose();
	}}
	onclose={() => {
		if (open) onclose();
	}}
>
	<div class="modal-box max-w-xl border border-brand-line bg-base-100 p-0">
		<div class="flex items-start justify-between gap-4 border-b border-brand-line px-5 py-4">
			<div>
				<h2 class="text-lg font-bold" id="modal-title">{title}</h2>
				{#if description}
					<p class="mt-1 text-xs text-brand-gray-600">{description}</p>
				{/if}
			</div>
			<button
				class="btn btn-ghost btn-sm btn-square"
				type="button"
				onclick={onclose}
				aria-label="Tutup dialog"
			>
				<span class="icon-[mdi--close] size-5"></span>
			</button>
		</div>

		<div class="max-h-[70vh] overflow-y-auto px-5 py-4">
			{@render children()}
		</div>

		{#if footer}
			<div class="flex flex-wrap justify-end gap-2 border-t border-brand-line px-5 py-3">
				{@render footer()}
			</div>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>tutup</button>
	</form>
</dialog>
