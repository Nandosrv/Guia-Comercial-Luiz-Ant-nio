<script lang="ts">
	import negocio from '$lib/images/negocio.png';
	import Footer from './../lib/componets/Footer.svelte';
	import { goto } from '$app/navigation';
	import { persistenciaUser } from '$lib/services/authService.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../app.scss';
	import type { LayoutData } from './$types';
	import Pesquisa from '$lib/componets/pesquisa.svelte';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { userStore } from '../stores/userStore.svelte';
	import { page } from '$app/stores';
	import img from '$lib/images/new.png';
	import Darkmod from '$lib/componets/Darkmod.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let user = data?.user;
	
	onMount(async () => {
		if (!!user?.email) {
			try {
				await persistenciaUser(user, true);
			} catch (error) {
				goto('/');
			}
			goto(data.pathUrl!);
		} else {
			goto('/');
		}
	});

	let navItemsLogado = [
		{ name: 'Inicio', href: '/' },

		{ name: 'Atualizações', href: '/noticias' },
		{ name: 'Comércios', href: '/comercios' },
		// { name: 'Eventos', href: '/NewEventos' },
		{ name: 'Mural', href: '/mural' },
		// { name: 'Ofertas da Semana', href: '/OfertasDaSemana'},
		{ name: 'Avisos', href: '/quadroAvisos' },
		{ name: 'Suporte', href: '/suporte' },
		{ name: 'Feeds', href: '/inicio' },
		// { name: 'Anúncios', href: '/anuncios-luiz-antonio' }
		{ name: 'Anúncios', href: '/Anuncios-Promocao' }
	];

	let navItems = [
		{ name: 'Inicio', href: '/' },

		{ name: 'Atualizações', href: '/noticias' },
		{ name: 'Comércios', href: '/comercios' },
		// { name: 'Eventos', href: '/NewEventos' },
		{ name: 'Mural', href: '/mural' },
		// { name: 'Ofertas da Semana', href: '/OfertasDaSemana'},
		{ name: 'Avisos', href: '/quadroAvisos' },
		// { name: 'Anúncios', href: '/anuncios-luiz-antonio' }
		{ name: 'Anúncios', href: '/Anuncios-Promocao' }

	];

	const items = [
		{ name: 'Inicio', href: '/' },
		{ href: '/inicio', label: 'Feed' },
		{ href: '/comercios', label: 'Comercios' }
	];

	let isOpen = $state(false);
	let currentUser = $derived(userStore.value);
	// $inspect('opop: ', currentUser.photoURL);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	// Verifica login ao clicar no "Feed"
	function handleNavigation(item: { href: any; label: any }) {
		if (item.label === 'Feed' && !currentUser.photoURL) {
			// Redireciona para login se não estiver logado
			goto('/login');
		} else {
			// Redireciona para a página clicada
			goto(item.href);
			closeMenu();
		}
	}

	// Fecha o menu ao clicar fora
	onMount(() => {
		setLastPathUrl($page.url.pathname);
		function handleClickOutside(event: MouseEvent) {
			if (isOpen && !(event.target as HTMLElement).closest('.menu-carro')) {
				setTimeout(() => {
					closeMenu();
				}, 20);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

<div class="relative z-0 m-auto h-full min-h-screen w-full justify-between">
	<div class="absolute left-0 top-0 -z-10 h-80 w-full bg-foreground sm:h-72 md:h-96">
		<!-- svelte-ignore component_name_lowercase -->
		<img
			class="h-full w-full object-cover"
			src="https://www.abagrp.org.br/uploads/pagina/elemento/campo/2019/01/6Rm4mr2kkaylCGgT/anfiteatro-1030x579_1920x540.jpeg"
			alt=""
		/>
	</div>
	<div class="relative mx-auto max-w-6xl ">
		<nav
			class="z-30 flex h-16 w-full  items-center justify-between bg-opacity-5 px-2"
		>
			<!-- Logo -->
			<div
				class="absolute left-0 mt-[20px] mx-auto flex h-20 w-full items-center justify-center border-gray-300 md:relative md:mx-0 md:w-auto"
			>
				<a href="/" class="flex justify-center items-center w-[50px]">
					<!-- svelte-ignore component_name_lowercase -->
					<!-- <img src={negocio} alt="Logo" class="mb-6 flex w-28 md:w-[80px] md:min-w-[80px]" />
					  -->
					<img src="{negocio} " alt="imagem-logo" class="mb-6 flex w-[45px]" />
				</a>
			</div>

			<div class="flex w-full items-center justify-between gap-4 md:w-auto">
				<div
				class="duration-5 sm:top-[44px]flex-row absolute inset-x-0 top-[70px] z-10 mx-0 flex w-full bg-opacity-100 pt-12 transition-all ease-in-out md:relative
				md:top-0 md:w-full md:translate-x-0 md:items-center md:justify-end md:bg-transparent md:p-0 md:pt-0 md:opacity-100
				{[
						isOpen
						? 'z-50 h-full translate-x-0 flex-col gap-4 bg-black bg-opacity-80 dark:bg-background dark:bg-opacity-70'
						: '-translate-x-full opacity-0 md:gap-2'
					]}
			 "
			 >
			 <div
			 class="absolute top-0 flex w-full justify-center bg-secondary-foreground py-2.5 uppercase text-yellow-400 md:hidden"
			 >
			 <h2 class="text-xl font-bold">menu navegação</h2>
			</div>
			{#each currentUser.name ? navItemsLogado : navItems as item}
			{#if $page.url.pathname === item.href}
			<a
			href={item.href}
			class="lg:max-sm:w-[96px] w-full bg-yellow-400 py-4 text-center font-['Inter']
			text-[12px] font-semibold text-purple-950 transition-colors
			hover:no-underline hover:opacity-80 sm:min-w-[90px] sm:rounded-sm md:min-w-24 md:p-1 lg:w-[90px]"
							>
							<span>{item.name}</span>
							</a>
						{:else}
						<a
						href={item.href}
						class="lg:max-sm:w-[96px] w-full bg-purple-200 py-4 text-center font-['Inter']
						text-[12px] font-semibold text-purple-950 transition-colors
						hover:no-underline hover:opacity-80 sm:min-w-[90px] sm:rounded-sm md:min-w-24 md:p-1 lg:w-[90px]"
						>
						<span>{item.name}</span>
					</a>
					{/if}
					{/each}
				</div>
				<div class="z-20">
					<!-- Verifica se o usuário está logado e exibe a foto do perfil -->
					{#if !!currentUser.photoURL}
					<a href="/perfil">
						<div class="flex min-w-8 items-center">
							<!-- svelte-ignore component_name_lowercase -->
							<img src={currentUser.photoURL} alt="Foto de perfil" class="h-8 w-8 rounded-full" />
								<!-- <span class="ml-2 text-yellow-500">{currentUser.name}</span> -->
							</div>
						</a>
						{:else}
						<div class="flex items-center rounded-md bg-secondary-foreground bg-opacity-60 p-1.5">
							<a href="/login" class="text-secondary">Entrar</a>
						</div>
						<!-- Link para login caso o usuário não esteja logado -->
					{/if}

					<!-- Botão para abrir/fechar o menu (hamburguer) para mobile -->
				</div>

				<div class="hidden md:block">
				<Darkmod />

				</div>

				<button
					onclick={toggleMenu}
					class="z-20 rounded-sm bg-secondary-foreground bg-opacity-60 p-1 text-secondary focus:outline-none md:hidden"
					aria-label="toggle menu"
				>
					{#if !isOpen}
						<!-- Ícone de hambúrguer -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
						</svg>
					{:else}
						<!-- Ícone de fechar (X) -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{/if}
				</button>
			</div>
		</nav>
		<div class="flex h-12 w-full items-center justify-center">
			<Pesquisa />
		</div>

		<main class="z-0 h-full w-full">
			{@render children()}
		</main>
	</div>

	<!-- <footer class="flex h-16 items-center justify-center bg-purple-950/100 text-purple-900">
		<p class="text-center">© 2021 - Todos os direitos reservados</p>
	</footer> -->
	<Footer />
</div>

<style>
	/* Estilos para o menu "carro" (para mobile) */
	/* .menu-carro {
		position: absolute;
		top: 20%;
		left: 50%;
		width: 300px;
		height: 250px;
		background-color: #edf3ee;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transform: translate(-50%, 0) scale(0);
		transition:
			transform 1s cubic-bezier(0.25, 1.5, 0.5, 1),
			opacity 1s ease;
	} */

	/* .menu-visible {
		opacity: 1;
		transform: translate(-50%, 0) scale(1);
	} */

	/* Outros estilos permanecem os mesmos... */
</style>
