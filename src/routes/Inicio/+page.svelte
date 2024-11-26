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
