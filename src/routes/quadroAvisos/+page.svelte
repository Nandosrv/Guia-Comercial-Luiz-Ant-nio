<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	import supabase from '$lib/supabaseClient';
	import { userStore } from '../../stores/userStore.svelte';
	import { onMount } from 'svelte';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { uploadPicturesAnnounce } from '$lib/services/uploadSupabase';

	onMount(() => {
			setLastPathUrl($page.url.pathname);
	});

	let user = $state(userStore.value);
	if (!user) {
			console.error('Usuário não autenticado');
	}

	type Anuncio = {
			id: number;
			nome: string;
			telefone: string;
			tipo: string;
			conteudo: string;
			foto: string | null;
			resolvido: boolean;
			user_id: string;
	};

	type Feedback = {
			message: string;
			type: 'success' | 'error' | '';
	};

	let feedback = $state<Feedback>({ message: '', type: '' });
	let anuncios = $state<Anuncio[]>([]);
	let filtroSelecionado = $state('Todos');
	let modalAberto = $state(false);
	let carregando = $state(true);
	let formErrors = $state({ nome: '', telefone: '', conteudo: '' });

	let novoAnuncio = $state<Omit<Anuncio, 'id'>>({
			nome: '',
			telefone: '',
			tipo: 'Vendo',
			conteudo: '',
			foto: null,
			resolvido: false,
			user_id: user?.userId || ''
	});

	let fotoPreview = $state<string | null>(null);
	let fotoPreviewFile = $state<File | null>(null);

	function showFeedback(message: string, type: 'success' | 'error') {
			feedback = { message, type };
			setTimeout(() => {
					feedback = { message: '', type: '' };
			}, 3000);
	}

	async function carregarAnuncios() {
			carregando = true;
			const { data, error } = await supabase
					.from('anuncios')
					.select('*')
					.order('id', { ascending: false });

			carregando = false;
			if (error) {
					console.error('Erro ao carregar anúncios:', error);
					showFeedback('Erro ao carregar anúncios. Por favor, tente novamente.', 'error');
					anuncios = [];
			} else if (!data || data.length === 0) {
					showFeedback('Nenhum anúncio encontrado.', 'error');
					anuncios = [];
			} else {
					anuncios = data;
					showFeedback('Anúncios carregados com sucesso!', 'success');
			}
	}

	async function poostarAnuncio() {
			if (!user) {
					showFeedback('Usuário não autenticado', 'error');
					return;
			}

			// Reset errors
			formErrors = { nome: '', telefone: '', conteudo: '' };

			// Validações
			if (!novoAnuncio.nome.trim()) {
					formErrors.nome = 'Nome é obrigatório';
			}
			if (!novoAnuncio.telefone.trim()) {
					formErrors.telefone = 'Telefone é obrigatório';
			}
			if (!novoAnuncio.conteudo.trim()) {
					formErrors.conteudo = 'Conteúdo é obrigatório';
			}

			if (formErrors.nome || formErrors.telefone || formErrors.conteudo) {
					showFeedback('Por favor, preencha todos os campos obrigatórios', 'error');
					return;
			}

			try {
					let pathFotoPreview: string | null = null;
					if (fotoPreviewFile) {
							pathFotoPreview = await uploadPicturesAnnounce(fotoPreviewFile, user.userId);
					}

					const { error } = await supabase.from('anuncios').insert([
							{
									...novoAnuncio,
									foto: pathFotoPreview,
									user_id: user.userId
							}
					]);

					if (error) throw error;

					showFeedback('Anúncio publicado com sucesso!', 'success');
					await carregarAnuncios();
					fecharModal();
			} catch (error) {
					console.error('Erro ao postar anúncio:', error);
					showFeedback('Erro ao publicar anúncio. Tente novamente.', 'error');
			}
	}

	async function marcarComoResolvido(id: number, user_id: string) {
			if (user?.userId !== user_id) {
					showFeedback('Você não tem permissão para marcar este anúncio como resolvido', 'error');
					return;
			}

			try {
					const { error } = await supabase.from('anuncios').update({ resolvido: true }).eq('id', id);
					if (error) throw error;

					showFeedback('Anúncio marcado como resolvido com sucesso!', 'success');
					await carregarAnuncios();
			} catch (error) {
					console.error('Erro ao marcar como resolvido:', error);
					showFeedback('Erro ao marcar anúncio como resolvido', 'error');
			}
	}

	function filtrarAnuncios(anuncios: Anuncio[], filtro: string) {
			if (filtro === 'Todos') return anuncios;
			if (filtro === 'Ativos') return anuncios.filter((anuncio) => !anuncio.resolvido);
			if (filtro === 'Resolvidos') return anuncios.filter((anuncio) => anuncio.resolvido);
			return anuncios.filter((anuncio) => anuncio.tipo === filtro);
	}

	function abrirModal() {
			modalAberto = true;
	}

	function fecharModal() {
			modalAberto = false;
			novoAnuncio = {
					nome: '',
					telefone: '',
					tipo: 'Vendo',
					conteudo: '',
					foto: null,
					resolvido: false,
					user_id: user?.userId || ''
			};
			fotoPreview = null;
			fotoPreviewFile = null;
			formErrors = { nome: '', telefone: '', conteudo: '' };
	}

	function handleFileChange(event: Event) {
			const target = event.target as HTMLInputElement;
			const file = target.files?.[0];
			if (file) {
					if (file.size > 5 * 1024 * 1024) { // 5MB limit
							showFeedback('A imagem deve ter menos de 5MB', 'error');
							return;
					}
					const reader = new FileReader();
					reader.onload = (e) => {
							fotoPreviewFile = file;
							fotoPreview = e.target?.result as string;
					};
					reader.readAsDataURL(file);
			}
	}

	const tiposAnuncio = ['Vendo', 'Procuro emprego', 'Achados e perdidos'];

			// Adicione estas funções no script
