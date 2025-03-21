<script lang="ts">
	import negocio from '$lib/images/negocio.png';
	import Footer from './../lib/componets/Footer.svelte';
	import { goto } from '$app/navigation';
	import { persistenciaUser } from '$lib/services/authService.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../app.scss';
	import type { LayoutData } from './$types';
	import Pesquisa from '$lib/componets/pesquisa.svelte';
	import { setLastPathUrl, getCookie } from '$lib/utils/cookies';
	import { userStore } from '../stores/userStore.svelte';
	import { page } from '$app/stores';
	import img from '$lib/images/new.png';
	import Darkmod from '$lib/componets/Darkmod.svelte';
	import { useAuthPersistence } from '$lib/hooks/useAuthPersistence';

	// Import Lucide icons
	import {
		Home,
		Bell,
		ShoppingBag,
		MessageSquare,
		AlertTriangle,
		HelpCircle,
		Rss,
		Tag,
		Menu,
		X,
		LogIn
	} from 'lucide-svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let user = data?.user;
	let authInitialized = false;
	let isOpen = $state(false);
	let currentUser = $derived(userStore.value);
	console.log('foto testtttttttttttttttt', currentUser);

	// onMount(async () => {

	// });

	let navItemsLogado = [
		{ name: 'Inicio', href: '/', icon: Home },
		{ name: 'Atualizações', href: '/noticias', icon: Bell },
		{ name: 'Comércios', href: '/comercios', icon: ShoppingBag },
		{ name: 'Mural', href: '/mural', icon: MessageSquare },
		{ name: 'Avisos', href: '/quadroAvisos', icon: AlertTriangle },
		{ name: 'Suporte', href: '/suporte', icon: HelpCircle },
		{ name: 'Feeds', href: '/inicio', icon: Rss },
		{ name: 'Anúncios', href: '/Anuncios-Promocao', icon: Tag }
	];

	let navItems = [
		{ name: 'Inicio', href: '/', icon: Home },
		{ name: 'Atualizações', href: '/noticias', icon: Bell },
		{ name: 'Comércios', href: '/comercios', icon: ShoppingBag },
		{ name: 'Mural', href: '/mural', icon: MessageSquare },
		{ name: 'Avisos', href: '/quadroAvisos', icon: AlertTriangle },
		{ name: 'Anúncios', href: '/Anuncios-Promocao', icon: Tag }
	];

	const items = [
		{ name: 'Inicio', href: '/', icon: Home },
		{ href: '/inicio', label: 'Feed', icon: Rss },
		{ href: '/comercios', label: 'Comercios', icon: ShoppingBag }
	];

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
	onMount(async () => {
		// Autenticação na montagem do componente
		authInitialized = await useAuthPersistence();
		console.log('Autenticação inicializada:', authInitialized ? 'Sucesso' : 'Não autenticado');
		// Verificar se a rota atual exige login
		const paginasProtegidas = ['/perfil', '/inicio', '/perfil']; // Defina as rotas protegidas
		const rotaAtual = window.location.pathname;
		const rotaProtegida = paginasProtegidas.includes(rotaAtual);

		if (rotaProtegida) {
			// Se a rota exige login e não autenticou, redirecionar
			if (!authInitialized && !userStore.isAuthenticated()) {
				console.log('Redirecionando para login - Rota protegida:', rotaAtual);
				goto('/login');
			} else {
				console.log('Usuário autenticado em rota protegida:', userStore.value);
			}
		}

		// Salvar última URL para redirecionamento após login
		setLastPathUrl($page.url.pathname);
		setLastPathUrl($page.url.pathname);
		manipularMenu();
	});
	
	const manipularMenu = () => {
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
	}

	// Fecha o menu ao clicar fora
	// onMount(() => {});
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
	<div class="relative mx-auto max-w-6xl">
		<nav class="z-30 flex h-16 w-full items-center justify-between bg-opacity-5 px-2">
			<!-- Logo -->
			<div
				class="absolute left-0 mx-auto mt-[20px] flex h-20 w-full items-center justify-center border-gray-300 md:relative md:mx-0 md:w-auto"
			>
				<a href="/" class="flex w-[50px] items-center justify-center">
					<!-- svelte-ignore component_name_lowercase -->
					<img src={negocio} alt="imagem-logo" class="mb-6 flex w-[45px]" />
				</a>
			</div>

			<div class="flex w-full items-center justify-between gap-4 md:w-auto">
				<div
					class="duration-5 absolute inset-x-0 top-[70px] z-10 mx-0 flex w-full flex-row bg-opacity-100 pt-12 transition-all ease-in-out sm:top-[44px] md:relative
					md:top-0 md:w-full md:translate-x-0 md:items-center md:justify-end md:bg-transparent md:p-0 md:pt-0 md:opacity-100
					{[
						isOpen
							? 'z-50 h-full translate-x-0 flex-col gap-4 bg-black bg-opacity-80 dark:bg-background dark:bg-opacity-70'
							: '-translate-x-full opacity-0 md:gap-2'
					]}"
				>
					<div
						class="absolute top-0 flex w-full justify-center bg-secondary-foreground py-2.5 uppercase text-yellow-400 md:hidden"
					>
						<h2 class="text-xl font-bold">menu navegação</h2>
					</div>
					{#each currentUser.name ? navItemsLogado : navItems as item}
						<a
							href={item.href}
							class="lg:max-sm:w-[96px] w-full {$page.url.pathname === item.href
								? 'bg-yellow-400'
								: 'bg-purple-200'} py-2 text-center font-['Inter']
							text-[12px] font-semibold text-purple-950 transition-colors
							hover:no-underline hover:opacity-80 sm:min-w-[90px] sm:rounded-sm md:min-w-20 md:p-1 lg:w-auto"
						>
							<!-- Horizontal layout: icon then name -->
							<div class="flex flex-row items-center justify-center gap-1">
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={item.icon} class="h-3.5 w-3.5" />
								<span>{item.name}</span>
							</div>
						</a>
					{/each}
				</div>
				<div class="z-20">
					<!-- Verifica se o usuário está logado e exibe a foto do perfil -->
					{#if !!currentUser.photoURL}
						<a href="/perfil">
							<div class="flex min-w-8 items-center">
								<!-- svelte-ignore component_name_lowercase -->
								<!-- svelte-ignore event_directive_deprecated -->
								<img
									src={currentUser.photoURL || '/placeholder.svg'}
									alt="Foto de perfil"
									class="h-8 w-8 rounded-full object-cover"
									on:load={() => console.log('Foto de perfil carregada com sucesso')}
									on:error={() => {
										console.log('Erro ao carregar foto de perfil');
										// Note: Não podemos atribuir this.src diretamente em Svelte
										// Precisaria usar bind:this para acessar o elemento
									}}
								/>
							</div>
						</a>
					{:else}
						<div class="flex items-center rounded-md bg-secondary-foreground bg-opacity-60 p-1.5">
							<a href="/login" class="flex items-center gap-1 text-secondary">
								<LogIn class="h-3.5 w-3.5" />
								<span>Entrar</span>
							</a>
						</div>
					{/if}
				</div>

				<div class="hidden md:block">
					<Darkmod />
				</div>

				<!-- svelte-ignore event_directive_deprecated -->
				<button
					on:click={toggleMenu}
					class="z-20 rounded-sm bg-secondary-foreground bg-opacity-60 p-1 text-secondary focus:outline-none md:hidden"
					aria-label="toggle menu"
				>
					{#if !isOpen}
						<!-- Ícone de hambúrguer usando Lucide -->
						<Menu class="h-8 w-8" />
					{:else}
						<!-- Ícone de fechar (X) usando Lucide -->
						<X class="h-8 w-8" />
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

	<Footer />
</div>

<style>
	/* Mobile menu styles */
	@media (max-width: 768px) {
		/* For mobile, keep the vertical layout */
		a div {
			flex-direction: column !important;
			gap: 0.25rem !important;
		}
	}
</style>
