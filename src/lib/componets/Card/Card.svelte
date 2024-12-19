<script lang="ts">
	import Footer from '$lib/footer/+paga.svelte';
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

	// Declarar props corretamente
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
	let isImageModalOpen = false; // Controle para abrir imagem em tela cheia
	let imageUrl = '';

	// Funções para abrir e fechar o modal
	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	// Função para abrir a imagem em tela cheia
	function openImageModal() {
		imageUrl = product?.image || '';
		isImageModalOpen = true;
	}

	// Função para fechar a imagem em tela cheia
	function closeImageModal() {
		isImageModalOpen = false;
	}

	// Função para fechar a imagem modal se clicar fora da imagem
	function closeImageModalOnClickOutside(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeImageModal();
		}
	}
</script>

<!-- Novo layout Card-->
<main
	class="flex h-[1800px] w-full flex-col items-center bg-gradient-to-br from-purple-900 to-purple-800 p-4 md:p-8 shadow-lg"
>
	<section class="flex w-[95%] flex-col items-center lg:w-[75%]">
		<div class="relative flex h-[200px] w-[100%] items-center justify-center lg:w-[100%]">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<img
				class="absolute h-[100%] w-[100%] rounded-t-lg object-cover lg:h-[250px] lg:w-[60%]"
				src={product?.image}
				alt={product?.title}
				onclick={openImageModal}
			/>
			<div
				class="z-10 mt-[200px] flex h-[100px] w-[100px] items-center justify-center rounded-full border border-purple-500 bg-white"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					class="h-[100%] w-[100%] rounded-full object-cover"
					src={product?.image}
					alt={product?.title}
					onclick={openImageModal}
				/>
			</div>
		</div>

		<div
			class="flex h-[50px] w-full items-center justify-center bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 shadow-lg lg:w-[60%]"
		></div>

		<div
			class="flex h-[170px] w-full flex-col items-center justify-center bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 shadow-lg lg:w-[60%]"
		>
			<p
				class="text-center font-['Inter'] text-2xl font-extrabold uppercase tracking-wide text-white lg:text-3xl"
			>
				{product?.title}
			</p>
			<button
				onclick={openModal}
				class="mt-4 rounded-lg bg-purple-700 px-6 py-2 text-white shadow-md transition hover:scale-105 hover:bg-purple-800"
			>
				Saiba Mais
			</button>
		</div>

		{#if isModalOpen}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
				<div
					class="w-10/12 max-w-lg scale-105 transform rounded-lg bg-white p-8 shadow-xl transition-all duration-300"
				>
					<h2 class="mb-6 text-center font-['Inter'] text-3xl font-extrabold text-purple-900">
						Horário de Funcionamento
					</h2>
					<div class="border-b border-purple-500 pb-4">
						<p class="text-xl leading-relaxed text-gray-900">
							{product?.hours}
						</p>
					</div>
					<div class="mt-6 flex justify-center">
						<button
							onclick={closeModal}
							class="transform rounded bg-purple-700 px-6 py-3 text-lg font-semibold text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-purple-800"
						>
							Fechar
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if isImageModalOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
				onclick={closeImageModalOnClickOutside}
			>
				<div class="relative w-11/12 lg:w-[30%] max-sm:w-[70%] max-md:w-[60%] max-lg:w-[40%] rounded-lg bg-white p-4 shadow-xl">
					<img src={imageUrl} alt="Imagem do Comércio" class="h-auto w-full rounded-lg" />
					<button
						onclick={closeImageModal}
						class="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white transition-all duration-200 ease-in-out hover:bg-red-600"
					>
						X
					</button>
				</div>
			</div>
		{/if}

		<div
			class="flex w-full items-center justify-center bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 shadow-lg lg:w-[60%]"
		>
			<div
				class="flex w-full flex-col items-center justify-center bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 p-4 shadow-lg lg:w-[60%]"
			>
				<!-- Botão WhatsApp -->
				<a
					class="mb-4 flex w-full transform items-center justify-center gap-3 rounded-lg bg-purple-700 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-purple-800"
					href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent('Eu cheguei até aqui através do site encontreluizantonio.com.br')}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-8 w-8" src={Ws} alt="WhatsApp" />
					<p class="font-['Inter'] font-semibold text-white">Mensagem</p>
				</a>

				<!-- Divider -->
				<div class="mb-4 h-[1px] w-full bg-purple-500"></div>

				<!-- Botão Facebook -->
				<a
					class="mb-4 flex w-full transform items-center justify-center gap-3 rounded-lg bg-blue-600 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
					href={product?.facebook}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-8 w-8" src={Face} alt="Facebook" />
					<p class="font-['Inter'] font-semibold text-white">Facebook</p>
				</a>

				<!-- Divider -->
				<div class="mb-4 h-[1px] w-full bg-purple-500"></div>

				<!-- Botão Instagram -->
				<a
					class="mb-4 flex w-full transform items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r"
					href={product?.instagram}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-8 w-8" src={Insta} alt="Instagram" />
					<p class="font-['Inter'] font-semibold text-white">Instagram</p>
				</a>

				<!-- Divider -->
				<div class="mb-4 h-[1px] w-full bg-purple-500"></div>

				<!-- Botão Call -->
				<a
					class="flex w-full transform items-center justify-center gap-3 rounded-lg bg-green-600 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-700"
					href={`tel:${product?.telefone}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<img class="h-8 w-8" src={callcomer} alt="Call" />
					<p class="font-['Inter'] font-semibold text-white">Ligue Agora</p>
				</a>
			</div>
		</div>
		
		<div class="flex flex-col items-center justify-center w-full bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 shadow-lg lg:w-[60%] py-8">
			<!-- Aviso sobre o mapa -->
			<div class="text-center mb-6 px-4 py-2 rounded-lg bg-purple-800 text-white shadow-md">
			  <p class="text-xl font-semibold">Veja o mapa abaixo para traçar sua rota até nós!</p>
			</div>
			
			<!-- Container do mapa -->
			<div class="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl">
			  <iframe
				src={product?.maps}
				width="100%"
				height="100%"
				style="border:0;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				title="Mapa de localização para {product?.title}"
				class="w-full h-full rounded-xl shadow-lg"
			  >
			  </iframe>
			</div>
		  </div>
		  <div class="w-full flex justify-center items-center bg-opacity-90 bg-gradient-to-r from-purple-800 to-purple-950 shadow-lg lg:w-[60%]">
			<div class="bg-purple-700 w-full   overflow-hidden shadow-2xl">
				<Footer />

			</div>
		  </div>
	</section>
	
</main>

<!-- <main
	class="flex w-full h-[700px] flex-col items-center bg-gradient-to-br from-purple-900 to-purple-800 p-4 md:p-8"
>
	<div class="borber relative flex h-[200px] w-[%] border-2 border-purple-500 items-center justify-center">
		<img
			class="absolute h-[100%] w-[100%] lg:w-[400px] rounded-lg border border-purple-500 object-cover"
			src="{product?.image} "
			alt={product?.title}
		/>

		<div
			class="z-10 mt-[200px] flex h-[100px] w-[100px] items-center justify-center rounded-full border border-purple-500 bg-white"
		>
			<img class="h-[100%] w-[100%] rounded-full object-cover" src="{product?.image} " alt="" />
		</div>
	</div>
	<div class="flex h-[200px]  w-[95%] flex-col items-center justify-center rounded-lg bg-white">
		<img src="{border} " alt="" class="h-[100%] w-[100%] object-cover" />
		 CAD -->
<!-- <div class="flex h-[95%] w-[95%] flex-col items-center justify-center">
			<p class="flex font-['Inter'] text-[17px] font-bold text-black">
				{product?.title}
			</p>
		</div>
		<div class="mb-2 flex w-full items-center justify-around ">
			Ligar Agora -->
<!-- <div class="flex h-[50px] w-[150px] items-center justify-center gap-1 rounded-lg border border-red-950 bg-blue-600"
			>
				<img class="flex h-5 w-5 bg-transparent" src={callcomer} alt="" />
				<a class="flex items-center justify-center" href={`tel:${product?.telefone}`}>
					<p class="font-['Inter'] font-bold text-white">Ligar agora</p>
				</a>
			</div> -->
<!-- Mensagem  whatsapp -->
<!-- <div
				class="flex h-[50px] w-[150px] items-center justify-center gap-1 rounded-lg border border-red-950"
			>
			<a
			class="flex justify-center items-center gap-1"
			href={`https://wa.me/${product?.whatsapp}?text=${encodeURIComponent('Eu cheguei até aqui através do site encontreluizantonio.com.br')}`}
			target="_blank"
			rel="noopener noreferrer"
		  >
					<img class="h-7 w-7 flex" src={Ws} alt="" />
					<p class="text-gray-700 font-['Inter'] font-bold">Mensagem</p>
				</a>
			</div>
		</div> -->

<!-- </div> -->
<!-- <div class="w-[95%] m-2 flex h-[30px] items-center justify-between rounded-lg ">
		<a class="w-[150px] flex justify-center items-center bg-white border border-gray-600 rounded-lg" href={product?.instagram} target="_blank" rel="noopener noreferrer">
			<img class="h-7 w-7 flex" src={Insta} alt="" />
			<p>Instagram</p>
		</a>
		<a class="w-[150px] flex justify-center bg-white items-center border border-gray-600 rounded-lg" href={product?.facebook} target="_blank" rel="noopener noreferrer">
			<img class="h-7 w-7" src={Face} alt="" />
			<p>Facebook</p>
		</a>
	</div>
	<div class="mt-1 flex w-[95%] h-[150px] items-center justify-center rounded-lg bg-white">
		<div class="gap-4 flex-col flex h-[100%] w-[100%] items-center justify-center rounded-lg">
			<p class="font-['Inter'] text-[17px] font-bold text-black">Horário de funcionamento</p>
			<div class="w-[250px] h-[70px] flex items-center justify-center rounded-lg bg-red-500">
				<p class="text-white font-['Inter'] font-bold text-center">
					{product?.hours}
				</p>
			</div>
		</div>
	</div> -->
<!-- </main> -->

<!-- <main class="mt-3 flex h-[400px] w-[100%] justify-center">
	<div class="flex h-[500px] w-[85%] justify-center rounded-[12px] bg-[#D1D5D9]">
		<div class="flex h-[180px] w-[75%] rounded-[12px] md:h-[57%]">
			<img class="w-[100%] rounded-[12px] object-cover" src="{product?.image} " alt="" />
		</div>
		<div class="absolute flex h-[290px] w-full items-end justify-end">
			<div class=" flex h-[100px] w-full justify-center">
				<div class="flex w-[380px]">
					<div class=" flex h-[70px] w-[360px] items-center justify-center">
						<div
							class=" flex h-[70px] w-[250px] items-center justify-center rounded-[12px] font-serif text-lg"
						>
							<p class="text-wrap font-serif text-lg">{product?.title}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="absolute flex h-[50px] w-[100%] justify-start">
				<div class="z-50 mt-3 w-[85%]">
				</div>
			</div>
		</div>
	</div>
	<div class="absolute flex h-[400px] w-[100%] items-end justify-end">
		<div class="flex h-[100px] w-[100%] items-center justify-center">
			<div class="flex h-[100px] w-[82%] items-center justify-center">
				<div class="z-[1000] flex h-[50px] w-[100%] justify-around">
					<div>
						<a href={`tel:${product?.telefone}`}>
							<img class="h-10 w-10" src={Cals} alt="" />
						</a>
					</div>
					<div>
						<a
							href={`https://wa.me/${product?.whatsapp}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img class="h-10 w-10" src={Ws} alt="" />
						</a>
					</div>
					<div class="relative z-[999999] flex">
						<a href={product?.facebook} target="_blank" rel="noopener noreferrer">
							<img class="h-10 w-10" src={Face} alt="" />
						</a>
					</div>
					<div>
						<a href={product?.instagram} target="_blank" rel="noopener noreferrer">
							<img class="h-10 w-10" src={Insta} alt="" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
<main class="absolute flex h-[1280px] w-[100%] items-center justify-center">
	<div class="flex h-[400px] w-full">
		<div class="flex h-16 w-full flex-col items-center justify-center">
			
			<div class="flex h-[400px] w-full items-center justify-center">
				<div class="flex h-10 w-[80%] items-center justify-center rounded-[12px] bg-[#FCDF1D]">
					<p class="flex font-serif text-[20px] font-bold text-black">LOCALIZE AQUI</p>
				</div>
			</div>
		</div>
	</div>
	<div class="absolute mt-5 flex h-[300px] w-full items-center justify-center">
		<div class="flex h-[290px] w-full items-center justify-center">
			<section class="map-section my-5 h-[400px] w-full md:h-[450px] md:w-[600px]">
				<iframe
					src={product?.maps}
					width="100%"
					height="100%"
					style="border:0; margin-top:6rem; border-radius: 12px;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Mapa de localização para {product?.title}"
				>
				</iframe>
			</section>
			<div class="absolute flex h-[900px] w-full items-end justify-end">
				<div class="flex h-14 w-full items-center justify-center">
					<div class="flex h-full w-[80%] items-center justify-center rounded-[12px] bg-[#FCDF1D]">
						<a class="list-none no-underline" href="/avalie">
							<p class="flex font-serif text-[20px] font-bold text-black hover:text-yellow-100">
								AVALIE NOSSO SITE
							</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main> -->
