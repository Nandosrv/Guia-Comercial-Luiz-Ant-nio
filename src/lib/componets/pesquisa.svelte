<script lang="ts">
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	let searchQuery: string = '';
	const comercios = [
		{
			nome: 'Prefeitura Municipal de Luiz Antônio',
			id: 1,
			href: '/comercios/Prefeitura-Municipal-de-Luiz-Antonio'
		},
		{
			nome: 'Polícia Militar do Estado de São Paulo',
			id: 2,
			href: '/comercios/Policia-Militar-do-Estado-de-Sao-Paulo'
		},
		{ nome: 'Delegacia de Polícia Civil', id: 3, href: '/comercios/Delegacia-de-Policia-Civil' },
		{ nome: 'Escola Coronel Arthur Pires', id: 4, href: '/comercios/Escola-Coronel-Arthur-Pires' },
		{ nome: 'Técnica de Química', id: 5, href: '/comercios/Tecnica-de-Quimica' },
		{
			nome: 'EMEF Helena Maria Luiz de Mello',
			id: 6,
			href: '/comercios/EMEF-Helena-Maria-Luiz-de-Mello'
		},
		{ nome: 'Escola Roberto Bryan', id: 7, href: '/comercios/Escola-Roberto-Bryan' },
		{ nome: 'Igydio Rosatti Cemei', id: 8, href: '/comercios/Igydio-Rosatti-Cemei' },
		{ nome: 'Hotel Vero Verde', id: 9, href: '/comercios/Hotel-Vero-Verde' },
		{ nome: 'Drogaria Total Unipharma I', id: 10, href: '/comercios/Drogaria-Total-Unipharma-I' },
		{ nome: 'Drogaria Total Farmavip 3', id: 11, href: '/comercios/Drogaria-Total-Farmavip-3' },
		{ nome: 'Drogaria Total Unipharma II', id: 12, href: '/comercios/Drogaria-Total-Unipharma-II' },
		{ nome: 'Drogaria Brasil', id: 13, href: '/comercios/Drogaria-Brasil' },
		{ nome: 'JR Costela ao Bafo', id: 14, href: '/comercios/jr-costela-ao-bafo' },
		{ nome: 'Marmitaria Dona do Sabor', id: 15, href: '/comercios/Marmitaria-Dona-do-Sabor' },
		{
			nome: 'Trem Mineiro Bar e Restaurante',
			id: 16,
			href: '/comercios/Trem-Minero-Bar-e-Restaurante'
		},
		{ nome: 'Restaurante União Gaúcha', id: 17, href: '/comercios/Restaurante-Uniao-gaucha' },
		{ nome: 'Restaurante La Tavola', id: 18, href: '/comercios/Restaurante-La-Tavola' },
		{
			nome: 'Adega Santos Restaurante e Lanchonete',
			id: 19,
			href: '/comercios/Adega-Santos-Restaurante-E-Lanchonete'
		},
		{ nome: 'Profs Burger e Restaurante', id: 20, href: '/comercios/Profs-Burger-e-Restaurante' },
		{ nome: 'Cozinha Piloto Luis Antônio', id: 21, href: '/comercios/Cozinha-Piloto-Luis-Antonio' },
		{ nome: 'Varanda do Frango', id: 22, href: '/comercios/Varanda-do-frango' },
		{ nome: 'Zero Grau Sorveteria', id: 23, href: '/comercios/ZERO-GRAU-SORVETERIA' },
		{ nome: 'Matheus Montagem de Móveis', id: 24, href: '/comercios/Matheus-montagem-de-moveis' },
		{ nome: 'Gelindo Uber', id: 25, href: '/comercios/Gelindo-Uber' },
		{ nome: 'Bim Uber', id: 26, href: '/comercios/Bim-Uber' },
		{
			nome: 'Depósito de Bebidas e Mercado No Grau',
			id: 27,
			href: '/comercios/Deposito-de-bebidas-e-mercado-no-grau'
		},
		{ nome: 'Rubão Cheiro Verde', id: 28, href: '/comercios/Rubao-Cheiro-Verde' },
		{ nome: 'Mercado Bebidas Em Geral', id: 29, href: '/comercios/Mercado-Bebidas-Em-Geral' },
		// { nome: 'Panificadora Romavil', id: 30, href: '/comercios/Panificadora-Romavil' },
		{ nome: 'Olavo Mamede Silva', id: 31, href: '/comercios/Olavo-Mamede-Silva' },
		{
			nome: 'Panificadora Delícias e Pães',
			id: 32,
			href: '/comercios/Panificadora-Delicias-e-Paes'
		},
		{ nome: 'Panificadora Romavil', id: 33, href: '/comercios/PANIFICADORA-ROMAVIL' },
		{ nome: 'Kilanchão', id: 34, href: '/comercios/Kilanchao' },
		{ nome: 'La Família Pizza Delivery', id: 35, href: '/comercios/LA-FAMILIA-PIZZA-DELIVERY' },
		{ nome: 'Zé Coxinha', id: 36, href: '/comercios/Ze-Coxinha' },
		{ nome: 'Trailer do João', id: 37, href: '/comercios/Trailer-do-Joao' },
		{ nome: 'Açaideira Lounge', id: 38, href: '/comercios/Acaideira-Lounge' },
		{ nome: 'Sinucas Bars', id: 39, href: '/comercios/Sinucas-Bars' },
		{ nome: 'Bar e Mercado Oliv Domingos', id: 40, href: '/comercios/Bar-e-Mercado-Oliv-Domingos' },
		{ nome: 'Celso Bar', id: 41, href: '/comercios/Celso-Bar' },
		{ nome: 'Fera Supermercado', id: 42, href: '/comercios/FERA-Supermercado' },
		{ nome: 'Fernandes Supermercado', id: 43, href: '/comercios/FERNANDES-SUPERMERCADO' },
		{ nome: 'Supermercado Bittar', id: 44, href: '/comercios/SUPERMERCADO-BITTAR' },
		{
			nome: 'Supermercado Sacchi e Guedes',
			id: 45,
			href: '/comercios/Supermercado-Sacchi-e-Guedes'
		},
		{ nome: 'Real Lopes Supermercado', id: 46, href: '/comercios/Real-Lopes-Supermercado' },
		{ nome: 'Supermercado Martins', id: 47, href: '/comercios/Supermercado-Martins' },
		{
			nome: 'Unidade de Saúde Dr. Eílio Serafim',
			id: 48,
			href: '/comercios/Unidade-de-Saude-Dr-Eilio-Serafim'
		},
		{
			nome: 'Unidade Mista de Luiz Antônio',
			id: 49,
			href: '/comercios/Unidade-Mista-de-Luiz-Antonio'
		},
		{ nome: 'São Francisco Saúde', id: 50, href: '/comercios/Sao-Francisco-saude' },
		{
			nome: 'Sala de Vacinação Emílio Serafim',
			id: 51,
			href: '/comercios/Sala-de-vacinacao-Emilio-Serafim'
		},
		{ nome: 'Pet Shop Lati & Mia', id: 52, href: '/comercios/Pet-Shop-Lati-&-Mia' },
		{ nome: 'Comercial Miranda', id: 53, href: '/comercios/Comercial-Miranda' },
		{ nome: '3D Informática', id: 54, href: '/comercios/3D-Informatica' },
		{ nome: 'Transporte Emílio Serafim', id: 55, href: '/comercios/Transporte-Emilio-Serafim' },
		{ nome: 'Ortho Clínicas Clínica', id: 56, href: '/comercios/ORTHOclinicas-Clinica' },
		{ nome: 'OdontoCompany', id: 57, href: '/comercios/OdontoCompany' },
		{
			nome: 'Reabilitar Clínica de Fisioterapia',
			id: 58,
			href: '/comercios/Reabilitar-Clinica-de-Fisioterapia'
		},
		{ nome: 'Fisioterapia Pélvica', id: 59, href: '/comercios/Fisioterapia-Pelvica' },
		{
			nome: 'Lafrois Laboratório de Análises Clínicas',
			id: 60,
			href: '/comercios/Lafrois-Laboratorio-de-Analises-Clinicas'
		},
		{ nome: 'UB Eugênio', id: 61, href: '/comercios/UB-Eugenio' },
		{ nome: 'Porfírio Veículos', id: 62, href: '/comercios/Porfirio-Veiculos' },
		{ nome: 'Merchan Multimarcas', id: 63, href: '/comercios/Merchan-Multimarcas' },
		{ nome: 'Skina Veículos Luiz Antônio', id: 64, href: '/comercios/Skina-Veiculos-Luiz-Antonio' },
		{
			nome: 'Borracheiro Móvel 24h Duh Borracheiro',
			id: 65,
			href: '/comercios/Borracheiro-movel-24h-Duh-Borracheiro'
		},
		{ nome: 'Loja da Construção', id: 66, href: '/comercios/Loja-da-Construcao' },
		{
			nome: 'Rodrigues Mat Depósito Renato',
			id: 67,
			href: '/comercios/rodrigues-mat-deposito-renato'
		},
		{ nome: 'Planeta Cores', id: 68, href: '/comercios/Planeta-Cores' },
		{ nome: 'Auto Posto Colorado', id: 69, href: '/comercios/Auto-Posto-Colorado' },
		{ nome: 'Posto Ipiranga', id: 70, href: '/comercios/Posto-Ipiranga' },
		{ nome: 'Posto Iguatemi', id: 71, href: '/comercios/Posto-Iguatemi' },
		{ nome: 'Cegonhitas Kids Store', id: 72, href: '/comercios/Cegonhitas-kids-store' },
		{ nome: 'Dulorekids', id: 73, href: '/comercios/Dulorekids' },
		{ nome: 'Nina Nyko', id: 74, href: '/comercios/NINA-NYKO' },
		{ nome: 'Karina Xavier', id: 75, href: '/comercios/Karina-Xavier' },
		{ nome: 'New Place Modas', id: 76, href: '/comercios/New-Place-Modas' },
		{ nome: 'Moda Viva', id: 77, href: '/comercios/Moda-viva' },
		{ nome: 'Lauanne Moda Feminina', id: 78, href: '/comercios/Lauanne-Moda-Feminina' },
		{ nome: 'Wagner Luiz Marques', id: 79, href: '/comercios/Wagner-Luiz-Marques' },
		{ nome: 'Modas e Acessórios Z', id: 80, href: '/comercios/Modas-E-Acessorios-Z' },
		{ nome: 'Chelly Modas', id: 81, href: '/comercios/Chelly-modas' },
		{ nome: 'Roger Cabeleireiro', id: 82, href: '/comercios/Roger-Cabelereiro' },
		{ nome: 'Luciana Medeiros', id: 83, href: '/comercios/LUCIANA-MEDEIROS' },
		{ nome: 'Studio Janana Loiras', id: 84, href: '/comercios/STUDIO-JANANA-LOIRAS' },
		{ nome: 'Letícia Souza Cabeleireira', id: 85, href: '/comercios/LETICIA-SOUZA-CABELEIREIRA' },
		{ nome: 'Designer Jhenifer Becca', id: 86, href: '/comercios/DESIGNER-JHENIFER-BECCA' },
		{ nome: 'Studio Cinthia Lopes', id: 87, href: '/comercios/STUDIO-CINTHIA-LOPES' },
		{ nome: 'Studio Carolina', id: 88, href: '/comercios/STUDIO-CAROLINA' },
		{ nome: 'Mi Couto', id: 89, href: '/comercios/MI-COUTO' },
		{ nome: 'Sabrina Herrera', id: 90, href: '/comercios/SABRINA-HERRERA' },
		{ nome: 'Epiladora Natália Abreu', id: 91, href: '/comercios/EPILADORA-NATÁLIA-ABREU' },
		{ nome: 'Studio Essência & Beleza', id: 92, href: '/comercios/STUDIO-ESSENCIA-&-BELEZA' },
		{ nome: "Lary's Bijus Fashion", id: 93, href: '/comercios/LARYs-BIJUS-FASHION' },
		{
			nome: 'Menina de Luxo Moda e Acessórios',
			id: 94,
			href: '/comercios/MENINA-DE-LUXO-MODA-E-ACESSORIOS'
		},
		{ nome: 'Imperador Moda Masculina', id: 95, href: '/comercios/MPERADOR-MODA-MASCULINA' },

		{ nome: 'A.r Informática smartphone', id: 95, href: '/comercios/A-R-Informatica-smartphone' },
		{ nome: 'Tecguillen Assistência Técnica Multimarcas', id: 95, href: '/comercios/tecguillen' },
		{ nome: 'Esquina Som', id: 96, href: '/comercios/ESQUINA-SOM' },
		{ nome: 'Odontologia', id: 97, href: '/comercios/Odontologia-Estetica' }
	];

	let filteredComercios = comercios;
	let isDropdownOpen = false;
	let searchBox: HTMLDivElement | null = null;

	// Filtra os comércios conforme o usuário digita
	function filterComercios() {
		const query = searchQuery.trim().toLowerCase();
		filteredComercios = comercios.filter((comercio) => comercio.nome.toLowerCase().includes(query));
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
		console.log('Saindo da página');
		searchQuery = ''; // Reseta o valor da pesquisa
		filterComercios(); // Reseta a lista de comércios
	});

	const handleResetInput = () => {
		searchQuery = '';
		isDropdownOpen = false; // Fecha o dropdown
	};

	// Adiciona o evento ao montar o componente
	onMount(() => {
		setLastPathUrl($page.url.pathname);
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="relative mx-auto flex w-full justify-center" bind:this={searchBox}>
	<div class="w-full max-w-md">
		<div class="relative">
			<!-- Ícone de pesquisa -->
			<span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
				<svg
					class="h-5 w-5 text-blue-500"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z"
					/>
				</svg>
			</span>

			<!-- Campo de busca -->
			<input
				type="text"
				bind:value={searchQuery}
				on:input={filterComercios}
				on:focus={() => (isDropdownOpen = true)}
				class="h-12 w-full rounded-full border-0 bg-white/90 py-2 pl-12 pr-4 text-gray-700 shadow-lg ring-1 ring-inset ring-blue-300 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90 dark:text-white dark:ring-blue-800 dark:placeholder:text-gray-500"
				placeholder="Encontre comércios e serviços..."
			/>
			
			<!-- Botão de limpar pesquisa -->
			{#if searchQuery}
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button 
					class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
					on:click={handleResetInput}
				>
					<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Resultados da pesquisa -->
	{#if isDropdownOpen && searchQuery}
		<div
			class="absolute top-12 z-10 mt-1 w-full max-w-md overflow-hidden rounded-2xl bg-white/95 shadow-xl ring-1 ring-gray-200 backdrop-blur-sm transition-all duration-300 dark:bg-gray-800/95 dark:ring-gray-700"
		>
			<div class="max-h-[60vh] overflow-y-auto">
				{#if filteredComercios.length > 0}
					<!-- Resultados agrupados por categorias -->
					<div class="py-2">
						{#each filteredComercios as comercio}
							<a
								on:click={handleResetInput}
								href={comercio.href}
								class="flex items-center px-4 py-3 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
							>
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-900 dark:text-white">{comercio.nome}</p>
								</div>
								<div class="ml-3 text-blue-500">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center p-8">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="mt-2 text-center text-gray-500 dark:text-gray-400">Nenhum comércio encontrado.</p>
						<p class="text-center text-sm text-gray-400 dark:text-gray-500">Tente outro termo de busca</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
