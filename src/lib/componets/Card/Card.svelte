<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import Footer from '$lib/footer/+page.svelte';
	import Avaliacao from '../avaliacao.svelte';
	import Call from '../call.svelte';
	import Liga from '../Liga.svelte';
	import Review from '../Review.svelte';
	import Whatsapp from '../whatsapp.svelte';
	import avalie from '../../../routes/avalie/+page.svelte';

	import Cals from '$lib/images/call-me.png';
	import Ws from '$lib/images/icon-ws.png';
	import Face from '$lib/images/icons8-facebook-novo-48.png';
	import Insta from '$lib/images/icons8-instagram-64.png';
	import callcomer from '$lib/images/icons8.png';
	import border from '$lib/images/border.png';
	import Darkmod from '../Darkmod.svelte';
	
	// Import Lucide icons
	import { MapPin, Clock, Star, Phone, MessageSquare, Share2, Globe, ChevronRight, Heart } from 'lucide-svelte';

	export let product: Product;

	type Product = {
		slug: string;
		title: string;
		telefone: string;
		image: string;
		whatsapp: string;
		facebook: string;
		instagram: string;
		maps: string;
		hours: string;
	};

	let isModalOpen = false;
	let isImageModalOpen = false;
	let imageUrl = '';
	let isFavorite = false;
	let activeTab = 'info';

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function openImageModal() {
		imageUrl = product?.image || '';
		isImageModalOpen = true;
	}

	function closeImageModal() {
		isImageModalOpen = false;
	}

	function closeImageModalOnClickOutside(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeImageModal();
		}
	}
	
	function toggleFavorite() {
		isFavorite = !isFavorite;
	}
	
	function shareContent() {
		if (navigator.share) {
			navigator.share({
				title: product?.title,
				text: `Conheça ${product?.title} em Luiz Antônio`,
				url: window.location.href,
			})
			.catch((error) => console.log('Erro ao compartilhar', error));
		}
	}
</script>

