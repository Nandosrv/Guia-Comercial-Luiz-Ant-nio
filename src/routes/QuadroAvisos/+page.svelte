<script lang="ts">
  import { writable } from 'svelte/store';
  import { createClient } from '@supabase/supabase-js';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { getAuth } from 'firebase/auth';
  import { userPhotoURL } from '../../stores/user';
  import { goto } from '$app/navigation';
  import * as firebase from '../../firebase';
	import { uploadPicturesAnnounce } from '$lib/serve/uploadPicturesAnnounce';



  
  // Inicializando o Firebase e Supabase
  const auth = getAuth();
  let user = auth.currentUser;

  // Verificando o usuário logado
  if (!user) {
      console.error('Usuário não autenticado');
  }

  // Configuração do Supabase
  const supabaseUrl = 'https://wsxmoaqtqsncoaawmuhp.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeG1vYXF0cXNuY29hYXdtdWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDU0NjgsImV4cCI6MjA0Nzg4MTQ2OH0.cL3pGYarT9LhhZZ3JG10lpXyIy8Om_r2T14rCr8xrh4';
  const supabase = createClient(supabaseUrl, supabaseKey);

  type Anuncio = {
      id: number;
      nome: string;
      telefone: string;
      tipo: string;
      conteudo: string;
      foto: string | null;
      resolvido: boolean;
      user_id: string;
  };

  const anuncios = writable<Anuncio[]>([]);
  let filtroSelecionado = 'Todos';
  let modalAberto = false;
  let novoAnuncio: Omit<Anuncio, 'id'> = {
      nome: '',
      telefone: '',
      tipo: 'Vendo',
      conteudo: '',
      foto: null,
      resolvido: false,
      user_id: user?.uid || ''
  };
  let fotoPreview: string | null = null;
  let fotoPreviewFile: File | null = null;
  
  // Função para carregar os anúncios do banco de dados
  let carregando = true;

async function carregarAnuncios() {
    carregando = true;
    const { data, error } = await supabase.from('anuncios').select('*').order('id', { ascending: true });
    carregando = false;
    if (error) {
        console.error('Erro ao carregar anúncios:', error);
    } else {
        anuncios.set(data || []);
    }
}


  // Função para postar um novo anúncio
  async function postarAnuncio() {
      if (!user) {
          console.error('Usuário não autenticado');
          return;
      }
      let pathFotoPreview: string | null = null;
      if (fotoPreviewFile) {
         pathFotoPreview = await uploadPicturesAnnounce(fotoPreviewFile, user.uid);
        
      }
      const { data, error } = await supabase
          .from('anuncios')
          .insert([
              {
                  ...novoAnuncio,
                  foto: pathFotoPreview,
                  user_id: user.uid // Adicionando o user_id ao anúncio
              }
          ]);

      if (error) {
          console.error('Erro ao postar anúncio:', error);
      } else {
          carregarAnuncios();
          fecharModal();
      }
  }

  // Função para marcar um anúncio como resolvido
  async function marcarComoResolvido(id: number, user_id: string) {
    // Verifica se o usuário logado é o mesmo que postou o anúncio
    if (user?.uid !== user_id) {
        console.error('Você não tem permissão para marcar este anúncio como resolvido');
        return;
    }

    const { error } = await supabase.from('anuncios').update({ resolvido: true }).eq('id', id);
    if (error) {
        console.error('Erro ao marcar como resolvido:', error);
    } else {
        carregarAnuncios();
    }
}


  // Função para filtrar os anúncios
  function filtrarAnuncios(anuncios: Anuncio[], filtro: string) {
    if (filtro === 'Todos') return anuncios;
    if (filtro === 'Ativos') return anuncios.filter(anuncio => !anuncio.resolvido);
    if (filtro === 'Resolvidos') return anuncios.filter(anuncio => anuncio.resolvido);
    return anuncios.filter(anuncio => anuncio.tipo === filtro);
}


  // Funções para modal
  function abrirModal() {
      modalAberto = true;
  }

  function fecharModal() {
      modalAberto = false;
      novoAnuncio = { nome: '', telefone: '', tipo: 'Vendo', conteudo: '', foto: null, resolvido: false, user_id: user?.uid || '' };
      fotoPreview = null;
  }

  // Pré-visualização da foto
  function handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              fotoPreviewFile = file;
          };
          reader.readAsDataURL(file);
      }
  }

  // Categorias de anúncios
  const tiposAnuncio = ['Vendo', 'Procuro emprego', 'Achados e perdidos'];

  // Carregar anúncios ao inicializar
  carregarAnuncios();
