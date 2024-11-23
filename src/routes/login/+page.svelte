<script lang="ts">
	import user from '$lib/images/usuário.png';
	import {
		auth,
		signInWithEmailAndPassword,
		createUserWithEmailAndPassword,
		googleProvider,
		signInWithPopup
	} from '../../firebase';
	import { goto } from '$app/navigation';
	import { userId, userName, userPhotoURL } from '../../stores/user'; // Importando o store
	import supabase from '$lib/supabaseClient';
	import { updated } from '$app/stores';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';
	let isRegistering = false; // Variável para alternar entre login e registro
	let iduser = $userId;

	// Função para configurar o cookie
	function setCookie(name: string, value: string, days: number) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Define a data de expiração
		document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`; // Cria o cookie
	}

	const login = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			// console.log('login', userCredential);
			userName.set(userCredential.user.displayName || 'Usuário'); // Atualiza o nome do usuário no store
			userPhotoURL.set(userCredential.user.photoURL || null); // Atualiza a foto do usuário no store
			userId.set(userCredential.user.uid); // Atualiza o id do usuário no stores
			// Salva o token no cookie
			const token = await userCredential.user.getIdToken(); // Obtém o token de autenticação
			setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias

			goto('/login'); // Redireciona para a página de boas-vindas
		} catch (error) {
			console.error('Erro ao fazer login:', error);
			errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
		}
	};

	const register = async () => {
		if (password !== confirmPassword) {
			errorMessage = 'As senhas não coincidem.';
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			console.log('Usuário registrado:', userCredential.user);
			userName.set(userCredential.user.displayName || 'Usuário'); // Atualiza o nome do usuário no store
			userPhotoURL.set(userCredential.user.photoURL || null); // Atualiza a foto do usuário no store

			// Salva o token no cookie
			const token = await userCredential.user.getIdToken(); // Obtém o token de autenticação
			setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias

			goto('/welcome'); // Redireciona para a página de boas-vindas
		} catch (error: any) {
			console.error('Erro ao registrar usuário:', error);
			errorMessage = error.message;
		}
	};

	const loginWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);

			userName.set(result.user.displayName || 'Usuário'); // Atualiza o nome do usuário no store
			const { data, error } = await supabase.from('users').select('*').eq('id', result.user.uid);

			if (data && data.length > 0) {
				userPhotoURL.set(data[0].photo_url || null); // Atualiza a foto do usuário no store
			}else{
			    const { data, error } = await supabase.from('users').insert([
				    {
					    id: result.user.uid,
					    firebase_id: result.user.uid,
					    username: result.user.displayName,
					    photo_url: result.user.photoURL,
					    created_at: new Date(),
				    },
			    ]);

            }
            
            
			userId.set(result.user.uid); // Atualiza o id do usuário no stores
			const token = await result.user.getIdToken(); // Obtém o token de autenticação
			setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias

			goto('/Inicio'); // Redireciona para a página de boas-vindas
		} catch (error: any) {
			console.error('Erro ao fazer login com Google:', error);
			errorMessage = error.message;
		}
	};
</script>

<main>
	<div class="form-container">
		<h1>{isRegistering ? 'Criar uma Conta' : 'Entrar'}</h1>
		<form on:submit|preventDefault={isRegistering ? register : login} class="form">
			<input type="email" bind:value={email} placeholder="E-mail" required class="input" />
			<input type="password" bind:value={password} placeholder="Senha" required class="input" />
			{#if isRegistering}
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirme a senha"
					required
					class="input"
				/>
			{/if}
			<button type="submit" class="btn">{isRegistering ? 'Registrar' : 'Entrar'}</button>
		</form>

		<button on:click={loginWithGoogle} class="google-btn">Entrar com Google</button>

		{#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		{/if}

		<button on:click={() => (isRegistering = !isRegistering)} class="toggle-link" type="button">
			{isRegistering ? 'Já tem uma conta? Entre aqui.' : 'Ainda não tem uma conta? Crie uma aqui.'}
		</button>
	</div>
</main>

<style>
	.form-container {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
		text-align: center;
		animation: fadeIn 0.5s ease-out;
	}

	h1 {
		color: #333;
		font-size: 24px;
		margin-bottom: 20px;
	}

	.form-container {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
		text-align: center;
		animation: fadeIn 0.5s ease-out;
	}

	h1 {
		color: #333;
		font-size: 24px;
		margin-bottom: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		width: 100%;
		transition: border-color 0.3s;
	}

	.input:focus {
		border-color: #3498db;
		outline: none;
	}

	.btn {
		padding: 12px;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.3s;
	}

	.btn:hover {
		background-color: #2980b9;
	}

	.google-btn {
		padding: 12px;
		background-color: #db4437;
		color: white;
		border: none;
		border-radius: 4px;
		width: 100%;
		margin-top: 15px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.google-btn:hover {
		background-color: #c1351d;
	}

	.error-message {
		color: #e74c3c;
		font-size: 14px;
		margin-top: 10px;
		animation: shake 0.5s ease-in-out;
	}

	.toggle-link {
		color: #3498db;
		font-size: 14px;
		cursor: pointer;
		margin-top: 15px;
		transition: color 0.3s;
	}

	.toggle-link:hover {
		text-decoration: underline;
		color: #2980b9;
	}

	/* Animações */
	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes shake {
		0% {
			transform: translateX(-5px);
		}
		25% {
			transform: translateX(5px);
		}
		50% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
