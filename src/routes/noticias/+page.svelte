<script>
	import Breadcrumbs from '$lib/componets/Breadcrumbs.svelte';
	import Cardnoticia from '$lib/componets/Cardnoticia.svelte';
	import Footer from '$lib/footer/+paga.svelte';
	import Voltar from '$lib/images/volt.png';
	import { page } from '$app/stores';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		setLastPathUrl($page.url.pathname);
	});
</script>

<main
	class="flex w-[100%] flex-col items-center justify-center gap-10 bg-gradient-to-br from-purple-950 to-purple-900"
>
	<div class="w-[90%] rounded-[12px] bg-black/40 p-4 md:w-[50%]">
		<div class="flex h-[50px] w-full items-center justify-start">
			<img src={Voltar} alt="voltar" class="h-[25px] w-[25px]" />
			<p class="flex font-['Inter'] text-[25px] font-bold uppercase text-white">Notícias</p>
		</div>
		<div class="h-[50px] w-full">
			<Breadcrumbs />
		</div>
		<div class="flex h-full w-full">
			<div class="flex flex-col items-center justify-center gap-10">
				<Cardnoticia />
			</div>
		</div>
	</div>
	<div class="w-full rounded-[12px] bg-black/40 p-4 md:w-[50%]">
		<Footer />
	</div>
</main>
