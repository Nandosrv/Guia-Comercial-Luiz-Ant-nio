<script lang="ts">
  import { onMount } from 'svelte';
  import { Plus, Edit, Trash2, Eye } from 'lucide-svelte';
  import { getAuth } from 'firebase/auth';

  interface Produto {
    id: string | null;
    nome: string;
    descricao: string;
    preco: string;
    imagem: string;
    destaque: boolean;
    visualizacoes: number;
    [key: string]: any; // Para propriedades adicionais que possam vir do backend
  }

  let produtos: Produto[] = [];
  let loading = true;
  let error: string | null = null;
  let token: string | null = null;
  let auth = getAuth();
  
  // Modal de produto
  let isAddingProduto = false;
  let novoProduto: Produto = {
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    imagem: '',
    destaque: false,
    visualizacoes: 0
  };
  let isEditing = false;

  onMount(async () => {
    // Verificar se o usuário está autenticado e obter token
    try {
      const user = auth.currentUser;
      console.log("Estado de autenticação:", user ? "Autenticado" : "Não autenticado");
      
      if (user) {
        token = await user.getIdToken();
        console.log("Token obtido:", token ? "Sim" : "Não");
        await carregarProdutos();
      } else {
        // Se não estiver autenticado, tentar aguardar a autenticação
        auth.onAuthStateChanged(async (authUser) => {
          if (authUser) {
            console.log("Usuário autenticado após onAuthStateChanged");
            token = await authUser.getIdToken();
            await carregarProdutos();
          } else {
            error = "Usuário não autenticado. Faça login primeiro.";
            loading = false;
          }
        });
      }
    } catch (e: any) {
      console.error("Erro na inicialização:", e);
      error = e.message;
      loading = false;
    }
  });

  async function carregarProdutos() {
    loading = true;
    error = null;
    try {
      if (!token) {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        token = await user.getIdToken();
      }
      
      console.log("Fazendo requisição GET para produtos");
      const response = await fetch('https://api-backend-production-5b22.up.railway.app/painel/produto/produtos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resposta não-OK:", response.status, errorText);
        throw new Error(`Erro ao carregar produtos: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);
      
      produtos = data.map((p: any) => ({
        ...p,
        visualizacoes: p.visualizacoes || 0,
        destaque: p.destaque || false
      }));
    } catch (e: any) {
      console.error('Erro detalhado ao carregar produtos:', e);
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function adicionarProduto() {
    try {
      if (!token) {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        token = await user.getIdToken();
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      console.log("Enviando dados do produto:", novoProduto);
      
      const response = await fetch('https://api-backend-production-5b22.up.railway.app/painel/produto/produtos', {
        method: 'POST',
        headers,
        body: JSON.stringify(novoProduto)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resposta não-OK:", response.status, errorText);
        throw new Error(`Erro ao adicionar produto: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Produto adicionado com sucesso:", result);

      isAddingProduto = false;
      novoProduto = {
        id: null,
        nome: '',
        descricao: '',
        preco: '',
        imagem: '',
        destaque: false,
        visualizacoes: 0
      };
      await carregarProdutos();
    } catch (e: any) {
      console.error('Erro detalhado ao adicionar produto:', e);
      error = e.message;
    }
  }

  async function removerProduto(id: string | null) {
    if (!id) return;
    
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      if (!token) {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        token = await user.getIdToken();
      }
      
      const response = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/produto/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resposta não-OK:", response.status, errorText);
        throw new Error(`Erro ao excluir produto: ${response.status} ${errorText}`);
      }

      console.log("Produto removido com sucesso");
      await carregarProdutos();
    } catch (e: any) {
      console.error('Erro detalhado ao excluir produto:', e);
      error = e.message;
    }
  }

  $: {
    console.log('Estado atual:', { produtos, loading, error });
  }
</script>

{#if error}
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <strong class="font-bold">Erro: </strong>
    <span class="block sm:inline">{error}</span>
    <button on:click={() => error = null} class="absolute top-0 right-0 px-4 py-3">
      <span class="sr-only">Fechar</span>
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <button 
      on:click={carregarProdutos} 
      class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Tentar novamente
    </button>
  </div>
{/if}

{#if loading}
  <div class="flex justify-center items-center py-10">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    <span class="ml-3 text-gray-700 dark:text-gray-300">Carregando...</span>
  </div>
{:else}
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Produtos e Serviços</h1>
      <button 
        on:click={() => isAddingProduto = !isAddingProduto}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        <Plus class="h-5 w-5 mr-1" />
        Adicionar Produto
      </button>
    </div>
    
    {#if isAddingProduto}
      <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Novo Produto/Serviço
          </h3>
          <div class="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="nome-produto" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Produto/Serviço
              </label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="nome-produto" 
                  bind:value={novoProduto.nome}
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div class="sm:col-span-3">
              <label for="preco" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preço
              </label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="preco" 
                  bind:value={novoProduto.preco}
                  placeholder="R$ 0,00"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="descricao-produto" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <div class="mt-1">
                <textarea 
                  id="descricao-produto" 
                  rows="3" 
                  bind:value={novoProduto.descricao}
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                ></textarea>
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <label for="imagem" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                URL da Imagem
              </label>
              <div class="mt-1">
                <input 
                  type="text" 
                  id="imagem" 
                  bind:value={novoProduto.imagem}
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div class="sm:col-span-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="destaque" 
                    type="checkbox" 
                    bind:checked={novoProduto.destaque}
                    class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="destaque" class="font-medium text-gray-700 dark:text-gray-300">Produto em destaque</label>
                  <p class="text-gray-500 dark:text-gray-400">Marque esta opção para exibir este produto em destaque na sua página.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              on:click={adicionarProduto}
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Adicionar
            </button>
            <button 
              type="button" 
              on:click={() => isAddingProduto = false}
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Seus Produtos e Serviços
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Gerencie os produtos e serviços oferecidos pelo seu comércio.
        </p>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-700">
        {#if produtos.length === 0}
          <div class="px-4 py-5 sm:px-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Você ainda não cadastrou nenhum produto ou serviço.
            </p>
          </div>
        {:else}
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each produtos as produto}
              <li class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img class="h-12 w-12 rounded-md object-cover" src={produto.imagem || "/placeholder.svg"} alt={produto.nome} />
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center">
                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">{produto.nome}</h4>
                        {#if produto.destaque}
                          <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Destaque
                          </span>
                        {/if}
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{produto.preco}</p>
                      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{produto.descricao}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Eye class="h-3 w-3 mr-1" /> {produto.visualizacoes}
                    </span>
                    <button 
                      class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Edit class="h-5 w-5" />
                    </button>
                    <button 
                      on:click={() => removerProduto(produto.id)}
                      class="p-1 rounded-full text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}