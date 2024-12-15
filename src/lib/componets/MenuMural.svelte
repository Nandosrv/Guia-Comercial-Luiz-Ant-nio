<script lang="ts">
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let isMenuOpen = false; // Estado para controlar o menu

	// Função para fechar o menu ao clicar fora
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

	onMount(() => {
		setLastPathUrl($page.url.pathname);
		document.addEventListener('click', handleOutsideClick);
		return () => document.removeEventListener('click', handleOutsideClick);
	});
</script>

<!-- Header com menu -->
<div
	class="flex h-[50px] w-full items-center justify-between border-b border-purple-800 bg-black/60 p-4"
>
	<!-- Botão do menu -->
	<button
		id="menu-button"
		class="text-white focus:outline-none"
		on:click={() => (isMenuOpen = !isMenuOpen)}
		aria-label="Toggle menu"
	>
		<!-- Ícone hambúrguer -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
			/>
		</svg>
	</button>

	<!-- Menu -->
	<nav
		id="menu"
		class={`absolute left-0 top-[50px] mt-[200px] w-full transform rounded-b-lg bg-black/90 p-4 text-white shadow-lg transition-all duration-500 ease-in-out ${
			isMenuOpen
				? 'pointer-events-auto translate-y-0 opacity-100'
				: 'pointer-events-none -translate-y-10 opacity-0'
		}`}
	>
		<ul class="flex flex-col gap-4">
			<li>
				<a href="#HISTORIA-DA-CIDADE" class="font-serif text-white hover:underline"
					>História Da Cidade</a
				>
			</li>
			<li>
				<a href="#Significado-do-Nome" class="font-serif text-white hover:underline"
					>Significado Do Nome</a
				>
			</li>
			<li>
				<a href="#Aniversário-da-Cidade" class="font-serif text-white hover:underline"
					>Aniversário da Cidade</a
				>
			</li>
			<li>
				<a href="#CARACTERÍSTICAS" class="font-serif text-white hover:underline">Características</a>
			</li>
			<li>
				<a href="#COMO-CHEGAR" class="font-serif text-white hover:underline">Como Chegar</a>
			</li>
			<li>
				<a href="#TURISMO" class="font-serif text-white hover:underline">Turismo</a>
			</li>
			<li>
				<a href="#INFORMAÇÕES-ÚTEIS" class="font-serif text-white hover:underline"
					>Informações ÚTeis</a
				>
			</li>
			<li>
				<a href="#Comentário" class="font-serif text-white hover:underline">Comentário</a>
			</li>
		</ul>
	</nav>
</div>
