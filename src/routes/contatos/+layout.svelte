<script>
	import Nav from './../../lib/componets/nav.svelte';
    import Navav from '$lib/componets/nav.svelte'
    let { children } = $props();
</script>



<main>
    <h1>testando</h1>
</main>
<Nav />
<main>
    {@render children()}
</main>
