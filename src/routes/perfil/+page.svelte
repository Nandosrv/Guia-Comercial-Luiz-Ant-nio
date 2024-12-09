<script lang="ts">
	import Logout from '$lib/componets/Logout.svelte';
	import Seta from '$lib/images/setas.png';
	import { uploadProfilePicture } from '../../lib/serve/uploadProfilePicture';
	import supabase from '../../lib/supabaseClient';
	import { userStore } from '../../stores/userStore.svelte.js';

	let isSaving = $state(false);
	let currentUser = $derived(userStore.value);
	let name = $state('');

	// Função para lidar com a mudança da foto
	async function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;

		if (file) {
			try {
				// console.log('Arquivo:', file);

				// Fazendo o upload da foto de perfil
				const newPhotoURL = await uploadProfilePicture(file, currentUser.userId);
				// console.log('Foto de perfil enviada:', newPhotoURL);
				if (newPhotoURL) {
					// Atualizando a foto no banco de dados
					const { data, error } = await supabase
						.from('users')
						.update({ photo_url: newPhotoURL, updated_at: new Date().toISOString() })
						.eq('id', currentUser.userId);

					if (error) {
						throw new Error('Erro ao atualizar a foto no banco de dados.');
					}

					// Atualizando o estado local
					currentUser.photoURL = newPhotoURL;
					// userPhotoURL.set(newPhotoURL); // Atualiza o store com a nova URL
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

	// const updateProfile = async () => {
	//     isSaving = true;

	//     try {
	//         // Atualizar os dados do usuário no backend (exemplo com Firebase)
	//         // await firebase.auth().currentUser.updateProfile({
	//         //     displayName: name,
	//         //     photoURL: photoURL,
	//         // });

	//         // Atualizar o store com os novos dados
	//         // currentUser.name = name;
	//         currentUser.photoURL = photoURL;

	//         alert('Perfil atualizado com sucesso!');
	//     } catch (error) {
	//         console.error('Erro ao atualizar perfil:', error);
	//         alert('Erro ao atualizar perfil. Tente novamente mais tarde.');
	//     } finally {
	//         isSaving = false;
	//     }
	// };
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
		<div class="mt-4 flex justify-center">
			<button>
				<input type="file" id="profilePicture" accept="image/*" onchange={handleFileChange} />
				<img
					src={currentUser.photoURL}
					alt="Foto de Perfil"
					class="h-24 w-24 rounded-full border border-gray-400"
				/>
			</button>
		</div>
	</div>

	<div class="w-full space-y-4 p-4">
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
			class="w-full rounded-md bg-blue-500 py-2 text-white"
			onclick={() => {}}
			disabled={isSaving}
		>
			{isSaving ? 'Salvando...' : 'Salvar'}
		</button>
	</div>
</main>
