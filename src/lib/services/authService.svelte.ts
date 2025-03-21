import { auth } from '$lib/firebase/client';
import supabase from '$lib/supabaseClient';
import type { User, User as UserStore } from '$lib/types/userStore';
import { deleteCookie, setCookie, getCookie } from '$lib/utils/cookies';
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signInWithEmailAndPassword,
	signOut,
	type User as UserAuth,
	getAuth
} from 'firebase/auth';
import { userStore } from '../../stores/userStore.svelte';
import { goto } from '$app/navigation';

// Login com Google
export const loginWithGoogle = async (): Promise<UserAuth | null> => {
	const provider = new GoogleAuthProvider();

	const { user } = await signInWithPopup(auth, provider);
	if (!user) {
		throw new Error('Erro ao fazer login com Google');
	}
	await persistenciaUser(user as never, false);

	// Redirect to the profile page after login
	goto('/perfil');

	return user;
};

// Logout
export const logout = async (): Promise<void> => {
	try {
		// Deslogar do Firebase Auth
		await signOut(auth);
		
		// Limpar todos os cookies relacionados
		deleteCookie('authToken');
		deleteCookie('userId');
		deleteCookie('userPhotoURL');
		deleteCookie('userName');
		deleteCookie('lastPathUrl');
		
		// Limpar localStorage
		localStorage.removeItem('user_data');
		localStorage.removeItem('user_auth_state');
		localStorage.removeItem('user_auth_timestamp');

		// Usar o método clear do userStore
		userStore.clear();
		
		console.log('Logout completo realizado');
	} catch (error) {
		console.error('Erro ao deslogar:', error);
		throw error;
	}
};

// Subscribe to user auth state changes
export const subscribeToAuthState = (callback: (user: UserAuth | null) => void): void => {
	onAuthStateChanged(auth, callback);
};

// Retrieve the currently authenticated user
export const getCurrentUser = (): UserAuth | null => {
	return auth.currentUser;
};

// Check the authentication state
export const checkAuthState = ({ reloadPage }: { reloadPage?: boolean } = {}): void => {
	// Verificar primeiro se há um token válido no cookie
	const authToken = getCookie('authToken');
	
	// Configurar listener para mudanças de autenticação
	onAuthStateChanged(auth, async (user) => {
		console.log("Estado de autenticação alterado:", user ? "Usuário autenticado" : "Usuário não autenticado");
		
		if (user) {
			try {
				// Obter o token atualizado - forçando refresh se necessário
				const token = await user.getIdToken(true);
				
				// Atualizar o cookie com o novo token
				setCookie('authToken', token, 7);
				
				// Buscar dados completos do usuário
				const userData = await fetchUserData(token);
				
				if (userData) {
					// Atualizar userStore com dados completos
					userStore.value = {
						name: userData?.name || user.displayName || '',
						email: userData?.email || user.email || '',
						photoURL: userData?.picture || user.photoURL || '',
						userId: userData?.user_id || user.uid || '',
						plan: userData?.plan || ''
					};
					
					console.log("Autenticação restaurada:", userStore.value);
					
					// Armazenar outros dados no localStorage para maior persistência
					localStorage.setItem('user_auth_state', JSON.stringify({
						isAuthenticated: true,
						lastAuthTime: new Date().toString()
					}));
				} else {
					// Se não conseguir dados da API, usar dados básicos do Firebase
					userStore.value = {
						name: user.displayName || '',
						email: user.email || '',
						photoURL: user.photoURL || '',
						userId: user.uid || ''
					};
				}
				
				// Recarregar a página se necessário
				if (reloadPage) {
					window.location.reload();
				}
			} catch (error) {
				console.error('Erro ao verificar o estado de autenticação:', error);
			}
		} else {
			console.log('Usuário não autenticado 03');
			
			// Se não há usuário autenticado mas existe token nos cookies, tentar restaurar
			if (authToken) {
				// Tentar validar o token existente
				try {
					const userData = await fetchUserData(authToken);
					if (userData) {
						// Token ainda é válido, manter os dados do usuário
						userStore.value = {
							name: userData?.name || '',
							email: userData?.email || '',
							photoURL: userData?.picture || '',
							userId: userData?.user_id || '',
							plan: userData?.plan || ''
						};
						console.log("Sessão restaurada via token:", userStore.value);
						return;
					}
					// Se chegou aqui, token é inválido
					deleteCookie('authToken');
				} catch (e) {
					console.error("Erro ao validar token:", e);
					deleteCookie('authToken');
				}
			}
			
			// Limpar userStore se não tem autenticação
			userStore.value = {
				name: '',
				email: '',
				photoURL: '',
				userId: '',
				plan: ''
			};
			
			// Limpar estado no localStorage
			localStorage.removeItem('user_auth_state');
		}
	});
};

