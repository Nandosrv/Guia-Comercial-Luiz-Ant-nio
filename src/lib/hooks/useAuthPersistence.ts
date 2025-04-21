import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { userStore } from '../../stores/userStore.svelte';
import { getCookie, setCookie } from '$lib/utils/cookies';
import supabase from '$lib/supabaseClient';

/**
 * Hook para garantir persistência de autenticação em toda a aplicação
 */
export const useAuthPersistence = async () => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    
    return new Promise<boolean>((resolve) => {
        // Verificar se já temos um usuário no userStore
        if (userStore.isAuthenticated()) {
            console.log("Autenticação já está ativa no userStore:", userStore.value);
            // Ainda assim, vamos verificar se temos a foto do Supabase
            fetchUserDataFromSupabase(userStore.value.userId);
            resolve(true);
            return;
        }
        
        // Verificar se temos dados salvos no localStorage
        try {
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser && parsedUser.userId && parsedUser.email) {
                    console.log("Restaurando dados de usuário do localStorage");
                    userStore.value = parsedUser;
                    
                    // Verificar se o token ainda é válido
                    const token = getCookie('authToken');
                    if (token) {
                        // Ainda assim, vamos verificar se temos a foto do Supabase
                        fetchUserDataFromSupabase(parsedUser.userId);
                        resolve(true);
                        return;
                    }
                }
            }
        } catch (e) {
            console.error("Erro ao verificar localStorage:", e);
        }
        
        // Se não encontrou no localStorage, verificar o Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe(); // Desinscrever após primeira verificação
            
            if (user) {
                console.log("Usuário autenticado no Firebase:", user.email);
                try {
                    // Obter token atualizado
                    const token = await user.getIdToken(true);
                    // Atualizar o cookie
                    setCookie('authToken', token, 7);
                    
                    // Atualizar userStore com dados básicos do Firebase
                    userStore.value = {
                        name: user.displayName || '',
                        email: user.email || '',
                        photoURL: user.photoURL || '',
                        userId: user.uid || '',
                        plan: ''
                    };
                    
                    // Buscar dados complementares do Supabase (incluindo foto)
                    await fetchUserDataFromSupabase(user.uid);
                    
                    // Marcar que a persistência foi restaurada
                    localStorage.setItem('auth_persistence_restored', new Date().toISOString());
                    
                    resolve(true);
                } catch (error) {
                    console.error("Erro ao restaurar autenticação:", error);
                    resolve(false);
                }
            } else {
                console.log("Nenhum usuário autenticado no Firebase");
                resolve(false);
            }
        });
        
        // Timeout de segurança para evitar bloqueio
        setTimeout(() => {
            resolve(false);
        }, 3000);
    });
};

/**
 * Busca dados do usuário no Supabase para complementar as informações do Firebase
 */
async function fetchUserDataFromSupabase(userId: string) {
    if (!userId) return;
    
    try {
        console.log("Buscando dados do usuário no Supabase:", userId);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) {
            console.error("Erro ao buscar dados do Supabase:", error);
            return;
        }
        
        if (data) {
            console.log("Dados do Supabase encontrados:", data);
            // Atualizar userStore com os dados do Supabase, mantendo os dados existentes
            userStore.update({
                photoURL: data.photo_url || userStore.value.photoURL,
                username: data.username || userStore.value.username
            });
            console.log("UserStore atualizado com dados do Supabase:", userStore.value);
        } else {
            console.log("Nenhum dado encontrado no Supabase para o usuário:", userId);
        }
    } catch (error) {
        console.error("Erro ao acessar dados do Supabase:", error);
    }
}

/**
 * Verifica síncrono se há um usuário autenticado
 */
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    
    // Verificar primeiro o userStore
    if (userStore.isAuthenticated()) {
        return true;
    }
    
    // Verificar localStorage
    try {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser && parsedUser.userId && parsedUser.email) {
                return true;
            }
        }
    } catch (e) {
        // Ignorar erros
    }
    
    // Verificar Firebase (última alternativa)
    return !!auth.currentUser;
}; 