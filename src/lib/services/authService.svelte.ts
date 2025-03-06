import { auth } from '$lib/firebase/client';
import supabase from '$lib/supabaseClient';
import type { User as UserStore } from '$lib/types/userStore';
import { deleteCookie, setCookie } from '$lib/utils/cookies';
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signInWithEmailAndPassword,
	signOut,
	type User as UserAuth
} from 'firebase/auth';
import { userStore } from '../../stores/userStore.svelte';
import { goto } from '$app/navigation';

// Login com Google
export const loginWithGoogle = async (): Promise<UserAuth | null> => {
	const provider = new GoogleAuthProvider();

	const { user } = await signInWithPopup(auth, provider);
	if (!user) {
		throw new Error('Erro ao fazer login com Google');
	}
	await persistenciaUser(user as never, false);

	// Redirect to the profile page after login
	goto('/perfil');

	return user;
};

// Logout
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

// Subscribe to user auth state changes
export const subscribeToAuthState = (callback: (user: UserAuth | null) => void): void => {
	onAuthStateChanged(auth, callback);
};

// Retrieve the currently authenticated user
export const getCurrentUser = (): UserAuth | null => {
	return auth.currentUser;
};

// Check the authentication state
export const checkAuthState = ({ reloadPage }: { reloadPage?: false }): void => {
	onAuthStateChanged(auth, async (user) => {
	  if (user) {
		const token = await user.getIdToken();
		if (token) {
		  document.cookie = `authToken=${token}; path=/; max-age=3600`;
		}
	  } else {
		console.log('Usuário não autenticado 01');
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
			console.log('Usuário não autenticado ');
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
			userStore.value.photoURL = data[0]?.photo_url || user.photoURL;
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
	user.email &&
		(await user?.getIdToken().then((token) => {
			setCookie('authToken', token, 7);
		}));
}