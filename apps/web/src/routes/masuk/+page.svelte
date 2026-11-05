<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import AuthShell from '#lib/components/site/AuthShell.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Masuk — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta
		name="description"
		content="Masuk ke akun Azetta untuk memantau progres unit dan pengajuan Anda."
	/>
</svelte:head>

<AuthShell title="Masuk ke akun Anda" description="Pantau progres unit dan status pengajuan Anda.">
	<form method="POST" class="mt-6 grid gap-4">
		{#if form?.message}
			<p role="alert" class="alert alert-error">{form.message}</p>
		{/if}
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
			<legend class="fieldset-legend">Kata sandi</legend>
			<input
				class="input w-full"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				placeholder="••••••••"
			/>
		</fieldset>

		<button class="btn btn-primary w-full" type="submit">Masuk</button>
	</form>

	<div class="mt-4 flex flex-wrap justify-between gap-2 text-sm">
		<a class="link link-hover text-brand-gray-600" href="/lupa-sandi">Lupa kata sandi?</a>
		<a class="link link-hover font-bold" href="/daftar">Buat akun</a>
	</div>
</AuthShell>
