<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import AuthShell from '#lib/components/site/AuthShell.svelte';

	let password = $state('');
	let submitted = $state(false);

	const criteria = $derived([
		password.length >= 8,
		/[A-Za-z]/.test(password),
		/\d/.test(password),
		/[^A-Za-z0-9]/.test(password)
	]);
	const score = $derived(criteria.filter(Boolean).length);
	const strengthLabel = $derived(
		['Belum diisi', 'Lemah', 'Sedang', 'Kuat', 'Sangat kuat'][password ? score : 0]
	);
	const strengthTone = $derived(
		password === '' ? '' : score <= 1 ? 'bg-error' : score === 2 ? 'bg-warning' : 'bg-success'
	);

	function submit(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
	}
</script>

<svelte:head>
	<title>Daftar Akun — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content="Buat akun Azetta untuk memantau progres unit dan pengajuan Anda."
	/>
</svelte:head>

<AuthShell
	title="Buat akun"
	description="Satu akun untuk memantau progres unit dan status pengajuan Anda."
>
	{#if submitted}
		<div class="mt-6 rounded-[0.5rem] border border-brand-line bg-brand-mist p-5">
			<p class="font-bold">Cek email Anda</p>
			<p class="mt-2 text-sm text-brand-gray-600">
				Kami mengirim tautan verifikasi. Akun aktif setelah email dikonfirmasi, tanpa login otomatis
				sebelumnya.
			</p>
			<a class="btn btn-primary btn-sm mt-4" href="/akun">Lihat akun demo</a>
			<button
				class="btn btn-ghost btn-sm mt-4 ml-2"
				type="button"
				onclick={() => (submitted = false)}
			>
				Kembali
			</button>
		</div>
	{:else}
		<form class="mt-6 grid gap-4" onsubmit={submit}>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Nama</legend>
				<input class="input w-full" autocomplete="name" placeholder="Nama sesuai KTP" />
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Email</legend>
				<input
					class="input w-full"
					type="email"
					autocomplete="email"
					placeholder="nama@email.com"
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">WhatsApp</legend>
				<input class="input w-full" type="tel" autocomplete="tel" placeholder="08xx xxxx xxxx" />
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Kata sandi</legend>
				<input
					class="input w-full"
					type="password"
					autocomplete="new-password"
					placeholder="Minimal 8 karakter"
					bind:value={password}
				/>
				<div class="mt-2 flex items-center gap-1">
					{#each criteria as _criterion, index (`bar-${index}`)}
						<span class="h-1 flex-1 rounded-full {index < score ? strengthTone : 'bg-brand-line'}"
						></span>
					{/each}
				</div>
				<p class="fieldset-label" aria-live="polite">Kekuatan: {strengthLabel}</p>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Ulangi kata sandi</legend>
				<input
					class="input w-full"
					type="password"
					autocomplete="new-password"
					placeholder="••••••••"
				/>
			</fieldset>

			<label class="flex items-start gap-2 text-sm">
				<input type="checkbox" class="checkbox checkbox-sm" />
				<span class="text-brand-gray-600">
					Saya menyetujui <a class="link link-hover font-bold" href="/kebijakan-privasi"
						>Kebijakan Privasi</a
					>
					dan
					<a class="link link-hover font-bold" href="/syarat-ketentuan">Syarat &amp; Ketentuan</a>.
				</span>
			</label>

			<button class="btn btn-primary w-full" type="submit">Daftar</button>
		</form>

		<p class="mt-4 text-sm text-brand-gray-600">
			Sudah punya akun? <a class="link link-hover font-bold" href="/masuk">Masuk</a>
		</p>
	{/if}
</AuthShell>
