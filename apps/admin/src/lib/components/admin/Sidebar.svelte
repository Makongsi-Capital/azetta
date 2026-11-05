<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href berasal dari konfigurasi navigasi, bukan literal */
	import { page } from '$app/state';
	import Logo from '#lib/components/Logo.svelte';
	import { roleLabel } from '#lib/labels.js';
	import { initials } from '#lib/format.js';

	interface NavItem {
		href: string;
		label: string;
		icon: string;
		badge?: number;
		superAdminOnly?: boolean;
	}

	interface Props {
		collapsed: boolean;
		mobileOpen: boolean;
		oncollapse: () => void;
		onnavigate: () => void;
	}

	let { collapsed, mobileOpen, oncollapse, onnavigate }: Props = $props();

	const currentUser = $derived(page.data.currentUser);
	const pendingDeletions = $derived(page.data.pendingDeletions ?? 0);

	const sections = $derived<{ label: string; items: NavItem[] }[]>([
		{
			label: 'Operasional',
			items: [
				{ href: '/dashboard', label: 'Dashboard', icon: 'icon-[mdi--view-dashboard-outline]' },
				{
					href: '/leads',
					label: 'Lead',
					icon: 'icon-[mdi--account-multiple-outline]',
					badge: page.data.leadStats?.new ?? 0
				}
			]
		},
		{
			label: 'Katalog',
			items: [
				{ href: '/unit', label: 'Unit', icon: 'icon-[mdi--home-city-outline]' },
				{ href: '/proyek', label: 'Proyek', icon: 'icon-[mdi--office-building-outline]' }
			]
		},
		{
			label: 'Konten',
			items: [
				{ href: '/artikel', label: 'Artikel', icon: 'icon-[mdi--file-document-outline]' },
				{ href: '/konten/faq', label: 'FAQ', icon: 'icon-[mdi--help-circle-outline]' },
				{
					href: '/konten/testimoni',
					label: 'Testimoni',
					icon: 'icon-[mdi--comment-quote-outline]'
				}
			]
		},
		{
			label: 'Akses',
			items: [
				{
					href: '/pengguna',
					label: 'Pengguna',
					icon: 'icon-[mdi--account-cog-outline]',
					superAdminOnly: true
				},
				{
					href: '/pelanggan',
					label: 'Pelanggan',
					icon: 'icon-[mdi--account-group-outline]',
					superAdminOnly: true
				},
				{
					href: '/permohonan-hapus',
					label: 'Permohonan hapus',
					icon: 'icon-[mdi--account-remove-outline]',
					badge: pendingDeletions
				}
			]
		},
		{
			label: 'Sistem',
			items: [
				{ href: '/pengaturan', label: 'Pengaturan', icon: 'icon-[mdi--cog-outline]' },
				{ href: '/audit', label: 'Audit log', icon: 'icon-[mdi--history]' }
			]
		}
	]);

	const visibleSections = $derived(
		sections
			.map((section) => ({
				...section,
				items: section.items.filter(
					(item) => !item.superAdminOnly || currentUser?.role === 'super_admin'
				)
			}))
			.filter((section) => section.items.length > 0)
	);

	const pathname = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		return pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

<aside
	class="fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-brand-line bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 {collapsed
		? 'lg:w-20'
		: 'lg:w-64'} {mobileOpen ? 'translate-x-0' : '-translate-x-full'}"
	aria-label="Navigasi admin"
>
	<a
		class="flex h-16 items-center gap-3 border-b border-brand-line px-4 text-base-content"
		href="/dashboard"
		onclick={onnavigate}
		aria-label="Azetta Admin — dashboard"
	>
		{#if collapsed}
			<span class="hidden lg:block"><Logo size={26} wordmark={false} /></span>
			<span class="lg:hidden"><Logo size={26} /></span>
		{:else}
			<Logo size={26} />
		{/if}
		<span class="badge badge-outline badge-xs ml-auto {collapsed ? 'lg:hidden' : ''}">Admin</span>
	</a>

	<nav class="flex-1 overflow-y-auto px-3 py-4">
		{#each visibleSections as section (section.label)}
			<p
				class="px-2 pb-2 text-[11px] font-bold tracking-[0.16em] text-brand-gray-500 uppercase {collapsed
					? 'lg:hidden'
					: ''}"
			>
				{section.label}
			</p>

			<ul class="mb-5 grid gap-0.5">
				{#each section.items as item (item.href)}
					<li>
						<a
							href={item.href}
							onclick={onnavigate}
							title={collapsed ? item.label : undefined}
							aria-current={isActive(item.href) ? 'page' : undefined}
							class="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors {isActive(
								item.href
							)
								? 'bg-base-200 font-bold'
								: 'hover:bg-base-200/60'}"
						>
							<span class="{item.icon} size-5 shrink-0"></span>
							<span class="truncate {collapsed ? 'lg:hidden' : ''}">{item.label}</span>
							{#if item.badge}
								<span
									class="badge badge-sm ml-auto border-0 bg-brand-ink text-brand-paper tabular-nums {collapsed
										? 'lg:hidden'
										: ''}"
								>
									{item.badge}
								</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/each}
	</nav>

	<div class="border-t border-brand-line p-3">
		<div class="flex items-center gap-2.5 rounded-lg bg-base-200/70 p-2">
			<span
				class="grid size-8 shrink-0 place-items-center rounded-full border border-brand-line bg-white text-[11px] font-bold"
			>
				{initials(currentUser?.name ?? 'Admin')}
			</span>
			<div class="min-w-0 {collapsed ? 'lg:hidden' : ''}">
				<p class="truncate text-xs font-bold">{currentUser?.name ?? 'Admin'}</p>
				<p class="truncate text-[11px] text-brand-gray-600">
					{roleLabel[(currentUser?.role ?? 'admin') as keyof typeof roleLabel]}
				</p>
			</div>
		</div>

		<button
			class="btn btn-ghost btn-sm mt-2 hidden w-full justify-start gap-2 lg:flex"
			type="button"
			onclick={oncollapse}
			aria-label={collapsed ? 'Lebarkan sidebar' : 'Sempitkan sidebar'}
		>
			<span class="{collapsed ? 'icon-[mdi--menu-open]' : 'icon-[mdi--menu-close]'} size-5 shrink-0"
			></span>
			<span class={collapsed ? 'hidden' : ''}>{collapsed ? 'Lebarkan' : 'Sempitkan'}</span>
		</button>
	</div>
</aside>
