<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: rute akun belum dibangun */
	import AuthShell from '#lib/components/site/AuthShell.svelte';
</script>

<svelte:head>
	<title>Lupa Kata Sandi — Azetta</title>
	<meta name="robots" content="noindex" />
	<meta name="description" content="Minta tautan untuk mengatur ulang kata sandi akun Azetta." />
</svelte:head>

<AuthShell
	title="Lupa kata sandi"
	description="Masukkan email akun Anda. Jika email terdaftar, kami akan mengirim tautan untuk mengatur ulang kata sandi."
>
	<form class="mt-6 grid gap-4" onsubmit={(event) => event.preventDefault()}>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Email</legend>
			<input class="input w-full" type="email" placeholder="nama@email.com" />
		</fieldset>
		<button class="btn btn-primary w-full" type="submit">Kirim tautan</button>
	</form>

	<p class="mt-4 text-xs text-brand-gray-600">
		Demi keamanan, kami tidak memberi tahu apakah sebuah email terdaftar. Kirim ulang paling banyak
		3 kali per jam.
	</p>

	<p class="mt-6 border-t border-brand-line pt-4 text-sm text-brand-gray-600">
		Ingat kata sandi Anda? <a class="link link-hover font-bold" href="/masuk">Masuk</a>
	</p>
</AuthShell>
