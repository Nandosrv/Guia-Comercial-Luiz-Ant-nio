<script lang="ts">
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
</script>

<main class="flex h-[300px] w-[100%] justify-center overflow-hidden bg-[#09052D]">
	<div class="flex h-[300px] w-[340px] justify-center">
		<img class="h-[300px] w-[315px] object-cover" src="{Cardcity} " alt="" />
		<div class="absolute flex h-[290px] w-[320px] items-end justify-center"></div>
	</div>
</main>
<!-- Rua -->
<div class="h-[360px] w-[100%] bg-[#09052D]">
	<div class="flex h-14 w-[100%] items-center justify-between border border-black bg-[#4B4444]">
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
		<div class=" h-2 w-16 rounded-2xl border border-yellow-400 bg-yellow-400"></div>
	</div>
	<!-- Tamnho do content -->
	<div class="flex h-[340px] w-[100%] flex-col bg-[#09052D]">
		<div class="mt-5 flex w-[350px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[340px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>

		<div class="mt-5 flex w-[330px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[320px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[310px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[300px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[290px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[280px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>
		<div class="mt-5 flex w-[250px] justify-end">
			<div class="h-[12px] w-[121px] bg-white"></div>
		</div>

		<div class="absolute mt-14 flex h-[75px] w-full justify-end">
			<div class="z-10 flex h-[75px] w-full justify-center md:justify-end">
				<div class="flex h-[70px] w-[340px] items-center justify-center md:w-[500px]">
					<!-- icon -->
					<div class="flex h-[50px] w-[250px] items-center justify-between md:w-[280px]">
						<!-- icon -->
						<div class="h-[40px] w-[40px] items-center justify-center rounded-2xl bg-yellow-400">
							<a href="/">
								<img class="h-[35px] w-[41px]" src={Homes} alt="" />
							</a>
						</div>
						<div
							class="h-[40px] w-[39px] rounded-2xl bg-yellow-400 object-cover hover:text-red-500"
						>
							<a href="/Comercios">
								<img class="h-[35px] w-[41px]" src={Schop} alt="" />
							</a>
							<div class="flex mr-[100px] ">
							</div>
						</div>
				
						<div class="h-[40px] w-[40px] rounded-2xl bg-yellow-400">
							<a href="/">
								<img class="h-[35px] w-[41px]" src={Cash} alt="" />
							</a>
							<div class="flex mr-[100px] font-['Inter'] font-medium ">
							</div>
						</div>
						<div class="h-[40px] w-[39px] rounded-2xl bg-yellow-400">
							<a href="/">
								<img class="h-[35px] w-[41px]" src={Sos} alt="" />
							</a>
							<div class="flex mr-[100px] ">
							</div>
						</div>
						
					</div>
					
				</div>
				
			</div>
			
			<img class="absolute h-[271px] w-[449px]" src={Cartas} alt="" />
		</div>

		<div class="mt-5 flex w-[100%] justify-end">
			<div class="h-[22px] w-[100%] bg-white"></div>
		
		</div>

	</div>

	<div class="relative h-[100px] w-[100%] bg-[#09052D]">
		<div class="flex w-full justify-end"></div>

		<div class="h-10 w-full bg-[#FCDF1D]">
			<div class="mt-1 flex h-14 w-full items-center justify-between border-b-4 bg-[#FCDF1D]">
				<h2 class="font-['Inter'] text-[22px]">MAIS PESQUISADOS</h2>
				<img class="flex" src=" {Pops} " alt="" />
			</div>
		</div>
	</div>
	<div class="h-full w-full border border-[#09052D] bg-[#09052D]">
		<Muda />
	</div>
</div>
