<script lang="ts">
	import { onMount } from 'svelte';
	import supabase from '../supabaseClient';
	import Galeria from '$lib/images/icons8-galeria-25.png';
	import Camera from '$lib/images/icons8-câmera-50.png';
	import gif from '$lib/images/icons8-gif-48.png';
	import { userStore } from '../../stores/userStore.svelte';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';

	let inputValue = $state('');
	let showModal = $state(false);
	let selectedFile = $state<string | null>('');
	let posts = $state<any[]>([]);
	let showCommentModal = $state(false);
	let postIndex = $state<Number | null>(null);
	let commentText = $state('');
	let modalImage = $state('');
	let showImageModal = $state(false);

	const currentUser = $derived(userStore.value);

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

	// Função para carregar as postagens e seus comentários
	const loadPosts = async () => {
		const { data, error } = await supabase
			.from('postss')
			.select('*')
			.order('created_at', { ascending: false });
		if (error) {
			console.error('Erro ao carregar postagens:', error);
		} else {
			// Carregar comentários de cada post
			for (let post of data) {
				const { data: comments, error: commentError } = await supabase
					.from('comments')
					.select('*')
					.eq('post_id', post.id);

				if (commentError) {
					console.error('Erro ao carregar comentários:', commentError);
				} else {
					post.comments = comments;
					post.showComments = false; // Inicialmente ocultar os comentários
				}
			}
			posts = data;
		}
	};

	onMount(() => {
		setLastPathUrl();
		loadPosts();
	});

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
			console.log('Postagem criada:', data);
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
			const userId = currentUser.userId;
			const postId = post.id;

			const comment = {
				user_id: userId,
				text: commentText,
				avatar: currentUser.photoURL,
				post_id: postId
			};

			const { data, error } = await supabase.from('comments').insert([comment]);

			if (error) {
				console.error('Erro ao adicionar comentário:', error);
			} else {
				commentText = '';
				// Atualizando os comentários localmente
				posts[index].comments.push({
					user: currentUser.name,
					text: commentText,
					avatar: currentUser.photoURL
				});
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
</script>

<main class="mt-4 flex w-full flex-col items-center">
	<!-- Área de criação de postagem -->
	<div class="w-[90%] max-w-[600px] rounded-lg bg-white p-4 shadow-md">
		<div class="flex items-center space-x-3">
			<a href="/perfil">
				<img
					src={currentUser.photoURL}
					alt={currentUser.name}
					class="h-10 w-10 rounded-full object-cover"
				/>
			</a>
			<!-- <span class="font-semibold text-gray-800">{currentUser.name}</span> -->
			<input
				type="text"
				placeholder="O que você está pensando?"
				bind:value={inputValue}
				onfocus={() => (showModal = true)}
				class="w-full rounded-full bg-gray-100 px-4 py-2 outline-none transition focus:bg-gray-200"
			/>
		</div>
		<div class="mt-3 flex justify-between">
			<button
				class="flex items-center space-x-2 rounded-md px-4 py-2 text-blue-600 hover:bg-blue-50"
				onclick={openGallery}
			>
				<img src={Galeria} alt="Galeria" class="h-6 w-6" />
				<span>Galeria</span>
			</button>
			<button
				class="flex items-center space-x-2 rounded-md px-4 py-2 text-green-600 hover:bg-green-50"
				onclick={() => alert('Acessando a câmera do dispositivo...')}
			>
				<img src={Camera} alt="Câmera" class="h-6 w-6" />
				<span>Câmera</span>
			</button>
		</div>
	</div>

	<!-- Modal de criação de postagem -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-[90%] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Criar Publicação</h2>
				{#if selectedFile}
					<img
						src={selectedFile}
						alt="Pré-visualização"
						class="mb-4 max-h-[200px] w-full rounded-md object-cover"
					/>
				{/if}
				<textarea
					placeholder="O que está acontecendo?"
					bind:value={inputValue}
					class="mb-4 h-20 w-full rounded-md border border-gray-300 p-2"
				></textarea>
				<div class="flex justify-end space-x-3">
					<button
						class="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
						onclick={() => {
							showModal = false;
							inputValue = '';
							selectedFile = null;
						}}
					>
						Cancelar
					</button>
					<button
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						onclick={postContent}
					>
						Publicar
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Feed de postagens -->
	<section class="mt-6 w-[90%] max-w-[600px] space-y-4">
		{#each posts as post, index (post.id)}
			<div class="rounded-lg bg-white p-4 shadow-md">
				<div class="flex items-center space-x-3">
					<img
						src={post.user_avatar}
						alt={post.user_name}
						class="h-10 w-10 rounded-full object-cover"
					/>
					<span class="font-semibold text-gray-800">{post.user_name}</span>
				</div>
				<p class="mt-3 text-gray-700">{post.text}</p>
				{#if post.image_url}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						src={post.image_url}
						alt="Imagem do post"
						class="mt-3 w-full rounded-md object-cover"
						onclick={() => openImageModal(post.image_url)}
					/>
				{/if}
				<div class="mt-4 flex items-center space-x-6">
					<button onclick={() => likePost(index)} class="flex items-center space-x-2 text-red-600">
						<span class="text-lg">❤️</span>
						<span>{post.likes}</span>
					</button>
					<button
						class="flex items-center space-x-2 text-gray-600"
						onclick={() => toggleComments(index)}
					>
						<span class="text-lg">💬</span>
						<span>{post.comments.length} Comentários</span>
					</button>
				</div>

				<!-- Exibir os comentários -->
				{#if post.showComments && post.comments.length > 0}
					<div class="mt-3 space-y-3">
						{#each post.comments as comment}
							<div class="flex items-start space-x-3">
								<img
									src={comment.avatar}
									alt={comment.user}
									class="h-8 w-8 rounded-full object-cover"
								/>
								<div>
									<p class="font-semibold text-gray-800">{comment.user}</p>
									<p class="text-gray-600">{comment.text}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Adicionar comentário -->
				{#if post.showComments}
					<div class="mt-3">
						<textarea
							bind:value={commentText}
							placeholder="Adicione um comentário..."
							class="w-full rounded-md border border-gray-300 p-2"
						></textarea>
						<button
							onclick={() => addComment(index)}
							class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							Enviar
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</section>

	<!-- Modal de imagem -->
	{#if showImageModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="relative w-[90%] max-w-[500px]">
				<button
					class="absolute right-0 top-0 rounded-full bg-gray-700 p-2 text-white"
					onclick={closeImageModal}>X</button
				>
				<img src={modalImage} alt="Imagem do post" class="w-full rounded-md object-cover" />
			</div>
		</div>
	{/if}
</main>
