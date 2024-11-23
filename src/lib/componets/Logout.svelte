<script lang="ts">
    import { auth } from '../../firebase';
    import { signOut } from 'firebase/auth';

    function deleteCookie(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    async function logout() {
        try {
            await signOut(auth); // Sai do Firebase
            deleteCookie('authToken'); // Remove o cookie
            alert('Você saiu com sucesso!');
            window.location.href = '/'; // Redireciona para o login
        } catch (error) {
            // Convertendo o tipo 'unknown' para 'Error'
            if (error instanceof Error) {
                console.error('Erro ao sair:', error.message);
            } else {
                console.error('Erro inesperado:', error);
            }
        }
    }
</script>

<button on:click={logout} class="btn bg-red-500 text-white">Sair</button>