<main class="bg-white dark:bg-gray-900 ">
	<!-- Hero Section com Imagem Grande -->
	<div class="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden bg-gray-900">
		<!-- Banner Image -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			src={product?.image}
			alt={product?.title}
			class="w-full h-full object-cover object-center opacity-90 cursor-pointer transition-transform duration-300 hover:scale-105"
			onclick={openImageModal}
			loading="lazy"
		/>
		
		<!-- Overlay Gradient -->
		<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
		
		<!-- Content Over Image -->
		<div class="absolute bottom-0 left-0 w-full p-6 lg:p-12">
			<div class="container mx-auto">
				<div class="flex flex-col lg:flex-row items-end justify-between">
					<!-- Title and Basic Info -->
					<div class="mb-6 lg:mb-0">
						<div class="flex items-center gap-2 text-yellow-400 mb-2">
							<Star class="fill-current h-5 w-5" />
							<Star class="fill-current h-5 w-5" />
							<Star class="fill-current h-5 w-5" />
							<Star class="fill-current h-5 w-5" />
							<Star class="fill-current h-5 w-5" />
							<span class="text-white text-sm font-medium">5.0</span>
						</div>
						<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-lg">
							{product?.title}
						</h1>
						<div class="flex flex-wrap items-center text-gray-200 gap-4">
							<div class="flex items-center">
								<MapPin class="h-4 w-4 mr-1" />
								<span>Luiz Antônio, SP</span>
							</div>
							<button 
								onclick={openModal}
								class="flex items-center text-gray-200 hover:text-white transition-colors"
							>
								<Clock class="h-4 w-4 mr-1" />
								<span>Horário de funcionamento</span>
							</button>
						</div>
					</div>
					
					<!-- Action Buttons -->
					<div class="flex gap-2">
						<button 
							onclick={toggleFavorite} 
							class="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
							aria-label="Favoritar"
						>
							<Heart class={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
						</button>
						<button 
							onclick={shareContent} 
							class="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
							aria-label="Compartilhar"
						>
							<Share2 class="h-5 w-5 text-white" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Profile Picture Section -->
	<div class="relative -mt-24 mb-8 px-4">
		<div class="container mx-auto">
			<div class="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl inline-block">
				<div class="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						src={product?.image}
						alt={product?.title}
						class="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
						onclick={openImageModal}
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Content Section -->
	<div class="container mx-auto px-4 pt-32 pb-12">
		<!-- Nav tabs -->
		<div class="border-b border-gray-200 dark:border-gray-700 mb-8">
			<div class="flex overflow-x-auto hide-scrollbar">
				<button 
					class={`py-3 px-4 font-medium border-b-2 ${activeTab === 'info' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
					onclick={() => activeTab = 'info'}
				>
					Informações
				</button>
				<button 
					class={`py-3 px-4 font-medium border-b-2 ${activeTab === 'contact' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
					onclick={() => activeTab = 'contact'}
				>
					Contato
				</button>
				<button 
					class={`py-3 px-4 font-medium border-b-2 ${activeTab === 'map' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
					onclick={() => activeTab = 'map'}
				>
					Localização
				</button>
			</div>
		</div>
	
		<!-- Content based on active tab -->
		{#if activeTab === 'info'}
			<div class="fade-in">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div class="lg:col-span-2">
						<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre {product?.title}</h2>
							<p class="text-gray-700 dark:text-gray-300 mb-4">
								Bem-vindo ao {product?.title}, sua referência em Luiz Antônio! Somos especializados em oferecer produtos/serviços de alta qualidade com atendimento personalizado.
							</p>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
								<div class="flex items-start gap-3">
									<div class="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
										<Star class="h-5 w-5 text-red-500" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Qualidade garantida</h3>
										<p class="text-sm text-gray-600 dark:text-gray-400">Compromisso com a excelência em todos os nossos serviços.</p>
									</div>
								</div>
								<div class="flex items-start gap-3">
									<div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
										<Clock class="h-5 w-5 text-blue-500" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Atendimento diferenciado</h3>
										<p class="text-sm text-gray-600 dark:text-gray-400">Atendemos com atenção e compromisso com sua satisfação.</p>
									</div>
								</div>
							</div>
						</div>
						
						<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Avaliações</h2>
							<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
								<div class="flex items-start gap-3">
									<div class="bg-gray-200 dark:bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
										<span class="text-gray-600 dark:text-gray-300 font-semibold">JM</span>
									</div>
									<div>
										<div class="flex items-center">
											<p class="font-semibold text-gray-900 dark:text-white">João Martins</p>
											<span class="mx-2 text-gray-300">•</span>
											<span class="text-sm text-gray-500 dark:text-gray-400">1 mês atrás</span>
										</div>
										<div class="flex text-yellow-400 my-1">
											<Star class="h-4 w-4 fill-current" />
											<Star class="h-4 w-4 fill-current" />
											<Star class="h-4 w-4 fill-current" />
											<Star class="h-4 w-4 fill-current" />
											<Star class="h-4 w-4 fill-current" />
										</div>
										<p class="text-gray-700 dark:text-gray-300">Atendimento excelente! Recomendo fortemente.</p>
									</div>
								</div>
							</div>
							
							<div class="text-center">
								<!-- svelte-ignore a11y_invalid_attribute -->
								<a href="#" class="inline-flex items-center text-red-500 hover:text-red-700 font-medium">
									Ver todas as avaliações
									<ChevronRight class="h-5 w-5 ml-1" />
								</a>
							</div>
						</div>
					</div>
					
					<div>
						<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 sticky top-20">
							<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Contato Rápido</h2>
							
							<!-- Telefone -->
							<a 
								href={`tel:${product?.telefone}`}
								class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
							>
								<div class="bg-blue-500 rounded-full p-2">
									<Phone class="h-5 w-5 text-white" />
								</div>
								<div>
									<p class="font-medium text-gray-900 dark:text-white">Telefone</p>
									<p class="text-sm text-gray-600 dark:text-gray-400">{product?.telefone}</p>
								</div>
							</a>
							
							<!-- WhatsApp -->
							<a 
								href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent(`Olá! Vim através do site EncontreLuizAntonio. Gostaria de mais informações sobre ${product?.title}.`)}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
							>
								<div class="bg-green-500 rounded-full p-2">
									<MessageSquare class="h-5 w-5 text-white" />
								</div>
								<div>
									<p class="font-medium text-gray-900 dark:text-white">WhatsApp</p>
									<p class="text-sm text-gray-600 dark:text-gray-400">Enviar mensagem</p>
								</div>
							</a>
							
							<!-- Website -->
							<a 
								href={product?.facebook}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-6 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
							>
								<div class="bg-purple-500 rounded-full p-2">
									<Globe class="h-5 w-5 text-white" />
								</div>
								<div>
									<p class="font-medium text-gray-900 dark:text-white">Site/Página</p>
									<p class="text-sm text-gray-600 dark:text-gray-400">Visite nossa página</p>
								</div>
							</a>
							
							<div class="grid grid-cols-2 gap-3">
								<a 
									href={product?.facebook}
									target="_blank"
									rel="noopener noreferrer"
									class="bg-blue-600 hover:bg-blue-700 transition-colors p-3 rounded-lg text-white text-center flex items-center justify-center gap-2"
								>
									<img src={Face} alt="Facebook" class="h-5 w-5" />
									Facebook
								</a>
								<a 
									href={product?.instagram}
									target="_blank"
									rel="noopener noreferrer"
									class="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition-colors p-3 rounded-lg text-white text-center flex items-center justify-center gap-2"
								>
									<img src={Insta} alt="Instagram" class="h-5 w-5" />
									Instagram
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'contact'}
			<div class="fade-in">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Entre em Contato</h2>
						
						<div class="space-y-6">
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone para Contato</label>
								<div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
									<Phone class="h-5 w-5 text-gray-400" />
									<p class="font-medium">{product?.telefone}</p>
								</div>
							</div>
							
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp</label>
								<a 
									href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent(`Olá! Vim através do site EncontreLuizAntonio. Gostaria de mais informações sobre ${product?.title}.`)}`}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
								>
									<img src={Ws} alt="WhatsApp" class="h-5 w-5" />
									<span>Enviar mensagem pelo WhatsApp</span>
								</a>
							</div>
							
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redes Sociais</label>
								<div class="flex flex-wrap gap-3">
									<a 
										href={product?.facebook}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
									>
										<img src={Face} alt="Facebook" class="h-5 w-5" />
										<span>Facebook</span>
									</a>
									<a 
										href={product?.instagram}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
									>
										<img src={Insta} alt="Instagram" class="h-5 w-5" />
										<span>Instagram</span>
									</a>
								</div>
							</div>
							
							<div>
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário de Funcionamento</label>
								<button
									onclick={openModal}
									class="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
								>
									<div class="flex items-center gap-2">
										<Clock class="h-5 w-5 text-gray-400" />
										<span>Ver horários disponíveis</span>
									</div>
									<ChevronRight class="h-5 w-5 text-gray-400" />
								</button>
							</div>
						</div>
					</div>
					
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
						<img 
							src={product?.image}
							alt={product?.title}
							class="w-full h-64 object-cover" 
						/>
						<div class="p-6">
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre {product?.title}</h2>
							<p class="text-gray-700 dark:text-gray-300 mb-6">
								Atendemos com excelência e dedicação. Nosso compromisso é com a sua satisfação completa.
							</p>
							<div class="flex gap-4">
								<a
									href={`tel:${product?.telefone}`}
									class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors p-3 rounded-lg text-gray-700 dark:text-white text-center font-medium"
								>
									Ligar Agora
								</a>
								<a
									href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent(`Olá! Vim através do site EncontreLuizAntonio. Gostaria de mais informações sobre ${product?.title}.`)}`}
									target="_blank"
									rel="noopener noreferrer"
									class="flex-1 bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-lg text-white text-center font-medium"
								>
									WhatsApp
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'map'}
			<div class="fade-in">
				<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
					<div class="p-6">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nossa Localização</h2>
						<p class="text-gray-700 dark:text-gray-300 mb-4">
							Encontre-nos facilmente utilizando o mapa abaixo. Estamos estrategicamente localizados para melhor atendê-lo.
						</p>
					</div>
					
					<div class="aspect-video w-full">
						<!-- svelte-ignore element_invalid_self_closing_tag -->
						<iframe
							src={product?.maps}
							width="100%"
							height="100%"
							style="border:0;"
							allowfullscreen
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							title="Mapa de localização para {product?.title}"
							class="w-full h-full"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Modal de Horários - Redesenhado -->
	{#if isModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
			<div
				class="w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-2xl transition-all duration-300 animate-scale-up"
			>
				<div class="relative p-6">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						onclick={closeModal}
						class="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					
					<div class="text-center mb-6">
						<div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
							<Clock class="h-8 w-8 text-red-500" />
						</div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
							Horário de Funcionamento
						</h2>
					</div>
					
					<div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6">
						<p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
							{product?.hours}
						</p>
					</div>
					
					<div class="flex gap-3">
						<button
							onclick={closeModal}
							class="flex-1 py-3 px-6 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
						>
							Fechar
						</button>
						<a
							href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent(`Olá! Vim através do site EncontreLuizAntonio. Gostaria de confirmar o horário de funcionamento do ${product?.title}.`)}`}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 py-3 px-6 rounded-lg bg-green-500 text-white font-medium transition-colors hover:bg-green-600 flex items-center justify-center gap-2"
						>
							<img src={Ws} alt="WhatsApp" class="h-5 w-5" />
							Confirmar Horário
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Modal de Imagem - Redesenhado -->
	{#if isImageModalOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
			onclick={closeImageModalOnClickOutside}
		>
			<div class="relative max-w-4xl w-full">
				<div class="aspect-video w-full rounded-lg overflow-hidden">
					<img src={imageUrl} alt={product?.title} class="w-full h-full object-contain" />
				</div>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					onclick={closeImageModal}
					class="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	
	.fade-in {
		animation: fadeIn 0.5s ease-in-out;
	}
	
	.animate-scale-up {
		animation: scaleUp 0.3s ease-in-out;
	}
	
	.animate-fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}
	
	.text-shadow-lg {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes scaleUp {
		from { transform: scale(0.95); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}
</style>