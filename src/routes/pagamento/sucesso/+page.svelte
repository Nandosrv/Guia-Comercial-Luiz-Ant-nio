<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import axios from 'axios';
    import { userStore } from '../../../stores/userStore.svelte';

    let mensagem = 'Processando seu pagamento...';
    let status = 'loading'; // loading, success, error
    let redirect = '';

    onMount(async () => {
        try {
            // Obter userId da URL
            const userId = $page.url.searchParams.get('userId') || userStore.value.userId;
            
            if (!userId) {
                status = 'error';
                mensagem = 'ID de usuário não encontrado. Não foi possível verificar o pagamento.';
                return;
            }

            // Verificar status do pagamento e se usuário já tem comércio
            const response = await axios.get(`https://api-backend-production-5b22.up.railway.app/mercadopago/pagamento/sucesso?userId=${userId}`);
            
            if (response.data.success) {
                status = 'success';
                mensagem = response.data.message;
                redirect = response.data.redirect;
                
                // Redirecionar após 3 segundos
                setTimeout(() => {
                    goto(redirect);
                }, 3000);
            } else {
                status = 'error';
                mensagem = response.data.error || 'Erro ao processar pagamento';
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            status = 'error';
            mensagem = 'Erro ao processar o pagamento. Por favor, entre em contato com o suporte.';
        }
    });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center">
    <div class="max-w-md w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-8">
            <div class="text-center">
                {#if status === 'loading'}
                    <!-- Loading State -->
                    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">{mensagem}</h2>
                    <p class="text-gray-600">Aguarde enquanto verificamos os detalhes do seu pagamento...</p>
                {:else if status === 'success'}
                    <!-- Success State -->
                    <div class="bg-green-100 p-4 rounded-full inline-flex mb-6">
                        <svg class="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Pagamento processado com sucesso!</h2>
                    <p class="text-gray-600 mb-4">{mensagem}</p>
                    <p class="text-gray-500">Redirecionando para {redirect === '/formulario-comercio' ? 'cadastro de comércio' : 'seu painel'}...</p>
                    <div class="mt-4">
                        <button 
                            on:click={() => goto(redirect)} 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Ir agora
                        </button>
                    </div>
                {:else}
                    <!-- Error State -->
                    <div class="bg-red-100 p-4 rounded-full inline-flex mb-6">
                        <svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Houve um problema</h2>
                    <p class="text-gray-600 mb-4">{mensagem}</p>
                    <div class="mt-4 flex space-x-4 justify-center">
                        <button 
                            on:click={() => goto('/')} 
                            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                            Voltar à página inicial
                        </button>
                        <button 
                            on:click={() => goto('/Anuncios-Promocao')} 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Tentar novamente
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div> 