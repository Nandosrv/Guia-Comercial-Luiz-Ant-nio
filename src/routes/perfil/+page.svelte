<script lang="ts">
	import Logout from '$lib/componets/Logout.svelte';
	import Footer from '$lib/footer/+page.svelte';
	import camera from '$lib/images/icons8-câmera-50.png';
	import { uploadProfilePicture } from '$lib/services/uploadSupabase';
	import supabase from '../../lib/supabaseClient';
	import { user, userStore } from '../../stores/userStore.svelte.js';
	import { fade, slide } from 'svelte/transition';
	import { getAuth, updateProfile } from 'firebase/auth';

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
</script>

<div class="min-h-screen bg-gray-50">
	<!-- <button>
        <a href="/adminz">
            admin
        </a>
    </button> -->
	<!-- Header com navegação -->
	<nav class="bg-white shadow-sm">
		<div class="container mx-auto px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center space-x-8">
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class:active={activeTab === 'profile'}
						class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
						on:click={() => (activeTab = 'profile')}
					>
						<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
							Perfil
						</p>
					</button>

					<!-- svelte-ignore event_directive_deprecated -->
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class:active={activeTab === 'statistics'}
						class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
						on:click={() => (activeTab = 'statistics')}
					>
						<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
							Estatísticas
						</p>

						<!-- svelte-ignore event_directive_deprecated -->
					</button>
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class:active={activeTab === 'settings'}
						class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
						on:click={() => (activeTab = 'settings')}
					>
						<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
							Configurações
						</p>
					</button>
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class:active={activeTab === 'informacoes'}
						class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
						on:click={() => (activeTab = 'informacoes')}
					>
						<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
							Informação
						</p>
					</button>
				</div>
				<Logout />
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-8">
		{#if activeTab === 'profile'}
			<div in:fade>
				<!-- Profile Card -->
				<div class="overflow-hidden rounded-xl bg-white shadow-sm">
					<div class="h-32 bg-secondary-foreground to-blue-600 dark:bg-secondary"></div>
					<div class="relative px-6 pb-6">
						<div class="-mt-16 flex items-end justify-between">
							<div class="relative">
								<img
									src={currentUser.photoURL}
									alt={currentUser.name}
									class="h-32 w-32 rounded-xl border-4 border-white object-cover"
								/>
								<!-- svelte-ignore event_directive_deprecated -->
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									class="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50"
									on:click={() => (showPhotoModal = true)}
								>
									<img src={camera} alt="Alterar foto" class="h-5 w-5" />
								</button>
							</div>
							<div class="flex space-x-3">
								<!-- svelte-ignore event_directive_deprecated -->
								<button
									class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
									on:click={() => (showEditModal = true)}
								>
									Editar Perfil
								</button>
								<button class="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
									<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
										Configurações
									</p>
								</button>
							</div>
						</div>

						<!-- Edit Profile Modal -->
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

						<div class="mt-6">
							<h1 class="text-2xl font-bold text-secondary-foreground dark:text-secondary">
								{currentUser.name}
							</h1>
						</div>

						<!-- Bio -->
						<div class="mt-6">
							{#if isEditingBio}
								<textarea
									bind:value={userBio}
									class="w-full rounded-lg border p-4 focus:ring-2 focus:ring-purple-500"
									rows="4"
									placeholder="Escreva sobre você ou seu negócio..."
								></textarea>
								<!-- svelte-ignore event_directive_deprecated -->
								<!-- svelte-ignore event_directive_deprecated -->
								<div class="mt-3 flex justify-end space-x-3">
									<button
										class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
										on:click={() => (isEditingBio = false)}
										disabled={loading}
									>
										Cancelar
									</button>
									<button
										class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
										on:click={updateBio}
										disabled={loading}
									>
										{loading ? 'Salvando...' : 'Salvar'}
									</button>
								</div>
							{:else}
								<!-- svelte-ignore a11y_consider_explicit_label -->
								<div class="group relative">
									<p
										class="font-['Inter'] leading-relaxed text-secondary-foreground dark:text-secondary"
									>
										{userBio || 'Adicione uma descrição sobre você ou seu negócio...'}
										<!-- svelte-ignore a11y_consider_explicit_label -->
									</p>

									<!-- svelte-ignore event_directive_deprecated -->
									<!-- svelte-ignore event_directive_deprecated -->
									<button
										class="absolute right-0 top-0 opacity-0 transition-opacity group-hover:opacity-100"
										on:click={() => (isEditingBio = true)}
									>
										<svg
											class="h-5 w-5 text-gray-500 hover:text-purple-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
											/>
										</svg>
									</button>
								</div>
							{/if}
						</div>

						<!-- Quick Stats -->
						<!-- estatísticas -->
						<div class="mt-8 grid grid-cols-4 gap-4">
							<div class="rounded-lg bg-gray-50 p-4 text-center">
								<!-- <p class="text-2xl font-bold text-secondary-foreground">{statistics.views}</p> -->
								<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
									Visualizações
								</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4 text-center">
								<!-- <p class="text-2xl font-bold text-secondary-foreground">{statistics.leads}</p> -->
								<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
									Leads
								</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4 text-center">
								<!-- <p class="text-2xl font-bold text-secondary-foreground">{statistics.rating}</p> -->
								<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
									Avaliação
								</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-4 text-center">
								<!-- <p class="text-2xl font-bold text-secondary-foreground">{statistics.reviews}</p> -->
								<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
									Avaliações
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Aqui fica o conteúdo para a seção Redes Sociais -->
				<h3
					class="mb-4 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
				>
					Redes Sociais
				</h3>
				<div class="mt-6 rounded-xl bg-white p-6 shadow-sm">
					<div class="flex space-x-4">
						<!-- svelte-ignore a11y_invalid_attribute -->
						<a href="#" class="text-blue-600 hover:text-blue-700">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<!-- ícone do Facebook -->
							</svg>
						</a>
						<!-- svelte-ignore a11y_invalid_attribute -->
						<a href="#" class="text-pink-600 hover:text-pink-700">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<!-- ícone do Instagram -->
							</svg>
						</a>
						<!-- outros ícones de redes sociais -->
					</div>
				</div>
				<!-- Current Plan -->
				<!-- <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-xl font-bold text-secondary-foreground dark:text-secondary font-['Inter']">Seu Plano Atual</h2>
                            <p class="text-blue-500 font-medium mt-1 font-['Inter']">Plano {currentUser.plan || 'Básico'}</p>
                            <!-- <p>{new Date().toLocaleDateString()}</p> -->

				<!-- <p class="text-sm text-gray-600 mt-1">
                                Próxima renovação em: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('pt-BR')}
                            </p>   
                        </div>
                        svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- <button
                            class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-purple-700"
                            on:click={() => showPlanModal = true}>
                            Mudar Plano
                        </button>
                    </div>
                </div> -->
			</div>
		{:else if activeTab === 'statistics'}
			<div class="rounded-xl bg-white p-6 shadow-sm" in:fade>
				<h2
					class="mb-6 font-['Inter'] text-xl font-bold text-secondary-foreground dark:text-secondary"
				>
					Estatísticas Detalhadas
				</h2>
				<!-- Add charts and detailed statistics here -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Placeholder for statistics -->
					<div class="rounded-lg border p-4">
						<h3
							class="mb-2 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Visualizações
						</h3>
						<p
							class="font-['Inter'] text-2xl font-bold text-secondary-foreground dark:text-secondary"
						>
							0
						</p>
					</div>
					<div class="rounded-lg border p-4">
						<h3
							class="mb-2 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Interações
						</h3>
						<p
							class="font-['Inter'] text-2xl font-bold text-secondary-foreground dark:text-secondary"
						>
							0
						</p>
					</div>
				</div>
			</div>
			<!-- Configurações de Notificações -->
		{:else if activeTab === 'settings'}
			<div class="rounded-xl bg-white p-6 shadow-sm" in:fade>
				<h2
					class="mb-6 font-['Inter'] text-xl font-bold text-secondary-foreground dark:text-secondary"
				>
					Configurações da Conta
				</h2>
				<div class="space-y-8">
					<!-- Configurações de Perfil -->
					<div>
						<h3
							class="mb-4 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Configurações de Perfil
						</h3>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<label
									for="name"
									class="block font-['Inter'] text-sm font-medium text-secondary-foreground dark:text-secondary"
									>Nome Completo</label
								>
								<p class="font-['Inter'] text-secondary-foreground dark:text-secondary">
									{currentUser.name}
								</p>
								<!-- <input
                            type="text"
                            id="name"
                            value={currentUser.name}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        /> -->
							</div>
							<div>
								<label
									for="email"
									class="block font-['Inter'] text-sm font-medium text-secondary-foreground dark:text-secondary"
									>Email</label
								>
								<input
									type="email"
									id="email"
									value={userStore.value.email}
									disabled
									class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 font-['Inter'] text-secondary-foreground shadow-sm dark:text-secondary"
								/>
							</div>
						</div>
					</div>

					<!-- Configurações de Notificações -->
					<div>
						<h3
							class="mb-4 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Configurações de Notificações
						</h3>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div>
									<h4
										class="font-['Inter'] font-medium text-secondary-foreground dark:text-secondary"
									>
										Notificações por Email
									</h4>
									<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
										Receba atualizações sobre seu negócio por email
									</p>
								</div>
								<label class="relative inline-flex cursor-pointer items-center">
									<input type="checkbox" class="peer sr-only" />
									<div
										class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"
									></div>
								</label>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<h4
										class="font-['Inter'] font-medium text-secondary-foreground dark:text-secondary"
									>
										Notificações por WhatsApp
									</h4>
									<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
										Receba leads e mensagens importantes via WhatsApp
									</p>
								</div>
								<label class="relative inline-flex cursor-pointer items-center">
									<input type="checkbox" class="peer sr-only" />
									<div
										class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"
									></div>
								</label>
							</div>
						</div>
					</div>

					<!-- Configurações de Privacidade -->
					<div>
						<h3
							class="mb-4 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Configurações de Privacidade
						</h3>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div>
									<h4
										class="font-['Inter'] font-medium text-secondary-foreground dark:text-secondary"
									>
										Perfil Público
									</h4>
									<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
										Tornar seu perfil visível para todos
									</p>
								</div>
								<label class="relative inline-flex cursor-pointer items-center">
									<input type="checkbox" class="peer sr-only" />
									<div
										class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"
									></div>
								</label>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<h4
										class="font-['Inter'] font-medium text-secondary-foreground dark:text-secondary"
									>
										Mostrar Estatísticas
									</h4>
									<p class="font-['Inter'] text-sm text-secondary-foreground dark:text-secondary">
										Exibir estatísticas publicamente no seu perfil
									</p>
								</div>
								<label class="relative inline-flex cursor-pointer items-center">
									<input type="checkbox" class="peer sr-only" />
									<div
										class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"
									></div>
								</label>
							</div>
						</div>
					</div>

					<!-- Segurança -->
					<div>
						<h3
							class="mb-4 font-['Inter'] text-lg font-semibold text-secondary-foreground dark:text-secondary"
						>
							Segurança
						</h3>
						<div class="space-y-4">
							<button
								class="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 md:w-auto"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
									/>
								</svg>
								<span>Alterar Senha</span>
							</button>
						</div>
					</div>

					<!-- Zona de Perigo -->
					<div>
						<h3 class="mb-4 text-lg font-semibold text-red-600">Zona de Perigo</h3>
						<div class="space-y-4">
							<div class="rounded-lg bg-red-50 p-4">
								<h4 class="font-medium text-red-800">Excluir Conta</h4>
								<p class="mt-1 text-sm text-red-600">
									Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão
									excluídos.
								</p>
								<button
									class="mt-4 flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									<span>Excluir minha conta</span>
								</button>
							</div>
						</div>
					</div>

					<!-- Botões de Ação -->
					<div class="flex justify-end space-x-3 border-t pt-6">
						<button class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"> Cancelar </button>
						<button class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
							Salvar Alterações
						</button>
					</div>
				</div>
			</div>
		{/if}
		{#if activeTab === 'informacoes'}
			<div class="rounded-xl bg-white p-6 shadow-sm" in:fade>
				<h2
					class="mb-6 font-['Inter'] text-xl font-bold text-secondary-foreground dark:text-secondary"
				>
					Estamos em Construção!
				</h2>
				<p class="mb-4 font-['Inter'] text-lg text-secondary-foreground dark:text-secondary">
					Esta seção está em desenvolvimento. Estamos trabalhando para trazer as melhores
					estatísticas detalhadas para você. Fique ligado para mais novidades!
				</p>
				<div class="flex items-center justify-center p-6">
					<div class="text-center">
						<span class="text-4xl text-gray-500 dark:text-gray-400">🔨</span>
						<p
							class="mt-4 font-['Inter'] text-xl font-semibold text-secondary-foreground dark:text-secondary"
						>
							Em breve, estatísticas detalhadas estarão disponíveis aqui.
						</p>
					</div>
				</div>
			</div>

			<!-- Conteúdo para outra aba -->
		{/if}
	</div>
</div>

<!-- Photo Upload Modal -->
{#if showPhotoModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		transition:fade
	>
		<div class="w-96 rounded-xl bg-white p-6" in:slide>
			<div class="mb-4 flex items-center justify-between">
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<h3 class="text-xl font-bold">Atualizar Foto</h3>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore event_directive_deprecated -->
				<button class="text-gray-500 hover:text-gray-700" on:click={() => (showPhotoModal = false)}>
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

			<div class="space-y-4">
				<!-- svelte-ignore event_directive_deprecated -->
				<!-- svelte-ignore event_directive_deprecated -->
				<div class="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
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
						<p class="mt-1 text-sm text-gray-600">Clique para selecionar uma imagem</p>
					</label>
				</div>

				<div class="flex justify-end space-x-3">
					<!-- svelte-ignore event_directive_deprecated -->
					<button
						class="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
						on:click={() => (showPhotoModal = false)}
					>
						Cancelar
					</button>
					<button
						class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
						disabled={isSaving}
					>
						{isSaving ? 'Salvando...' : 'Salvar'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Plan Selection Modal -->
{#if showPlanModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		transition:fade
	>
		<div class="mx-4 w-full max-w-4xl rounded-xl bg-white p-6" in:slide>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-secondary-foreground dark:text-secondary">
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

			<div class="grid gap-6 md:grid-cols-3">
				{#each plans as plan}
					<div
						class="relative rounded-xl border-2 bg-white {plan.recommended
							? 'border-purple-500'
							: 'border-gray-200'} p-6"
					>
						{#if plan.recommended}
							<div
								class="absolute right-0 top-0 -translate-y-1/2 rounded-full bg-purple-500 px-4 py-1 text-sm text-white"
							>
								Recomendado
							</div>
						{/if}

						<h3 class="text-xl font-bold">{plan.name}</h3>
						<div class="mt-4">
							<span class="text-3xl font-bold">{plan.price}</span>
							<span class="text-gray-600">/{plan.billing}</span>
						</div>

						<ul class="mt-6 space-y-3">
							{#each plan.features as feature}
								<li class="flex items-center text-sm text-gray-600">
									<svg
										class="mr-2 h-5 w-5 text-green-500"
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
									{feature}
								</li>
							{/each}
						</ul>

						<!-- svelte-ignore event_directive_deprecated -->
						<button
							class="mt-8 w-full px-4 py-2 {plan.recommended
								? 'bg-blue-500 text-white'
								: 'border border-purple-600 text-purple-600 hover:bg-purple-50'} rounded-lg transition-colors"
							on:click={() => changePlan(plan.id)}
						>
							Selecionar Plano
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.active {
		background-color: rgb(245, 243, 255);
		color: blue;
	}
	h3 {
		font-family: 'Inter';
	}
	p {
		font-family: 'Inter';
	}
	h1 {
		font-family: 'Inter';
	}
</style>
