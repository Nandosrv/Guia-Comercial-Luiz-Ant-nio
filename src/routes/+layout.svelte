<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/componets/Header.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
	import { userStore } from '../stores/userStore.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let user = data.user;

	onMount(async () => {
		// console.log('data layout', user);
		if (!!user.name) {
			userStore.value = user;
			goto('/inicio');
		}
	});

	const navItems = [
		{ name: 'Atualizações', href: '/noticias' },
		{ name: 'Comércios', href: '/comercios' },
		// { name: 'Eventos', href: '/NewEventos' },
		{ name: 'Mural', href: '/mural' },
		// { name: 'Ofertas da Semana', href: '/OfertasDaSemana'},
		{ name: 'Quadro de Avisos', href: '/quadroAvisos' },
		{ name: 'Suporte', href: '/suporte' }
	];
</script>

<div class="relative flex w-full flex-col items-center justify-between">
	<Header />
	<div class={'flex p-2'}>
		{#each navItems as item}
			<a
				href={item.href}
				class="u flex items-center px-3 py-4 text-sm transition-colors hover:bg-purple-800/30 hover:text-[17px] hover:text-blue-400"
			>
				<span>{item.name}</span>
			</a>
		{/each}
	</div>
</div>

<main>
	{@render children()}
</main>
