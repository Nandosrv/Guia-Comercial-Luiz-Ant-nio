<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { ExternalLink, Calendar, Tag, Clock, Star, Phone, MessageCircle, Share2, Edit2, Trash } from 'lucide-svelte';
	import supabase from '../../lib/supabaseClient';
    import Anuncieaqui from '$lib/images/Anuncieaqui.png';
	import { API_ENDPOINTS } from '$lib/services/apiConfig';
	
	// Definição da interface para anúncios
	interface Anuncio {
		id: string;
		business_name: string;
		description: string;
		image?: string;
		imagemUrl?: string;
		category?: string;
		phone_number?: string;
		whatsapp?: string;
		contact?: string;
		phone_url?: string;
		selectedPlan?: string;
		titulo?: string;
		ativo?: boolean;
		userid?: string;
		palavras_chave?: string;
		link_externo?: string;
		data_inicio?: string;
		data_fim?: string;
		desconto?: string;
		rating?: number;
		created_at?: string;
	}
	
	// Definição da interface para o usuário
	interface Usuario {
		id: string;
		email?: string;
		[key: string]: any;
	}
	
	let searchTerm = '';
	let selectedCategory = '';
	let loading = false;
	let errorMessage = '';
	let showModal = false;
	let editMode = false;
	let editingAd: Anuncio | null = null;
	let hoveredCardId: string | null = null;
	let currentUser: Usuario | null = null;

	// Dados do formulário
	let formData = {
		businessName: '',
		phoneNumber: '',
		whatsapp: '',
		description: '',
		category: '',
		plan: '',
		image: null as File | null
	};

	// Definição de anúncios a serem exibidos
	// svelte-ignore export_let_unused
	export let ads: Array<{
		id: string;
		businessName: string;
		title: string;
		description: string;
		image: string;
		rating: number;
		phoneNumber: string;
		whatsapp: string;
		category: string;
		plan: string;
		palavras_chave?: string;
		link_externo?: string;
		data_inicio?: string;
		data_fim?: string;
		desconto?: string;
	}> = [];

	let filterCategory = 'all';
	let featuredAds: Anuncio[] = [];
	let filteredAds: Anuncio[] = [];

	// Função para resetar o formulário após conclusão
	function resetForm() {
		showModal = false;
		editMode = false;
		editingAd = null;
		formData = {
			businessName: '',
			phoneNumber: '',
			whatsapp: '',
			description: '',
			category: '',
			plan: '',
			image: null
		};
	}

	// Manipular o upload de arquivos
	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			formData.image = input.files[0];
		}
	}

	// Função para buscar anúncios em destaque
	const fetchFeaturedAds = async () => {
		console.log('Buscando anúncios em destaque...');
		
		try {
			// Buscar anúncios usando o endpoint centralizado
			const response = await fetch(API_ENDPOINTS.anuncios.destaque);
			
			if (!response.ok) {
				throw new Error(`Erro na requisição: ${response.status}`);
			}
			
			const data = await response.json();
			
			console.log(`Encontrados ${data ? data.length : 0} anúncios em destaque`);
			
			// Definindo os anúncios e aplicando o filtro
			featuredAds = data || [];
			applyCategoryFilter();
		} catch (error) {
			console.error('Erro ao buscar anúncios em destaque:', error);
		}
	};

	// Função para aplicar o filtro de categoria
	const applyCategoryFilter = () => {
		if (filterCategory === 'all') {
			filteredAds = [...featuredAds];
		} else {
			filteredAds = featuredAds.filter((ad) => ad.category === filterCategory);
		}
	};

	// Função chamada quando o componente é montado
	onMount(() => {
		fetchFeaturedAds();
		getCurrentUser();
	});

	// Obter o usuário atual
	async function getCurrentUser() {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			currentUser = user as Usuario | null;
			console.log('Usuário atual:', currentUser);
		} catch (error) {
			console.error('Erro ao obter usuário atual:', error);
		}
	}

	// Verificar se o usuário atual é o dono do anúncio
	function isOwner(ad: Anuncio) {
		return currentUser && ad && ad.userid === currentUser.id;
	}

	// Função para editar anúncio
	function editAd(ad: Anuncio) {
		editMode = true;
		editingAd = ad;
		formData = {
			businessName: ad.business_name || '',
			phoneNumber: ad.phone_number || '',
			whatsapp: ad.whatsapp || '',
			description: ad.description || '',
			category: ad.category || '',
			plan: ad.selectedPlan || '',
			image: null
		};
		showModal = true;
	}

	// Função para atualizar anúncio
	async function updateAd() {
		if (!editingAd || !editingAd.id) {
			alert('Erro ao identificar o anúncio para atualização.');
			return;
		}

		let imageUrl = editingAd.image; // Manter a imagem original por padrão
		
		// Se uma nova imagem foi selecionada, fazer upload
		if (formData.image) {
			try {
				const fileName = `${Date.now()}_${formData.image.name}`;
				const { data, error } = await supabase.storage
					.from('imagens-publicidade')
					.upload(fileName, formData.image);

				if (error) {
					console.error('Erro ao fazer upload da imagem:', error.message);
					alert('Erro ao enviar a imagem. Verifique o formato ou o tamanho.');
					return;
				}

				const { data: publicUrlData } = supabase.storage
					.from('imagens-publicidade')
					.getPublicUrl(fileName);

				if (!publicUrlData) {
					console.error('Erro ao gerar URL pública');
					alert('Erro ao gerar a URL pública da imagem.');
					return;
				}

				imageUrl = publicUrlData.publicUrl;
			} catch (err) {
				console.error('Erro inesperado ao enviar a imagem:', err);
				alert('Erro inesperado ao enviar a imagem.');
				return;
			}
		}

		// Atualizar o anúncio
		const { error } = await supabase
			.from('anunciodestaque')
			.update({
				business_name: formData.businessName,
				description: formData.description,
				contact: formData.phoneNumber,
				category: formData.category,
				whatsapp: formData.whatsapp,
				phone_number: formData.phoneNumber,
				phone_url: `tel:${formData.phoneNumber}`,
				image: imageUrl,
				selectedPlan: formData.plan
			})
			.eq('id', editingAd.id);

		if (error) {
			console.error('Erro ao atualizar o anúncio:', error.message);
			alert('Erro ao atualizar o anúncio.');
		} else {
			console.log('Anúncio atualizado com sucesso');
			alert('Anúncio atualizado com sucesso!');
			resetForm();
			editMode = false;
			editingAd = null;
			fetchFeaturedAds();
		}
	}

	// Função para excluir anúncio
	async function deleteAd(ad: Anuncio) {
		if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
			return;
		}

		try {
			const { error } = await supabase
				.from('anunciodestaque')
				.delete()
				.eq('id', ad.id);

			if (error) {
				console.error('Erro ao excluir anúncio:', error.message);
				alert('Erro ao excluir o anúncio.');
			} else {
				console.log('Anúncio excluído com sucesso');
				alert('Anúncio excluído com sucesso!');
				fetchFeaturedAds();
			}
		} catch (error) {
			console.error('Erro ao excluir anúncio:', error);
			alert('Erro ao excluir o anúncio.');
		}
	}

    // Função para compartilhar anúncio
    function shareAd(ad: any): void {
        const adUrl = ad.link_externo || window.location.href;
        const shareText = `Confira essa promoção: ${ad.desconto} - ${ad.business_name || ad.titulo}`;
        
        if (navigator.share) {
            // Caso o navegador tenha suporte ao método 'share' (geralmente dispositivos móveis)
            navigator.share({
                title: ad.business_name || ad.titulo,
                text: shareText,
                url: adUrl,
            })
            .then(() => console.log('Anúncio compartilhado com sucesso!'))
            .catch((error) => console.log('Erro ao compartilhar o anúncio:', error));
        } else {
            // Se não tiver suporte ao método de 'share', compartilha via WhatsApp
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + adUrl)}`;
            window.open(whatsappUrl, '_blank');
        }
    }
    
    // Função para formatar data
    function formatarData(dataString: string): string {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    // Função para verificar se o anúncio deve exibir emblema de "Novo"
    function isNovoAnuncio(ad: any): boolean {
        if (!ad.created_at && !ad.data_inicio) return false;
        
        const dataInicio = ad.created_at ? new Date(ad.created_at) : new Date(ad.data_inicio);
        const agora = new Date();
        const diffDias = Math.floor((agora.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
        
        return diffDias <= 2; // Novo se foi criado nos últimos 2 dias
    }
    
    // Função para extrair palavras-chave
    function getPalavrasChave(ad: any): string[] {
        if (!ad.palavras_chave) return [];
        
        return ad.palavras_chave
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);
    }
    
    // Função para limitar texto
    function limitarTexto(texto: string, limite: number): string {
        if (!texto) return '';
        return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
    }

</script>
<style>
    h2::selection {
        color: rgb(201, 90, 90); 
        background-color: transparent;
    }
    
    .card-premium {
        border: 2px solid #fbbf24;
        box-shadow: 0 4px 20px rgba(251, 191, 36, 0.2);
    }
    
    .card-empresarial {
        border: 2px solid #8b5cf6;
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);
    }
    
    .tag {
        @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300;
    }
    
    .card-hover {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    
    .card-hover:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .badge-pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            opacity: 0.7;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        100% {
            opacity: 0.7;
            transform: scale(1);
        }
    }
</style>

<div class="container mx-auto mb-8 px-4">
    <h2 class="mb-6 font-['Inter'] text-3xl font-bold text-black dark:text-white flex items-center">
        <Star class="text-yellow-400 mr-2 h-7 w-7" />
        Destaques da Semana
    </h2>
    
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filteredAds as ad (ad.id)}
            <div 
                class="overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg dark:from-gray-800 dark:to-gray-900 transition duration-300 card-hover {ad.selectedPlan === 'premium' ? 'card-premium' : ''} {ad.selectedPlan === 'empresarial' ? 'card-empresarial' : ''}"
                transition:fade={{ duration: 300 }}
                on:mouseenter={() => hoveredCardId = ad.id}
                on:mouseleave={() => hoveredCardId = null}
            >
                <!-- Imagem do Anúncio com Overlay -->
                <div class="relative h-[220px] w-full overflow-hidden">
                    {#if ad.image || ad.imagemUrl}
                        <img
                            class="h-full w-full object-cover transition duration-500 {hoveredCardId === ad.id ? 'scale-110' : 'scale-100'}"
                            src={ad.image || ad.imagemUrl}
                            alt={ad.business_name || ad.titulo || "Imagem da promoção"}
                        />
                    {:else}
                        <div class="h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold p-4 text-center">
                            {ad.business_name || ad.titulo || "Promoção Especial"}
                        </div>
                    {/if}
                    
                    <!-- Opções de edição para o dono do anúncio -->
                    {#if isOwner(ad)}
                        <div class="absolute top-2 left-2 flex flex-col gap-2">
                            <button 
                                class="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                                on:click|stopPropagation={(e) => {
                                    e.preventDefault();
                                    editAd(ad);
                                }}
                                title="Editar anúncio"
                            >
                                <Edit2 class="h-4 w-4" />
                            </button>
                            <button 
                                class="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all"
                                on:click|stopPropagation={(e) => {
                                    e.preventDefault();
                                    deleteAd(ad);
                                }}
                                title="Excluir anúncio"
                            >
                                <Trash class="h-4 w-4" />
                            </button>
                        </div>
                    {/if}
                    
                    <!-- Badges e Emblemas -->
                    <div class="absolute top-2 right-2 flex flex-col gap-2">
                        <span class="bg-gray-900 bg-opacity-75 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center">
                            {#if ad.selectedPlan === 'premium'}
                                <Star class="h-3 w-3 text-yellow-400 mr-1" />
                                Premium
                            {:else if ad.selectedPlan === 'empresarial'}
                                <Star class="h-3 w-3 text-purple-400 mr-1" />
                                Empresarial
                            {:else}
                                <Star class="h-3 w-3 text-white mr-1" />
                                Básico
                            {/if}
                        </span>
                        
                        {#if isNovoAnuncio(ad)}
                            <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg badge-pulse">
                                NOVO
                            </span>
                        {/if}
                    </div>
                    
                    {#if ad.desconto}
                        <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                            <span class="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg transform rotate-[-2deg] inline-block">
                                {ad.desconto}
                            </span>
                        </div>
                    {/if}
                </div>

                <!-- Conteúdo do Card -->
                <div class="p-6 space-y-4">
                    <!-- Título e Descrição -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{ad.business_name || ad.titulo}</h3>
                        <p class="text-gray-600 dark:text-gray-400">{limitarTexto(ad.description, 120)}</p>
                    </div>
                    
                    <!-- Datas e Informações -->
                    <div class="space-y-2">
                        {#if ad.data_inicio && ad.data_fim}
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar class="h-4 w-4 mr-2 text-gray-400" />
                                <span>
                                    De {formatarData(ad.data_inicio)} até {formatarData(ad.data_fim)}
                                </span>
                            </div>
                        {/if}
                        
                        {#if ad.palavras_chave}
                            <div class="flex flex-wrap gap-1.5 mt-2">
                                {#each getPalavrasChave(ad) as tag}
                                    <span class="tag bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                        #{tag}
                                    </span>
                                {/each}
                            </div>
                        {/if}
                        
                        {#if ad.link_externo}
                            <div>
                                <a 
                                    href={ad.link_externo} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                                >
                                    <ExternalLink class="h-3.5 w-3.5 mr-1" />
                                    Ver mais detalhes
                                </a>
                            </div>
                        {/if}
                    </div>

                    <!-- Avaliação -->
                    <div class="flex items-center space-x-2 border-t border-b border-gray-100 dark:border-gray-700 py-2 my-2">
                        <div class="flex">
                            {#each Array(Math.floor(ad.rating || 4.5)) as _, i}
                                <Star class="h-4 w-4 text-yellow-400 fill-current" />
                            {/each}
                            {#if (ad.rating || 4.5) % 1 >= 0.5}
                                <Star class="h-4 w-4 text-yellow-400" />
                            {/if}
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-300">
                            {ad.rating ? ad.rating.toFixed(1) : '4.5'}
                        </span>
                    </div>

                    <!-- Botões de Ação -->
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            on:click={() => shareAd(ad)}
                            class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            <Share2 class="mr-2 h-4 w-4" />
                            Compartilhar
                        </button>
                        
                        <button class="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                            <a
                                href={`https://wa.me/${ad.whatsapp}?text=${'Olá, vi sua promoção de ' + (ad.desconto || '') + ' e gostaria de mais informações!'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="w-full text-center flex items-center justify-center"
                            >
                                <MessageCircle class="mr-2 h-4 w-4" />
                                WhatsApp
                            </a>
                        </button>
                        
                        <button class="col-span-2 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                            <a href={`tel:${ad.phone_number}`} class="w-full text-center flex items-center justify-center">
                                <Phone class="mr-2 h-4 w-4" />
                                Ligar agora
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        {/each}
        
        <!-- Anuncie Aqui -->
        <div 
            class="overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-purple-300 dark:border-purple-700 transition duration-300 card-hover"
            transition:fade={{ duration: 300 }}
        >
            <div class="relative h-[220px] w-full overflow-hidden bg-purple-100 dark:bg-gray-800 flex items-center justify-center">
                <img src={Anuncieaqui} alt="Anuncie aqui" class="h-28 w-auto object-contain opacity-90" />
            </div>
            
            <div class="p-6 space-y-4 text-center">
                <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300">Seu Negócio Aqui</h3>
                <p class="text-gray-600 dark:text-gray-400">Destaque sua promoção e alcance milhares de clientes em potencial na nossa plataforma!</p>
                
                <div class="pt-4">
                    <a
                        href="/"
                        class="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md w-full"
                    >
                        Quero Anunciar
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Edição/Criação de Anúncio -->
{#if showModal}
<div class="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-60" transition:fade={{ duration: 200 }}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6" transition:fly={{ y: 20, duration: 300 }}>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Editar Anúncio
        </h3>
        
        <form on:submit|preventDefault={updateAd} class="space-y-4">
            <div>
                <label for="businessName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do Negócio
                </label>
                <input
                    type="text"
                    id="businessName"
                    bind:value={formData.businessName}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
            </div>
            
            <div>
                <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria
                </label>
                <select
                    id="category"
                    bind:value={formData.category}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="">Selecione uma categoria</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Educação">Educação</option>
                    <option value="Automotivo">Automotivo</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                </label>
                <textarea
                    id="description"
                    bind:value={formData.description}
                    required
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Telefone
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        bind:value={formData.phoneNumber}
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                </div>
                
                <div>
                    <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        WhatsApp
                    </label>
                    <input
                        type="tel"
                        id="whatsapp"
                        bind:value={formData.whatsapp}
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                </div>
            </div>
            
            <div>
                <label for="plan" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plano
                </label>
                <select
                    id="plan"
                    bind:value={formData.plan}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                    <option value="">Selecione um plano</option>
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                    <option value="empresarial">Empresarial</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imagem
                </label>
                <input
                    type="file"
                    accept="image/*"
                    on:change={handleFileChange}
                    class="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-700 dark:file:text-purple-300"
                />
                {#if editMode && editingAd?.image}
                    <p class="text-sm text-gray-500 mt-1">Deixe em branco para manter a imagem atual</p>
                {/if}
            </div>
            
            <div class="flex space-x-2 justify-end mt-6">
                <button
                    type="button"
                    on:click={resetForm}
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    Salvar Alterações
                </button>
            </div>
        </form>
    </div>
</div>
{/if}
