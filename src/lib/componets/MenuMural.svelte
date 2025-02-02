<script lang="ts">
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	let isMenuOpen = false;

	function handleOutsideClick(event: MouseEvent) {
		const menu = document.getElementById('menu');
		const button = document.getElementById('menu-button');
		if (
			isMenuOpen &&
			menu &&
			!menu.contains(event.target as Node) &&
			button &&
			!button.contains(event.target as Node)
		) {
			isMenuOpen = false;
		}
	}

	const menuItems = [
		{ href: '#HISTORIA-DA-CIDADE', text: 'História' },
		// { href: '#Significado-do-Nome', text: 'Nome' },
		// { href: '#Aniversário-da-Cidade', text: 'Aniversário' },
		{ href: '#CARACTERÍSTICAS', text: 'Características' },
		{ href: '#COMO-CHEGAR', text: 'Como Chegar' },
		{ href: '#TURISMO', text: 'Turismo' },
		{ href: '#INFORMAÇÕES-ÚTEIS', text: 'Info' },
		{ href: '#Comentário', text: 'Comentários' }
	];

	onMount(() => {
		setLastPathUrl($page.url.pathname);
		document.addEventListener('click', handleOutsideClick);
		return () => document.removeEventListener('click', handleOutsideClick);
	});
</script>

<header class="fixed top-0 z-50 w-[95%] ">
	<div class="flex h-12 items-center justify-between border-b bg-white px-4 shadow-sm">
		<div class="flex items-center gap-3">
			<!-- <span class="text-lg font-bold text-gray-700">LA</span> -->
		</div>

		<!-- Menu Mobile -->
		<button
			id="menu-button"
			class="rounded p-1 hover:bg-gray-100 lg:hidden"
			on:click={() => (isMenuOpen = !isMenuOpen)}
			aria-label="Menu"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6 text-gray-700"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
		</button>

		<!-- Menu Desktop -->
		<nav class="hidden lg:block">
			<ul class="flex gap-6">
				{#each menuItems as item}
					<li>
						<a
							href={item.href}
							class="text-sm font-medium text-gray-600 transition-all hover:text-gray-900"
						>
							{item.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Menu Mobile Dropdown -->
	{#if isMenuOpen}
		<nav
			id="menu"
			class="w-full bg-white shadow-md"
			transition:slide={{ duration: 200 }}
		>
			<ul class="grid grid-cols-2 gap-2 p-4">
				{#each menuItems as item}
					<li>
						<a
							href={item.href}
							class="block rounded px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
							on:click={() => (isMenuOpen = false)}
						>
							{item.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>


<style>
	header {
		background-color: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(8px);
	}
</style>