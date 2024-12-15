<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		auth,
		createUserWithEmailAndPassword,
		googleProvider,
		signInWithEmailAndPassword,
		signInWithPopup
	} from '$lib/firebase/client';
	import supabase from '$lib/supabaseClient';
	import { setCookie } from '$lib/utils/cookies.svelte';
	import { userStore } from '../../stores/userStore.svelte';
	let email = $state(''); // E-mail
	let password = $state(''); // Senha
	let confirmPassword = $state(''); // Confirmação de senha
	let errorMessage = $state(''); // Mensagem de erro
	let isRegistering = false; // Variável para alternar entre login e registro

	let currentUser = $state(userStore.value); // Obtém o usuário atual do store

	// Função para configurar o cookie
	// function setCookie(name: string, value: string, days: number) {
	// 	const date = new Date();
	// 	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Define a data de expiração
	// 	document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`; // Cria o cookie
	// }

	const login = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			// console.log('login', userCredential);
			userStore.value = {
				...userStore.value,
				name: userCredential.user.displayName || 'Usuário',
				photoURL: userCredential.user.photoURL || '',
				userId: userCredential.user.uid
			};
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
			userStore.value = {
				...userStore.value,
				name: userCredential.user.displayName || 'Usuário',
				photoURL: userCredential.user.photoURL || '',
				userId: userCredential.user.uid
			};
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
			userStore.value.name = result.user?.displayName || '';
			userStore.value.userId = result.user?.uid || '';
			const { data, error } = await supabase.from('users').select('*').eq('id', result.user.uid);

			if (data && data.length > 0) {
				userStore.value.photoURL = data[0].photo_url || ''; // Atualiza a foto do usuário no store
			} else {
				const { data, error } = await supabase.from('users').insert([
					{
						id: result.user.uid,
						firebase_id: result.user.uid,
						username: result.user.displayName,
						photo_url: result.user.photoURL,
						created_at: new Date()
					}
				]);
			}

			const token = await result.user.getIdToken(); // Obtém o token de autenticação
			setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias
			goto('/inicio'); // Redireciona para a página de boas-vindas
		} catch (error: any) {
			console.error('Erro ao fazer login com Google:', error);
			errorMessage = error.message;
		}
	};
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-3xl font-semibold text-gray-800">Entrar com Google</h1>
		<button
			onclick={loginWithGoogle}
			class="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Entrar com Google
		</button>

		{#if errorMessage}
			<p class="mt-4 text-center text-red-600">{errorMessage}</p>
		{/if}
	</div>
</main>
