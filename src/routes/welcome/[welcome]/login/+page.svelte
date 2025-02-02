<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginWithGoogle } from '$lib/services/authService.svelte';
	// import { loginWithGoogle } from '$lib/services/authService.svelte';
	import { userStore } from '../../../../stores/userStore.svelte';
	let email = $state(''); // E-mail
	let password = $state(''); // Senha
	let confirmPassword = $state(''); // Confirmação de senha
	let errorMessage = $state(''); // Mensagem de erro
	let isRegistering = false; // Variável para alternar entre login e registro

	let currentUser = $state(userStore.value); // Obtém o usuário atual do store





	
		const handleloginWithGoogle = async () => {
		try {
			const user = await loginWithGoogle();
			if (!user) {
				throw new Error('Erro ao fazer login com Google');
			}
			goto('/welcome/dashboard/login/admin'); // Redireciona para a página de boas-vindas
		} catch (error: any) {
			errorMessage = error.message;
			alert(`Erro ao fazer login com Google ${error}`);
			goto('login'); // Redireciona para a página de login
		}
	};
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-3xl font-semibold text-gray-800">Entrar com Google</h1>
		<button
			onclick={handleloginWithGoogle}
			class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Entrar com Google
		</button>

		{#if errorMessage}
			<p class="mt-4 text-center text-red-600">{errorMessage}</p>
		{/if}
	</div>
</main>
