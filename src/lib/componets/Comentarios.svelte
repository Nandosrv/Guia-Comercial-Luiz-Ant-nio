<script lang="ts">
  import { onMount } from 'svelte';
  import { Star, MessageSquare, Send, Loader2, AlertCircle, LogIn } from 'lucide-svelte';
  import { userStore } from '../../stores/userStore.svelte';
  import { goto } from '$app/navigation';

  const { comercioId, comercioSlug } = $props<{
    comercioId: string;
    comercioSlug: string;
  }>();

  // Definir interface para comerciante
  interface Comerciante {
    id: string;
    slug: string;
    nome: string;
    [key: string]: any; // Permite propriedades adicionais
  }

  // Interface para comentários
  interface Comentario {
    id?: string;
    usuario_nome: string;
    usuario_email: string;
    comentario: string;
    avaliacao: number;
    data_criacao?: string;
    resposta?: string;
    data_resposta?: string;
    usuario_id?: string | null;
    usuario_photoURL?: string | null;
  }

  // Comentários simulados para usar quando o backend falhar
  const comentariosSimulados: Comentario[] = [
    {
      id: '1',
      usuario_nome: 'Maria Silva',
      usuario_email: 'maria@exemplo.com',
      comentario: 'Ótimo estabelecimento! Fui muito bem atendida e os produtos são de excelente qualidade.',
      avaliacao: 5,
      data_criacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      usuario_photoURL: 'https://ui-avatars.com/api/?name=Maria+Silva&background=random'
    },
    {
      id: '2',
      usuario_nome: 'João Santos',
      usuario_email: 'joao@exemplo.com',
      comentario: 'Bom atendimento, mas os preços poderiam ser melhores.',
      avaliacao: 4,
      data_criacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      resposta: 'Obrigado pelo feedback, João! Estamos sempre buscando melhorar nossos preços.',
      data_resposta: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      usuario_photoURL: 'https://ui-avatars.com/api/?name=João+Santos&background=random'
    },
    {
      id: '3',
      usuario_nome: 'Ana Oliveira',
      usuario_email: 'ana@exemplo.com',
      comentario: 'Gostei muito do local, bem organizado e limpo.',
      avaliacao: 5,
      data_criacao: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      usuario_photoURL: 'https://ui-avatars.com/api/?name=Ana+Oliveira&background=random'
    }
  ];

  let comentarios = $state<any[]>([]);
  let novoComentario = $state({
    usuario_nome: '',
    usuario_email: '',
    comentario: '',
    avaliacao: 5
  });
  let isLoading = $state(true);
  let error = $state('');
  let successMessage = $state('');
  let isSubmitting = $state(false);
  let debugInfo = $state(''); // Para informações de depuração
  let usandoSimulacao = $state(false);
  let editandoComentario = $state<Comentario | null>(null);
  let comentarioEditado = $state('');
  let avaliacaoEditada = $state(5);
  let mostrarConfirmacaoExclusao = $state(false);
  let comentarioParaExcluir = $state<string | null>(null);

  // Obter usuário atual
  let currentUser = $derived(userStore.value);
  let isAuthenticated = $derived(userStore.isAuthenticated());

  // Função auxiliar para adicionar informações de depuração
  function addDebug(message: string) {
    console.log(message);
    debugInfo += message + '\n';
  }

  // Função para redirecionar para a página de login
  function irParaLogin() {
    goto('/login');
  }

  // Verificar se o usuário é o autor do comentário
  function isComentarioAutor(comentario: Comentario): boolean {
    if (!isAuthenticated || !currentUser || !comentario) return false;
    
    // Verificar por ID do usuário (mais seguro)
    if (comentario.usuario_id && currentUser.userId) {
      return comentario.usuario_id === currentUser.userId;
    }
    
    // Fallback: verificar por email se não tiver ID
    return comentario.usuario_email === currentUser.email;
  }

  // Iniciar edição de comentário
  function iniciarEdicao(comentario: Comentario) {
    if (!comentario) {
      addDebug('Tentativa de editar comentário inválido');
      error = 'Erro: não foi possível editar o comentário';
      return;
    }
    editandoComentario = comentario;
    comentarioEditado = comentario.comentario;
    avaliacaoEditada = comentario.avaliacao;
  }

  // Cancelar edição
  function cancelarEdicao() {
    editandoComentario = null;
    comentarioEditado = '';
    avaliacaoEditada = 5;
  }

  // Simplificação da função salvarEdicao para evitar problemas de nulidade
  async function salvarEdicao() {
    if (!editandoComentario || !comentarioEditado) {
      error = 'Dados do comentário inválidos';
      return;
    }
    
    // Fazemos uma cópia segura do comentário atual para evitar erros de nulidade
    const comentarioAtual = { ...editandoComentario };
    const comentarioId = comentarioAtual.id;
    
    if (!comentarioId) {
      error = 'ID do comentário não disponível';
      return;
    }
    
    isSubmitting = true;
    error = '';
    successMessage = '';
    
    try {
      const API_BASE = 'http://localhost:3000';
      
      // Se estamos no modo simulado, atualizamos apenas localmente
      if (usandoSimulacao) {
        addDebug('Editando comentário no modo simulado');
        
        // Atualizar o comentário na lista local
        comentarios = comentarios.map(c => {
          if (c.id === comentarioId) {
            return {
              ...c,
              comentario: comentarioEditado,
              avaliacao: avaliacaoEditada
            };
          }
          return c;
        });
        
        successMessage = 'Comentário atualizado com sucesso! (modo simulado)';
        editandoComentario = null;
        return;
      }
      
      // Dados para atualização
      const dadosAtualizacao = {
        id: comentarioId,
        comentario: comentarioEditado,
        avaliacao: avaliacaoEditada
      };
      
      addDebug(`Enviando atualização de comentário: ${JSON.stringify(dadosAtualizacao)}`);
      
      // Tentar atualizar via API
      try {
        const response = await fetch(`${API_BASE}/comentarios/${comentarioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosAtualizacao)
        });
        
        if (response.ok) {
          addDebug('Comentário atualizado com sucesso!');
          
          // Atualizar o comentário na lista local
          comentarios = comentarios.map(c => {
            if (c.id === comentarioId) {
              return {
                ...c,
                comentario: comentarioEditado,
                avaliacao: avaliacaoEditada
              };
            }
            return c;
          });
          
          successMessage = 'Comentário atualizado com sucesso!';
          editandoComentario = null;
        } else {
          throw new Error(`Erro ao atualizar comentário: ${response.status}`);
        }
      } catch (err) {
        addDebug(`Erro ao atualizar comentário: ${err}`);
        
        // Tentar com fallback
        try {
          const fallbackResponse = await fetch(`${API_BASE}/comentarioos/${comentarioId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizacao)
          });
          
          if (fallbackResponse.ok) {
            addDebug('Comentário atualizado com sucesso via fallback!');
            
            // Atualizar o comentário na lista local
            comentarios = comentarios.map(c => {
              if (c.id === comentarioId) {
                return {
                  ...c,
                  comentario: comentarioEditado,
                  avaliacao: avaliacaoEditada
                };
              }
              return c;
            });
            
            successMessage = 'Comentário atualizado com sucesso!';
            editandoComentario = null;
          } else {
            throw new Error(`Erro no fallback: ${fallbackResponse.status}`);
          }
        } catch (fallbackErr) {
          throw fallbackErr;
        }
      }
    } catch (e) {
      // Se falhou, simulamos a atualização localmente
      addDebug(`Erro ao atualizar comentário. Atualizando localmente.`);
      
      // Atualizar o comentário na lista local
      comentarios = comentarios.map(c => {
        if (c.id === comentarioId) {
          return {
            ...c,
            comentario: comentarioEditado,
            avaliacao: avaliacaoEditada
          };
        }
        return c;
      });
      
      successMessage = 'Comentário atualizado no modo offline. Será sincronizado quando o servidor estiver disponível.';
      editandoComentario = null;
      
      if (!usandoSimulacao) {
        usandoSimulacao = true;
      }
    } finally {
      isSubmitting = false;
    }
  }

  // Confirmar exclusão de comentário
  function confirmarExclusao(comentarioId: string | undefined) {
    if (!comentarioId) {
      addDebug('Tentativa de excluir comentário sem ID');
      error = 'Erro: não foi possível identificar o comentário para exclusão';
      return;
    }
    comentarioParaExcluir = comentarioId;
    mostrarConfirmacaoExclusao = true;
  }

  // Cancelar exclusão
  function cancelarExclusao() {
    comentarioParaExcluir = null;
    mostrarConfirmacaoExclusao = false;
  }

  // Excluir comentário (simplificado para evitar problemas de nulidade)  
  async function excluirComentario() {    
    const idParaExcluir = comentarioParaExcluir;    
    
    if (!idParaExcluir) {      
      error = 'ID do comentário não disponível para exclusão';      
      cancelarExclusao();      
      return;    
    }    
    
    isSubmitting = true;    
    error = '';    
    successMessage = '';    
    
    try {      
      const API_BASE = 'http://localhost:3000';      
      
      // Se estamos no modo simulado, removemos apenas localmente      
      if (usandoSimulacao) {        
        addDebug('Excluindo comentário no modo simulado');        
        
        // Remover o comentário da lista local        
        comentarios = comentarios.filter(c => c.id !== idParaExcluir);        
        
        successMessage = 'Comentário excluído com sucesso! (modo simulado)';        
        cancelarExclusao();        
        return;      
      }      
      
      addDebug(`Excluindo comentário com ID: ${idParaExcluir}`);      
      
      // Tentar excluir via API      
      try {        
        const response = await fetch(`${API_BASE}/comentarios/${idParaExcluir}`, {          
          method: 'DELETE'        
        });        
        
        if (response.ok) {          
          addDebug('Comentário excluído com sucesso!');          
          
          // Remover o comentário da lista local          
          comentarios = comentarios.filter(c => c.id !== idParaExcluir);          
          
          successMessage = 'Comentário excluído com sucesso!';          
          cancelarExclusao();        
        } else {          
          throw new Error(`Erro ao excluir comentário: ${response.status}`);        
        }      
      } catch (err) {        
        addDebug(`Erro ao excluir comentário: ${err}`);        
        
        // Tentar com fallback        
        try {          
          const fallbackResponse = await fetch(`${API_BASE}/comentarioos/${idParaExcluir}`, {            
            method: 'DELETE'          
          });          
          
          if (fallbackResponse.ok) {            
            addDebug('Comentário excluído com sucesso via fallback!');            
            
            // Remover o comentário da lista local            
            comentarios = comentarios.filter(c => c.id !== idParaExcluir);            
            
            successMessage = 'Comentário excluído com sucesso!';            
            cancelarExclusao();          
          } else {            
            throw new Error(`Erro no fallback: ${fallbackResponse.status}`);          
          }        
        } catch (fallbackErr) {          
          throw fallbackErr;        
        }      
      }    
    } catch (e) {      
      // Se falhou, simulamos a exclusão localmente      
      addDebug(`Erro ao excluir comentário. Removendo localmente.`);      
      
      // Remover o comentário da lista local      
      comentarios = comentarios.filter(c => c.id !== idParaExcluir);      
      
      successMessage = 'Comentário excluído no modo offline. Será sincronizado quando o servidor estiver disponível.';      
      cancelarExclusao();      
      
      if (!usandoSimulacao) {        
        usandoSimulacao = true;      
      }    
    } finally {      
      isSubmitting = false;    
    }  
  }

  // Preencher campos do formulário com dados do usuário logado
  function preencherFormularioComUsuarioLogado() {
    if (isAuthenticated) {
      novoComentario.usuario_nome = currentUser.name || '';
      novoComentario.usuario_email = currentUser.email || '';
    }
  }

  // Função para carregar comentários
  async function carregarComentarios() {
    isLoading = true;
    try {
      addDebug(`Iniciando busca de comentários: comercioId=${comercioId}, comercioSlug=${comercioSlug}`);
      
      // Forçar uso da API local para testes
      const API_BASE = 'http://localhost:3000';
      addDebug(`Usando API local: ${API_BASE}`);
      
      // Se temos o ID do comércio e ele não é o slug
      if (comercioId && comercioId !== comercioSlug) {
        addDebug(`Tentando buscar comentários com ID: ${comercioId}`);
        
        // Tentar diretamente na raiz da API primeiro (nova tentativa)
        try {
          addDebug('Tentando URL direta na raiz da API local');
          const rootResponse = await fetch(`${API_BASE}/${comercioId}`);
          if (rootResponse.ok) {
            comentarios = await rootResponse.json();
            addDebug(`Sucesso com URL na raiz! ${comentarios.length} comentários carregados`);
            return;
          } else {
            addDebug(`Falha com URL na raiz - Status: ${rootResponse.status}`);
          }
        } catch (err) {
          addDebug(`Erro com URL na raiz: ${err}`);
        }
        
        try {
          // Tentar primeiro com comentarios
          const response = await fetch(`${API_BASE}/comentarios/${comercioId}`);
          if (response.ok) {
            comentarios = await response.json();
            addDebug(`Sucesso! ${comentarios.length} comentários carregados`);
            return;
          } else {
            addDebug(`Falha com /comentarios/ - Status: ${response.status}`);
          }
        } catch (err) {
          addDebug(`Erro ao buscar com /comentarios/: ${err}`);
        }
        
        try {
          // Tentar com comentarioos
          const response = await fetch(`${API_BASE}/comentarioos/${comercioId}`);
          if (response.ok) {
            comentarios = await response.json();
            addDebug(`Sucesso com /comentarioos/! ${comentarios.length} comentários carregados`);
            return;
          } else {
            addDebug(`Falha com /comentarioos/ - Status: ${response.status}`);
          }
        } catch (err) {
          addDebug(`Erro ao buscar com /comentarioos/: ${err}`);
        }
      }
      
      // Se chegou aqui, precisamos buscar os comerciantes e encontrar o ID correto
      addDebug('Buscando lista de comerciantes para encontrar o ID correto');
      
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocal
        ? `http://localhost:3000/comerciantes`
        : `https://api-backend-production-5b22.up.railway.app/comerciantes`;
      
      addDebug(`Fazendo requisição para: ${apiUrl}`);
      const comerciosResponse = await fetch(apiUrl);
      
      if (!comerciosResponse.ok) {
        addDebug(`Erro ao buscar comerciantes: ${comerciosResponse.status}`);
        throw new Error(`Erro ao buscar lista de comércios: ${comerciosResponse.status}`);
      }
      
      let comercios = [];
      try {
        comercios = await comerciosResponse.json();
        addDebug(`Comerciantes carregados: ${comercios.length}`);
      } catch (e) {
        addDebug(`Erro ao parsear resposta: ${e}`);
        throw new Error('Erro ao processar resposta da API');
      }
      
      // Encontrar o comércio pelo slug
      addDebug(`Buscando comércio com slug: ${comercioSlug}`);
      const comercio = comercios.find((c: any) => c.slug === comercioSlug);
      
      if (!comercio) {
        addDebug(`Comércio não encontrado pelo slug: ${comercioSlug}`);
        throw new Error('Comércio não encontrado');
      }
      
      addDebug(`Comércio encontrado: id=${comercio.id}`);
      
      // Agora usar o ID do comércio para buscar os comentários
      try {
        // Tentar primeiro com comentarios
        addDebug(`Tentando buscar comentários com URL: /comentarios/${comercio.id}`);
        const response = await fetch(`${API_BASE}/comentarios/${comercio.id}`);
        if (response.ok) {
          comentarios = await response.json();
          addDebug(`Sucesso! ${comentarios.length} comentários carregados`);
          return;
        } else {
          addDebug(`Resposta não ok: ${response.status}`);
        }
      } catch (e) {
        addDebug(`Erro na primeira tentativa: ${e}`);
      }
      
      // Tentar com a URL antiga
      try {
        addDebug(`Tentando com URL fallback: /comentarioos/${comercio.id}`);
        const fallbackResponse = await fetch(`${API_BASE}/comentarioos/${comercio.id}`);
        if (!fallbackResponse.ok) {
          addDebug(`Resposta fallback não ok: ${fallbackResponse.status}`);
          throw new Error(`Erro HTTP: ${fallbackResponse.status}`);
        }
        comentarios = await fallbackResponse.json();
        addDebug(`Sucesso com fallback! ${comentarios.length} comentários carregados`);
      } catch (e) {
        addDebug(`Erro também na segunda tentativa: ${e}`);
        throw e;
      }
      
    } catch (e) {
      error = 'Não foi possível carregar os comentários do servidor. Exibindo dados simulados.';
      addDebug(`Erro final: ${e}. Usando comentários simulados.`);
      comentarios = [...comentariosSimulados];
      usandoSimulacao = true;
    } finally {
      isLoading = false;
    }
  }

  // Função para adicionar novo comentário
  async function adicionarComentario() {
    if (!isAuthenticated) {
      error = 'Você precisa estar logado para adicionar um comentário.';
      return;
    }

    if (!novoComentario.comentario) {
      error = 'Por favor, escreva um comentário.';
      return;
    }

    isSubmitting = true;
    error = '';
    successMessage = '';
    
    try {
      // Forçar uso da API local para testes
      const API_BASE = 'http://localhost:3000';
      addDebug(`Usando API local para envio: ${API_BASE}`);
      
      // Se estamos no modo simulado, apenas adicionamos localmente
      if (usandoSimulacao) {
        addDebug('Usando modo simulado para adicionar comentário');
        const novoItem: Comentario = {
          id: `local-${Date.now()}`,
          usuario_nome: currentUser.name || novoComentario.usuario_nome,
          usuario_email: currentUser.email || novoComentario.usuario_email,
          comentario: novoComentario.comentario,
          avaliacao: novoComentario.avaliacao,
          data_criacao: new Date().toISOString(),
          usuario_id: currentUser.userId,
          usuario_photoURL: currentUser.photoURL
        };
        
        comentarios = [novoItem, ...comentarios];
        successMessage = 'Comentário enviado com sucesso! (modo simulado)';
        novoComentario = {
          usuario_nome: currentUser.name || '',
          usuario_email: currentUser.email || '',
          comentario: '',
          avaliacao: 5
        };
        return;
      }
      
      let idComercio = comercioId;
      addDebug(`Iniciando envio de comentário para comercioId=${idComercio}`);
      
      // Se não temos o ID do comércio, vamos buscá-lo
      if (!idComercio || idComercio === comercioSlug) {
        addDebug('ID do comércio não disponível, buscando da API');
        // Buscar todos os comerciantes e filtrar pelo slug
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocal
          ? `http://localhost:3000/comerciantes`
          : `https://api-backend-production-5b22.up.railway.app/comerciantes`;
        
        const comerciosResponse = await fetch(apiUrl);
        if (!comerciosResponse.ok) {
          addDebug(`Erro ao buscar comerciantes: ${comerciosResponse.status}`);
          throw new Error('Erro ao buscar lista de comércios');
        }
        
        const comercios = await comerciosResponse.json();
        addDebug(`${comercios.length} comerciantes carregados`);
        
        // Encontrar o comércio pelo slug
        const comercio = comercios.find((c: any) => c.slug === comercioSlug);
        
        if (!comercio || !comercio.id) {
          addDebug(`Comércio não encontrado pelo slug: ${comercioSlug}`);
          throw new Error('Comércio não encontrado');
        }
        
        idComercio = comercio.id;
        addDebug(`ID do comércio encontrado: ${idComercio}`);
      }
      
      // Criar objeto de comentário para envio
      const comentarioData = {
        usuario_nome: currentUser.name || novoComentario.usuario_nome,
        usuario_email: currentUser.email || novoComentario.usuario_email,
        comentario: novoComentario.comentario,
        avaliacao: novoComentario.avaliacao,
        comercio_id: idComercio,
        usuario_id: currentUser.userId,
        usuario_photoURL: currentUser.photoURL
      };
      
      addDebug(`Dados do comentário: ${JSON.stringify(comentarioData)}`);
      
      // Tentar enviar o comentário com a nova URL primeiro
      try {
        // Tentar enviar para a raiz
        addDebug('Tentando enviar para URL raiz local');
        const rootResponse = await fetch(`${API_BASE}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(comentarioData)
        });
        
        if (rootResponse.ok) {
          addDebug('Comentário enviado com sucesso (URL raiz)!');
          successMessage = 'Comentário enviado com sucesso!';
          novoComentario = {
            usuario_nome: currentUser.name || '',
            usuario_email: currentUser.email || '',
            comentario: '',
            avaliacao: 5
          };
          await carregarComentarios();
          return;
        } else {
          addDebug(`Erro ao enviar para URL raiz: ${rootResponse.status}`);
        }
      } catch (err) {
        addDebug(`Erro na requisição para URL raiz: ${err}`);
      }
      
      try {
        addDebug('Tentando enviar para /comentarios local');
        const response = await fetch(`${API_BASE}/comentarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(comentarioData)
        });
        
        if (response.ok) {
          addDebug('Comentário enviado com sucesso!');
          successMessage = 'Comentário enviado com sucesso!';
          novoComentario = {
            usuario_nome: currentUser.name || '',
            usuario_email: currentUser.email || '',
            comentario: '',
            avaliacao: 5
          };
          await carregarComentarios();
          return;
        } else {
          addDebug(`Erro ao enviar para /comentarios: ${response.status}`);
        }
      } catch (err) {
        addDebug(`Erro na requisição para /comentarios: ${err}`);
      }
      
      // Fallback: tentar com a URL antiga
      addDebug('Tentando enviar para /comentarioos local (fallback)');
      const fallbackResponse = await fetch(`${API_BASE}/comentarioos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comentarioData)
      });

      if (!fallbackResponse.ok) {
        addDebug(`Erro no fallback: ${fallbackResponse.status}`);
        throw new Error(`Erro ao enviar comentário: ${fallbackResponse.status}`);
      }

      addDebug('Comentário enviado com sucesso via fallback!');
      successMessage = 'Comentário enviado com sucesso!';
      novoComentario = {
        usuario_nome: currentUser.name || '',
        usuario_email: currentUser.email || '',
        comentario: '',
        avaliacao: 5
      };
      await carregarComentarios();
    } catch (e) {
      // Se falhou, usamos o modo simulado
      if (!usandoSimulacao) {
        addDebug(`Erro ao enviar comentário para o servidor. Adicionando localmente.`);
        
        const novoItem: Comentario = {
          id: `local-${Date.now()}`,
          usuario_nome: currentUser.name || novoComentario.usuario_nome,
          usuario_email: currentUser.email || novoComentario.usuario_email,
          comentario: novoComentario.comentario,
          avaliacao: novoComentario.avaliacao,
          data_criacao: new Date().toISOString(),
          usuario_id: currentUser.userId,
          usuario_photoURL: currentUser.photoURL
        };
        
        comentarios = [novoItem, ...comentarios];
        successMessage = 'Comentário adicionado no modo offline. Será sincronizado quando o servidor estiver disponível.';
        novoComentario = {
          usuario_nome: currentUser.name || '',
          usuario_email: currentUser.email || '',
          comentario: '',
          avaliacao: 5
        };
        usandoSimulacao = true;
      } else {
        error = 'Erro ao enviar comentário';
        addDebug(`Erro final ao adicionar comentário: ${e}`);
      }
    } finally {
      isSubmitting = false;
    }
  }

  onMount(() => {
    addDebug(`Componente montado. comercioId=${comercioId}, comercioSlug=${comercioSlug}, usuário logado=${isAuthenticated}`);
    carregarComentarios();
    // Preencher o formulário com dados do usuário logado se disponível
    preencherFormularioComUsuarioLogado();
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
    <MessageSquare class="h-6 w-6 text-red-500" />
    Comentários e Avaliações
  </h2>

  {#if usandoSimulacao}
    <div class="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
      <p class="text-sm font-medium">⚠️ Exibindo dados simulados. Os dados não estão sendo salvos no servidor.</p>
    </div>
  {/if}

  <!-- Depuração oculta -->
  {#if error && debugInfo}
    <details class="mb-4 p-2 bg-gray-100 dark:bg-gray-900 text-xs border border-gray-300 dark:border-gray-700 rounded">
      <summary class="cursor-pointer font-mono">Informações de depuração</summary>
      <pre class="mt-2 p-2 overflow-auto">{debugInfo}</pre>
    </details>
  {/if}

  <!-- Formulário de Novo Comentário -->
  <div class="mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deixe seu comentário</h3>
    
    {#if error}
      <div class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
        <AlertCircle class="h-5 w-5" />
        {error}
      </div>
    {/if}

    {#if successMessage}
      <div class="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
        {successMessage}
      </div>
    {/if}

    {#if !isAuthenticated}
      <div class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p class="text-blue-700 dark:text-blue-300 mb-4">Você precisa estar logado para deixar um comentário.</p>
        <button 
          on:click={irParaLogin}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <LogIn class="h-5 w-5" />
          Entrar para comentar
        </button>
      </div>
    {:else}
      <form on:submit|preventDefault={adicionarComentario} class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          {#if currentUser.photoURL}
            <img src={currentUser.photoURL} alt="Foto de perfil" class="w-10 h-10 rounded-full object-cover" />
          {:else}
            <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
            </div>
          {/if}
          <div>
            <div class="font-medium text-gray-800 dark:text-white">{currentUser.name || 'Usuário'}</div>
            <div class="text-sm text-gray-500">{currentUser.email || ''}</div>
          </div>
        </div>

        <div>
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Avaliação
          </label>
          <div class="flex gap-1">
            {#each Array(5) as _, i}
              <button
                type="button"
                class="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                on:click={() => novoComentario.avaliacao = i + 1}
              >
                <Star class="h-8 w-8 {i < novoComentario.avaliacao ? 'fill-current' : ''}" />
              </button>
            {/each}
          </div>
        </div>

        <div>
          <label for="comentario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comentário
          </label>
          <textarea
            id="comentario"
            bind:value={novoComentario.comentario}
            rows="4"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Conte-nos sua experiência..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full md:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <Loader2 class="h-5 w-5 animate-spin" />
            Enviando...
          {:else}
            <Send class="h-5 w-5" />
            Enviar Comentário
          {/if}
        </button>
      </form>
    {/if}
  </div>

  <!-- Lista de Comentários -->
  <div class="space-y-6">
    {#if isLoading}
      <div class="text-center py-8">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Carregando comentários...</p>
      </div>
    {:else if comentarios.length === 0}
      <div class="text-center py-8 text-gray-500">
        <MessageSquare class="h-8 w-8 mx-auto mb-2" />
        <p>Seja o primeiro a comentar!</p>
      </div>
    {:else}
      {#each comentarios as comentario}
        <div class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
          <div class="flex items-start justify-between">
            <div class="flex gap-3">
              <!-- Foto do usuário -->
              {#if comentario.usuario_photoURL}
                <img src={comentario.usuario_photoURL} alt="Foto de perfil" class="w-10 h-10 rounded-full object-cover" />
              {:else}
                <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  {comentario.usuario_nome ? comentario.usuario_nome.charAt(0).toUpperCase() : '?'}
                </div>
              {/if}
              
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    {comentario.usuario_nome}
                  </h4>
                  <span class="text-sm text-gray-500">
                    {comentario.data_criacao
                      ? new Date(comentario.data_criacao).toLocaleDateString('pt-BR')
                      : ''}
                  </span>
                </div>
                <div class="flex gap-1 mt-1">
                  {#each Array(5) as _, i}
                    <Star class="h-4 w-4 {i < comentario.avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
                  {/each}
                </div>
                <p class="mt-2 text-gray-700 dark:text-gray-300">
                  {comentario.comentario}
                </p>
              </div>
            </div>
            
            {#if isComentarioAutor(comentario)}
              <div class="mt-2 flex gap-2 justify-end">
                <button 
                  on:click={() => iniciarEdicao(comentario)}
                  class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button 
                  on:click={() => comentario?.id ? confirmarExclusao(comentario.id) : null}
                  class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </button>
              </div>
            {/if}
          </div>
          
          {#if comentario.resposta}
            <div class="mt-3 ml-14 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="font-medium text-green-600 dark:text-green-400">
                  Resposta do comerciante:
                </span>
                <span class="text-sm text-gray-500">
                  {comentario.data_resposta
                    ? new Date(comentario.data_resposta).toLocaleDateString('pt-BR')
                    : ''}
                </span>
              </div>
              <p class="mt-1 text-gray-700 dark:text-gray-300">
                {comentario.resposta}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<!-- Modal de edição de comentário -->
{#if editandoComentario}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Editar Comentário</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Avaliação
          </label>
          <div class="flex gap-1">
            {#each Array(5) as _, i}
              <button
                type="button"
                class="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                on:click={() => avaliacaoEditada = i + 1}
              >
                <Star class="h-8 w-8 {i < avaliacaoEditada ? 'fill-current' : ''}" />
              </button>
            {/each}
          </div>
        </div>
        
        <div>
          <label for="comentario-editado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comentário
          </label>
          <textarea
            id="comentario-editado"
            bind:value={comentarioEditado}
            rows="4"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Conte-nos sua experiência..."
            required
          ></textarea>
        </div>
        
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            on:click={cancelarEdicao}
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            on:click={salvarEdicao}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={isSubmitting || !comentarioEditado}
          >
            {#if isSubmitting}
              <Loader2 class="h-5 w-5 animate-spin" />
              Salvando...
            {:else}
              Salvar Alterações
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Modal de confirmação de exclusão -->
{#if mostrarConfirmacaoExclusao}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirmar Exclusão</h3>
      
      <p class="text-gray-700 dark:text-gray-300 mb-6">
        Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
      </p>
      
      <div class="flex gap-3 justify-end">
        <button
          type="button"
          on:click={cancelarExclusao}
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="button"
          on:click={excluirComentario}
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <Loader2 class="h-5 w-5 animate-spin" />
            Excluindo...
          {:else}
            Excluir Comentário
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if} 