// Função auxiliar para buscar dados do usuário da API
async function fetchUserData(token: string) {
	try {
		const headers = {
			'Content-Type': 'application/json',
			authorization: 'Bearer ' + token
		};

		const api_URL = `${process.env.PUBLIC_API_URL}/auth/me`;

		const response = await fetch(api_URL, {
			method: 'POST',
			headers
		});
		
		if (response.status === 401) {
			return null;
		}
		
		if (response.ok) {
			return await response.json();
		}
		
		return null;
	} catch (error) {
		console.error("Erro ao buscar dados do usuário:", error);
		return null;
	}
}

export async function persistenciaUser(user: UserAuth, reloadPage = false) {
	if (!user) {
		console.error("Usuário não fornecido para persistenciaUser");
		return;
	}

	try {
		// Verificar se já temos informações suficientes no userStore
		const currentStoreUser = userStore.value;
		if (currentStoreUser && currentStoreUser.userId && currentStoreUser.email) {
			console.log("UserStore já possui dados válidos:", currentStoreUser);
			// Se já temos dados e não é necessário recarregar, retornar
			if (!reloadPage) return;
		}
		
		// Obter token atualizado
		let token = '';
		try {
			token = await user.getIdToken(true);
			// Salvar token atualizado
			if (token) {
				setCookie('authToken', token, 7);
			}
		} catch (error) {
			console.error("Erro ao obter token:", error);
		}

		// Preencher o userStore com os dados disponíveis primeiro
		userStore.value = {
			name: user?.displayName || currentStoreUser?.name || '',
			email: user?.email || currentStoreUser?.email || '',
			photoURL: user?.photoURL || currentStoreUser?.photoURL || '',
			userId: user?.uid || currentStoreUser?.userId || '',
			plan: currentStoreUser?.plan || ''
		};
		
		// Verificar dados no Supabase (apenas se tivermos um ID)
		if (userStore.value.userId) {
			try {
				console.log("Buscando dados no Supabase para ID:", userStore.value.userId);
				const { data, error } = await supabase
					.from('users')
					.select('*')
					.eq('id', userStore.value.userId)
					.single();
					
				if (error && error.code !== 'PGRST116') { // Ignorar erro "não encontrado"
					console.error("Erro ao buscar usuário no Supabase:", error);
				}
					
				if (data) {
					// Atualizar dados do userStore com informações do Supabase
					console.log("Dados encontrados no Supabase:", data);
					userStore.update({
						photoURL: data?.photo_url || userStore.value.photoURL,
						username: data?.username || userStore.value.username
					});
					console.log("UserStore atualizado com dados do Supabase:", userStore.value);
				} else if (user.uid) {
					// Criar usuário no Supabase se não existir
					console.log("Criando usuário no Supabase");
					const { error: insertError } = await supabase.from('users').insert([
						{
							id: user.uid,
							firebase_id: user.uid,
							username: user.displayName || '',
							photo_url: user.photoURL,
							created_at: new Date()
						}
					]);
					
					if (insertError) {
						console.error("Erro ao criar usuário no Supabase:", insertError);
					} else {
						console.log("Usuário criado com sucesso no Supabase");
					}
				}
			} catch (error) {
				console.error("Erro ao acessar Supabase:", error);
			}
		}
		
		// Se temos token e o e-mail é verificado, validar com a API
		if (token && user.emailVerified) {
			try {
				const headers = {
					'Content-Type': 'application/json',
					authorization: 'Bearer ' + token
				};

				const api_URL = `${process.env.PUBLIC_API_URL}/auth/me`;
				const response = await fetch(api_URL, {
					method: 'POST',
					headers
				});
				
				if (response.status === 401) {
					console.log('Usuário não autenticado - API rejeitou');
					throw Error(response.statusText);
				}
				
				if (response.ok) {
					const userData = await response.json();
					// Atualizar o userStore com os dados retornados da API, mantendo a foto do Supabase se existir
					const currentPhotoURL = userStore.value.photoURL;
					userStore.value = {
						...userStore.value,
						name: userData?.name || userStore.value.name,
						email: userData?.email || userStore.value.email,
						photoURL: currentPhotoURL || userData?.picture || userStore.value.photoURL,
						userId: userData?.user_id || userStore.value.userId,
						plan: userData?.plan || userStore.value.plan
					};
					console.log("Dados do usuário atualizados da API, mantendo foto do perfil");
				}
			} catch (error) {
				console.error("Erro ao validar com API:", error);
				// Se falhar aqui, confiar nos dados locais
			}
		}
		
		// Registrar timestamp para debugging
		localStorage.setItem('user_auth_timestamp', new Date().toString());
		console.log("Persistência concluída:", userStore.value);
		
		// Recarregar a página se solicitado
		if (reloadPage) {
			window.location.reload();
		}
	} catch (error) {
		console.error('Erro durante a persistência do usuário:', error);
		throw error;
	}
}