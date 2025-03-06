<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { 
    Eye, 
    EyeOff, 
    Mail, 
    Lock, 
    UserPlus, 
    LogIn, 
    AlertCircle,
    CheckCircle,
    Loader
  } from 'lucide-svelte';
  import { auth } from '$lib/firebase/client';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
  import { createClient } from '@supabase/supabase-js';
  import { goto } from '$app/navigation';
  import { loginWithGoogle, persistenciaUser } from '$lib/services/authService.svelte';
  import supabase from '$lib/supabaseClient';


  type ErrorState = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  };

  type User = {
	id: any;
    email: string;
    name: string;
    firebase_id: string;
  };

  let activeTab: 'login' | 'register' = 'login';
  let email: string = '';
  let password: string = '';
  let confirmPassword: string = '';
  let name: string = ''; // Nome do usuário
  let showPassword: boolean = false;
  let showConfirmPassword: boolean = false;
  let isLoading: boolean = false;
  let errors: ErrorState = {};
  let successMessage: string = '';
  let errorMessage: string = '';
  let passwordStrength: number = 0;
  let passwordStrengthText: string = '';
  let passwordStrengthColor: string = 'bg-gray-200';

  async function registerUserInSupabase(user: User) {
    const { error } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        username: user.name,
        firebase_id: user.firebase_id,
        // created_at will be auto-handled by Supabase if set to NOW() in database schema
      }]);
    if (error) {
      throw new Error(`Erro ao registrar no Supabase: ${error.message}`);
    }
  }

  async function handleSubmit(): Promise<void> {
    errors = {};
    successMessage = '';
    if (!email) {
      errors.email = 'O email é obrigatório';
    } else if (!validateEmail(email)) {
      errors.email = 'Email inválido';
    }
    if (!name && activeTab !== 'login') {
      errors.form = 'O nome é obrigatório';
    }
    if (!password) {
      errors.password = 'A senha é obrigatória';
    } else if (password.length < 8) {
      errors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    if (activeTab === 'register' && password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    if (Object.keys(errors).length > 0) {
      return;
    }
    isLoading = true;
    try {
      if (activeTab === 'login') {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        // console.log("userCredemtial",userCredemtial);
        // const { user } = await signInWithPopup(auth, provider);
        console.log("user",user);
        if (!user) {
          throw new Error('Erro ao fazer login com Google');
        }
	      await persistenciaUser(user as never, false);
        successMessage = 'Login realizado com sucesso!';
        goto('/perfil');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await registerUserInSupabase({
          email, 
          name,
          id: userCredential.user.uid,
          firebase_id: userCredential.user.uid
        });
        successMessage = 'Cadastro realizado com sucesso!';
        email = '';
        password = '';
        confirmPassword = '';
        name = '';
      }
    } catch (error: any) {
      errors.form = error.message;
    } finally {
      isLoading = false;
    }
  }

  function validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  function validatePassword(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }

  $: {
    passwordStrength = validatePassword(password);
    if (passwordStrength === 0) {
      passwordStrengthText = 'Muito fraca';
      passwordStrengthColor = 'bg-red-500';
    } else if (passwordStrength === 1) {
      passwordStrengthText = 'Fraca';
      passwordStrengthColor = 'bg-red-400';
    } else if (passwordStrength === 2) {
      passwordStrengthText = 'Média';
      passwordStrengthColor = 'bg-yellow-400';
    } else if (passwordStrength === 3) {
      passwordStrengthText = 'Boa';
      passwordStrengthColor = 'bg-green-400';
    } else if (passwordStrength >= 4) {
      passwordStrengthText = 'Forte';
      passwordStrengthColor = 'bg-green-500';
    }
  }

  async function handleResetPassword(): Promise<void> {
    errors = {};
    successMessage = '';
    if (!email) {
      errors.email = 'O email é obrigatório';
      return;
    }
    isLoading = true;
    try {
      await sendPasswordResetEmail(auth, email);
      successMessage = 'Email de redefinição enviado!';
    } catch (error: any) {
      errors.form = error.message;
    } finally {
      isLoading = false;
    }
  }

  function setActiveTab(tab: 'login' | 'register'): void {
    activeTab = tab;
    errors = {};
    successMessage = '';
  }

  let emailInput: HTMLInputElement;
  onMount(() => {
    emailInput?.focus();
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg" in:fade={{ duration: 300 }}>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
      </h2>
      
      <div class="mt-6 flex border-b border-gray-200">
        <button 
          class={`py-2 px-4 font-medium text-sm flex-1 ${activeTab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          on:click={() => setActiveTab('login')}
        >
          Login
        </button>
        <button 
          class={`py-2 px-4 font-medium text-sm flex-1 ${activeTab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          on:click={() => setActiveTab('register')}
        >
          Cadastro
        </button>
      </div>
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
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm space-y-4">
        
        {#if activeTab === 'register'}
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <div class="relative">
              <input
                id="name"
                name="name"
                type="text"
                bind:value={name}
                class="appearance-none block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Seu nome"
              />
            </div>
          </div>
        {/if}

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
              bind:this={emailInput}
              class={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="seu@email.com"
            />
          </div>
          {#if errors.email}
            <p class="mt-1 text-sm text-red-600" in:fly={{ y: -10, duration: 200 }}>{errors.email}</p>
          {/if}
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autocomplete={activeTab === 'login' ? "current-password" : "new-password"}
              bind:value={password}
              class={`appearance-none block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="********"
            />
            <button 
              type="button" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              on:click={() => showPassword = !showPassword}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {#if showPassword}
                <EyeOff class="h-5 w-5 text-gray-400" />
              {:else}
                <Eye class="h-5 w-5 text-gray-400" />
              {/if}
            </button>
          </div>
          {#if errors.password}
            <p class="mt-1 text-sm text-red-600" in:fly={{ y: -10, duration: 200 }}>{errors.password}</p>
          {/if}
          
          {#if activeTab === 'register' && password}
            <div class="mt-2">
              <div class="text-xs text-gray-600 mb-1">Força da senha: {passwordStrengthText}</div>
              <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class={`h-full ${passwordStrengthColor}`} style={`width: ${passwordStrength * 20}%`}></div>
              </div>
            </div>
          {/if}
        </div>
        
        {#if activeTab === 'register'}
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autocomplete="new-password"
                bind:value={confirmPassword}
                class={`appearance-none block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="********"
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                on:click={() => showConfirmPassword = !showConfirmPassword}
                aria-label={showConfirmPassword ? "Esconder confirmação de senha" : "Mostrar confirmação de senha"}
              >
                {#if showConfirmPassword}
                  <EyeOff class="h-5 w-5 text-gray-400" />
                {:else}
                  <Eye class="h-5 w-5 text-gray-400" />
                {/if}
              </button>
            </div>
            {#if errors.confirmPassword}
              <p class="mt-1 text-sm text-red-600" in:fly={{ y: -10, duration: 200 }}>{errors.confirmPassword}</p>
            {/if}
          </div>
        {/if}
      </div>

      {#if activeTab === 'login'}
        <div class="flex items-center justify-end">
          <div class="text-sm">
            <a href="/recuperar-senha" class="font-medium text-indigo-600 hover:text-indigo-500">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      {/if}

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
            {activeTab === 'login' ? 'Entrando...' : 'Cadastrando...'}
          {:else}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              {#if activeTab === 'login'}
                <LogIn class="h-5 w-5 text-indigo-300" />
              {:else}
                <UserPlus class="h-5 w-5 text-indigo-300" />
              {/if}
            </span>
            {activeTab === 'login' ? 'Entrar' : 'Cadastrar'}
          {/if}
        </button>
      </div>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">
            Ou continue com
          </span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-3 gap-3">
        <div>
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button
          on:click={loginWithGoogle}
          class="w-full rounded-md bg-white py-2 text-white justify-center items-center flex border border-gray-300"
        >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
        </button>

        </div>

        <div>
          <a 
            href="/auth/github" 
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            aria-label="Entrar com GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>

        <div>
          <a 
            href="/auth/facebook" 
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            aria-label="Entrar com Facebook"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  input {
    color: black;
  }
</style>