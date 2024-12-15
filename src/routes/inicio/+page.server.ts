import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('authToken02');
	const token02 = event.cookies.get('authToken');
	if (!!token) {
		event.cookies.set('authToken', token!, { path: '/' });
	} else if (token02) {
		event.cookies.delete('authToken', { path: '/' });
	}

	// if (!event.locals.user.name) {
	// 	return redirect(302, '/login');
	// }
	return {};
};
