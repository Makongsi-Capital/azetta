<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import Logo from '#lib/components/Logo.svelte';
	import { page } from '$app/state';

	const links = [
		{ href: '/rumah', label: 'Rumah' },
		{ href: '/proyek', label: 'Proyek' },
		{ href: '/kerja-sama-lahan', label: 'Kerja Sama Lahan' },
		{ href: '/investasi', label: 'Investasi' },
		{ href: '/artikel', label: 'Artikel' }
	];

	const isActive = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<header class="sticky top-0 z-40 border-b border-brand-line bg-base-100/95 backdrop-blur">
	<div class="mx-auto flex h-20 max-w-6xl items-center gap-6 px-4">
		<a class="text-base-content" href="/" aria-label="AZETTA — beranda">
			<Logo size={30} />
		</a>

		<nav class="hidden items-center gap-6 text-sm md:flex" aria-label="Navigasi utama">
			{#each links as link (link.href)}
				<a
					class="border-b-2 pb-1 transition-colors {isActive(link.href)
						? 'border-brand-ink font-bold'
						: 'border-transparent hover:border-brand-gray-300'}"
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-2">
			<a class="btn btn-ghost btn-sm hidden sm:inline-flex" href="/masuk">Masuk</a>
			<a class="btn btn-primary btn-sm" href="/kontak">Hubungi Kami</a>

			<details class="dropdown dropdown-end md:hidden">
				<summary class="btn btn-ghost btn-sm btn-square list-none" aria-label="Buka menu">
					<span class="icon-[mdi--menu] size-5"></span>
				</summary>
				<ul
					class="menu dropdown-content z-50 mt-2 w-64 gap-1 border border-brand-line bg-base-100 p-2"
				>
					{#each links as link (link.href)}
						<li>
							<a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
								{link.label}
							</a>
						</li>
					{/each}
					<li><a href="/masuk">Masuk</a></li>
				</ul>
			</details>
		</div>
	</div>
</header>
