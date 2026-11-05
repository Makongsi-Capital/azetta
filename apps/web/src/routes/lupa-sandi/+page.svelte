<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- sebagian href dibangun dari data API */
	import AuthShell from '#lib/components/site/AuthShell.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
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
	{#if form?.sent}
		<div role="status" class="mt-6 alert alert-success">
			<span class="icon-[mdi--email-check-outline] size-5 shrink-0"></span>
			<span>
				Jika email <strong>{form.email}</strong> terdaftar, kami sudah mengirim tautan untuk mengatur
				ulang kata sandi.
			</span>
		</div>
	{:else}
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
					required
					placeholder="nama@email.com"
					value={form?.email ?? ''}
				/>
			</fieldset>
			<button class="btn btn-primary w-full" type="submit">Kirim tautan</button>
		</form>
	{/if}

	<p class="mt-4 text-xs text-brand-gray-600">
		Demi keamanan, kami tidak memberi tahu apakah sebuah email terdaftar. Kirim ulang paling banyak
		3 kali per jam.
	</p>

	<p class="mt-6 border-t border-brand-line pt-4 text-sm text-brand-gray-600">
		Ingat kata sandi Anda? <a class="link link-hover font-bold" href="/masuk">Masuk</a>
	</p>
</AuthShell>
