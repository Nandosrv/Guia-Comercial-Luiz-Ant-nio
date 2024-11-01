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

	// Casting de $page.data.items para Product[], para que TypeScript conheça a estrutura dos dados
	$: product = ($page.data.items as Product[]).find((p) => p.slug === productId);

	console.log(product);
</script>
<Alerty />
<!-- <h1>{product?.title}</h1>
<h2>{product?.telefone}</h2> -->
<main class=" flex w-full h-[600px]  justify-center">

  <Card product={product}/>
</main>



<!-- <main class="w-4/5 border border-red-500">
	<img class="w-full" src={product?.image} alt={product?.title} />
</main>
<main>
	<section>
		<h1>
			Lorem ipsum dolor sit amet, consectetur nome {product?.title} elit. Perspiciatis odit a suscipit
			quisquam ab porro minima eligendi incidunt quod totam nulla voluptatibus aperiam nobis
			deleniti debitis eius distinctio, eum iusto?
		</h1>
    
	</section>
</main>

<style>
	img {
		width: 100px;
		height: 100px;
	}
</style> -->
