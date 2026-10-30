<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- mockup: sebagian rute tujuan belum dibangun */
	import Logo from '#lib/components/Logo.svelte';

	const columns = [
		{
			title: 'Layanan',
			links: [
				{ href: '/rumah', label: 'Rumah' },
				{ href: '/kerja-sama-lahan', label: 'Kerja Sama Lahan' },
				{ href: '/investasi', label: 'Investasi' },
				{ href: '/proyek', label: 'Proyek' }
			]
		},
		{
			title: 'Informasi',
			links: [
				{ href: '/tentang', label: 'Tentang' },
				{ href: '/artikel', label: 'Artikel' },
				{ href: '/faq', label: 'FAQ' },
				{ href: '/kontak', label: 'Kontak' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
				{ href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' }
			]
		}
	];
</script>

<footer class="on-dark">
	<div
		class="mx-auto grid max-w-6xl gap-10 border-t border-brand-ink-3 px-4 py-14 md:grid-cols-2 lg:grid-cols-5"
	>
		<div class="lg:col-span-2">
			<Logo size={30} />
			<p class="mt-4 max-w-sm text-sm text-brand-gray-300">
				Rumah tapak, kerja sama lahan, dan proyek properti di Makassar dan sekitarnya.
			</p>
			<p class="mt-4 text-sm text-brand-gray-500">
				Jl. Perintis Kemerdekaan, Makassar<br />
				Senin–Sabtu, 09.00–17.00 WITA
			</p>
		</div>

		{#each columns as column (column.title)}
			<div class="text-sm">
				<p class="font-bold">{column.title}</p>
				<ul class="mt-3 space-y-2 text-brand-gray-300">
					{#each column.links as link (link.href)}
						<li><a class="link link-hover" href={link.href}>{link.label}</a></li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div
		class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-brand-ink-3 px-4 py-5 text-xs text-brand-gray-500"
	>
		<p>© 2026 Azetta. Seluruh hak cipta dilindungi.</p>
		<p>
			<a class="link link-hover" href="/kontak">azettaidofficial@gmail.com</a>
		</p>
	</div>
</footer>
