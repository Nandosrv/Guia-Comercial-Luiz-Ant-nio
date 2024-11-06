<script lang="ts">
	import Avaliacao from '../avaliacao.svelte';
	import Call from '../call.svelte';
	import Liga from '../Liga.svelte';
	import Review from '../Review.svelte';
	import Whatsapp from '../whatsapp.svelte';
	import Avalie from '../../../routes/Avalie/+page.svelte'

	import Callme from '$lib/images/callcomer.png';
	import Whats from '$lib/images/whats.png';
	import Face from '$lib/images/icons8-facebook-novo-48.png';
	import Insta from '$lib/images/icons8-instagram-64.png';

	type Product = {
		slug: string;
		title: string;
		telefone: string;
		image: string;
		whatsapp: string;
		facebook: string;
		maps: string;
	};
	type IProps = {
		product?: Product;
	};
	let { product }: IProps = $props();

	let team = [
		{
			name: 'Martiana dialan',
			titlle: 'Product designer'
		}
	];
</script>

<main class="mt-3 flex h-[400px] w-[100%] justify-center">
	<!-- card -->
	<div
		class="flex h-[400px] w-[85%] justify-center rounded-[12px]  bg-[#D1D5D9]"
	>
		<div class="flex h-[180px] w-[75%] rounded-[12px]">
			<img class="w-[100%] rounded-[12px] object-cover" src="{product?.image} " alt="" />
		</div>
		<div class="absolute flex h-[290px] w-full items-end justify-end">
			<div class=" flex h-[100px] w-full justify-center">
				<div class="flex w-[380px]">
					<div class=" flex h-[70px] w-[360px] items-center justify-center">
						<div
							class=" flex h-[70px] w-[250px] items-center justify-center rounded-[12px] font-serif text-lg"
						>
							<p class="text-wrap font-serif text-lg">{product?.title}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="absolute flex h-[50px] w-[100%] justify-start">
				<div class="mt-3 w-[85%] z-50">
					<Avaliacao />
				</div>
			</div>
		</div>
	</div>
	<div class="absolute flex h-[400px] w-[100%] items-end justify-end">
		<div class="flex h-[100px] w-[100%] items-center justify-center">
			<div class="flex h-[100px] w-[82%] items-center justify-center">
				<div class="flex h-[50px] w-[100%] justify-around z-[1000]  ">
					<div>
						<a href={`tel:${product?.telefone}`}>
							<img class="h-10 w-10" src={Callme} alt="" />
						</a>
					</div>
					<div>
						<a
							href={`https://wa.me/${product?.whatsapp}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img class="h-10 w-10" src={Whats} alt="" />
						</a>
					</div>
					<div class="z-[999999] flex relative ">
						<a href={product?.facebook} target="_blank" rel="noopener noreferrer">
							<img class="h-10 w-10 " src={Face} alt="" />
						</a>
					</div>
					<div>
						<img class="h-10 w-10" src={Insta} alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
<main class="absolute flex h-[1280px] w-[100%] items-center justify-center ">
	<div class="flex h-[400px] w-full ">
		<!-- Div Do Meio -->
		<div class="flex h-16 w-full flex-col items-center justify-center">
			<!-- <div class="w-[80%] h-[50px] flex justify-center items-center bg-[#FCDF1D] rounded-[12px] ">
				<p class="text-[20px] font-serif font-bold ">COMENTÁRIOS</p>
			</div> -->
			<div class="flex h-[400px] w-full items-center justify-center">
				<div class="flex h-10 w-[80%] items-center justify-center rounded-[12px] bg-[#FCDF1D]">
					<p class="flex font-serif text-[20px] font-bold text-black">LOCALIZE AQUI</p>
				</div>
			</div>
		</div>
	</div>
	<div
		class="absolute mt-5 flex h-[300px] w-full items-center justify-center "
	>
		<div class="flex h-[290px] w-full items-center justify-center ">
			<section class="map-section my-5 h-[400px] w-full md:h-[450px] md:w-[600px]">
				<iframe
					src={product?.maps}
					width="100%"
					height="100%"
					style="border:0; margin-top:6rem; border-radius: 12px;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Mapa de localização para {product?.title}"
				>
				</iframe>
			</section>
			<div class="w-full h-[900px]  absolute flex justify-end items-end">
				<div class="w-full h-14  justify-center items-center flex">
					<div class="w-[80%] h-full bg-[#FCDF1D] rounded-[12px] flex justify-center items-center">
						<a class="list-none no-underline" href="/Avalie">
						<p class="flex font-serif text-[20px] font-bold text-black hover:text-yellow-100">AVALIE NOSSO SITE</p>

						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>


<!-- <section class="flex h-[700px] w-[500px] rounded-[12px] py-14">
	<main class="w-full rounded-[12px] border border-red-950">
		<img src={product?.image} class="h-[300px] w-full rounded-[12px]" alt="" />
		<main class="flex h-16 w-full items-center justify-between">
			<div class="flex w-[50%] items-center border-4 border-indigo-200">
				<Liga />
				<p class="m-auto flex items-center">
					{product?.telefone}
				</p>
			</div>
			<div class="flex w-[50%] justify-end border-4 border-indigo-200">
				<Whatsapp />
			</div>
		</main>
		<section class="h-[250px] w-[100%] border border-red-800">
			<div class="mt-2 flex w-full">
				<Avaliacao />
			</div>
			<div>
				<p class="m-2 text-xl">
					{product?.title}
				</p>
			</div>
		</section>
		<div>
			<Review />
		</div>
	</main>
</section> -->

<!-- <div class="flex  w-full">
      
      <div class="mt-4 flex ">
        
        <ul class="flex">
          {#each team as item, idx (idx)}
            <li>
              <div class=" flex p-2 w-[400px] h-[100px] justify-start items-center ">
                <img
                  src="{product?.image}"
                  class="rounded-full w-20 h-20 "
                  alt=""
                  
                />
                
                <div class="flex">
                    <h4 class="text-gray-700 font-semibold sm:text-lg flex p-5 uppercase">{product?.title}</h4>
                 
                  </div>
                 
              </div>
              <div class="w-[400px] flex  border border-y-black ">
                <img class="w-[200px] " src=" {product?.image} " alt="">
                <h1 class=" w-[200px] flex  justify-center text-center items-center text-xl">{product?.telefone}</h1>
              </div>
              <div class="flex justify-center text-center items-center  h-[100px]">
                <div class="w-[200px]">
                    <a href="tel:{product?.telefone}">
                        <Call />
                      </a>
                </div>
                <div class="w-[200px] ">
                <Whatsapp />
                </div>
                <div>
                
                
                 
                </div>
               
            </div>
            <div class="w-[100%] border border-blue-500">
              <Review />
            </div>
            
            </li>
          {/each}
        </ul>
      </div>
    </div> -->
