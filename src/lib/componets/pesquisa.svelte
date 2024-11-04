<script>
    let searchQuery = '';
    const comercios = [
        { nome: 'Pizzaria Bella', id: 1, href: '/Comercios/pizzaria-bella' },
        { nome: 'Joalheria Luxo', id: 2, href: '/Comercios/joalheria-luxo' },
        { nome: 'Bar do João', id: 3, href: '/Comercios/bar-do-joao' },
        { nome: 'Restaurante Saboroso', id: 4, href: '/Comercios/restaurante-saboroso' },
        { nome: 'farmcia-Advogados', id: 5, href: '/Comercios/farmcia-Advogados' },
        { nome: 'farmcia-Advogados', id: 6, href: '/Comercios/farmcia-Advogados' },


        
        // Adicione mais comércios conforme necessário
    ];
    let filteredComercios = comercios;

    // Filtra os comércios conforme o usuário digita
    function filterComercios() {
        const query = searchQuery.trim().toLowerCase();
        filteredComercios = comercios.filter(comercio => 
            comercio.nome.toLowerCase().includes(query)
        );
    }
</script>

<div class="relative w-[400px] max-w-md mx-auto">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 h-[40px] ">
        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" />
        </svg>
    </span>

    <input
        type="text"
        bind:value={searchQuery}
        on:input={filterComercios}
        class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
        placeholder="Busca Rápida"
    />

    <!-- Lista de comércios filtrados -->
    {#if searchQuery}
        <div class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
            {#if filteredComercios.length > 0}
                {#each filteredComercios as comercio}
                    <a href={comercio.href} class="block p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200">{comercio.nome}</h3>
                    </a>
                {/each}
            {:else}
                <div class="p-4 text-center">
                    <p class="text-gray-500 dark:text-gray-400">Nenhum comércio encontrado.</p>
                </div>
            {/if}
        </div>
    {/if}
</div>
