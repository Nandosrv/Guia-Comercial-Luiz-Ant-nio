import { authAdmin } from '$lib/firebase/admin';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('authToken');

	if (token) {
		try {
			const decodedToken = await authAdmin.verifyIdToken(token);
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
}
