<script>
// @ts-nocheck

  let menuAberto = false;
  let paginaAtual = 'dashboard';
  let usuarioDropdownAberto = false;

  // Dados do usuário
  const usuario = {
    nome: "Admin Silva",
    cargo: "Administrador",
    avatar: "https://ui-avatars.com/api/?name=Admin+Silva"
  };

  // Dados simulados
  const metricas = {
    totalUsuarios: 1254,
    visitasHoje: 325,
    anunciosAtivos: 876,
    receitaMensal: 15420,
    percentualOcupacao: 78,
    notificacoes: 5,
    mensagens: 3
  };

  // Dados para tabela de últimas atividades
  const ultimasAtividades = [
    { usuario: "João Silva", acao: "Novo anúncio", data: "2024-01-15", status: "Aprovado" },
    { usuario: "Maria Santos", acao: "Atualização", data: "2024-01-14", status: "Pendente" },
    { usuario: "Pedro Costa", acao: "Remoção", data: "2024-01-14", status: "Rejeitado" },
    { usuario: "Ana Souza", acao: "Novo usuário", data: "2024-01-13", status: "Aprovado" },
  ];

  // Dados simulados para o gráfico
  const dadosGrafico = [65, 45, 75, 50, 80, 45, 70];
  const maxValor = Math.max(...dadosGrafico);

  // Notificações
  const notificacoes = [
    { titulo: "Novo usuário registrado", tempo: "5 min atrás", lida: false },
    { titulo: "Atualização do sistema", tempo: "1 hora atrás", lida: false },
    { titulo: "Backup realizado", tempo: "2 horas atrás", lida: true },
  ];

  // Tarefas pendentes
  const tarefas = [
    { titulo: "Revisar anúncios", progresso: 70 },
    { titulo: "Atualizar perfis", progresso: 45 },
    { titulo: "Moderar comentários", progresso: 90 },
  ];

  function toggleMenu() {
    menuAberto = !menuAberto;
  }

  function toggleUserDropdown() {
    usuarioDropdownAberto = !usuarioDropdownAberto;
  }

  /**
	 * @param {string} pagina
	 */
  function mudarPagina(pagina) {
    paginaAtual = pagina;
  }
  
  // Estado do formulário de comércio
  let novoComercio = {
    nome: '',
    categoria: '',
    plano: 'basico',
    responsavel: '',
    telefone: '',
    whatsapp: '',
    email: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: 'Luiz Antônio',
      estado: 'SP',
      cep: ''
    },
    redesSociais: {
      facebook: '',
      instagram: '',
      site: ''
    },
    descricao: '',
    horarioFuncionamento: '',
    logo: null,
    fotos: []
  };

  // Categorias disponíveis
  const categorias = [
    'Restaurante',
    'Loja de Roupas',
    'Farmácia',
    'Supermercado',
    'Padaria',
    'Serviços',
    'Outros'
  ];

  // Planos disponíveis
  const planos = [
    { id: 'basico', nome: 'Básico', valor: 'R$ 50/mês', recursos: ['Listagem básica', 'Contato direto', 'Localização no mapa'] },
    { id: 'premium', nome: 'Premium', valor: 'R$ 100/mês', recursos: ['Todos do básico', 'Destaque na busca', 'Galeria de fotos', 'Links redes sociais'] },
    { id: 'destaque', nome: 'Destaque', valor: 'R$ 150/mês', recursos: ['Todos do premium', 'Banner promocional', 'Anúncios destacados', 'Relatórios mensais'] }
  ];

  // Função para lidar com upload de logo
  /**
	 * @param {{ target: { files: any[]; }; }} event
	 */
  function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Aqui você pode adicionar lógica para preview da imagem
      novoComercio.logo = file;
    }
  }

  // Função para lidar com upload de múltiplas fotos
  /**
	 * @param {{ target: { files: Iterable<any> | ArrayLike<any>; }; }} event
	 */
  function handleFotosUpload(event) {
    const files = Array.from(event.target.files);
    // @ts-ignore
    novoComercio.fotos = [...novoComercio.fotos, ...files];
  }

  // Função para remover foto
  /**
	 * @param {number} index
	 */
  function removerFoto(index) {
    novoComercio.fotos = novoComercio.fotos.filter((_, i) => i !== index);
  }

  // Função para enviar o formulário
  async function submeterComercio() {
    try {
      // Aqui você implementaria a lógica para enviar os dados para seu backend
      console.log('Dados do comércio:', novoComercio);
      // Exemplo de chamada API:
      // const response = await fetch('/api/comercios', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(novoComercio)
      // });
      alert('Comércio cadastrado com sucesso!');
      // Resetar formulário
      novoComercio = {
        nome: '',
        categoria: '',
        plano: 'basico',
        responsavel: '',
        telefone: '',
        whatsapp: '',
        email: '',
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: 'Luiz Antônio',
          estado: 'SP',
          cep: ''
        },
        redesSociais: {
          facebook: '',
          instagram: '',
          site: ''
        },
        descricao: '',
        horarioFuncionamento: '',
        logo: null,
        fotos: []
      };
    } catch (error) {
      // @ts-ignore
      alert('Erro ao cadastrar comércio: ' + error.message);
    }
  }
</script>

