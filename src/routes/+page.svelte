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
	import Homes from '$lib/images/icons8-home-50.png';
	import Schop from '$lib/images/icons8-shop-50.png';
	import Cash from '$lib/images/icons8-cash-80.png';
	import Sos from '$lib/images/icons8-sos-48.png';
	import Cartas from '$lib/images/55638e4e-9618.png';
	import Pops from '$lib/images/icon-pos.png';
	import Cardcity from '$lib/images/51e8cf29-30c9-4bfe-bc52-2afbab085d5c.png';
    

	
</script>
<main class="flex justify-center bg-[#09052D] w-[100%] h-[300px] overflow-hidden  ">
	<div class="flex justify-center w-[340px] h-[300px]  ">
	<img class="w-[315px] h-[300px] object-cover" src="{Cardcity} " alt="">
	<div class="flex justify-center items-end w-[320px] h-[290px] absolute ">
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
		<!-- Tamnho do content -->
		<div class="w-[100%] h-[340px] flex flex-col bg-[#09052D]">
			<!-- Divis -->
			
			<div class="w-[360px] flex justify-end ">
				<!-- <div class="w-[121px] h-[12px] bg-white "> -->
			

				<!-- </div> -->
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
			<div class="mt-5 w-[320px] flex justify-end ">
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
			<div class="mt-5 w-[250px] flex justify-end ">
				<div class="w-[121px] h-[12px] bg-white ">
			

				</div>
			</div>
			
			<div class="w-full h-[75px] absolute  justify-end flex mt-14 ">
				<div class="z-10 w-full h-[75px] justify-center flex ">
					<div class="w-[340px] h-[70px] flex justify-center items-center">
						<!-- icon -->
						<div class="w-[250px] h-[50px] flex justify-between gap-6 items-center ">
						<!-- icon -->
							<div class="w-[40px] h-[40px]  bg-yellow-400 rounded-2xl justify-center items-center">
								<a href="/">
								<img class="w-[41px] h-[35px] " src="{Homes}" alt="">
								</a>
							</div>
							<div class="w-[39px] h-[40px] object-cover bg-yellow-400 rounded-2xl hover:text-red-500 ">
								<a href="/">
									<img class="w-[41px] h-[35px] " src="{Schop}" alt="">
									</a>
							</div>
							<div class="w-[40px] h-[40px]  bg-yellow-400 rounded-2xl ">
								<a href="/">
									<img class="w-[41px] h-[35px] " src="{Cash}" alt="">
									</a>
							</div>
							<div class="w-[39px] h-[40px]  bg-yellow-400 rounded-2xl ">
								<a href="/">
									<img class="w-[41px] h-[35px] " src="{Sos}" alt="">
									</a>
							</div>
							
						</div>
					</div>
				</div>
				<img class="w-[449px] h-[271px] absolute " src="{Cartas}" alt="">

			</div>
			
			<div class="mt-5 w-[100%] flex justify-end ">

				<div class="w-[100%] h-[22px] bg-white ">
					

				</div>
			</div>
			
			
		
		</div>
		
		<div class="bg-[#09052D] w-[100%] h-[360px]  relative ">
			<div class="w-full flex justify-end ">
				<img class="flex mt-4" src=" {Pops} " alt="">

			</div>
				
			<div class="w-full h-10  bg-[#FCDF1D] ">
					
					<div class="w-full flex justify-end">
						
						<h2>EM ALTA</h2>
					</div>
					<div class="">
					</div>
				</div>
		</div>
	</div>
	
	
