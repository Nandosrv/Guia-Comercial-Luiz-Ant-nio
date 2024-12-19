import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const pathUrl = cookies.get('lastPathUrl');
	const user = locals.user;

	return {
		user,
		pathUrl
	};
};
