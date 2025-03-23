<script lang="ts">
	import Quemsomos from './../lib/componets/quemsomos.svelte';
	import Carrossel from './../lib/componets/carrossel.svelte';
	import Darkmod from './../lib/componets/Darkmod.svelte';
	import Anuncio from './../lib/componets/anuncio.svelte';
	import Call from './../lib/componets/call.svelte';
	import Footer from '$lib/footer/+page.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	
	// Import Lucide icons
	import { 
		ChevronLeft, 
		ChevronRight, 
		FileText, 
		Star, 
		Info, 
		ShoppingBag, 
		Phone, 
		MessageSquare, 
		ArrowUp,
		Calendar,
		Bell,
		Tag,
		AlertTriangle,
		Newspaper,
		Store,
		MapPin,
		Clock,
		Award
	} from 'lucide-svelte';
	
	// img
	import Pink from '$lib/images/anuncui2.png';
	import Comu from '$lib/images/comu.png';
	import Postnew from '$lib/images/Posta.png';
	import Story from '$lib/images/Posta.png';

	import { page } from '$app/stores';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import SistemadeAnuncio from '$lib/componets/SistemadeAnuncio.svelte';
	import Card from '$lib/componets/Card/Card.svelte';
	import MarqueeSlider from '$lib/componets/MarqueeSlider.svelte';
	import iconhome from '$lib/images/Iconhome.webp';
	import Adicionar from '$lib/componets/Adicionar.svelte';
	import ondontolo from '$lib/images/ondontolo.png';
	import gelindo from '$lib/images/gelindo.png';
	import Hotel from '$lib/images/Hotel-Vero-Verde.png';
	import paginasite from '$lib/images/paginasite1.png';
	import Dell from '$lib/images/dall.webp';
	import banerinfo from '$lib/images/banerinfo.png';
	

	import fotohometre from '$lib/images/fotohometre.png';
	// video
	import Reds from '$lib/images/redsgit.gif';
	import CardsPremio from '$lib/componets/CardsPremio.svelte';
	import dall from '$lib/images/dall.webp';
	import ScrollTo from '$lib/componets/scrollTo.svelte';

	// Folhetos
	import folheto1 from '$lib/images/cardfolheto2.jpg';
	import fernandes from '$lib/images/z.jpeg';
	import Cardfolheto from '$lib/componets/Cardfolheto.svelte';
	// Mercados Fernandes

	// Banner
	import bannerseguro from '$lib/images/Bannerseguro.png';

	// iconnav
	import icons10 from '$lib/images/icons8-shop-50.png';
	import odontolon from '$lib/images/odontologia.jpg';
	import odon from '$lib/images/ond.jpg';

	onMount(() => {
		setLastPathUrl($page.url.pathname);
	});

	interface SliderItem {
		title: string;
		description: string;
		image: string;
		link: string;
	}

	const sliderItems: SliderItem[] = [
		{
			title: 'Manutenção Programada (22/12/2024)',
			description: 'Manutenção em andamento',
			image: Postnew,
			link: '/noticias'
		},
		{
			title: 'Manutenção Programada (22/12/2024)',
			description: 'Manutenção Programada',
			image: Comu,
			link: '/noticias'
		},
		{
			title: 'Avalie Nosso Site',
			description: 'Estamos implementando novas funcionalidades',
			image: Pink,
			link: '/avalie'
		}
	];

	const isMenuOpen = writable(false);
	const currentSlide = writable(0);

	onMount(() => {
		const timer = setInterval(() => {
			currentSlide.update((prevSlide) => (prevSlide + 1) % sliderItems.length);
		}, 5000);
		return () => clearInterval(timer);
	});

	
	function nextSlide() {
		currentSlide.update((prevSlide) => (prevSlide + 1) % sliderItems.length);
	}

	function prevSlide() {
		currentSlide.update((prevSlide) => (prevSlide - 1 + sliderItems.length) % sliderItems.length);
	}
</script>

