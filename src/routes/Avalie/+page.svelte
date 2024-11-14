<script lang="ts">
	import Alerty from '$lib/componets/alerty.svelte';
	import Finaz from '$lib/componets/finaz.svelte';

	import mt from '$lib/images/mt.png';
	export let phone: string = '+5516996151725';
</script>

<main class="flex h-[500px] w-[100%] flex-col bg-[#09052D] ">
	<div class="flex h-[130px] w-[100%] flex-col items-center justify-center ">
		<Alerty />
	</div>
	<div class="flex h-[400px] w-[100%] justify-center">
		<div class="mt-1 flex h-[390px] w-[90%] flex-col items-center gap-2">
			<!-- <div
				class="flex h-[51px] w-[85%] items-center justify-center rounded-[12px] bg-[#FF2D1D5D2B2B]"
			>
				<p class="flex rounded-[12px] bg-[#D1D5D2] font-serif text-[20px] text-lg text-black">
					ANÚNCIE SEU NEGÓCIO AQUI!
				</p>
			</div> -->
			<div
				class="bg-[#D1D5D2] flex h-[340px] w-[85%] flex-col items-center justify-center gap-4 rounded-[12px] "
			>	<p class="mt-2 flex rounded-[12px] bg-[#D1D5D2] font-serif text-[20px] text-lg text-[#FE1804] ">ANÚNCIE SEU NEGÓCIO AQUI!</p>
				<div class="flex h-[200px] w-[75%] items-center justify-center rounded-[12px] ">
					<img class="h-40 w-40" src="{mt} " alt="" />
				</div>
				<div class=" flex h-[81px] w-[85%] items-center justify-center rounded-[12px] bg-[#FF2B2B]">
					<div class="w-[100%]  flex justify-center items-center">
						<a href={`https://wa.me/${phone}`}>
							<p class=" flex p-1 font-serif text-[17px] m-1 text-black hover:text-yellow-100">
								FAÇA PARTE DO TIME
							</p>
						</a>
					</div>
				</div>
				<div class="mb-2 route h-[10px] w-[50%] rounded-[12px] bg-[#FCDF1D] "></div>
			</div>
			<div class="w-full  h-16 transform rotate-[135deg] ml-[120px] p-2 md:hidden">
				<div class="mb-2 route h-[7px] w-[40%] rounded-[12px] bg-[#FCDF1D] p-1"></div>
				<div class="mb-2 route h-[7px] w-[40%] rounded-[12px] bg-[#FCDF1D]"></div>
			</div>
			
		</div>
	</div>
</main>

<main class="flex h-[700px] w-[100%] flex-col bg-[#09052D] ">
	
	<div class="flex  h-[700px] w-[100%] justify-center">
		<div class="mt-1 flex h-[700px] w-[90%] flex-col items-center gap-2">
		
			<div
				class="bg-[#D1D5D2] gap-9 flex h-[500px] w-[85%] flex-col items-center justify-center rounded-[12px]  "
			>	<p class="ml-5 mt-2 flex rounded-[12px] bg-[#D1D5D2] font-serif text-[20px] text-[#211660] ">
				SUA AVALIAÇÃO É   IMPORTANTE PARA NÓS!
			</p>
				<div class="w-full  h-[100px] justify-center items-center flex-col ">
					<p class="text-[#09052D] w-[95%] flex ml-5 text-[16px] font-serif">PARA MELHORIAS OU ATÉ<br /> MESMO AVALIAÇÕES POSITIVAS, SERÃO MUITO BEM-VINDAS AO NOSSO SITE!</p>

				</div>
				<div class="w-full  h-[100px] justify-center items-center flex-col ">
					<p class="text-[#09052D] w-[95%] flex ml-5 text-[16px] font-serif ">FIQUE À VONTADE!
						ESTE LUGAR FOI RESERVADO <br />ESPECIALMENTE PARA VOCÊ!</p>
				</div> 
				
				<Finaz />

				<div class=" route h-[10px] w-[50%] rounded-[12px] bg-[#FCDF1D] "></div>
			</div>
			<div class="w-full  h-16 transform rotate-[135deg] ml-[120px] p-2 md:hidden">
				<div class="mb-2 route h-[7px] w-[40%] rounded-[12px] bg-[#FCDF1D] p-1"></div>
				<div class="mb-2 route h-[7px] w-[40%] rounded-[12px] bg-[#FCDF1D]"></div>
			</div>
			
		</div>
	</div>
</main>



<!-- <div class="flex h-[400px] w-full justify-center bg-[#09052D] ">
	<div class="bg-[#D1D5D2] flex h-[340px] w-[85%] flex-col items-center justify-center gap-4 rounded-[12px] ">


	</div>
</div> -->
