<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Footer from '#lib/components/site/Footer.svelte';
	import Header from '#lib/components/site/Header.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-base-100">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
