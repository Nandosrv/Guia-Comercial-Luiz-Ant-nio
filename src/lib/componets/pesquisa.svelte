<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let searchQuery: string = '';
    const comercios = [
        { nome: 'Prefeitura Municipal de Luiz Antônio', id: 1, href: '/Comercios/Prefeitura-Municipal-de-Luiz-Antonio' },
    { nome: 'Policia Militar do Estado de Sao Paulo', id: 2, href: '/Comercios/Policia-Militar-do-Estado-de-Sao-Paulo' },
    { nome: 'Delegacia de Policia Civil', id: 3, href: '/Comercios/Delegacia-de-Policia-Civil' },
    { nome: 'Hotel Vero Verde', id: 4, href: '/Comercios/Hotel-Vero-Verde' },
    { nome: 'FERA Supermercado', id: 5, href: '/Comercios/FERA-Supermercado' },
    { nome: 'FERNANDES SUPERMERCADO', id: 6, href: '/Comercios/FERNANDES-SUPERMERCADO' },
    { nome: 'SUPERMERCADO BITTAR', id: 7, href: '/Comercios/SUPERMERCADO-BITTAR' },
    { nome: 'Supermercado Sacchi e Guedes', id: 8, href: '/Comercios/Supermercado-Sacchi-e-Guedes' },
    { nome: 'Real Lopes Supermercado', id: 9, href: '/Comercios/Real-Lopes-Supermercado' },
    { nome: 'Supermercado Martins', id: 10, href: '/Comercios/Supermercado-Martins' },
    { nome: 'Drogaria Total Unipharma I', id: 11, href: '/Comercios/Drogaria-Total-Unipharma-I' },
    { nome: 'Drogaria Total Farmavip 3', id: 12, href: '/Comercios/Drogaria-Total-Farmavip-3' },
    { nome: 'Drogaria Total Unipharma II', id: 13, href: '/Comercios/Drogaria-Total-Unipharma-II' },
    { nome: 'Drogaria Brasil', id: 14, href: '/Comercios/Drogaria-Brasil' },
    { nome: 'Marmitaria Dona do Sabor', id: 15, href: '/Comercios/Marmitaria-Dona-do-Sabor' },
    { nome: 'Trem Minero Bar e Restaurante', id: 16, href: '/Comercios/Trem-Minero-Bar-e-Restaurante' },
    { nome: 'Restaurante Uniao Gaucha', id: 17, href: '/Comercios/Restaurante-Uniao-gaucha' },
    { nome: 'Restaurante La Tavola', id: 18, href: '/Comercios/Restaurante-La-Tavola' },
    { nome: 'Adega Santos Restaurante E Lanchonete', id: 19, href: '/Comercios/Adega-Santos-Restaurante-E-Lanchonete' },
    { nome: 'Deposito de Bebidas e Mercado no Grau', id: 20, href: '/Comercios/Deposito-de-bebidas-e-mercado-no-grau' },
    { nome: 'Mercado Bebidas Em Geral', id: 21, href: '/Comercios/Mercado-Bebidas-Em-Geral' },
    { nome: 'Unidade de Saúde Dr Emílio Serafim', id: 22, href: '/Comercios/Unidade-de-Saude-Dr-Eilio-Serafim' },
    { nome: 'Unidade Mista de Luiz Antônio', id: 23, href: '/Comercios/Unidade-Mista-de-Luiz-Antonio' },
    { nome: 'São Francisco Saúde', id: 24, href: '/Comercios/Sao-Francisco-saude' },
    { nome: 'Sala de Vacinacao Emílio Serafim', id: 25, href: '/Comercios/Sala-de-vacinacao-Emilio-Serafim' },
    { nome: 'Transporte Emílio Serafim', id: 26, href: '/Comercios/Transporte-Emilio-Serafim' },
    { nome: 'Loja da Construção', id: 27, href: '/Comercios/Loja-da-Construcao' },
    { nome: 'Rodrigues Mat Deposito Renato', id: 28, href: '/Comercios/rodrigues-mat-deposito-renato' },
    { nome: 'Kilanchao', id: 29, href: '/Comercios/Kilanchao' },
    { nome: 'Trailer do João', id: 30, href: '/Comercios/Trailer-do-Joao' },
    { nome: 'Auto Posto Colorado', id: 31, href: '/Comercios/Auto-Posto-Colorado' },
    { nome: 'Posto Ipiranga', id: 32, href: '/Comercios/Posto-Ipiranga' },
    { nome: 'Posto Iguatemi', id: 33, href: '/Comercios/Posto-Iguatemi' },
    { nome: 'Cegonhitas Kids Store', id: 34, href: '/Comercios/Cegonhitas-kids-store' },
    { nome: 'Dulorekids', id: 35, href: '/Comercios/Dulorekids' },
    { nome: 'NINA NYKO', id: 36, href: '/Comercios/NINA-NYKO' },
    { nome: 'Karina Xavier', id: 37, href: '/Comercios/Karina-Xavier' },
    { nome: 'New Place Modas', id: 38, href: '/Comercios/New-Place-Modas' },
    { nome: 'Moda Viva', id: 39, href: '/Comercios/Moda-viva' },
    { nome: 'Lauanne Moda Feminina', id: 40, href: '/Comercios/Lauanne-Moda-Feminina' },
    // { nome: 'Por Do Sol Modas', id: 41, href: '/Comercios/Por-Do-Sol-Modas' },
    // { nome: 'Fenix Boutique', id: 42, href: '/Comercios/Fenix-Boutique' },
    { nome: 'Wagner Luiz Marques', id: 43, href: '/Comercios/Wagner-Luiz-Marques' },
    { nome: 'Modas E Acessorios Z', id: 44, href: '/Comercios/Modas-E-Acessorios-Z' },
    { nome: 'Chelly Modas', id: 45, href: '/Comercios/Chelly-modas' },
    { nome: 'Borracheiro Movel 24h Duh Borracheiro', id: 46, href: '/Comercios/Borracheiro-movel-24h-Duh-Borracheiro' },
    { nome: 'Merchan', id: 47, href: '/Comercios/Merchan' },
    { nome: 'Porfirio Veiculos', id: 48, href: '/Comercios/Porfirio-Veiculos' },
    { nome: 'Skina Veiculos Luiz Antonio', id: 48, href: '/Comercios/Skina-Veiculos-Luiz-Antonio' }
    
    ];
    
    let filteredComercios = comercios;
    let isDropdownOpen = false;
    let searchBox: HTMLDivElement | null = null;

    // Filtra os comércios conforme o usuário digita
    function filterComercios() {
        const query = searchQuery.trim().toLowerCase();
        filteredComercios = comercios.filter(comercio => 
            comercio.nome.toLowerCase().includes(query)
        );
        isDropdownOpen = !!searchQuery; // Exibe dropdown se houver busca
    }

    // Fecha dropdown ao clicar fora da área de pesquisa
    function handleClickOutside(event: MouseEvent) {
        if (searchBox && !searchBox.contains(event.target as Node)) {
            isDropdownOpen = false;
        }
    }

    // Apaga o texto da pesquisa ao sair da página
    onDestroy(() => {
        searchQuery = ''; // Reseta o valor da pesquisa
    });

    // Adiciona o evento ao montar o componente
    onMount(() => {
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="relative max-w-md mx-auto" bind:this={searchBox}>
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 h-[40px]">
        <svg class="w-5 h-5 text-blue-500 flex items-center mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" />
        </svg>
    </span>

    <input
        type="text"
        bind:value={searchQuery}
        on:input={filterComercios}
        on:focus={() => (isDropdownOpen = true)}
        class="w-[200px] h-[30px] rounded-[12px] border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-600 dark:bg-yellow-400 dark:text-blue-500 dark:focus:border-blue-500 "
        placeholder="Busca Rápida"
    />

    {#if isDropdownOpen && searchQuery}
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
