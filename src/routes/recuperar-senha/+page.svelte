<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { 
    Mail, 
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Loader,
    Send
  } from 'lucide-svelte';
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { firebaseApp } from "$lib/firebase/client";

  type ErrorState = {
    email?: string;
    form?: string;
  };

  let email: string = '';
  let isLoading: boolean = false;
  let errors: ErrorState = {};
  let successMessage: string = '';
  let isSubmitted: boolean = false;

  const auth = getAuth(firebaseApp);

  function validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  async function handleSubmit(): Promise<void> {
    errors = {};
    successMessage = '';
    
    if (!email) {
      errors.email = 'O email é obrigatório';
      return;
    } else if (!validateEmail(email)) {
      errors.email = 'Email inválido';
      return;
    }
    
    isLoading = true;
    
    try {
      await sendPasswordResetEmail(auth, email);
      successMessage = 'Enviamos um link de recuperação para o seu email.';
      isSubmitted = true;
    } catch (error: any) {
      console.error("Erro ao enviar email:", error);
      errors.form = error.message || 'Ocorreu um erro. Tente novamente.';
    } finally {
      isLoading = false;
    }
  }

  function resetForm(): void {
    isSubmitted = false;
    successMessage = '';
    errors = {};
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg" in:fade={{ duration: 300 }}>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Recuperação de Senha
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {#if !isSubmitted}
          Digite seu email para receber um link de recuperação
        {:else}
          Verifique sua caixa de entrada
        {/if}
      </p>
    </div>
    
    {#if successMessage}
      <div class="bg-green-50 p-4 rounded-md flex items-start" in:fly={{ y: -20, duration: 300 }}>
        <CheckCircle class="h-5 w-5 text-green-500 mr-3 mt-0.5" />
        <span class="text-green-700">{successMessage}</span>
      </div>
    {/if}
    
    {#if errors.form}
      <div class="bg-red-50 p-4 rounded-md flex items-start" in:fly={{ y: -20, duration: 300 }}>
        <AlertCircle class="h-5 w-5 text-red-500 mr-3 mt-0.5" />
        <span class="text-red-700">{errors.form}</span>
      </div>
    {/if}
    
    {#if !isSubmitted}
      <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                bind:value={email}
                class={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="seu@email.com"
              />
            </div>
            {#if errors.email}
              <p class="mt-1 text-sm text-red-600" in:fly={{ y: -10, duration: 200 }}>{errors.email}</p>
            {/if}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
          >
            {#if isLoading}
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <Loader class="h-5 w-5 text-indigo-300 animate-spin" />
              </span>
              Enviando...
            {:else}
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <Send class="h-5 w-5 text-indigo-300" />
              </span>
              Enviar link de recuperação
            {/if}
          </button>
        </div>
      </form>
    {:else}
      <div class="mt-6 space-y-6">
        <div class="bg-blue-50 p-4 rounded-md">
          <p class="text-blue-700 text-sm">
            Se o email estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha. 
            Por favor, verifique também sua pasta de spam.
          </p>
        </div>
        
        <button
          type="button"
          on:click={resetForm}
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tentar com outro email
        </button>
      </div>
    {/if}
    
    <div class="mt-6 flex items-center justify-center">
      <a 
        href="/login" 
        class="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        <ArrowLeft class="h-4 w-4 mr-1" />
        Voltar para o login
      </a>
    </div>
  </div>
</div>
