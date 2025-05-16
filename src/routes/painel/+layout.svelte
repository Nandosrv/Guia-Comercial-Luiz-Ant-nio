<script lang="ts">
	import  supabase  from '$lib/supabaseClient';
    import { page } from '$app/stores';
    import { onMount, type Snippet } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
    import { writable } from 'svelte/store';
    import { slide } from 'svelte/transition';
    // import { userStore } from '../../../stores/userStore.svelte';
    import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';
    import { temNovoComentario, limparNotificacaoComentarios } from '../../stores/commentStore.svelte';
    
    // console.log("userStore",userStore);
    
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
	import Produtc from '$lib/componets/Produtc.svelte';
	// import type { LayoutData } from './$types';
    // Estado do usuário e comércio
    let { children } = $props();
    // svelte-ignore non_reactive_update
        let usuario = { 
      nome: '', 
      email: '', 
      foto: '', 
      telefone: '',
      ['photo-comercio']: '' 
    };
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
    let isLoading = false;
    let activeTab = '';
    let isMobileMenuOpen = false;
    let isEditingPerfil = false;
    let errorMessage = '';
    let successMessage = '';
    
    // Dados para o dashboard
    // svelte-ignore non_reactive_update
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
    let authUser: User | null = null;
    
    // Criando uma store para o estado do menu mobile
    const mobileMenu = writable(false);
    
    // Atualiza a aba ativa baseado na rota atual
    $effect(() => {
        const path = $page.url.pathname;
        if (path === '/painel') activeTab = 'dashboard';
        else if (path === '/painel/meu-comercio') activeTab = 'perfil';
        else if (path === '/painel/produtos') activeTab = 'produtos';
        else if (path === '/painel/mensagens') activeTab = 'mensagens';
        else if (path === '/painel/promocoes') activeTab = 'promocoes';
        else if (path === '/painel/configuracoes') activeTab = 'configuracoes';
        else if (path === '/painel/planos') activeTab = 'Planos';
    });
    
    async function carregarDadosComercio(userId: string) {
      try {
        // Carregar dados do usuário/comércio
        const comercioResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
        const comercioData = await comercioResponse.json();
        console.log("Dados recebidos da API:", comercioData);
        
        // Informações do usuário
        if (comercioData && comercioData.comerciante) {
          const comercianteData = comercioData.comerciante;
          
          // Verifica qual campo está sendo usado para a foto do comércio
          let photoComercio = null;
          if (comercianteData['photo-comercio']) {
            photoComercio = comercianteData['photo-comercio'];
            console.log("Foto do comércio encontrada em photo-comercio:", photoComercio);
          } else if (comercianteData.fotos && comercianteData.fotos.length > 0) {
            photoComercio = comercianteData.fotos[0];
            console.log("Usando primeira foto do array fotos:", photoComercio);
          } else if (comercianteData.foto) {
            photoComercio = comercianteData.foto;
            console.log("Usando foto do perfil:", photoComercio);
          }
          
          // Atualiza os dados do usuário
          usuario = {
            nome: comercianteData.nome || 'Comerciante',
            email: comercianteData.email || 'email@exemplo.com',
            foto: comercianteData.foto || null,
            telefone: comercianteData.telefone || 'Telefone não cadastrado',
            ['photo-comercio']: photoComercio
          };
          
          console.log("Dados do usuário atualizados:", usuario);
          
          // Atualiza dados do comércio
          comercio = {
            ...comercio,
            id: comercianteData.id || '',
            nome: comercianteData.nome || 'Meu Comércio',
            endereco: comercianteData.endereco || 'Endereço não cadastrado',
            telefone: comercianteData.telefone || 'Telefone não cadastrado',
            categoria: comercianteData.categoria || 'Categoria não definida',
            descricao: comercianteData.descricao || 'Sem descrição',
            email: comercianteData.email || 'email@exemplo.com',
            dataCadastro: formatarData(comercianteData.criado_em) || formatarData(new Date()),
            visualizacoes: comercianteData.visualizacoes || Math.floor(Math.random() * 100),
          };
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
    }
    
    onMount(() => {
      // Verifica o estado de autenticação e configura o listener
      // checkAuthState({});
      
      // Listener para mudanças no estado de autenticação
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          authUser = user;
          
          // Inicializar campos do usuário
          nome = user.displayName || '';
          email = user.email || '';
          
          // Carregar dados do comércio
          carregarDadosComercio(user.uid);
        } else {
          console.log('Usuário não autenticado, redirecionando para login');
          goto('/login');
        }
      });
      
      // Cleanup listener quando o componente for desmontado
      return () => unsubscribe();
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
      // Usar a função de logout do serviço de autenticação
      logout().catch(error => {
        console.error('Erro ao realizar logout:', error);
        errorMessage = 'Erro ao sair da conta. Tente novamente.';
        setTimeout(() => {
          errorMessage = '';
        }, 3000);
      });
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

    async function pegarTokenUsuario() {
      if (authUser) {
        await authUser.getIdToken(true); // Força a atualização do token
        return await authUser.getIdToken();
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
      try {
        // Pegando o token do usuário
        const token = await pegarTokenUsuario();
        
        // Verificando os dados antes de enviar
        console.log("Dados a serem enviados para o backend:", {
          idComerciante, nome, email, endereco, telefone, categoria
        });

        // Enviando a requisição PUT
        const response = await fetch('https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/atualizar-comercio', {
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
        
        // Atualizando informações locais com os novos dados
        if (data && data.comerciante) {
          usuario.nome = nome;
          usuario.email = email;
          usuario.telefone = telefone;
          
          comercio.nome = nome;
          comercio.email = email;
          comercio.endereco = endereco;
          comercio.telefone = telefone;
          comercio.categoria = categoria;
        }
        
        // Exibindo mensagem de sucesso
        successMessage = "Dados do comércio atualizados com sucesso!";
        setTimeout(() => {
          successMessage = '';
        }, 3000);
        
        // Fechando o modo de edição
        isEditingPerfil = false;

      } catch (error) {
        // Tratando qualquer erro que ocorrer
        console.error("Erro ao atualizar comerciante:", (error as Error).message);
        errorMessage = `Erro ao atualizar dados: ${(error as Error).message}`;
        setTimeout(() => {
          errorMessage = '';
        }, 5000);
      }
    }

    // Função para navegar entre as páginas
    function navigateTo(path: string) {
        goto(path);
        mobileMenu.set(false); // Fecha o menu mobile após navegar
        
        // Limpar notificações de comentários se navegando para o dashboard
        if (path === '/painel') {
          limparNotificacaoComentarios();
        }
    }

    // Função para alternar o menu mobile
    function toggleMobileMenu() {
        mobileMenu.update((value: boolean) => !value);
    }

    // Função para obter a URL do avatar
    function getAvatarUrl(nome: string = 'C') {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=6d28d9&color=ffffff&size=128`;
    }

    // Função para obter a foto do comerciante
    function getFotoComercio(usuario: any): string {
      // Verificando a propriedade 'photo-comercio'
      if (usuario && usuario['photo-comercio']) {
        return usuario['photo-comercio'];
      }
      // Fallback para a propriedade 'foto'
      if (usuario && usuario.foto) {
        return usuario.foto;
      }
      // Gerar avatar como último recurso
      return getAvatarUrl(usuario?.nome);
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
                  <img class="h-8 w-8 rounded-full object-cover" 
                    src={getFotoComercio(usuario)} 
                    alt="Foto do comércio" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button 
              on:click={toggleMobileMenu}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span class="sr-only">Abrir menu principal</span>
              {#if $mobileMenu}
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
    {#if $mobileMenu}
      <div 
        class="sm:hidden bg-white dark:bg-gray-800 pt-2 pb-3 space-y-1 shadow-lg rounded-b-lg border-t border-gray-100 dark:border-gray-700"
        transition:slide={{ duration: 300, easing: (t: number) => t * (2 - t) }}
      >
        <button 
          on:click={() => navigateTo('/painel')}
          class={`w-full ${activeTab === 'dashboard' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <div class="relative flex-shrink-0 -ml-1 mr-3">
            <Home class={`${activeTab === 'dashboard' ? 'text-purple-500' : 'text-gray-400'} h-6 w-6`} />
            {#if $temNovoComentario}
              <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            {/if}
          </div>
          <span>Dashboard</span>
        </button>
        
        <button 
          on:click={() => navigateTo('/painel/meu-comercio')}
          class={`w-full ${activeTab === 'perfil' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <Store class={`${activeTab === 'perfil' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Meu Comércio</span>
        </button>
        
        <button 
          on:click={() => navigateTo('/painel/produtos')}
          class={`w-full ${activeTab === 'produtos' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <Package class={`${activeTab === 'produtos' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Produtos/Serviços</span>
        </button>
        
        <button 
          on:click={() => navigateTo('/painel/mensagens')}
          class={`w-full ${activeTab === 'mensagens' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <MessageSquare class={`${activeTab === 'mensagens' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Mensagens</span>
          {#if estatisticas.mensagens.novas > 0}
            <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {estatisticas.mensagens.novas}
            </span>
          {/if}
        </button>
        
        <button 
          on:click={() => navigateTo('/painel/promocoes')}
          class={`w-full ${activeTab === 'promocoes' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <Tag class={`${activeTab === 'promocoes' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Promoções</span>
        </button>
        
        <button 
          on:click={() => navigateTo('/painel/configuracoes')}
          class={`w-full ${activeTab === 'configuracoes' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <Settings class={`${activeTab === 'configuracoes' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Configurações</span>
        </button>

        <button 
          on:click={() => navigateTo('/painel/planos')}
          class={`w-full ${activeTab === 'Planos' ? 'bg-purple-50 dark:bg-purple-900 border-purple-500 text-purple-700 dark:text-purple-300' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} block pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center`}
        >
          <Tag class={`${activeTab === 'Planos' ? 'text-purple-500' : 'text-gray-400'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
          <span>Planos</span>
        </button>

        <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img class="h-8 w-8 rounded-full object-cover" 
                src={getFotoComercio(usuario)} 
                alt="Foto do comércio" 
              />
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
              class="block px-4 py-2 text-base font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <LogOut class="h-5 w-5 mr-3" />
              Sair
            </a>
          </div>
        </div>
      </div>
    {/if}
  
    <div class="py-6 border border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {#if isLoading}
          <div class="flex justify-center items-center py-20">
            <Loader2 class="h-10 w-10 text-purple-600 animate-spin" />
            <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">Carregando painel...</span>
          </div>
        {:else}
          <div class="flex flex-row  border border-gray-200 dark:border-gray-700">
            <!-- Sidebar (desktop) -->
            <div class="hidden lg:block lg:w-64 lg:mr-8 border-r border-gray-200 dark:border-gray-700">
                <!-- svelte-ignore event_directive_deprecated -->
                <!-- svelte-ignore event_directive_deprecated -->
              <nav class="space-y-1 border-r border-gray-200 dark:border-gray-700">
                <button 
                  on:click={() => navigateTo('/painel')}
                  class={`w-full ${activeTab === 'dashboard' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <div class="relative flex-shrink-0 -ml-1 mr-3">
                    <Home class={`${activeTab === 'dashboard' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} h-6 w-6`} />
                    {#if $temNovoComentario}
                      <span class="absolute -top-1 -right-1 flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    {/if}
                  </div>
                  <span class="truncate">Dashboard</span>
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/meu-comercio')}
                  class={`w-full ${activeTab === 'perfil' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Store class={`${activeTab === 'perfil' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Meu Comércio</span>
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/produtos')}
                  class={`w-full ${activeTab === 'produtos' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Package class={`${activeTab === 'produtos' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Produtos/Serviços</span>
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/mensagens')}
                  class={`w-full ${activeTab === 'mensagens' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <MessageSquare class={`${activeTab === 'mensagens' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Mensagens</span>
                  {#if estatisticas.mensagens.novas > 0}
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {estatisticas.mensagens.novas}
                    </span>
                  {/if}
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/promocoes')}
                  class={`w-full ${activeTab === 'promocoes' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Tag class={`${activeTab === 'promocoes' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Promoções</span>
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/configuracoes')}
                  class={`w-full ${activeTab === 'configuracoes' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Settings class={`${activeTab === 'configuracoes' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Configurações</span>
                </button>
                
                <button 
                  on:click={() => navigateTo('/painel/planos')}
                  class={`w-full ${activeTab === 'Planos' ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <Tag class={`${activeTab === 'Planos' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`} />
                  <span class="truncate">Planos</span>
                </button>
                
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
              <main class="border border-gray-200 dark:border-gray-700">
                {@render children()}   
              </main>
             
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
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>