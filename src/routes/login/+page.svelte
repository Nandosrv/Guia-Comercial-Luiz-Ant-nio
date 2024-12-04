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

<main class="flex justify-center items-center min-h-screen bg-gray-100">
	<div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
		<h1 class="text-3xl font-semibold text-center mb-6 text-gray-800">
			Entrar com Google
		</h1>
		<button
			on:click={loginWithGoogle}
			class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Entrar com Google
		</button>

		{#if errorMessage}
			<p class="mt-4 text-red-600 text-center">{errorMessage}</p>
		{/if}
	</div>
</main>

  
  
