<script lang="ts">
	import Lest from './../lib/componets/lest.svelte';
	import Allura from '$lib/images/Allura.png';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Menu from '$lib/componets/Menu.svelte';
	import Header from '$lib/componets/Header.svelte';
	import Pesquisa from '$lib/componets/pesquisa.svelte';
	import Search from '$lib/componets/Search.svelte';
	// img
	import City from '$lib/images/nova-img1.png';
	import Cartas from '$lib/images/55638e4e-9618.png';
    

	
</script>
<main class="flex justify-center bg-[#09052D] w-[100%] h-[300px] overflow-hidden  ">
	<div class="flex justify-center w-[340px] h-[300px]  ">
	<img class="w-[315px] h-[300px] object-cover" src="{City} " alt="">
	<div class="flex justify-center items-end w-[320px] h-[290px] absolute ">
		<img class="w-[265px] h-[165px]  " src="{Cartas}" alt="">
	</div>
	</div>
	
	</main>
	<!-- Rua -->
	<div class="bg-[#09052D] w-[100%] h-[360px] ">
		<div class="flex justify-between items-center  w-[100%] h-14 border border-black bg-[#4B4444] ">
			<div class=" w-16 h-2 rounded-2xl  bg-yellow-400 border border-yellow-400"></div>
			<div class=" w-16 h-2 rounded-2xl bg-yellow-400 border border-yellow-400"></div>
			<div class=" w-16 h-2 rounded-2xl bg-yellow-400 border border-yellow-400"></div>
			<div class=" w-16 h-2 rounded-2xl bg-yellow-400 border border-yellow-400"></div>
		</div>
		<div class="w-[100%] h-[400px] flex flex-col bg-[#09052D]">
			<div class="w-[390px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[380px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[370px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[360px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[350px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[340px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[330px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[320px] flex justify-end">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[310px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[300px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[290px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			<div class="mt-5 w-[280px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			
		
		</div>
		<div class="bg-[#09052D] w-[100%] h-[360px] ">
				
		</div>
	</div>
	

<!-- <section class="flex h-2/4 w-full justify-around border border-red-500 bg-zinc-900">

	<div class="al flex w-2/5 border border-red-400">
		<div class="border border-red-400 w-96 mt-8">
			<h1 class="font-['inter'] text-4xl font-bold text-white mb-4">Bem-vindo ao Catálogo de Comércios de Luiz Antônio!</h1>
			<p class="text-lg text-white mb-2 text-center max-w-md">
			  Encontre facilmente os números de contato dos comércios da sua região. Nosso catálogo foi criado para ajudar você a acessar informações de forma rápida e prática.
			</p>
			<p class="text-lg text-white text-center max-w-md">
			  Explore nossas categorias e descubra lojas, serviços e ofertas disponíveis perto de você!
			</p>
			<div class="border border-red-400 h-14">
				<Search />
				
			</div>
			
		</div>
	</div>
	<div class="w-2/5 border border-red-400 ">
		<img
			src={Allura}
			class=" flex bg-cover bg-center bg-repeat"
			alt="Vista aérea da cidade ao entardecer"
		/>
	</div>
</section>
<section class=" flex h-96 w-full justify-center gap-4 border border-red-500 p-1">
	<div class="flex h-full w-96 items-center justify-center border border-red-500">
		<div class="flex h-4/5 w-4/5 items-center border border-blue-500">
			<h2 class="flex font-['Inter'] text-lg text-white">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores nostrum veritatis a
				asperiores repellendus optio quam, molestias inventore incidunt blanditiis? Porro maiores
				nulla quis, ipsam sed dignissimos excepturi aliquam? Earum!
			</h2>
		</div>
	</div>
	<div class="h-full w-96 border border-red-500"></div>
	<div class="h-full w-96 border border-red-500"></div>
	<div class="h-full w-96 border border-red-500"></div>
	<div class="h-full w-96 border border-red-500"></div>
</section>
<h1 class="text-3x1 text-red-500">Home</h1> -->

<!-- <svelte:head>
	<title>Home</title>
	
	<meta name="description" content="Svelte demo app" />
</svelte:head> -->

<!-- <section> -->

<!-- <h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1> -->

<!-- <Nav /> -->

<!-- <h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2> -->

<!-- <Counter /> -->
<!-- </section> -->

<!-- <style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style> -->
