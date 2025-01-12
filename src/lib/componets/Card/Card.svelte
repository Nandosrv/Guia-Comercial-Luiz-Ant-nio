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
</script>

<main class="flex w-full flex-col items-center bg-white">
	<section class="container mx-auto p-4">
		<div class="flex flex-col gap-4 lg:flex-row lg:gap-8">
			<!-- Seção de Imagem e Perfil -->
			<div class="w-full lg:w-1/2">
				<div class="relative overflow-hidden rounded-xl bg-white shadow-lg">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						class="h-[300px] w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105 sm:h-[400px] lg:h-[450px]"
						src={product?.image}
						alt={product?.title}
						onclick={openImageModal}
					/>
					<div class="absolute left-1/2 top-[80%] -translate-x-1/2 -translate-y-1/2 transform">
						<div
							class="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl transition-transform duration-300 hover:scale-110 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
						>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<img
								class="h-full w-full cursor-pointer rounded-full object-cover"
								src={product?.image}
								alt={product?.title}
								onclick={openImageModal}
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Seção de Informações -->
			<div class="w-full lg:w-1/2">
				<div class=" rounded-xl bg-white p-4 shadow-lg sm:h-[400px] sm:p-6 lg:h-[450px] lg:p-8">
					<h1 class="mb-4 text-center text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl lg:mb-8 lg:text-4xl">
						{product?.title}
					</h1>

					<button
						onclick={openModal}
						class="mb-4 w-full rounded-lg bg-gray-800 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:mb-6 sm:py-3 sm:text-base lg:mb-8"
					>
						Horário de Funcionamento
					</button>

					<!-- Grid de Botões -->
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:gap-4">
						<a
							class="group flex items-center justify-center gap-2 rounded-lg bg-green-500 p-3 transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-lg sm:gap-3 sm:p-4"
							href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent(`Eu cheguei até aqui através do site: ${window.location.href}`)}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								class="h-6 w-6 transition-transform group-hover:rotate-12 sm:h-8 sm:w-8"
								src={Ws}
								alt="WhatsApp"
							/>
							<span class="text-sm font-semibold text-white sm:text-base">Mensagem</span>
						</a>

						<a
							class="group flex items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg sm:gap-3 sm:p-4"
							href={product?.facebook}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								class="h-6 w-6 transition-transform group-hover:rotate-12 sm:h-8 sm:w-8"
								src={Face}
								alt="Facebook"
							/>
							<span class="text-sm font-semibold text-white sm:text-base">Facebook</span>
						</a>

						<a
							class="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 p-3 transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-lg sm:gap-3 sm:p-4"
							href={product?.instagram}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								class="h-6 w-6 transition-transform group-hover:rotate-12 sm:h-8 sm:w-8"
								src={Insta}
								alt="Instagram"
							/>
							<span class="text-sm font-semibold text-white sm:text-base">Instagram</span>
						</a>

						<a
							class="group flex items-center justify-center gap-2 rounded-lg bg-green-600 p-3 transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-lg sm:gap-3 sm:p-4"
							href={`tel:${product?.telefone}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								class="h-6 w-6 transition-transform group-hover:rotate-12 sm:h-8 sm:w-8"
								src={callcomer}
								alt="Call"
							/>
							<span class="text-sm font-semibold text-white sm:text-base">Ligue Agora</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Modal de Horários -->
	{#if isModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
			<div
				class="w-full max-w-lg transform rounded-xl bg-white p-4 shadow-2xl transition-all duration-300 sm:p-6 lg:p-8"
			>
				<h2 class="mb-4 text-center text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
					Horário de Funcionamento
				</h2>
				<div class="border-l-4 border-gray-300 pl-4">
					<p class="text-base leading-relaxed text-gray-700 sm:text-xl">
						{product?.hours}
					</p>
				</div>
				<button
					onclick={closeModal}
					class="mt-6 w-full transform rounded-lg bg-gray-800 px-4 py-2 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg sm:mt-8 sm:px-6 sm:py-3 sm:text-lg"
				>
					Fechar
				</button>
			</div>
		</div>
	{/if}

	<!-- Modal de Imagem -->
	<!-- Modal de Imagem -->
{#if isImageModalOpen}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
	onclick={closeImageModalOnClickOutside}
>
	<div class="relative w-11/12 max-w-4xl overflow-hidden rounded-xl">
		<img src={imageUrl} alt="Imagem do Comércio" class="h-auto w-full" />
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button
			onclick={closeImageModal}
			class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110"
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

	<!-- Seção do Mapa -->
	<section class="w-full bg-gray-50 py-8 sm:py-12 lg:py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
				<h2 class="mb-2 text-2xl font-bold text-gray-800 sm:mb-4 sm:text-3xl">Nossa Localização</h2>
				<p class="text-sm text-gray-600 sm:text-base">
					Veja o mapa abaixo para traçar sua rota até nós! Facilitamos sua chegada com localização
					precisa.
				</p>
				<div class="mt-4 animate-bounce">
					<svg
						class="mx-auto h-6 w-6 text-gray-800"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</div>

			<div class="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<iframe
					src={product?.maps}
					width="100%"
					height="300"
					style="border:0;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Mapa de localização para {product?.title}"
					class="w-full sm:h-[400px] lg:h-[500px]"
				/>
			</div>
		</div>
	</section>
</main>