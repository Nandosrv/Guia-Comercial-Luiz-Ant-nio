<script lang="ts">
	import { page } from '$app/stores';
	import Alerty from '$lib/componets/alerty.svelte';
	import Card from '$lib/componets/Card/Card.svelte';
  
	// Define o tipo Product para representar os itens de comércio
	type Product = {
	  slug: string;
	  title: string;
	  telefone: string;
	  image: string;
	};
  
	// Obtém o ID do produto a partir dos parâmetros da página
	$: productId = $page.params.id;
  
	// Verifica se a página tem dados e se items é um array válido
	$: products = $page.data.items ? $page.data.items : [];
  
	// Encontra o produto com base no slug
	$: product = products.find((p: Product) => p.slug === productId);
  
	if (product) {
	//   console.log('Produto encontrado:', product);
	} else {
	//   console.log('Produto não encontrado');
	}
  </script>
  
  <div class="bg-gradient-to-br flex justify-center bg-secondary-foreground p-4 md:p-8">
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
  