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

    // Definindo o currentUser com id
    let currentUser = {
        id: $userName || 'default-id',  // Pega o id do usuário real, se disponível
        name: $userName || 'Usuário',
        avatar: $userPhotoURL || 'default-avatar.jpg',
    };

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

    // Função para carregar as postagens
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

    // Função para criar uma nova postagem
    const postContent = async () => {
        if (inputValue.trim() !== '') {
            const newPost = {
                user_name: currentUser.name,
                user_avatar: currentUser.avatar,
                text: inputValue,
                image_url: selectedFile ? selectedFile : null,  
                likes: 0,
                comments: []
            };

            const { data, error } = await supabase
                .from('postss')
                .insert([newPost]);
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

    // Função para abrir o modal de comentários
    const openCommentModal = (index: number) => {
        postIndex = index;
        showCommentModal = true;
    };

    // Função para adicionar um comentário
   // Função para adicionar um comentário
// Função para adicionar um comentário
const addComment = async () => {
    if (commentText.trim() !== '' && postIndex !== null) {
        const post = posts[postIndex]; // Obtém o post selecionado
        const userId = currentUser.id; // ID do usuário autenticado
        const postId = post.id; // ID do post selecionado

        // Verifique os IDs antes de enviar para o banco de dados
        console.log('post.id:', postId);  // Mostra o ID do post
        console.log('currentUser.id:', userId);  // Mostra o ID do usuário

        const comment = {
            user_id: userId,  // ID do usuário
            text: commentText,
            avatar: currentUser.avatar,
            post_id: postId,  // Certifique-se de que é postId e não post_id
        };

        // Enviar o comentário para o Supabase
        const { data, error } = await supabase
            .from('comments') // Tabela de comentários
            .insert([comment]);

        if (error) {
            console.error('Erro ao adicionar comentário:', error);
        } else {
            commentText = ''; 
            // Atualiza o estado da postagem com o novo comentário
            posts[postIndex].comments.push({
                user: currentUser.name,
                text: commentText,
                avatar: currentUser.avatar,
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
                        <span>👍</span>
                        <span>{post.likes} Curtidas</span>
                    </button>
                    <button class="flex items-center space-x-1 text-gray-600 hover:text-gray-800" on:click={() => openCommentModal(index)}>
                        <span>💬</span>
                        <span>{post.comments.length} Comentários</span>
                    </button>
                </div>
            </div>
        {/each}
    </section>

    <!-- Modal de imagem -->
    {#if showImageModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" on:click={closeImageModal}>
            <img src={modalImage} alt="Imagem ampliada" class="max-w-[90%] max-h-[90%] rounded-lg object-contain" />
        </div>
    {/if}

    <!-- Modal de comentários -->
    {#if showCommentModal && postIndex !== null}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div class="w-[90%] max-w-[600px] rounded-2xl bg-white p-6 shadow-xl relative transform scale-95 transition-all duration-300 ease-out hover:scale-100">
            <!-- Botão de fechar maior -->
            <button
                class="absolute top-2 right-2 text-4xl text-gray-600 hover:text-gray-800 focus:outline-none"
                on:click={() => showCommentModal = false}
                aria-label="Fechar"
            >
                ×
            </button>
            <h3 class="text-2xl font-semibold text-gray-800">Comentários</h3>
            <div class="mt-4 space-y-4 max-h-96 overflow-y-auto">
                {#if posts[postIndex]?.comments?.length > 0}
                    {#each posts[postIndex].comments as comment}
                        <div class="flex items-start space-x-3 border-b pb-3">
                            <img src={comment.avatar} alt={comment.user} class="h-12 w-12 rounded-full object-cover border-2 border-blue-500" />
                            <div class="flex-1">
                                <span class="font-semibold text-gray-800">{comment.user}</span>
                                <!-- Exibindo o texto do comentário -->
                                <p class="text-gray-600 text-sm">{comment.text}</p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p class="text-gray-500">Ainda não há comentários para este post.</p>
                {/if}
            </div>
            <div class="mt-4 flex space-x-3">
                <input
                    type="text"
                    placeholder="Adicionar comentário..."
                    bind:value={commentText}
                    class="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                />
                <button
                    class="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    on:click={addComment}
                >
                    Comentar
                </button>
            </div>
        </div>
    </div>
{/if}




</main>
