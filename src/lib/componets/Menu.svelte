<script>
	import { page } from '$app/stores';
	import Logo from '$lib/componets/Logo.svelte';
	import Pesquisa from './pesquisa.svelte';
	import img from '$lib/images/antonio.png';
	import user from '$lib/images/usuário.png'

	const items = [
		{ href: '/', Label: 'Home' },
		{ href: '../../routes/Comercios/+page.svelte', Label: 'Comercios' },


	];
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
	
</script>

<nav class="w-full h-[50px] flex justify-center relative bg-white shadow dark:bg-gray-800">
	<div class="flex w-full container mx-auto px-6 py-3 md:flex">
		<div class="flex items-center w-full justify-between">
			<a href="/">
				<img class="h-10  w-auto sm:h-7" src=" {img} " alt="" />
			</a>

			<div class="flex lg:hidden ">
				<button
					on:click={toggleMenu}
					type="button"
					class=" text-gray-500  hover:text-gray-600 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 "
					aria-label="toggle menu"
				>
					{#if !isOpen}
						<!-- Ícone de hambúrguer -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
						</svg>
					{:else}
						<!-- Ícone de fechar -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<!-- Menu Mobile -->
		<div
			class={`absolute mt-16 inset-x-0 z-20 w-full bg-white px-6 py-4 transition-all duration-300 ease-in-out md:relative md:mt-0 md:flex md:translate-x-0 md:items-center md:justify-between md:p-0 md:opacity-100 dark:bg-gray-800 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
		>
			<div class="-mx-4 h-[200px] flex flex-col items-center justify-centerpx-2 md:mx-10 md:flex-row md:py-0">
				
				<a
					href="/"
					class=" transform rounded-lg px-2.5 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 md:mx-2 dark:text-gray-200 dark:hover:bg-gray-700"
					>Inico</a
				>
				<a
					href={'Comercios'}
					class="transform rounded-lg px-2.5 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 md:mx-2 dark:text-gray-200 dark:hover:bg-gray-700"
					>Comercios</a
				>
				<a
					href="/"
					class="transform rounded-lg px-2.5 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-100 md:mx-2 dark:text-gray-200 dark:hover:bg-gray-700"
					>ofertas</a
				>
				<!-- <a href=" {user} ">
					<img class="p-1" src=" {user} " alt="">
				</a> -->
			</div>

			<div class="relative mt-4 md:mt-0">
				<Pesquisa />
			</div>
			
		</div>
		
	</div>
</nav>

