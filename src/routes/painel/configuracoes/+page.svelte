<script lang="ts">
	import  supabase  from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
    import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';
    
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
      contatos: 0,
      fotos: []
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
    
    // Fotos do comércio
    let novaFoto: File | null = null;
    let previewFotos: string[] = [];
    let selectedFile: File | null = null;
    
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
    
    async function carregarDadosComercio(userId: string) {
      try {
        // Carregar dados do usuário
        const userResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
        const userData = await userResponse.json();
        console.log("es", userData);
        
        // informacoes do usuario
        // if (userData) {
        //   usuario = {
        //     nome: userData.comerciante.nome || 'Comerciante',
        //     email: userData.comerciante.email || 'email@exemplo.com',
        //     foto: userData.comerciante.foto || '/placeholder.svg?height=40&width=40',
        //     telefone: userData.comerciante.telefone || 'Telefone não cadastrados'
        //   };
        //   console.log("usuario", userData.comerciante.telefone);
        // }
        
        // Carregar dados do comércio
        const comercioResponse = await fetch(`http://localhost:3000/painel/meu-comercio/${userId}`);
        const comercioData = await comercioResponse.json();
        
        if (comercioData && comercioData.comerciante) {
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
          
          // Verificar se o comércio tem foto e carregar no preview
          if (comercioData.comerciante['photo-comercio']) {
            console.log("Foto do comércio encontrada:", comercioData.comerciante['photo-comercio'].substring(0, 50) + "...");
            previewFotos = [comercioData.comerciante['photo-comercio']];
          } else {
            console.log("Comércio não possui foto");
            previewFotos = [];
          }
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
    
    // Função para lidar com upload de fotos
    function handleFileUpload(event: Event): void {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        // Armazenar referência ao arquivo selecionado
        selectedFile = file;
        console.log('Arquivo selecionado:', file.name, 'tamanho:', Math.round(file.size / 1024), 'KB');
        
        // Não criar preview automaticamente - isso será feito ao clicar no botão "Aplicar Foto"
      }
    }
    
    // Função para remover foto
    function removerFoto(index: number): void {
      previewFotos = [];
      selectedFile = null;
      
      // Limpar o input file para permitir selecionar o mesmo arquivo novamente
      const fileInput = document.getElementById('foto-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      console.log('Foto removida e seleção limpa');
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
        
        // Criando um objeto FormData para enviar os dados incluindo a foto
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('endereco', endereco);
        formData.append('telefone', telefone);
        formData.append('categoria', categoria);
        
        // Se tiver um arquivo selecionado, adiciona ao FormData
        if (selectedFile) {
          formData.append('foto', selectedFile);
          console.log('Foto adicionada ao FormData:', selectedFile.name);
        }
        
        // Verificando os dados antes de enviar
        console.log("Dados a serem enviados para o backend:", {
          idComerciante, nome, email, endereco, telefone, categoria, 
          temFoto: !!selectedFile,
          fotoNome: selectedFile?.name
        });

        // Enviando a requisição PUT com FormData (não precisa definir Content-Type)
        const response = await fetch('http://localhost:3000/painel/meu-comercio/atualizar-comercio', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // Não inclua Content-Type aqui, o navegador vai definir automaticamente com boundary para o FormData
          },
          body: formData
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
          
          // Atualizando a foto do comércio, se disponível
          if (data.comerciante['photo-comercio']) {
            // Já temos o preview criado no momento do upload, não precisamos fazer nada aqui
            console.log('URL da foto salva:', data.comerciante['photo-comercio']);
          }
        }
        
        // Limpar o arquivo selecionado após o upload bem-sucedido
        selectedFile = null;
        
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
  </script>
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