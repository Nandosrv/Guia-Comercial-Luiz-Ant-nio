<script>
	import { page } from "$app/stores";
	import Logo from "$lib/componets/Logo.svelte";
	
	
	const items = [
		{ href: '/', Label: 'Home'},
		{ href: '/Comercios', Label: 'Comercios'},
		
		
        
		
	]


	
	
	
</script>
	
	<Logo />


<div class="m-8">
{#each items as {href, Label}}
{#if $page.url.pathname == href}
<a {href} class="font-['Inter'] text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6">{Label}</a>
{:else}

<a {href} class="font-['Inter'] border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">{Label}</a>
{/if}
{/each}
</div>