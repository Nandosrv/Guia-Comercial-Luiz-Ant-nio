<script lang="ts">
    import { writable } from 'svelte/store';

    interface Contato {
        tipo: 'telefone' | 'whatsapp' | 'email' | 'instagram' | 'facebook';
        valor: string;
    }

    interface HorarioFuncionamento {
        dia: string;
        abertura: string;
        fechamento: string;
        fechado: boolean;
    }

    interface Servico {
        nome: string;
        descricao: string;
        preco?: string;
    }

    interface PremiumData {
        empresa: {
            nome: string;
            cnpj: string;
            descricao: string;
            ramo: string;
            logo?: File;
            imagens: File[];
        };
        responsavel: {
            nome: string;
            email: string;
            telefone: string;
        };
        contatos: Contato[];
        endereco: {
            rua: string;
            numero: string;
            complemento: string;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            coordenadas?: {
                lat: number;
                lng: number;
            };
        };
        horarios: HorarioFuncionamento[];
        servicos: Servico[];
        palavrasChave: string[];
        formasPagamento: string[];
    }

    const diasSemana = [
        'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
        'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
    ];

    const initialHorarios = diasSemana.map(dia => ({
        dia,
        abertura: '08:00',
        fechamento: '18:00',
        fechado: false
    }));

    const initialData: PremiumData = {
        empresa: {
            nome: '',
            cnpj: '',
            descricao: '',
            ramo: '',
            imagens: []
        },
        responsavel: {
            nome: '',
            email: '',
            telefone: ''
        },
        contatos: [],
        endereco: {
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
        },
        horarios: initialHorarios,
        servicos: [],
        palavrasChave: [],
        formasPagamento: []
    };

    let currentStep = 0;
    let premiumData = writable<PremiumData>(initialData);
    let novoContato: Contato = { tipo: 'telefone', valor: '' };
    let novoServico: Servico = { nome: '', descricao: '', preco: '' };
    let novaPalavraChave = '';

    function addContato() {
        if (novoContato.valor) {
            $premiumData.contatos = [...$premiumData.contatos, { ...novoContato }];
            novoContato = { tipo: 'telefone', valor: '' };
        }
    }

    function addServico() {
        if (novoServico.nome && novoServico.descricao) {
            $premiumData.servicos = [...$premiumData.servicos, { ...novoServico }];
            novoServico = { nome: '', descricao: '', preco: '' };
        }
    }

    function addPalavraChave() {
        if (novaPalavraChave && !$premiumData.palavrasChave.includes(novaPalavraChave)) {
            $premiumData.palavrasChave = [...$premiumData.palavrasChave, novaPalavraChave];
            novaPalavraChave = '';
        }
    }

    function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files);
            $premiumData.empresa.imagens = [...$premiumData.empresa.imagens, ...files];
        }
    }

    function nextStep() {
        if (currentStep < 5) currentStep++;
    }

    function prevStep() {
        if (currentStep > 0) currentStep--;
    }

    function isStepValid(step: number): boolean {
        switch (step) {
            case 0: // Dados da empresa
                return !!$premiumData.empresa.nome && 
                       !!$premiumData.empresa.cnpj && 
                       !!$premiumData.empresa.descricao;
            case 1: // Dados do responsável
                return !!$premiumData.responsavel.nome && 
                       !!$premiumData.responsavel.email && 
                       !!$premiumData.responsavel.telefone;
            case 2: // Endereço
                return !!$premiumData.endereco.rua && 
                       !!$premiumData.endereco.numero && 
                       !!$premiumData.endereco.bairro && 
                       !!$premiumData.endereco.cidade;
            case 3: // Horários e Contatos
                return $premiumData.contatos.length > 0;
            case 4: // Serviços
                return $premiumData.servicos.length > 0;
            case 5: // Finalização
                return $premiumData.palavrasChave.length > 0;
            default:
                return false;
        }
    }

    function submitForm() {
        console.log('Dados do premium:', $premiumData);
        // Implementar lógica de envio
    }
</script>

