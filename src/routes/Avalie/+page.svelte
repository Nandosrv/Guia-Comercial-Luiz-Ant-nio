<script lang="ts">
	import Alerty from '$lib/componets/alerty.svelte';

	import mt from '$lib/images/mt.png';
	export let phone: string = '+5516991916526';
</script>

<main class="flex h-[500px] w-[100%] flex-col ">
	<div class="flex h-[130px] w-[95%] flex-col items-center justify-center ">
		<Alerty />
	</div>
	<div class="flex h-[400px] w-[100%] justify-center">
		<div class="mt-1 flex h-[390px] w-[90%] flex-col items-center gap-2">
			<div
				class="flex h-[51px] w-[85%] items-center justify-center rounded-[12px] bg-[#FF2D1D5D2B2B]"
			>
				<p class="flex rounded-[12px] bg-[#FF2B2B] font-serif text-[20px] text-lg text-black">
					ANÚNCIE SEU NEGÓCIO AQUI!
				</p>
			</div>
			<div
				class="flex h-[300px] w-[85%] flex-col items-center justify-center gap-4 rounded-[12px] bg-red-400"
			>
				<div class="flex h-[200px] w-[75%] items-center justify-center rounded-[12px] bg-black">
					<img class="h-40 w-40" src="{mt} " alt="" />
				</div>
				<div class="flex h-[51px] w-[75%] items-center justify-center rounded-[12px] bg-[#FF2B2B]">
					<a href={`https://wa.me/${phone}`}>
						<p class="flex p-1 font-serif text-[20px] text-lg text-blue-400 hover:text-yellow-100">
							VENHA FAZER PARTE DO NOSSO TIME
						</p>
					</a>
				</div>
				<div class="route h-[10px] w-[50%] rounded-[12px] bg-[#FCDF1D]"></div>
			</div>
		</div>
	</div>
</main>
<div class="flex h-[400px] w-full justify-center  ">
	<div class="flex h-[100px] w-[95%] flex-col justify-center bg-[#FF2B2B] items-center rounded-[12px] ">
		<div class="w-[95%] h-full  flex justify-center items-center">
            <p class=" w-[100%] flex font-serif text-[25px] justify-center items-center text-black hover:text-yellow-100">
                SUA AVALIAÇÃO É IMPORTANTE PARA NÓS!
            </p>
        </div>
	</div>
</div>
