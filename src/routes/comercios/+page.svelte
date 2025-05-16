<script context="module">
	import { load } from './+layout';
	const data = load();
	export {
		data
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { fly } from 'svelte/transition';
	import Generate from '$lib/componets/Generate.svelte';
	import { Store, Search, MapPin, Star, ChevronRight, Filter, Clock, Phone, Heart } from 'lucide-svelte';

	// Interfaces para tipagem
	interface Comerciante {
		id?: string;
		slug?: string;
		nome: string;
		categoria?: string;
		subcategoria?: string;
		telefone?: string;
		whatsapp?: string;
		email?: string;
		facebook?: string;
		instagram?: string;
		horarios_funcionamento?: any;
		fotos?: string[];
		'photo-comercio'?: string;
	}

	interface ComercioItem {
		slug: string;
		title: string;
		category: string;
		subcategory?: string;
		telefone?: string;
		whatsapp?: string;
		email?: string;
		facebook?: string;
		instagram?: string;
		hours?: string;
		image: string;
		maps?: string;
		isDynamic?: boolean;
	}

	interface ComercioItemWithFavorite extends ComercioItem {
		isFavorite: boolean;
	}

	interface Comentario {
		id: string;
		nome_usuario: string;
		comentario: string;
		avaliacao: number;
		criado_em: string;
		resposta?: string;
		data_resposta?: string;
	}

	// Estado para armazenar todos os itens (estáticos + dinâmicos)
	let allItems: ComercioItem[] = [...data.items];
	let filteredItems: ComercioItem[] = allItems;
	let selectedCategory = 'Todos';
	let selectedSubcategory = 'Todos';
	let searchQuery = '';
	let isLoading = false;
	let error: string | null = null;

	// Adiciona isFavorite para cada item
	$: itemsWithFavorites = filteredItems.map(item => ({
		...item,
		isFavorite: false
	}));

	$: availableSubcategories =
		selectedCategory === 'Todos'
			? []
			: [
					...new Set(
						allItems
							.filter((item) => item.category === selectedCategory)
							.map((item) => item.subcategory)
					)
				].filter(Boolean);

	// Função para buscar comerciantes do banco de dados
	async function fetchComerciantes() {
		isLoading = true;
		try {
			// Detecta ambiente local
			const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
			const apiUrl = isLocal
				? 'http://localhost:3000/comerciantes'
				: 'https://api-backend-production-5b22.up.railway.app/comerciantes';

			let response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`Falha ao buscar comerciantes: ${response.status}`);
			}
			const responseData = await response.json();

			// Transformar os comerciantes do banco para o mesmo formato dos estáticos
			const dynamicItems = responseData.map((comerciante: Comerciante) => ({
				slug: comerciante.slug || comerciante.id || `comercio-${comerciante.nome.toLowerCase().replace(/\s+/g, '-')}`,
				title: comerciante.nome,
				category: comerciante.categoria || 'Outros',
				subcategory: comerciante.subcategoria,
				telefone: comerciante.telefone,
				whatsapp: comerciante.whatsapp,
				email: comerciante.email,
				facebook: comerciante.facebook,
				instagram: comerciante.instagram,
				hours: comerciante.horarios_funcionamento ? 'Veja detalhes' : 'Horário não informado',
				image: comerciante['photo-comercio'] || (comerciante.fotos && comerciante.fotos.length > 0 ? comerciante.fotos[0] : 'https://via.placeholder.com/300x200?text=Sem+Imagem'),
				maps: '',
				isDynamic: true // Marcar como dinâmico para possíveis tratamentos específicos
			}));

			// Combinar com os itens estáticos
			allItems = [...data.items, ...dynamicItems];
			filter(); // Aplicar filtros aos novos itens
		} catch (err: unknown) {
			console.error('Erro ao buscar comerciantes:', err);
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Erro desconhecido ao buscar comerciantes';
			}
			// Garantir que os itens estáticos ainda sejam mostrados mesmo com erro
			allItems = [...data.items];
			filter();
		} finally {
			isLoading = false;
		}
	}

	function filter() {
		filteredItems = allItems.filter((item) => {
			const categoryMatch = selectedCategory === 'Todos' || item.category === selectedCategory;
			const subcategoryMatch =
				selectedSubcategory === 'Todos' || item.subcategory === selectedSubcategory;
			const searchMatch = !searchQuery || 
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(item.subcategory && item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
			
			return categoryMatch && subcategoryMatch && searchMatch;
		});
	}
	
	function toggleFavorite(index: number) {
		itemsWithFavorites[index].isFavorite = !itemsWithFavorites[index].isFavorite;
		itemsWithFavorites = [...itemsWithFavorites]; // Força atualização
	}
	
	function resetFilters() {
		selectedCategory = 'Todos';
		selectedSubcategory = 'Todos';
		searchQuery = '';
		filter();
	}
	
	function handleSearchInput() {
		filter();
	}
	
	onMount(() => {
		setLastPathUrl($page.url.pathname);
		fetchComerciantes(); // Buscar comerciantes dinâmicos ao montar o componente
	});
</script>

<!-- Hero Section -->
<section class="relative bg-gradient-to-r from-blue-900 to-blue-800 py-20">
	<!-- Overlay Pattern -->
	<div class="absolute inset-0 opacity-10 z-0 pattern-diagonal"></div>
	
	<div class="container mx-auto px-4 relative z-10">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl md:text-5xl font-bold text-white mb-6 slide-in-bottom">
				Descubra os Melhores Comércios de Luiz Antônio
			</h1>
			<p class="text-xl text-blue-100 mb-10 slide-in-bottom" style="animation-delay: 100ms;">
				Encontre facilmente estabelecimentos locais, conecte-se diretamente e tenha acesso a todas as informações que você precisa.
			</p>
			
			<!-- Barra de Pesquisa -->
			<div class="max-w-2xl mx-auto slide-in-bottom" style="animation-delay: 200ms;">
				<div class="bg-white/10 backdrop-blur-sm rounded-full p-2 flex items-center border border-white/20 shadow-lg">
					<div class="bg-white/10 p-2 rounded-full ml-2">
						<Search class="h-5 w-5 text-white" />
					</div>
					<input 
						type="text" 
						bind:value={searchQuery}
						on:input={handleSearchInput}
						placeholder="Buscar por nome, categoria ou tipo..." 
						class="flex-1 bg-transparent border-none outline-none px-4 py-2 text-white placeholder-white/70"
					/>
					<button 
						class="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-6 py-2 rounded-full text-white font-medium transition-all hover:shadow-lg"
						on:click={filter}
					>
						Buscar
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Wave bottom effect -->
	<div class="absolute bottom-0 left-0 w-full">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
			<path fill="#ffffff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" class="dark:fill-gray-900"></path>
		</svg>
	</div>
</section>

<!-- Conteúdo Principal -->
<section class="py-12 bg-white dark:bg-gray-900">
	<div class="container mx-auto px-4">
		<div class="flex w-full justify-center mb-12">
			<Generate />
		</div>

		<!-- Filtros e Resultados -->
		<div class="flex flex-col lg:flex-row gap-8">
			<!-- Sidebar de Filtros -->
			<div class="w-full lg:w-1/4">
				<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-20">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<Filter class="h-5 w-5 text-red-500" />
							Filtros
						</h2>
						<button 
							on:click={resetFilters}
							class="text-sm text-red-500 hover:text-red-700 font-medium"
						>
							Limpar filtros
						</button>
					</div>
					
				<!-- Filtro por Categoria -->
					<div class="mb-6">
						<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Categoria
					</label>
					<select
						id="category"
						bind:value={selectedCategory}
						on:change={() => {
							selectedSubcategory = 'Todos';
							filter();
						}}
							class="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option value="Todos">Todas as categorias</option>
						{#each data.categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>

					<!-- Filtro por Subcategoria (se disponível) -->
				{#if availableSubcategories.length > 0}
						<div class="mb-6">
							<label for="subcategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Subcategoria
						</label>
						<select
							id="subcategory"
							bind:value={selectedSubcategory}
							on:change={filter}
								class="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="Todos">Todas as subcategorias</option>
							{#each availableSubcategories as subcategory}
								<option value={subcategory}>{subcategory}</option>
							{/each}
						</select>
					</div>
				{/if}
					
					<!-- Estatísticas Rápidas -->
					<div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-8">
						<h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Estatísticas</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Total de comércios:</span>
								<span class="font-medium text-gray-900 dark:text-white">{allItems.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Categorias:</span>
								<span class="font-medium text-gray-900 dark:text-white">{data.categories.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Resultados encontrados:</span>
								<span class="font-medium text-gray-900 dark:text-white">{filteredItems.length}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Lista de Comércios -->
			<div class="w-full lg:w-3/4">
				<!-- Cabeçalho dos Resultados -->
				<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
							{filteredItems.length} {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
						</h2>
						{#if selectedCategory !== 'Todos' || selectedSubcategory !== 'Todos' || searchQuery}
							<p class="text-gray-600 dark:text-gray-400 mt-1">
								Filtros ativos: 
								{#if selectedCategory !== 'Todos'}<span class="font-medium">{selectedCategory}</span>{/if}
								{#if selectedSubcategory !== 'Todos'}<span class="font-medium">, {selectedSubcategory}</span>{/if}
								{#if searchQuery}<span class="font-medium">, "{searchQuery}"</span>{/if}
							</p>
						{/if}
					</div>
					
					<div class="flex gap-2">
						<select
							class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
						>
							<option value="relevance">Ordenar por relevância</option>
							<option value="az">Nome (A-Z)</option>
							<option value="za">Nome (Z-A)</option>
						</select>
			</div>
		</div>

				<!-- Estado de carregamento -->
				{#if isLoading}
					<div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
						<div class="inline-flex items-center justify-center">
							<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
						</div>
						<p class="mt-4 text-gray-600 dark:text-gray-400">Carregando comércios...</p>
					</div>
				{:else if error}
					<div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
						{#if error.includes('API indisponível')}
							<div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Dados de Demonstração</h3>
							<p class="text-gray-600 dark:text-gray-400 mb-4">Os servidores estão temporariamente indisponíveis. Exibindo comércios de demonstração.</p>
							<p class="text-sm text-yellow-600 dark:text-yellow-400">Você pode continuar navegando normalmente.</p>
						{:else}
							<p class="text-red-500 mb-4">Erro ao carregar comércios dinâmicos: {error}</p>
							<p class="text-gray-600 dark:text-gray-400 mb-4">Mostrando apenas comércios estáticos.</p>
						{/if}
					</div>
				{/if}

				<!-- Grid de Comércios -->
				{#if filteredItems.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{#each itemsWithFavorites as item, index}
							<div
								class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 group relative"
							>
								<!-- Favorito -->
								<button 
									class="absolute z-10 right-4 top-4 p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/30 transition-all" 
									on:click={() => toggleFavorite(index)}
									aria-label="Favoritar"
								>
									<Heart class={`h-5 w-5 ${item.isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
								</button>
								
								<!-- Indicador de origem (apenas visual para debug) -->
								{#if 'isDynamic' in item && item.isDynamic}
									<div class="absolute z-10 left-4 top-4 py-1 px-2 bg-green-500/80 backdrop-blur-sm rounded-md text-xs text-white font-medium">
										Dinâmico
									</div>
								{/if}
								
								<!-- Imagem do Comércio -->
					<div class="relative h-48 overflow-hidden">
									<a href={`/comercios/${item.slug}`}>
						<img
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							src={item.image}
							alt={item.title}
						/>
										<div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
										
										<!-- Badges sobre a imagem -->
										<div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
											<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
								{item.category}
							</span>
							{#if item.subcategory}
												<span class="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
									{item.subcategory}
								</span>
							{/if}
										</div>
									</a>
								</div>
								
								<!-- Conteúdo do Card -->
								<div class="p-5">
									<div class="flex items-start justify-between">
										<div>
											<a
												href={`/comercios/${item.slug}`}
												class="text-xl font-bold text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors line-clamp-1"
											>
												{item.title}
											</a>
											
											<div class="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
												<MapPin class="h-4 w-4" />
												<span>Luiz Antônio, SP</span>
											</div>
										</div>
										
										<div class="flex items-center gap-1 text-yellow-400">
											<Star class="h-4 w-4 fill-current" />
											<span class="font-medium">5.0</span>
										</div>
									</div>
									
									{#if item.hours}
										<div class="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
											<Clock class="h-4 w-4" />
											<span class="line-clamp-1">{typeof item.hours === 'string' ? item.hours.split('\n')[0] : item.hours}</span>
										</div>
									{/if}
									
									<div class="flex gap-2 mt-4">
										<a 
											href={`tel:${item.telefone}`}
											class="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white text-sm font-medium text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
										>
											<Phone class="h-4 w-4 inline-block mr-1" />
											Ligar
										</a>
										<a 
											href={`/comercios/${item.slug}`}
											class="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium text-center hover:bg-red-600 transition-colors flex items-center justify-center"
										>
											Ver detalhes
											<ChevronRight class="h-4 w-4 ml-1" />
										</a>
						</div>
					</div>
				</div>
			{/each}
					</div>
				{:else}
					<!-- Nenhum resultado -->
					<div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
						<div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
							<Search class="h-8 w-8 text-gray-500 dark:text-gray-400" />
						</div>
						<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum comércio encontrado</h3>
						<p class="text-gray-600 dark:text-gray-400 mb-6">Não encontramos resultados com os filtros selecionados.</p>
						<button 
							on:click={resetFilters}
							class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
						>
							Limpar filtros
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Seção de Call-to-Action -->
<section class="bg-gradient-to-r from-red-600 to-red-500 py-16">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
				É proprietário de um comércio em Luiz Antônio?
			</h2>
			<p class="text-xl text-white/90 mb-8">
				Aumente sua visibilidade e conecte-se com mais clientes. Anuncie seu estabelecimento no maior guia comercial da região.
			</p>
			<a 
				href="/Anuncios-Promocao" 
				class="inline-flex items-center px-8 py-3 bg-white text-red-600 font-bold rounded-full text-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all transform hover:scale-105"
			>
				<Store class="h-5 w-5 mr-2" />
				Anuncie seu Comércio
			</a>
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

	
	@keyframes slide-in-bottom {
		from { transform: translateY(50px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.slide-in-bottom {
		animation: slide-in-bottom 0.8s ease forwards;
	}
	
	.pattern-diagonal {
		background-image: url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.3" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E');
	}
	
	
</style>
