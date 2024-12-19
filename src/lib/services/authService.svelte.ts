import { auth } from '$lib/firebase/client';
import supabase from '$lib/supabaseClient';
import { deleteCookie, setCookie } from '$lib/utils/cookies';
import {
	GoogleAuthProvider,
	type User,
	onAuthStateChanged,
	signInWithPopup,
	signOut
} from 'firebase/auth';
import { userStore } from '../../stores/userStore.svelte';

// Login com Google
export const loginWithGoogle = async (): Promise<User | null> => {
	const provider = new GoogleAuthProvider();
	try {
		const { user } = await signInWithPopup(auth, provider);
		if (!user) {
			throw new Error('Erro ao fazer login com Google');
		}
		await _persistenciaUser(user);

		return user;
	} catch (error: any) {
		console.error('Erro ao fazer login com Google:', error);
		// errorMessage = error.message;
	}
	return null;
};

// Logout
/**
 * The `logout` function in TypeScript asynchronously signs out the user, deletes the 'authToken'
 * cookie, and logs the user out.
 */
export const logout = async (): Promise<void> => {
	try {
		await signOut(auth);
		deleteCookie('authToken');
		deleteCookie('userId');
		deleteCookie('userPhotoURL');
		deleteCookie('userName');
		deleteCookie('lastPathUrl');

		userStore.value = {
			name: '',
			email: '',
			photoURL: '',
			userId: ''
		};
	} catch (error) {
		console.error('Erro ao deslogar:', error);
		throw error;
	}
};

// Escutar mudanças no estado do usuário
export const subscribeToAuthState = async (callback: (user: User | null) => void) => {
	onAuthStateChanged(auth, callback);
};

// Obter o usuário autenticado
export const getCurrentUser = (): User | null => {
	return auth.currentUser;
};

export const checkAuthState = (): void => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			// Usuário está autenticado
			const token = await user.getIdToken();
			// console.log('Token revalidado:', token);

			// Atualizar o token no cookie, se necessário
			document.cookie = `authToken=${token}; path=/; max-age=3600`;
		} else {
			console.log('Usuário não autenticado');
		}
	});
};

async function _persistenciaUser(user: User) {
	userStore.value.name = user?.displayName || '';
	userStore.value.userId = user?.uid || '';
	const { data, error } = await supabase.from('users').select('*').eq('id', user.uid);

	if (data && data.length > 0) {
		userStore.value.photoURL = data[0].photo_url || user.photoURL; // Atualiza a foto do usuário no store
	} else {
		const { data, error } = await supabase.from('users').insert([
			{
				id: user.uid,
				firebase_id: user.uid,
				username: user.displayName,
				photo_url: user.photoURL,
				created_at: new Date()
			}
		]);
	}

	const token = await user.getIdToken(); // Obtém o token de autenticação
	setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias
}
