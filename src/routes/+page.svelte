<script lang="ts">
	import Footer from '$lib/footer/+paga.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	// img
	import Pink from '$lib/images/anuncui2.png';
	import Comu from '$lib/images/comu.png';
	import Postnew from '$lib/images/Posta.png';

	import { page } from '$app/stores';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';

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
			title: 'Manutenção Programada (05/12/2024)',
			description: 'Manutenção em andamento',
			image: Postnew,
			link: '/noticias'
		},
		{
			title: 'Manutenção Programada (05/12/2024)',
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

	// const navItems = [
	// 	{ name: 'Atualizações', href: '/noticias' },
	// 	{ name: 'Comércios', href: '/comercios' },
	// 	// { name: 'Eventos', href: '/NewEventos' },
	// 	{ name: 'Mural', href: '/mural' },
	// 	// { name: 'Ofertas da Semana', href: '/OfertasDaSemana'},
	// 	{ name: 'Quadro de Avisos', href: '/quadroAvisos' },
	// 	{ name: 'Suporte', href: '/suporte' }
	// ];

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
			encontre Luiz Antônio
		</h1>
	</div>
	<!-- bg-purple-950/50 -->
	<!-- Main Navigation -->
	<!-- <nav class="items-center justify-center border-b border-purple-800 bg-black/60 md:flex">
		<div class="mx-auto flex max-w-7xl">
			<div class="flex items-center justify-between">
				<button
					class="p-2 text-white md:hidden"
					on:click={() => isMenuOpen.update((open) => !open)}
					aria-label="Toggle menu"
				> -->
	<!-- Menu Icon placeholder -->
	<!-- <span class="h-6 w-6">☰</span>
				</button>
				<div
					class={`md:flex ${$isMenuOpen ? 'flex' : 'hidden'} absolute left-0 top-[200px] z-50 w-full flex-col bg-black/90 md:relative md:top-auto md:w-auto md:flex-row md:space-x-8 md:bg-transparent`}
				>
					{#each navItems as item}
						<a
							href={item.href}
							class="u flex items-center px-3 py-4 text-sm text-gray-300 transition-colors hover:bg-purple-800/30 hover:text-[17px] hover:text-blue-400"
						>
							<span>{item.name}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</nav> -->

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
										src={item.image}
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
						←
					</button>
					<button on:click={nextSlide} class="slider-button next-button" aria-label="Next slide">
						→
					</button>
				</div>

				<!-- News Section -->
				<div class="space-y-4 rounded-[12px]">
					{#each [{ type: 'Manutenção', title: 'Manutenção (25/11/24)', description: ' Estamos atualizando nosso sistema para melhorar a experiência do usuário e corrigir erros identificados.	', date: '25/12/2024' }, { type: 'Notícias', title: 'Notas de Atualização (26/11/24)', description: ' A atualização do banco de dados foi concluída com sucesso. Isso nos permitirá oferecer um serviço mais rápido e preciso. Aproveite as melhorias no sistema! 05/11/2024!', date: '26/11/2024' }, { type: 'Eventos', title: 'Avalie nosso site', description: 'Queremos saber sua opinião! Avalie a experiência em nosso site e nos ajude a melhorar a cada dia. Seu feedback é fundamental para oferecer o melhor conteúdo e usabilidade', date: '19/11/2024' }] as item}
						<div class="rounded-[12px] border-purple-800/50 bg-black/40 p-4">
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
		class="flex h-[100px] w-full flex-col items-center justify-center rounded-[12px] border border-black bg-black/40 p-4 max-sm:w-[92%] md:w-[53%]"
	>
		<h1 class="flex text-2xl font-bold tracking-wider text-white md:text-4xl">
			Destaques Da Semana
		</h1>
		<p>⭐⭐⭐⭐⭐</p>
	</div>
	<div
		class="ml flex w-[53%] flex-col items-center justify-center rounded-[12px] bg-black/40 p-4 max-sm:w-[92%]"
	>
		<!-- <OfertaProfissional /> -->
	</div>
	<Footer />
</main>

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
