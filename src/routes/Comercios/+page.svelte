<script context="module">
	import { comercios } from './../../data.js';
    import { load } from './+layout';
    const data = load();
</script>

<script>
    let filteredItems = data.items;
    let selectedCategory = 'Todos';
    let selectedSubcategory = 'Todos';

    // Obtém subcategorias dinâmicas para a categoria selecionada
    $: availableSubcategories = selectedCategory === 'Todos'
        ? [] 
        : [...new Set(data.items.filter(item => item.category === selectedCategory).map(item => item.subcategory))].filter(Boolean);

    // Filtra itens com base na categoria e subcategoria selecionadas
    function filter() {
        filteredItems = data.items.filter(item => {
            const categoryMatch = selectedCategory === 'Todos' || item.category === selectedCategory;
            const subcategoryMatch = selectedSubcategory === 'Todos' || item.subcategory === selectedSubcategory;
            return categoryMatch && subcategoryMatch;
        });
    }
</script>

<section class="bg-white dark:bg-gray-900">
    <div class="container px-6 py-10 mx-auto">
        <h1 class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">Lista de Comércios</h1>

        <!-- Filtro por Categoria -->
        <div class="mt-4">
            <label for="category" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Categoria</label>
            <select
                id="category"
                bind:value={selectedCategory}
                on:change={() => { selectedSubcategory = 'Todos'; filter(); }}
                class="block w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
                <option value="Todos">Todos</option>
                {#each data.categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        </div>

        <!-- Filtro por Subcategoria -->
        {#if availableSubcategories.length > 0}
            <div class="mt-4">
                <label for="subcategory" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Subcategoria</label>
                <select
                    id="subcategory"
                    bind:value={selectedSubcategory}
                    on:change={filter}
                    class="block w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="Todos">Todos</option>
                    {#each availableSubcategories as subcategory}
                        <option value={subcategory}>{subcategory}</option>
                    {/each}
                </select>
            </div>
        {/if}

        <!-- Exibição dos Itens Filtrados -->
        <div class="grid grid-cols-1 gap-8 mt-8 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredItems as item}
                <div class="lg:flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <img
                        class="object-cover w-full h-56 lg:h-auto lg:w-32"
                        src={item.image}
                        alt={item.title}
                    />

                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <a href={`/Comercios/${item.slug}`} class="text-xl font-semibold text-gray-800 hover:underline dark:text-white">
                            {item.title}
                        </a>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                            {item.category}{item.subcategory ? ` - ${item.subcategory}` : ''}
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
