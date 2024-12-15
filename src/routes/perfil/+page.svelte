<script lang="ts">
	import Logout from '$lib/componets/Logout.svelte';
	import Footer from '$lib/footer/+paga.svelte';
	import camera from '$lib/images/icons8-câmera-50.png';
	import Manu from '$lib/images/manu.gif';
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
</script>

<!-- Novo Perfil -->
<section
	class="flex h-[250px] w-full flex-col items-center justify-center rounded-lg border shadow-lg"
>
	<main
		class="flex h-[250px] w-full flex-col items-center justify-center rounded-lg border border-b-4 border-purple-900 bg-gray-100 shadow-lg md:w-[60%]"
	>
		<div class="relative flex h-[110px] w-[110px] rounded-full bg-white shadow-md">
			<!-- Avatar do Usuário -->
			<div class="relative h-full w-full overflow-hidden rounded-full border-4 border-gray-300">
				<img src={currentUser.photoURL} alt={currentUser.name} class="h-full w-full object-cover" />
			</div>

			<!-- Botão para Alterar Foto -->
			<div
				class="absolute bottom-1 right-1 cursor-pointer rounded-full bg-blue-500 p-2 shadow-lg transition hover:bg-blue-600"
			>
				<label for="profilePicture" class="flex items-center justify-center">
					<img src={camera} alt="Alterar Foto" class="h-5 w-5 text-white" />
				</label>
				<input
					type="file"
					id="profilePicture"
					accept="image/*"
					class="hidden"
					onchange={handleFileChange}
				/>
			</div>
		</div>
		<p class="font-['Poppins'] text-[30px] font-bold">{currentUser.name}</p>
	</main>
</section>
<main class="flex h-[150px] w-full flex-col items-center justify-center border border-red-800">
	<span class="font-['Poppins'] text-[17px] font-bold"> Editar Apresentação </span>
	<button class="w-[150px] rounded-lg bg-purple-800/15 hover:bg-white">
		<a class="w-[200px] rounded-lg bg-purple-800/15 hover:bg-white" href="/">Editar</a>
	</button>
</main>
<main class="flex w-full flex-col items-center justify-center">
	<h1>Estamos contruindo uma nova página para o perfil😊</h1>
	<img src="{Manu} " alt="" />
	<Footer />
	<div class="absolute">
		<Logout />
	</div>
</main>
