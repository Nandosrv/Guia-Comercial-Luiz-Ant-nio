<script lang="ts">
	import Camera from '$lib/images/icons8-câmera-50.png';
	import Galeria from '$lib/images/icons8-galeria-25.png';
	import { onMount } from 'svelte';
	import { userStore } from '../../stores/userStore.svelte';
	import supabase from '../supabaseClient';
	import { auth } from '$lib/firebase/client';
	import { onAuthStateChanged } from 'firebase/auth';
	import type { User } from '$lib/types/userStore';

	let inputValue = $state('');
	let showModal = $state(false);
	let selectedFile = $state<string | null>('');
	let posts = $state<any[]>([]);
	let showCommentModal = $state(false);
	let postIndex = $state<Number | null>(null);
	let commentText = $state('');
	let modalImage = $state('');
	let showImageModal = $state(false);
	let isLoading = $state(true);

	const currentUser = $derived(userStore.value);

	// Função para carregar as postagens e seus comentários
	const loadPosts = async () => {
		try {
			console.log('Carregando posts...');
			const { data, error } = await supabase
				.from('postss')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Erro ao carregar postagens:', error);
				return;
			}

			// console.log('Posts carregados:', data);

			// Carregar comentários de cada post
			for (let post of data || []) {
				try {
					const { data: comments, error: commentError } = await supabase
						.from('comments')
						.select('*')
						.eq('post_id', post.id);

					if (commentError) {
						console.error('Erro ao carregar comentários:', commentError);
						post.comments = [];
						continue;
					}

					post.comments = comments || [];
					post.showComments = false;
				} catch (err) {
					console.error('Erro ao processar comentários:', err);
					post.comments = [];
				}
			}

			posts = data || [];
		} catch (err) {
			console.error('Erro ao carregar posts:', err);
			posts = [];
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		loadPosts();
	});

	// Função para abrir a galeria e carregar uma imagem
	function openGallery() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.click();

		input.onchange = (event: Event) => {
			const target = event.target as HTMLInputElement;
			const file = target?.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					selectedFile = reader.result as string;
					showModal = true;
				};
				reader.readAsDataURL(file);
			}
		};
	}

	// Função para criar uma nova postagem
	const postContent = async () => {
		if (inputValue.trim() !== '') {
			const newPost = {
				user_name: currentUser.name,
				user_avatar: currentUser.photoURL,
				text: inputValue,
				image_url: selectedFile ? selectedFile : null,
				likes: 0,
				comments: []
			};

			const { data, error } = await supabase.from('postss').insert([newPost]);
			// console.log('Postagem criada:', data);
			if (error) {
				console.error('Erro ao criar a postagem:', error);
			} else {
				loadPosts();
				inputValue = '';
				selectedFile = null;
				showModal = false;
			}
		}
	};

	// Função para curtir uma postagem
	const likePost = async (index: number) => {
		const post = posts[index];
		const { data, error } = await supabase
			.from('postss')
			.update({ likes: post.likes + 1 })
			.match({ id: post.id });

		if (error) {
			console.error('Erro ao curtir a postagem:', error);
		} else {
			posts[index].likes += 1;
		}
	};

	// Função para abrir/fechar os comentários
	const toggleComments = (index: number) => {
		posts[index].showComments = !posts[index].showComments;
	};

	// Função para adicionar um comentário
	const addComment = async (index: number) => {
		if (commentText.trim() !== '') {
			const post = posts[index];
			const postId = post.id;

			const comment = {
				user_id: currentUser.name,
				perfil_id: currentUser.userId,
				text: commentText,
				post_id: postId,
				created_at: new Date().toISOString(),
				avatar: currentUser.photoURL
			};

			console.log('Adicionando comentário:', comment);

			const { data, error } = await supabase.from('comments').insert([comment]);

			if (error) {
				console.error('Erro ao adicionar comentário:', error);
			} else {
				console.log('Comentário adicionado com sucesso:', data);
				await loadPosts();
				commentText = '';
			}
		}
	};

	// Função para abrir o modal da imagem
	const openImageModal = (image_url: any) => {
		modalImage = image_url;
		showImageModal = true;
	};

	// Função para fechar o modal da imagem
	const closeImageModal = () => {
		showImageModal = false;
		modalImage = '';
	};

	// Função para formatar o timestamp
	function formatTimestamp(timestamp: string) {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		
		// Menos de 1 minuto
		if (diff < 60000) {
			return 'Agora mesmo';
		}
		
		// Menos de 1 hora
		if (diff < 3600000) {
			const minutes = Math.floor(diff / 60000);
			return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
		}
		
		// Menos de 24 horas
		if (diff < 86400000) {
			const hours = Math.floor(diff / 3600000);
			return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
		}
		
		// Menos de 7 dias
		if (diff < 604800000) {
			const days = Math.floor(diff / 86400000);
			return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
		}
		
		// Mais de 7 dias, mostrar a data completa
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<main class="mt-4 flex w-full flex-col items-center bg-gray-50 min-h-screen pb-8">
	{#if currentUser && currentUser.userId}
		<!-- Área de criação de postagem -->
		<div class="w-[90%] max-w-[600px] rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
			<div class="flex items-center space-x-4">
				<a href="/perfil" class="hover:opacity-80 transition-opacity">
					<img
						src={currentUser.photoURL || '/default-avatar.png'}
						alt={currentUser.name}
						class="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
					/>
				</a>
				<input
					type="text"
					placeholder="O que você está pensando, {currentUser.name.split(' ')[0]}?"
					bind:value={inputValue}
					onfocus={() => (showModal = true)}
					class="w-full rounded-full bg-gray-100 px-6 py-3 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:shadow-md"
				/>
			</div>
			<div class="mt-4 flex justify-between border-t border-gray-100 pt-4">
				<button
					class="flex items-center space-x-3 rounded-lg px-6 py-2.5 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
					onclick={openGallery}
				>
					<img src={Galeria} alt="Galeria" class="h-6 w-6" />
					<span class="font-medium">Galeria</span>
				</button>
				
				<button
					class="flex items-center space-x-3 rounded-lg px-6 py-2.5 text-green-600 hover:bg-green-50 transition-colors duration-200"
					onclick={() => alert('Acessando a câmera do dispositivo...')}
				>
					<img src={Camera} alt="Câmera" class="h-6 w-6" />
					<span class="font-medium">Câmera</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Modal de criação de postagem -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
			<div class="w-[90%] max-w-[500px] rounded-xl bg-white p-6 shadow-2xl transform transition-all duration-300">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-800">Criar Publicação</h2>
					<button 
						class="text-gray-500 hover:text-gray-700 transition-colors"
						onclick={() => {
							showModal = false;
							inputValue = '';
							selectedFile = null;
						}}
					>
						<span class="text-2xl">&times;</span>
					</button>
				</div>
				{#if selectedFile}
					<div class="relative mb-4">
						<img
							src={selectedFile}
							alt="Pré-visualização"
							class="w-full rounded-lg object-cover max-h-[300px]"
						/>
						<button 
							class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
							onclick={() => selectedFile = null}
						>
							<span class="text-lg">&times;</span>
						</button>
					</div>
				{/if}
				<textarea
					placeholder="O que está acontecendo?"
					bind:value={inputValue}
					class="w-full rounded-lg border border-gray-300 p-4 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
				></textarea>
				<div class="flex justify-end space-x-4 mt-6">
					<button
						class="rounded-lg bg-gray-200 px-6 py-2.5 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium"
						onclick={() => {
							showModal = false;
							inputValue = '';
							selectedFile = null;
						}}
					>
						Cancelar
					</button>
					<button
						class="rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
						onclick={postContent}
					>
						Publicar
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Feed de postagens -->
	<section class="mt-8 w-[90%] max-w-[600px] space-y-6">
		{#if isLoading}
			<div class="flex justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		{:else if posts.length === 0}
			<div class="bg-white rounded-xl p-8 text-center">
				<p class="text-gray-600">Nenhuma postagem encontrada. Seja o primeiro a postar!</p>
			</div>
		{:else}
			{#each posts as post, index (post.id)}
				<div class="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
					<div class="flex items-center space-x-4">
						<img
							src={post.user_avatar}
							alt={post.user_name}
							class="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
						/>
						<div>
							<span class="font-bold text-gray-800">{post.user_name}</span>
							<p class="text-sm text-gray-500">{formatTimestamp(post.created_at)}</p>
						</div>
					</div>
					<p class="mt-4 text-gray-700 text-lg leading-relaxed">{post.text}</p>
					{#if post.image_url}
						<div class="mt-4 rounded-lg overflow-hidden">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<img
								src={post.image_url}
								alt="Imagem do post"
								class="w-full rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
								onclick={() => openImageModal(post.image_url)}
							/>
						</div>
					{/if}
					<div class="mt-6 flex items-center space-x-8 border-t border-gray-100 pt-4">
						<button 
							onclick={() => likePost(index)} 
							class="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
						>
							<span class="text-2xl">❤️</span>
							<span class="font-medium">{post.likes}</span>
						</button>
						<button
							class="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
							onclick={() => toggleComments(index)}
						>
							<span class="text-2xl">💬</span>
							<span class="font-medium">{post.comments.length} Comentários</span>
						</button>
					</div>

					<!-- Exibir os comentários -->
					{#if post.showComments && post.comments.length > 0}
						<div class="mt-6 space-y-4 border-t border-gray-100 pt-4">
							{#each post.comments as comment}
								<div class="flex items-start space-x-4">
									<img
										src={comment.avatar || '/default-avatar.png'}
										alt={comment.user_id || 'Usuário'}
										class="h-10 w-10 rounded-full object-cover"
									/>
									<div class="bg-gray-50 rounded-lg p-3 flex-1">
										<div class="flex items-center justify-between">
											<p class="font-semibold text-gray-800">{comment.user_id}</p>
											<p class="text-xs text-gray-500">{formatTimestamp(comment.created_at)}</p>
										</div>
										<p class="text-gray-600 mt-1">{comment.text}</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Adicionar comentário -->
					{#if post.showComments}
						<div class="mt-6 border-t border-gray-100 pt-4">
							<textarea
								bind:value={commentText}
								placeholder="Adicione um comentário..."
								class="w-full rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
							></textarea>
							<button
								onclick={() => addComment(index)}
								class="mt-3 rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
							>
								Enviar
							</button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</section>

	<!-- Modal de imagem -->
	{#if showImageModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm" onclick={closeImageModal}>
		<div class="relative w-[90%] max-w-[800px] rounded-xl overflow-hidden" onclick={e => e.stopPropagation()}>
			<button
				aria-label="Fechar modal de imagem"
				class="absolute top-4 right-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:scale-105 active:scale-95"
				onclick={closeImageModal}
			>
				<span class="text-3xl">&times;</span>
			</button>
			<img 
				src={modalImage} 
				alt="Imagem do post" 
				class="w-full rounded-xl object-contain max-h-[80vh]" 
				loading="lazy" 
			/>
		</div>
	</div>
{/if}
</main>
