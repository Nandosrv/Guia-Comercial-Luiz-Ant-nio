<script>
    let searchQuery = '';
    let comercios = [
        { nome: 'Pizzaria Bella', id: 1, href: '/comercios/pizzaria-bella' },
        { nome: 'Joalheria Luxo', id: 2, href: '/comercios/joalheria-luxo' },
        { nome: 'Bar do João', id: 3, href: '/comercios/bar-do-joao' },
        { nome: 'Restaurante Saboroso', id: 4, href: '/comercios/restaurante-saboroso' },
        // Adicione mais comércios conforme necessário
    ];
    let filteredComercios = comercios;

    // Função que filtra os comércios com base na busca
    function filterComercios() {
        filteredComercios = comercios.filter(comercio => 
            comercio.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
</script>

<div class="relative w-full max-w-md mx-auto">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" />
        </svg>
    </span>

    <input
        type="text"
        bind:value={searchQuery}
        on:input={filterComercios}
        class="w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
        placeholder="Pesquisar comércios"
    />

    <!-- Lista de comércios filtrados -->
    <div class="absolute z-10 w-full mt-1">
        {#if searchQuery}
            {#if filteredComercios.length > 0}
                <div class="bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {#each filteredComercios as comercio}
                        <a href={comercio.href} class="block p-4 border-b border-gray-200 hover:bg-gray-100">
                            <h3 class="font-semibold text-gray-800 dark:text-gray-200">{comercio.nome}</h3>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="p-4 bg-white rounded-lg shadow-lg">
                    <p class="text-gray-500 dark:text-gray-400">Nenhum comércio encontrado.</p>
                </div>
            {/if}
        {/if}
    </div>
</div>
