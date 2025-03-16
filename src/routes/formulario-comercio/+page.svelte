<script lang="ts">
  import { onMount } from 'svelte';
	import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';

  import { goto } from '$app/navigation';
  import { getAuth } from 'firebase/auth';
  import { 
    Store, 
    MapPin, 
    Phone, 
    Loader2, 
    CheckCircle, 
    AlertCircle,
    Building2,
    ArrowRight,
    ShoppingBag,

	Mail

  } from 'lucide-svelte';

  let nome = '';
  let endereco = '';
  let telefone = '';
  let categoria = '';
  let email = '';
  let firebase_id = '';
  let descricao = '';
  let isComerciante = false;
  let isLoading = true;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';
  console.log('userId:', email);
  const categorias = [
    'Alimentação', 
    'Serviços', 
    'Saúde', 
    'Beleza', 
    'Vestuário', 
    'Tecnologia',
    'Automotivo',
    'Educação',
    'Entretenimento',
    'Outro'
  ];

  const auth = getAuth();
  
  const userId = auth.currentUser?.uid; // Obtém o ID do usuário autenticado
  // Verifica se o usuário já tem um comércio
  onMount(async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
        const data = await response.json();

        if (data && data.isComerciante) {
          isComerciante = true;
          // Redireciona para o painel após verificar que é comerciante
          setTimeout(() => {
            goto('/painel');
          }, 500);
        }
      } catch (error) {
        console.error('Erro ao verificar comerciante:', error);
        errorMessage = 'Não foi possível verificar seu cadastro. Tente novamente.';
      } finally {
        isLoading = false;
      }
    } else {
      isLoading = false;
      errorMessage = 'Você precisa estar logado para cadastrar um comércio.';
    }
  });

  // Cadastrar novo comércio
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    isSubmitting = true;
    errorMessage = '';
    successMessage = '';

    if (!userId) {
      errorMessage = 'Erro: Usuário não autenticado.';
      isSubmitting = false;
      return;
    }
    const token = await pegarTokenUsuario();

    try {
      const response = await fetch('http://localhost:3000/cadastrar-comercio', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          
        },
        body: JSON.stringify({ 
          userId, 
          nome, 
          email,
          endereco, 
          telefone,
          categoria,
          firebase_id,
          descricao
        }),
      });

      const data = await response.json();

      if (data.success) {
        successMessage = 'Comércio cadastrado com sucesso!';
        // Limpar formulário
        nome = '';
        endereco = '';
        telefone = '';
        categoria = '';
        descricao = '';
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          goto('/painel');
        }, 2000);
      } else {
        errorMessage = data.message || 'Erro ao cadastrar o comércio.';
      }
    } catch (error) {
      console.error('Erro ao cadastrar comércio:', error);
      errorMessage = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
    } finally {
      isSubmitting = false;
    }
    console.log('📤 Enviando dados:', { userId, nome, endereco, telefone, email, firebase_id,categoria });

  };
  console.log('userId:', userId);

  // Formatar telefone automaticamente
  function formatarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      // Formato: (XX) XXXXX-XXXX
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else if (value.length <= 11) {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
      } else {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
      }
    }
    
    telefone = value;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="flex justify-center mb-4">
        <div class="bg-purple-600 p-3 rounded-full inline-flex items-center justify-center">
          <Store class="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Cadastre seu Comércio
      </h1>
      <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
        Aumente sua visibilidade e alcance novos clientes cadastrando seu negócio em nossa plataforma.
      </p>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center py-20">
        <Loader2 class="h-10 w-10 text-purple-600 animate-spin" />
        <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">Verificando cadastro...</span>
      </div>
    {:else if errorMessage && !userId}
      <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
        <div class="flex items-center">
          <AlertCircle class="h-6 w-6 text-red-500 mr-3" />
          <p class="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
        <div class="mt-4 flex justify-center">
          <a href="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Fazer Login
            <ArrowRight class="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    {:else if !isComerciante}
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <!-- Card Header -->
        <div class="bg-purple-600 px-6 py-4">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <Building2 class="h-6 w-6 mr-2" />
            Informações do seu Negócio
          </h2>
        </div>

        <!-- Form -->
        <form on:submit={handleSubmit} class="px-6 py-8 space-y-6">
          {#if errorMessage}
            <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
              <div class="flex">
                <AlertCircle class="h-5 w-5 text-red-500 mr-3" />
                <p class="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
            </div>
          {/if}

          {#if successMessage}
            <div class="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-md">
              <div class="flex">
                <CheckCircle class="h-5 w-5 text-green-500 mr-3" />
                <p class="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          {/if}

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Nome do Comércio -->
            <div class="sm:col-span-6">
              <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Comércio <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nome"
                  type="text"
                  bind:value={nome}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Ex: Mercado São João"
                />
              </div>
            </div>

            <!-- Categoria -->
            <div class="sm:col-span-3">
              <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <select
                  id="categoria"
                  bind:value={categoria}
                  required
                  class="block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value="" disabled selected>Selecione uma categoria</option>
                  {#each categorias as cat}
                    <option value={cat}>{cat}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Telefone -->
            <div class="sm:col-span-3">
              <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefone"
                  type="text"
                  bind:value={telefone}
                  on:input={formatarTelefone}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="(00) 00000-0000"
                  maxlength="16"
                />
              </div>
            </div>

            <!-- Endereço -->
            <div class="sm:col-span-6">
              <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereço <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="endereco"
                  type="text"
                  bind:value={endereco}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Rua, número, bairro, cidade - UF"
                />
              </div>
            </div>
            <!-- Email -->
            <div class="sm:col-span-6">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="text"
                  bind:value={email}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <!-- Descrição -->
            <div class="sm:col-span-6">
              <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição do Comércio
              </label>
              <div class="mt-1">
                <textarea
                  id="descricao"
                  bind:value={descricao}
                  rows="4"
                  class="block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Descreva seu comércio, produtos ou serviços oferecidos..."
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Uma boa descrição ajuda os clientes a encontrarem seu negócio.
              </p>
            </div>
          </div>

          <div class="pt-5">
            <div class="flex justify-end">
              <button
                type="button"
                class="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                on:click={() => goto('/')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {#if isSubmitting}
                  <Loader2 class="h-5 w-5 mr-2 animate-spin" />
                  Processando...
                {:else}
                  Cadastrar Comércio
                {/if}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Benefits Section -->
      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <MapPin class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Visibilidade Local</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Seja encontrado por clientes na sua região que estão procurando seus produtos ou serviços.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <ShoppingBag class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aumente suas Vendas</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Alcance novos clientes e aumente suas vendas com uma presença digital eficiente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg sm:col-span-2 lg:col-span-1">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Phone class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Contato Direto</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Facilite o contato direto com seus clientes através de telefone e WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>