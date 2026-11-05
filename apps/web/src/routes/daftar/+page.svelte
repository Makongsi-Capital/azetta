<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import AuthShell from '#lib/components/site/AuthShell.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	let password = $state('');

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
	<form method="POST" class="mt-6 grid gap-4">
		{#if form?.message}
			<p role="alert" class="alert alert-error">{form.message}</p>
		{/if}
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Nama</legend>
			<input
				class="input w-full"
				name="name"
				autocomplete="name"
				required
				placeholder="Nama sesuai KTP"
				value={form?.name ?? ''}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email</legend>
			<input
				class="input w-full"
				name="email"
				type="email"
				autocomplete="email"
				required
				placeholder="nama@email.com"
				value={form?.email ?? ''}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">WhatsApp</legend>
			<input
				class="input w-full"
				name="phone"
				type="tel"
				autocomplete="tel"
				placeholder="08xx xxxx xxxx"
				value={form?.phone ?? ''}
			/>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">Kata sandi</legend>
			<input
				class="input w-full"
				name="password"
				type="password"
				autocomplete="new-password"
				required
				minlength="8"
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
				name="confirmPassword"
				type="password"
				autocomplete="new-password"
				required
				minlength="8"
				placeholder="••••••••"
			/>
		</fieldset>

		<label class="flex items-start gap-2 text-sm">
			<input type="checkbox" class="checkbox checkbox-sm" name="terms" required />
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
</AuthShell>
