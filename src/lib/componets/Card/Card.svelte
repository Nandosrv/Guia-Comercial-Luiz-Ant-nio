<script lang="ts">
	import Avaliacao from '../avaliacao.svelte';
	import Call from '../call.svelte';
	import Liga from '../Liga.svelte';
	import Review from '../Review.svelte';
	import Whatsapp from '../whatsapp.svelte';
	import avalie from '../../../routes/avalie/+page.svelte';

	import Cals from '$lib/images/call-me.png';
	import Ws from '$lib/images/icon-ws.png';
	import Face from '$lib/images/icons8-facebook-novo-48.png';
	import Insta from '$lib/images/icons8-instagram-64.png';
	// console.log(product?.image)
	type Product = {
		slug: string;
		title: string;
		telefone: string;
		image: string;
		whatsapp: string;
		facebook: string;
		instagram: string;
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
	<div class="flex h-[500px] w-[85%] justify-center rounded-[12px] bg-[#D1D5D9]">
		<div class="flex h-[180px] w-[75%] rounded-[12px] md:h-[57%]">
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
				<div class="z-50 mt-3 w-[85%]">
					<!-- <Avaliacao /> -->
				</div>
			</div>
		</div>
	</div>
	<div class="absolute flex h-[400px] w-[100%] items-end justify-end">
		<div class="flex h-[100px] w-[100%] items-center justify-center">
			<div class="flex h-[100px] w-[82%] items-center justify-center">
				<div class="z-[1000] flex h-[50px] w-[100%] justify-around">
					<div>
						<a href={`tel:${product?.telefone}`}>
							<img class="h-10 w-10" src={Cals} alt="" />
						</a>
					</div>
					<div>
						<a
							href={`https://wa.me/${product?.whatsapp}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img class="h-10 w-10" src={Ws} alt="" />
						</a>
					</div>
					<div class="relative z-[999999] flex">
						<a href={product?.facebook} target="_blank" rel="noopener noreferrer">
							<img class="h-10 w-10" src={Face} alt="" />
						</a>
					</div>
					<div>
						<a href={product?.instagram} target="_blank" rel="noopener noreferrer">
							<img class="h-10 w-10" src={Insta} alt="" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
<main class="absolute flex h-[1280px] w-[100%] items-center justify-center">
	<div class="flex h-[400px] w-full">
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
	<div class="absolute mt-5 flex h-[300px] w-full items-center justify-center">
		<div class="flex h-[290px] w-full items-center justify-center">
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
			<div class="absolute flex h-[900px] w-full items-end justify-end">
				<div class="flex h-14 w-full items-center justify-center">
					<div class="flex h-full w-[80%] items-center justify-center rounded-[12px] bg-[#FCDF1D]">
						<a class="list-none no-underline" href="/avalie">
							<p class="flex font-serif text-[20px] font-bold text-black hover:text-yellow-100">
								AVALIE NOSSO SITE
							</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