</script>

<!-- Código HTML -->
<main class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-center text-blue-800">Quadro de Anúncios</h1>

    <div class="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="w-full sm:w-auto">
        <label for="filtro" class="block text-lg font-semibold text-gray-700 mb-2 sm:mb-0 sm:mr-2">Filtrar por:</label>
        <select
          id="filtro"
          bind:value={filtroSelecionado}
          class="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>Todos</option>
          <option>Ativos</option>
          <option>Resolvidos</option>
          {#each tiposAnuncio as tipo}
            <option>{tipo}</option>
          {/each}
        </select>
      </div>
      <button
        on:click={abrirModal}
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Postar Novo Anúncio
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {#each filtrarAnuncios($anuncios, filtroSelecionado) as anuncio (anuncio.id)}
      <div
          in:fly={{ y: 50, duration: 300}}
          out:fade={{ duration: 300 }}
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative flex flex-col"
        >
          {#if anuncio.resolvido}
            <div class="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-sm rounded-bl-lg z-10">
              Resolvido
            </div>
          {/if}
          {#if anuncio.foto}
          <img src={anuncio.foto} alt="Imagem do anúncio" class="w-full h-48 object-cover" loading="lazy" />
          
          {/if}
          <div class="p-4 flex-grow">
            <h2 class="text-xl md:text-2xl font-semibold mb-2 text-blue-800">{anuncio.tipo}</h2>
            <p class="text-gray-600 mb-4 text-sm md:text-base">{anuncio.conteudo}</p>
            <div class="flex justify-between items-center text-xs md:text-sm text-gray-500 mb-2">
              <span>{anuncio.nome}</span>
             <a href="tel:{anuncio.telefone}" class="text-blue-400">{anuncio.telefone}</a>
            </div>
          </div>
          {#if !anuncio.resolvido && anuncio.user_id === user?.uid}
          <button
              on:click={() => marcarComoResolvido(anuncio.id, anuncio.user_id)}
              class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-sm md:text-base"
          >
              Marcar como Resolvido
          </button>
      {/if}
      
        </div>
      {/each}
    </div>
  </div>

  {#if modalAberto}
    <div
      transition:fade="{{ duration: 300 }}"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div
        in:fly="{{ y: -50, duration: 300, delay: 150, easing: quintOut }}"
        out:fly="{{ y: 50, duration: 300, easing: quintOut }}"
        class="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto"
      >
        <div class="p-6">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-blue-800">Novo Anúncio</h2>
          <form on:submit|preventDefault={postarAnuncio} class="space-y-4">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
              <input
                id="nome"
                bind:value={novoAnuncio.nome}
                type="text"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do Anunciante"
              />
            </div>
            <div>
              <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Anúncio:</label>
              <select
                id="tipo"
                bind:value={novoAnuncio.tipo}
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {#each tiposAnuncio as tipo}
                  <option value={tipo}>{tipo}</option>
                {/each}
              </select>
            </div>
            
            <div>
              <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
              <input
                id="telefone"
                bind:value={novoAnuncio.telefone}
                type="tel"
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Telefone"
              />
            </div>

            <div>
              <label for="conteudo" class="block text-sm font-medium text-gray-700 mb-1">Conteúdo do anúncio:</label>
              <textarea
                id="conteudo"
                bind:value={novoAnuncio.conteudo}
                class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição do anúncio"
              ></textarea>
            </div>

            <div>
              <label for="foto" class="block text-sm font-medium text-gray-700 mb-1">Carregar foto (opcional):</label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                on:change={handleFileChange}
                class="w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-blue-100 file:text-blue-700 file:rounded-lg"
              />
              {#if fotoPreview}
                <div class="mt-4">
                  <img src={fotoPreview} alt="Preview da Foto" class="w-full h-48 object-cover rounded-lg" />
                </div>
              {/if}
            </div>

            <div class="flex justify-between items-center">
              <button
                type="button"
                on:click={fecharModal}
                class="text-gray-500 hover:text-gray-700 text-sm md:text-base font-medium"
              >
                Fechar
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition duration-300"
              >
                Publicar Anúncio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
</main>

