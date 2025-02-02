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
      novoComercio.logo = file;
    }
  }

  // Função para lidar com upload de múltiplas fotos
  /**
   * @param {{ target: { files: Iterable<any> | ArrayLike<any>; }; }} event
   */
  function handleFotosUpload(event) {
    const files = Array.from(event.target.files);
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
      const sanitizedData = sanitizeInput(novoComercio); // Função para sanitizar inputs
      const response = await fetch('/api/comercios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });
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
      alert('Erro ao cadastrar comércio: ' + error.message);
    }
  }

  // Variáveis para o modal
  let email = '';
  let isEmailCorrect = false;
  let showModal = true;
  const correctEmail = "nandooliveirasrv8@gmail.coms";

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        isEmailCorrect = true;
        showModal = false;
      } else {
        alert('Email incorreto! Tente novamente.');
      }
    } catch (error) {
      alert('Erro ao verificar email: ' + error.message);
    }
  };

  // Função de sanitização de entrada (exemplo simples)
  function sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.replace(/<[^>]*>/g, ''); // Remover tags HTML
    }
    if (Array.isArray(input)) {
      return input.map(sanitizeInput);
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = {};
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          sanitized[key] = sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    return input;
  }
</script>

<!-- Modal de Verificação de Email -->
{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-100 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full">
      <h2 class="text-2xl mb-4 text-center">Insira seu email para continuar</h2>
      <input
        type="email"
        bind:value={email}
        class="border p-2 mb-4 w-full rounded"
        placeholder="Digite seu email"
        required
      />
      <button
        class="bg-blue-500 text-white py-2 px-4 rounded w-full"
        on:click={verifyEmail}
      >
        Verificar
      </button>
    </div>
  </div>
{/if}

<!-- Layout Principal -->
<div class="flex flex-col sm:flex-row h-screen bg-gray-100">
  <!-- Navegação Lateral -->
  <aside class="{menuAberto ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out sm:w-64">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 10-12 0v1h6" />
        </svg>
        {#if menuAberto}
          <span class="ml-3">Usuários</span>
        {/if}
      </a>
    </nav>
  </aside>

  <!-- Conteúdo Principal -->
  <div class="flex-1 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-2xl font-bold">Dashboard</h2>
        <p class="text-gray-600">Visão geral do sistema</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <button on:click={toggleUserDropdown} class="p-2 rounded-full hover:bg-gray-200">
            <img src={usuario.avatar} alt="Avatar" class="w-10 h-10 rounded-full" />
          </button>
          {#if usuarioDropdownAberto}
            <div class="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-4">
              <div class="font-bold">{usuario.nome}</div>
              <div class="text-sm text-gray-600">{usuario.cargo}</div>
              <div class="mt-2">
                <button class="text-blue-500 hover:underline">Sair</button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Cartões de Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Total de Usuários</h3>
        <p class="text-xl">{metricas.totalUsuarios}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Visitas Hoje</h3>
        <p class="text-xl">{metricas.visitasHoje}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Anúncios Ativos</h3>
        <p class="text-xl">{metricas.anunciosAtivos}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Receita Mensal</h3>
        <p class="text-xl">R$ {metricas.receitaMensal}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Percentual de Ocupação</h3>
        <p class="text-xl">{metricas.percentualOcupacao}%</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold">Notificações</h3>
        <p class="text-xl">{metricas.notificacoes}</p>
      </div>
    </div>

    <!-- Últimas Atividades -->
    <div class="bg-white p-4 mt-8 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold">Últimas Atividades</h3>
      <table class="w-full mt-4">
        <thead>
          <tr class="text-left text-sm">
            <th class="p-2">Usuário</th>
            <th class="p-2">Ação</th>
            <th class="p-2">Data</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each ultimasAtividades as atividade}
            <tr class="text-sm">
              <td class="p-2">{atividade.usuario}</td>
              <td class="p-2">{atividade.acao}</td>
              <td class="p-2">{atividade.data}</td>
              <td class="p-2">{atividade.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Gráfico -->
    <div class="bg-white p-4 mt-8 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold">Gráfico de Performance</h3>
      <div class="h-64 mt-4">
        <!-- Gráfico simulado com barras -->
        <div class="grid grid-cols-7 gap-2">
          {#each dadosGrafico as valor, index}
            <div class="relative">
              <div class="w-full h-full bg-gray-200 rounded-lg">
                <div class="absolute bottom-0 w-full" style="height: {Math.floor((valor / maxValor) * 100)}%;">
                  <div class="w-full h-full bg-blue-600 rounded-t-lg"></div>
                </div>
              </div>
              <div class="text-center text-xs mt-1 ">{index + 1}</div> 
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
