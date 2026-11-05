<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$app/env/public';

	const SCRIPT_ID = 'cf-turnstile-script';
	const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

	let container: HTMLDivElement | undefined = $state();
	let widgetId: string | undefined;

	onMount(() => {
		if (!PUBLIC_TURNSTILE_SITE_KEY) return;

		let disposed = false;

		const render = () => {
			if (disposed || !container || !window.turnstile) return;
			widgetId = window.turnstile.render(container, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				theme: 'auto'
			});
		};

		let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
		if (script?.dataset.ready === 'true') {
			render();
		} else {
			if (!script) {
				script = document.createElement('script');
				script.id = SCRIPT_ID;
				script.src = SCRIPT_URL;
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);
			}
			script.addEventListener(
				'load',
				() => {
					script!.dataset.ready = 'true';
					render();
				},
				{ once: true }
			);
		}

		return () => {
			disposed = true;
			if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
		};
	});
</script>

{#if PUBLIC_TURNSTILE_SITE_KEY}
	<!-- Token dikirim sebagai hidden input cf-turnstile-response di dalam <form> -->
	<div class="sm:col-span-2" data-turnstile="widget" bind:this={container}></div>
{/if}