let editandoAnuncio = $state<Anuncio | null>(null);

async function excluirAnuncio(id: number, user_id: string) {
		if (user?.userId !== user_id) {
				showFeedback('Você não tem permissão para excluir este anúncio', 'error');
				return;
		}

		try {
				const { error } = await supabase
						.from('anuncios')
						.delete()
						.eq('id', id);

				if (error) throw error;

				showFeedback('Anúncio excluído com sucesso!', 'success');
				await carregarAnuncios();
		} catch (error) {
				console.error('Erro ao excluir anúncio:', error);
				showFeedback('Erro ao excluir anúncio', 'error');
		}
}

function editarAnuncio(anuncio: Anuncio) {
		if (user?.userId !== anuncio.user_id) {
				showFeedback('Você não tem permissão para editar este anúncio', 'error');
				return;
		}
		
		editandoAnuncio = anuncio;
		novoAnuncio = {
				nome: anuncio.nome,
				telefone: anuncio.telefone,
				tipo: anuncio.tipo,
				conteudo: anuncio.conteudo,
				foto: anuncio.foto,
				resolvido: anuncio.resolvido,
				user_id: anuncio.user_id
		};
		modalAberto = true;
}

// Modifique a função postarAnuncio para lidar com edição
async function postarAnuncio() {
		if (!user) {
				showFeedback('Usuário não autenticado', 'error');
				return;
		}

		// Reset errors
		formErrors = { nome: '', telefone: '', conteudo: '' };

		// Validações
		if (!novoAnuncio.nome.trim()) {
				formErrors.nome = 'Nome é obrigatório';
		}
		if (!novoAnuncio.telefone.trim()) {
				formErrors.telefone = 'Telefone é obrigatório';
		}
		if (!novoAnuncio.conteudo.trim()) {
				formErrors.conteudo = 'Conteúdo é obrigatório';
		}

		if (formErrors.nome || formErrors.telefone || formErrors.conteudo) {
				showFeedback('Por favor, preencha todos os campos obrigatórios', 'error');
				return;
		}

		try {
				let pathFotoPreview: string | null = novoAnuncio.foto;
				if (fotoPreviewFile) {
						pathFotoPreview = await uploadPicturesAnnounce(fotoPreviewFile, user.userId);
				}

				if (editandoAnuncio) {
						// Atualizar anúncio existente
						const { error } = await supabase
								.from('anuncios')
								.update({
										...novoAnuncio,
										foto: pathFotoPreview
								})
								.eq('id', editandoAnuncio.id);

						if (error) throw error;
						showFeedback('Anúncio atualizado com sucesso!', 'success');
				} else {
						// Criar novo anúncio
						const { error } = await supabase.from('anuncios').insert([
								{
										...novoAnuncio,
										foto: pathFotoPreview,
										user_id: user.userId
								}
						]);

						if (error) throw error;
						showFeedback('Anúncio publicado com sucesso!', 'success');
				}

				await carregarAnuncios();
				fecharModal();
		} catch (error) {
				console.error('Erro ao salvar anúncio:', error);
				showFeedback('Erro ao salvar anúncio. Tente novamente.', 'error');
		}
}

