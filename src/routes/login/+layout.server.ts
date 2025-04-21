// import { redirect } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';

import type { User } from "$lib/types/userStore";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const pathUrl = cookies.get('lastPathUrl');
	const user = locals.user as User;

	return {
		user,
		pathUrl
	};
};

