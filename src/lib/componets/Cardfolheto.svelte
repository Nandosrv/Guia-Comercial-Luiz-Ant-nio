<script lang="ts">
	// Folhetos
	// import folheto1 from '$lib/images/cardfolheto2.jpg';
	import folheto1 from '$lib/images/folhetos_exemplo.png';
	import fernandes from '$lib/images/z.jpeg';

	// Mercado sacchi
	import mercadosacchi from '$lib/images/sacchi.jpg';

	// feraa
	import feraa from '$lib/images/feraa.png';

	// bitar
	import bitar from '$lib/images/bitar.png';

	// Estado para controlar a visibilidade do modal e da imagem
	let showModal = false;
	let modalImage = '';

	function openModal(image: string) {
		modalImage = image;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<!-- Cards de Folhetos -->
<!-- Card 1 -->
<div class="overflow-hidden rounded-lg bg-white shadow-lg">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		src={fernandes}
		alt="Folheto Mercado 1"
		class="h-48 w-full cursor-pointer object-cover"
		on:click={() => openModal(folheto1)}
	/>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-700">Fernandes Supermercado</h3>
		<button class="" on:click={() => openModal(folheto1)}>
			<p class="text-sm text-blue-500">Confira as ofertas desta semana.</p>
		</button>
	</div>
</div>

<!-- Card 2 -->
<div class="overflow-hidden rounded-lg bg-white shadow-lg">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		src={mercadosacchi}
		alt="Folheto Mercado 2"
		class="h-48 w-full cursor-pointer object-cover"
		on:click={() => openModal(folheto1)}
	/>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-700">Supermercado Sacchi e Guedes</h3>
		<button class="" on:click={() => openModal(folheto1)}>
			<p class="text-sm text-blue-500">Confira as ofertas desta semana.</p>
		</button>
	</div>
</div>
<!-- Card 3 -->
<div class="overflow-hidden rounded-lg bg-white shadow-lg">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		src={feraa}
		alt="Folheto Mercado 2"
		class="h-48 w-full cursor-pointer object-cover"
		on:click={() => openModal(folheto1)}
	/>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-700">Supermercado Fera</h3>
		<button class="" on:click={() => openModal(folheto1)}>
			<p class="text-sm text-blue-500">Confira as ofertas desta semana.</p>
		</button>
	</div>
</div>
<!-- Card 4 -->
<div class="overflow-hidden rounded-lg bg-white shadow-lg">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		src={bitar}
		alt="Folheto Mercado 2"
		class="h-48 w-full cursor-pointer object-cover"
		on:click={() => openModal(folheto1)}
	/>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-700">SUPERMERCADO BITTAR</h3>
		<button class="" on:click={() => openModal(folheto1)}>
			<p class="text-sm text-blue-500">Confira as ofertas desta semana.</p>
		</button>
	</div>
</div>
<!-- Modal para exibir imagem -->
{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black bg-opacity-50"
		on:click={closeModal}
	>
		<div class="w-full max-w-xl rounded-lg bg-secondary p-4" on:click|stopPropagation>
			<img src={modalImage} alt="Imagem do folheto" class="h-[60vh] w-full rounded-lg" />

			<!-- Botões no modal -->
			<div class="mt-4 flex space-x-4">
				<button on:click={closeModal} class="rounded-md bg-blue-500 px-4 py-2 text-white">
					Fechar
				</button>

				<!-- Botão para baixar a imagem -->
				<a
					href={modalImage}
					download="folheto"
					class="rounded-md bg-green-500 px-4 py-2 text-white"
				>
					Baixar Imagem
				</a>
			</div>
		</div>
	</div>
{/if}
