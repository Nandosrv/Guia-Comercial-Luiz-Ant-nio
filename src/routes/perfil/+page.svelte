<script lang="ts">
    import { onMount } from 'svelte';
    import { userPhotoURL, userName } from '../../stores/user'; 
    import Seta from '$lib/images/setas.png';
    import { uploadProfilePicture } from '../../uploadProfilePicture';
    import supabase from '../../lib/supabaseClient';  // Importando o supabase client
    import avatar from '../../lib/images/antonio.png';  // Importando o supabase client
    import { userId } from '../../stores/user'; // Importando o store
	import Logout from '$lib/componets/Logout.svelte';


    let name: string = '';
    let photoURL: string = '';
    let isSaving = false;
    
    // console.log('casa', $userId); 
    
    let iduser = '';
  
    onMount(() => {
        // Carregar dados do usuário (exemplo simples)
        name = $userName || 'Usuário';
        photoURL = $userPhotoURL || 'avatar';  // Foto padrão
        iduser = $userId || '';
        // console.log('teste', $userId);
    });

    // Função para lidar com a mudança da foto
    async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;

        if (file) {
            try {
                // console.log('Arquivo:', file);

                // Fazendo o upload da foto de perfil
                const newPhotoURL = await uploadProfilePicture(file, iduser);
                // console.log('Foto de perfil enviada:', newPhotoURL);
                if (newPhotoURL) {
                    // Atualizando a foto no banco de dados
                    const { data, error } = await supabase
                        .from('users')
                        .update({ photo_url: newPhotoURL, updated_at: new Date().toISOString() })
                        .eq( 'id', iduser );

                    if (error) {
                        throw new Error('Erro ao atualizar a foto no banco de dados.');
                    }

                    // Atualizando o estado local
                    photoURL = newPhotoURL;
                    userPhotoURL.set(newPhotoURL); // Atualiza o store com a nova URL
                    alert('Foto de perfil atualizada com sucesso!');
                } else {
                    alert('Erro no upload da foto!');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao atualizar a foto de perfil!');
            }
        }
    }

    const updateProfile = async () => {
        isSaving = true;

        try {
            // Atualizar os dados do usuário no backend (exemplo com Firebase)
            // await firebase.auth().currentUser.updateProfile({
            //     displayName: name,
            //     photoURL: photoURL,
            // });

            // Atualizar o store com os novos dados
            userName.set(name);
            userPhotoURL.set(photoURL);

            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente mais tarde.');
        } finally {
            isSaving = false;
        }
    };
</script>

<main class="flex flex-col items-center gap-2">
    <div class="flex w-full items-center justify-between border-b p-2">
        <a href="/">
            <img src={Seta} alt="home" class="h-8 w-6" />
        </a>
        <Logout />
    </div>

    <div class="w-full p-2">
        <p class="font-serif text-lg text-black">Foto de Perfil</p>
        <div class="flex justify-center mt-4">
            <button>
                <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    on:change={handleFileChange}
                />
                <img
                    src={photoURL}
                    alt="Foto de Perfil"
                    class="h-24 w-24 rounded-full border border-gray-400"
                />
            </button>
        </div>
    </div>

    <div class="w-full p-4 space-y-4">
        <div class="input-field">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
                id="name"
                type="text"
                bind:value={name}
                placeholder="Digite seu nome"
                class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>

        <button
            class="w-full py-2 bg-blue-500 text-white rounded-md"
            on:click={updateProfile}
            disabled={isSaving}
        >
            {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
    </div>
</main>
