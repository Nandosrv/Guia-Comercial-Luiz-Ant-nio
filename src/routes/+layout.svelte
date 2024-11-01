<script lang="ts">
	import Header from '$lib/componets/Header.svelte';
	import '../app.css';
	import city from '$lib/images/city.jpg'
	import Menu from '$lib/componets/Menu.svelte'
	let { children } = $props();
</script>
<div class="p-4 border w-full relative flex justify-center ">
	<Header />
	
</div>

	
	
	<main>
		{@render children()}
	</main>



