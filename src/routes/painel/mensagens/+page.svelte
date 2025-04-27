<script lang="ts">
  import { onMount } from 'svelte';
  import { Mail } from 'lucide-svelte';
  import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
  import { getAuth } from 'firebase/auth';

  let mensagens: any[] = [];
  let novaMensagem = { nome: '', email: '', mensagem: '' };
  let activeTab = 'mensagens'; // A aba ativa que você quer mostrar
  let estatisticas = {
    mensagens: {
      novas: 0
    }
  };

  const auth = getAuth();

  // Função para carregar as mensagens
  async function carregarMensagens() {
const userId = auth.currentUser?.uid;
if (!userId) {
  console.error('Usuário não autenticado');
  return;
}

const token = await pegarTokenUsuario(); // Obter o token de autenticação

try {
  const response = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/mensagens/mensagens/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar mensagens: ${response.statusText}`);
  }

  const data = await response.json();
  mensagens = data;

  // Atualizando a quantidade de novas mensagens
  estatisticas.mensagens.novas = mensagens.filter((msg) => !msg.lida).length;
} catch (error) {
  console.error('Erro ao carregar mensagens:', error);
}
}
  const userId = auth.currentUser?.uid; // Garantindo que o userId seja capturado
  console.log("currentUser", userId);

  // Função para enviar uma nova mensagem
 // Função para enviar uma nova mensagem
// Função para enviar uma nova mensagem
async function enviarMensagem() {
const token = await pegarTokenUsuario();
// Logs para verificar o conteúdo de novaMensagem
console.log('Dados da mensagem:', novaMensagem);


// Verifique se todos os campos estão preenchidos
if (!novaMensagem.nome || !novaMensagem.email || !novaMensagem.mensagem) {
  console.error('Todos os campos devem ser preenchidos!');
  return;
}

// Validação de email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
if (!emailRegex.test(novaMensagem.email)) {
  console.error('Email inválido!');
  return;
}

try {
  const response = await fetch('https://api-backend-production-5b22.up.railway.app/painel/mensagens/mensagens', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
nome: novaMensagem.nome,
email: novaMensagem.email, // Email deve estar preenchido
texto: novaMensagem.mensagem,
userId: auth.currentUser?.uid,
data: new Date().toISOString()
})
});

  const data = await response.json();

  if (!response.ok) {
      console.error('Erro ao enviar mensagem:', data.message || JSON.stringify(data) || 'Erro desconhecido');   } else {
    novaMensagem = { nome: '', email: '', mensagem: '' }; // Limpa o formulário após o envio
    carregarMensagens(); // Atualiza a lista de mensagens
  }
} catch (error) {
  console.error('Erro ao enviar mensagem:', error);
}
}




  // Função para marcar uma mensagem como lida
  async function marcarMensagemComoLida(id: string) {
const token = await pegarTokenUsuario();
console.log('🔵 Enviando requisição para:', `https://api-backend-production-5b22.up.railway.app/painel/mensagens/mensagens/${id}`);

try {
  const resposta = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/mensagens/mensagens/${id}`, {
    method: 'PUT',  // Garante que está sendo enviado PUT
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({}) // Passando o status de leitura no corpo da requisição
  });

  console.log('🔵 Método da requisição:', resposta.status); // Verifica o status

  if (!resposta.ok) {
    throw new Error(`Erro ao marcar mensagem como lida: ${resposta.statusText}`);
  }

  const dados = await resposta.json();
  console.log('✅ Mensagem marcada como lida:', dados);
  carregarMensagens(); // Atualizando a lista após marcar
} catch (error) {
  console.error('❌ Erro ao marcar mensagem como lida:', error);
}
}

  onMount(() => {
    carregarMensagens();
  });
</script>

  <div>
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Mensagens</h1>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Gerencie as mensagens recebidas dos clientes.
    </p>

    <div class="mt-6 overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-lg">
      <div class="flex items-center justify-between px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Caixa de Entrada
        </h3>
        {#if estatisticas.mensagens.novas > 0}
          <span
            class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            {estatisticas.mensagens.novas} novas
          </span>
        {/if}
      </div>
      <div class="border-t border-gray-200 dark:border-gray-700">
        {#if mensagens.length === 0}
          <div class="px-4 py-5 text-center sm:px-6">
            <p class="text-sm text-gray-500 dark:text-gray-400">Você não tem mensagens.</p>
          </div>
        {:else}
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each mensagens as mensagem}
              <li
                class={`px-4 py-4 sm:px-6 ${!mensagem.lida ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                        {mensagem.nome}
                      </h4>
                      {#if !mensagem.lida}
                        <span
                          class="ml-2 inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          Nova
                        </span>
                      {/if}
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{mensagem.email}</p>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{mensagem.mensagem}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400"></p>
                  </div>
                  <div class="ml-6 flex flex-shrink-0 items-center space-x-2">
                    {#if !mensagem.lida}

                    <button
                    type="button"
                    on:click={() => marcarMensagemComoLida(mensagem.id)}
                    class="inline-flex items-center rounded border border-transparent bg-purple-100 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
                  >
                  <!--  -->
                    Marcar como lida
                  </button>
                    {/if}
                    <button
                      class="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <Mail class="h-5 w-5" />
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

<!-- Formulário para envio de mensagem -->
<div class="mt-8 p-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Enviar Nova Mensagem</h2>
  <form on:submit|preventDefault={enviarMensagem}>
    <div class="mt-4">
      <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
      <input
        id="nome"
        type="text"
        bind:value={novaMensagem.nome}
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
        placeholder="Seu nome"
        required
      />
    </div>
    <div class="mt-4">
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input
        id="email"
        type="email"
        bind:value={novaMensagem.email}
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
        placeholder="Seu email"
        required
      />
    </div>
    <div class="mt-4">
      <label for="mensagem" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</label>
      <textarea
        id="mensagem"
        bind:value={novaMensagem.mensagem}
        rows="4"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
        placeholder="Sua mensagem"
        required
      ></textarea>
    </div>
    <div class="mt-4 flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Enviar
      </button>
    </div>
  </form>
</div>
