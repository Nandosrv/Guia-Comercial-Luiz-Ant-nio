<script lang="ts">
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	let searchQuery: string = '';
	const comercios = [
		{
			nome: 'Prefeitura Municipal de Luiz Antônio',
			id: 1,
			href: '/Comercios/Prefeitura-Municipal-de-Luiz-Antonio'
		},
		{
			nome: 'Polícia Militar do Estado de São Paulo',
			id: 2,
			href: '/Comercios/Policia-Militar-do-Estado-de-Sao-Paulo'
		},
		{ nome: 'Delegacia de Polícia Civil', id: 3, href: '/Comercios/Delegacia-de-Policia-Civil' },
		{ nome: 'Escola Coronel Arthur Pires', id: 4, href: '/Comercios/Escola-Coronel-Arthur-Pires' },
		{ nome: 'Técnica de Química', id: 5, href: '/Comercios/Tecnica-de-Quimica' },
		{
			nome: 'EMEF Helena Maria Luiz de Mello',
			id: 6,
			href: '/Comercios/EMEF-Helena-Maria-Luiz-de-Mello'
		},
		{ nome: 'Escola Roberto Bryan', id: 7, href: '/Comercios/Escola-Roberto-Bryan' },
		{ nome: 'Igydio Rosatti Cemei', id: 8, href: '/Comercios/Igydio-Rosatti-Cemei' },
		{ nome: 'Hotel Vero Verde', id: 9, href: '/Comercios/Hotel-Vero-Verde' },
		{ nome: 'Drogaria Total Unipharma I', id: 10, href: '/Comercios/Drogaria-Total-Unipharma-I' },
		{ nome: 'Drogaria Total Farmavip 3', id: 11, href: '/Comercios/Drogaria-Total-Farmavip-3' },
		{ nome: 'Drogaria Total Unipharma II', id: 12, href: '/Comercios/Drogaria-Total-Unipharma-II' },
		{ nome: 'Drogaria Brasil', id: 13, href: '/Comercios/Drogaria-Brasil' },
		{ nome: 'JR Costela ao Bafo', id: 14, href: '/Comercios/jr-costela-ao-bafo' },
		{ nome: 'Marmitaria Dona do Sabor', id: 15, href: '/Comercios/Marmitaria-Dona-do-Sabor' },
		{
			nome: 'Trem Mineiro Bar e Restaurante',
			id: 16,
			href: '/Comercios/Trem-Minero-Bar-e-Restaurante'
		},
		{ nome: 'Restaurante União Gaúcha', id: 17, href: '/Comercios/Restaurante-Uniao-gaucha' },
		{ nome: 'Restaurante La Tavola', id: 18, href: '/Comercios/Restaurante-La-Tavola' },
		{
			nome: 'Adega Santos Restaurante e Lanchonete',
			id: 19,
			href: '/Comercios/Adega-Santos-Restaurante-E-Lanchonete'
		},
		{ nome: 'Profs Burger e Restaurante', id: 20, href: '/Comercios/Profs-Burger-e-Restaurante' },
		{ nome: 'Cozinha Piloto Luis Antônio', id: 21, href: '/Comercios/Cozinha-Piloto-Luis-Antonio' },
		{ nome: 'Varanda do Frango', id: 22, href: '/Comercios/Varanda-do-frango' },
		{ nome: 'Zero Grau Sorveteria', id: 23, href: '/Comercios/ZERO-GRAU-SORVETERIA' },
		{ nome: 'Matheus Montagem de Móveis', id: 24, href: '/Comercios/Matheus-montagem-de-moveis' },
		{ nome: 'Gelindo Uber', id: 25, href: '/Comercios/Gelindo-Uber' },
		{ nome: 'Bim Uber', id: 26, href: '/Comercios/Bim-Uber' },
		{
			nome: 'Depósito de Bebidas e Mercado No Grau',
			id: 27,
			href: '/Comercios/Deposito-de-bebidas-e-mercado-no-grau'
		},
		{ nome: 'Rubão Cheiro Verde', id: 28, href: '/Comercios/Rubao-Cheiro-Verde' },
		{ nome: 'Mercado Bebidas Em Geral', id: 29, href: '/Comercios/Mercado-Bebidas-Em-Geral' },
		{ nome: 'Panificadora Romavil', id: 30, href: '/Comercios/Panificadora-Romavil' },
		{ nome: 'Olavo Mamede Silva', id: 31, href: '/Comercios/Olavo-Mamede-Silva' },
		{
			nome: 'Panificadora Delícias e Pães',
			id: 32,
			href: '/Comercios/Panificadora-Delicias-e-Paes'
		},
		{ nome: 'Panificadora Romavil', id: 33, href: '/Comercios/PANIFICADORA-ROMAVIL' },
		{ nome: 'Kilanchão', id: 34, href: '/Comercios/Kilanchao' },
		{ nome: 'La Família Pizza Delivery', id: 35, href: '/Comercios/LA-FAMILIA-PIZZA-DELIVERY' },
		{ nome: 'Zé Coxinha', id: 36, href: '/Comercios/Ze-Coxinha' },
		{ nome: 'Trailer do João', id: 37, href: '/Comercios/Trailer-do-Joao' },
		{ nome: 'Açaideira Lounge', id: 38, href: '/Comercios/Acaideira-Lounge' },
		{ nome: 'Sinucas Bars', id: 39, href: '/Comercios/Sinucas-Bars' },
		{ nome: 'Bar e Mercado Oliv Domingos', id: 40, href: '/Comercios/Bar-e-Mercado-Oliv-Domingos' },
		{ nome: 'Celso Bar', id: 41, href: '/Comercios/Celso-Bar' },
		{ nome: 'Fera Supermercado', id: 42, href: '/Comercios/FERA-Supermercado' },
		{ nome: 'Fernandes Supermercado', id: 43, href: '/Comercios/FERNANDES-SUPERMERCADO' },
		{ nome: 'Supermercado Bittar', id: 44, href: '/Comercios/SUPERMERCADO-BITTAR' },
		{
			nome: 'Supermercado Sacchi e Guedes',
			id: 45,
			href: '/Comercios/Supermercado-Sacchi-e-Guedes'
		},
		{ nome: 'Real Lopes Supermercado', id: 46, href: '/Comercios/Real-Lopes-Supermercado' },
		{ nome: 'Supermercado Martins', id: 47, href: '/Comercios/Supermercado-Martins' },
		{
			nome: 'Unidade de Saúde Dr. Eílio Serafim',
			id: 48,
			href: '/Comercios/Unidade-de-Saude-Dr-Eilio-Serafim'
		},
		{
			nome: 'Unidade Mista de Luiz Antônio',
			id: 49,
			href: '/Comercios/Unidade-Mista-de-Luiz-Antonio'
		},
		{ nome: 'São Francisco Saúde', id: 50, href: '/Comercios/Sao-Francisco-saude' },
		{
			nome: 'Sala de Vacinação Emílio Serafim',
			id: 51,
			href: '/Comercios/Sala-de-vacinacao-Emilio-Serafim'
		},
		{ nome: 'Pet Shop Lati & Mia', id: 52, href: '/Comercios/Pet-Shop-Lati-&-Mia' },
		{ nome: 'Comercial Miranda', id: 53, href: '/Comercios/Comercial-Miranda' },
		{ nome: '3D Informática', id: 54, href: '/Comercios/3D-Informatica' },
		{ nome: 'Transporte Emílio Serafim', id: 55, href: '/Comercios/Transporte-Emilio-Serafim' },
		{ nome: 'Ortho Clínicas Clínica', id: 56, href: '/Comercios/ORTHOclinicas-Clinica' },
		{ nome: 'OdontoCompany', id: 57, href: '/Comercios/OdontoCompany' },
		{
			nome: 'Reabilitar Clínica de Fisioterapia',
			id: 58,
			href: '/Comercios/Reabilitar-Clinica-de-Fisioterapia'
		},
		{ nome: 'Fisioterapia Pélvica', id: 59, href: '/Comercios/Fisioterapia-Pelvica' },
		{
			nome: 'Lafrois Laboratório de Análises Clínicas',
			id: 60,
			href: '/Comercios/Lafrois-Laboratorio-de-Analises-Clinicas'
		},
		{ nome: 'UB Eugênio', id: 61, href: '/Comercios/UB-Eugenio' },
		{ nome: 'Porfírio Veículos', id: 62, href: '/Comercios/Porfirio-Veiculos' },
		{ nome: 'Merchan Multimarcas', id: 63, href: '/Comercios/Merchan-Multimarcas' },
		{ nome: 'Skina Veículos Luiz Antônio', id: 64, href: '/Comercios/Skina-Veiculos-Luiz-Antonio' },
		{
			nome: 'Borracheiro Móvel 24h Duh Borracheiro',
			id: 65,
			href: '/Comercios/Borracheiro-movel-24h-Duh-Borracheiro'
		},
		{ nome: 'Loja da Construção', id: 66, href: '/Comercios/Loja-da-Construcao' },
		{
			nome: 'Rodrigues Mat Depósito Renato',
			id: 67,
			href: '/Comercios/rodrigues-mat-deposito-renato'
		},
		{ nome: 'Planeta Cores', id: 68, href: '/Comercios/Planeta-Cores' },
		{ nome: 'Auto Posto Colorado', id: 69, href: '/Comercios/Auto-Posto-Colorado' },
		{ nome: 'Posto Ipiranga', id: 70, href: '/Comercios/Posto-Ipiranga' },
		{ nome: 'Posto Iguatemi', id: 71, href: '/Comercios/Posto-Iguatemi' },
		{ nome: 'Cegonhitas Kids Store', id: 72, href: '/Comercios/Cegonhitas-kids-store' },
		{ nome: 'Dulorekids', id: 73, href: '/Comercios/Dulorekids' },
		{ nome: 'Nina Nyko', id: 74, href: '/Comercios/NINA-NYKO' },
		{ nome: 'Karina Xavier', id: 75, href: '/Comercios/Karina-Xavier' },
		{ nome: 'New Place Modas', id: 76, href: '/Comercios/New-Place-Modas' },
		{ nome: 'Moda Viva', id: 77, href: '/Comercios/Moda-viva' },
		{ nome: 'Lauanne Moda Feminina', id: 78, href: '/Comercios/Lauanne-Moda-Feminina' },
		{ nome: 'Wagner Luiz Marques', id: 79, href: '/Comercios/Wagner-Luiz-Marques' },
		{ nome: 'Modas e Acessórios Z', id: 80, href: '/Comercios/Modas-E-Acessorios-Z' },
		{ nome: 'Chelly Modas', id: 81, href: '/Comercios/Chelly-modas' },
		{ nome: 'Roger Cabeleireiro', id: 82, href: '/Comercios/Roger-Cabelereiro' },
		{ nome: 'Luciana Medeiros', id: 83, href: '/Comercios/LUCIANA-MEDEIROS' },
		{ nome: 'Studio Janana Loiras', id: 84, href: '/Comercios/STUDIO-JANANA-LOIRAS' },
		{ nome: 'Letícia Souza Cabeleireira', id: 85, href: '/Comercios/LETICIA-SOUZA-CABELEIREIRA' },
		{ nome: 'Designer Jhenifer Becca', id: 86, href: '/Comercios/DESIGNER-JHENIFER-BECCA' },
		{ nome: 'Studio Cinthia Lopes', id: 87, href: '/Comercios/STUDIO-CINTHIA-LOPES' },
		{ nome: 'Studio Carolina', id: 88, href: '/Comercios/STUDIO-CAROLINA' },
		{ nome: 'Mi Couto', id: 89, href: '/Comercios/MI-COUTO' },
		{ nome: 'Sabrina Herrera', id: 90, href: '/Comercios/SABRINA-HERRERA' },
		{ nome: 'Epiladora Natália Abreu', id: 91, href: '/Comercios/EPILADORA-NATÁLIA-ABREU' },
		{ nome: 'Studio Essência & Beleza', id: 92, href: '/Comercios/STUDIO-ESSENCIA-&-BELEZA' },
		{ nome: "Lary's Bijus Fashion", id: 93, href: '/Comercios/LARYs-BIJUS-FASHION' },
		{
			nome: 'Menina de Luxo Moda e Acessórios',
			id: 94,
			href: '/Comercios/MENINA-DE-LUXO-MODA-E-ACESSORIOS'
		},
		{ nome: 'Imperador Moda Masculina', id: 95, href: '/Comercios/MPERADOR-MODA-MASCULINA' },

		{ nome: 'A.r Informática smartphone', id: 95, href: '/Comercios/A-R-Informatica-smartphone' },
		{ nome: 'Tecguillen Assistência Técnica Multimarcas', id: 95, href: '/Comercios/tecguillen' },
		{ nome: 'Esquina Som', id: 96, href: '/Comercios/ESQUINA-SOM' }
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
		searchQuery = ''; // Reseta o valor da pesquisa
	});

	// Adiciona o evento ao montar o componente
	onMount(() => {
		setLastPathUrl($page.url.pathname);
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="relative mx-auto max-w-md" bind:this={searchBox}>
	<span class="absolute inset-y-0 left-0 flex h-[40px] items-center pl-3">
		<svg
			class="mb-2 flex h-5 w-5 items-center text-blue-500"
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

	<input
		type="text"
		bind:value={searchQuery}
		on:input={filterComercios}
		on:focus={() => (isDropdownOpen = true)}
		class="h-[30px] w-[200px] rounded-[12px] border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-600 dark:bg-yellow-400 dark:text-blue-500 dark:focus:border-blue-500"
		placeholder="Busca Rápida"
	/>

	{#if isDropdownOpen && searchQuery}
		<div
			class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
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
