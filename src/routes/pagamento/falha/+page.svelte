<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center">
    <div class="max-w-md w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-8">
            <div class="text-center">
                <!-- Error State -->
                <div class="bg-red-100 p-4 rounded-full inline-flex mb-6">
                    <svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Falha no Pagamento</h2>
                <p class="text-gray-600 mb-4">Ocorreu um problema ao processar seu pagamento. Por favor, tente novamente.</p>
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
            </div>
        </div>
    </div>
</div> 