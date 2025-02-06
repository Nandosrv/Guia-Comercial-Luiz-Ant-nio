<script context="module">
	import { load } from './+layout';
	const data = load();
	export {
		data
	}
</script>

<script>
	let filteredItems = data.items;
	let selectedCategory = 'Todos';
	let selectedSubcategory = 'Todos';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { fly } from 'svelte/transition';
	import Generate from '$lib/componets/Generate.svelte';

	$: availableSubcategories =
		selectedCategory === 'Todos'
			? []
			: [
					...new Set(
						data.items
							.filter((item) => item.category === selectedCategory)
							.map((item) => item.subcategory)
					)
				].filter(Boolean);

	function filter() {
		filteredItems = data.items.filter((item) => {
			const categoryMatch = selectedCategory === 'Todos' || item.category === selectedCategory;
			const subcategoryMatch =
				selectedSubcategory === 'Todos' || item.subcategory === selectedSubcategory;
			return categoryMatch && subcategoryMatch;
		});
	}
</script>

<section
	class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
>
	<div class="flex w-full justify-center">
		<Generate />
	</div>

	<div class="container mx-auto px-6 py-12">
		<!-- Cabeçalho mais estilizado -->
		<div class="mb-12 text-center">
			<h1 class="animate-fade-in text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
				Descubra Comércios Locais
			</h1>
			<p class="mt-4 text-gray-600 dark:text-gray-300">
				Encontre os melhores estabelecimentos comerciais da região
			</p>
		</div>

		<!-- Filtros em um card -->
		<div
			class="mx-auto mb-12 max-w-3xl transform rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
		>
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Filtro por Categoria -->
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Categoria
					</label>
					<select
						id="category"
						bind:value={selectedCategory}
						on:change={() => {
							selectedSubcategory = 'Todos';
							filter();
						}}
						class="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600
                               dark:bg-gray-700 dark:text-white"
					>
						<option value="Todos">Todas as categorias</option>
						{#each data.categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>

				<!-- Filtro por Subcategoria -->
				{#if availableSubcategories.length > 0}
					<div>
						<label
							for="subcategory"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Subcategoria
						</label>
						<select
							id="subcategory"
							bind:value={selectedSubcategory}
							on:change={filter}
							class="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600
                                   dark:bg-gray-700 dark:text-white"
						>
							<option value="Todos">Todas as subcategorias</option>
							{#each availableSubcategories as subcategory}
								<option value={subcategory}>{subcategory}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		</div>

		<!-- Grid de comércios com cards mais elaborados -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredItems as item}
				<div
					class="group transform overflow-hidden rounded-xl bg-white shadow-lg transition-all
                            duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
				>
					<div class="relative h-48 overflow-hidden">
						
						<img
							class="h-full w-full transform object-cover transition-transform duration-300
                                   group-hover:scale-110"
							src={item.image}
							alt={item.title}
						/>
						<div
							class="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-20"
						></div>
					</div>
					<div class="p-6">
						<a
							href={`/comercios/${item.slug}`}
							class="mb-2 block text-xl font-bold text-gray-800
                                   hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
						>
							{item.title}
						</a>
						<div class="flex items-center space-x-2">
							<span
								class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm
                                        font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
							>
								{item.category}
							</span>
							{#if item.subcategory}
								<span
									class="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm
                                            font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									{item.subcategory}
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}
</style>
