<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import { createUserWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';

	const register = async () => {
		if (password !== confirmPassword) {
			errorMessage = 'As senhas não coincidem.';
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			// console.log("Usuário registrado:", userCredential.user);
			goto('/welcome'); // Redireciona para a página de boas-vindas
		} catch (error) {
			console.error('Erro ao registrar usuário:', error);
			errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
		}
	};
</script>

<div class="form-container">
	<h2>Registrar</h2>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}
	<input type="email" placeholder="Email" bind:value={email} />
	<input type="password" placeholder="Senha" bind:value={password} />
	<input type="password" placeholder="Confirmar Senha" bind:value={confirmPassword} />
	<button on:click={register}>Registrar</button>
</div>

<style>
	.form-container {
		max-width: 400px;
		margin: 0 auto;
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 5px;
		background-color: #fff;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.form-container h2 {
		margin-bottom: 1rem;
	}

	.form-container input {
		width: 100%;
		padding: 0.75rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.form-container button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.form-container button:hover {
		background-color: #0056b3;
	}

	.error-message {
		color: red;
		margin-bottom: 1rem;
	}
</style>
