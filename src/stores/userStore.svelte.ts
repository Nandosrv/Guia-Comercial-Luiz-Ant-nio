import type { User } from '$lib/types/userStore';

const user: User = {
	name: '',
	email: '',
	photoURL: '',
	userId: ''
};

class UserStore {
	#value = $state<User>(user);
	get value() {
		return this.#value;
	}
	set value(value: User) {
		this.#value = value;
	}
}
export const userStore = new UserStore();
// Atualizar automaticamente o estado do usuário
