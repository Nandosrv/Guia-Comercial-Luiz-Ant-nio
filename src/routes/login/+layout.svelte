<script lang="ts">
	import { goto } from '$app/navigation';
	import { persistenciaUser } from '$lib/services/authService.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { userStore } from '../../stores/userStore.svelte';
	import type { LayoutData } from '../$types';
    import type { User } from "$lib/types/userStore";

	
	// Import Lucide icons
	

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	let user = data?.user;

	
	onMount(async () => {
		// Verifica se a rota atual exige login
		const paginasProtegidas = ['/perfil', '/inicio', '/perfil']; // Defina as rotas protegidas
		const rotaAtual = window.location.pathname;

		if (paginasProtegidas.includes(rotaAtual)) {
           
			if (!!user?.email) {
				try {
					await persistenciaUser(user as never, true);
				} catch (error) {
					goto('/login'); // Redireciona para login se der erro ao persistir
				}
			} else {
				goto('/login'); // Redireciona se não estiver logado
			}
		}
	});


	let currentUser = $derived(userStore.value);


	
</script>

    {@render children()}