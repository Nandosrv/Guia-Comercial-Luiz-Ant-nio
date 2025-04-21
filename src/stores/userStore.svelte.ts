import type { User } from '$lib/types/userStore';

// Usuário padrão vazio
export const emptyUser: User = {
    name: '',
    email: '',
    photoURL: null,
    userId: '',
    username: '',
    plan: ''
};

// Exportando user para manter compatibilidade com código existente
export const user: User = emptyUser;

// Tentar recuperar do localStorage ao inicializar
const getSavedUser = (): User => {
    if (typeof localStorage !== 'undefined') {
        try {
            const savedUser = localStorage.getItem('user_data');
            if (savedUser) {
                return JSON.parse(savedUser);
            }
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
        }
    }
    return emptyUser;
};

class UserStore {
    #value = $state<User>(getSavedUser());
    
    get value() {
        return this.#value;
    }
    
    set value(value: User) {
        this.#value = { ...this.#value, ...value };
        // Persistir no localStorage
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('user_data', JSON.stringify(this.#value));
                console.log("UserStore já possui dados válidos:", this.#value);
            } catch (e) {
                console.error('Erro ao salvar no localStorage:', e);
            }
        }
    }

    update(data: Partial<User>) {
        this.value = { ...this.#value, ...data };
    }

    clear() {
        this.#value = emptyUser;
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('user_data');
        }
    }

    isAuthenticated() {
        return !!this.#value.userId && !!this.#value.email;
    }
}

export const userStore = new UserStore();

// Inicialização para verificar se temos dados salvos
if (typeof window !== 'undefined') {
    const authState = localStorage.getItem('user_auth_state');
    if (authState) {
        console.log('Estado de autenticação anterior encontrado');
    }
}

// Atualizar automaticamente o estado do usuário
