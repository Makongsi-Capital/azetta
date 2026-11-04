<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- menu pengguna memakai rute statis */
	import { page } from '$app/state';
	import { initials } from '#lib/format.js';
	import { roleLabel } from '#lib/labels.js';
	import { currentUser } from '#lib/mock/admin.js';

	interface Props {
		onopensidebar: () => void;
	}

	let { onopensidebar }: Props = $props();

	let userMenu = $state<HTMLDetailsElement>();

	function closeMenu() {
		if (userMenu) userMenu.open = false;
	}

	const titles: [prefix: string, title: string][] = [
		['/dashboard', 'Dashboard'],
		['/leads', 'Lead'],
		['/unit', 'Unit'],
		['/proyek', 'Proyek'],
		['/artikel', 'Artikel'],
		['/konten/faq', 'FAQ'],
		['/konten/testimoni', 'Testimoni'],
		['/pengguna', 'Pengguna'],
		['/pelanggan', 'Pelanggan'],
		['/permohonan-hapus', 'Permohonan hapus'],
		['/pengaturan', 'Pengaturan'],
		['/audit', 'Audit log']
	];

	const pathname = $derived(page.url.pathname);
	const sectionTitle = $derived(
		titles.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ??
			'Admin'
	);
</script>

<header class="sticky top-0 z-30 border-b border-brand-line bg-base-100/95 backdrop-blur">
	<div class="flex h-16 items-center gap-3 px-4 lg:px-8">
		<button
			class="btn btn-ghost btn-sm btn-square lg:hidden"
			type="button"
			onclick={onopensidebar}
			aria-label="Buka navigasi"
		>
			<span class="icon-[mdi--menu] size-5"></span>
		</button>

		<p class="hidden min-w-0 truncate text-sm font-bold md:block">{sectionTitle}</p>

		<form action="/leads" method="get" role="search" class="ml-auto w-full max-w-xs">
			<div class="join w-full">
				<label
					class="input input-sm join-item flex w-full items-center gap-2 border-brand-line bg-white"
				>
					<span class="icon-[mdi--magnify] size-4 opacity-50"></span>
					<input
						type="search"
						name="q"
						class="grow"
						placeholder="Cari lead: nama, telepon, referensi…"
						aria-label="Cari lead"
					/>
				</label>
				<button class="btn join-item btn-sm" type="submit" aria-label="Cari">
					<span class="icon-[mdi--arrow-right] size-4"></span>
				</button>
			</div>
		</form>

		<span class="badge badge-outline badge-sm hidden xl:inline-flex">Data demo</span>

		<details bind:this={userMenu} class="dropdown dropdown-end">
			<summary class="btn btn-ghost btn-sm gap-2 px-2">
				<span
					class="grid size-8 place-items-center rounded-full border border-brand-line bg-base-200 text-[11px] font-bold"
				>
					{initials(currentUser.name)}
				</span>
				<span class="hidden text-left sm:block">
					<span class="block text-xs leading-tight font-bold">{currentUser.name}</span>
					<span class="block text-[11px] text-brand-gray-600">{roleLabel[currentUser.role]}</span>
				</span>
				<span class="icon-[mdi--chevron-down] size-4"></span>
			</summary>

			<ul class="menu dropdown-content z-50 mt-2 w-60 border border-brand-line bg-base-100 p-2">
				<li class="menu-title">
					<span class="truncate text-xs">{currentUser.email}</span>
				</li>
				<li>
					<a href="/pengaturan" onclick={closeMenu}>
						<span class="icon-[mdi--cog-outline] size-4"></span>
						Pengaturan situs
					</a>
				</li>
				<li>
					<a href="/audit" onclick={closeMenu}>
						<span class="icon-[mdi--history] size-4"></span>
						Audit log
					</a>
				</li>
				<li class="mt-1 border-t border-brand-line pt-1">
					<a href="/login" onclick={closeMenu}>
						<span class="icon-[mdi--logout] size-4"></span>
						Keluar
					</a>
				</li>
			</ul>
		</details>
	</div>
</header>
