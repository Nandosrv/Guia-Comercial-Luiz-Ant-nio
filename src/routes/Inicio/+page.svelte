<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	export let inputValue = '';
	import Galeria from '$lib/images/icons8-galeria-25.png';
	import Camera from '$lib/images/icons8-câmera-50.png';
	import gif from '$lib/images/icons8-gif-48.png';
	import userAvatar from '$lib/images/antonio.png';
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import supabase from '../../lib/supabaseClient';  // Importando o supabase client
    import avatar from '../../lib/images/antonio.png';  // Importando o supabase client
    import { uploadProfilePicture } from '../../uploadProfilePicture';
    import { userName, userPhotoURL } from '../../stores/user'; // Importando o store
	import { on } from 'svelte/events';
	import { goto } from '$app/navigation'; // Para redirecionar o usuário
	import PostFeed from '../../lib/componets/PostFeed.svelte';
	let isAuthenticated = false;
	
	onMount(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				// Se não estiver autenticado, redirecione para a página de login
				goto('/login');
			} else {
				isAuthenticated = true;
			}
		});
	});

	let photoURL: string = '';
	
	let currentUser = {
		name: $userName || 'Usuário',
		avatar: avatar
	};
	onMount(() => {
        // Carregar dados do usuário (exemplo simples)
       
		photoURL = $userPhotoURL || 'avatar';  // Foto padrão
		currentUser.avatar = photoURL;  // Foto padrão
		// console.log('aquiiiiii', $userPhotoURL);
		userName.set($userName || 'Usuário');
		// console.log('teste', $userName);
    });
	
	let showModal = false;
	let selectedFile: string | null = null;
	
	// Informação do usuário logado

	// Lista de postagens
	let posts: {
		text: string;
		image: string | null;
		user: { name: string; avatar: string };
		likes: number;
		comments: { user: string; text: string }[];
	}[] = [];

	// Controle do modal de imagem
	let showImageModal = false;
	let modalImage: string | null = null;

	// Controle do modal de comentários
	let showCommentModal = false;
	let commentText = '';
	let postIndex: number | null = null;

	// Função para abrir a galeria
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

	// Função para publicar o conteúdo
	function postContent() {
		posts = [
			{
				text: inputValue,
				image: selectedFile,
				user: currentUser,
				likes: 0,
				comments: []
			},
			...posts
		];
		showModal = false;
		inputValue = '';
		selectedFile = null;
	}

	// Função para abrir modal de imagem
	function openImageModal(image: string) {
		modalImage = image;
		showImageModal = true;
	}

	// Função para fechar modal de imagem
	function closeImageModal() {
		showImageModal = false;
		modalImage = null;
	}

	// Função para curtir uma postagem
	function likePost(postIndex: number) {
		posts[postIndex].likes += 1;
	}

	// Função para abrir o modal de comentário
	function openCommentModal(index: number) {
		postIndex = index;
		commentText = '';
		showCommentModal = true;
	}

	// Função para adicionar um comentário
	function addComment() {
		if (postIndex !== null && commentText.trim()) {
			posts[postIndex].comments.push({
				user: currentUser.name,
				text: commentText
			});
			commentText = ''; // Limpar o campo de comentário
		}
	}
</script>
<PostFeed />

