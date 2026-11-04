<script lang="ts">
	import Sidebar from '#lib/components/admin/Sidebar.svelte';
	import Topbar from '#lib/components/admin/Topbar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let collapsed = $state(false);
	let mobileOpen = $state(false);
</script>

<div class="flex min-h-screen bg-base-100">
	<Sidebar
		{collapsed}
		{mobileOpen}
		oncollapse={() => (collapsed = !collapsed)}
		onnavigate={() => (mobileOpen = false)}
	/>

	{#if mobileOpen}
		<button
			class="fixed inset-0 z-40 bg-black/40 lg:hidden"
			type="button"
			aria-label="Tutup navigasi"
			onclick={() => (mobileOpen = false)}
		></button>
	{/if}

	<div class="flex min-w-0 flex-1 flex-col">
		<Topbar onopensidebar={() => (mobileOpen = true)} />
		<main class="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-8 lg:py-8">
			{@render children()}
		</main>
	</div>
</div>
