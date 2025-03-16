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
	<div class="min-h-screen bg-gradient-to-br from-purple-950 to-purple-900">
		<!-- Header Logo -->
		<div class="relative flex h-20 items-center justify-center bg-purple-950/50 md:h-32">
			<h1 class="text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
				encontre Luiz Antônio
			</h1>
		</div>


		<!-- Main Content -->
		<main class="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-8">
			<div class="flex flex-wrap justify-center gap-8">
				<!-- Main Content Area -->

				<div class="flex w-[100%] flex-col items-center justify-center lg:col-span-2">
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
							<div class="rounded-[12px] border-purple-800/50 bg-black/40 p-4">
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
		class="flex w-full flex-col items-center justify-center gap-7 bg-gradient-to-br from-purple-950 to-purple-900"
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

	<!-- Nav artigo -->
	<div class="flex w-full items-center justify-center bg-secondary-foreground bg-opacity-40">
		<nav class="flex w-full flex-wrap items-center justify-evenly md:gap-4">
			<a
				href="#art-folhetos"
				class="relative p-2 font-['Inter'] text-sm font-medium tracking-wide
					text-white transition-colors duration-300
					hover:text-blue-400 dark:text-secondary flex items-center gap-1
					"
			>
				<FileText class="h-4 w-4" />
				Folhetos
			</a>
			<a
				href="#art-destaque"
				class="relative p-2 font-['Inter'] text-sm font-medium tracking-wide
					text-white transition-colors duration-300
					hover:text-blue-400 dark:text-secondary flex items-center gap-1"
			>
				<Star class="h-4 w-4" />
				Destaques
			</a>
			<a
				href="#art-somos"
				class="relative p-2 font-['Inter'] text-sm font-medium tracking-wide
					text-white transition-colors duration-300
					hover:text-blue-400 dark:text-secondary flex items-center gap-1"
			>
				<Info class="h-4 w-4" />
				Sobre
			</a>
		</nav>
	</div>
	<!-- Div slides do Anuncio   -->
	<div
		class="flex h-[50px] items-center overflow-hidden bg-white text-black dark:bg-secondary dark:text-white"
	>
		<MarqueeSlider />
	</div>
	<!-- Div 50% de imagens -->
	<div class="w-full flex-wrap sm:flex lg:flex">
		<div
			class="flex h-[400px] w-full items-center justify-center bg-black sm:h-[400px] lg:h-[400px] lg:w-[50%]"
		>
	

			<img src={Dell || "/placeholder.svg"} alt="Iconhome" class="h-full w-full object-cover dark:hidden" />
			<img src={iconhome || "/placeholder.svg"} alt="Iconhome" class="hidden h-full w-full object-cover dark:flex" />
		</div>
		<div
			class="flex h-[400px] w-full flex-col items-center justify-center bg-secondary px-6 py-8 dark:bg-secondary lg:w-[50%]"
		>
			<!-- Div do texto -->
			<div class="mb-6 flex h-auto w-full max-w-md flex-col items-center justify-center">
				<p
					class="text-center font-['Inter'] text-3xl font-semibold leading-tight text-black dark:text-white md:text-4xl"
				>
					<MessageSquare class="h-8 w-8 inline mr-2" />
					Quando você anuncia aqui, todo mundo vê!
				</p>
			</div>

			<!-- Segundo texto -->
			<div class="flex h-auto w-full max-w-md flex-col items-center justify-center">
				<p
					class="mb-6 text-center font-['Inter'] text-lg font-medium leading-relaxed text-black dark:text-white md:text-xl"
				>
					Conecte seu comércio, produto e promoções com milhares de consumidores, anunciando em
					ambientes de grande circulação.
				</p>

				<button
					class="inline-block transform rounded-full bg-gradient-to-r from-red-600 to-red-500 p-4 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-500 hover:to-red-400"
				>
					<a href="/Anuncios-Promocao" target="_blank" rel="noopener noreferrer">
						<p class="font-semibold hover:text-secondary dark:hover:text-secondary flex items-center gap-2">
							<Tag class="h-5 w-5" />
							Anuncie agora
						</p>
					</a>
				</button>
			</div>
		</div>
	</div>
	<!-- Apresentação -->
	<section
		class="flex w-full flex-col border-t-2 bg-white dark:border-secondary-foreground dark:bg-secondary"
	>
		<!-- Darkmod  Div Apresentação -->
		<div class="flex w-full flex-col items-center justify-center lg:h-[70px]">
			<div
				class=" flex w-full flex-col items-center justify-between bg-secondary px-4 dark:bg-secondary sm:flex-row lg:h-[70px]"
			>
				<p
					class="text-center text-lg font-bold text-black dark:text-secondary-foreground lg:text-3xl"
				>
					<MapPin class="h-6 w-6 inline mr-2" />
					Aqui você encontra o número de qualquer comércio que procura.
				</p>
				<Darkmod />
			</div>
		</div>
		<!-- Cards -->
		<div id="art-comercios" class="flex w-full gap-10 flex-wrap justify-center bg-secondary dark:bg-secondary lg:gap-8">
			<!-- Card 1 -->
			<div class="flex w-[300px] h-[350px] flex-col overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
				<a href="/comercios/OdontoCompany" target="_blank" rel="noopener noreferrer" class="block h-[180px] w-full">
					<img src={ondontolo || "/placeholder.svg"} alt="OdontoCompany Luiz Antônio-SP" class="h-full w-full object-cover rounded-t-xl transition-transform hover:scale-105" />
				</a>
				<div class="flex flex-col justify-between h-[170px] p-4 border-t-2">
					<p class="text-center text-2xl font-bold text-gray-700 dark:text-white">OdontoCompany Luiz Antônio-SP</p>
					<a href="https://wa.me/16992452772?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 block">
						<button class="w-full rounded-lg bg-green-500 px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-green-600 flex items-center justify-center gap-2">
							<Phone class="h-4 w-4" />
							WhatsApp
						</button>
					</a>
				</div>
			</div>
			
			<!-- Card 2 -->
			<div class="flex w-[300px] h-[350px] flex-col overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
				<a href="/comercios/Gelindo-Uber" target="_blank" rel="noopener noreferrer" class="block h-[180px] w-full">
					<img src={gelindo || "/placeholder.svg"} alt="Gelindo Uber" class="h-full w-full object-cover rounded-t-xl transition-transform hover:scale-105" />
				</a>
				<div class="flex flex-col justify-between h-[170px] p-4 border-t-2">
					<p class="text-center text-2xl font-bold text-gray-700 dark:text-white">Gelindo Uber</p>
					<a href="https://wa.me/16991025776?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 block">
						<button class="w-full rounded-lg bg-green-500 px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-green-600 flex items-center justify-center gap-2">
							<Phone class="h-4 w-4" />
							WhatsApp
						</button>
					</a>
				</div>
			</div>
			
			<!-- Card 3 -->
			<div class="flex w-[300px] h-[350px] flex-col overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 relative">
				<div class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg flex items-center gap-1">
					<Bell class="h-3 w-3" />
					Novo
				</div>
				<a href="/comercios/Odontologia-Estetica" target="_blank" rel="noopener noreferrer" class="block h-[180px] w-full">
					<img src={odon || "/placeholder.svg"} alt="Odontologia" class="h-full w-full object-cover rounded-t-xl transition-transform hover:scale-105" />
				</a>
				<div class="flex flex-col justify-between h-[170px] p-4 border-t-2">
					<p class="text-center text-2xl font-bold text-gray-700 dark:text-white">Odontologia</p>
					<a href="https://wa.me/16997600070?text={'Olá, Vim pelo site! encontreluizantonio.com.br'}" target="_blank" rel="noopener noreferrer" class="mt-2 block">
						<button class="w-full rounded-lg bg-green-500 px-6 py-2 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:bg-green-600 flex items-center justify-center gap-2">
							<Phone class="h-4 w-4" />
							WhatsApp
						</button>
					</a>
				</div>
			</div>
			
			<!-- Botão Ver Todos -->
			<div class="w-full flex items-center justify-center mt-4">
				<a href="/comercios" target="_blank" rel="noopener noreferrer">
					<button class="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-500 hover:to-red-400 flex items-center gap-2">
						<Store class="h-5 w-5" />
						Ver todos os comércios
					</button>
				</a>
			</div>
		</div>
		


	</section>
	<!-- Card do video -->
	<div class="flex w-full flex-col justify-center overflow-hidden shadow-lg lg:flex-row">
		<div
			class="flex h-[200px] w-full items-center justify-center bg-secondary shadow-lg dark:bg-secondary sm:h-[400px] lg:h-[300px] lg:w-[50%]"
		>
			<div class="flex w-full">
				<img src="{Reds}" alt="Reds" class="h-full w-full object-cover" />
			</div>
			</div>
		<!-- Card da foto -->
		<div
			class="flex h-[400px] w-[100%] items-center justify-end bg-secondary-foreground sm:h-[400px] lg:h-[300px] lg:w-[50%]"
		>
			<div class="flex w-full">
				<img
					src={paginasite || "/placeholder.svg"}
					alt="Pagina de Anúncios"
					class="h-full w-full object-cover sm:w-full md:w-full lg:w-full xl:w-full"
				/>
			</div>
		</div>
	</div>
	<!-- Cards de anúncios Premio -->
	<div id="art-destaque" class="rounded-md bg-secondary p-2 text-center dark:bg-secondary">
		<p class="font-semibold text-yellow-700 flex items-center justify-center gap-1">
			<Award class="h-5 w-5 text-yellow-500" />
			Anúncio em Destaque
		</p>
		<div>
			<CardsPremio />
		</div>
	</div>
	<!-- Folhetos -->
	<div
		id="art-folhetos"
		class="flex w-full items-center justify-center border bg-secondary-foreground p-4 shadow-md dark:bg-secondary-foreground"
	>
		<h2 class="text-xl font-semibold text-white dark:text-secondary flex items-center gap-2">
			<FileText class="h-5 w-5" />
			Folhetos dos Mercados
		</h2>
	</div>
	<div class="grid w-full grid-cols-1 gap-6 bg-secondary p-4 sm:grid-cols-2 lg:grid-cols-4">
		<Cardfolheto />
	</div>

	<div
		class="flex w-full flex-col items-center justify-center bg-secondary-foreground dark:bg-secondary-foreground"
	>
		<Carrossel />
	</div>
	<!-- Quem Somos -->
	<div id="art-somos">

	</div>
	
	<!-- <Quemsomos /> -->
	<Quemsomos />
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
</style>