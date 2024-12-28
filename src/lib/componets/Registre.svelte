<script lang="ts">
	import { goto } from '$app/navigation';
	import Icongogole from '$lib/images/googlelogo.png';
	import post1 from '$lib/images/post1.png';
	import { loginWithGoogle } from '$lib/services/authService.svelte';
	import { userStore } from '../../stores/userStore.svelte';

	let isRegistering = false; // Variável para alternar entre login e registro
	let email = ''; // E-mail
	let password = ''; // Senha
	let confirmPassword = ''; // Confirmação de senha
	let errorMessage = ''; // Mensagem de erro

	const toggleForm = () => {
		isRegistering = !isRegistering;
	};

</script>
<div
class="w-1/2 h-full flex flex-col justify-center items-center px-8 md:px-12 transition-transform duration-500 ease-in-out"
style="transform: translateX({isRegistering ? '0' : '100%'})"
>
<h2 class="text-4xl font-semibold text-gray-800 mb-6">Criar Conta</h2>
<p class="text-gray-600 text-center mb-8">Comece sua jornada agora mesmo!</p>
<form class="w-full space-y-6">
  <div>
    <label for="name" class="block text-gray-700 font-medium mb-2">Nome</label>
    <input
      id="name"
      type="text"
      placeholder="Digite seu nome"
      class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label for="email-register" class="block text-gray-700 font-medium mb-2">Email</label>
    <input
      id="email-register"
      type="email"
      bind:value={email}
      placeholder="Digite seu email"
      class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label for="password-register" class="block text-gray-700 font-medium mb-2">Senha</label>
    <input
      id="password-register"
      type="password"
      bind:value={password}
      placeholder="Digite sua senha"
      class="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <button
    type="submit"
    class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
  >
    Registrar
  </button>
</form>

<p class="text-sm text-gray-600 mt-6">
  Já tem uma conta?
  <button
    class="text-indigo-500 font-medium hover:underline focus:outline-none"
    on:click={toggleForm}
  >
    Login
  </button>
</p>
</div>