<script lang="ts">
    // Folhetos
    import folheto1 from '$lib/images/cardfolheto2.jpg';
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
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img 
        src="{fernandes}" 
        alt="Folheto Mercado 1" 
        class="w-full h-48 object-cover cursor-pointer"
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
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img 
        src="{mercadosacchi}" 
        alt="Folheto Mercado 2" 
        class="w-full h-48 object-cover cursor-pointer"
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
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img 
        src="{feraa}" 
        alt="Folheto Mercado 2" 
        class="w-full h-48 object-cover cursor-pointer"
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
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img 
        src="{bitar}" 
        alt="Folheto Mercado 2" 
        class="w-full h-48 object-cover cursor-pointer"
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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" on:click={closeModal}>
      <div class="bg-white p-4 rounded-lg max-w-xl w-full" on:click|stopPropagation>
        <img src="{modalImage}" alt="Imagem do folheto" class="w-full h-auto rounded-lg" />
        
        <!-- Botões no modal -->
        <div class="mt-4 flex space-x-4">
          <button on:click={closeModal} class="px-4 py-2 bg-blue-500 text-white rounded-md">
            Fechar
          </button>
  
          <!-- Botão para baixar a imagem -->
          <a href="{modalImage}" download="folheto" class="px-4 py-2 bg-green-500 text-white rounded-md">
            Baixar Imagem
          </a>
        </div>
      </div>
    </div>
  {/if}
  