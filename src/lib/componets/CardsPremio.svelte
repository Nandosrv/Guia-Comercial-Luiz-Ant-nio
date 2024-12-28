<script lang="ts">
	import { fade } from 'svelte/transition';

	// Importa funções e módulos necessários
	import supabase from '../../lib/supabaseClient'; // Supabase client para interações com o banco de dados
	import { onMount } from 'svelte'; // Função Svelte para executar código ao montar o componente
    import Anuncieaqui from '$lib/images/Anuncieaqui.png';
	let showModal = false; // Controle de exibição do modal
	let selectedPackage: { id: number; name: string; price: number; duration: string } | null = null; // Pacote selecionado pelo usuário

	// Dados do formulário
	let formData = {
		businessName: '',
		phoneNumber: '',
		whatsapp: '',
		description: '',
		category: '',
		plan: '',
		image: null as File | null // Armazena a imagem carregada
	};

	// Definição de anúncios a serem exibidos (vem de outro lugar)
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
		plan: '';
	}> = [];

	let filterCategory = 'all'; // Filtro de categoria para anúncios
	let featuredAds: any[] = []; // Anúncios destacados
	let filteredAds: any[] = []; // Anúncios filtrados com base na categoria

	// Função para enviar um anúncio
	async function submitAd() {
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

		let imageUrl = '';
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
				console.log('Imagem salva no bucket com sucesso:', imageUrl);
			} catch (err) {
				console.error('Erro inesperado ao enviar a imagem:', err);
				alert('Erro inesperado ao enviar a imagem.');
				return;
			}
		}

		const { data, error } = await supabase.from('anunciodestaque').insert([
			{
				business_name: formData.businessName,
				description: formData.description,
				contact: formData.phoneNumber,
				category: formData.category,
				whatsapp: formData.whatsapp,
				phone_number: formData.phoneNumber,
				phone_url: `tel:${formData.phoneNumber}`,
				image: imageUrl,
				selectedPlan: formData.plan
			}
		]);

		if (error) {
			console.error('Erro ao enviar o anúncio:', error.message);
			alert('Erro ao enviar o anúncio.');
		} else {
			console.log('Anúncio enviado com sucesso:', data);
			alert('Anúncio enviado com sucesso!');
			resetForm();
			fetchFeaturedAds();
		}
	}

	// Função para buscar anúncios em destaque
	const fetchFeaturedAds = async () => {
		const { data, error } = await supabase.from('anunciodestaque').select('*');
		if (error) {
			console.error('Erro ao buscar anúncios:', error.message);
		} else {
			featuredAds = data || [];
			applyCategoryFilter();
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

	// Função para resetar o formulário
	const resetForm = () => {
		showModal = false;
		formData = {
			businessName: '',
			plan: '',
			phoneNumber: '',
			whatsapp: '',
			description: '',
			category: '',
			image: null
		};
		selectedPackage = null;
	};

	// Função para tratar a mudança de arquivo (imagem)
	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement | null;
		if (input && input.files && input.files[0]) {
			formData.image = input.files[0];
			console.log('Arquivo selecionado:', formData.image);
		}
	};

	// Função chamada quando o componente é montado
	onMount(() => {
		fetchFeaturedAds();
	});


    function shareAd(ad: any): void {
  const adUrl = ad.url || ''; // Supondo que o 'ad' tem um campo 'url' que contém o link do anúncio.

  if (navigator.share) {
    // Caso o navegador tenha suporte ao método 'share' (geralmente dispositivos móveis)
    navigator.share({
      title: ad.title,
      text: `Confira esse anúncio: ${ad.description}`,
      url: adUrl,
    })
      .then(() => console.log('Anúncio compartilhado com sucesso!'))
      .catch((error) => console.log('Erro ao compartilhar o anúncio:', error));
  } else {
    // Se não tiver suporte ao método de 'share', compartilha via WhatsApp (no desktop ou em dispositivos móveis)
    const whatsappUrl = `https://wa.me/?text=Confira esse anúncio: ${ad.title} - ${adUrl}`;
    window.open(whatsappUrl, '_blank');
  }
}

</script>
<style>
    	h2::selection {
	color: rgb(201, 90, 90); 
		background-color: transparent; /* Cor de fundo ao selecionar */
	}
</style>
<div class="mb-8">
    <h2 class="mb-4 font-['Inter'] text-2xl font-bold text-black dark:text-white">
        Destaques da Semana
    </h2>
    <div>
        <!-- <div class="w-full h-[200px] bg-black">
            <img src="{Anuncieaqui}" alt="Anuncie aqui" class="h-full w-full object-cover">
        </div> -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            {#each filteredAds.filter((ad) => ad.selectedPlan === 'premium') as ad (ad.id)}
                <div class="overflow-hidden rounded-xl bg-gradient-to-r from-white to-gray-50 shadow-md dark:from-gray-800 dark:to-gray-900"
                    transition:fade
                >
                    <!-- Imagem do Anúncio -->
                    <div class="relative h-[200px] w-full overflow-hidden rounded-t-xl">
                        <img
                            class="h-full w-full object-cover transform transition duration-300 hover:scale-105"
                            src={`${ad.image}`}
                            alt="Descrição da imagem"
                        />
                        <span class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Premium
                        </span>
                    </div>

                    <!-- Conteúdo do Card -->
                    <div class="p-6 space-y-4">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white">{ad.business_name}</h3>
                        <p class="text-gray-600 dark:text-gray-400">{ad.description}</p>

                        <!-- Avaliação -->
                        <div class="flex items-center space-x-2">
                            <span class="text-yellow-400 text-lg">⭐⭐⭐⭐</span>
                            <span class="text-sm text-gray-600 dark:text-gray-300">
                                {ad.rating && !isNaN(ad.rating) ? ad.rating.toFixed(1) : '4.7'}
                            </span>
                        </div>

                        <!-- Botões de Ação -->
                        <div class="flex flex-col gap-4">
                            <button
                                on:click={() => shareAd(ad)}
                                class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                            >
                                Compartilhar
                            </button>
                            <button class="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                                <a href={`tel:${ad.phoneNumber}`} class="w-full text-center">
                                    Ligar
                                </a>
                            </button>
                            <button class="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                                <a
                                    href={`https://wa.me/${ad.whatsapp}?text=${'Olá, estou interessado no anúncio!'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-full text-center"
                                >
                                    WhatsApp
                                </a>
                            </button>
                            <!-- <button class="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                                <a
                                    href={`/anuncio/${ad.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-full text-center"
                                >
                                    Visitar Anúncio
                                </a>
                            </button> -->
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
