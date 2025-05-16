<script lang="ts">
	import  supabase  from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, type User, onAuthStateChanged } from 'firebase/auth';
    import { userStore } from '../../stores/userStore.svelte';
    import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';
    import { temNovoComentario, verificarComentariosNovos, limparNotificacaoComentarios, ultimaVerificacaoComentarios } from '../../stores/commentStore.svelte';
    
    // console.log("userStore",userStore);
    import { 
      Store, 
      Home, 
      Package, 
      MessageSquare, 
      Settings, 
      LogOut, 
      User as UserIcon,
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
      Loader2,
      Filter,
      Send
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
    let isEditingPerfil = false;
    let errorMessage = '';
    let successMessage = '';
    
    // Estado dos comentários
    let comentarios: any[] = [];
    let isLoadingComentarios = true;
    let errorComentarios = '';
    let comentarioSelecionado: any = null;
    let respostaComentario = '';
    let showModalResposta = false;
    
    // Filtros para comentários
    let filtroTempoComentarios = 'todos'; // 'hoje', 'semana', 'mes', 'todos'
    let mostrarApenasNaoRespondidos = false;
    
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
        const userResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
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
        const comercioResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
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

          // Carregar comentários do comércio
          await carregarComentarios(comercio.id);
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
        const response = await fetch('https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/atualizar-comercio', {
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

    // Funções para gerenciar comentários
    async function carregarComentarios(comercioId: string) {
      isLoadingComentarios = true;
      errorComentarios = '';
      
      try {
        console.log(`Iniciando busca de comentários para o comércio ID: ${comercioId}`);
        
        // Usar API local para desenvolvimento/testes
        const API_BASE = 'http://localhost:3000';
        console.log(`Usando API local: ${API_BASE}`);
        
        // Tentar primeiro com o endpoint na raiz
        try {
          console.log('Tentando URL direta na raiz da API local');
          const rootResponse = await fetch(`${API_BASE}/${comercioId}`);
          if (rootResponse.ok) {
            comentarios = await rootResponse.json();
            console.log(`Sucesso com URL na raiz! ${comentarios.length} comentários carregados`);
            
            // Verificar se há comentários novos usando a store
            verificarComentariosNovos(comentarios);
            
            return;
          } else {
            console.log(`Falha com URL na raiz - Status: ${rootResponse.status}`);
          }
        } catch (err) {
          console.log(`Erro com URL na raiz: ${err}`);
        }
        
        // Tentar com o endpoint /comentarios/
        try {
          console.log(`Tentando buscar comentários com URL: /comentarios/${comercioId}`);
          const response = await fetch(`${API_BASE}/comentarios/${comercioId}`);
          if (response.ok) {
            comentarios = await response.json();
            console.log(`Sucesso com /comentarios/! ${comentarios.length} comentários carregados`);
            return;
          } else {
            console.log(`Falha com /comentarios/ - Status: ${response.status}`);
          }
        } catch (err) {
          console.log(`Erro ao buscar com /comentarios/: ${err}`);
        }
        
        // Tentar com o endpoint /comentarioos/
        try {
          console.log(`Tentando com URL fallback: /comentarioos/${comercioId}`);
          const fallbackResponse = await fetch(`${API_BASE}/comentarioos/${comercioId}`);
          if (fallbackResponse.ok) {
            comentarios = await fallbackResponse.json();
            console.log(`Sucesso com /comentarioos/! ${comentarios.length} comentários carregados`);
            return;
          } else {
            console.log(`Falha com /comentarioos/ - Status: ${fallbackResponse.status}`);
          }
        } catch (err) {
          console.log(`Erro ao buscar com /comentarioos/: ${err}`);
        }
        
        // Se todas as tentativas locais falharem, tenta a API de produção (opcional)
        try {
          console.log('Tentando API de produção como último recurso');
          const prodResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/comentarios/${comercioId}`);
          if (prodResponse.ok) {
            comentarios = await prodResponse.json();
            console.log(`Sucesso com API de produção! ${comentarios.length} comentários carregados`);
            return;
          } else {
            console.log(`Falha com API de produção - Status: ${prodResponse.status}`);
            throw new Error(`Erro ao buscar comentários: ${prodResponse.status}`);
          }
        } catch (prodErr) {
          console.log(`Erro ao buscar comentários da API de produção: ${prodErr}`);
          throw prodErr;
        }
      } catch (e) {
        errorComentarios = 'Não foi possível carregar os comentários.';
        console.error('Erro final ao carregar comentários:', e);
        
        // Dados simulados como último recurso
        comentarios = [
          {
            id: 'sim-1',
            usuario_nome: 'Maria Silva',
            usuario_email: 'maria@exemplo.com',
            comentario: 'Ótimo estabelecimento! Fui muito bem atendida e os produtos são de excelente qualidade.',
            avaliacao: 5,
            data_criacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            usuario_photoURL: 'https://ui-avatars.com/api/?name=Maria+Silva&background=random'
          },
          {
            id: 'sim-2',
            usuario_nome: 'João Santos',
            usuario_email: 'joao@exemplo.com',
            comentario: 'Bom atendimento, mas os preços poderiam ser melhores.',
            avaliacao: 4,
            data_criacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            resposta: 'Obrigado pelo feedback, João! Estamos sempre buscando melhorar nossos preços.',
            data_resposta: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            usuario_photoURL: 'https://ui-avatars.com/api/?name=João+Santos&background=random'
          }
        ];
        console.log('Usando dados simulados como fallback');
        
        // Verificar se há comentários novos usando a store, mesmo com dados simulados
        verificarComentariosNovos(comentarios);
      } finally {
        isLoadingComentarios = false;
        
        // Quando entramos no dashboard, atualizamos o estado de leitura
        if (activeTab === 'dashboard') {
          limparNotificacaoComentarios();
        }
      }
    }

        // Removida a função duplicada verificarComentariosNovos, agora usando a versão da store
    
    // Função para filtrar comentários
    function filtrarComentarios(comentarios: any[]) {
      if (!comentarios || comentarios.length === 0) return [];
      
      let comentariosFiltrados = [...comentarios];
      
      // Filtrar por tempo
      if (filtroTempoComentarios !== 'todos') {
        const agora = new Date();
        const umDiaAtras = new Date(agora);
        umDiaAtras.setDate(agora.getDate() - 1);
        
        const umaSemanaAtras = new Date(agora);
        umaSemanaAtras.setDate(agora.getDate() - 7);
        
        const umMesAtras = new Date(agora);
        umMesAtras.setMonth(agora.getMonth() - 1);
        
        comentariosFiltrados = comentariosFiltrados.filter(comentario => {
          const dataComentario = new Date(comentario.data_criacao);
          
          switch (filtroTempoComentarios) {
            case 'hoje':
              return dataComentario >= umDiaAtras;
            case 'semana':
              return dataComentario >= umaSemanaAtras;
            case 'mes':
              return dataComentario >= umMesAtras;
            default:
              return true;
          }
        });
      }
      
      // Filtrar por não respondidos
      if (mostrarApenasNaoRespondidos) {
        comentariosFiltrados = comentariosFiltrados.filter(comentario => !comentario.resposta);
      }
      
      return comentariosFiltrados;
    }

    async function responderComentario(comentario: any) {
      comentarioSelecionado = comentario;
      respostaComentario = comentario.resposta || '';
      showModalResposta = true;
    }

    async function salvarResposta() {
      if (!comentarioSelecionado || !respostaComentario.trim()) return;

      try {
        // Simplificar a lógica para focar em fazer a requisição funcionar
        const comentarioId = comentarioSelecionado.id;
        console.log(`Salvando resposta para comentário ${comentarioId}: "${respostaComentario}"`);
        
        const response = await fetch(`http://localhost:3000/comentarios/responder/${comentarioId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ resposta: respostaComentario })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro ${response.status}: ${errorText}`);
          throw new Error(`Erro ao responder comentário: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta enviada com sucesso!', data);
        
        // Atualiza a lista de comentários
        await carregarComentarios(comercio.id);
        showModalResposta = false;
        successMessage = 'Resposta enviada com sucesso!';
        setTimeout(() => successMessage = '', 3000);
      } catch (e: unknown) {
        console.error('Erro completo:', e);
        errorMessage = `Erro ao responder comentário: ${(e as Error).message}`;
        setTimeout(() => errorMessage = '', 5000);
      }
    }

    async function excluirComentario(comentarioId: string) {
      if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

      try {
        const token = await pegarTokenUsuario();
        
        // Tentar primeiro na API local (para desenvolvimento)
        let success = false;
        const API_BASE = 'http://localhost:3000';
        
        try {
          console.log(`Tentando excluir comentário na API local: ${API_BASE}/comentarios/${comentarioId}`);
          const response = await fetch(`${API_BASE}/comentarios/${comentarioId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            success = true;
            console.log('Comentário excluído com sucesso (API local)');
          } else {
            console.log(`Falha ao excluir comentário na API local: ${response.status}`);
          }
        } catch (localErr) {
          console.error('Erro ao excluir comentário na API local:', localErr);
        }
        
        // Se falhar localmente, tenta na API de produção
        if (!success) {
          console.log('Tentando excluir comentário na API de produção');
          const prodResponse = await fetch(`https://api-backend-production-5b22.up.railway.app/comentarios/${comentarioId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!prodResponse.ok) {
            throw new Error(`Erro ao excluir comentário: ${prodResponse.status}`);
          }
        }
        
        // Atualiza a lista de comentários
        await carregarComentarios(comercio.id);
        successMessage = 'Comentário excluído com sucesso!';
        setTimeout(() => successMessage = '', 3000);
      } catch (e: unknown) {
        errorMessage = 'Erro ao excluir comentário';
        console.error('Erro ao excluir comentário:', e);
        setTimeout(() => errorMessage = '', 3000);
      }
    }

    function fecharModalResposta() {
      showModalResposta = false;
      comentarioSelecionado = null;
      respostaComentario = '';
    }
  </script>

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

  <!-- Comentários e Avaliações -->
  <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          Comentários e Avaliações
          {#if temNovoComentario}
            <span class="ml-2 relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          {/if}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Veja o que os clientes estão dizendo sobre seu comércio.
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Filtros -->
        <div>
          <select 
            bind:value={filtroTempoComentarios}
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="todos">Todos os períodos</option>
            <option value="hoje">Últimas 24 horas</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
          </select>
        </div>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="nao-respondidos" 
            bind:checked={mostrarApenasNaoRespondidos}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          >
          <label for="nao-respondidos" class="ml-2 block text-sm text-gray-900 dark:text-white">
            Apenas não respondidos
          </label>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
      {#if isLoadingComentarios}
        <div class="p-4 text-center">
          <Loader2 class="animate-spin h-6 w-6 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">Carregando comentários...</p>
        </div>
      {:else if errorComentarios}
        <div class="p-4 text-red-500 text-center">
          <AlertCircle class="h-6 w-6 mx-auto" />
          <p class="mt-2">{errorComentarios}</p>
        </div>
      {:else if comentarios.length === 0}
        <div class="p-4 text-center text-gray-500">
          <MessageSquare class="h-6 w-6 mx-auto" />
          <p class="mt-2">Nenhum comentário ainda.</p>
        </div>
      {:else}
        {@const comentariosFiltrados = filtrarComentarios(comentarios)}
        
        {#if comentariosFiltrados.length === 0}
          <div class="p-4 text-center text-gray-500">
            <Filter class="h-6 w-6 mx-auto" />
            <p class="mt-2">Nenhum comentário corresponde aos filtros selecionados.</p>
          </div>
        {:else}
          <ul class="grid gap-4">
            {#each comentariosFiltrados as comentario}
              <li class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden {!comentario.resposta ? 'border-l-4 border-yellow-500' : ''}">
                <div class="p-5">
                  <!-- Cabeçalho com informações do usuário -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <!-- Foto do usuário -->
                      <img 
                        src={comentario.usuario_photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(comentario.usuario_nome || 'Anônimo')}&background=random`} 
                        alt="Foto de {comentario.usuario_nome || 'Anônimo'}"
                        class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                      />
                      <div>
                        <div class="flex items-center">
                          <span class="font-bold text-gray-900 dark:text-white">
                            {comentario.usuario_nome || 'Anônimo'}
                          </span>
                          {#if $temNovoComentario && new Date(comentario.data_criacao) > $ultimaVerificacaoComentarios}
                            <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Novo
                            </span>
                          {/if}
                        </div>
                        
                        <!-- Data formatada -->
                        <div class="text-sm text-gray-500">
                          {formatarDataHora(comentario.data_criacao)}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Avaliação com estrelas - visual melhorado -->
                    <div class="flex">
                      {#each Array(5) as _, i}
                        <span class="text-xl {i < comentario.avaliacao ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}">★</span>
                      {/each}
                    </div>
                  </div>
                  
                  <!-- Conteúdo do comentário -->
                  <div class="py-3 text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    {comentario.comentario}
                  </div>
                  
                  <!-- Resposta do comerciante (se houver) -->
                  {#if comentario.resposta}
                    <div class="mt-4 bg-blue-50 dark:bg-gray-700/60 rounded-lg p-4 border-l-4 border-blue-500">
                      <div class="flex items-center justify-between mb-2">
                        <div class="font-medium text-blue-600 dark:text-blue-400 flex items-center">
                          <Store class="h-4 w-4 mr-1" />
                          Resposta do comerciante
                        </div>
                        <div class="text-sm text-gray-500">
                          {formatarDataHora(comentario.data_resposta)}
                        </div>
                      </div>
                      <div class="text-gray-700 dark:text-gray-300">
                        {comentario.resposta}
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Botões de ação -->
                  <div class="mt-4 flex justify-end space-x-3">
                    {#if !comentario.resposta}
                      <button
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60 transition-colors"
                        on:click={() => responderComentario(comentario)}
                      >
                        <MessageSquare class="h-4 w-4" />
                        <span>Responder</span>
                      </button>
                    {/if}
                    <button
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-800/60 transition-colors"
                      on:click={() => excluirComentario(comentario.id)}
                    >
                      <Trash2 class="h-4 w-4" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </div>
  </div>

    <!-- Modal de Resposta -->
    {#if showModalResposta}
      <div class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-xl mx-4 transform transition-all">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <MessageSquare class="h-5 w-5 mr-2 text-blue-500" />
              Responder Comentário
            </h3>
            <button
              class="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              on:click={fecharModalResposta}
            >
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Card de comentário original -->
          <div class="mb-6">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div class="p-4">
                <!-- Cabeçalho com informações do usuário -->
                <div class="flex items-center space-x-3 mb-3">
                  <!-- Foto do usuário -->
                  <img 
                    src={comentarioSelecionado?.usuario_photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(comentarioSelecionado?.usuario_nome || 'Anônimo')}&background=random`} 
                    alt="Foto de {comentarioSelecionado?.usuario_nome || 'Anônimo'}"
                    class="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                  />
                  <div>
                    <div class="font-bold text-gray-900 dark:text-white">
                      {comentarioSelecionado?.usuario_nome || 'Anônimo'}
                    </div>
                    <div class="text-sm text-gray-500 flex items-center">
                      <Calendar class="h-3 w-3 mr-1" />
                      {formatarDataHora(comentarioSelecionado?.data_criacao)}
                    </div>
                  </div>
                </div>
                
                <!-- Avaliação com estrelas -->
                <div class="flex mb-3">
                  {#if comentarioSelecionado?.avaliacao}
                    {#each Array(5) as _, i}
                      <span class="text-xl {i < comentarioSelecionado.avaliacao ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}">★</span>
                    {/each}
                  {/if}
                </div>
                
                <!-- Conteúdo do comentário -->
                <div class="text-gray-800 dark:text-gray-200 leading-relaxed">
                  <blockquote class="pl-3 border-l-4 border-blue-300 dark:border-blue-700 italic">
                    {comentarioSelecionado?.comentario}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Área de resposta -->
          <div class="mb-5">
            <label for="resposta-comentario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Store class="h-4 w-4 mr-1 text-blue-500" />
              Sua resposta como comerciante:
            </label>
            <textarea
              id="resposta-comentario"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows="5"
              bind:value={respostaComentario}
              placeholder="Agradecemos seu comentário! Digite sua resposta aqui..."
            ></textarea>
          </div>
          
          <!-- Botões de ação -->
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              on:click={fecharModalResposta}
            >
              Cancelar
            </button>
            <button
              class="px-5 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
              on:click={salvarResposta}
            >
              <Send class="h-4 w-4 mr-1" />
              Enviar Resposta
            </button>
          </div>
        </div>
      </div>
    {/if}
</div>
  

 
  
  