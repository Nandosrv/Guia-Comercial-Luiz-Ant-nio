<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	import { uploadPicturesAnnounce } from '$lib/serve/uploadPicturesAnnounce';
	import supabase from '$lib/supabaseClient';
	import { userStore } from '../../stores/userStore.svelte';
	import { onMount } from 'svelte';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';

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

	let anuncios = $state<Anuncio[]>([]);
	let filtroSelecionado = $state('Todos');
	let modalAberto = $state(false);
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

	// Função para carregar os anúncios do banco de dados
	let carregando = true;

	async function carregarAnuncios() {
		carregando = true;
		const { data, error } = await supabase
			.from('anuncios')
			.select('*')
			.order('id', { ascending: true });
		carregando = false;
		if (error) {
			console.error('Erro ao carregar anúncios:', error);
		} else {
			anuncios = data || [];
		}
	}

	// Função para postar um novo anúncio
	async function postarAnuncio() {
		if (!user) {
			console.error('Usuário não autenticado');
			return;
		}
		let pathFotoPreview: string | null = null;
		if (fotoPreviewFile) {
			pathFotoPreview = await uploadPicturesAnnounce(fotoPreviewFile, user.userId);
		}
		const { data, error } = await supabase.from('anuncios').insert([
			{
				...novoAnuncio,
				foto: pathFotoPreview,
				user_id: user.userId // Adicionando o user_id ao anúncio
			}
		]);

		if (error) {
			console.error('Erro ao postar anúncio:', error);
		} else {
			carregarAnuncios();
			fecharModal();
		}
	}

	// Função para marcar um anúncio como resolvido
	async function marcarComoResolvido(id: number, user_id: string) {
		// Verifica se o usuário logado é o mesmo que postou o anúncio
		if (user?.userId !== user_id) {
			console.error('Você não tem permissão para marcar este anúncio como resolvido');
			return;
		}

		const { error } = await supabase.from('anuncios').update({ resolvido: true }).eq('id', id);
		if (error) {
			console.error('Erro ao marcar como resolvido:', error);
		} else {
			carregarAnuncios();
		}
	}

	// Função para filtrar os anúncios
	function filtrarAnuncios(anuncios: Anuncio[], filtro: string) {
		if (filtro === 'Todos') return anuncios;
		if (filtro === 'Ativos') return anuncios.filter((anuncio) => !anuncio.resolvido);
		if (filtro === 'Resolvidos') return anuncios.filter((anuncio) => anuncio.resolvido);
		return anuncios.filter((anuncio) => anuncio.tipo === filtro);
	}

	// Funções para modal
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
	}

	// Pré-visualização da foto
	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				fotoPreviewFile = file;
			};
			reader.readAsDataURL(file);
		}
	}

	// Categorias de anúncios
	const tiposAnuncio = ['Vendo', 'Procuro emprego', 'Achados e perdidos'];

	// Carregar anúncios ao inicializar
	carregarAnuncios();
</script>

<!-- Código HTML -->
<main class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
	<div class="mx-auto max-w-6xl">
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
			<button
				onclick={abrirModal}
				class="w-full transform rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:w-auto"
			>
				Postar Novo Anúncio
			</button>
		</div>

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
					{#if !anuncio.resolvido && anuncio.user_id === user?.userId}
						<button
							onclick={() => marcarComoResolvido(anuncio.id, anuncio.user_id)}
							class="flex w-full items-center justify-center bg-green-500 px-4 py-2 text-sm font-bold text-white transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 md:text-base"
						>
							Marcar como Resolvido
						</button>
					{/if}
				</div>
			{/each}
		</div>
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
					<form onsubmit={postarAnuncio} name="" class="space-y-4">
						<div>
							<label for="nme" class="mb-1 block text-sm font-medium text-gray-700">Nome:</label>
							<input
								id="nome"
								bind:value={novoAnuncio.nome}
								type="text"
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Nome do Anunciante"
							/>
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
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Telefone"
							/>
						</div>

						<div>
							<label for="conteudo" class="mb-1 block text-sm font-medium text-gray-700"
								>Conteúdo do anúncio:</label
							>
							<textarea
								id="conteudo"
								bind:value={novoAnuncio.conteudo}
								class="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Descrição do anúncio"
							></textarea>
						</div>

						<div>
							<label for="foto" class="mb-1 block text-sm font-medium text-gray-700"
								>Carregar foto (opcional):</label
							>
							<input
								id="foto"
								type="file"
								accept="image/*"
								onchange={handleFileChange}
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
								onclick={fecharModal}
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
