<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Alerty from '$lib/componets/alerty.svelte';
	import Card from '$lib/componets/Card/Card.svelte';
	// @ts-ignore - Ignora o erro de tipagem na importação
	import Comentarios from '$lib/componets/Comentarios.svelte';

	export let data: any;

	
	// Define o tipo Product para representar os itens de comércio
	type Product = {
	  id?: string;
	  slug: string;
	  title: string;
	  telefone: string;
	  image: string;
	  whatsapp?: string;
	  facebook?: string;
	  instagram?: string;
	  maps?: string;
	  hours?: string;
	  category?: string;
	  subcategory?: string;
	};
  
	// Obtém o ID do produto a partir dos parâmetros da página
	// $: productId = $page.params.slug;
	const productId = data.slug;
	// $: productId = data.slug;
	// console.log('ID do produto:', productId);
	// Verifica se a página tem dados e se items é um array válido
	let products = data.items ? data.items : [];
	// $: products = data.items ? data.items : [];
  
	// Encontra o produto com base no slug
	let product: Product | undefined = products.find((p: Product) => p.slug === productId);
	// $: product = products.find((p: Product) => p.slug === productId);
  
	function adaptToCard(prod: any): Product {
	  return {
		id: prod.id,
		slug: prod.slug || '',
		title: prod.title || prod.nome || '',
		telefone: prod.telefone || '',
		image: prod.image || prod['photo-comercio'] || (prod.fotos && prod.fotos.length > 0 ? prod.fotos[0] : 'https://via.placeholder.com/300x200?text=Sem+Imagem'),
		whatsapp: prod.whatsapp || '',
		facebook: prod.facebook || '',
		instagram: prod.instagram || '',
		maps: prod.maps || '',
		hours: prod.hours || (prod.horarios_funcionamento ? 'Veja detalhes' : 'Horário não informado'),
		category: prod.category || prod.categoria || 'Outros',
		subcategory: prod.subcategory || prod.subcategoria || ''
	  };
	}

	if (product) {
	  product = adaptToCard(product);
	}

	// Se não encontrar, buscar na API local
	onMount(async () => {
	  if (!product) {
		const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
		const apiUrl = isLocal
		  ? `http://localhost:3000/comerciantes`
		  : `https://api-backend-production-5b22.up.railway.app/comerciantes`;

		const response = await fetch(apiUrl);
		if (response.ok) {
		  const comerciantes = await response.json();
		  // Procurar pelo slug
		  const found = comerciantes.find((c: any) => c.slug === productId);
		  if (found) {
			product = adaptToCard(found);
			console.log('Produto encontrado:', product); // Debug
		  }
		}
	  }
	});
</script>
  
<div class="dark:bg-secondary flex justify-center bg-secondary-foreground p-4 md:p-8">
	<div class="w-full flex justify-center items-center lg:w-[49%]">
		<Alerty />
	</div>
</div>
  
<main class="flex w-full h-full justify-center">
	{#if product}
	  <Card {product} />
	{:else}
	  <p>Produto não encontrado ou erro de carregamento.</p>
	{/if}
</main>
  
<div class="container mx-auto px-4 mt-8">
  {#if product}
    <!-- id com comerciante -->
    <!-- <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 mb-4 rounded-lg">ID: {product.id || 'Não encontrado'}</pre> -->
    <Comentarios comercioId={product.id || ''} comercioSlug={product.slug} />
  {/if}
</div>
  