<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation'; // Função para redirecionamento
	import Logo from '$lib/componets/Logo.svelte';
	import Pesquisa from './pesquisa.svelte';
	import img from '$lib/images/new.png';
	import user from '$lib/images/usuário.png';
	import { userPhotoURL } from '../../stores/user'; // Importando o store
	
	const items = [
		{ href: '/', label: 'Home' },
		{ href: '/Inicio', label: 'Feed' },
		{ href: '/Comercios', label: 'Comercios' },
	];

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	// Verifica login ao clicar no "Feed"
	function handleNavigation(item: { href: any; label: any; }) {
		if (item.label === 'Feed' && !$userPhotoURL) {
			// Redireciona para login se não estiver logado
			goto('/login');
		} else {
			// Redireciona para a página clicada
			goto(item.href);
		}
	}

	// Fecha o menu ao clicar fora
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (isOpen && !(event.target as HTMLElement).closest('.menu-carro')) {
				closeMenu();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

<style>
	/* Estilos para o menu "carro" (para mobile) */
	.menu-carro {
		position: absolute;
		top: 20%;
		left: 50%;
		width: 300px;
		height: 250px;
		background-color: #EDF3EE;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transform: translate(-50%, 0) scale(0);
		transition: transform 1s cubic-bezier(0.25, 1.5, 0.5, 1), opacity 1s ease;
	}

	.menu-visible {
		opacity: 1;
		transform: translate(-50%, 0) scale(1);
	}

	/* Outros estilos permanecem os mesmos... */
</style>

<nav class="w-full h-[60px] flex items-center justify-between px-4 shadow-md relative">
	<!-- Logo -->
	<a href="/" class="flex items-center justify-center">
		<img src={img} alt="Logo" class="w-[100px] flex mb-6" />
	</a>

	<div class="flex m-3">
		<!-- Barra de pesquisa -->
		<!-- <Pesquisa /> -->
	</div>

	<!-- Verifica se o usuário está logado e exibe a foto do perfil -->
	{#if $userPhotoURL}
		<a href="/perfil">
			<div class="flex items-center">
				<img src={$userPhotoURL} alt="Foto de perfil" class="w-8 h-8 rounded-full" />
			</div>
		</a>
	{:else}
		<a href="/login" class="text-yellow-500">Entrar</a> <!-- Link para login caso o usuário não esteja logado -->
	{/if}

	<!-- Botão para abrir/fechar o menu (hamburguer) para mobile -->
	<button on:click={toggleMenu} class="lg:hidden text-yellow-500 focus:outline-none" aria-label="toggle menu">
		{#if !isOpen}
			<!-- Ícone de hambúrguer -->
			<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
			</svg>
		{:else}
			<!-- Ícone de fechar (X) -->
			<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{/if}
	</button>

	<!-- Menu Estilo "Carro Chegando no Centro" para dispositivos móveis -->
	<div class={`z-50 mt-[5rem] menu-carro ${isOpen ? 'menu-visible' : 'menu-fade-out'}`}>
		<div class="flex flex-col items-center pt-4">
			{#each items as item}
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a
					href="#"
					class="block px-4 py-2 text-black text-lg font-medium transition-colors duration-300 hover:bg-gray-100"
					on:click={() => handleNavigation(item)}
				>
					{item.label}
				</a>
			{/each}
		</div>
		<div class="mt-4 px-4">
			<Pesquisa />
		</div>
		<!-- Rodas do "carro" -->
		<div class="rodas left"></div>
		<div class="rodas right"></div>
	</div>
</nav>
