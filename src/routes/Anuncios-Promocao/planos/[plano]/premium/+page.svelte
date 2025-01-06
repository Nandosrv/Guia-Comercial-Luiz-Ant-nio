<script lang="ts">
    import { writable } from 'svelte/store';

    interface Contato {
        tipo: 'telefone' | 'whatsapp';
        numero: string;
    }

    interface Endereco {
        rua: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    }

    interface Comercio {
        nome: string;
        cnpj?: string;
        ramo?: string;
    }

    interface ClientData {
        nome: string;
        email: string;
        contatos: Contato[];
        enderecos: Endereco[];
        comercios: Comercio[];
    }

    const initialClientData: ClientData = {
        nome: '',
        email: '',
        contatos: [],
        enderecos: [],
        comercios: []
    };

    let showModal = false;
    let currentStep = 0;
    let clientData = writable<ClientData>(initialClientData);
    let currentContato: Contato = { tipo: 'telefone', numero: '' };
    let currentEndereco: Endereco = {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    };
    let currentComercio: Comercio = { nome: '' };

    function closeModal() {
        showModal = false;
        clientData.set(initialClientData);
    }

    function nextStep() {
        if (currentStep < 3) currentStep++;
    }

    function prevStep() {
        if (currentStep > 0) currentStep--;
    }

    function addContato() {
        if (currentContato.numero) {
            $clientData.contatos = [...$clientData.contatos, { ...currentContato }];
            currentContato = { tipo: 'telefone', numero: '' };
        }
    }

    function addEndereco() {
        if (currentEndereco.rua && currentEndereco.numero) {
            $clientData.enderecos = [...$clientData.enderecos, { ...currentEndereco }];
            currentEndereco = {
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: ''
            };
        }
    }

    function addComercio() {
        if (currentComercio.nome) {
            $clientData.comercios = [...$clientData.comercios, { ...currentComercio }];
            currentComercio = { nome: '' };
        }
    }

    function submitForm() {
        // Implementar lógica de envio
        console.log('Dados do cliente:', $clientData);
        closeModal();
    }

    function isStepValid(step: number): boolean {
        switch (step) {
            case 0:
                return !!$clientData.nome && !!$clientData.email;
            case 1:
                return $clientData.contatos.length > 0;
            case 2:
                return $clientData.enderecos.length > 0;
            case 3:
                return $clientData.comercios.length > 0;
            default:
                return false;
        }
    }
</script>

