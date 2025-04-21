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
	import { fly } from 'svelte/transition';
	import { toastStore } from '$lib/utils/toast';
	import { toasts, ToastContainer, FlatToast, BootstrapToast }  from "svelte-toasts";


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
		LogIn,
		Search
	} from 'lucide-svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let user = data?.user;
	let authInitialized = false;
	let isOpen = $state(false);
	let currentUser = $derived(userStore.value);
	let isMobile = $state(false);

	onMount(() => {
		// Verificar se é dispositivo móvel
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
	
	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

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


	const showToast = () => {
        // const toast = toasts.add({
        //     title: 'Message title',
        //     description: 'Message body',
        //     duration: 10000, // 0 or negative to avoid auto-remove
        //     placement: 'bottom-right',
        //     type: 'success',
        //     theme: 'dark',
        //     onClick: () => {},
        //     onRemove: () => {}
        //     // component: BootstrapToast, // allows to override toast component/template per toast
        // });
        // toast.remove()
		toasts.success('teste')
		
    };
</script>

<!-- Toast Notifications Container -->

<div class="relative z-0 m-auto h-full min-h-screen w-full justify-between bg-secondary dark:bg-secondary">

	<!-- Background com foto para mobile e desktop -->
	<div class="absolute left-0 top-0 -z-10 w-full bg-header-gradient">
		<!-- Imagem de fundo para mobile e desktop -->
		<!-- svelte-ignore component_name_lowercase -->
		<img
			class="h-64 w-full object-cover brightness-[0.75] md:h-40 md:brightness-[0.6]"
			src="https://www.abagrp.org.br/uploads/pagina/elemento/campo/2019/01/6Rm4mr2kkaylCGgT/anfiteatro-1030x579_1920x540.jpeg"
			alt="Vista de Luiz Antônio"
		/>
		<!-- Overlay decorativo sobre a foto -->
		<div class="absolute inset-0 h-full w-full bg-pattern opacity-20"></div>
	</div>
	
	<div class="relative mx-auto max-w-6xl">
		<!-- Cabeçalho - Redesenhado -->
		<header class="z-30 py-4 px-4 md:py-6">
			<nav class="flex items-center justify-between">
			<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="flex items-center gap-2">
						<!-- svelte-ignore component_name_lowercase -->
						<img src={negocio} alt="Logo Guia Comercial" class="w-10 md:w-12" />
						<div class="hidden md:block">
							<span class="text-lg font-bold text-white dark:text-blue-400">Guia Comercial</span>
							<span class="ml-1 text-sm font-semibold text-white dark:text-white">Luiz Antônio</span>
						</div>
				</a>
			</div>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center space-x-1">
					{#each currentUser.name ? navItemsLogado : navItems as item}
						<a
							href={item.href}
							class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
							{$page.url.pathname === item.href
								? 'bg-blue-100/30 text-white dark:bg-blue-900/40 dark:text-blue-300'
								: 'text-white hover:bg-gray-100/20 dark:text-gray-300 dark:hover:bg-gray-800/60'}"
						>
							<!-- svelte-ignore svelte_component_deprecated -->
							<svelte:component this={item.icon} class="h-4 w-4" />
								<span>{item.name}</span>
						</a>
					{/each}
				</div>
				
				<!-- Actions -->
				<div class="flex items-center gap-2 md:gap-4">
					<!-- User Profile / Login -->
				<div class="z-20">
					{#if !!currentUser.photoURL}
							<a href="/perfil" class="flex items-center">
								<div class="h-9 w-9 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
								<!-- svelte-ignore component_name_lowercase -->
								<img
									src={currentUser.photoURL || '/placeholder.svg'}
									alt="Foto de perfil"
										class="h-full w-full object-cover"
								/>
							</div>
						</a>
					{:else}
							<a 
								href="/login" 
								class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
							>
								<LogIn class="h-4 w-4" />
								<span>Entrar</span>
							</a>
					{/if}
				</div>

					<!-- Dark Mode Toggle -->
				<div class="hidden md:block">
					<Darkmod />
				</div>

					<!-- Mobile Menu Button -->
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					onclick={toggleMenu}
						class="inline-flex items-center justify-center p-2 rounded-lg text-white dark:text-gray-300 hover:bg-gray-100/20 dark:hover:bg-gray-800/60 focus:outline-none md:hidden"
						aria-label="Menu"
				>
					{#if !isOpen}
							<Menu class="h-6 w-6" />
					{:else}
							<X class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</nav>
		</header>
		
		<!-- Barra de Pesquisa - Redesenhada -->
		<div class="relative z-20 px-4 -mt-2 md:mt-0 mb-4 max-w-xl mx-auto">
			<Pesquisa />
		</div>

		<!-- Mobile Menu Overlay -->
		{#if isOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore event_directive_deprecated -->
			<div class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" onclick={closeMenu}></div>
		{/if}
		
		<!-- Mobile Navigation Menu -->
		<div class="fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden {isOpen ? 'translate-x-0' : 'translate-x-full'}">
			<div class="flex flex-col h-full">
				<div class="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
					<h3 class="text-lg font-bold text-white dark:text-white">Menu</h3>
				</div>
				
				<div class="flex-1 overflow-y-auto py-4">
					<div class="px-2 space-y-1">
						{#each currentUser.name ? navItemsLogado : navItems as item}
							<!-- svelte-ignore event_directive_deprecated -->
							<a
								href={item.href}
								class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200
								{$page.url.pathname === item.href
									? 'bg-blue-100/30 text-white dark:bg-blue-900/40 dark:text-blue-300'
									: 'text-black hover:bg-gray-100/20 dark:text-gray-300 dark:hover:bg-gray-800/60'}"
								onclick={closeMenu}
							>
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={item.icon} class="h-5 w-5" />
								<span>{item.name}</span>
							</a>
						{/each}
					</div>
				</div>
				
				<div class="p-4 border-t border-gray-200 dark:border-gray-800">
					<div class="flex items-center justify-between">
						<span class="text-sm text-white dark:text-gray-400">Tema</span>
						<Darkmod />
					</div>
				</div>
			</div>
		</div>

		<main class="z-0 h-full w-full pt-4 md:pt-0">
			{@render children()}
		</main>
	</div>

	<Footer />
</div>


<style>
	/* Gradiente para o cabeçalho no desktop */
	.bg-header-gradient {
		background: linear-gradient(to bottom, #1e40af, #3b82f6);
	}
	
	/* Padrão decorativo para o fundo do cabeçalho */
	.bg-pattern {
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
	}
	
	/* Ajustes responsivos */
	@media (max-width: 768px) {
		/* Espaçamento para menu fixo inferior em mobile */
	}

</style>
