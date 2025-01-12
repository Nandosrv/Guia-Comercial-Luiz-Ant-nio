import type { User } from '$lib/types/userStore';

export const user: User = {
    name: '',
    email: '',
    photoURL: null,
    userId: '',
    username: '',
    plan: ''
};

class UserStore {
    #value = $state<User>(user);
    
    get value() {
        return this.#value;
    }
    
    set value(value: User) {
        this.#value = { ...this.#value, ...value };
    }

    update(data: Partial<User>) {
        this.#value = { ...this.#value, ...data };
    }
}

export const userStore = new UserStore();
// Atualizar automaticamente o estado do usuário