<main class="container flex-col h-screen flex justify-center items-center bg-secondary">
        <h1 class="text-5xl font-bold text-secondary-foreground mb-4">
            Plano Premium
            <span class="block text-2xl font-semibold mt-2">Destaque seu Negócio</span>
        </h1>
        
        <div class="bg-secondary-foreground p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold text-secondary mb-4">Benefícios do Plano Premium:</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-secondary">
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Destaque Especial</h3>
                    <p class="text-sm">Apareça nos primeiros resultados de busca</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Múltiplos Endereços</h3>
                    <p class="text-sm">Cadastre todas as suas unidades</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Contatos Ilimitados</h3>
                    <p class="text-sm">Adicione todos seus canais de comunicação</p>
                </div>
            </div>
        </div>

        <p class="text-lg text-secondary-foreground mb-8">
            Complete o cadastro abaixo para começar a aproveitar todos os benefícios do plano Premium.
            <br>
            <span class="text-sm opacity-75">Tempo estimado de preenchimento: 5 minutos</span>
        </p>

        <!-- Resto do código existente... --> 
           <div class="w-full">
        <h1 class="text-3xl font-bold text-center text-secondary-foreground mb-4">Cadastro Premium</h1>

        <div class="flex justify-between mb-2 gap-2">
            {#each Array(4) as _, i}
                <div class="w-1/4 h-4 rounded-full transition-colors duration-300"
                     class:bg-blue-500={currentStep >= i}
                     class:bg-blue-200={currentStep < i}></div>
            {/each}
        </div>
    </div>

    <div class="w-full  max-w-2xl shadow-lg rounded-md bg-secondary-foreground p-6">
        <h3 class="text-xl font-bold text-center mb-6 text-secondary">Cadastro de Cliente</h3>

        <div class="mt-2">
            {#if currentStep === 0}
                <!-- Dados Básicos -->
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
                            class="input-primary w-full "
                            id="email"
                            type="email"
                            bind:value={$clientData.email}
                            required
                        />
                    </div>
                </div>

            {:else if currentStep === 1}
                <!-- Contatos -->
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <select
                            class="input-primary"
                            bind:value={currentContato.tipo}>
                            <option value="telefone">Telefone</option>
                            <option value="whatsapp">WhatsApp</option>
                        </select>
                        <input
                            class="input-primary flex-1"
                            type="tel"
                            placeholder="Número"
                            bind:value={currentContato.numero}
                        />
                        <button
                            class="btn-primary"
                            on:click={addContato}>
                            Adicionar
                        </button>
                    </div>
                    
                    <div class="mt-4">
                        {#each $clientData.contatos as contato, i}
                            <div class="flex items-center gap-2 mb-2 text-white">
                                <span>{contato.tipo}: {contato.numero}</span>
                                <button
                                    class="text-red-500"
                                    on:click={() => {
                                        $clientData.contatos = $clientData.contatos.filter((_, index) => index !== i);
                                    }}>
                                    Remover
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

            {:else if currentStep === 2}
                <!-- Endereços -->
                <div class="space-y-4">
                    <!-- Campos de endereço -->
                    <div class="grid grid-cols-2 gap-4">
                        <input
                            class="input-primary"
                            placeholder="Rua"
                            bind:value={currentEndereco.rua}
                        />
                        <input
                            class="input-primary"
                            placeholder="Número"
                            bind:value={currentEndereco.numero}
                        />
                        <input
                            class="input-primary"
                            placeholder="Bairro"
                            bind:value={currentEndereco.bairro}
                        />
                        <input
                            class="input-primary"
                            placeholder="CEP"
                            bind:value={currentEndereco.cep}
                        />
                        <input
                            class="input-primary"
                            placeholder="Cidade"
                            bind:value={currentEndereco.cidade}
                        />
                        <input
                            class="input-primary"
                            placeholder="Estado"
                            bind:value={currentEndereco.estado}
                        />
                    </div>
                    <button
                        class="btn-primary w-full"
                        on:click={addEndereco}>
                        Adicionar Endereço
                    </button>

                    <div class="mt-4">
                        {#each $clientData.enderecos as endereco, i}
                            <div class="bg-gray-100 p-2 rounded mb-2">
                                <p>{endereco.rua}, {endereco.numero} - {endereco.bairro}</p>
                                <p>{endereco.cidade}/{endereco.estado} - CEP: {endereco.cep}</p>
                                <button
                                    class="text-red-500 mt-2"
                                    on:click={() => {
                                        $clientData.enderecos = $clientData.enderecos.filter((_, index) => index !== i);
                                    }}>
                                    Remover
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

            {:else}
                <!-- Comércios -->
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <input
                            class="input-primary flex-1"
                            placeholder="Nome do Comércio"
                            bind:value={currentComercio.nome}
                        />
                        <input
                            class="input-primary flex-1"
                            placeholder="CNPJ"
                            bind:value={currentComercio.cnpj}
                        />
                        <button
                            class="btn-primary"
                            on:click={addComercio}>
                            Adicionar
                        </button>
                    </div>

                    <div class="mt-4">
                        {#each $clientData.comercios as comercio, i}
                            <div class="flex items-center gap-2 mb-2 text-white">
                                <span>{comercio.nome} {comercio.cnpj ? `- CNPJ: ${comercio.cnpj}` : ''}</span>
                                <button
                                    class="text-red-500 "
                                    on:click={() => {
                                        $clientData.comercios = $clientData.comercios.filter((_, index) => index !== i);
                                    }}>
                                    Remover
                                </button>
                            </div>
                        {/each}
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
                
                {#if currentStep < 3}
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
    }
    .btn-primary:hover {
        background-color: #1d4ed8;
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
    }
    .btn-secondary:hover {
        background-color: #9ca3af;
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
    }
    .btn-success:hover {
        background-color: #15803d;
    }
    .btn-success:disabled {
        opacity: 0.5;
    }
</style>