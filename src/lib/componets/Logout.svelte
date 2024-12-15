<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '../firebase/client';

	async function handleLogout() {
		try {
			await logout();
			alert('Você saiu com sucesso!');
			// window.location.href = '/'; // Redireciona para o login
			goto('/'); // Redireciona para o login
		} catch (error) {
			// Convertendo o tipo 'unknown' para 'Error'
			if (error instanceof Error) {
				console.error('Erro ao sair:', error?.message || error);
			} else {
				console.error('Erro inesperado:', error);
			}
		}
	}
</script>

<button
	class="relative flex h-[45px] w-[45px] cursor-pointer items-center justify-start overflow-hidden rounded-full border-none bg-red-500 shadow-md transition-all duration-300 hover:w-[125px] hover:rounded-lg hover:border-none active:translate-x-2 active:translate-y-2"
	on:click={handleLogout}
>
	<!-- Ícone do SVG -->
	<div class="flex w-full items-center justify-center transition-all duration-300">
		<svg viewBox="0 0 512 512" class="w-[17px]">
			<path
				d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
			></path>
		</svg>
	</div>

	<!-- Texto que aparece no hover -->
	<div
		class="absolute right-0 w-0 pr-2 text-xl font-semibold text-white opacity-0 transition-all duration-300"
	>
		Logout
	</div>
</button>