// Modifique a função fecharModal para resetar o editandoAnuncio
function feecharModal() {
		modalAberto = false;
		editandoAnuncio = null;
		novoAnuncio = {
				nome: '',
				telefone: '',
				tipo: 'Vendo',
				conteudo: '',
				foto: null,
				resolvido: false,
				user_id: user?.userId || ''
		};
		fotoPreview = null;
		fotoPreviewFile = null;
		formErrors = { nome: '', telefone: '', conteudo: '' };
}
	carregarAnuncios();
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
	<div class="mx-auto max-w-6xl">
			{#if feedback.message}
					<div
							class="mb-4 rounded-lg p-4 text-center {feedback.type === 'success'
									? 'bg-green-100 text-green-700'
									: 'bg-red-100 text-red-700'}"
							transition:fade
					>
							{feedback.message}
					</div>
			{/if}

			<h1 class="mb-6 text-center text-3xl font-bold text-blue-800 md:mb-8 md:text-4xl lg:text-5xl">
					Quadro de Anúncios
			</h1>

			<div class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row md:mb-8">
					<div class="w-full sm:w-auto">
							<label for="filtro" class="mb-2 block text-lg font-semibold text-gray-700 sm:mb-0 sm:mr-2"
									>Filtrar por:</label
							>
							<select
									id="filtro"
									bind:value={filtroSelecionado}
									class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
							>
									<option>Todos</option>
									<option>Ativos</option>
									<option>Resolvidos</option>
									{#each tiposAnuncio as tipo}
											<option>{tipo}</option>
									{/each}
							</select>
					</div>
					<!-- svelte-ignore event_directive_deprecated -->
					<button
							on:click={abrirModal}
							class="w-full transform rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:w-auto"
							disabled={!user}
					>
							Postar Novo Anúncio
					</button>
			</div>

			{#if carregando}
					<div class="flex justify-center">
							<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
					</div>
			{:else}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
							{#each filtrarAnuncios(anuncios, filtroSelecionado) as anuncio (anuncio.id)}
									<div
											in:fly={{ y: 50, duration: 300 }}
											out:fade={{ duration: 300 }}
											class="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
									>
											{#if anuncio.resolvido}
													<div
															class="absolute right-0 top-0 z-10 rounded-bl-lg bg-green-500 px-2 py-1 text-sm text-white"
													>
															Resolvido
													</div>
											{/if}
											{#if anuncio.foto}
													<img
															src={anuncio.foto}
															alt="Imagem do anúncio"
															class="h-48 w-full object-cover"
															loading="lazy"
													/>
											{/if}
											<div class="flex-grow p-4">
													<h2 class="mb-2 text-xl font-semibold text-blue-800 md:text-2xl">{anuncio.tipo}</h2>
													<p class="mb-4 text-sm text-gray-600 md:text-base">{anuncio.conteudo}</p>
													<div class="mb-2 flex items-center justify-between text-xs text-gray-500 md:text-sm">
															<span>{anuncio.nome}</span>
															<a href="tel:{anuncio.telefone}" class="text-blue-400">{anuncio.telefone}</a>
													</div>
											</div>
											<!-- // No HTML, adicione os botões de editar e excluir dentro do card do anúncio -->
<!-- // Adicione isso antes do botão "Marcar como Resolvido": -->

{#if anuncio.user_id === user?.userId}
		<div class="flex justify-end gap-2 px-4 pb-2">
				<!-- svelte-ignore event_directive_deprecated -->
				<button
						on:click={() => editarAnuncio(anuncio)}
						class="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				>
						Editar
				</button>
				<!-- svelte-ignore event_directive_deprecated -->
				<button
						on:click={() => excluirAnuncio(anuncio.id, anuncio.user_id)}
						class="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
				>
						Excluir
				</button>
		</div>
{/if}

<!-- // Atualize o título do modal para refletir se está editando ou criando -->
<!-- <h2 class="mb-6 text-2xl font-bold text-blue-800 md:text-3xl">
		{editandoAnuncio ? 'Editar Anúncio' : 'Novo Anúncio'}
</h2> -->

<!-- // Atualize o texto do botão de submit -->
<!-- <button
		type="submit"
		class="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
>
		{editandoAnuncio ? 'Salvar Alterações' : 'Publicar Anúncio'}
</button> -->
											{#if !anuncio.resolvido && anuncio.user_id === user?.userId}
													<!-- svelte-ignore event_directive_deprecated -->
													<button
															on:click={() => marcarComoResolvido(anuncio.id, anuncio.user_id)}
															class="flex w-full items-center justify-center bg-green-500 px-4 py-2 text-sm font-bold text-white transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 md:text-base"
													>
															Marcar como Resolvido
													</button>
											{/if}
									</div>
							{/each}
					</div>
			{/if}
	</div>

	{#if modalAberto}
			<div
					transition:fade={{ duration: 300 }}
					class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4"
			>
					<div
							in:fly={{ y: -50, duration: 300, delay: 150, easing: quintOut }}
							out:fly={{ y: 50, duration: 300, easing: quintOut }}
							class="mx-auto w-full max-w-md rounded-lg bg-white shadow-2xl"
					>
							<div class="p-6">
									<h2 class="mb-6 text-2xl font-bold text-blue-800 md:text-3xl">Novo Anúncio</h2>
									<!-- svelte-ignore event_directive_deprecated -->
									<form on:submit|preventDefault={postarAnuncio} class="space-y-4">
											<div>
													<label for="nome" class="mb-1 block text-sm font-medium text-gray-700">Nome:</label>
													<input
															id="nome"
															bind:value={novoAnuncio.nome}
															type="text"
															class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 {formErrors.nome
																	? 'border-red-500'
																	: ''}"
															placeholder="Nome do Anunciante"
													/>
													{#if formErrors.nome}
															<p class="mt-1 text-sm text-red-500">{formErrors.nome}</p>
													{/if}
											</div>

											<div>
													<label for="tipo" class="mb-1 block text-sm font-medium text-gray-700"
															>Tipo de Anúncio:</label
													>
													<select
															id="tipo"
															bind:value={novoAnuncio.tipo}
															class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
													>
															{#each tiposAnuncio as tipo}
																	<option value={tipo}>{tipo}</option>
															{/each}
													</select>
											</div>

											<div>
													<label for="telefone" class="mb-1 block text-sm font-medium text-gray-700"
															>Telefone:</label
													>
													<input
															id="telefone"
															bind:value={novoAnuncio.telefone}
															type="tel"
															class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 {formErrors.telefone
																	? 'border-red-500'
																	: ''}"
															placeholder="Telefone"
													/>
													{#if formErrors.telefone}
															<p class="mt-1 text-sm text-red-500">{formErrors.telefone}</p>
													{/if}
											</div>

											<div>
													<label for="conteudo" class="mb-1 block text-sm font-medium text-gray-700"
															>Conteúdo do anúncio:</label
													>
													<textarea
															id="conteudo"
															bind:value={novoAnuncio.conteudo}
															class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 {formErrors.conteudo
																	? 'border-red-500'
																	: ''}"
															placeholder="Descrição do anúncio"
													></textarea>
													{#if formErrors.conteudo}
															<p class="mt-1 text-sm text-red-500">{formErrors.conteudo}</p>
													{/if}
											</div>

											<div>
													<label for="foto" class="mb-1 block text-sm font-medium text-gray-700"
															>Carregar foto (opcional):</label
													>
													<input
															id="foto"
															type="file"
															accept="image/*"
															on:change={handleFileChange}
															class="w-full text-sm text-gray-600 file:rounded-lg file:border file:border-gray-300 file:bg-blue-100 file:px-4 file:py-2 file:text-blue-700"
													/>
													{#if fotoPreview}
															<div class="mt-4">
																	<img
																			src={fotoPreview}
																			alt="Preview da Foto"
																			class="h-48 w-full rounded-lg object-cover"
																	/>
															</div>
													{/if}
											</div>

											<div class="flex items-center justify-between">
													<button
															type="button"
															on:click={fecharModal}
															class="text-sm font-medium text-gray-500 hover:text-gray-700 md:text-base"
													>
															Fechar
													</button>
													<button
															type="submit"
															class="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
													>
															Publicar Anúncio
													</button>
											</div>
									</form>
							</div>
					</div>
			</div>
	{/if}
</main>