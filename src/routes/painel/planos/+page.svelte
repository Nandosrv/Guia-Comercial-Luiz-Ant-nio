<script lang="ts">
    import { Check, X, Calendar, Clock, RefreshCw } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { format, parseISO } from 'date-fns';
    import { ptBR } from 'date-fns/locale';
    import { page } from '$app/stores';
    import { auth } from '$lib/firebase/client';
    import { getIdToken } from 'firebase/auth';

    interface Assinatura {
        id: string;
        plano: string;
        status: string;
        data_inicio: string;
        data_fim: string;
        valor: number;
        ativa: boolean;
        diasRestantes: number;
        porcentagemUsada: number;
    }

    interface BeneficiosPorPlano {
        [key: string]: string[];
    }

    let assinatura: Assinatura | null = null;
    let carregando = true;
    let erro: string | null = null;

    // Função para carregar dados da assinatura
    async function verificarAssinatura() {
        carregando = true;
        erro = null;
        
        try {
            // Verificar se o usuário está autenticado
            const currentUser = auth.currentUser;
            if (!currentUser) {
                carregando = false;
                erro = "Usuário não autenticado. Faça login para continuar.";
                return;
            }
            
            // Obter um token fresco
            const token = await getIdToken(currentUser, true);
            
            // Chamada ao endpoint específico no backend
            const apiUrl = 'https://api-backend-production-5b22.up.railway.app'; // URL fixa do backend
            
            console.log('Verificando assinatura em:', `${apiUrl}/painel/planos/verificar-assinatura`);
            console.log('Token obtido com sucesso:', !!token);
            
            const response = await fetch(`${apiUrl}/painel/planos/verificar-assinatura`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            
            const dados = await response.json();
            console.log('Dados recebidos:', dados);
            
            if (!dados.temAssinatura) {
                carregando = false;
                erro = "Você não possui uma assinatura ativa";
                return;
            }
            
            assinatura = dados.assinatura;
            carregando = false;
        } catch (error) {
            console.error('Erro ao verificar assinatura:', error);
            carregando = false;
            erro = `Não foi possível verificar sua assinatura. ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        }
    }
    
    // Carregar dados ao montar o componente
    onMount(verificarAssinatura);
    
    function formatarData(data: string): string {
        return format(parseISO(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }

    // Função para obter os benefícios do plano
    function obterBeneficios(tipoPlano: string): string[] {
        const beneficiosPorPlano: BeneficiosPorPlano = {
            'basico': [
                "Visibilidade nos resultados de busca",
                "Página personalizada do comércio",
                "Suporte por email" 
            ],
            'premium': [
                "Maior visibilidade nos resultados",
                "Destaque em pesquisas",
                "Suporte prioritário",
                "Publicação ilimitada de anúncios"
            ]
        };
        
        return beneficiosPorPlano[tipoPlano] || [
            "Visibilidade nos resultados",
            "Página personalizada",
            "Suporte ao cliente"
        ];
    }
</script>

<div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
    {#if carregando}
        <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent mb-4"></div>
            <p class="text-gray-600">Verificando sua assinatura...</p>
        </div>
    {:else if erro}
        <div class="text-center py-8">
            <X class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p class="text-red-600 font-medium mb-2">{erro}</p>
            <div class="mt-4">
                <button 
                    class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    on:click={verificarAssinatura}
                >
                    <RefreshCw class="w-4 h-4 mr-2" />
                    Tentar Novamente
                </button>
            </div>
        </div>
    {:else if assinatura}
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Plano {assinatura.plano.charAt(0).toUpperCase() + assinatura.plano.slice(1)}</h2>
            {#if assinatura.ativa}
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Ativo
                </span>
            {:else}
                <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    Inativo
                </span>
            {/if}
        </div>

        <p class="text-gray-600 mb-6">R$ {assinatura.valor.toFixed(2)}/mês</p>

        <!-- Barra de Progresso -->
        <div class="mb-6">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    class="h-full bg-blue-600 transition-all duration-500" 
                    style="width: {assinatura.porcentagemUsada}%"
                ></div>
            </div>
            <div class="mt-2 flex justify-between text-sm text-gray-600">
                <span>Dias restantes: {assinatura.diasRestantes}</span>
                <span>{assinatura.porcentagemUsada}% utilizado</span>
            </div>
        </div>

        <!-- Datas -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start space-x-3">
                    <Calendar class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                        <p class="text-sm font-medium text-gray-600">Início</p>
                        <p class="text-sm text-gray-800">{formatarData(assinatura.data_inicio)}</p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <Clock class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                        <p class="text-sm font-medium text-gray-600">Término</p>
                        <p class="text-sm text-gray-800">{formatarData(assinatura.data_fim)}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefícios -->
        <h3 class="font-semibold text-gray-800 mb-3">Benefícios da sua assinatura</h3>
        <ul class="space-y-2">
            {#each obterBeneficios(assinatura.plano) as beneficio}
                <li class="flex items-center text-gray-700">
                    <Check class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{beneficio}</span>
                </li>
            {/each}
        </ul>

        <!-- Botão de Renovação (mostrar apenas quando estiver próximo do fim) -->
        {#if assinatura.diasRestantes <= 7 && assinatura.ativa}
            <div class="mt-6">
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Renovar Assinatura
                </button>
            </div>
        {:else if !assinatura.ativa}
            <div class="mt-6">
                <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Adquirir Nova Assinatura
                </button>
            </div>
        {/if}
        
        <!-- Botão para verificar manualmente -->
        <div class="mt-6 text-center">
            <button 
                class="inline-flex items-center text-blue-600 hover:text-blue-800"
                on:click={verificarAssinatura}
            >
                <RefreshCw class="w-4 h-4 mr-1" />
                <span class="text-sm">Verificar novamente</span>
            </button>
        </div>
    {/if}
</div>