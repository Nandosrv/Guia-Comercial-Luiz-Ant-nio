<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
	import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';

	import { X, Image, MapPin, Phone } from 'lucide-svelte';
	import test from '$lib/images/bitar.png';
	import Promocoes from '$lib/componets/Promocoes.svelte';
	import Mensagens from '$lib/componets/Mensagens.svelte';
	import Produtc from '$lib/componets/Produtc.svelte';
	// Estado do usuário e comércio

	let usuario = { nome: '', email: '', foto: '', telefone: '' };
	let comercio = {
		id: '',
		nome: '',
		email: '',
		endereco: '',
		telefone: '',
		categoria: '',
		descricao: '',
		horario: '08:00 - 18:00',
		status: 'Aberto',
		dataCadastro: '',
		visualizacoes: 0,
		contatos: 0,
		fotos: []
	};

	// Estado da UI
	let isLoading = true;
	let isEditingPerfil = false;
	let errorMessage = '';
	let successMessage = '';

	// Fotos do comércio
	let novaFoto: File | null = null;
	let previewFotos: string[] = [];
	let selectedFile: File | null = null;

	const auth = getAuth();
	let authUser: User | null = null;

	async function carregarDadosComercio(userId: string) {
		try {
			// Carregar dados do usuário
			const userResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
			const userData = await userResponse.json();

			// Carregar dados do comércio
			const comercioResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
			const comercioData = await comercioResponse.json();

			if (comercioData && comercioData.comerciante) {
				comercio = {
					...comercio,
					id: comercioData.comerciante.id || '',
					nome: comercioData.comerciante.nome || 'Meu Comércio',
					endereco: comercioData.comerciante.endereco || 'Endereço não cadastrado',
					telefone: comercioData.comerciante.telefone || 'Telefone não cadastrado',
					categoria: comercioData.comerciante.categoria || 'Categoria não definida',
					descricao: comercioData.comerciante.descricao || 'Sem descrição',
					email: comercioData.comerciante.email || 'email@exemplo.com',
					dataCadastro:
						formatarData(comercioData.comerciante.criado_em) || formatarData(new Date()),
					visualizacoes: comercioData.comerciante.visualizacoes || Math.floor(Math.random() * 100)
				};
				// console.log("comercio", comercioData.comerciante.telefone);

				// Verificar se o comércio tem foto e carregar no preview
				if (comercioData.comerciante['photo-comercio']) {
					console.log(
						'Foto do comércio encontrada:',
						comercioData.comerciante['photo-comercio'].substring(0, 50) + '...'
					);
					previewFotos = [comercioData.comerciante['photo-comercio']];
				} else {
					console.log('Comércio não possui foto');
					previewFotos = [];
				}
			}
		} catch (error) {
			console.error('Erro ao carregar dados:', error);
			errorMessage = 'Não foi possível carregar os dados do seu comércio.';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		// Verifica o estado de autenticação e configura o listener
		// checkAuthState({});

		// Listener para mudanças no estado de autenticação
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				authUser = user;

				// Inicializar campos do usuário
				nome = user.displayName || '';
				email = user.email || '';

				// Carregar dados do comércio
				carregarDadosComercio(user.uid);
			} else {
				console.log('Usuário não autenticado, redirecionando para login');
				goto('/login');
			}
		});

		// Cleanup listener quando o componente for desmontado
		return () => unsubscribe();
	});

	function formatarData(data: string | number | Date) {
		if (!data) return '';

		const date = new Date(data);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	// function salvarPerfil() {
	//   // Simulação de salvamento
	//   isEditingPerfil = false;
	//   successMessage = 'Perfil atualizado com sucesso!';

	//   setTimeout(() => {
	//     successMessage = '';
	//   }, 3000);
	// }

	// Função para lidar com upload de fotos
	function handleFileUpload(event: Event): void {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			// Armazenar referência ao arquivo selecionado
			selectedFile = file;
			console.log(
				'Arquivo selecionado:',
				file.name,
				'tamanho:',
				Math.round(file.size / 1024),
				'KB'
			);

			// Não criar preview automaticamente - isso será feito ao clicar no botão "Aplicar Foto"
		}
	}

	// Função para remover foto
	function removerFoto(index: number): void {
		previewFotos = [];
		selectedFile = null;

		// Limpar o input file para permitir selecionar o mesmo arquivo novamente
		const fileInput = document.getElementById('foto-upload') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}

		console.log('Foto removida e seleção limpa');
	}

	// function pra atualizar dados do comerciante
	let nome = '';
	let endereco = '';
	let telefone = '';
	let email = '';
	let categoria = '';

	async function pegarTokenUsuario() {
		if (authUser) {
			await authUser.getIdToken(true); // Força a atualização do token
			return await authUser.getIdToken();
		}
		throw new Error('Usuário não autenticado');
	}

	async function atualizarComerciante(
		idComerciante: string,
		nome: string,
		email: string,
		endereco: string,
		telefone: string,
		categoria: string
	) {
		try {
			// Pegando o token do usuário
			const token = await pegarTokenUsuario();

			// Criando um objeto FormData para enviar os dados incluindo a foto
			const formData = new FormData();
			formData.append('nome', nome);
			formData.append('email', email);
			formData.append('endereco', endereco);
			formData.append('telefone', telefone);
			formData.append('categoria', categoria);

			// Se tiver um arquivo selecionado, adiciona ao FormData
			if (selectedFile) {
				formData.append('foto', selectedFile);
				console.log('Foto adicionada ao FormData:', selectedFile.name);
			}

			// Verificando os dados antes de enviar
			console.log('Dados a serem enviados para o backend:', {
				idComerciante,
				nome,
				email,
				endereco,
				telefone,
				categoria,
				temFoto: !!selectedFile,
				fotoNome: selectedFile?.name
			});

			// Enviando a requisição PUT com FormData (não precisa definir Content-Type)
			const response = await fetch('http://localhost:3000/painel/meu-comercio/atualizar-comercio', {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`
					// Não inclua Content-Type aqui, o navegador vai definir automaticamente com boundary para o FormData
				},
				body: formData
			});

			// Logando o token e a resposta do servidor
			// console.log("Token enviado:", token);
			// console.log("Resposta do servidor:", response);

			// Verificando se a resposta do servidor está ok
			if (!response.ok) {
				const errorText = await response.text(); // Obtém o texto da resposta de erro
				console.error('Erro na resposta do servidor:', errorText);
				throw new Error(`Erro: ${response.status} - ${errorText}`);
			}

			// Convertendo a resposta em JSON
			const data = await response.json();
			console.log('Comerciante atualizado com sucesso:', data);

			// Atualizando informações locais com os novos dados
			if (data && data.comerciante) {
				usuario.nome = nome;
				usuario.email = email;
				usuario.telefone = telefone;

				comercio.nome = nome;
				comercio.email = email;
				comercio.endereco = endereco;
				comercio.telefone = telefone;
				comercio.categoria = categoria;

				// Atualizando a foto do comércio, se disponível
				if (data.comerciante['photo-comercio']) {
					// Já temos o preview criado no momento do upload, não precisamos fazer nada aqui
					console.log('URL da foto salva:', data.comerciante['photo-comercio']);
				}
			}

			// Limpar o arquivo selecionado após o upload bem-sucedido
			selectedFile = null;

			// Exibindo mensagem de sucesso
			successMessage = 'Dados do comércio atualizados com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);

			// Fechando o modo de edição
			isEditingPerfil = false;
		} catch (error) {
			// Tratando qualquer erro que ocorrer
			console.error('Erro ao atualizar comerciante:', (error as Error).message);
			errorMessage = `Erro ao atualizar dados: ${(error as Error).message}`;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}
</script>

<div>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Meu Comércio</h1>
		<button
			on:click={() => (isEditingPerfil = !isEditingPerfil)}
			class="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
		>
			{isEditingPerfil ? 'Cancelar' : 'Editar Perfil'}
		</button>
	</div>

	<div class="mt-6 overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-lg">
		{#if isEditingPerfil}
			<div class="px-4 py-5 sm:p-6">
				<div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
					<div class="sm:col-span-3">
						<label
							for="nome-comercio"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Nome do Comércio
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="nome-comercio"
								bind:value={comercio.nome}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="categoria"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Categoria
						</label>
						<div class="mt-1">
							<select
								id="categoria"
								bind:value={comercio.categoria}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							>
								<option value="Alimentação">Alimentação</option>
								<option value="Serviços">Serviços</option>
								<option value="Saúde">Saúde</option>
								<option value="Beleza">Beleza</option>
								<option value="Vestuário">Vestuário</option>
								<option value="Tecnologia">Tecnologia</option>
								<option value="Outro">Outro</option>
							</select>
						</div>
					</div>

					<div class="sm:col-span-6">
						<label
							for="endereco"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Endereço
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="endereco"
								bind:value={comercio.endereco}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="telefone"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Telefone
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="telefone"
								bind:value={comercio.telefone}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label for="horario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Horário de Funcionamento
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="horario"
								bind:value={comercio.horario}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-6">
						<label
							for="descricao"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Descrição
						</label>
						<div class="mt-1">
							<textarea
								id="descricao"
								rows="4"
								bind:value={comercio.descricao}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							></textarea>
						</div>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Breve descrição do seu comércio. Máximo 500 caracteres.
						</p>
					</div>

					<div class="sm:col-span-6">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Fotos do Comércio
						</label>
						<div class="mt-2">
							<div class="flex flex-wrap items-center gap-2">
								<label
									for="foto-upload"
									class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
								>
									<span>Selecionar Foto</span>
									<input
										id="foto-upload"
										name="foto-upload"
										type="file"
										accept="image/*"
										class="sr-only"
										on:change={handleFileUpload}
									/>
								</label>

								{#if selectedFile}
									<!-- <span class="text-sm text-green-600 dark:text-green-400">
                    Arquivo selecionado: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </span> -->

									<button
										type="button"
										on:click={() => {
											// Atualiza a prévia antes de salvar ou atualizar
											if (selectedFile) {
												const reader = new FileReader();
												reader.onload = (e) => {
													if (e.target && e.target.result) {
														previewFotos = [e.target.result as string];
													}
												};
												reader.readAsDataURL(selectedFile);
											}
										}}
										class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Aplicar Foto
									</button>

									<p class="mt-1 w-full text-sm text-amber-600 dark:text-amber-400">
										Importante: Clique em "Aplicar Foto" para visualizar a imagem antes de salvar.
									</p>
								{/if}

								<p class="ml-3 text-xs text-gray-500 dark:text-gray-400">
									JPG, PNG, ou GIF de até 10MB
								</p>
							</div>
						</div>

						<!-- Pré-visualização das fotos -->
						{#if previewFotos.length > 0}
							<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
								{#each previewFotos as foto, index}
									<div class="relative">
										<img
											src={foto}
											alt="Foto do comércio"
											class="h-24 w-full rounded-md object-cover"
										/>
										<button
											type="button"
											on:click={() => removerFoto(index)}
											class="absolute right-0 top-0 -mr-2 -mt-2 rounded-full bg-red-600 p-1 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
										>
											<X class="h-4 w-4" />
										</button>
									</div>
								{/each}
							</div>
						{:else}
							<div
								class="mt-4 rounded-md border border-dashed border-gray-300 p-4 text-center dark:border-gray-600"
							>
								<Image class="mx-auto h-8 w-8 text-gray-400" />
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
									Nenhuma foto adicionada. Selecione um arquivo e clique em "Aplicar Foto" para
									visualizar.
								</p>
							</div>
						{/if}
					</div>
				</div>

				<div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
					<button
						type="button"
						on:click={() =>
							atualizarComerciante(
								comercio.id,
								comercio.nome,
								comercio.email,
								comercio.endereco,
								comercio.telefone,
								comercio.categoria
							)}
						class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
					>
						{#if selectedFile && previewFotos.length > 0}
							<Image class="mr-2 h-4 w-4" />
							Salvar com foto
						{:else}
							Salvar alterações
						{/if}
					</button>

					<button
						type="button"
						on:click={() => (isEditingPerfil = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
					>
						Cancelar
					</button>
				</div>
			</div>
		{:else}
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
					Informações do Comércio
				</h3>
				<p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
					Detalhes completos do seu negócio.
				</p>
			</div>
			<div class="border-t border-gray-200 dark:border-gray-700">
				<dl>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nome do comércio</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.nome}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.categoria}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<MapPin class="mr-1 h-4 w-4 text-gray-400" />
							{comercio.endereco}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Telefone</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<Phone class="mr-1 h-4 w-4 text-gray-400" />
							{comercio.telefone}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
							Horário de Funcionamento
						</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.horario}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.descricao || 'Nenhuma descrição fornecida.'}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Fotos</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{#if previewFotos.length > 0}
								<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
									{#each previewFotos as foto}
										<div class="relative">
											<img
												src={foto}
												alt="Foto do comércio"
												class="h-24 w-full rounded-md object-cover shadow-sm"
											/>
											{#if isEditingPerfil}
												<!-- Botão de remoção só aparece no modo de edição -->
												<button
													type="button"
													on:click={() => removerFoto(0)}
													class="absolute right-0 top-0 -mr-2 -mt-2 rounded-full bg-red-600 p-1 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
												>
													<X class="h-4 w-4" />
												</button>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-gray-500 dark:text-gray-400">Nenhuma foto adicionada.</p>
							{/if}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status atual</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							<span
								class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200"
							>
								{comercio.status}
							</span>
						</dd>
					</div>
				</dl>
			</div>
		{/if}
	</div>
</div>
