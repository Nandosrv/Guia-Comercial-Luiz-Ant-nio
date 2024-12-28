<script lang="ts">
	import { goto } from '$app/navigation';
	import Icongogole from '$lib/images/googlelogo.png';
	import post1 from '$lib/images/post1.png';
	import { loginWithGoogle } from '$lib/services/authService.svelte';
	import { userStore } from '../../stores/userStore.svelte';

	let isRegistering = false; // Variável para alternar entre login e registro
	let email = ''; // E-mail
	let password = ''; // Senha
	let confirmPassword = ''; // Confirmação de senha
	let errorMessage = ''; // Mensagem de erro

	const toggleForm = () => {
		isRegistering = !isRegistering;
	};

	const handleloginWithGoogle = async () => {
		try {
			const user = await loginWithGoogle();
			if (!user) {
				throw new Error('Erro ao fazer login com Google');
			}
			goto('/inicio'); // Redireciona para a página de boas-vindas
		} catch (error: any) {
			errorMessage = error.message;
			alert(`Erro ao fazer login com Google: ${error}`);
			goto('login'); // Redireciona para a página de login
		}
	};
</script>

<div
	class="flex h-full w-1/2 flex-col items-center justify-center px-8 transition-transform duration-500 ease-in-out md:px-12"
	style="transform: translateX({isRegistering ? '-100%' : '0'})"
>
	<h2 class="mb-6 text-4xl font-semibold text-white">Bem-vindo de volta</h2>
	<p class="mb-8 text-center text-white">Entre com sua conta para continuar.</p>
	<form class="w-full space-y-6">
		<div>
			<label for="email" class="mb-2 block font-medium text-white">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				placeholder="Digite seu email"
				class="w-full rounded-lg border border-gray-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
		</div>
		<div>
			<label for="password" class="mb-2 block font-medium text-white">Senha</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Digite sua senha"
				class="w-full rounded-lg border border-gray-300 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded-lg bg-indigo-600 py-3 text-white shadow-lg transition hover:bg-indigo-700"
		>
			Entrar
		</button>
	</form>

	<!-- Botão de Login com Google -->
	<div class="mt-4 w-full">
		<button
			type="button"
			class="flex w-full items-center justify-center rounded-lg bg-white py-3 text-gray-800 shadow-lg transition hover:bg-gray-100"
			on:click={handleloginWithGoogle}
		>
			<img src={Icongogole} alt="Google" class="mr-3 h-6 w-6" />
			Login com Google
		</button>
	</div>

	<p class="mt-6 text-sm text-white">
		Não tem uma conta?
		<button
			class="font-medium text-blue-600 hover:underline focus:outline-none"
			on:click={toggleForm}
		>
			Registre-se
		</button>
	</p>
</div>