<!-- Layout Principal -->
<div class="flex h-screen bg-gray-100">
  <!-- Navegação Lateral -->
   
  <aside class="{menuAberto ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out">
    <div class="p-4 flex items-center justify-between">
      {#if menuAberto}
        <span class="text-xl font-bold">Admin Panel</span>
      {/if}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button on:click={toggleMenu} class="p-2 hover:bg-gray-700 rounded">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Links de Navegação -->
    <nav class="mt-4">
      <a 
        href="#dashboard" 
        class="flex items-center p-4 hover:bg-gray-700 {paginaAtual === 'dashboard' ? 'bg-gray-700' : ''}"
        on:click={() => mudarPagina('dashboard')}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        {#if menuAberto}
          <span class="ml-3">Dashboard</span>
        {/if}
      </a>

      <a 
        href="#usuarios" 
        class="flex items-center p-4 hover:bg-gray-700 {paginaAtual === 'usuarios' ? 'bg-gray-700' : ''}"
        on:click={() => mudarPagina('usuarios')}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        {#if menuAberto}
          <span class="ml-3">Usuários</span>
        {/if}
      </a>

      <a 
        href="#anuncios" 
        class="flex items-center p-4 hover:bg-gray-700 {paginaAtual === 'anuncios' ? 'bg-gray-700' : ''}"
        on:click={() => mudarPagina('anuncios')}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
        {#if menuAberto}
          <span class="ml-3">Anúncios</span>
        {/if}
      </a>

      <a 
        href="#relatorios" 
        class="flex items-center p-4 hover:bg-gray-700 {paginaAtual === 'relatorios' ? 'bg-gray-700' : ''}"
        on:click={() => mudarPagina('relatorios')}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        {#if menuAberto}
          <span class="ml-3">Relatórios</span>
        {/if}
      </a>

      <a 
        href="#configuracoes" 
        class="flex items-center p-4 hover:bg-gray-700 {paginaAtual === 'configuracoes' ? 'bg-gray-700' : ''}"
        on:click={() => mudarPagina('configuracoes')}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        {#if menuAberto}
          <span class="ml-3">Configurações</span>
        {/if}
      </a>
    </nav>
  </aside>

  <!-- Conteúdo Principal -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header Superior -->
    <header class="bg-white shadow-md">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              class="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <svg class="w-5 h-5 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notificações -->
          <button class="relative p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {metricas.notificacoes}
            </span>
          </button>

          <!-- Mensagens -->
          <button class="relative p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            <span class="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {metricas.mensagens}
            </span>
          </button>

          <!-- Perfil do Usuário -->
          <div class="relative">
            <button 
              on:click={toggleUserDropdown}
              class="flex items-center space-x-3 focus:outline-none"
            >
              <img src={usuario.avatar} alt="Avatar" class="w-8 h-8 rounded-full">
              {#if menuAberto}
                <span class="font-medium">{usuario.nome}</span>
              {/if}
            </button>

            {#if usuarioDropdownAberto}
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#perfil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
                <a href="#config" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                <hr class="my-1">
                <a href="#sair" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sair</a>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </header>

    <!-- Área de Conteúdo Principal -->
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
      {#if paginaAtual === 'dashboard'}
        <!-- Cards Principais -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Cards do dashboard (mantido do código anterior) -->
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-gray-500 text-sm">Total de Usuários</h3>
                <p class="text-2xl font-bold">{metricas.totalUsuarios}</p>
              </div>
              <div class="bg-blue-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div class="text-green-500 text-sm mt-2">↑ 12% desde último mês</div>
          </div>

          <!-- Outros cards similares... -->
        </div>

        <!-- Grid de 2 colunas para gráficos e estatísticas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Gráfico de Visitas -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Visitas nos últimos 7 dias</h2>
            <div class="h-64 flex items-end justify-between space-x-2">
              {#each dadosGrafico as valor}
                <div class="w-full">
                  <div 
                    class="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style="height: {(valor / maxValor * 100)}%"
                    title="{valor} visitas"
                  ></div>
                </div>
              {/each}
            </div>
            <div class="flex justify-between mt-2 text-sm text-gray-500">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sab</span>
              <span>Dom</span>
            </div>
          </div>

          <!-- Tarefas Pendentes -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Tarefas Pendentes</h2>
            <div class="space-y-4">
              {#each tarefas as tarefa}
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium">{tarefa.titulo}</span>
                    <span class="text-sm text-gray-500">{tarefa.progresso}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      style="width: {tarefa.progresso}%"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Últimas Atividades e Notificações -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tabela de Últimas Atividades -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-bold">Últimas Atividades</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {#each ultimasAtividades as atividade}
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">{atividade.usuario}</td>
                      <td class="px-6 py-4 whitespace-nowrap">{atividade.acao}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          {atividade.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 
                           atividade.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800'}">
                          {atividade.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Notificações Recentes -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-bold">Notificações Recentes</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                {#each notificacoes as notificacao}
                  <div class="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                    <div class="flex-shrink-0">
                      <div class="{notificacao.lida ? 'bg-gray-200' : 'bg-blue-500'} w-2 h-2 rounded-full mt-2"></div>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium">{notificacao.titulo}</p>
                      <p class="text-sm text-gray-500">{notificacao.tempo}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {:else if paginaAtual === 'usuarios'}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
          <!-- Adicione conteúdo para a página de usuários -->
        </div>
      {:else if paginaAtual === 'anuncios'}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Gerenciamento de Anúncios</h2>
          <!-- Adicione conteúdo para a página de anúncios -->
        </div>
      {:else if paginaAtual === 'relatorios'}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Relatórios</h2>
          <!-- Adicione conteúdo para a página de relatórios -->
        </div>
      {:else if paginaAtual === 'configuracoes'}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Configurações do Sistema</h2>
          <!-- Adicione conteúdo para a página de configurações -->
        </div>
      {/if}
    </main>
  </div>
<!-- Adicione esta seção no seu conteúdo principal onde apropriado -->

</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>