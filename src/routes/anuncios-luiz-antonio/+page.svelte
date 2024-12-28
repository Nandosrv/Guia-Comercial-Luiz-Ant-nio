<script lang="ts">
	// Importa funções e módulos necessários
	import { fade } from 'svelte/transition'; // Animação de fade
	import supabase from '../../lib/supabaseClient'; // Supabase client para interações com o banco de dados
	import iconws from '$lib/images/icon-ws.png'; // Ícone para WhatsApp
	import icon from '$lib/images/icons8.png'; // Ícone padrão
	import { userStore } from '../../stores/userStore.svelte'; // Store para usuário
	import AdCard from '$lib/componets/AdCard.svelte'; // Componente de card de anúncio
	import { onMount } from 'svelte'; // Função Svelte para executar código ao montar o componente
	import Adicionar from '$lib/componets/Adicionar.svelte';
	import Darkmod from '$lib/componets/Darkmod.svelte';

	let showModal = false; // Controle de exibição do modal
	let selectedPackage: { id: number; name: string; price: number; duration: string } | null = null; // Pacote selecionado pelo usuário

	// Dados do formulário
	let formData = {
		businessName: '',
		phoneNumber: '',
		whatsapp: '',
		phone_url: '',
		description: '',
		contact: '',
		category: '',
		plan: '',
		image: null as File | null // Armazena a imagem carregada
	};

	// Definição de anúncios a serem exibidos (vem de outro lugar)
	// svelte-ignore export_let_unused
	export let ads: Array<{
		id: string;
		title: string;
		description: string;
		image: string;
		rating: number;
		phoneNumber: string;
		whatsapp: string;
		category: string;
		plan: ''; // Campo para armazenar o plano escolhido
	}> = [];

	let filterCategory = 'all'; // Filtro de categoria para anúncios
	let darkMode = false; // Modo escuro do site

	// Categorias de anúncios para filtro
	const categories = ['Restaurantes', 'Serviços', 'Varejo','Promoções', 'Saúde', 'Outros'];
	let featuredAds: any[] = []; // Anúncios destacados
	let filteredAds: any[] = []; // Anúncios filtrados com base na categoria

	// Pacotes disponíveis para anúncios
	const packages = [
		{ id: 1, name: 'Básico', price: 50, duration: '1 semana' },
		{ id: 2, name: 'Padrão', price: 100, duration: '2 semanas' },
		{ id: 3, name: 'Premium', price: 200, duration: '1 mês' }
	];

	// Função para enviar um anúncio
  async function submitAd() {
	// Verifica se todos os campos obrigatórios estão preenchidos
	if (
  !formData.businessName ||
  !formData.category ||
  !formData.description ||
  !formData.phoneNumber ||
  !formData.whatsapp ||
  !formData.image ||
  !formData.plan
) {
  alert('Por favor, preencha todos os campos obrigatórios.');
  return;
}

// Validação extra para o campo de imagem
if (formData.image && formData.image.size === 0) {
  alert('Por favor, selecione uma imagem válida.');
  return;
}


	let imageUrl = ''; // Variável para armazenar a URL da imagem

	// Verifica se a imagem foi selecionada
	if (formData.image) {
		try {
			// Gerar o nome do arquivo com timestamp para evitar conflitos
			const fileName = `${Date.now()}_${formData.image.name}`;

			// Realizar o upload da imagem para o Supabase
			const { data, error } = await supabase.storage
				.from('imagens-publicidade')
				.upload(fileName, formData.image);

			// Verificar se houve erro no upload
			if (error) {
				console.error('Erro ao fazer upload da imagem:', error.message);
				alert('Erro ao enviar a imagem. Verifique o formato ou o tamanho.');
				return;
			}

			// Gerar a URL pública da imagem após o upload
			const { data: publicUrlData } = supabase.storage
				.from('imagens-publicidade')
				.getPublicUrl(fileName);

			// Verificar se houve erro ao obter a URL pública
			if (!publicUrlData) {
				console.error('Erro ao gerar URL pública');
				alert('Erro ao gerar a URL pública da imagem.');
				return;
			}

			imageUrl = publicUrlData.publicUrl; // Atribui a URL pública à variável imageUrl

			console.log('Imagem salva no bucket com sucesso:', imageUrl); // Log de sucesso
		} catch (err) {
			console.error('Erro inesperado ao enviar a imagem:', err);
			alert('Erro inesperado ao enviar a imagem.');
			return;
		}
	}

	// Enviar os dados do anúncio para a tabela no Supabase
	const { data, error } = await supabase.from('anunciodestaque').insert([
		{
			business_name: formData.businessName,
			description: formData.description,
			contact: formData.phoneNumber,
			category: formData.category,
			whatsapp: formData.whatsapp,
			phone_number: formData.phoneNumber,
			phone_url: `tel:${formData.phoneNumber}`, // Formato do número de telefone
			image: imageUrl, // Caminho da imagem no bucket
			selectedPlan: formData.plan,
		}
	]);

	if (error) {
		console.error('Erro ao enviar o anúncio:', error.message);
		alert('Erro ao enviar o anúncio.');
	} else {
		console.log('Anúncio enviado com sucesso:', data); // Log de sucesso
		alert('Anúncio enviado com sucesso!');
		resetForm(); // Limpar o formulário após o envio
		fetchFeaturedAds(); // Atualizar os anúncios em destaque
	}
}


	// Função para buscar anúncios em destaque
	const fetchFeaturedAds = async () => {
		const { data, error } = await supabase.from('anunciodestaque').select('*');
		if (error) {
			console.error('Erro ao buscar anúncios:', error.message);
		} else {
			featuredAds = data || []; // Atribui os anúncios encontrados
			applyCategoryFilter(); // Aplica o filtro de categoria
		}
	};

	// Função para aplicar o filtro de categoria
	const applyCategoryFilter = () => {
		if (filterCategory === 'all') {
			filteredAds = [...featuredAds]; // Exibe todos os anúncios
		} else {
			filteredAds = featuredAds.filter((ad) => ad.category === filterCategory); // Filtro por categoria
		}
	};

	// Função para compartilhar o anúncio
	const shareAd = (ad: { title: string; description: string }) => {
		if (navigator.share) {
			navigator
				.share({
					title: ad.title,
					text: ad.description,
					url: window.location.href
				})
				.then(() => console.log('Compartilhado com sucesso'))
				.catch((error) => console.log('Erro ao compartilhar', error));
		} else {
			alert(`Compartilhe este anúncio: ${ad.title} - ${ad.description}`);
		}
	};

	// Função para alternar o modo escuro
	// const toggleDarkMode = () => {
	// 	darkMode = !darkMode; // Alterna o estado do modo escuro
	// 	document.documentElement.classList.toggle('dark', darkMode); // Aplica a classe 'dark' no elemento raiz
	// };

	// Função para resetar o formulário
	const resetForm = () => {
		showModal = false;
		formData = {
			businessName: '',
			plan: '',
			phoneNumber: '',
			whatsapp: '',
			description: '',
			contact: '',
			category: '',
			image: null,
			phone_url: ''
		}; // Limpa os dados do formulário
		selectedPackage = null; // Reseta o pacote selecionado
	};

	// Função para alternar o modal
	function toggleModal() {
		showModal = !showModal; // Alterna o estado de exibição do modal
	}

	let file;

	// Função para tratar a mudança de arquivo (imagem)
	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement | null;
		if (input && input.files && input.files[0]) {
			formData.image = input.files[0]; // Atualiza o valor do arquivo selecionado
			console.log('Arquivo selecionado:', formData.image); // Log para depuração
		}
	};

	// Função chamada quando o componente é montado
	onMount(() => {
		fetchFeaturedAds(); // Busca os anúncios destacados ao montar o componente
	});