<main class="container flex-col flex justify-center items-center bg-secondary">
    <div class="w-[80%] max-w-4xl mb-12 text-center">
        <h1 class="text-5xl font-bold text-secondary-foreground mb-4">
            Plano Empresarial
            <span class="block text-2xl font-semibold mt-2">Impulsione sua Empresa</span>
        </h1>
        
        <div class="bg-secondary-foreground p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold text-secondary mb-4">Benefícios do Plano Empresarial:</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-secondary">
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Perfil Profissional</h3>
                    <p class="text-sm">Página personalizada para sua empresa</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Relatório de Visitas</h3>
                    <p class="text-sm">Acompanhe o desempenho do seu perfil</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Galeria de Mídia</h3>
                    <p class="text-sm">Adicione fotos e vídeos do seu negócio</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-secondary mt-6">
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Anúncios Promocionais</h3>
                    <p class="text-sm">Divulgue ofertas e promoções</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Atendimento Prioritário</h3>
                    <p class="text-sm">Suporte exclusivo para sua empresa</p>
                </div>
                <div class="flex flex-col items-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 class="font-semibold mb-2">Recursos Exclusivos</h3>
                    <p class="text-sm">Acesso a ferramentas avançadas</p>
                </div>
            </div>
        </div>

        <p class="text-lg text-secondary-foreground mb-8">
            Eleve seu negócio a um novo patamar com nosso plano Empresarial. Comece o cadastro agora!
            <br>
            <span class="text-sm opacity-75">Tempo estimado de preenchimento: 5 minutos</span>
        </p>
           <div class="mb-8">
        <h1 class="text-3xl font-bold text-center text-secondary-foreground mb-4">Cadastro Empresarial</h1>
        <div class="flex justify-between mb-2 gap-2">
            {#each Array(6) as _, i}
                <div class="flex-1 h-2 rounded-full transition-colors duration-300"
                     class:bg-blue-500={currentStep >= i}
                     class:bg-blue-200={currentStep < i}></div>
            {/each}
        </div>
    </div>

    <div class="bg-white shadow-xl rounded-lg p-6">
        {#if currentStep === 0}
            <!-- Dados da Empresa -->
            <div class="space-y-4">
                <h2 class="text-xl font-semibold mb-4">Dados da Empresa</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Nome da Empresa</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.empresa.nome}
                        />
                    </div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                    <div>
                        <label class="block text-sm font-medium mb-2">CPF/CNPJ</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.empresa.cnpj}
                        />
                    </div>
                </div>
                <div>
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label class="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                        class="input-primary w-full h-32"
                        bind:value={$premiumData.empresa.descricao}
                    ></textarea>
                </div>
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                <div>
                    <label class="block text-sm font-medium mb-2">Logo da Empresa</label>
                    <input
                        type="file"
                        accept="image/*"
                        class="input-primary w-full"
                        on:change={handleImageUpload}
                    />
                </div>
                <div>
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label class="block text-sm font-medium mb-2">Imagens do Estabelecimento</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        class="input-primary w-full"
                        on:change={handleImageUpload}
                    />
                </div>
            </div>

        {:else if currentStep === 1}
            <!-- Dados do Responsável -->
            <div class="space-y-4">
                <h2 class="text-xl font-semibold mb-4">Dados do Responsável</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Nome Completo</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.responsavel.nome}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input
                            class="input-primary w-full"
                            type="email"
                            bind:value={$premiumData.responsavel.email}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Telefone</label>
                        <input
                            class="input-primary w-full"
                            type="tel"
                            bind:value={$premiumData.responsavel.telefone}
                        />
                    </div>
                </div>
            </div>

        {:else if currentStep === 2}
            <!-- Endereço -->
            <div class="space-y-4">
                <h2 class="text-xl font-semibold mb-4">Endereço</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Rua</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.rua}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Número</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.numero}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Complemento</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.complemento}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Bairro</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.bairro}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Cidade</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.cidade}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Estado</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.estado}
                        />
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">CEP</label>
                        <input
                            class="input-primary w-full"
                            type="text"
                            bind:value={$premiumData.endereco.cep}
                        />
                    </div>
                </div>
            </div>

        {:else if currentStep === 3}
            <!-- Horários e Contatos -->
            <div class="space-y-6">
                <h2 class="text-xl font-semibold mb-4">Horários e Contatos</h2>
                
                <!-- Horários de Funcionamento -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium">Horários de Funcionamento</h3>
                    {#each $premiumData.horarios as horario, index}
                        <div class="flex items-center gap-4">
                            <span class="w-32">{horario.dia}</span>
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    bind:checked={horario.fechado}
                                    class="mr-2"
                                />
                                Fechado
                            </label>
                            {#if !horario.fechado}
                                <input
                                    type="time"
                                    bind:value={horario.abertura}
                                    class="input-primary"
                                />
                                <span>até</span>
                                <input
                                    type="time"
                                    bind:value={horario.fechamento}
                                    class="input-primary"
                                />
                            {/if}
                        </div>
                    {/each}
                </div>

                <!-- Contatos -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium">Contatos</h3>
                    <div class="flex gap-4">
                        <select
                            class="input-primary"
                            bind:value={novoContato.tipo}>
                            <option value="telefone">Telefone</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="email">Email</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                        </select>
                        <input
                            class="input-primary flex-1"
                            type="text"
                            placeholder="Contato"
                            bind:value={novoContato.valor}
                        />
                        <button
                            class="btn-primary"
                            on:click={addContato}>
                            Adicionar
                        </button>
                    </div>
                    <div class="space-y-2">
                        {#each $premiumData.contatos as contato, i}
                            <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span>{contato.tipo}: {contato.valor}</span>
                                <button
                                    class="text-red-500"
                                    on:click={() => {
                                        $premiumData.contatos = $premiumData.contatos.filter((_, index) => index !== i);
                                    }}>
                                    Remover
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

        {:else if currentStep === 4}
            <!-- Serviços -->
            <div class="space-y-6">
                <h2 class="text-xl font-semibold mb-4">Serviços</h2>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label class="block text-sm font-medium mb-2">Nome do Serviço</label>
                            <input
                                class="input-primary w-full"
                                type="text"
                                bind:value={novoServico.nome}
                            />
                        </div>
                        <div>
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label class="block text-sm font-medium mb-2">Preço (opcional)</label>
                            <input
                                class="input-primary w-full"
                                type="text"
                                bind:value={novoServico.preco}
                            />
                        </div>
                    </div>
                    <div>
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label class="block text-sm font-medium mb-2">Descrição</label>
                        <textarea
                            class="input-primary w-full h-24"
                            bind:value={novoServico.descricao}
                        ></textarea>
                    </div>
                    <button
                        class="btn-primary w-full"
                        on:click={addServico}>
                        Adicionar Serviço
                    </button>
                </div>

                <div class="space-y-2">
                    {#each $premiumData.servicos as servico, i}
                        <div class="bg-gray-50 p-4 rounded">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-medium">{servico.nome}</h4>
                                    <p class="text-sm text-gray-600">{servico.descricao}</p>
                                    {#if servico.preco}
                                        <p class="text-sm font-medium mt-1">Preço: {servico.preco}</p>
                                    {/if}
                                </div>
                                <button
                                    class="text-red-500"
                                    on:click={() => {
                                        $premiumData.servicos = $premiumData.servicos.filter((_, index) => index !== i);
                                    }}>
                                    Remover
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

        {:else}
            <!-- Finalização -->
            <div class="space-y-6">
                <h2 class="text-xl font-semibold mb-4">Finalização</h2>
                
                <!-- Palavras-chave -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium">Palavras-chave</h3>
                    <div class="flex gap-4">
                        <input
                            class="input-primary flex-1"
                            type="text"
                            placeholder="Digite uma palavra-chave"
                            bind:value={novaPalavraChave}
                            on:keydown={(e) => e.key === 'Enter' && addPalavraChave()}
                        />
                        <button
                            class="btn-primary"
                            on:click={addPalavraChave}>
                            Adicionar
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each $premiumData.palavrasChave as palavra, i}
                            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                                {palavra}
                                <button
                                    class="text-blue-600 hover:text-blue-800"
                                    on:click={() => {
                                        $premiumData.palavrasChave = $premiumData.palavrasChave.filter((_, index) => index !== i);
                                    }}>
                                    ×
                                </button>
                            </span>
                        {/each}
                    </div>
                </div>

                <!-- Formas de Pagamento -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium">Formas de Pagamento</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {#each ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência', 'Boleto'] as forma}
                            <label class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={$premiumData.formasPagamento.includes(forma)}
                                    on:change={(e) => {
                                        const target = e.currentTarget as HTMLInputElement;
                                        if (target.checked) {
                                            $premiumData.formasPagamento = [...$premiumData.formasPagamento, forma];
                                        } else {
                                            $premiumData.formasPagamento = $premiumData.formasPagamento.filter(f => f !== forma);
                                        }
                                    }}
                                />
                                {forma}
                            </label>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}

        <div class="flex justify-between mt-8">
            <button
                class="btn-secondary"
                on:click={prevStep}
                disabled={currentStep === 0}>
                Anterior
            </button>
            
            {#if currentStep < 5}
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
                    Finalizar Cadastro
                </button>
            {/if}
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
        border-color: #3b82f6;
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
        background-color: #2563eb;
        transform: translateY(-1px);
    }
    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-secondary {
        background-color: #e5e7eb;
        padding: 0.5rem 1rem;
        color: #374151;
        font-weight: 700;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }
    .btn-secondary:hover {
        background-color: #d1d5db;
        transform: translateY(-1px);
    }
    .btn-secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-success {
        background-color: #22c55e;
        padding: 0.5rem 1rem;
        color: white;
        font-weight: 700;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }
    .btn-success:hover {
        background-color: #16a34a;
        transform: translateY(-1px);
    }
    .btn-success:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>