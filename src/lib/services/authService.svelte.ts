import { auth } from '$lib/firebase/client';
import supabase from '$lib/supabaseClient';
import type { User as UserStore } from '$lib/types/userStore';
import { deleteCookie, setCookie } from '$lib/utils/cookies';
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type User as UserAuth
} from 'firebase/auth';
import { userStore } from '../../stores/userStore.svelte';

// Login com Google
export const loginWithGoogle = async (): Promise<UserAuth | null> => {
	const provider = new GoogleAuthProvider();

	const { user } = await signInWithPopup(auth, provider);
	if (!user) {
		throw new Error('Erro ao fazer login com Google');
	}
	await persistenciaUser(user as never, false);

	return user;
	// return null;
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
			userId: '',
			plan: ''
		};
	} catch (error) {
		console.error('Erro ao deslogar:', error);
		throw error;
	}
};

// Escutar mudanças no estado do usuário
export const subscribeToAuthState = async (callback: (user: UserAuth | null) => void) => {
	onAuthStateChanged(auth, callback);
};

// Obter o usuário autenticado
export const getCurrentUser = (): UserAuth | null => {
	return auth.currentUser;
};

export const checkAuthState = ({ reloadPage }: { reloadPage?: false }): void => {
	onAuthStateChanged(auth, async (user) => {
		if (user && !reloadPage) {
			// Usuário está autenticado
			const token = await user.getIdToken();
			// console.log('Token revalidado:', token);

			// Atualizar o token no cookie, se necessário
			token && (document.cookie = `authToken=${token}; path=/; max-age=3600`);
		} else {
			console.log('Usuário não autenticado');
		}
	});
};

export async function persistenciaUser(user: UserAuth & UserStore, reloadPage = false) {
	if (user.emailVerified) {
		//
		const tt = await user?.getIdToken();
		const headers = {
			'Content-Type': 'application/json',
			authorization: 'Bearer ' + tt
		};

		const api_URL = `${process.env.PUBLIC_API_URL}/auth/me`;

		const responseData = await fetch(api_URL, {
			method: 'POST',
			headers
		});

		if (responseData.status === 401) {
			console.log('Usuário não autenticado');
			logout();
			throw Error(responseData.statusText);
		}
	}

	if (Object.values(userStore.value).filter((v) => v).length === 0) {
		userStore.value.name = user?.displayName || user?.name || '';
		userStore.value.userId = user?.uid || user?.userId || '';
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', user?.uid || user?.userId);

		if (data && data.length > 0) {
			userStore.value.photoURL = data[0]?.photo_url || user.photoURL; // Atualiza a foto do usuário no store
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
	}
	user.emailVerified &&
		(await user?.getIdToken().then((token) => {
			setCookie('authToken', token, 7); // Salva o token no cookie por 7 dias
		})); // Obtém o token de autenticação
}
