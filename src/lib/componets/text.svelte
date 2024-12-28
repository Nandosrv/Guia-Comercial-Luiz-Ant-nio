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
	  // Adicione estas novas constantes para organização
	  const PLANS = {
        BASIC: {
            id: 'basic',
            name: 'Plano Básico',
            price: 'Grátis',
            description: 'Listagem simples na página inicial',
            features: ['Anúncio básico', 'Listagem padrão', 'Contato direto']
        },
        FEATURED: {
            id: 'featured',
            name: 'Plano Destaque',
            price: 'R$29,99',
            description: 'Posição privilegiada e mais visibilidade',
            features: ['Posição destacada', 'Ícone de verificado', 'Suporte por email']
        },
        PREMIUM: {
            id: 'premium',
            name: 'Plano Premium',
            price: 'R$59,99',
            description: 'Máxima visibilidade e recursos exclusivos',
            features: ['Topo da página', 'Suporte prioritário', 'Estatísticas detalhadas', 'Personalização avançada']
        }
    };
</script>
<main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Anúncios Locais
                </h1>
                <div class="flex items-center gap-4">
                    <button
                        on:click={toggleModal}
                        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Anunciar
                    </button>
                    <Darkmod />
                </div>
            </div>
        </div>
    </header>

    <!-- Featured Ads Section -->
    <section class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Destaques Premium</h2>
            <div class="flex items-center gap-4">
                <select
                    bind:value={filterCategory}
                    class="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">Todas categorias</option>
                    {#each categories as category}
                        <option value={category}>{category}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredAds.filter(ad => ad.selectedPlan === 'premium') as ad (ad.id)}
                <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                    <div class="relative">
                        <img
                            src={ad.image}
                            alt={ad.title}
                            class="w-full h-48 object-cover"
                        />
                        <div class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            Premium
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                {ad.category}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{ad.business_name}</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">{ad.description}</p>
                        
                        <div class="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                            <div class="flex items-center gap-4">
                                <a
                                    href={`tel:${ad.phone_number}`}
                                    class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    Ligar
                                </a>
                                <a
                                    href={`https://wa.me/${ad.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                                >
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    WhatsApp
                                </a>
                            </div>
                            <!-- svelte-ignore a11y_consider_explicit_label -->
                            <button
                                on:click={() => shareAd(ad)}
                                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </article>
            {/each}
        </div>
    </section>

    <!-- Regular Ads Section -->
    <section class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Todos os Anúncios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredAds as ad (ad.id)}
                <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <!-- Conteúdo similar ao card premium, mas sem o badge premium -->
                    <!-- ... -->
                </article>
            {/each}
        </div>
    </section>

    <!-- Modal de Anúncio -->
    {#if showModal}
    <div class="fixed inset-0 z-50 overflow-y-auto" transition:fade>
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" on:click={resetForm}></div>

            <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
                <div class="absolute right-0 top-0 pr-4 pt-4">
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        type="button"
                        class="rounded-md text-gray-400 hover:text-gray-500"
                        on:click={resetForm}
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Form content -->
                <form on:submit|preventDefault={submitAd} class="space-y-6">
                    <!-- ... (mantenha os campos do formulário existentes, mas com estilo melhorado) ... -->
                    
                    <!-- Planos com novo design -->
                    <div class="grid gap-4 sm:grid-cols-3">
                        {#each Object.values(PLANS) as plan}
                            <label class="relative flex cursor-pointer flex-col rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span class="mb-2 font-medium">{plan.name}</span>
                                <span class="text-2xl font-bold">{plan.price}</span>
                                <span class="mt-2 text-sm text-gray-500 dark:text-gray-400">{plan.description}</span>
                                <ul class="mt-4 space-y-2 text-sm">
                                    {#each plan.features as feature}
                                        <li class="flex items-center">
                                            <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                            <span class="ml-2">{feature}</span>
                                        </li>
                                    {/each}
                                </ul>
                                <input
                                    type="radio"
                                    name="plan"
                                    value={plan.id}
                                    bind:group={formData.plan}
                                    class="absolute right-4 top-4"
                                />
                            </label>
                        {/each}
                    </div>

                    <div class="flex justify-end gap-4">
                        <button
                            type="button"
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            on:click={resetForm}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Publicar Anúncio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {/if}
</main>

<style>
    /* Adicione estilos globais necessários */
    :global(.dark) {
        color-scheme: dark;
    }
</style>