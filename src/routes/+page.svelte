<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Anuncio from './../lib/componets/anuncio.svelte';
	import { comercios } from './../data.js';
	import Lest from './../lib/componets/lest.svelte';
	import Allura from '$lib/images/Allura.png';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Menu from '$lib/componets/Menu.svelte';
	import Header from '$lib/componets/Header.svelte';
	import Pesquisa from '$lib/componets/pesquisa.svelte';
	import Search from '$lib/componets/Search.svelte';
	import Footer from '$lib/footer/+paga.svelte';
	// img
	import City from '$lib/images/nova-img1.png';
	import Homes from '$lib/images/icons8-home-50.png';
	import Schop from '$lib/images/icons8-shop-50.png';
	import Cash from '$lib/images/icons8-cash-80.png';
	import Sos from '$lib/images/icons8-sos-48.png';
	import Cartas from '$lib/images/55638e4e-9618.png';
	import Pops from '$lib/images/icon-pos.png';
	import Cardcity from '$lib/images/51e8cf29-30c9-4bfe-bc52-2afbab085d5c.png';
	import Muda from '$lib/componets/muda.svelte';
	import CookieConsent from '$lib/componets/CookieConsent.svelte';
	import ImageSlider from '$lib/componets/ImageSlider.svelte';
	import post1 from '$lib/images/post1.png';
	import Comu from '$lib/images/comu.png';
	import Pink from '$lib/images/anuncui2.png';
	interface SliderItem {
		title: string;
		description: string;
		image: string;
	}

	const sliderItems: SliderItem[] = [
		{
			title: 'Manutenção Programada (05/12/2024)',
			description: 'Manutenção em andamento',
			image: post1
		},
		{
			title: 'Manutenção Programada (05/12/2024)',
			description: 'Manutenção Programada',
			image: Comu
		},
		{
			title: 'Avalie Nosso Site',
			description: 'Estamos emplementando novas funcionalidades',
			image: Pink
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

	const navItems = [
		{ name: 'Atualizações' },
		{ name: 'Comércios', href: '/Comercios' },
		{ name: 'Eventos' },
		{ name: 'LOJA' },
		{ name: 'Ofertas da Semana' },
		{ name: 'Quadro de Avisos', href: '/QuadroAvisos' },
		{ name: 'SUPORTE' }
	];

	function nextSlide() {
		currentSlide.update((prevSlide) => (prevSlide + 1) % sliderItems.length);
	}

	function prevSlide() {
		currentSlide.update((prevSlide) => (prevSlide - 1 + sliderItems.length) % sliderItems.length);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-950 to-purple-900">
	<!-- Header Logo -->
	<div class="relative flex h-20 items-center justify-center bg-purple-950/50 md:h-32">
		<h1 class="text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
			encontre luiz antonio
		</h1>
	</div>
<!-- bg-purple-950/50 -->
	<!-- Main Navigation -->
	<nav class="border-b border-purple-800 bg-black/60">
		<div class="mx-auto max-w-7xl ">
			<div class="flex items-center justify-between">
				<button
					class="p-2 text-white md:hidden"
					on:click={() => isMenuOpen.update((open) => !open)}
					aria-label="Toggle menu"
				>
					<!-- Menu Icon placeholder -->
					<span class="h-6 w-6">☰</span>
				</button>
				<div
					class={`md:flex ${$isMenuOpen ? 'flex' : 'hidden'} absolute left-0 top-[200px] z-50 w-full flex-col bg-black/90 md:relative md:top-auto md:w-auto md:flex-row md:space-x-8 md:bg-transparent`}
				>
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center px-3 py-4 text-sm text-gray-300 transition-colors hover:bg-purple-800/30 hover:text-white"
						>
							<span>{item.name}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8  justify-center items-center flex flex-col">
		<div class="flex flex-wrap justify-center gap-8 "> 
			<!-- Main Content Area -->
			<div class="lg:col-span-2 flex flex-col w-[100%] justify-center items-center ">
				<!-- Featured Banner Slider -->
				<div class="slider relative mb-8 object-cover gap-7 w-full rounded-[12px] border-1-2 border-[#09052D] bg-black/60">
					<div class="slider-items flex" style="transform: translateX(-{$currentSlide * 100}%);">
						{#each sliderItems as item, index}
							<div class="slider-item relative">
								<a href="/login">
									<img 
									src={item.image}
									alt={item.title}
									class="h-[400px] w-full object-cover brightness-75 cursor-pointer"
								/>
								</a>
								<div class="absolute inset-0">
									<div class="flex h-full flex-col justify-center p-4 md:p-8">
										<a href="/Avalie">
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
						←
					</button>
					<button on:click={nextSlide} class="slider-button next-button" aria-label="Next slide">
						→
					</button>
				</div>

				<!-- News Section -->
				<div class="space-y-4 rounded-[12px]">
					{#each [
						
						{ type: 'Manutenção', title: 'Manutenção (25/11/24)', description: ' Estamos atualizando nosso sistema para melhorar a experiência do usuário e corrigir erros identificados.	', date: '25/12/2024' },
						{ type: 'Notícias', title: 'Notas de Atualização (26/11/24)', description: ' A atualização do banco de dados foi concluída com sucesso. Isso nos permitirá oferecer um serviço mais rápido e preciso. Aproveite as melhorias no sistema! 05/11/2024!', date: '26/11/2024' },
					    { type: 'Eventos', title: 'Avalie nosso site', description: 'Queremos saber sua opinião! Avalie a experiência em nosso site e nos ajude a melhorar a cada dia. Seu feedback é fundamental para oferecer o melhor conteúdo e usabilidade', date: '19/11/2024' }] as item
					  }
						<div class="border-purple-800/50 bg-black/40 p-4 rounded-[12px]">
							<div
								class="mb-2 flex flex-col items-start justify-between md:flex-row md:items-center"
							>
								<span
									class={`rounded px-2 py-1 text-xs ${item.type === 'Eventos' ? 'bg-green-600' : 'bg-red-600'} mb-2 text-white md:mb-0`}
								>
									{item.type}
								</span>
								<span class="text-sm text-gray-400">{item.date}</span>
							</div>
							<a href="/Avalie">
								<h3 class="mb-2 font-semibold text-white hover:text-blue-500 font-serif">{item.title}</h3>
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

<style>
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
	}

	.prev-button {
		left: 10px;
	}

	.next-button {
		right: 10px;
	}
</style>
<main class="w-full bg-gradient-to-br from-purple-950 to-purple-900">
	<Muda />
	<Footer />
</main>