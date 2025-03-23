<script lang="ts">
	import Logout from '$lib/componets/Logout.svelte';
	import Footer from '$lib/footer/+page.svelte';
	import camera from '$lib/images/icons8-câmera-50.png';
	import { uploadProfilePicture } from '$lib/services/uploadSupabase';
	import supabase from '../../lib/supabaseClient';
	import { user, userStore } from '../../stores/userStore.svelte.js';
	import { fade, slide } from 'svelte/transition';
	import { getAuth, updateProfile } from 'firebase/auth';

	import { goto } from '$app/navigation';

	// Estados
	let isSaving = $state(false);
	let currentUser = $derived(userStore.value);

	let showPhotoModal = $state(false);
	// svelte-ignore state_referenced_locally
	let userBio = $state(currentUser.bio || '');
	// svelte-ignore state_referenced_locally
	let username = $state(currentUser.username || '');
	// console.log(username);
	// svelte-ignore state_referenced_locally
	let userPlan = $state(currentUser.plan || '');
	let isEditingBio = $state(false);

	let activeTab = $state('profile'); // profile, statistics, settings
	let showPlanModal = $state(false);
	let loading = $state(false);

	// Estatísticas mock - substituir por dados reais
	const statistics = {
		views: 1234,
		leads: 89,
		rating: 4.8,
		reviews: 32,
		lastMonth: {
			views: 320,
			leads: 15
		}
	};

	const plans = [
		{
			id: 1,
			name: 'Básico',
			price: 'Grátis',
			billing: 'mensal',
			features: ['Perfil básico', 'Listagem simples', 'Estatísticas básicas', 'Suporte por email'],
			recommended: false
		},
		{
			id: 2,
			name: 'Profissional',
			price: 'R$ 49,90',
			billing: 'mensal',
			features: [
				'Perfil destacado',
				'Listagem premium',
				'Estatísticas avançadas',
				'Suporte prioritário',
				'Leads ilimitados',
				'Personalização avançada'
			],
			recommended: true
		},
		{
			id: 3,
			name: 'Empresarial',
			price: 'R$ 99,90',
			billing: 'mensal',
			features: [
				'Tudo do Profissional',
				'API exclusiva',
				'Gerenciamento multi-usuário',
				'Relatórios personalizados',
				'Suporte 24/7',
				'Consultoria mensal'
			],
			recommended: false
		}
	];

	// Funções
	async function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;
		if (file) {
			try {
				isSaving = true;
				const newPhotoURL = await uploadProfilePicture(file, currentUser.userId);

				if (newPhotoURL) {
					const { error } = await supabase
						.from('users')
						.update({ photo_url: newPhotoURL, updated_at: new Date().toISOString() })
						.eq('id', currentUser.userId);
					// console.log(newPhotoURL);
					if (error) throw error;
					currentUser.photoURL = newPhotoURL;
					showPhotoModal = false;
				}
			} catch (error) {
				console.error(error);
				alert('Erro ao atualizar a foto!');
			} finally {
				isSaving = false;
			}
		}
	}

	async function updateBio() {
		try {
			loading = true;
			const { data, error } = await supabase
				.from('users')
				.update({
					bio: userBio,
					updated_at: new Date().toISOString()
				})
				.eq('id', currentUser.userId)
				.select();

			if (error) throw error;

			// Update local state
			currentUser.bio = userBio;
			isEditingBio = false;
		} catch (error) {
			console.error(error);
			alert('Erro ao atualizar a bio!');
		} finally {
			loading = false;
		}
	}

	function changePlan(planId: number) {
		// Implementar lógica de mudança de plano
		showPlanModal = true;
	}
	// Adicione esses estados junto com os outros estados no início do arquivo
	let settingsState = $state({
		emailNotifications: false,
		whatsappNotifications: false,
		publicProfile: true,
		showStatistics: true
	});

	// Adicione essa função junto com as outras funções
	async function saveSettings() {
		try {
			loading = true;
			const { error } = await supabase.from('user_settings').upsert({
				user_id: currentUser.userId,
				...settingsState,
				updated_at: new Date().toISOString()
			});

			if (error) throw error;
			alert('Configurações salvas com sucesso!');
		} catch (error) {
			console.error('Erro ao salvar configurações:', error);
			alert('Erro ao salvar configurações!');
		} finally {
			loading = false;
		}
	}

	// Adicione essa função para carregar as configurações
	async function loadUserData() {
		try {
			const auth = getAuth();

			// console.log("auth",auth);
			const firebaseUser = auth.currentUser;
			// console.log("firebaseUser",firebaseUser);
			if (!firebaseUser?.uid) {
				console.log('Usuário não autenticado 03');
				return;
			}

			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('firebase_id', firebaseUser.uid)
				.single();

			if (error) {
				if (error.code === 'PGRST116') {
					console.log('Nenhum usuário encontrado com este Firebase ID');
					return;
				}
				throw error;
			}

			if (data) {
				// Atualiza todos os dados locais com os dados do Supabase
				currentUser.name = data.username || currentUser.name;
				currentUser.bio = data.bio || '';
				currentUser.plan = data.plan || 'Básico';
				currentUser.whatsapp = data.whatsapp || '';
				currentUser.email = data.email;
				currentUser.userId = data.firebase_id; // Importante: armazena o firebase_id

				// Atualiza o userBio local
				userBio = data.bio || '';

				// Atualiza o store
				userStore.update((current: any) => ({
					...current,
					name: data.username || current.name,
					bio: data.bio || '',
					whatsapp: data.whatsapp || '',
					plan: data.plan || 'Básico',
					userId: data.firebase_id
				}));
			}
		} catch (error) {
			console.error('Erro ao carregar dados do usuário:', error);
		}
	}
	let getCurrentUser = $derived(userStore.value);

	// Chame essa função junto com as outras inicializações
	loadUserData();
	// Add this to your script section with other state variables
	let showEditModal = $state(false);
	// In your User type definition
	interface User {
		// ... other fields
		whatsapp?: string;
	}

	async function editProfile() {
		try {
			loading = true;

			const auth = getAuth();
			const firebaseUser = auth.currentUser;

			if (!firebaseUser?.uid) {
				throw new Error('Usuário não autenticado 04');
			}

			// Atualiza no Supabase
			const { error: supabaseError } = await supabase
				.from('users')
				.update({
					username: currentUser.name,
					bio: userBio,
					whatsapp: currentUser.whatsapp,
					updated_at: new Date().toISOString()
				})
				.eq('firebase_id', firebaseUser.uid);

			if (supabaseError) throw supabaseError;

			// ... resto do código permanece igual
		} catch (err: any) {
			console.error('Erro ao atualizar perfil:', err);
			alert(`Erro ao atualizar o perfil: ${err.message}`);
		} finally {
			loading = false;
		}
	}
	// function dispatch(arg0: string, arg1: { name: string; whatsapp: any; bio: string; }) {
	// 	throw new Error('Function not implemented.');
	// }
	let isComerciante = false;
  const apiUrl = 'http://localhost:3000';

  let isLoading = false
  // Função chamada ao clicar no botão "Sou Comerciante"
  const handleComerciante = async () => {
  if (!currentUser || !currentUser.userId) {
    console.error('Usuário não está autenticado corretamente.');
    alert('Erro: usuário não autenticado.');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/painel/meu-comercio/${currentUser.userId}`, { // <--- Verifique se userId está definido
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.isComerciante) {
      goto('/formulario-comercio');
    } else {
      alert('Você ainda não tem um comércio cadastrado. Vamos cadastrar agora!');
      goto('/formulario-comercio');
    }
  } catch (error) {
    console.error('Erro ao verificar comerciante:', error);
    alert('Erro ao verificar comerciante. Tente novamente.');
  }
};

// console.log('Usuário atual:', currentUser);
// console.log('Verificando comerciante para userId:', currentUser.userId);


</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
	<!-- Navegação superior -->
	<!-- <div class="bg-blue-600 shadow-md py-3 px-4 flex items-center justify-between mb-4">
		<div class="flex items-center">
			<a href="/" class="text-white text-xl font-bold">GuiaComercial</a>
		</div>
		
		<div class="flex items-center space-x-4">
			<div class="relative">
				<a href="/notificacoes" class="text-white hover:text-blue-200">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
				</a>
			</div>
			
			<div class="relative">
				<a href="/mensagens" class="text-white hover:text-blue-200">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
					</svg>
				</a>
			</div>
			
			<div class="flex items-center">
				<div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
					{#if currentUser.photoURL}
						<img src={currentUser.photoURL} alt="Perfil" class="w-full h-full object-cover" />
					{:else}
						<div class="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xl">
							{currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div> -->

	<!-- Navegação secundária para seções do perfil - estilo Facebook -->
	<div class="bg-white shadow">
		<div class="container mx-auto px-4">
			<div class="flex overflow-x-auto">
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					class:active={activeTab === 'profile'}
					class="px-6 py-4 text-sm font-medium border-b-2 hover:border-blue-600 transition-all whitespace-nowrap text-gray-500 {activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent'}"
					on:click={() => (activeTab = 'profile')}
				>
					<span class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Perfil
					</span>
				</button>

				<!-- svelte-ignore event_directive_deprecated -->
				 <!-- Estatísticas -->
				<!-- <button
					class:active={activeTab === 'statistics'}
					class="px-6 py-4 text-sm font-medium border-b-2 hover:border-blue-600 transition-all whitespace-nowrap text-gray-500 {activeTab === 'statistics' ? 'border-blue-600 text-blue-600' : 'border-transparent'}"
					on:click={() => (activeTab = 'statistics')}
				>
					<span class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						Estatísticas
					</span>
				</button> -->

				<!-- svelte-ignore event_directive_deprecated -->
				<button
					class:active={activeTab === 'settings'}
					class="px-6 py-4 text-sm font-medium border-b-2 hover:border-blue-600 transition-all whitespace-nowrap text-gray-500 {activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent'}"
					on:click={() => (activeTab = 'settings')}
				>
					<span class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Configurações
					</span>
				</button>
				
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					class:active={activeTab === 'informacoes'}
					class="px-6 py-4 text-sm font-medium border-b-2 hover:border-blue-600 transition-all whitespace-nowrap text-gray-500 {activeTab === 'informacoes' ? 'border-blue-600 text-blue-600' : 'border-transparent'}"
					on:click={() => (activeTab = 'informacoes')}
				>
					<span class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Informações
					</span>
				</button>

				<!-- svelte-ignore event_directive_deprecated -->
				<button
					class="px-6 py-4 text-sm font-medium border-b-2 hover:border-blue-600 transition-all whitespace-nowrap text-gray-500 border-transparent"
					on:click={handleComerciante}
				>
					<span class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						Meu Comércio
					</span>
				</button>
				<div class="ml-auto flex items-center">
					<Logout />
				</div>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-6">
		{#if activeTab === 'profile'}
			<div in:fade>
				<!-- Profile Card - Estilo Facebook -->
				<div class="rounded-xl bg-white shadow-sm overflow-hidden">
					<!-- Capa do perfil (Cover) -->
					<div class="relative h-80 bg-gradient-to-r from-blue-400 to-indigo-600">
						<!-- <button class="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-700 rounded-md px-3 py-1.5 text-sm font-medium flex items-center hover:bg-opacity-100 transition">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Editar capa
						</button> -->
					</div>
					
					<!-- Área de perfil com foto e informações básicas -->
					<div class="relative px-6 pb-6">
						<div class="-mt-20 flex flex-col md:flex-row md:items-end md:justify-between">
							<div class="flex flex-col md:flex-row md:items-end">
								<div class="relative">
									<img
										src={currentUser.photoURL || 'https://via.placeholder.com/160'}
										alt={currentUser.name}
										class="h-40 w-40 rounded-full border-4 border-white object-cover shadow-md"
									/>
									<!-- svelte-ignore event_directive_deprecated -->
									<!-- svelte-ignore event_directive_deprecated -->
									<button
										class="absolute bottom-2 right-2 rounded-full bg-gray-100 p-2 shadow-lg hover:bg-gray-200"
										on:click={() => (showPhotoModal = true)}
									>
										<img src={camera} alt="Alterar foto" class="h-5 w-5" />
									</button>
								</div>
								<div class="mt-4 md:ml-6 md:mt-0">
									<h1 class="text-3xl font-bold text-gray-900">{currentUser.name || 'Seu Nome'}</h1>
									<p class="text-gray-600 mt-1">{currentUser.plan || 'Plano Básico'}</p>
									<p class="text-blue-600 font-medium mt-1 flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
										Perfil verificado
									</p>
								</div>
							</div>
							
							<div class="mt-6 md:mt-0 flex space-x-3">
								<!-- svelte-ignore event_directive_deprecated -->
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
									on:click={() => (showEditModal = true)}
								>
									Editar Perfil
								</button>
								<!-- svelte-ignore event_directive_deprecated -->
								<button 
									class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 flex items-center"
									on:click={() => (showPlanModal = true)}
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
									Atualizar Plano
								</button>
							</div>
						</div>
						{#if showEditModal}
							<div
								class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
								transition:fade
							>
								<div class="mx-4 w-[500px] max-w-full rounded-xl bg-white p-6" in:slide>
									<!-- Modal Header -->
									<div class="mb-6 flex items-center justify-between">
										<h3 class="text-xl font-bold">Editar Perfil</h3>
										<!-- svelte-ignore a11y_consider_explicit_label -->
										<!-- svelte-ignore event_directive_deprecated -->
										<button
											class="text-gray-500 hover:text-gray-700"
											on:click={() => (showEditModal = false)}
										>
											<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</div>

									<!-- Modal Content -->
									<div class="space-y-4">
										<!-- Nome -->
										<div>
											<label for="edit-name" class="mb-1 block text-sm font-medium text-gray-700">
												Nome Completo
											</label>
											<input
												type="text"
												id="edit-name"
												bind:value={currentUser.name}
												class="w-full rounded-lg border border-gray-300 px-3 py-2 text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-secondary"
												placeholder="Seu nome completo"
											/>
										</div>

										<!-- Email -->
										<div>
											<label for="edit-email" class="mb-1 block text-sm font-medium text-gray-700">
												Email
											</label>
											<input
												type="email"
												id="edit-email"
												bind:value={currentUser.email}
												class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-secondary-foreground dark:text-secondary"
												disabled
											/>
											<p class="mt-1 text-sm text-gray-500">O email não pode ser alterado</p>
										</div>

										<!-- Bio -->
										<div>
											<label for="edit-bio" class="mb-1 block text-sm font-medium text-gray-700">
												Biografia
											</label>
											<textarea
												id="edit-bio"
												bind:value={userBio}
												class="w-full rounded-lg border border-gray-300 px-3 py-2 text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-secondary"
												rows="4"
												placeholder="Fale um pouco sobre você ou seu negócio..."
											></textarea>
										</div>

										<!-- WhatsApp -->
										<div>
											<label
												for="edit-whatsapp"
												class="mb-1 block text-sm font-medium text-gray-700"
											>
												WhatsApp
											</label>
											<input
												type="tel"
												id="edit-whatsapp"
												bind:value={currentUser.whatsapp}
												class="w-full rounded-lg border border-gray-300 px-3 py-2 text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-secondary"
												placeholder="(00) 00000-0000"
											/>
										</div>
									</div>

									<!-- Modal Footer -->
									<div class="mt-6 flex justify-end space-x-3 border-t pt-6">
										<!-- svelte-ignore event_directive_deprecated -->
										<button
											class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
											on:click={() => (showEditModal = false)}
											disabled={loading}
										>
											Cancelar
										</button>
										<!-- svelte-ignore event_directive_deprecated -->
										<button
											class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
											on:click={editProfile}
											disabled={loading}
										>
											{loading ? 'Salvando...' : 'Salvar Alterações'}
										</button>
									</div>
								</div>
							</div>
						{/if}

						<!-- Navegação dentro do perfil -->
						<div class="mt-6 border-t border-b border-gray-200 -mx-6 px-6">
							<div class="flex overflow-x-auto py-3 space-x-8">
								<a href="#sobre" class="font-medium text-blue-600 whitespace-nowrap border-b-2 border-blue-600 py-3">Sobre</a>
								<a href="#publicacoes" class="font-medium text-gray-500 whitespace-nowrap hover:text-gray-900 py-3">Publicações</a>
								<a href="#fotos" class="font-medium text-gray-500 whitespace-nowrap hover:text-gray-900 py-3">Fotos</a>
								<a href="#avaliacoes" class="font-medium text-gray-500 whitespace-nowrap hover:text-gray-900 py-3">Avaliações</a>
								<a href="#contato" class="font-medium text-gray-500 whitespace-nowrap hover:text-gray-900 py-3">Contato</a>
							</div>
						</div>

						<!-- Bio e informações -->
						<div class="mt-6" id="sobre">
							<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<!-- Coluna de informações -->
								<div class="lg:col-span-1">
									<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
										<h3 class="text-lg font-semibold mb-4 text-gray-900 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											Informações
										</h3>
										<ul class="space-y-3">
											{#if currentUser.email}
											<li class="flex items-start">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
												<span class="text-gray-700">{currentUser.email}</span>
											</li>
											{/if}
											{#if currentUser.whatsapp}
											<li class="flex items-start">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
												</svg>
												<span class="text-gray-700">{currentUser.whatsapp}</span>
											</li>
											{/if}
											<li class="flex items-start">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												<span class="text-gray-700">Membro desde {new Date().toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}</span>
											</li>
											<li class="flex items-start">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
												<span class="text-gray-700">Luiz Antônio, São Paulo</span>
											</li>
										</ul>
										<div class="mt-6">
											<h4 class="text-sm font-semibold uppercase text-gray-500 mb-3">Redes Sociais</h4>
											<div class="flex space-x-3">
												<!-- svelte-ignore a11y_consider_explicit_label -->
												<!-- svelte-ignore a11y_invalid_attribute -->
												<a href="#" class="bg-gray-100 hover:bg-blue-100 p-2 rounded-full text-blue-600 transition-colors">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
														<path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
													</svg>
												</a>
												<!-- svelte-ignore a11y_invalid_attribute -->
												<!-- svelte-ignore a11y_consider_explicit_label -->
												<a href="#" class="bg-gray-100 hover:bg-pink-100 p-2 rounded-full text-pink-600 transition-colors">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
														<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
													</svg>
												</a>
												<!-- svelte-ignore a11y_consider_explicit_label -->
												<!-- svelte-ignore a11y_invalid_attribute -->
												<a href="#" class="bg-gray-100 hover:bg-blue-100 p-2 rounded-full text-blue-400 transition-colors">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
														<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
													</svg>
												</a>
												<!-- svelte-ignore a11y_consider_explicit_label -->
												<!-- svelte-ignore a11y_invalid_attribute -->
												<!-- svelte-ignore a11y_invalid_attribute -->
												<!-- svelte-ignore a11y_consider_explicit_label -->
												<a href="#" class="bg-gray-100 hover:bg-red-100 p-2 rounded-full text-red-500 transition-colors">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
														<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
													</svg>
												</a>
											</div>
										</div>
									</div>
								</div>
								
								<!-- Coluna principal -->
								<div class="lg:col-span-2">
									<!-- Bio -->
									<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
										<div class="flex justify-between items-center mb-4">
											<h3 class="text-lg font-semibold text-gray-900 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
												Sobre
											</h3>
											<!-- svelte-ignore a11y_consider_explicit_label -->
											<!-- svelte-ignore event_directive_deprecated -->
											<button 
												class="text-blue-500 hover:text-blue-700"
												on:click={() => (isEditingBio = true)}
											>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
												</svg>
											</button>
										</div>
										
										{#if isEditingBio}
											<textarea
												bind:value={userBio}
												class="w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												rows="4"
												placeholder="Escreva sobre você ou seu negócio..."
											></textarea>
											<div class="mt-3 flex justify-end space-x-3">
												<!-- svelte-ignore event_directive_deprecated -->
												<button
													class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
													on:click={() => (isEditingBio = false)}
													disabled={loading}
												>
													Cancelar
												</button>
												<!-- svelte-ignore event_directive_deprecated -->
												<button
													class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
													on:click={updateBio}
													disabled={loading}
												>
													{loading ? 'Salvando...' : 'Salvar'}
												</button>
											</div>
										{:else}
											<p class="text-gray-700 leading-relaxed whitespace-pre-line">
												{userBio || 'Adicione uma descrição sobre você ou seu negócio...'}
											</p>
										{/if}
									</div>
									
									<!-- Estatísticas -->
									<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
										<h3 class="text-lg font-semibold mb-4 text-gray-900 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
											</svg>
											Estatísticas Rápidas
										</h3>
										<!-- Estatísticas Rápidas -->
										<!-- <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div class="bg-blue-50 p-4 rounded-lg text-center">
												<span class="text-3xl font-bold text-blue-600 block">{statistics.views}</span>
												<span class="text-sm text-gray-600">Visualizações</span>
											</div>
											<div class="bg-green-50 p-4 rounded-lg text-center">
												<span class="text-3xl font-bold text-green-600 block">{statistics.leads}</span>
												<span class="text-sm text-gray-600">Leads</span>
											</div>
											<div class="bg-yellow-50 p-4 rounded-lg text-center">
												<span class="text-3xl font-bold text-yellow-600 block">{statistics.rating}</span>
												<span class="text-sm text-gray-600">Avaliação</span>
											</div>
											<div class="bg-purple-50 p-4 rounded-lg text-center">
												<span class="text-3xl font-bold text-purple-600 block">{statistics.reviews}</span>
												<span class="text-sm text-gray-600">Avaliações</span>
											</div>
										</div> -->
									</div>
									
									<!-- O que há de novo -->
									<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
										<h3 class="text-lg font-semibold mb-4 text-gray-900 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
											</svg>
											O que há de novo
										</h3>
										<div class="space-y-4">
											<div class="p-4 bg-gray-50 rounded-lg">
												<p class="text-gray-700">Você ainda não tem publicações. Comece a compartilhar conteúdo para atrair mais visitantes!</p>
												<button class="mt-3 inline-flex items-center text-blue-500 hover:text-blue-700">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
													</svg>
													Criar publicação
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>

				<!-- Seção Comerciante -->
				<div class="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md text-white p-8">
					<div class="flex flex-col md:flex-row items-center justify-between">
						<div class="mb-6 md:mb-0">
							<h3 class="text-xl font-bold mb-2">Você tem um comércio?</h3>
							<p class="mb-4 opacity-90">Cadastre seu negócio no Guia Comercial e aumente sua visibilidade.</p>
							<ul class="space-y-2">
								<li class="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Alcance clientes em toda região
								</li>
								<li class="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Receba leads qualificados
								</li>
								<li class="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Gerencie seu perfil comercial
								</li>
							</ul>
						</div>
						<!-- svelte-ignore event_directive_deprecated -->
						<button 
							on:click="{handleComerciante}" 
							class="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all transform hover:-translate-y-1"
						>
							Cadastrar meu comércio →
						</button>
					</div>
				</div>
			</div>
		{:else if activeTab === 'statistics'}
			<div class="space-y-6" in:fade>
				<!-- Header -->
				<div class="bg-white rounded-xl shadow-sm p-6">
					<div class="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<h2 class="text-2xl font-bold text-gray-900 mb-1">Estatísticas Detalhadas</h2>
							<p class="text-gray-600">Acompanhe o desempenho do seu perfil e negócio</p>
						</div>
						<div class="mt-4 md:mt-0">
							<div class="inline-flex bg-gray-100 rounded-lg p-1">
								<button class="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">7 dias</button>
								<button class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md">30 dias</button>
								<button class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md">90 dias</button>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Cards de Métricas -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<!-- Visualizações -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-500 text-sm mb-1">Total de Visualizações</p>
								<h3 class="text-3xl font-bold text-gray-900">{statistics.views}</h3>
							</div>
							<div class="bg-blue-100 p-3 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
						</div>
						<div class="mt-4 flex items-center">
							<span class="text-green-500 flex items-center text-sm font-medium">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
								</svg>
								12.5%
							</span>
							<span class="text-gray-500 text-sm ml-2">vs. período anterior</span>
						</div>
					</div>
					
					<!-- Leads -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-500 text-sm mb-1">Leads Gerados</p>
								<h3 class="text-3xl font-bold text-gray-900">{statistics.leads}</h3>
							</div>
							<div class="bg-green-100 p-3 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
						</div>
						<div class="mt-4 flex items-center">
							<span class="text-green-500 flex items-center text-sm font-medium">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
								</svg>
								8.3%
							</span>
							<span class="text-gray-500 text-sm ml-2">vs. período anterior</span>
						</div>
					</div>
					
					<!-- Avaliação -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-500 text-sm mb-1">Avaliação Média</p>
								<h3 class="text-3xl font-bold text-gray-900">{statistics.rating}</h3>
							</div>
							<div class="bg-yellow-100 p-3 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
								</svg>
							</div>
						</div>
						<div class="mt-4 flex items-center">
							<span class="text-green-500 flex items-center text-sm font-medium">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
								</svg>
								0.2
							</span>
							<span class="text-gray-500 text-sm ml-2">vs. período anterior</span>
						</div>
					</div>
					
					<!-- Avaliações -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-500 text-sm mb-1">Total de Avaliações</p>
								<h3 class="text-3xl font-bold text-gray-900">{statistics.reviews}</h3>
							</div>
							<div class="bg-purple-100 p-3 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
						</div>
						<div class="mt-4 flex items-center">
							<span class="text-green-500 flex items-center text-sm font-medium">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
								</svg>
								3
							</span>
							<span class="text-gray-500 text-sm ml-2">novas avaliações</span>
						</div>
					</div>
				</div>
				
				<!-- Gráficos -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Gráfico de Visualizações -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Visualizações do Perfil</h3>
						<!-- Placeholder para gráfico -->
						<div class="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
							<!-- Aqui seria inserido um gráfico com uma biblioteca como Chart.js -->
							<div class="text-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
								<p class="mt-2 text-gray-500">Gráfico de visualizações diárias</p>
							</div>
						</div>
					</div>
					
					<!-- Gráfico de Leads -->
					<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Conversão de Leads</h3>
						<!-- Placeholder para gráfico -->
						<div class="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
							<!-- Aqui seria inserido um gráfico com uma biblioteca como Chart.js -->
							<div class="text-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p class="mt-2 text-gray-500">Gráfico de conversão de leads</p>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Tabela de Últimas Atividades -->
				<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
					<h3 class="text-lg font-semibold text-gray-900 mb-4">Últimas Atividades</h3>
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
									<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								<!-- Exemplo de linha de atividade -->
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Lead</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Novo contato via WhatsApp</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hoje, 15:30</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Busca orgânica</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Visualização</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Página do perfil visualizada</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ontem, 10:15</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Referência direta</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Avaliação</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Nova avaliação recebida (5 estrelas)</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 dias atrás</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cliente existente</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				
				<!-- Call-to-action para upgrade -->
				<div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md p-8 text-white">
					<div class="flex flex-col md:flex-row items-center justify-between">
						<div class="mb-6 md:mb-0">
							<h3 class="text-xl font-bold mb-2">Acesse estatísticas avançadas</h3>
							<p class="opacity-90">Faça upgrade para o plano Profissional e desbloqueie análises detalhadas, relatórios personalizados e mais.</p>
						</div>
						<!-- svelte-ignore event_directive_deprecated -->
						<button
							class="bg-white text-purple-600 font-medium px-6 py-3 rounded-lg shadow hover:shadow-lg"
							on:click={() => (showPlanModal = true)}
						>
							Fazer upgrade →
						</button>
					</div>
				</div>
			</div>
		{:else if activeTab === 'settings'}
			<div class="space-y-6" in:fade>
				<!-- Header -->
				<div class="bg-white rounded-xl shadow-sm p-6">
					<h2 class="text-2xl font-bold text-gray-900 mb-1">Configurações da Conta</h2>
					<p class="text-gray-600">Gerencie suas preferências e configurações de perfil</p>
				</div>
				
				<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<!-- Menu lateral de configurações -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
							<nav class="space-y-1">
								<a href="#perfil" class="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-600">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Perfil
								</a>
								<a href="#notificacoes" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
									</svg>
									Notificações
								</a>
								<a href="#privacidade" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
									</svg>
									Privacidade
								</a>
								<a href="#seguranca" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
									</svg>
									Segurança
								</a>
								<a href="#plano" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
									Plano e Faturamento
								</a>
								<a href="#perigo" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
									Zona de Perigo
								</a>
							</nav>
						</div>
					</div>
					
					<!-- Conteúdo das configurações -->
					<div class="lg:col-span-3 space-y-6">
						<!-- Configurações de Perfil -->
						<div id="perfil" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center border-b pb-3 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								Configurações de Perfil
							</h3>
							
							<div class="space-y-6">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
										<input
											type="text"
											id="name"
											value={currentUser.name}
											class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									</div>
									<div>
										<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
										<input
											type="email"
											id="email"
											value={userStore.value.email}
											disabled
											class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
										/>
										<p class="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
									</div>
								</div>
								
								<div>
									<label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
									<textarea
										id="bio"
										bind:value={userBio}
										rows="4"
										class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										placeholder="Fale um pouco sobre você ou seu negócio..."
									></textarea>
								</div>
								
								<div>
									<label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
									<div class="relative mt-1 rounded-md shadow-sm">
										<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
											<span class="text-gray-500 sm:text-sm">+55</span>
										</div>
										<input
											type="tel"
											id="whatsapp"
											bind:value={currentUser.whatsapp}
											class="pl-12 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											placeholder="(00) 00000-0000"
										/>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Configurações de Notificações -->
						<div id="notificacoes" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center border-b pb-3 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
								</svg>
								Configurações de Notificações
							</h3>
							
							<div class="space-y-6">
								<div class="flex items-center justify-between py-3">
									<div>
										<h4 class="font-medium text-gray-900">Notificações por Email</h4>
										<p class="text-sm text-gray-500">Receba atualizações sobre seu negócio por email</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input 
											type="checkbox" 
											bind:checked={settingsState.emailNotifications} 
											class="peer sr-only" 
										/>
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
								
								<div class="flex items-center justify-between py-3 border-t">
									<div>
										<h4 class="font-medium text-gray-900">Notificações por WhatsApp</h4>
										<p class="text-sm text-gray-500">Receba leads e mensagens importantes via WhatsApp</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input 
											type="checkbox" 
											bind:checked={settingsState.whatsappNotifications} 
											class="peer sr-only" 
										/>
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
								
								<div class="flex items-center justify-between py-3 border-t">
									<div>
										<h4 class="font-medium text-gray-900">Notificações de Avaliações</h4>
										<p class="text-sm text-gray-500">Receba alertas quando seu negócio receber novas avaliações</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input type="checkbox" class="peer sr-only" />
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
							</div>
						</div>
						
						<!-- Configurações de Privacidade -->
						<div id="privacidade" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center border-b pb-3 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
								</svg>
								Configurações de Privacidade
							</h3>
							
							<div class="space-y-6">
								<div class="flex items-center justify-between py-3">
									<div>
										<h4 class="font-medium text-gray-900">Perfil Público</h4>
										<p class="text-sm text-gray-500">Tornar seu perfil visível para todos</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input 
											type="checkbox" 
											bind:checked={settingsState.publicProfile} 
											class="peer sr-only" 
										/>
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
								
								<div class="flex items-center justify-between py-3 border-t">
									<div>
										<h4 class="font-medium text-gray-900">Mostrar Estatísticas</h4>
										<p class="text-sm text-gray-500">Exibir estatísticas publicamente no seu perfil</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input 
											type="checkbox" 
											bind:checked={settingsState.showStatistics} 
											class="peer sr-only" 
										/>
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
								
								<div class="flex items-center justify-between py-3 border-t">
									<div>
										<h4 class="font-medium text-gray-900">Compartilhar Whatsapp</h4>
										<p class="text-sm text-gray-500">Permitir que visitantes vejam seu número de contato</p>
									</div>
									<label class="relative inline-flex cursor-pointer items-center">
										<input type="checkbox" checked class="peer sr-only" />
										<div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
									</label>
								</div>
							</div>
						</div>
						
						<!-- Configurações de Segurança -->
						<div id="seguranca" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center border-b pb-3 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
								</svg>
								Segurança
							</h3>
							
							<div class="space-y-6">
								<div class="flex flex-col md:flex-row md:items-center md:justify-between py-3">
									<div class="mb-4 md:mb-0">
										<h4 class="font-medium text-gray-900">Senha</h4>
										<p class="text-sm text-gray-500">Última alteração: 30 dias atrás</p>
									</div>
									<button class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
										</svg>
										Alterar Senha
									</button>
								</div>
								
								<div class="border-t py-4">
									<h4 class="font-medium text-gray-900 mb-3">Verificação em duas etapas</h4>
									<p class="text-sm text-gray-500 mb-4">Adicione uma camada extra de segurança à sua conta.</p>
									<button class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
										</svg>
										Ativar verificação em duas etapas
									</button>
								</div>
							</div>
						</div>
						
						<!-- Zona de Perigo -->
						<div id="perigo" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
							<h3 class="text-lg font-semibold text-red-600 flex items-center border-b border-red-100 pb-3 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								Zona de Perigo
							</h3>
							
							<div class="rounded-lg bg-red-50 p-4">
								<h4 class="font-medium text-red-800 mb-2">Excluir Conta</h4>
								<p class="text-sm text-red-600 mb-4">
									Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão excluídos permanentemente.
								</p>
								
								<div class="flex items-center mb-4">
									<input id="confirm-delete" type="checkbox" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2">
									<label for="confirm-delete" class="ml-2 text-sm font-medium text-red-700">
										Eu entendo que esta ação é permanente e irreversível
									</label>
								</div>
								
								<button class="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
									<span>Excluir minha conta</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Photo Upload Modal -->
{#if showPhotoModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		transition:fade
	>
		<div class="w-[450px] max-w-full rounded-xl bg-white p-6 shadow-xl" in:slide>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-bold text-gray-900">Atualizar Foto de Perfil</h3>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<!-- svelte-ignore event_directive_deprecated -->
				<button 
					class="text-gray-500 hover:text-gray-700" 
					on:click={() => (showPhotoModal = false)}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="space-y-6">
				<div>
					<p class="text-sm text-gray-600 mb-4">Escolha uma foto para seu perfil. A imagem ideal deve ter pelo menos 400x400 pixels.</p>
					
					<div class="flex items-center justify-center mb-5">
						<div class="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200">
							<img 
								src={currentUser.photoURL || "https://via.placeholder.com/128"}
								alt="Prévia" 
								class="h-full w-full object-cover"
							/>
						</div>
					</div>
					
					<div class="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50 transition-colors">
						<!-- svelte-ignore event_directive_deprecated -->
						<input
							type="file"
							id="profilePicture"
							accept="image/*"
							class="hidden"
							on:change={handleFileChange}
						/>
						<label for="profilePicture" class="cursor-pointer">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<p class="mt-1 text-sm text-gray-600">
								<span class="font-medium text-blue-600 hover:underline">Clique para escolher</span> ou arraste uma imagem
							</p>
							<p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
						</label>
					</div>
				</div>

				<div class="flex justify-end space-x-3 border-t pt-4">
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
						on:click={() => (showPhotoModal = false)}
					>
						Cancelar
					</button>
					<button
						class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center"
						disabled={isSaving}
					>
						{#if isSaving}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Salvando...
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
							</svg>
							Salvar foto
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Plan Selection Modal -->
{#if showPlanModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
		transition:fade
	>
		<div class="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl" in:slide>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-2xl font-bold text-gray-900">
					Escolha seu Plano
				</h3>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<!-- svelte-ignore event_directive_deprecated -->
				<button class="text-gray-500 hover:text-gray-700" on:click={() => (showPlanModal = false)}>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<p class="mb-8 text-gray-600">Escolha o plano ideal para impulsionar seu perfil e negócio no Guia Comercial</p>

			<div class="grid gap-6 md:grid-cols-3">
				{#each plans as plan}
					<div
						class="relative overflow-hidden rounded-xl border-2 {plan.recommended
							? 'border-blue-500 shadow-md'
							: 'border-gray-200'} bg-white p-6 transition-transform hover:scale-105"
					>
						{#if plan.recommended}
							<div
								class="absolute -right-10 top-7 w-40 -rotate-45 bg-blue-500 py-1 text-center text-xs font-semibold text-white"
							>
								RECOMENDADO
							</div>
						{/if}

						<div class="mb-4">
							<h3 class="text-xl font-bold text-gray-900">{plan.name}</h3>
							<div class="mt-4 flex items-baseline">
								<span class="text-4xl font-extrabold text-gray-900">{plan.price}</span>
								<span class="ml-1 text-gray-600">/{plan.billing}</span>
							</div>
						</div>

						<ul class="mb-8 space-y-4 text-sm">
							{#each plan.features as feature}
								<li class="flex items-start">
									<svg
										class="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
									<span class="text-gray-700">{feature}</span>
								</li>
							{/each}
						</ul>

						<!-- svelte-ignore event_directive_deprecated -->
						<button
							class="w-full rounded-lg {plan.recommended
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'border border-blue-600 text-blue-600 hover:bg-blue-50'} px-4 py-3 text-center font-medium transition-colors"
							on:click={() => changePlan(plan.id)}
						>
							{plan.recommended ? 'Começar agora' : 'Selecionar plano'}
						</button>
					</div>
				{/each}
			</div>

			<div class="mt-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
				<p class="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Todos os planos incluem 7 dias de teste gratuito. Cancele a qualquer momento.
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Seleção de aba ativa */
	.active {
		color: rgb(59, 130, 246); /* blue-600 */
		border-color: rgb(59, 130, 246);
	}
	
	/* Fontes */
	:global(.font-sans) {
		font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	:global(h1, h2, h3, h4, h5, h6, p, span, a, button, input) {
		font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}
	
	/* Transições suaves */
	:global(button, a) {
		transition: all 0.2s ease;
	}

	/* Estilo para conteúdo de texto */


	
</style>
