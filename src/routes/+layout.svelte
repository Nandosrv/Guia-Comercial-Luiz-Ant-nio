<script lang="ts">
	import Header from '$lib/componets/Header.svelte';
	import '../app.css';
	import Menu from '$lib/componets/Menu.svelte'
	import Luizantonio from '../routes/luizantonio/luizantonio.svelte';
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	let { children } = $props();
	

</script>
<div class="w-full items-center relative flex justify-between ">
	<Header />
	
</div>

	<main>
		{@render children()}
	</main>