<div class="hidden">
	<div class="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
		<!-- Header Logo -->
		<div class="relative flex h-20 items-center justify-center bg-blue-900/50 md:h-32">
			<h1 class="text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
				encontre Luiz Antônio
			</h1>
		</div>


		<!-- Main Content -->
		<main class="mx-auto flex max-w-7xl flex-col items-center justify-center px-43 py- ">
			<div class="flex flex-wrap justify-center gap-8">
				<!-- Main Content Area -->

				<div class="flex w-[100%] flx-col items-center justify-center lg:col-span-2">
					<!-- Featured Banner Slider -->
					<!-- Featured Banner Slider -->
					<div
						class="slider border-1-2 relative mb-8 w-[100%] gap-7 rounded-[12px] border-[#09052D] bg-black/60 object-cover lg:h-[500px] lg:w-[91%]"
					>
						<div class="slider-items flex" style="transform: translateX(-{$currentSlide * 100}%);">
							{#each sliderItems as item, index}
								<div class="slider-item relative">
									<a href={item.link}>
										<!-- Adiciona o link correspondente -->
										<img
											src={item.image || "/placeholder.svg"}
											alt={item.title}
											class="bg-conver h-[320px] w-[100%] cursor-pointer bg-cover bg-center brightness-75 lg:h-[500px]"
										/>
									</a>
									<div></div>
									<div class="absolute inset-0 top-[200px] lg:top-[300px]">
										<div class="flex h-full flex-col justify-center p-4 md:p-8">
											<a href={item.link}>
												<!-- Mesmo link utilizado aqui -->
												<h2 class="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl">
													{item.title}
												</h2>
											</a>
											<p class="text-sm text-gray-200 md:text-base">
												{item.description}
											</p>
										</div>
									</div>
								</div>
							{/each}
						</div>

						<button
							on:click={prevSlide}
							class="slider-button prev-button"
							aria-label="Previous slide"
						>
							<ChevronLeft class="h-6 w-6" />
						</button>
						<button on:click={nextSlide} class="slider-button next-button" aria-label="Next slide">
							<ChevronRight class="h-6 w-6" />
						</button>
					</div>

					<!-- News Section -->
					<div class="space-y-4 rounded-[12px]">
						{#each [{ type: 'Manutenção', title: 'Manutenção (25/11/24)', description: ' Estamos atualizando nosso sistema para melhorar a experiência do usuário e corrigir erros identificados.	', date: '25/12/2024', icon: AlertTriangle }, { type: 'Notícias', title: 'Notas de Atualização (26/11/24)', description: ' A atualização do banco de dados foi concluída com sucesso. Isso nos permitirá oferecer um serviço mais rápido e preciso. Aproveite as melhorias no sistema! 05/11/2024!', date: '26/11/2024', icon: Bell }, { type: 'Eventos', title: 'Avalie nosso site', description: 'Queremos saber sua opinião! Avalie a experiência em nosso site e nos ajude a melhorar a cada dia. Seu feedback é fundamental para oferecer o melhor conteúdo e usabilidade', date: '19/11/2024', icon: Calendar }] as item}
							<div class="rounded-[12px] border-blue-800/50 bg-black/40 p-4">
								<div
									class="mb-2 flex flex-col items-start justify-between md:flex-row md:items-center"
								>
									<span
										class={`rounded px-2 py-1 text-xs ${item.type === 'Eventos' ? 'bg-green-600' : 'bg-red-600'} mb-2 text-white md:mb-0 flex items-center gap-1`}
									>
										<svelte:component this={item.icon} class="h-3 w-3" />
										{item.type}
									</span>
									<span class="text-sm text-gray-400 flex items-center gap-1">
										<Clock class="h-3 w-3" />
										{item.date}
									</span>
								</div>
								<a href="/noticias">
									<h3 class="mb-2 font-serif font-semibold text-white hover:text-blue-500">
										{item.title}
									</h3>
								</a>
								<p class="text-sm text-gray-300">{item.description}</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Sidebar -->
			</div>
		</main>
	</div>
	<main
		class="flex w-full flex-col items-center justify-center gap-7 bg-gradient-to-br from-blue-900 to-blue-800"
	>
		<div
			class="max-sm:w-[92%] flex h-[100px] w-full flex-col items-center justify-center rounded-[12px] border border-black bg-black/40 p-4 md:w-[53%]"
		>
			<h1 id="art-destaques" class="flex text-2xl font-bold tracking-wider text-white md:text-4xl">
				<Star class="h-6 w-6 mr-2" /> Destaques Da Semana
			</h1>
			<p>⭐⭐⭐⭐⭐</p>
		</div>
		<div
			class="ml max-sm:w-[92%] flex w-[53%] flex-col items-center justify-center rounded-[12px] bg-black/40 p-4"
		>
			<!-- <OfertaProfissional /> -->
		</div>
		<!-- <Footer /> -->
	</main>
</div>
<div class="hidden">
	<!-- Provisorio -->
	<section class="z-0 flex min-h-[calc(100vh-80px)] flex-col gap-7">
		<div
			class="mx-h-[254px] relative flex h-[200px] w-full flex-col items-center rounded-lg bg-secondary opacity-60 dark:bg-opacity-60 sm:h-[154px] sm:justify-between md:h-[254px] md:flex-row"
		>
			<div
				class="flex h-40 w-full flex-col items-center justify-center gap-2 text-muted md:h-full md:w-[50%]"
			>
				<h1
					class="w-[75%] text-justify text-xl font-semibold text-secondary-foreground sm:text-lg md:w-[75%] md:text-2xl lg:w-[85%] lg:text-3xl"
				>
					Bem vindo ao classificados de comércios em Luiz Antonio SP
				</h1>
			</div>
			<div
				class="flex h-40 w-full items-center justify-center gap-2 p-4 text-muted sm:flex-col md:h-full md:w-[50%]"
			>
				<li class="w-[70%] p-4 font-light text-secondary-foreground sm:p-0 md:text-xl lg:text-2xl">
					<Store class="h-5 w-5 inline mr-2" />
					Encontre todos os comercios em um único lugar
				</li>

				<li class="w-[70%] p-4 font-light text-secondary-foreground sm:p-0 md:text-xl lg:text-2xl">
					<Newspaper class="h-5 w-5 inline mr-2" />
					Leia as notícias mais recentes da cidade
				</li>
			</div>
		</div>
		<!-- Part Do Anuncio -->
		<main
			class="container mx-auto rounded-lg border border-secondary-foreground bg-white px-4 py-8 transition-colors duration-300 dark:border-secondary-foreground dark:bg-secondary"
		>
			<div class="h-[100px] w-full justify-center">
				<p></p>
			</div>
			<SistemadeAnuncio />
			<Call />
		</main>
	</section>
</div>

<main class="w-full items-center justify-center">
	<ScrollTo />

	<!-- Header Hero Section - Novo e Moderno -->
	<section class="relative w-full min-h-[90vh] md:h-[80vh] overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
		<!-- Overlay Pattern -->
		<div class="absolute inset-0 opacity-10 z-0 pattern-overlay"></div>
		
		<div class="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 py-8 md:py-0">
			<div class="text-center mb-6 transform transition-all duration-700 translate-y-0 opacity-100">
				<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
					<span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200">Guia Comercial</span>
					<br/>Luiz Antônio
				</h1>
				<p class="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-blue-100 max-w-2xl mx-auto mb-6 px-2">
					Conectamos você aos melhores negócios da cidade em um único lugar
				</p>
				
				<!-- Estatísticas -->
				<div class="flex flex-wrap justify-center gap-4 md:gap-8 my-4 md:my-6">
					<div class="flex flex-col items-center">
						<span class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">50+</span>
						<span class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Comércios cadastrados</span>
					</div>
					<div class="flex flex-col items-center">
						<span class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">10+</span>
						<span class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Categorias disponíveis</span>
					</div>
					<div class="flex flex-col items-center">
						<span class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">1000+</span>
						<span class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Visitantes mensais</span>
					</div>
				</div>
			</div>
			
			<div class="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 w-full max-w-md mx-auto">
				<a href="/comercios" class="px-4 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
					<Store class="h-5 w-5" />
					<span>Explorar Comércios</span>
				</a>
				<a href="/Anuncios-Promocao" class="px-4 sm:px-8 py-3 bg-gray-500/10 backdrop-blur-sm text-gray-700 dark:text-white border border-gray-300 dark:border-white/30 font-semibold rounded-full transform transition-all duration-300 hover:bg-gray-500/20 hover:scale-105 flex items-center justify-center gap-2">
					<Tag class="h-5 w-5" />
					<span>Anuncie seu Negócio</span>
				</a>
			</div>
			
			<!-- Badges -->
			<div class="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8 px-2">
				<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					Atualizado diariamente
				</span>
				<span class="bg-green-100 text-green-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
					</svg>
					100% Seguro
				</span>
				<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
						<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
					</svg>
					Compatível com dispositivos
				</span>
			</div>
		</div>
		
		<!-- Wave bottom effect -->
		<div class="absolute bottom-0 left-0 w-full">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
				<path fill="#ffffff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
			</svg>
		</div>
	</section>

	<!-- Nav artigo - Redesenhado -->
	<div class="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
		<nav class="container mx-auto flex items-center justify-between py-3 px-4">
			<div class="flex items-center space-x-1">
				<a href="/" class="flex items-center space-x-2">
					<span class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Encontre<span class="text-blue-600">LA</span></span>
				</a>
			</div>
			
			<div class="hidden md:flex items-center space-x-6">
				<a href="#art-comercios" class="relative text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
					<Store class="h-4 w-4" />
					<span>Comércios</span>
				</a>
				<a href="#art-folhetos" class="relative text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
					<FileText class="h-4 w-4" />
					<span>Folhetos</span>
				</a>
				<a href="#art-destaque" class="relative text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
					<Star class="h-4 w-4" />
					<span>Destaques</span>
				</a>
				<a href="#art-somos" class="relative text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
					<Info class="h-4 w-4" />
					<span>Sobre</span>
				</a>
			</div>
			
			<div class="flex items-center space-x-3">
				<Darkmod />
				<a href="/Anuncios-Promocao" class="hidden md:inline-flex px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-200">
					Anunciar
				</a>
			</div>
		</nav>
		
		<!-- Mobile Nav Menu -->
		<div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100 dark:border-gray-800">
			<div class="flex w-full justify-between px-2 py-2">
				<a href="#art-comercios" class="flex flex-col items-center text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-2">
					<Store class="h-5 w-5 mb-1" />
					<span>Comércios</span>
				</a>
				<a href="#art-folhetos" class="flex flex-col items-center text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-2">
					<FileText class="h-5 w-5 mb-1" />
					<span>Folhetos</span>
				</a>
				<a href="#art-destaque" class="flex flex-col items-center text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-2">
					<Star class="h-5 w-5 mb-1" />
					<span>Destaques</span>
				</a>
				<a href="#art-somos" class="flex flex-col items-center text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-2">
					<Info class="h-5 w-5 mb-1" />
					<span>Sobre</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Div slides do Anuncio - Melhorado -->
	<div class="bg-gradient-to-r from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800">
		<div class="container mx-auto">
			<div class="flex h-[50px] items-center overflow-hidden text-black dark:text-white">
				<MarqueeSlider />
			</div>
		</div>
	</div>
	
	<!-- Folhetos - Redesenhado -->
	<section id="art-folhetos" class="py-8 md:py-16 bg-white dark:bg-gray-900">
		<div class="container mx-auto px-4">
			<div class="text-center mb-8 md:mb-12">
				<span class="inline-block py-1 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium mb-3">Promoções Atualizadas</span>
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
					<FileText class="h-6 w-6 md:h-8 md:w-8 inline-block text-blue-600 mr-2" />
					Folhetos dos Mercados
				</h2>
				<p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-base md:text-lg px-2">
					Confira as ofertas mais recentes dos supermercados da cidade e economize nas suas compras.
				</p>
			</div>
			
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				<Cardfolheto />
			</div>
		</div>
	</section>

	<!-- Div 50% de imagens -->
	<div class="w-full flex-wrap sm:flex lg:flex">
		<div
			class="flex h-[300px] sm:h-[350px] md:h-[400px] w-full items-center justify-center bg-gray-100 dark:bg-gray-800 lg:w-[50%]"
		>
			<img src={Dell || "/placeholder.svg"} alt="Iconhome" class="h-full w-full object-cover dark:hidden" />
			<img src={iconhome || "/placeholder.svg"} alt="Iconhome" class="hidden h-full w-full object-cover dark:flex" />
		</div>
		<div
			class="flex h-auto min-h-[300px] w-full flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 sm:px-6 py-8 lg:w-[50%]"
		>
			<!-- Div do texto -->
			<div class="mb-4 md:mb-6 flex h-auto w-full max-w-md flex-col items-center justify-center">
				<p
					class="text-center font-['Inter'] text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-gray-800 dark:text-white"
				>
					<MessageSquare class="h-6 w-6 md:h-8 md:w-8 inline mr-2 text-blue-600 dark:text-blue-400" />
					Quando você anuncia aqui, todo mundo vê!
				</p>
			</div>

			<!-- Segundo texto -->
			<div class="flex h-auto w-full max-w-md flex-col items-center justify-center px-2">
				<p
					class="mb-6 text-center font-['Inter'] text-base md:text-lg lg:text-xl font-medium leading-relaxed text-gray-600 dark:text-gray-300"
				>
					Conecte seu comércio, produto e promoções com milhares de consumidores, anunciando em
					ambientes de grande circulação.
				</p>

				<button
					class="inline-block transform rounded-full bg-gradient-to-r from-blue-600 to-blue-500 p-4 px-6 md:px-8 py-3 text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-blue-400"
				>
					<a href="/Anuncios-Promocao" target="_blank" rel="noopener noreferrer">
						<p class="font-semibold hover:text-white flex items-center gap-2">
							<Tag class="h-5 w-5" />
							Anuncie agora
						</p>
					</a>
				</button>
			</div>
		</div>
	</div>
	<!-- Apresentação - Redesenhada -->
	<section class="py-8 md:py-16 bg-white dark:bg-gray-900">
		<div class="container mx-auto px-4">
			<div class="text-center mb-8 md:mb-12">
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" id="art-comercios">
					<MapPin class="h-6 w-6 md:h-8 md:w-8 inline-block text-blue-600 mr-2" />
					Comércios em Destaque
				</h2>
				<p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-base md:text-lg px-2">
					Descubra o melhor que Luiz Antônio tem a oferecer. Conecte-se diretamente com os melhores estabelecimentos da cidade.
				</p>
			</div>
			
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
				<!-- Card 1 - Redesenhado -->
				<div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group">
					<div class="relative h-[180px] sm:h-[200px]">
						<a href="/comercios/OdontoCompany" class="block w-full h-full">
							<img src={ondontolo || "/placeholder.svg"} alt="OdontoCompany Luiz Antônio-SP" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
							<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</a>
						<div class="absolute top-4 right-4">
							<span class="bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center">
								<Award class="h-3 w-3 mr-1" />
								Premium
							</span>
						</div>
					</div>
					
					<div class="p-4 md:p-6">
						<div class="mb-4">
							<h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">OdontoCompany</h3>
							<p class="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center">
								<MapPin class="h-3 w-3 mr-1" /> Luiz Antônio-SP
							</p>
							<div class="flex items-center">
								<div class="flex text-yellow-400">
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400 ml-2">5.0 (18 avaliações)</span>
							</div>
						</div>
						
						<div class="flex flex-col gap-2">
							<a href="/comercios/OdontoCompany" class="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center">
								<Info class="h-4 w-4 mr-1" />
								Ver detalhes
							</a>
							<a href="https://wa.me/16992452772?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 w-full">
								<button class="w-full rounded-lg bg-green-500 px-4 md:px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-green-600 flex items-center justify-center gap-2">
									<Phone class="h-4 w-4" />
									Contato direto
								</button>
							</a>
						</div>
					</div>
				</div>
				
				<!-- Card 2 - Redesenhado -->
				<div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group">
					<div class="relative h-[180px] sm:h-[200px]">
						<a href="/comercios/Gelindo-Uber" class="block w-full h-full">
							<img src={gelindo || "/placeholder.svg"} alt="Gelindo Uber" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
							<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</a>
					</div>
					
					<div class="p-4 md:p-6">
						<div class="mb-4">
							<h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">Gelindo Uber</h3>
							<p class="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center">
								<MapPin class="h-3 w-3 mr-1" /> Luiz Antônio-SP
							</p>
							<div class="flex items-center">
								<div class="flex text-yellow-400">
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400 ml-2">5.0 (12 avaliações)</span>
							</div>
						</div>
						
						<div class="flex flex-col gap-2">
							<a href="/comercios/Gelindo-Uber" class="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center">
								<Info class="h-4 w-4 mr-1" />
								Ver detalhes
							</a>
							<a href="https://wa.me/16991025776?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 w-full">
								<button class="w-full rounded-lg bg-green-500 px-4 md:px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-green-600 flex items-center justify-center gap-2">
									<Phone class="h-4 w-4" />
									Contato direto
								</button>
							</a>
						</div>
					</div>
				</div>
				
				<!-- Card 3 - Redesenhado -->
				<div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group relative">
					<div class="absolute top-4 right-4 z-10">
						<span class="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center">
							<Bell class="h-3 w-3 mr-1" />
							Novo
						</span>
					</div>
					
					<div class="relative h-[180px] sm:h-[200px]">
						<a href="/comercios/Odontologia-Estetica" class="block w-full h-full">
							<img src={odon || "/placeholder.svg"} alt="Odontologia" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
							<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</a>
					</div>
					
					<div class="p-4 md:p-6">
						<div class="mb-4">
							<h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">Odontologia Estética</h3>
							<p class="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center">
								<MapPin class="h-3 w-3 mr-1" /> Luiz Antônio-SP
							</p>
							<div class="flex items-center">
								<div class="flex text-yellow-400">
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
									<Star class="h-4 w-4 fill-current" />
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400 ml-2">5.0 (7 avaliações)</span>
							</div>
						</div>
						
						<div class="flex flex-col gap-2">
							<a href="/comercios/Odontologia-Estetica" class="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline flex items-center">
								<Info class="h-4 w-4 mr-1" />
								Ver detalhes
							</a>
							<a href="https://wa.me/16997600070?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 w-full">
								<button class="w-full rounded-lg bg-green-500 px-4 md:px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-green-600 flex items-center justify-center gap-2">
									<Phone class="h-4 w-4" />
									Contato direto
								</button>
							</a>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Botão Ver Todos -->
			<div class="flex justify-center mt-8 md:mt-12">
				<a href="/comercios" target="_blank" rel="noopener noreferrer">
					<button class="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-full shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-blue-500 hover:to-blue-400 flex items-center gap-2">
						<Store class="h-5 w-5" />
						Ver todos os comércios
					</button>
				</a>
			</div>
		</div>
	</section>

	<!-- Seção de Anúncio - Nova seção de chamada para ação -->
	<section class="bg-gradient-to-r from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-10 md:py-20 relative overflow-hidden">
		<!-- Pattern Background -->
		<div class="absolute inset-0 opacity-10 z-0 pattern-diagonal"></div>
		
		<div class="container mx-auto px-4 relative z-10">
			<div class="max-w-4xl mx-auto">
				<div class="flex flex-col md:flex-row items-center gap-6 md:gap-8">
					<div class="w-full md:w-2/3">
						<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
							<MessageSquare class="h-6 w-6 md:h-8 md:w-8 inline-block text-blue-600 dark:text-blue-400 mr-2" />
							Seu negócio merece ser visto por toda Luiz Antônio
						</h2>
						<p class="text-gray-600 dark:text-blue-100 text-base md:text-lg mb-6">
							Alcance milhares de potenciais clientes anunciando no maior guia comercial da cidade. Promova seus produtos, serviços e ofertas especiais com nossos planos de anúncio personalizados.
						</p>
						<ul class="text-gray-600 dark:text-blue-100 mb-6 md:mb-8 space-y-2 text-sm md:text-base">
							<li class="flex items-start">
								<span class="mr-2 text-green-600 dark:text-green-400">✓</span> Aumento de visibilidade para seu negócio
							</li>
							<li class="flex items-start">
								<span class="mr-2 text-green-600 dark:text-green-400">✓</span> Conexão direta com clientes interessados
							</li>
							<li class="flex items-start">
								<span class="mr-2 text-green-600 dark:text-green-400">✓</span> Destaque entre a concorrência local
							</li>
							<li class="flex items-start">
								<span class="mr-2 text-green-600 dark:text-green-400">✓</span> Presente nos resultados de busca
							</li>
						</ul>
						<a href="/Anuncios-Promocao" target="_blank" rel="noopener noreferrer">
							<button class="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
								<Tag class="h-5 w-5" />
								Anuncie agora
							</button>
						</a>
					</div>
					
					<div class="w-full md:w-1/3 flex justify-center mt-8 md:mt-0">
						<div class="bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-gray-200 dark:border-white/20 shadow-xl">
							<img src={paginasite || "/placeholder.svg"} alt="Exemplo de anúncio" class="rounded-xl w-full h-auto shadow-lg transform transition-all duration-500 hover:scale-105" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Seção de Vídeo e Imagem - Redesenhada -->
	<section class="bg-white dark:bg-gray-900 py-10 md:py-16 relative">
		<div class="container mx-auto px-4">
			<div class="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
				<div class="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl">
					<div class="relative aspect-video">
						<img 
							src="{Reds}" 
							alt="Animação mostrando o funcionamento do site" 
							class="w-full h-full object-cover rounded-2xl"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
						<div class="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
							Vídeo demonstrativo
						</div>
					</div>
				</div>
				
				<div class="w-full lg:w-1/2 flex flex-col">
					<h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
						Como funciona o Guia Comercial de Luiz Antônio
					</h2>
					
					<div class="space-y-4 md:space-y-6">
						<div class="flex items-start gap-3">
							<div class="bg-red-100 dark:bg-red-900/30 p-2 md:p-3 rounded-full">
								<Store class="h-5 w-5 md:h-6 md:w-6 text-red-500" />
							</div>
							<div>
								<h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">Encontre qualquer comércio</h3>
								<p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">Acesse facilmente informações de todos os estabelecimentos comerciais da cidade em um único lugar.</p>
							</div>
						</div>
						
						<div class="flex items-start gap-3">
							<div class="bg-green-100 dark:bg-green-900/30 p-2 md:p-3 rounded-full">
								<Phone class="h-5 w-5 md:h-6 md:w-6 text-green-500" />
							</div>
							<div>
								<h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">Contato direto e rápido</h3>
								<p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">Conecte-se diretamente com os comércios através de WhatsApp e outras formas de contato disponíveis.</p>
							</div>
						</div>
						
						<div class="flex items-start gap-3">
							<div class="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-full">
								<Tag class="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
							</div>
							<div>
								<h3 class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">Promoções exclusivas</h3>
								<p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">Acesse ofertas e descontos especiais disponibilizados pelos comerciantes locais.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Cards de anúncios Premio - Redesenhado -->
	<section id="art-destaque" class="py-10 md:py-16 bg-gray-50 dark:bg-gray-800">
		<div class="container mx-auto px-4">
			<div class="text-center mb-8 md:mb-12">
				<span class="inline-block py-1 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium mb-3">Anúncios em Destaque</span>
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
					<Award class="h-6 w-6 md:h-8 md:w-8 inline-block text-blue-600 mr-2" />
					Empresas em Destaque
				</h2>
				<p class="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-base md:text-lg px-2">
					Conheça as empresas que investem em visibilidade e oferecem os melhores produtos e serviços da cidade.
				</p>
			</div>
			
			<div class="max-w-5xl mx-auto">
				<CardsPremio />
			</div>
		</div>
	</section>

	<!-- Carrossel - já está integrado -->
	<div class="bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-6 md:py-10">
		<div class="container mx-auto px-4">
			<Carrossel />
		</div>
	</div>

	<!-- Quem Somos - já está integrado -->
	<div id="art-somos" class="pb-16 md:pb-0">
		<Quemsomos />
	</div>
</main>

<style>
	p::selection {
		color: blue;
		background-color: transparent; /* Cor de fundo ao selecionar */
	}
	.slider {
		position: relative;
		overflow: hidden;
	}

	.slider-items {
		display: flex;
		transition: transform 0.5s ease-in-out;
	}

	.slider-item {
		min-width: 100%;
		transition: opacity 1s ease;
	}

	.slider-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 10px;
		border: none;
		cursor: pointer;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.prev-button {
		left: 10px;
	}

	.next-button {
		right: 10px;
	}

	/* Novas animações e estilos */
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideInBottom {
		from { transform: translateY(50px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.fade-in {
		animation: fadeIn 0.8s ease forwards;
	}

	.slide-in-bottom {
		animation: slideInBottom 0.8s ease forwards;
	}
	
	/* Padrões de fundo */
	.pattern-overlay {
		background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
	}
	
	.pattern-diagonal {
		background-image: url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.3" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E');
	}

	/* Espaçamento para o menu fixo inferior em dispositivos móveis */
	@media (max-width: 768px) {
		
	}
</style>