<script lang="ts">
    import { writable } from 'svelte/store';

    interface ClientData {
        nome: string;
        email: string;
        telefone: string;
        comercio: {
            nome: string;
            endereco: string;
        }
    }

    const initialClientData: ClientData = {
        nome: '',
        email: '',
        telefone: '',
        comercio: {
            nome: '',
            endereco: ''
        }
    };

    let currentStep = 0;
    let clientData = writable<ClientData>(initialClientData);

    function nextStep() {
        if (currentStep < 1) currentStep++;
    }

    function prevStep() {
        if (currentStep > 0) currentStep--;
    }

    function submitForm() {
        console.log('Dados do cliente:', $clientData);
        // Implementar lógica de envio
    }

    function isStepValid(step: number): boolean {
        switch (step) {
            case 0:
                return !!$clientData.nome && !!$clientData.email && !!$clientData.telefone;
            case 1:
                return !!$clientData.comercio.nome && !!$clientData.comercio.endereco;
            default:
                return false;
        }
    }
</script>

<main class="container flex-col  flex justify-center items-center bg-secondary">
    <div class="w-full flex flex-col justify-center items-center max-w-4xl mb-12 text-center">
        <h1 class="text-5xl font-bold text-secondary-foreground mb-4">
            Plano Básico
            <span class="block text-2xl font-semibold mt-2">Comece sua Presença Digital</span>
        </h1>
        
        <div class="bg-secondary-foreground p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold text-secondary mb-4">Benefícios do Plano Básico:</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-secondary">
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Visibilidade Online</h3>
                    <p class="text-sm">Seja encontrado por clientes locais</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Informações de Contato</h3>
                    <p class="text-sm">Telefone e endereço comercial</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 class="font-semibold mb-2">Perfil Básico</h3>
                    <p class="text-sm">Página simples e eficiente</p>
                </div>
            </div>
        </div>

        <div class="bg-blue-100 p-4 rounded-lg mb-8">
            <p class="text-blue-800">
                <span class="font-bold">Dica:</span> O plano básico é perfeito para quem está começando. 
                Você pode fazer upgrade para os planos Premium ou Empresarial quando desejar!
            </p>
        </div>

        <p class="text-lg text-secondary-foreground mb-8">
            Cadastre seu negócio em menos de 2 minutos!
            <br>
            <span class="text-sm opacity-75">Processo simplificado em apenas 2 etapas</span>
        </p>

            <div class="w-[50%]">
        <div class="flex justify-between mb-2 gap-2">
            {#each Array(2) as _, i}
                <div class="w-1/2 h-4 rounded-full transition-colors duration-300"
                     class:bg-blue-500={currentStep >= i}
                     class:bg-blue-200={currentStep < i}></div>
            {/each}
        </div>
    </div>

    <div class="w-full max-w-2xl shadow-lg rounded-md bg-secondary-foreground p-6">
        <h3 class="text-xl font-bold text-center mb-6 text-secondary">Plano Básico - Cadastro</h3>

        <div class="mt-2">
            {#if currentStep === 0}
                <!-- Dados Pessoais -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2 text-secondary" for="nome">Nome Completo</label>
                        <input
                            class="input-primary w-full"
                            id="nome"
                            type="text"
                            bind:value={$clientData.nome}
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2 text-secondary" for="email">Email</label>
                        <input
                            class="input-primary w-full"
                            id="email"
                            type="email"
                            bind:value={$clientData.email}
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2 text-secondary" for="telefone">Telefone</label>
                        <input
                            class="input-primary w-full"
                            id="telefone"
                            type="tel"
                            bind:value={$clientData.telefone}
                            required
                        />
                    </div>
                </div>
            {:else}
                <!-- Dados do Comércio -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2 text-secondary" for="comercio">Nome do Comércio</label>
                        <input
                            class="input-primary w-full"
                            id="comercio"
                            type="text"
                            bind:value={$clientData.comercio.nome}
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2 text-secondary" for="endereco">Endereço Completo</label>
                        <input
                            class="input-primary w-full"
                            id="endereco"
                            type="text"
                            bind:value={$clientData.comercio.endereco}
                            required
                        />
                    </div>
                </div>
            {/if}

            <div class="flex justify-between mt-6">
                <button
                    class="btn-secondary"
                    on:click={prevStep}
                    disabled={currentStep === 0}>
                    Anterior
                </button>
                
                {#if currentStep < 1}
                    <button
                        class="btn-primary"
                        on:click={nextStep}
                        disabled={!isStepValid(currentStep)}>
                        Próximo
                    </button>
                {:else}
                    <button
                        class="btn-success"
                        on:click={submitForm}
                        disabled={!isStepValid(currentStep)}>
                        Finalizar
                    </button>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    .input-primary {
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        appearance: none;
        border: 1px solid #e5e7eb;
        border-radius: 0.25rem;
        padding: 0.5rem 0.75rem;
        color: #374151;
        line-height: 1.25;
        transition: all 0.2s ease-in-out;
    }
    .input-primary:focus {
        outline: none;
        box-shadow: 0 0 0 2px #3b82f6;
    }

    .btn-primary {
        background-color: #3b82f6;
        padding: 0.5rem 1rem;
        color: white;
        font-weight: 700;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }
    .btn-primary:hover {
        background-color: #1d4ed8;
        transform: translateY(-1px);
    }
    .btn-primary:disabled {
        opacity: 0.5;
    }

    .btn-secondary {
        background-color: #d1d5db;
        color: #1f2937;
        font-weight: 700;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }
    .btn-secondary:hover {
        background-color: #9ca3af;
        transform: translateY(-1px);
    }
    .btn-secondary:disabled {
        opacity: 0.5;
    }

    .btn-success {
        background-color: #22c55e;
        color: white;
        font-weight: 700;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }
    .btn-success:hover {
        background-color: #15803d;
        transform: translateY(-1px);
    }
    .btn-success:disabled {
        opacity: 0.5;
    }
</style>