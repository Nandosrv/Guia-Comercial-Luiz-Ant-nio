<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	$page.url.pathname;

	import type { User } from '$lib/types/userStore';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';
	import PostFeed from '../../lib/componets/PostFeed.svelte';
	import { userStore } from '../../stores/userStore.svelte';

	let isAuthenticated = false;

	let currentUser = $derived(userStore.value);

	onMount(() => {
		setLastPathUrl($page.url.pathname);
		const auth = getAuth();
		if (!currentUser.name) {
			// Se não estiver autenticado, redirecione para a página de login
			goto('/login');
		} else {
			isAuthenticated = true;
		}
		// console.log('auth', auth);
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

	let showModal = false;
	let selectedFile: string | null = null;

	// Informação do usuário logado

	// Lista de postagens
	let posts: {
		text: string;
		image: string | null;
		user: User;
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
	// function postContent() {
	// 	posts = [
	// 		{
	// 			text: inputValue,
	// 			image: selectedFile,
	// 			user: currentUser,
	// 			likes: 0,
	// 			comments: []
	// 		},
	// 		...posts
	// 	];
	// 	showModal = false;
	// 	inputValue = '';
	// 	selectedFile = null;
	// }

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

<!-- <main class="w-full h-[50px] bg-black ">

</main> -->
<PostFeed />
