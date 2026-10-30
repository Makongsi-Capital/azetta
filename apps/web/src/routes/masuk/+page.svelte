<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import { goto } from '$app/navigation';
	import AuthShell from '#lib/components/site/AuthShell.svelte';

	let email = $state('');
	let password = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		void goto('/akun');
	}
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
	<form class="mt-6 grid gap-4" onsubmit={submit}>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email</legend>
			<input
				class="input w-full"
				type="email"
				autocomplete="email"
				placeholder="nama@email.com"
				bind:value={email}
			/>
		</fieldset>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Kata sandi</legend>
			<input
				class="input w-full"
				type="password"
				autocomplete="current-password"
				placeholder="••••••••"
				bind:value={password}
			/>
		</fieldset>

		<button class="btn btn-primary w-full" type="submit">Masuk</button>
	</form>

	<div class="mt-4 flex flex-wrap justify-between gap-2 text-sm">
		<a class="link link-hover text-brand-gray-600" href="/lupa-sandi">Lupa kata sandi?</a>
		<a class="link link-hover font-bold" href="/daftar">Buat akun</a>
	</div>

	<p class="mt-6 border-t border-brand-line pt-4 text-xs text-brand-gray-600">
		Mode pratinjau: gunakan email dan kata sandi apa pun untuk membuka halaman akun contoh.
	</p>
</AuthShell>
