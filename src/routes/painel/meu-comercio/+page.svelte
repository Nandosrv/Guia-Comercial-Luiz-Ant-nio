<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
	import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';

	import { X, Image, MapPin, Phone, Instagram, Facebook, Smartphone, Globe } from 'lucide-svelte';
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
		subcategoria: '',
		descricao: '',
		horario: '08:00 - 18:00',
		status: 'Aberto',
		dataCadastro: '',
		visualizacoes: 0,
		contatos: 0,
		fotos: [],
		instagram: '',
		facebook: '',
		whatsapp: '',
		website: '',
		metodos_pagamento: {
			dinheiro: false,
			cartao_credito: false,
			cartao_debito: false,
			pix: false,
			transferencia: false,
			boleto: false
		},
		horarios_funcionamento: [
			{dia: "Segunda", aberto: true, abertura: "08:00", fechamento: "18:00"},
			{dia: "Terça", aberto: true, abertura: "08:00", fechamento: "18:00"},
			{dia: "Quarta", aberto: true, abertura: "08:00", fechamento: "18:00"},
			{dia: "Quinta", aberto: true, abertura: "08:00", fechamento: "18:00"},
			{dia: "Sexta", aberto: true, abertura: "08:00", fechamento: "18:00"},
			{dia: "Sábado", aberto: true, abertura: "08:00", fechamento: "13:00"},
			{dia: "Domingo", aberto: false, abertura: "00:00", fechamento: "00:00"}
		],
		plano: 'Básico'
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
	let selectedFiles: FileList | null = null;

	const auth = getAuth();
	let authUser: User | null = null;

	async function carregarDadosComercio(userId: string) {
		try {
			// Carregar dados do usuário
			const userResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
			const userData = await userResponse.json();

			// Carregar dados do comércio
			const comercioResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
			const comercioData = await comercioResponse.json();
			
			console.log('Dados do comerciante recebidos:', comercioData.comerciante);
			console.log('Métodos de pagamento:', comercioData.comerciante.metodos_pagamento);

			if (comercioData && comercioData.comerciante) {
				try {
					// Tentar processar os métodos de pagamento
					let metodosPagamento = comercioData.comerciante.metodos_pagamento;
					if (typeof metodosPagamento === 'string') {
						metodosPagamento = JSON.parse(metodosPagamento);
					}

					// Processando as fotos
					let fotos = [];
					if (comercioData.comerciante.fotos) {
						if (typeof comercioData.comerciante.fotos === 'string') {
							fotos = JSON.parse(comercioData.comerciante.fotos);
						} else if (Array.isArray(comercioData.comerciante.fotos)) {
							fotos = comercioData.comerciante.fotos;
						}
					}

					// Mapeamento dos nomes das propriedades
					const metodosProcessados = {
						dinheiro: metodosPagamento.dinheiro || false,
						cartao_credito: metodosPagamento.cartaoCredito || false,
						cartao_debito: metodosPagamento.cartaoDebito || false,
						pix: metodosPagamento.pix || false,
						transferencia: metodosPagamento.transferencia || false,
						boleto: metodosPagamento.boleto || false
					};
					
					comercio = {
						...comercio,
						id: comercioData.comerciante.id || '',
						nome: comercioData.comerciante.nome || 'Meu Comércio',
						endereco: comercioData.comerciante.endereco || 'Endereço não cadastrado',
						telefone: comercioData.comerciante.telefone || 'Telefone não cadastrado',
						categoria: comercioData.comerciante.categoria || 'Categoria não definida',
						subcategoria: comercioData.comerciante.subcategoria || '',
						descricao: comercioData.comerciante.descricao || 'Sem descrição',
						email: comercioData.comerciante.email || 'email@exemplo.com',
						dataCadastro: formatarData(comercioData.comerciante.criado_em) || formatarData(new Date()),
						visualizacoes: comercioData.comerciante.visualizacoes || Math.floor(Math.random() * 100),
						instagram: comercioData.comerciante.instagram || '',
						facebook: comercioData.comerciante.facebook || '',
						whatsapp: comercioData.comerciante.whatsapp || '',
						website: comercioData.comerciante.website || '',
						metodos_pagamento: metodosProcessados,
						fotos: fotos,
						horarios_funcionamento: comercioData.comerciante.horarios_funcionamento || [
							{dia: "Segunda", aberto: true, abertura: "08:00", fechamento: "18:00"},
							{dia: "Terça", aberto: true, abertura: "08:00", fechamento: "18:00"},
							{dia: "Quarta", aberto: true, abertura: "08:00", fechamento: "18:00"},
							{dia: "Quinta", aberto: true, abertura: "08:00", fechamento: "18:00"},
							{dia: "Sexta", aberto: true, abertura: "08:00", fechamento: "18:00"},
							{dia: "Sábado", aberto: true, abertura: "08:00", fechamento: "13:00"},
							{dia: "Domingo", aberto: false, abertura: "00:00", fechamento: "00:00"}
						],
						plano: comercioData.comerciante.plano || 'Básico'
					};

					// Atualizar previewFotos com todas as fotos do comércio
					if (fotos && fotos.length > 0) {
						previewFotos = fotos;
						console.log('Fotos carregadas:', previewFotos);
					} else if (comercioData.comerciante['photo-comercio']) {
						previewFotos = [comercioData.comerciante['photo-comercio']];
						console.log('Foto principal carregada:', previewFotos);
					} else {
						previewFotos = [];
						console.log('Nenhuma foto encontrada');
					}

					// Processando o formato dos horários de funcionamento se existirem
					if (comercioData.comerciante.horarios_funcionamento) {
						try {
							let horariosTemp;
							
							// Se o horario_funcionamento for uma string JSON, parsear
							if (typeof comercioData.comerciante.horarios_funcionamento === 'string') {
								horariosTemp = JSON.parse(comercioData.comerciante.horarios_funcionamento);
							} else {
								horariosTemp = comercioData.comerciante.horarios_funcionamento;
							}
							
							// Verificar se o formato é o array esperado
							if (Array.isArray(horariosTemp)) {
								comercio.horarios_funcionamento = horariosTemp;
							} else if (typeof horariosTemp === 'object') {
								// Se for um objeto (formato antigo), converter para o novo formato de array
								const diasDaSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
								comercio.horarios_funcionamento = diasDaSemana.map(dia => {
									const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
									// Verificar se existe o dia no objeto antigo
									if (horariosTemp[dia]) {
										return {
											dia: diaCapitalizado,
											aberto: horariosTemp[dia].aberto || false,
											abertura: horariosTemp[dia].horario_inicio || "08:00",
											fechamento: horariosTemp[dia].horario_fim || "18:00"
										};
									} else {
										// Valor padrão se o dia não existir
										return {
											dia: diaCapitalizado,
											aberto: false,
											abertura: "08:00",
											fechamento: "18:00"
										};
									}
								});
							}
							
							console.log('Horários carregados:', comercio.horarios_funcionamento);
						} catch (e) {
							console.error('Erro ao processar horários de funcionamento:', e);
							// Em caso de erro, use o formato padrão
							comercio.horarios_funcionamento = [
								{dia: "Segunda", aberto: true, abertura: "08:00", fechamento: "18:00"},
								{dia: "Terça", aberto: true, abertura: "08:00", fechamento: "18:00"},
								{dia: "Quarta", aberto: true, abertura: "08:00", fechamento: "18:00"},
								{dia: "Quinta", aberto: true, abertura: "08:00", fechamento: "18:00"},
								{dia: "Sexta", aberto: true, abertura: "08:00", fechamento: "18:00"},
								{dia: "Sábado", aberto: true, abertura: "08:00", fechamento: "13:00"},
								{dia: "Domingo", aberto: false, abertura: "00:00", fechamento: "00:00"}
							];
						}
					}
				} catch (e) {
					console.error('Erro ao processar métodos de pagamento:', e);
					// Em caso de erro, use o formato padrão
					comercio.metodos_pagamento = {
						dinheiro: false,
						cartao_credito: false,
						cartao_debito: false,
						pix: false,
						transferencia: false,
						boleto: false
					};
					
					console.log('Métodos de pagamento após processamento:', comercio.metodos_pagamento);
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
		if (target.files && target.files.length > 0) {
			// Armazenar referência ao(s) arquivo(s) selecionado(s)
			selectedFile = target.files[0]; // Manter para compatibilidade
			selectedFiles = target.files;   // Nova variável para múltiplos arquivos
			
			console.log(
				'Arquivos selecionados:',
				target.files.length,
				'total:',
				Array.from(target.files).reduce((acc, file) => acc + Math.round(file.size / 1024), 0),
				'KB'
			);
		}
	}

	// Função para aplicar as fotos selecionadas para visualização
	function aplicarFotos(): void {
		if (selectedFiles) {
			Array.from(selectedFiles).forEach(file => {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target && e.target.result) {
						// Adicionar à lista de previews, sem substituir existentes
						previewFotos = [...previewFotos, e.target.result as string];
					}
				};
				reader.readAsDataURL(file);
			});
		}
	}

	// Função para remover foto
	function removerFoto(index: number): void {
		previewFotos = previewFotos.filter((_, i) => i !== index);
		
		// Limpar o input file se não houver mais fotos
		if (previewFotos.length === 0) {
			selectedFile = null;
			selectedFiles = null;
			const fileInput = document.getElementById('foto-upload') as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
			}
		}

		console.log(`Foto ${index} removida. Restam ${previewFotos.length} fotos.`);
	}

	// function pra atualizar dados do comerciante
	let nome = '';
	let endereco = '';
	let telefone = '';
	let email = '';
	let categoria = '';
	let subcategoria = '';
	let instagram = '';
	let facebook = '';
	let whatsapp = '';
	let website = '';
	let plano = 'Básico';

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
		categoria: string,
		subcategoria: string,
		descricao: string,
		instagram: string,
		facebook: string,
		whatsapp: string,
		website: string,
		metodos_pagamento: any,
		horarios_funcionamento: any
	) {
		try {
			const token = await pegarTokenUsuario();
			const formData = new FormData();
			
			// Mapeamento correto dos métodos de pagamento
			const metodosPagamentoParaEnviar = {
				dinheiro: metodos_pagamento.dinheiro || false,
				cartaoCredito: metodos_pagamento.cartao_credito || false,
				cartaoDebito: metodos_pagamento.cartao_debito || false,
				pix: metodos_pagamento.pix || false,
				transferencia: metodos_pagamento.transferencia || false,
				boleto: metodos_pagamento.boleto || false
			};

			// Adicionando todos os campos ao formData
			formData.append('userId', authUser?.uid || '');
			formData.append('nome', nome);
			formData.append('email', email);
			formData.append('endereco', endereco);
			formData.append('telefone', telefone);
			formData.append('categoria', categoria);
			formData.append('subcategoria', subcategoria);
			formData.append('descricao', descricao);
			formData.append('instagram', instagram);
			formData.append('facebook', facebook);
			formData.append('whatsapp', whatsapp);
			formData.append('website', website);
			formData.append('plano', comercio.plano);
			formData.append('metodos_pagamento', JSON.stringify(metodosPagamentoParaEnviar));
			formData.append('horarios_funcionamento', JSON.stringify(horarios_funcionamento));

			// Adicionando fotos ao formData
			if (selectedFiles && selectedFiles.length > 0) {
				Array.from(selectedFiles).forEach((file) => {
					formData.append('fotos', file);
				});
				formData.append('num_fotos', selectedFiles.length.toString());
			}

			console.log('Enviando dados para atualização:', {
				userId: authUser?.uid,
				nome,
				email,
				metodos_pagamento: metodosPagamentoParaEnviar
			});

			const response = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/atualizar-comercio/${authUser?.uid}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Erro: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			console.log('Resposta do servidor após atualização:', data);
			
			if (data && data.comerciante) {
				// Recarregar os dados do comércio para garantir que tudo está atualizado
				if (authUser) {
					await carregarDadosComercio(authUser.uid);
				}

				// Limpar arquivos selecionados
				selectedFile = null;
				selectedFiles = null;

				// Exibir mensagem de sucesso
				successMessage = 'Dados do comércio atualizados com sucesso!';
				setTimeout(() => {
					successMessage = '';
				}, 3000);

				// Fechar o modo de edição
				isEditingPerfil = false;
			}
		} catch (error) {
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

					<div class="sm:col-span-3">
						<label
							for="subcategoria"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Subcategoria
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="subcategoria"
								bind:value={comercio.subcategoria}
								placeholder="Ex: Restaurante, Barbearia, Farmácia..."
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
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
						<label
							for="plano"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Plano
						</label>
						<div class="mt-1">
							<select
								id="plano"
								bind:value={comercio.plano}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								disabled
							>
								<option value="Básico">Básico</option>
								<option value="Premium">Premium</option>
								<option value="Empresarial">Empresarial</option>
							</select>
							<p class="mt-1 text-xs text-gray-500">O plano é gerenciado pelas assinaturas e não pode ser alterado aqui.</p>
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

					<div class="sm:col-span-3">
						<label
							for="instagram"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Instagram
						</label>
						<div class="mt-1 relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Instagram class="h-5 w-5 text-pink-500" />
							</div>
							<input
								type="text"
								id="instagram"
								bind:value={comercio.instagram}
								placeholder="@seuinstagram"
								class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="facebook"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Facebook
						</label>
						<div class="mt-1 relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Facebook class="h-5 w-5 text-blue-600" />
							</div>
							<input
								type="text"
								id="facebook"
								bind:value={comercio.facebook}
								placeholder="facebook.com/suapagina"
								class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="whatsapp"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							WhatsApp
						</label>
						<div class="mt-1 relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Smartphone class="h-5 w-5 text-green-500" />
							</div>
							<input
								type="text"
								id="whatsapp"
								bind:value={comercio.whatsapp}
								placeholder="(xx) xxxxx-xxxx"
								class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="website"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Website
						</label>
						<div class="mt-1 relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Globe class="h-5 w-5 text-indigo-500" />
							</div>
							<input
								type="text"
								id="website"
								bind:value={comercio.website}
								placeholder="www.seusite.com.br"
								class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							/>
						</div>
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
									<span>Selecionar Fotos</span>
									<input
										id="foto-upload"
										name="foto-upload"
										type="file"
										accept="image/*"
										multiple
										class="sr-only"
										on:change={handleFileUpload}
									/>
								</label>

								{#if selectedFiles && selectedFiles.length > 0}
									<button
										type="button"
										on:click={aplicarFotos}
										class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Aplicar {selectedFiles.length > 1 ? selectedFiles.length + ' Fotos' : 'Foto'}
									</button>

									<p class="mt-1 w-full text-sm text-amber-600 dark:text-amber-400">
										Importante: Clique em "Aplicar Foto" para visualizar as imagens antes de salvar.
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

					<div class="sm:col-span-6">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Métodos de Pagamento
						</label>
						<div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
							<div class="flex items-center">
								<input
									id="dinheiro"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.dinheiro}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="dinheiro" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Dinheiro
								</label>
							</div>
							<div class="flex items-center">
								<input
									id="cartao_credito"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.cartao_credito}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="cartao_credito" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Cartão de Crédito
								</label>
							</div>
							<div class="flex items-center">
								<input
									id="cartao_debito"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.cartao_debito}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="cartao_debito" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Cartão de Débito
								</label>
							</div>
							<div class="flex items-center">
								<input
									id="pix"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.pix}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="pix" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Pix
								</label>
							</div>
							<div class="flex items-center">
								<input
									id="transferencia"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.transferencia}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="transferencia" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Transferência
								</label>
							</div>
							<div class="flex items-center">
								<input
									id="boleto"
									type="checkbox"
									bind:checked={comercio.metodos_pagamento.boleto}
									class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<label for="boleto" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
									Boleto
								</label>
							</div>
						</div>
					</div>

					<div class="sm:col-span-6">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Horários de Funcionamento
						</label>
						<div class="mt-2 space-y-3">
							{#each comercio.horarios_funcionamento as horario}
								<div class="flex flex-wrap items-center gap-2">
									<div class="w-24">
										<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
											{horario.dia.charAt(0).toUpperCase() + horario.dia.slice(1)}:
										</span>
									</div>
									<div class="flex items-center">
										<input
											id={`aberto-${horario.dia}`}
											type="checkbox"
											bind:checked={horario.aberto}
											class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
										/>
										<label for={`aberto-${horario.dia}`} class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
											Aberto
										</label>
									</div>

									{#if horario.aberto}
										<div class="flex items-center gap-2">
											<input
												type="time"
												bind:value={horario.abertura}
												class="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
											/>
											<span class="text-gray-500">até</span>
											<input
												type="time"
												bind:value={horario.fechamento}
												class="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
											/>
										</div>
									{:else}
										<span class="text-sm text-gray-500 dark:text-gray-400">Fechado</span>
									{/if}
								</div>
							{/each}
						</div>
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
								comercio.categoria,
								comercio.subcategoria,
								comercio.descricao,
								comercio.instagram,
								comercio.facebook,
								comercio.whatsapp,
								comercio.website,
								comercio.metodos_pagamento,
								comercio.horarios_funcionamento
							)}
						class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
					>
						{#if selectedFiles && selectedFiles.length > 0}
							<Image class="mr-2 h-4 w-4" />
							Salvar com fotos
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
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Subcategoria</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.subcategoria || 'Não informado'}
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
							<div class="space-y-1">
								{#each comercio.horarios_funcionamento as horario}
									<div class="flex items-center gap-2">
										<span class="w-24 font-medium">
											{horario.dia.charAt(0).toUpperCase() + horario.dia.slice(1)}:
										</span>
										{#if horario.aberto}
											<span class="text-green-600 dark:text-green-400">
												{horario.abertura} - {horario.fechamento}
											</span>
										{:else}
											<span class="text-red-500">Fechado</span>
										{/if}
									</div>
								{/each}
							</div>
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Métodos de Pagamento</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							<div class="flex flex-wrap gap-2">
								{#if comercio?.metodos_pagamento?.dinheiro}
									<span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
										Dinheiro
									</span>
								{/if}
								{#if comercio?.metodos_pagamento?.cartao_credito}
									<span class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
										Cartão de Crédito
									</span>
								{/if}
								{#if comercio?.metodos_pagamento?.cartao_debito}
									<span class="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
										Cartão de Débito
									</span>
								{/if}
								{#if comercio?.metodos_pagamento?.pix}
									<span class="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
										Pix
									</span>
								{/if}
								{#if comercio?.metodos_pagamento?.transferencia}
									<span class="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
										Transferência
									</span>
								{/if}
								{#if comercio?.metodos_pagamento?.boleto}
									<span class="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
										Boleto
									</span>
								{/if}
								{#if !comercio?.metodos_pagamento || !Object.values(comercio.metodos_pagamento).some(v => v)}
									<span class="text-gray-500 dark:text-gray-400">Nenhum método informado</span>
								{/if}
							</div>
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
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Instagram</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<Instagram class="mr-1 h-4 w-4 text-pink-500" />
							{comercio.instagram || 'Não informado'}
						</dd>
					</div>
					<div class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Facebook</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<Facebook class="mr-1 h-4 w-4 text-blue-600" />
							{comercio.facebook || 'Não informado'}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">WhatsApp</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<Smartphone class="mr-1 h-4 w-4 text-green-500" />
							{comercio.whatsapp || 'Não informado'}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
						<dd
							class="mt-1 flex items-center text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0"
						>
							<Globe class="mr-1 h-4 w-4 text-indigo-500" />
							{comercio.website || 'Não informado'}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Plano</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							<span
								class="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
							>
								{comercio.plano}
							</span>
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 dark:bg-gray-700 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</dt>
						<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
							{comercio.descricao || 'Nenhuma descrição fornecida.'}
						</dd>
					</div>
					<div class="bg-white px-4 py-5 dark:bg-gray-800 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
				</dl>
			</div>
		{/if}
	</div>
</div>
