<script lang="ts">
	import Avaliacao from '../avaliacao.svelte';
	import Call from '../call.svelte';
	import Liga from '../Liga.svelte';
	import Review from '../Review.svelte';
	import Whatsapp from '../whatsapp.svelte';
	

	import Callme from '$lib/images/callcomer.png'
	import Whats from '$lib/images/whats.png'
	import Face from '$lib/images/icons8-facebook-novo-48.png'
	import Insta from '$lib/images/icons8-instagram-64.png'

	type Product = {
		slug: string;
		title: string;
		telefone: string;
		image: string;
		whatsapp: string;
		facebook: string;
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

<main class="mt-1 w-[100%]   h-[420px] justify-center flex ">
	<!-- card -->
	<div class="flex justify-center w-[85%] h-[400px] rounded-[12px] bg-[#D1D5D9] border border-black">
		<div class="w-[75%] h-[180px] flex  rounded-[12px] ">
			<img class="rounded-[12px] w-[100%] object-cover " src="{product?.image} " alt="">
		</div>
		<div class="w-full h-[290px]  absolute flex justify-end items-end ">
			<div class=" justify-center w-full h-[100px] flex">
				<div class="flex w-[380px] ">
					<div class=" w-[360px] h-[70px] justify-center  flex items-center ">
						<div class=" flex w-10 h-10">
							<img class="rounded-full object-cover" src="{product?.image} " alt="">
							
						</div>
						<div class=" flex text-lg font-serif w-[250px] h-[70px] justify-center items-center border border-black rounded-[12px] ">
							<p class="text-lg font-serif text-wrap ">{product?.title} </p>
							</div>
							
					</div>
					
				</div>
				
			</div>
			<div class="flex justify-start absolute w-[100%] h-[50px]">
				<div class="w-[85%] mt-3 ">
					<Avaliacao />

				</div>
				
			</div>
		</div>
		
	</div>
	<div class="w-[100%] h-[400px] flex justify-end items-end absolute  ">
		<div class="w-[100%] h-[100px] flex justify-center items-center ">
			<div class="w-[82%] h-[100px] flex justify-center items-center ">
				<div class="w-[100%] h-[50px] flex justify-around ">
					<div>
						<a href={`tel:${product?.telefone}`}>
						<img class="w-10 h-10" src="{Callme}" alt="">

						</a>
					</div>
					<div>
						<a href={`https://wa.me/${product?.whatsapp}`} target="_blank" rel="noopener noreferrer">
						<img class="w-10 h-10" src="{Whats}" alt="">

						</a>
					</div>
					<div>
						<a href={product?.facebook} target="_blank" rel="noopener noreferrer">
						<img class="w-10 h-10" src="{Face}" alt="">

					</a>
					</div>
					<div>
						<img class="w-10 h-10" src="{Insta}" alt="">
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
