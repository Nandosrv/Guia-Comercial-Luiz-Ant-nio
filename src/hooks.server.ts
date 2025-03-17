import type { DecodedTokenUser, TypeErrorValidToken } from '$lib/interfaces/decodedTokenUser';
import type { Handle } from '@sveltejs/kit';
import { userStore } from './stores/userStore.svelte';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('authToken');

	if (!!token) {
		try {
			const decodedToken = await apiGclaVerifyToken(token);

			if ('error' in decodedToken) {
				console.log(decodedToken.error, decodedToken.message);
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
			} else {
				console.log('autenticado ', new Date().toLocaleTimeString());
				event.locals.user = {
					name: decodedToken.name,
					email: decodedToken.email,
					photoURL: decodedToken.picture,
					userId: decodedToken.user_id
				};
			}
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
		}
	} else {
		event.locals.user = {
			name: '',
			email: '',
			photoURL: '',
			userId: ''
		};
	}

	// 🟢 Configuração de CORS
	const response = await resolve(event);
	response.headers.set('Access-Control-Allow-Origin', '*'); // Permitir qualquer domínio (troque por um domínio específico em produção)
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	return response;
};


async function apiGclaVerifyToken(token: string): Promise<DecodedTokenUser | TypeErrorValidToken> {
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
