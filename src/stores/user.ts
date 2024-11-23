// src/stores/user.ts
import { writable } from 'svelte/store';

export const userName = writable<string | null>(null); // Definindo a variável de nome de usuário
export const userPhotoURL = writable<string | null>(null); // Para a URL da foto
export const userId = writable<string | null>(null); // Para o id do usuário