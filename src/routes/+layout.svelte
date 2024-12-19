<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/componets/Header.svelte';
	import { persistenciaUser } from '$lib/services/authService.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let user = data?.user;

	onMount(async () => {
		if (!!user?.name) {
			try {
				await persistenciaUser(user, true);
			} catch (error) {
				// goto('/login');
			}
			goto(data.pathUrl!);
		} else {
			// goto('/login');
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
	<div
		class="relative flex w-full items-center gap-4 overflow-y-auto bg-purple-950/100 p-4 text-purple-900 md:justify-center"
	>
		{#each navItems as item}
			<a
				href={item.href}
				class=" w-[120px] min-w-[100px] rounded-md border bg-purple-900/100 p-2 text-center font-['Inter']
				text-sm font-semibold text-yellow-500 transition-colors hover:bg-purple-800/30
				hover:text-[17px] hover:text-blue-400 max-sm:w-[96px]"
			>
				<span>{item.name}</span>
			</a>
		{/each}
	</div>
</div>

<main>
	{@render children()}
</main>