<!-- <main class="mt-4 flex w-full flex-col items-center"> -->
	<!-- Área de criação de postagem -->
	<!-- <div class="w-[90%] max-w-[600px] rounded-lg bg-white p-4 shadow-md">
		<div class="flex items-center space-x-3">
			<a href="/perfil">
				<img
				  src={currentUser.avatar}
				  alt={currentUser.name}
				  class="h-10 w-10 rounded-full object-cover"
				/>
			  </a>
			  <span class="font-semibold text-gray-800">{currentUser.name}</span>
			  
			<input
				type="text"
				placeholder="O que você está pensando?"
				bind:value={inputValue}
				on:focus={() => (showModal = true)}
				class="w-full rounded-full bg-gray-100 px-4 py-2 outline-none transition focus:bg-gray-200"
			/>
		</div> -->
		<!-- <div class="mt-3 flex justify-between">
			<button
				class="flex items-center space-x-2 rounded-md px-4 py-2 text-blue-600 hover:bg-blue-50"
				on:click={openGallery}
			>
				<img src={Galeria} alt="Galeria" class="h-6 w-6" />
				<span>Galeria</span>
			</button>
			<button
				class="flex items-center space-x-2 rounded-md px-4 py-2 text-green-600 hover:bg-green-50"
				on:click={() => alert('Acessando a câmera do dispositivo...')}
			>
				<img src={Camera} alt="Câmera" class="h-6 w-6" />
				<span>Câmera</span>
			</button>
			<button
				class="flex items-center space-x-2 rounded-md px-4 py-2 text-purple-600 hover:bg-purple-50"
				on:click={() => window.open('https://giphy.com', '_blank')}
			>
				<img src={gif} alt="GIF" class="h-6 w-6" />
				<span>GIF</span>
			</button>
		</div>
	</div> -->

	<!-- Modal de criação de postagem -->
	<!-- {#if showModal}
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
						on:click={() => {
							showModal = false;
							inputValue = '';
							selectedFile = null;
						}}
					>
						Cancelar
					</button>
					<button
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						on:click={postContent}
					>
						Publicar
					</button>
				</div>
			</div>
		</div>
	{/if} -->
	<!-- Feed de postagens -->
	<!-- <section class="mt-6 w-[90%] max-w-[600px] space-y-4">
		{#each posts as post, index (post.text + post.image)}
			<div class="rounded-lg bg-white p-4 shadow-md">
				<div class="flex items-center space-x-3">
					
					<img
						src={post.user.avatar}
						alt={post.user.name}
						class="h-10 w-10 rounded-full object-cover"
					/>
					<span class="font-semibold text-gray-800">{post.user.name}</span>
				</div>
				<p class="mt-3 text-gray-700">{post.text}</p>
				{#if post.image}
					<button
						type="button"
						class="mt-3 max-h-auto w-full rounded-md object-cover cursor-pointer focus:outline-none border border-b-black"
						on:click={() => post.image && openImageModal(post.image)}
						on:keydown={(e) => e.key === 'Enter' && post.image && openImageModal(post.image)}
					>
						<img
							src={post.image ?? ''}
							alt="Imagem da postagem"
							class="w-full h-auto object-cover"
						/>
					</button>
				{/if}
				<div class="mt-[3rem] flex items-center justify-between">
					<button
						class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
						on:click={() => likePost(index)}
					>
						<span>❤️</span>
						<span>{post.likes}</span>
					</button>
					<button
						class="text-gray-500 hover:text-gray-600"
						on:click={() => openCommentModal(index)}
					>
						💬 {post.comments.length} Comentários
					</button>
					<button
						class="text-green-500 hover:text-green-600"
						on:click={() => alert('Compartilhando...')}
					>
						📤 Compartilhar
					</button>
				</div>
			</div>
		{/each}
	</section> -->

	<!-- Modal de comentários -->
	<!-- {#if showCommentModal && postIndex !== null}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-[90%] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Comentários</h2>
				{#each posts[postIndex].comments as comment}
					<div class="mb-3">
						<strong>{comment.user}</strong>: {comment.text}
					</div>
				{/each}
				<textarea
					placeholder="Adicionar um comentário..."
					bind:value={commentText}
					class="w-full rounded-md border border-gray-300 p-2"
				></textarea>
				<div class="mt-2 flex justify-between">
					<button
						class="text-gray-500 hover:text-gray-600"
						on:click={() => (showCommentModal = false)}
					>
						Cancelar
					</button>
					<button
						class="text-blue-600 hover:text-blue-700"
						on:click={addComment}
					>
						Comentar
					</button>
				</div>
			</div>
		</div>
	{/if} -->

	<!-- Modal de Imagem -->
	<!-- {#if showImageModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-[90%] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
				<img
					src={modalImage}
					alt="Imagem"
					class="w-full rounded-md object-cover"
				/>
				<button
					class="mt-4 text-red-500"
					on:click={closeImageModal}
				>
					Fechar
				</button>
			</div>
		</div>
	{/if}
</main> -->
