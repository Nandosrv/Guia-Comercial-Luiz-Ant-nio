<script lang="ts">
    import { goto } from '$app/navigation'; // Importa a função goto para navegação
    let searchQuery: string = '';
    let suggestions: string[] = [];
    const commerceList: { name: string; id: string }[] = [
      { name: "Mercado São João", id: "mercado-sao-joao" },
      { name: "Pizzaria do Luiz", id: "pizzaria-do-luiz" },
      { name: "Farmácia do Povo", id: "farmacia-do-povo" },
      { name: "Restaurante Saboroso", id: "restaurante-saboroso" },
      { name: "Loja de Roupas Chic", id: "loja-de-roupas-chic" },
      { name: "Posto de Gasolina Luiz Antônio", id: "posto-gasolina-luiz" },
      { name: "Bar do Amigo", id: "bar-do-amigo" },
      {name:  'farmacia-do-joao', id: 'farmacia-do-joao'},


    ];
  
    function showSuggestions() {
      if (searchQuery.trim() === '') {
        suggestions = [];
        return;
      }
  
      suggestions = commerceList
        .filter(commerce => commerce.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(commerce => commerce.name);
    }
  
    function selectSuggestion(suggestion: string) {
      const commerce = commerceList.find(c => c.name === suggestion);
      if (commerce) {
        goto(`/commerce/${commerce.id}`); // Navega para a página de detalhes do comércio
      }
      suggestions = [];
    }
  </script>
  
  <style>
    .suggestion {
      cursor: pointer;
    }
    .suggestion:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  </style>
  
  <div class="flex flex-col items-center justify-center min-h-6">    <div class="relative w-full  max-w-md mb-6">       <input         type="text"         bind:value={searchQuery}         on:input={showSuggestions}         placeholder="Digite o nome do comércio..."         class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"       />
      {#if suggestions.length > 0}
        <div class="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md">
          {#each suggestions as suggestion}
            <div 
              class="suggestion p-2 hover:bg-gray-200"
              role="button"
              tabindex="0"
              on:click={() => selectSuggestion(suggestion)}
              on:keydown={(e) => e.key === 'Enter' && selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  