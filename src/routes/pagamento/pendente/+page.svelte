<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center">
    <div class="max-w-md w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-8">
            <div class="text-center">
                <!-- Pending State -->
                <div class="bg-yellow-100 p-4 rounded-full inline-flex mb-6">
                    <svg class="h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Pagamento Pendente</h2>
                <p class="text-gray-600 mb-4">
                    Seu pagamento está sendo processado. Assim que for confirmado, você receberá uma notificação.
                </p>
                <p class="text-gray-500 mb-6">
                    O tempo de processamento pode variar dependendo do método de pagamento escolhido.
                </p>
                <div class="mt-4 flex space-x-4 justify-center">
                    <button 
                        on:click={() => goto('/')} 
                        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                        Voltar à página inicial
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 