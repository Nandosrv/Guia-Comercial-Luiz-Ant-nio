<script lang="ts">
	import Anuncio from './../lib/componets/anuncio.svelte';
	import { comercios } from './../data.js';
	import Lest from './../lib/componets/lest.svelte';
	import Allura from '$lib/images/Allura.png';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Menu from '$lib/componets/Menu.svelte';
	import Header from '$lib/componets/Header.svelte';
	import Pesquisa from '$lib/componets/pesquisa.svelte';
	import Search from '$lib/componets/Search.svelte';
	import Footer from '$lib/footer/+paga.svelte'
	// img
	import City from '$lib/images/nova-img1.png';
	import Homes from '$lib/images/icons8-home-50.png';
	import Schop from '$lib/images/icons8-shop-50.png';
	import Cash from '$lib/images/icons8-cash-80.png';
	import Sos from '$lib/images/icons8-sos-48.png';
	import Cartas from '$lib/images/55638e4e-9618.png';
	import Pops from '$lib/images/icon-pos.png';
	import Cardcity from '$lib/images/51e8cf29-30c9-4bfe-bc52-2afbab085d5c.png';
	import Muda from '$lib/componets/muda.svelte';
	import CookieConsent from '$lib/componets/CookieConsent.svelte';
	import { onMount } from 'svelte';
	import ImageSlider from '$lib/componets/ImageSlider.svelte';
	// onMount(async () => {
	// 	let { data: businesses, error } = await supabaseApi
	// 	.from('businesses')
	// 	.select('*')
    //     console.log(businesses);
	// });


	
</script>

<main class="flex h-[400px] flex-col w-[100%] justify-center overflow-hidden bg-[#09052D]">
	<div class="flex flex-col bg-slate-600 h-[100px] w-full justify-center items-center ">
		<h1 class="text-2xl font-semibold font-serif text-gray-800 capitalize lg:text-3xl dark:text-white">
			Encontre Comercios
		</h1>
		
	</div>
	<!-- <CookieConsent /> -->
	<div class=" flex h-[290px] w-full items-end justify-center  mt-2 ">
		<ImageSlider />
	</div>
</main>
<div class="flex h-[440px] w-[100%] flex-col bg-[#09052D] ">
	<Anuncio />

</div>
<!-- Rua -->
<div class="h-[360px] w-[100%] bg-[#09052D] ">
	<!-- <div class="flex h-14 w-[100%] items-center justify-between border border-black bg-[#4B4444]">
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
	</div> -->
	<!-- Tamnho do content -->
	

	<div class="relative h-[100px] w-[100%] bg-[#09052D] ">
		<div class="flex w-full justify-end "></div>

		<div class="h-10 w-full bg-[#FCDF1D] ">
			<div class="mt-1 flex h-14 w-full items-center justify-between border-b-4 bg-[#FCDF1D]">
				<h2 class="font-['Inter'] text-[22px] ">MAIS PESQUISADOS</h2>
				<img class="flex " src=" {Pops} " alt="" />
			</div>
		</div>
	</div>
	<div class="w-full border border-[#09052D] bg-[#09052D]  ">
		<Muda />
	</div>
</div>
<div class="w-full h-full border border-[#09052D] bg-[#09052D]  ">
	<Footer />
</div>

