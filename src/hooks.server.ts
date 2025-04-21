import type { Handle } from '@sveltejs/kit';
// Removendo a importação do userStore pois ele é um store do cliente e não deve ser usado no servidor
// import { userStore } from './stores/userStore.svelte';

// Interfaces
interface DecodedTokenUser {
	name: string;
	email: string;
	picture: string;
	user_id: string;
}

interface TypeErrorValidToken {
	error: string;
	message: string;
	statusCode: number;
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const token = event.cookies.get('authToken');
		
		if (token) {
			try {
				// Verificar token com a API
				const userData = await apiGclaVerifyToken(token);
				
				if ('error' in userData) {
					console.error('Erro na validação do token:', userData.error);
					event.cookies.delete('authToken', { path: '/' });
					event.locals.user = null;
				} else {
					event.locals.user = {
						name: userData.name,
						email: userData.email,
						photoURL: userData.picture,
						userId: userData.user_id
					};
				}
			} catch (error) {
				console.error('Erro ao verificar token:', error);
				event.cookies.delete('authToken', { path: '/' });
				event.locals.user = null;
			}
		} else {
			event.locals.user = null;
		}
	} catch (error) {
		console.error('Erro no hook de autenticação:', error);
		event.locals.user = null;
	}

	const response = await resolve(event);
	
	// Configuração de CORS
	if (event.request.method === 'OPTIONS') {
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	}

	return response;
};

async function apiGclaVerifyToken(token: string): Promise<DecodedTokenUser | TypeErrorValidToken> {
	const headers = {
		'Content-Type': 'application/json',
		authorization: 'Bearer ' + token
	};

	const api_URL = `${process.env.PUBLIC_API_URL}/auth/me`;
	try {
		const response = await fetch(api_URL, {
			method: 'POST',
			headers
		});

		if (!response.ok) {
			return {
				error: 'invalid_token',
				message: 'Token inválido ou expirado',
				statusCode: response.status
			};
		}

		return await response.json();
	} catch (error) {
		console.error('Erro ao verificar token:', error);
		return {
			error: 'api_error',
			message: 'Erro ao comunicar com a API',
			statusCode: 500
		};
	}
}
