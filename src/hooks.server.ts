import type { DecodedTokenUser } from '$lib/interfaces/decodedTokenUser';
import type { Handle } from '@sveltejs/kit';
import { userStore } from './stores/userStore.svelte';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('authToken');

	if (!!token) {
		try {
			const decodedToken = await apiGclaVerifyToken(token);
			if (!decodedToken) {
				event.locals.user = {
					name: '',
					email: '',
					photoURL: '',
					userId: ''
				};
				userStore.value = {
					name: '',
					email: '',
					photoURL: '',
					userId: ''
				};
				event.cookies.delete('authToken', { path: '/' });
			}
			console.log('autenticado');
			event.locals.user = {
				name: decodedToken.name,
				email: decodedToken.email,
				photoURL: decodedToken.picture,
				userId: decodedToken.user_id
			};
		} catch {
			event.locals.user = {
				name: '',
				email: '',
				photoURL: '',
				userId: ''
			};
			userStore.value = {
				name: '',
				email: '',
				photoURL: '',
				userId: ''
			};
			event.cookies.delete('authToken', { path: '/' });
			console.log('Erro ao verificar o token');
		} finally {
			// console.log('event.locals.user: ', event.locals.user);
		}
	} else {
		event.locals.user = {
			name: '',
			email: '',
			photoURL: '',
			userId: ''
		};
	}

	return resolve(event);
};

async function apiGclaVerifyToken(token: string): Promise<DecodedTokenUser> {
	const headers = {
		'Content-Type': 'application/json',
		authorization: 'Bearer ' + token
	};

	const api_URL = `${process.env.PUBLIC_API_URL}/auth/me`;
	const responseData = await fetch(api_URL, {
		method: 'POST',
		headers
	})
		.then(async (response) => {
			if (!response.ok) {
				// throw new Error('Erro ao verificar o token');
			}
			return response.json();
		})
		.catch((error) => {
			console.error('====================================');
			console.error('error: ', error);
			console.error('====================================');
		});

	return responseData;
}
