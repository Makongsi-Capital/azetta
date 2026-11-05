<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '#lib/components/Logo.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Masuk — Azetta Admin</title>
	<meta name="robots" content="noindex" />
	<meta name="description" content="Masuk ke panel admin internal Azetta." />
</svelte:head>

<div class="grid min-h-screen lg:grid-cols-2">
	<section class="on-dark hidden flex-col justify-between p-10 lg:flex">
		<Logo size={30} class="text-brand-paper" />

		<div class="max-w-md">
			<p class="eyebrow">Panel internal</p>
			<h1 class="mt-4 text-4xl">Kelola lead, katalog, dan konten Azetta.</h1>
			<p class="mt-4 text-sm text-brand-gray-300">
				Semua perubahan tercatat di audit log. Sesi admin terpisah dari akun pelanggan dan wajib
				memakai email internal.
			</p>
		</div>

		<p class="text-xs text-brand-gray-500">© 2026 Azetta. Halaman internal, tidak diindeks.</p>
	</section>

	<section class="flex items-center justify-center px-4 py-12">
		<div class="w-full max-w-sm">
			<div class="lg:hidden">
				<Logo size={28} />
			</div>

			<p class="eyebrow mt-12 lg:mt-0">Akses admin</p>
			<h2 class="mt-3 text-2xl">Masuk ke panel</h2>
			<p class="mt-2 text-sm text-brand-gray-600">
				Gunakan akun internal yang diberikan oleh super admin.
			</p>

			<form class="mt-8 grid gap-4" method="POST" use:enhance>
				{#if form?.message}
					<div class="alert alert-error text-sm" role="alert">
						<span class="icon-[mdi--alert-circle-outline] size-5"></span>
						<span>{form.message}</span>
					</div>
				{:else if data.forbidden}
					<div class="alert alert-warning text-sm" role="alert">
						<span class="icon-[mdi--shield-alert-outline] size-5"></span>
						<span>Akun ini bukan staf internal Azetta.</span>
					</div>
				{/if}

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Email</legend>
					<input
						class="input w-full"
						type="email"
						name="email"
						autocomplete="email"
						placeholder="nama@azetta.id"
						value={form?.email ?? ''}
						required
					/>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Kata sandi</legend>
					<input
						class="input w-full"
						type="password"
						name="password"
						autocomplete="current-password"
						placeholder="••••••••"
						required
					/>
				</fieldset>

				<button class="btn btn-primary w-full" type="submit">Masuk</button>
			</form>

			<div class="mt-6 border-t border-brand-line pt-4 text-xs text-brand-gray-600">
				<p>Gunakan akun internal yang diberikan oleh super admin.</p>
				<a
					class="link link-hover mt-2 inline-flex items-center gap-1 font-bold"
					href="https://azetta.id"
				>
					<span class="icon-[mdi--arrow-left] size-4"></span>
					Kembali ke situs publik
				</a>
			</div>
		</div>
	</section>
</div>
