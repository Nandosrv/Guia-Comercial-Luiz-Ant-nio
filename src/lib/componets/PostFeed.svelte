<script lang="ts">
    import { onMount } from 'svelte';
    import { firebaseApp } from '../../firebase'; 
    import supabase from '../../lib/supabaseClient'; 
    import { userName, userPhotoURL } from '../../stores/user'; 
    import { writable } from 'svelte/store';
    import Galeria from '$lib/images/icons8-galeria-25.png';
    import Camera from '$lib/images/icons8-câmera-50.png';
    import gif from '$lib/images/icons8-gif-48.png';
	import firebase from 'firebase/compat/app';
    
    let inputValue = '';
    let showModal = false;
    let selectedFile: any = null;
    let posts: any[] = [];
    let showCommentModal = false;
    let postIndex: number | null = null;
    let commentText = '';
    let modalImage = '';
    let showImageModal = false;

    let currentUser = {
        name: $userName || 'Usuário',
        avatar: $userPhotoURL || 'default-avatar.jpg',
    };







    
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

    const loadPosts = async () => {
        const { data, error } = await supabase.from('postss').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao carregar postagens:', error);
        } else {
            posts = data;
        }
    };

    onMount(() => {
        loadPosts();
    });

    const postContent = async () => {
    if (inputValue.trim() !== '') {
        // Criando um objeto de postagem
        const newPost = {
            user_name: currentUser.name,
            user_avatar: currentUser.avatar,
            text: inputValue,
            image_url: selectedFile ? selectedFile : null,  // Se tiver uma imagem, ela será incluída
            likes: 0,
            comments: []
        };

        // Enviando o post para o Supabase
        const { data, error } = await supabase
            .from('postss')
            .insert([newPost]);
        console.log('Postagem criada:', data);
        if (error) {
            console.error('Erro ao criar a postagem:', error);
        } else {
            loadPosts();  // Atualiza a lista de postagens
            inputValue = '';  // Limpa o campo de entrada de texto
            selectedFile = null;  // Limpa a imagem selecionada
            showModal = false;  // Fecha o modal
        }
    }
};


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

    const openCommentModal = (index: number) => {
        postIndex = index;
        showCommentModal = true;
    };

    const addComment = async () => {
        if (commentText.trim() !== '' && postIndex !== null) {
            const comment = { user: 'Você', text: commentText };
            posts[postIndex].comments.push(comment);

            const post = posts[postIndex];
            const { data, error } = await supabase
                .from('postss')
                .update({ comments: posts[postIndex].comments })
                .match({ id: post.id });

            if (error) {
                console.error('Erro ao adicionar comentário:', error);
            }

            commentText = ''; 
        }
    };

    const openImageModal = (image_url: any) => {
        modalImage = image_url;
        showImageModal = true;
    };

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
                <img src={currentUser.avatar} alt={currentUser.name} class="h-10 w-10 rounded-full object-cover" />
            </a>
            <span class="font-semibold text-gray-800">{currentUser.name}</span>
            <input type="text" placeholder="O que você está pensando?" bind:value={inputValue} on:focus={() => (showModal = true)} class="w-full rounded-full bg-gray-100 px-4 py-2 outline-none transition focus:bg-gray-200" />
        </div>
        <div class="mt-3 flex justify-between">
            <button
                class="flex items-center space-x-2 rounded-md px-4 py-2 text-blue-600 hover:bg-blue-50"
                on:click={openGallery}
            >
                <img src={Galeria} alt="Galeria" class="h-6 w-6" />
                <span>Galeria</span>
            </button>
            <button class="flex items-center space-x-2 rounded-md px-4 py-2 text-green-600 hover:bg-green-50" on:click={() => alert('Acessando a câmera do dispositivo...')}>
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
                    <img src={selectedFile} alt="Pré-visualização" class="mb-4 max-h-[200px] w-full rounded-md object-cover" />
                {/if}
                <textarea placeholder="O que está acontecendo?" bind:value={inputValue} class="mb-4 h-20 w-full rounded-md border border-gray-300 p-2"></textarea>
                <div class="flex justify-end space-x-3">
                    <button class="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400" on:click={() => { showModal = false; inputValue = ''; selectedFile = null; }}>
                        Cancelar
                    </button>
                    <button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" on:click={postContent}>
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
                    <img src={post.user_avatar} alt={post.user_name} class="h-10 w-10 rounded-full object-cover" />
                    <span class="font-semibold text-gray-800">{post.user_name}</span>
                    <div></div>
                </div>
                <p class="mt-3 text-gray-700">{post.text}</p>
                {#if post.image_url}
                    <button type="button" class="mt-3 w-full rounded-md cursor-pointer" on:click={() => openImageModal(post.image_url)}>
                        <img src={post.image_url} alt="Imagem da postagem" class="w-full h-auto object-cover" />
                    </button>
                {/if}
                <div class="mt-[3rem] flex items-center justify-between">
                    <button class="flex items-center space-x-1 text-blue-500 hover:text-blue-600" on:click={() => likePost(index)}>
                        <span>❤️</span>
                        <span>{post.likes}</span>
                    </button>
                    <button class="text-gray-500 hover:text-gray-600" on:click={() => openCommentModal(index)}>
                        💬 {post.comments.length} Comentários
                    </button>
                    <button class="text-green-500 hover:text-green-600" on:click={() => alert('Compartilhar post')}>
                        📤 Compartilhar
                    </button>
                </div>
            </div>
        {/each}
    </section>

    <!-- Modal de imagem -->
    {#if showImageModal}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="max-w-[90%] max-h-[80%] overflow-hidden">
                <img src={modalImage} alt="Imagem ampliada" class="object-contain w-full h-full" />
                <button class="absolute top-2 right-2 p-2 bg-white rounded-full" on:click={closeImageModal}>X</button>
            </div>
        </div>
    {/if}
    {#if showCommentModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative w-[90%] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
            <!-- Botão de fechar -->
            <button
                class="absolute top-2 right-2 p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                on:click={() => (showCommentModal = false)}
            >
                ✕
            </button>

            <h2 class="mb-4 text-lg font-semibold">Comentários</h2>

            <!-- Verifica se postIndex é válido antes de acessar posts -->
            {#if typeof postIndex === 'number' && posts[postIndex]}
                <div class="space-y-3">
                    {#each posts[postIndex].comments as comment}
                        <div class="flex items-start space-x-3">
                            <img src={currentUser.avatar} alt={currentUser.name} class="h-8 w-8 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold">{currentUser.name}</p>
                                <p class="text-gray-700">{comment.text}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="text-center text-gray-500">Nenhum post encontrado.</p>
            {/if}

            <textarea
                bind:value={commentText}
                placeholder="Escreva um comentário..."
                class="mt-4 w-full rounded-md border p-2"
            ></textarea>
            <div class="flex justify-end mt-3">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-md" on:click={addComment}>
                    Comentar
                </button>
            </div>
        </div>
    </div>
{/if}

</main>

