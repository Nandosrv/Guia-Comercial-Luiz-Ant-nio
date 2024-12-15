import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const pathUrl = cookies.get('lastPathUrl');
	//Verifica se o usuário está autenticado
	const user = locals.user;
	// console.log('load server principal', user);
	// if (!user.name) {
	// Redireciona para a página de login se não estiver autenticado
	// throw redirect(302, '/login');
	// }
	return {
		user,
		pathUrl
	};
};
