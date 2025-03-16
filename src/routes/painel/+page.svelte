<script lang="ts">
	import  supabase  from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, type User } from 'firebase/auth';
    import { userStore } from '../../stores/userStore.svelte';
    
    console.log(userStore);
    import { 
      Store, 
      Home, 
      Package, 
      MessageSquare, 
      Settings, 
      LogOut, 
      User as UserIcon, // ✅ Renomeando para evitar conflito
      Bell, 
      ChevronDown, 
      Menu, 
      X, 
      Edit, 
      Trash2, 
      Plus, 
      Tag, 
      BarChart2, 
      Users, 
      Eye, 
      Calendar, 
      DollarSign,
      ShoppingBag,
      Percent,
      Image,
      MapPin,
      Phone,
      Mail,
      Clock,
      AlertCircle,
      CheckCircle,
      Loader2
    } from 'lucide-svelte';
    import test from '$lib/images/bitar.png'
	import Promocoes from '$lib/componets/Promocoes.svelte';
	import Mensagens from '$lib/componets/Mensagens.svelte';
    // Estado do usuário e comércio
     
    let usuario = { nome: '', email: '', foto: '' , telefone: ''};
    let comercio = {
      id: '',
      nome: '',
      email: '',
      endereco: '',
      telefone: '',
      categoria: '',
      descricao: '',
      horario: '08:00 - 18:00',
      status: 'Aberto',
      dataCadastro: '',
      visualizacoes: 0,
      contatos: 0
    };
    
    // Estado da UI
    let isLoading = true;
    let activeTab = 'dashboard';
    let isMobileMenuOpen = false;
    let isEditingPerfil = false;
    let errorMessage = '';
    let successMessage = '';
    
    // Dados para o dashboard
    let estatisticas = {
      visualizacoes: { total: 0, percentual: 0 },
      contatos: { total: 0, percentual: 0 },
      produtos: { total: 0, percentual: 0 },
      mensagens: { total: 0, novas: 0 }
    };
    
    // Lista de produtos/serviços
    let produtos: any[] = [];
    let novoProduto = { nome: '', preco: '', descricao: '', imagem: '',telefone: '', destaque: false };
    let isAddingProduto = false;
    
    // Lista de mensagens
    let mensagens: any[] = [];
    
    // Configurações
    let notificacoes = {
      email: true,
      app: true,
      novaMensagem: true,
      novaVisualizacao: false
    };
    
    // Promoções
    let promocoes: any[] = [];
    let novaPromocao = { titulo: '', descricao: '', desconto: '', dataInicio: '', dataFim: '', ativa: true };
    let isAddingPromocao = false;
  
    const auth = getAuth();
    // console.log('aaaaa:', auth);
    // console.log('auth:', auth);
    const userId = auth.currentUser?.uid;
    onMount(async () => {
      if (!userId) {
        goto('/login');
        return;
      }
      
      try {
        // Carregar dados do usuário
        const userResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
        const userData = await userResponse.json();
        // console.log("userData",userResponse);
        console.log("es",userData);
        // informacoes do usuario
        if (userData) {
          usuario = {
            nome: userData.comerciante.nome || 'Comerciante',
            email: userData.comerciante.email || 'email@exemplo.com',
            foto: userData.comerciante.foto || '/placeholder.svg?height=40&width=40',
            // telefone: userData.comerciante.telefone || 'Telefone não cadastrado'
            telefone: userData.comerciante.telefone || 'Telefone não cadastrados'
          };
          console.log("usuario", userData.comerciante.telefone);
          // console.log("1", userData.comerciante.foto);
        }
        
        // Carregar dados do comércio
        const comercioResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
        const comercioData = await comercioResponse.json();
        
        if (comercioData) {
          comercio = {
            ...comercio,
            id: comercioData.comerciante.id || '',
            nome: comercioData.comerciante.nome || 'Meu Comércio',
            endereco: comercioData.comerciante.endereco || 'Endereço não cadastrado',
            telefone: comercioData.comerciante.telefone || 'Telefone não cadastrado',
            categoria: comercioData.comerciante.categoria || 'Categoria não definida',
            descricao: comercioData.comerciante.descricao || 'Sem descrição',
            email: comercioData.comerciante.email || 'email@exemplo.com',
            dataCadastro: formatarData(comercioData.comerciante.criado_em) || formatarData(new Date()),
            visualizacoes: comercioData.comerciante.visualizacoes || Math.floor(Math.random() * 100),
         
          };
          console.log("comercio", comercioData.comerciante.telefone);
        }
        
        // Carregar estatísticas
        estatisticas = {
          visualizacoes: { 
            total: comercio.visualizacoes, 
            percentual: Math.floor(Math.random() * 30) 
          },
          contatos: { 
            total: comercio.contatos, 
            percentual: Math.floor(Math.random() * 20) 
          },
          produtos: { 
            total: Math.floor(Math.random() * 15), 
            percentual: Math.floor(Math.random() * 10) 
          },
          mensagens: { 
            total: Math.floor(Math.random() * 10), 
            novas: Math.floor(Math.random() * 5) 
          }
        };
        
        // Carregar produtos (simulado)
        produtos = [
          { 
            id: '1', 
            nome: 'Produto Exemplo 1', 
            preco: 'R$ 99,90', 
            descricao: 'Descrição do produto exemplo 1', 
            imagem: '/placeholder.svg?height=80&width=80', 
            destaque: true,
            visualizacoes: 45
          },
          { 
            id: '2', 
            nome: 'Produto Exemplo 2', 
            preco: 'R$ 59,90', 
            descricao: 'Descrição do produto exemplo 2', 
            imagem: '/placeholder.svg?height=80&width=80', 
            destaque: false,
            visualizacoes: 23
          }
        ];
        
        // Carregar mensagens (simulado)
        mensagens = [
          {
            id: '1',
            nome: 'João Silva',
            email: 'joao@exemplo.com',
            mensagem: 'Olá, gostaria de saber se vocês têm o produto X disponível?',
            data: '2023-11-25T14:30:00',
            lida: true
          },
          {
            id: '2',
            nome: 'Maria Oliveira',
            email: 'maria@exemplo.com',
            mensagem: 'Qual o horário de funcionamento no final de semana?',
            data: '2023-11-26T09:15:00',
            lida: false
          },
          {
            id: '3',
            nome: 'Carlos Pereira',
            email: 'carlos@exemplo.com',
            mensagem: 'Vocês fazem entrega para o bairro Centro?',
            data: '2023-11-26T16:45:00',
            lida: false
          }
        ];
        
        // Carregar promoções (simulado)
        promocoes = [
          {
            id: '1',
            titulo: 'Black Friday',
            descricao: 'Descontos especiais em toda a loja!',
            desconto: '30%',
            dataInicio: '2023-11-24',
            dataFim: '2023-11-27',
            ativa: true
          }
        ];
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        errorMessage = 'Não foi possível carregar os dados do seu comércio.';
      } finally {
        isLoading = false;
      }
    });
    
    function formatarData(data: string | number | Date) {
      if (!data) return '';
      
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    function formatarDataHora(data: string | number | Date) {
      if (!data) return '';
      
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    function handleLogout() {
      // Implementar logout
      goto('/login');
    }
    
    function salvarPerfil() {
      // Simulação de salvamento
      isEditingPerfil = false;
      successMessage = 'Perfil atualizado com sucesso!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    }
    
    function adicionarProduto() {
      // Simulação de adição de produto
      const id = (produtos.length + 1).toString();
      produtos = [...produtos, { ...novoProduto, id, visualizacoes: 0 }];
      novoProduto = { nome: '', preco: '', descricao: '', imagem: '', telefone: '', destaque: false };
      isAddingProduto = false;
      
      successMessage = 'Produto adicionado com sucesso!';
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    }
    
    function removerProduto(id: any) {
      // Simulação de remoção de produto
      produtos = produtos.filter(p => p.id !== id);
      
      successMessage = 'Produto removido com sucesso!';
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    }
    
    function marcarMensagemComoLida(id: any) {
      // Simulação de marcar mensagem como lida
      mensagens = mensagens.map(m => {
        if (m.id === id) {
          return { ...m, lida: true };
        }
        return m;
      });
    }
    
    function adicionarPromocao() {
      // Simulação de adição de promoção
      const id = (promocoes.length + 1).toString();
      promocoes = [...promocoes, { ...novaPromocao, id }];
      novaPromocao = { titulo: '', descricao: '', desconto: '', dataInicio: '', dataFim: '', ativa: true };
      isAddingPromocao = false;
      
      successMessage = 'Promoção adicionada com sucesso!';
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    }
    
    function alternarStatusPromocao(id: any) {
      // Simulação de alternar status da promoção
      promocoes = promocoes.map(p => {
        if (p.id === id) {
          return { ...p, ativa: !p.ativa };
        }
        return p;
      });
    }
    
    function salvarConfiguracoes() {
      // Simulação de salvar configurações
      successMessage = 'Configurações salvas com sucesso!';
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    }
    // function pra atualizar dados do comerciante
    let nome = '';
  let endereco = '';
  let telefone = '';
  let email = '';
  let categoria = '';
  let authUser: User | null = null;

  onMount(async () => {
    authUser = auth.currentUser;
    if (authUser) {
      nome = authUser.displayName || '';
      email = authUser.email || '';
    }
  });

async function pegarTokenUsuario() {
    const user = auth.currentUser;
    if (user) {
        await user.getIdToken(true); // Força a atualização do token
        return await user.getIdToken();
    }
    throw new Error("Usuário não autenticado");
}


async function atualizarComerciante(
  idComerciante: string,
  nome: string,
  email: string,
  endereco: string,
  telefone: string,
  categoria: string
) {
  // Pegando o token do usuário
  const token = await pegarTokenUsuario();
  
  // Verificando os dados antes de enviar
  console.log("Dados a serem enviados para o backend:", {
    idComerciante, nome, email, endereco, telefone, categoria
  });

  try {
    // Enviando a requisição PUT
    const response = await fetch('http://localhost:3000/painel/meu-comercio/atualizar-comercio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        idComerciante, // Corrigido para incluir o ID no body da requisição
        nome,
        endereco,
        telefone,
        email,
        categoria
      })
    });

    // Logando o token e a resposta do servidor
    console.log("Token enviado:", token);
    console.log("Resposta do servidor:", response);

    // Verificando se a resposta do servidor está ok
    if (!response.ok) {
      const errorText = await response.text(); // Obtém o texto da resposta de erro
      console.error("Erro na resposta do servidor:", errorText);
      throw new Error(`Erro: ${response.status} - ${errorText}`);
    }

    // Convertendo a resposta em JSON
    const data = await response.json();
    console.log("Comerciante atualizado com sucesso:", data);

    // Se necessário, aqui você pode atualizar a interface do usuário com os dados recebidos
    // Exemplo: setComerciante(data);

  } catch (error) {
    // Tratando qualquer erro que ocorrer
    console.error("Erro ao atualizar comerciante:", (error as Error).message);
  }
}





  </script>
  
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <Store class="h-8 w-8 text-purple-600" />
              <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">Painel Comercial</span>
            </div>
          </div>
          
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <span class="sr-only">Ver notificações</span>
              <Bell class="h-6 w-6" />
              {#if estatisticas.mensagens.novas > 0}
                <span class="absolute top-3 right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{estatisticas.mensagens.novas}</span>
              {/if}
            </button>
            
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" id="user-menu" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Abrir menu do usuário</span>
                  <img class="h-8 w-8 rounded-full object-cover" src={usuario.foto || "/placeholder.svg"} alt="Foto do perfil" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button 
              on:click={() => isMobileMenuOpen = !isMobileMenuOpen}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span class="sr-only">Abrir menu principal</span>
              {#if isMobileMenuOpen}
                <X class="block h-6 w-6" />
              {:else}
                <Menu class="block h-6 w-6" />
              {/if}
            </button>
          </div>
        </div>
      </div>
    </header>
  
    <!-- Mobile menu, show/hide based on menu state -->
    {#if isMobileMenuOpen}
      <div class="sm:hidden bg-white dark:bg-gray-800 pt-2 pb-3 space-y-1">
        <a 
          href="#dashboard" 
          on:click|preventDefault={() => { activeTab = 'dashboard'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'dashboard' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Dashboard
        </a>
        <a 
          href="#perfil" 
          on:click|preventDefault={() => { activeTab = 'perfil'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'perfil' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Meu Comércio
        </a>
        <a 
          href="#produtos" 
          on:click|preventDefault={() => { activeTab = 'produtos'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'produtos' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Produtos/Serviços
        </a>
        <a 
          href="#mensagens" 
          on:click|preventDefault={() => { activeTab = 'mensagens'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'mensagens' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Mensagens
          {#if estatisticas.mensagens.novas > 0}
            <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {estatisticas.mensagens.novas}
            </span>
          {/if}
        </a>
        <a 
          href="#promocoes" 
          on:click|preventDefault={() => { activeTab = 'promocoes'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'promocoes' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Promoções
        </a>
        <a 
          href="#configuracoes" 
          on:click|preventDefault={() => { activeTab = 'configuracoes'; isMobileMenuOpen = false; }}
          class={`${activeTab === 'configuracoes' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
        >
          Configurações
        </a>
        <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" src={usuario.foto || "/placeholder.svg"} alt="Foto do perfil" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800 dark:text-white">{usuario.nome}</div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{usuario.email}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a 
              href="#" 
              on:click|preventDefault={handleLogout}
              class="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sair
            </a>
          </div>
        </div>
      </div>
    {/if}
  
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {#if isLoading}
          <div class="flex justify-center items-center py-20">
            <Loader2 class="h-10 w-10 text-purple-600 animate-spin" />
            <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">Carregando painel...</span>
          </div>
        {:else}
          <div class="flex flex-col lg:flex-row">
            <!-- Sidebar (desktop) -->
            <div class="hidden lg:block lg:w-64 lg:mr-8">
              <nav class="space-y-1">
                <a 
                  href="#dashboard" 
                  on:click|preventDefault={() => activeTab = 'dashboard'}
                  class={`${activeTab === 'dashboard' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Home class={`${activeTab === 'dashboard' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Dashboard</span>
                </a>
                
                <a 
                  href="#perfil" 
                  on:click|preventDefault={() => activeTab = 'perfil'}
                  class={`${activeTab === 'perfil' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Store class={`${activeTab === 'perfil' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Meu Comércio</span>
                </a>
                
                <a 
                  href="#produtos" 
                  on:click|preventDefault={() => activeTab = 'produtos'}
                  class={`${activeTab === 'produtos' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Package class={`${activeTab === 'produtos' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Produtos/Serviços</span>
                </a>
                
                <a 
                  href="#mensagens" 
                  on:click|preventDefault={() => activeTab = 'mensagens'}
                  class={`${activeTab === 'mensagens' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <MessageSquare class={`${activeTab === 'mensagens' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Mensagens</span>
                  {#if estatisticas.mensagens.novas > 0}
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {estatisticas.mensagens.novas}
                    </span>
                  {/if}
                </a>
                
                <a 
                  href="#promocoes" 
                  on:click|preventDefault={() => activeTab = 'promocoes'}
                  class={`${activeTab === 'promocoes' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Tag class={`${activeTab === 'promocoes' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Promoções</span>
                </a>
                
                <a 
                  href="#configuracoes" 
                  on:click|preventDefault={() => activeTab = 'configuracoes'}
                  class={`${activeTab === 'configuracoes' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Settings class={`${activeTab === 'configuracoes' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Configurações</span>
                </a>
                
                <div class="pt-8">
                  <button 
                    on:click={handleLogout}
                    class="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut class="text-red-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" />
                    <span class="truncate">Sair</span>
                  </button>
                </div>
              </nav>
            </div>
            
            <!-- Main content -->
            <div class="flex-1">
              {#if errorMessage}
                <div class="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
                  <div class="flex">
                    <AlertCircle class="h-5 w-5 text-red-500 mr-3" />
                    <p class="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  </div>
                </div>
              {/if}
              
              {#if successMessage}
                <div class="mb-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-md">
                  <div class="flex">
                    <CheckCircle class="h-5 w-5 text-green-500 mr-3" />
                    <p class="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
                  </div>
                </div>
              {/if}
              
              <!-- Dashboard -->
              {#if activeTab === 'dashboard'}
                <div>
                  <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Visão geral do seu comércio
                  </p>
                  
                  <!-- Stats -->
                  <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <!-- Visualizações -->
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div class="p-5">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <Eye class="h-6 w-6 text-gray-400" />
                          </div>
                          <div class="ml-5 w-0 flex-1">
                            <dl>
                              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Visualizações
                              </dt>
                              <dd>
                                <div class="text-lg font-medium text-gray-900 dark:text-white">
                                  {estatisticas.visualizacoes.total}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                        <div class="text-sm">
                          <span class={`font-medium ${estatisticas.visualizacoes.percentual > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {estatisticas.visualizacoes.percentual > 0 ? '+' : ''}{estatisticas.visualizacoes.percentual}%
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> em relação ao mês anterior</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Contatos -->
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div class="p-5">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <Phone class="h-6 w-6 text-gray-400" />
                          </div>
                          <div class="ml-5 w-0 flex-1">
                            <dl>
                              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Contatos
                              </dt>
                              <dd>
                                <div class="text-lg font-medium text-gray-900 dark:text-white">
                                  {estatisticas.contatos.total}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                        <div class="text-sm">
                          <span class={`font-medium ${estatisticas.contatos.percentual > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {estatisticas.contatos.percentual > 0 ? '+' : ''}{estatisticas.contatos.percentual}%
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> em relação ao mês anterior</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Produtos -->
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div class="p-5">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <Package class="h-6 w-6 text-gray-400" />
                          </div>
                          <div class="ml-5 w-0 flex-1">
                            <dl>
                              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Produtos/Serviços
                              </dt>
                              <dd>
                                <div class="text-lg font-medium text-gray-900 dark:text-white">
                                  {estatisticas.produtos.total}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                        <div class="text-sm">
                          <span class={`font-medium ${estatisticas.produtos.percentual > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {estatisticas.produtos.percentual > 0 ? '+' : ''}{estatisticas.produtos.percentual}%
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> novos produtos este mês</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Mensagens -->
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div class="p-5">
                        <div class="flex items-center">
                          <div class="flex-shrink-0">
                            <MessageSquare class="h-6 w-6 text-gray-400" />
                          </div>
                          <div class="ml-5 w-0 flex-1">
                            <dl>
                              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                Mensagens
                              </dt>
                              <dd>
                                <div class="text-lg font-medium text-gray-900 dark:text-white">
                                  {estatisticas.mensagens.total}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                        <div class="text-sm">
                          <span class="font-medium text-yellow-600 dark:text-yellow-400">
                            {estatisticas.mensagens.novas} novas
                          </span>
                          <span class="text-gray-500 dark:text-gray-400"> mensagens não lidas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Informações do Comércio -->
                  <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Informações do Comércio
                      </h3>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        Detalhes e status do seu negócio.
                      </p>
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                      <dl class="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Nome do comércio
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.nome}
                          </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Categoria
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.categoria}
                          </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Endereço
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.endereco}
                          </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Telefone
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.telefone}
                          </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status atual
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {comercio.status}
                            </span>
                          </dd>
                        </div>
                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Data de cadastro
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.dataCadastro}
                          </dd>
                          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {comercio.email}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              {/if}
              
              <!-- Perfil do Comércio -->
              {#if activeTab === 'perfil'}
                <div>
                  <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Meu Comércio</h1>
                    <button 
                      on:click={() => isEditingPerfil = !isEditingPerfil}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      {isEditingPerfil ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                  </div>
                  
                  <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    {#if isEditingPerfil}
                      <div class="px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div class="sm:col-span-3">
                            <label for="nome-comercio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nome do Comércio
                            </label>
                            <div class="mt-1">
                              <input 
                                type="text" 
                                id="nome-comercio" 
                                bind:value={comercio.nome}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div class="sm:col-span-3">
                            <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Categoria
                            </label>
                            <div class="mt-1">
                              <select 
                                id="categoria" 
                                bind:value={comercio.categoria}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              >
                                <option value="Alimentação">Alimentação</option>
                                <option value="Serviços">Serviços</option>
                                <option value="Saúde">Saúde</option>
                                <option value="Beleza">Beleza</option>
                                <option value="Vestuário">Vestuário</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Outro">Outro</option>
                              </select>
                            </div>
                          </div>
                          
                          <div class="sm:col-span-6">
                            <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Endereço
                            </label>
                            <div class="mt-1">
                              <input 
                                type="text" 
                                id="endereco" 
                                bind:value={comercio.endereco}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div class="sm:col-span-3">
                            <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Telefone
                            </label>
                            <div class="mt-1">
                              <input 
                                type="text" 
                                id="telefone" 
                                bind:value={comercio.telefone}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div class="sm:col-span-3">
                            <label for="horario" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Horário de Funcionamento
                            </label>
                            <div class="mt-1">
                              <input 
                                type="text" 
                                id="horario" 
                                bind:value={comercio.horario}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div class="sm:col-span-6">
                            <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Descrição
                            </label>
                            <div class="mt-1">
                              <textarea 
                                id="descricao" 
                                rows="4" 
                                bind:value={comercio.descricao}
                                class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                              ></textarea>
                            </div>
                            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Breve descrição do seu comércio. Máximo 500 caracteres.
                            </p>
                          </div>
                        </div>
                        
                        <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                          <button class="shadow-sm focus:ring-purple-500 focus:border-purple-500
                          block w-full sm:text-sm border-gray-300
                            dark:border-gray-600 dark:bg-gray-700
                              dark:text-white rounded-md"
                              on:click={() => atualizarComerciante(comercio.id, comercio.nome, comercio.email, comercio.endereco, comercio.telefone, comercio.categoria)}
                            >
                            Atualizar Comerciante
                        </button>
                          
                          <button 
                            type="button"
                            on:click={() => isEditingPerfil = false}
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    {:else}
                      <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          Informações do Comércio
                        </h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                          Detalhes completos do seu negócio.
                        </p>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700">
                        <dl>
                          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Nome do comércio
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                              {comercio.nome}
                            </dd>
                          </div>
                          <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Categoria
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                              {comercio.categoria}
                            </dd>
                          </div>
                          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Endereço
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                              <MapPin class="h-4 w-4 text-gray-400 mr-1" />
                              {comercio.endereco}
                            </dd>
                          </div>
                          <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Telefone
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                              <Phone class="h-4 w-4 text-gray-400 mr-1" />
                              {comercio.telefone}
                            </dd>
                          </div>
                          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Horário de Funcionamento
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                              <Clock class="h-4 w-4 text-gray-400 mr-1" />
                              {comercio.horario}
                            </dd>
                          </div>
                          <div class="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Descrição
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                              {comercio.descricao || 'Nenhuma descrição fornecida.'}
                            </dd>
                          </div>
                          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Status atual
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {comercio.status}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
              
              <!-- Produtos/Serviços -->
              {#if activeTab === 'produtos'}
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
              
              <!-- Mensagens -->
              {#if activeTab === 'mensagens'}
               <Mensagens />
              {/if}
              
              <!-- Promoções -->
              <div class="container">
                <Promocoes {activeTab} />
              </div>
              
              <!-- Configurações -->
              {#if activeTab === 'configuracoes'}
                <div>
                  <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Configurações</h1>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Gerencie as configurações da sua conta e do seu comércio.
                  </p>
                  
                  <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Notificações
                      </h3>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        Configure como deseja receber notificações.
                      </p>
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                      <div class="space-y-6">
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input 
                              id="notificacao-email" 
                              type="checkbox" 
                              bind:checked={notificacoes.email}
                              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="notificacao-email" class="font-medium text-gray-700 dark:text-gray-300">Notificações por e-mail</label>
                            <p class="text-gray-500 dark:text-gray-400">Receba notificações por e-mail sobre atividades importantes.</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input 
                              id="notificacao-app" 
                              type="checkbox" 
                              bind:checked={notificacoes.app}
                              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="notificacao-app" class="font-medium text-gray-700 dark:text-gray-300">Notificações no aplicativo</label>
                            <p class="text-gray-500 dark:text-gray-400">Receba notificações dentro do aplicativo.</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input 
                              id="notificacao-mensagem" 
                              type="checkbox" 
                              bind:checked={notificacoes.novaMensagem}
                              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="notificacao-mensagem" class="font-medium text-gray-700 dark:text-gray-300">Novas mensagens</label>
                            <p class="text-gray-500 dark:text-gray-400">Seja notificado quando receber uma nova mensagem.</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input 
                              id="notificacao-visualizacao" 
                              type="checkbox" 
                              bind:checked={notificacoes.novaVisualizacao}
                              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="notificacao-visualizacao" class="font-medium text-gray-700 dark:text-gray-300">Novas visualizações</label>
                            <p class="text-gray-500 dark:text-gray-400">Seja notificado sobre novas visualizações do seu comércio.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-6">
                        <button 
                          type="button" 
                          on:click={salvarConfiguracoes}
                          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Salvar Configurações
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Conta
                      </h3>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                        Gerencie as configurações da sua conta.
                      </p>
                    </div>
                    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                      <div class="space-y-6">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">Alterar senha</h4>
                          <button 
                            type="button" 
                            class="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Alterar senha
                          </button>
                        </div>
                        
                        <div>
                          <h4 class="text-sm font-medium text-gray-900 dark:text-white">Excluir conta</h4>
                          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                          </p>
                          <button 
                            type="button" 
                            class="mt-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Excluir conta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <style>
    /* Adicione estilos personalizados aqui, se necessário */
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>