</script>

<main
	class="container mx-auto rounded-lg  bg-white dark:bg-secondary px-4 py-8 transition-colors duration-300 {darkMode
		? 'dark:bg-gray-900 dark:text-white'
		: ''}"
>
	<div class="mb-8 flex items-center justify-between border-b-2 dark:border-secondary-foreground">
		<h1 class="font-['Inter'] text-4xl lg:text-5xl font-bold text-black dark:text-white">
			Anúncios Locais em Destaque
		</h1>
		<button>
			<Darkmod />
		</button>
	</div>

	<div class="mb-8 text-center">
		<button
			on:click={toggleModal}
			class="bg-primary-500 hover:bg-primary-600 transform rounded-full px-6 py-3 font-bold text-blue-500 shadow-lg transition duration-300 hover:scale-105 dark:border"
		>
			<Adicionar />
		</button>
	</div>

	<!-- Destaques da Semana -->
	<div class="mb-8">
		<h2 class="mb-4 font-['Inter'] text-2xl font-bold text-black dark:text-white ">
			Destaques da Semana
		</h2>
		<div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3 ">
				{#each filteredAds.filter((ad) => ad.selectedPlan === 'premium') as ad (ad.id)}
					<div
						class="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 border border-secondary-foreground dark:border-secondary-foreground"
						transition:fade
					>
						<img
							class="h-[200px] w-full object-cover"
							src={`${ad.image}`}
							alt="Descrição da imagem"
						/>
						<div class="p-6">
							<h3 class="mb-2 text-xl font-semibold">{ad.title}</h3>
							<p class="mb-2 text-gray-600 dark:text-gray-300">{ad.description}</p>
							<div class="flex items-center">
								<!-- Rating precisa ser ajustado dinamicamente -->
								<span class="mr-1 text-yellow-400">⭐⭐⭐⭐</span>
								<span>{ad.rating && !isNaN(ad.rating) ? ad.rating.toFixed(1) : '4.7'}</span>
							</div>
							<div class="mt-4 flex items-center justify-between">
								<button
									on:click={() => shareAd(ad)}
									class="text-primary-500 hover:text-primary-700"
								>
									Compartilhar
								</button>
								<button>
									<a class="text-primary-500 hover:text-primary-700" href={`tel:${ad.phoneNumber}`}>
										Ligar
									</a>
								</button>
								<button>
									<a
										class="text-primary-500 hover:text-primary-700"
										href={`https://wa.me/${ad.whatsapp}?text=${('Olá, estou interessado no anúncio!')}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										WhatsApp
									</a>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Filtro por Categoria -->
	<div class="mb-6">
		<label for="category-filter" class="mb-2 block text-sm font-medium"
			>Filtrar por categoria:</label
		>
		<select
			id="category-filter"
			bind:value={filterCategory}
			class="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
		>
			<option value="all">Todos</option>
			{#each categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>
	</div>
	<!-- Anuncios normais Free -->
  <p class="text-secondary-foreground dark:text-secondary-foreground font-['Inter'] text-2xl font-bold">
    Anúncios em Destaque</p>

	<section class="grid grid-cols-1 gap-6 md:grid-cols-3">
		{#each filteredAds as ad (ad.id)}
			<div class="border border-secondary-foreground dark:border-secondary-foreground overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800" transition:fade>
				<img class="h-[200px] w-full object-cover" src={`${ad.image}`} alt="Descrição da imagem" />
				<div class="p-6">
					<h3 class="mb-2 text-xl font-semibold">{ad.title}</h3>
					<p class="mb-2 text-gray-600 dark:text-gray-300">{ad.description}</p>
					<div class="flex items-center">
						<!-- Rating precisa ser ajustado dinamicamente -->
						<span class="mr-1 text-yellow-400">⭐⭐⭐⭐</span>
						<span>{ad.rating && !isNaN(ad.rating) ? ad.rating.toFixed(1) : '4.7'}</span>
					</div>
					<div class="mt-4 flex items-center justify-between">
						<button on:click={() => shareAd(ad)} class="text-primary-500 hover:text-primary-700"
							>Compartilhar</button
						>
						<button>
							<a class="text-primary-500 hover:text-primary-700" href={`tel:${ad.phoneNumber}`}>
								Ligar
							</a>
						</button>
						<button>
							<a
								class="text-primary-500 hover:text-primary-700"
								href={`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent('Olá, estou interessado no anúncio!')}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								WhatsApp
							</a>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</section>
	<!-- Modal Adicionar Anúncio -->
	{#if showModal}
		<div
			class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 px-4"
			transition:fade
		>
			<div
				class="h-[70%] max-h-screen w-full border dark:border-secondary-foreground max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:max-w-xl"
			>
				<h2 class="mb-4 text-center text-2xl font-bold text-black dark:text-white">
					Adicionar Anúncio
				</h2>
				<form on:submit|preventDefault={submitAd}>
					<label for="businessName" class="mb-2 block text-sm">Nome do Comércio</label>
          
					<input
						id="businessName"
						type="text"
						bind:value={formData.businessName}
						class="mb-4 w-full rounded-md border dark:text-secondary border-gray-300 p-2 text-sm"
						placeholder="Nome do Comércio"
					/>

					<label for="category" class="mb-2 block text-sm">Categoria</label>
					<select
						id="category"
						bind:value={formData.category}
						class="mb-4 w-full rounded-md dark:text-secondary border border-gray-300 p-2 text-sm"
					>
						<option value="">Selecione a categoria</option>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>

					<label for="phoneNumber" class="mb-2 block text-sm dark:text-secondary">Número de telefone</label>
					
          <input
						id="phoneNumber"
						type="text"
						bind:value={formData.phoneNumber}
						class="mb-4 w-full rounded-md border dark:text-secondary border-gray-300 p-2 text-sm"
						placeholder="Número de telefone"
					/>

					<label for="whatsapp" class="mb-2 block text-sm dark:text-secondary">WhatsApp</label>
					<input
						id="whatsapp"
						type="text"
						bind:value={formData.whatsapp}
						class="mb-4 w-full rounded-md border border-gray-300 dark:text-secondary p-2 text-sm"
						placeholder="Número do WhatsApp"
					/>

					<label for="description" class="mb-2 block text-sm dark:text-secondary">Descrição</label>
					<textarea
						id="description"
						bind:value={formData.description}
						class="mb-4 w-full rounded-md border border-gray-300 p-2 text-sm dark:text-secondary"
						placeholder="Descrição do anúncio"
					></textarea>

					<label for="image" class="mb-2 block text-sm dark:text-secondary">Imagem</label>
					<input
						id="image"
						type="file"
						accept="image/*"
						on:change={handleFileChange}
						class="mb-4 w-full text-sm"
					/>
					{#if formData.image}
						<img
							id="image-preview"
							src={URL.createObjectURL(formData.image)}
							alt="Prévia da imagem"
							class="mb-4 h-48 w-full rounded-md object-cover"
						/>
					{/if}

					<h3 class="mb-4 text-center text-lg font-semibold text-black dark:text-white">
						Escolha um Plano
					</h3>
					<div class="mb-4 space-y-4">
						<label
							class="block cursor-pointer rounded-md border border-gray-300 p-4 text-sm md:flex md:items-center md:justify-between"
						>
							<div>
								<input
									type="radio"
									name="plan"
									value="basic"
									bind:group={formData.plan}
									class="mr-2"
								/>
								<span class="font-semibold">Plano Básico</span> - Grátis
							</div>
							<p class="mt-2 text-xs text-gray-600 dark:text-gray-400 md:mt-0">
								Inclui listagem simples na página inicial.
							</p>
						</label>
						<label
							class="block cursor-pointer rounded-md border border-gray-300 p-4 text-sm md:flex md:items-center md:justify-between"
						>
							<div>
								<input
									type="radio"
									name="plan"
									value="featured"
									bind:group={formData.plan}
									class="mr-2"
								/>
								<span class="font-semibold">Plano Destaque</span> - R$29,99
							</div>
							<p class="mt-2 text-xs text-gray-600 dark:text-gray-400 md:mt-0">
								Anúncio destacado com posição privilegiada.
							</p>
						</label>
						<label
							class="block cursor-pointer rounded-md border border-gray-300 p-4 text-sm md:flex md:items-center md:justify-between"
						>
							<div>
								<input
									type="radio"
									name="plan"
									value="premium"
									bind:group={formData.plan}
									class="mr-2"
								/>
								<span class="font-semibold">Plano Premium</span> - R$59,99
							</div>
							<p class="mt-2 text-xs text-gray-600 dark:text-gray-400 md:mt-0">
								Destaque, suporte prioritário e mais visibilidade.
							</p>
						</label>
					</div>

					<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
						<button
							type="button"
							on:click={resetForm}
							class="w-full rounded-md bg-gray-300 px-4 py-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-white sm:w-auto"
							>Cancelar</button
						>
						<button
							type="submit"
							class="w-full rounded-md bg-blue-500 px-4 py-2 text-sm text-white sm:w-auto"
							>Enviar Anúncio</button
						>
					</div>
				</form>
			</div>
		</div>
	{/if}
</main>
