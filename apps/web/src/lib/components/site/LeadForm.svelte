<script lang="ts">
	interface Props {
		submitLabel?: string;
		messagePlaceholder?: string;
		withCity?: boolean;
	}

	let {
		submitLabel = 'Kirim',
		messagePlaceholder = 'Ceritakan kebutuhan Anda',
		withCity = false
	}: Props = $props();
</script>

<form class="grid gap-4 sm:grid-cols-2" onsubmit={(event) => event.preventDefault()}>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Nama</legend>
		<input class="input w-full" placeholder="Nama sesuai KTP" />
	</fieldset>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">WhatsApp</legend>
		<input class="input w-full" type="tel" placeholder="08xx xxxx xxxx" />
	</fieldset>

	{#if withCity}
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Kota</legend>
			<input class="input w-full" placeholder="Makassar" />
		</fieldset>
	{/if}

	<fieldset class="fieldset {withCity ? '' : 'sm:col-span-2'}">
		<legend class="fieldset-legend">Email{withCity ? ' (opsional)' : ''}</legend>
		<input class="input w-full" type="email" placeholder="nama@email.com" />
	</fieldset>

	<fieldset class="fieldset sm:col-span-2">
		<legend class="fieldset-legend">Pesan</legend>
		<textarea class="textarea w-full" rows="3" placeholder={messagePlaceholder}></textarea>
	</fieldset>

	<label class="flex items-start gap-2 text-sm sm:col-span-2">
		<input type="checkbox" class="checkbox checkbox-sm" />
		<span class="text-brand-gray-600">
			Saya setuju data ini diproses untuk keperluan tindak lanjut pengajuan.
		</span>
	</label>

	<div class="sm:col-span-2">
		<button class="btn btn-primary w-full sm:w-auto" type="submit">{submitLabel}</button>
	</div>
</form>
