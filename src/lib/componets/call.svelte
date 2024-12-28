<script>
  import { fade, slide, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let darkMode = false;
  let showModal = false;
  let filterCategory = 'all';
  let categories = ['Restaurantes', 'Serviços', 'Varejo', 'Saúde', 'Educação'];
  
  let ads = [
    { id: 1, title: 'Restaurante Delícia', description: 'Comida caseira com sabor inigualável', image: 'https://picsum.photos/seed/rest1/300/200', rating: 4.5, phoneNumber: '123-456-7890', whatsapp: '5511987654321', category: 'Restaurantes', selectedPlan: 'premium' },
    { id: 2, title: 'Mecânica Rápida', description: 'Serviços automotivos de qualidade', image: 'https://picsum.photos/seed/mech1/300/200', rating: 4.2, phoneNumber: '098-765-4321', whatsapp: '5511123456789', category: 'Serviços', selectedPlan: 'featured' },
    { id: 3, title: 'Loja de Eletrônicos', description: 'Os melhores preços em tecnologia', image: 'https://picsum.photos/seed/tech1/300/200', rating: 4.7, phoneNumber: '555-123-4567', whatsapp: '5511555666777', category: 'Varejo', selectedPlan: 'basic' },
    { id: 4, title: 'Café Aroma', description: 'O melhor café da cidade', image: 'https://picsum.photos/seed/cafe1/300/200', rating: 4.8, phoneNumber: '777-888-9999', whatsapp: '5511777888999', category: 'Restaurantes', selectedPlan: 'premium' },
    { id: 5, title: 'Academia Fitness', description: 'Sua saúde em primeiro lugar', image: 'https://picsum.photos/seed/fit1/300/200', rating: 4.6, phoneNumber: '222-333-4444', whatsapp: '5511222333444', category: 'Saúde', selectedPlan: 'featured' },
    { id: 6, title: 'Livraria Saber', description: 'Conhecimento ao seu alcance', image: 'https://picsum.photos/seed/book1/300/200', rating: 4.4, phoneNumber: '666-777-8888', whatsapp: '5511666777888', category: 'Educação', selectedPlan: 'basic' },
  ];

  $: filteredAds = filterCategory === 'all' 
    ? ads 
    : ads.filter(ad => ad.category === filterCategory);

  function toggleModal() {
    showModal = !showModal;
  }

  /**
 * @param {any} _event
 */
  function submitAd(_event) {
    // Handle ad submission logic here
    toggleModal();
  }

  /**
 * @param {{ id?: number; title: any; description?: string; image?: string; rating?: number; phoneNumber?: string; whatsapp?: string; category?: string; selectedPlan?: string; }} ad
 */
  /**
 * @param {{ id?: number; title: any; description?: string; image?: string; rating?: number; phoneNumber?: string; whatsapp?: string; category?: string; selectedPlan?: string; }} ad
 */
  function shareAd(ad) {
    // Implement sharing logic here
    alert(`Compartilhando anúncio: ${ad.title}`);
  }
</script>

<main class="font-sans min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 {darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}">
  <div class="max-w-7xl mx-auto">
    <header class="flex justify-between items-center mb-12">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r {darkMode ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-600'} text-transparent bg-clip-text">
        Anúncios Locais em Destaque
      </h1>
      <button 
        on:click={() => darkMode = !darkMode}
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Alternar modo escuro"
      >
        {#if darkMode}
          🌞
        {:else}
          🌙
        {/if}
      </button>
    </header>

    <div class="mb-12 text-center">
      <button
        on:click={toggleModal}
        class="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        Adicionar Anúncio
      </button>
    </div>

    <section class="mb-16">
      <h2 class="text-2xl sm:text-3xl font-bold mb-8 bg-gradient-to-r {darkMode ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-600'} text-transparent bg-clip-text">Destaques da Semana</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each filteredAds.filter(ad => ad.selectedPlan === 'premium') as ad (ad.id)}
          <div 
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            in:fade={{duration: 300, delay: 300}}
            out:fade={{duration: 300}}
          >
            <img src={ad.image} alt={ad.title} class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{ad.title}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">{ad.description}</p>
              <div class="flex items-center mb-4">
                <span class="text-yellow-400 mr-1">{'⭐'.repeat(Math.round(ad.rating))}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">{ad.rating.toFixed(1)}</span>
              </div>
              <div class="flex justify-between items-center">
                <button 
                  on:click={() => shareAd(ad)}
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Compartilhar
                </button>
                <a 
                  href={`tel:${ad.phoneNumber}`}
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Ligar
                </a>
                <a 
                  href={`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent('Olá, estou interessado no anúncio!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r {darkMode ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-600'} text-transparent bg-clip-text">Todos os Anúncios</h2>
        <div class="relative">
          <select
            bind:value={filterCategory}
            class="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option value="all">Todas Categorias</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each filteredAds as ad (ad.id)}
          <div 
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            in:scale={{duration: 300, delay: 300, easing: quintOut}}
            out:fade={{duration: 300}}
          >
            <img src={ad.image} alt={ad.title} class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{ad.title}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">{ad.description}</p>
              <div class="flex items-center mb-4">
                <span class="text-yellow-400 mr-1">{'⭐'.repeat(Math.round(ad.rating))}</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">{ad.rating.toFixed(1)}</span>
              </div>
              <div class="flex justify-between items-center">
                <button 
                  on:click={() => shareAd(ad)}
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Compartilhar
                </button>
                <a 
                  href={`tel:${ad.phoneNumber}`}
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Ligar
                </a>
                <a 
                  href={`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent('Olá, estou interessado no anúncio!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>

  {#if showModal}
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      transition:fade={{duration: 200}}
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        transition:slide={{duration: 300}}
      >
        <h2 class="text-2xl font-bold mb-6 text-center bg-gradient-to-r {darkMode ? 'from-purple-400 to-pink-600' : 'from-purple-600 to-pink-600'} text-transparent bg-clip-text">Adicionar Anúncio</h2>
        <form on:submit|preventDefault={submitAd} class="space-y-4">
          <div>
            <label for="businessName" class="block mb-1 font-medium">Nome do Comércio</label>
            <input 
              id="businessName" 
              type="text" 
              class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Nome do Comércio"
            />
          </div>
          
          <div>
            <label for="category" class="block mb-1 font-medium">Categoria</label>
            <select 
              id="category" 
              class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="description" class="block mb-1 font-medium">Descrição</label>
            <textarea 
              id="description" 
              class="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              rows="3"
              placeholder="Descreva seu negócio"
            ></textarea>
          </div>

          <div class="flex justify-between mt-8">
            <button
              type="button"
              on:click={toggleModal}
              class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-300 hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md transition-colors duration-300 hover:from-purple-700 hover:to-pink-700"
            >
              Enviar Anúncio
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .dark {
    color-scheme: dark;
  }
</style>