<!-- src/routes/Comercios/+page.svelte -->
<script context="module">
    import {load} from './+layout'
   const data = load()
</script>

<script>
    let filteredItems = data.items 
    let selectedCategory = 'Todos'; // Categoria selecionada, inicialmente 'Todos'
    function filter() {
        filteredItems = data.items.filter(item => item.category === selectedCategory);
        
    }
    

    // Função para filtrar os itens com base na categoria selecionada
    // $: filteredItems = selectedCategory === 'Todos'
    //     ? data.items
    //     : data.items.filter(item => item.category === selectedCategory);
</script>

<section class="bg-white dark:bg-gray-900">
    <div class="container px-6 py-10 mx-auto">
        <h1 class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">Lista de Itens</h1>

        <!-- Filtro por Categoria -->
        <div class="mt-4">
            <label for="category" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Categoria</label>
            <select
                id="category"
                bind:value={selectedCategory}
                on:change={filter}
                class="block w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
                {#each data.categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        </div>

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
                        <span class="text-sm text-gray-500 dark:text-gray-400">{item.category}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
