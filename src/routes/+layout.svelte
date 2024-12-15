<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/componets/Header.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
	import { userStore } from '../stores/userStore.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let user = data?.user;

	onMount(async () => {
		// console.log('data layout', data.pathUrl);
		if (!!user?.name) {
			userStore.value = user;
			goto(`${data.pathUrl || '/inicio'}`);
		}
	});

	const navItems = [
		{ name: 'Atualizações', href: '/noticias' },
		{ name: 'Comércios', href: '/comercios' },
		// { name: 'Eventos', href: '/NewEventos' },
		{ name: 'Mural', href: '/mural' },
		// { name: 'Ofertas da Semana', href: '/OfertasDaSemana'},
		{ name: 'Avisos', href: '/quadroAvisos' },
		{ name: 'Suporte', href: '/suporte' }
	];
</script>

<div class="relative flex w-[full] flex-col items-center justify-between">
	<Header />
	<div class="flex w-full items-center justify-center bg-purple-950/100 p-4 text-purple-900">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center bg-purple-900/100 px-3 py-4 font-['Inter'] text-[14px] text-sm font-semibold text-yellow-500 transition-colors hover:bg-purple-800/30 hover:text-[17px] hover:text-blue-400 max-sm:w-[96px] max-sm:text-[12px] sm:w-[120px] md:w-[120px] lg:w-[120px]"
			>
				<span>{item.name}</span>
			</a>
		{/each}
	</div>
</div>

<main>
	{@render children()}
</main>
