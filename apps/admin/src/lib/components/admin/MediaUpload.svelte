<script lang="ts">
	import type { UploadedMedia } from '#lib/upload.js';

	interface Props {
		folder: string;
		accept?: string;
		hint?: string;
		disabled?: boolean;
		onUploaded: (media: UploadedMedia) => void;
	}

	let {
		folder,
		accept = 'image/jpeg,image/png,image/webp,image/avif',
		hint,
		disabled = false,
		onUploaded
	}: Props = $props();

	let input = $state<HTMLInputElement | null>(null);
	let uploading = $state(false);
	let errorMessage = $state('');

	async function upload(file: File) {
		uploading = true;
		errorMessage = '';

		try {
			const body = new FormData();
			body.set('file', file);
			body.set('folder', folder);

			const response = await fetch('/api/media', {
				method: 'POST',
				body,
				headers: { accept: 'application/json' }
			});

			if (!response.headers.get('content-type')?.includes('application/json')) {
				errorMessage = 'Sesi berakhir. Muat ulang halaman lalu coba lagi.';
				return;
			}

			const payload = (await response.json()) as { media?: UploadedMedia; message?: string };

			if (!response.ok || !payload.media) {
				errorMessage = payload.message ?? 'Berkas gagal diunggah.';
				return;
			}

			onUploaded(payload.media);
		} catch {
			errorMessage = 'Tidak dapat menghubungi server.';
		} finally {
			uploading = false;
			if (input) input.value = '';
		}
	}

	function onchange(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (file) void upload(file);
	}
</script>

<div>
	<div class="flex flex-wrap items-center gap-2">
		<input
			bind:this={input}
			class="file-input file-input-sm max-w-xs"
			type="file"
			{accept}
			{disabled}
			{onchange}
		/>
		{#if uploading}
			<span class="loading loading-spinner loading-sm"></span>
			<span class="text-xs text-brand-gray-600">Mengunggah…</span>
		{/if}
	</div>
	{#if hint}
		<p class="mt-1 text-xs text-brand-gray-600">{hint}</p>
	{/if}
	{#if errorMessage}
		<p class="mt-1 text-xs text-error" role="alert">{errorMessage}</p>
	{/if}
</div>
