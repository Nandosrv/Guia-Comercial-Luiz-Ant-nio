<script lang="ts">
	import Header from '$lib/componets/Header.svelte';
	import '../app.css';
	import Menu from '$lib/componets/Menu.svelte'
	import Luizantonio from '../routes/luizantonio/luizantonio.svelte';
	let { children } = $props();
</script>
<div class="w-full h-[70px] items-center relative flex justify-between bg-[#09052D]">
	<Header />
	
</div>

	
	<main>
		{@render children()}
	</main>



