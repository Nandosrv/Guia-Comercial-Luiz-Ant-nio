<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
  import { AlertCircle, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-svelte';

  export let planoId: string;
  export let onSuccessRenovacao: () => void = () => {};
  export let onError: (mensagem: string) => void = () => {};
  export let onCancel: () => void = () => {};
  export let isAquisicao: boolean = false; // Novo parâmetro para indicar se é aquisição ou renovação

  // Types para QR Code e assinatura
  type QRCodeData = {
    qrCodeBase64?: string;
    qrCode?: string;
  };

  // Estados
  let loading = false;
  let qrCodeData: QRCodeData | null = null;
  let assinaturaId: string | null = null;
  let error = '';
  let success = false;
  let verificandoPagamento = false;
  let statusPagamento = 'pendente';
  let tempoRestante = 300; // 5 minutos em segundos
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let temConfirmacaoManual = false; // Estado para mostrar a confirmação manual
  
  // Constantes
  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'https://api-backend-production-5b22.up.railway.app' 
    : 'https://api-backend-production-5b22.up.railway.app';  // URL real da API em produção

  // Debug info
  let debugInfo = '';
  let webhookTeste = '';
  
  // Variáveis para controlar o pagamento
  let paymentUrl = '';
  let qrCodeImageError = false; // Para controlar erro no carregamento do QR code
  let temFormasPagamento = false; // Para verificar se há pelo menos uma forma de pagamento disponível
  
  onMount(async () => {
    await gerarQrCode();
    await testarWebhook();
  });

  onDestroy(() => {
    limparVerificacaoPagamento();
  });

  // Função para gerar QR code de pagamento
  async function gerarQrCode() {
    if (!planoId) {
      error = 'ID do plano não fornecido';
      return;
    }

    try {
      loading = true;
      error = '';
      qrCodeImageError = false;
      
      console.log('Gerando QR Code para o plano ID:', planoId);
      
      const token = await pegarTokenUsuario();
      if (!token) {
        throw new Error('Não foi possível obter o token de autenticação');
      }
      
      console.log('Token obtido, fazendo requisição...');
      
      // Verificar primeiro se há uma assinatura pendente válida
      let existingAssinatura = null;
      try {
        const checkResponse = await fetch(`${API_BASE_URL}/painel/planos/assinaturas-pendentes/${planoId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.assinatura) {
            existingAssinatura = checkData.assinatura;
            console.log('Assinatura pendente encontrada:', existingAssinatura);
          }
        }
      } catch (checkError) {
        console.warn('Erro ao verificar assinaturas pendentes:', checkError);
        // Continua com o fluxo normal se a verificação falhar
      }
      
      // Se encontrou uma assinatura pendente recente (menos de 15 minutos), usar ela
      if (existingAssinatura) {
        const createdAt = new Date(existingAssinatura.created_at);
        const agora = new Date();
        const diffMinutos = Math.floor((agora.getTime() - createdAt.getTime()) / (1000 * 60));
        
        if (diffMinutos < 15) {
          console.log('Usando assinatura pendente recente:', existingAssinatura.id);
          assinaturaId = existingAssinatura.id;
          
          // Buscar os dados de pagamento para esta assinatura
          const paymentResponse = await fetch(`${API_BASE_URL}/painel/planos/pagamento-info/${assinaturaId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (paymentResponse.ok) {
            const paymentInfo = await paymentResponse.json();
            if (paymentInfo && paymentInfo.success) {
              // Usar os dados de pagamento existentes
              paymentUrl = paymentInfo.paymentUrl || '';
              qrCodeData = paymentInfo.qrCode || null;
              
              temFormasPagamento = !!(paymentUrl || (qrCodeData && (qrCodeData.qrCode || qrCodeData.qrCodeBase64)));
              if (temFormasPagamento) {
                // Iniciar verificação de pagamento com a assinatura existente
                iniciarVerificacaoPagamento();
                loading = false;
                return;
              }
            }
          }
        }
      }
      
      // Se não encontrou assinatura pendente válida ou não conseguiu os dados de pagamento, continuar com o fluxo normal
      const url = `${API_BASE_URL}/painel/planos/renovar/${planoId}`;
      console.log('URL da requisição:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Status da resposta:', response.status, response.statusText);
      
      // Verificar tipo de conteúdo primeiro
      const contentType = response.headers.get('content-type');
      console.log('Tipo de conteúdo da resposta:', contentType);
      
      if (!response.ok) {
        // Tenta obter o erro como JSON primeiro
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || `Erro ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          // Se falhar ao obter como JSON, tenta obter como texto
          const errorText = await response.text();
          console.error('Erro da resposta (texto):', errorText);
          throw new Error(`Erro ${response.status}: ${errorText.substring(0, 100)}...`);
        }
      }

      // Verifica o tipo de conteúdo da resposta
      if (!contentType || !contentType.includes('application/json')) {
        const respText = await response.text();
        console.error('Resposta não-JSON:', respText);
        throw new Error(`Resposta inválida. Tipo de conteúdo: ${contentType || 'desconhecido'}`);
      }

      const data = await response.json();
      console.log('Resposta da API:', data);
      
      // Verificar se a resposta contém os dados necessários
      if (!data || !data.success) {
        throw new Error('Resposta inválida do servidor');
      }

      // Extrair o QR code e ID da assinatura da resposta
      assinaturaId = data.assinaturaId || null;
      
      // Salvar a URL de pagamento se disponível
      paymentUrl = data.paymentUrl || '';
      if (!paymentUrl && data.preferenceId) {
        paymentUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=${data.preferenceId}`;
      }
      
      // Verifica se o objeto qrCode existe na resposta
      if (data.qrCode) {
        qrCodeData = data.qrCode;
      } else {
        // Se não existe, tenta criar um objeto manualmente a partir dos campos disponíveis
        qrCodeData = {
          qrCodeBase64: data.qrCodeBase64 || '',
          qrCode: data.qrCode || data.qr_code || paymentUrl || ''
        };
      }
      
      // Verificar se temos pelo menos uma forma de pagamento
      temFormasPagamento = !!(paymentUrl || (qrCodeData && (qrCodeData.qrCode || qrCodeData.qrCodeBase64)));
      
      if (!temFormasPagamento) {
        console.warn('Nenhuma forma de pagamento disponível após processamento');
        throw new Error('Nenhum método de pagamento disponível. Tente novamente ou entre em contato com o suporte.');
      }
      
      // Iniciar verificação de pagamento
      iniciarVerificacaoPagamento();
    } catch (err: unknown) {
      console.error('Erro ao gerar QR code:', err);
      if (err instanceof Error) {
        error = err.message || 'Erro ao gerar QR code para pagamento';
      } else {
        error = 'Erro desconhecido ao gerar QR code';
      }
      onError(error);
    } finally {
      loading = false;
    }
  }

  // Verificar status do pagamento diretamente no Mercado Pago
  async function verificarStatusPagamentoMP() {
    if (!assinaturaId) return false;
    
    try {
      loading = true;
      const token = await pegarTokenUsuario();
      
      // Endpoint específico para verificar no Mercado Pago
      const response = await fetch(`${API_BASE_URL}/painel/planos/verificar-pagamento-mp/${assinaturaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento no Mercado Pago');
      }

      const data = await response.json();
      console.log('Resposta da verificação MP:', data);
      
      // Se o pagamento foi aprovado, atualizar status
      if (data.success && data.status === 'approved') {
        statusPagamento = 'ativo';
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      } else if (data.status === 'rejected') {
        statusPagamento = 'falha';
        error = 'Pagamento rejeitado pelo Mercado Pago. Por favor, tente outro método de pagamento.';
        return false;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao verificar status no Mercado Pago:', err);
      return false;
    } finally {
      loading = false;
    }
  }

  // Verificar status do pagamento no banco de dados
  async function verificarStatusPagamento() {
    if (!assinaturaId) return false;
    
    try {
      loading = true; // Mostrar carregamento durante a verificação
      const token = await pegarTokenUsuario();
      const response = await fetch(`${API_BASE_URL}/painel/planos/verificar-pagamento/${assinaturaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      const data = await response.json();
      console.log('Resposta da verificação de pagamento:', data);
      statusPagamento = data.status;
      
      // Se a assinatura estiver ativa, o pagamento foi aprovado
      if (data.status === 'ativo') {
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao verificar status do pagamento:', err);
      return false;
    } finally {
      loading = false;
    }
  }

  // Iniciar verificação periódica do pagamento
  function iniciarVerificacaoPagamento() {
    if (verificandoPagamento || !assinaturaId) return;
    
    verificandoPagamento = true;
    tempoRestante = 300; // Resetar para 5 minutos
    
    // Verificar o pagamento mais frequentemente (a cada 10 segundos)
    intervalId = setInterval(async () => {
      tempoRestante -= 10;
      
      // Primeiro verificar no Mercado Pago
      let aprovado = await verificarStatusPagamentoMP();
      
      // Se não foi aprovado no MP, verificar no banco de dados
      if (!aprovado) {
        aprovado = await verificarStatusPagamento();
      }
      
      if (aprovado) {
        // Se aprovado, limpar os intervalos e mostrar mensagem de sucesso
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
      } else if (tempoRestante <= 0) {
        // Se o tempo acabou, limpar os intervalos
        limparVerificacaoPagamento();
        error = 'Tempo para pagamento expirado. Por favor, tente novamente.';
        onError(error);
      }
    }, 10000); // Verificar a cada 10 segundos
  }

  // Limpar verificação de pagamento
  function limparVerificacaoPagamento() {
    verificandoPagamento = false;
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Formatar tempo restante
  function formatarTempoRestante() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  // Cancelar renovação
  function cancelarRenovacao() {
    limparVerificacaoPagamento();
    onCancel();
  }

  // Função para verificar token
  async function verificarToken() {
    try {
      const token = await pegarTokenUsuario();
      debugInfo = `Token: ${token ? token.substring(0, 10) + '...' : 'null'}\nPlano ID: ${planoId}\nURL API: ${API_BASE_URL}\nWebhook: ${webhookTeste}`;
    } catch (err) {
      debugInfo = `Erro ao obter token: ${err instanceof Error ? err.message : String(err)}\nWebhook: ${webhookTeste}`;
    }
  }

  // Função para abrir o link de pagamento
  function abrirLinkPagamento() {
    if (paymentUrl) {
      // Alterado para exibir uma opção de escolha ao usuário
      const confirmacao = window.confirm('Você será redirecionado para o site do Mercado Pago. Deseja continuar?');
      if (confirmacao) {
        window.open(paymentUrl, '_blank');
      }
    }
  }

  // Função para forçar a verificação do pagamento
  async function forcarVerificacaoPagamento() {
    if (!assinaturaId) {
      error = 'ID da assinatura não encontrado. Por favor, tente novamente.';
      return false;
    }
    
    try {
      loading = true;
      
      // Primeiro verificar diretamente no Mercado Pago
      const aprovadoMP = await verificarStatusPagamentoMP();
      if (aprovadoMP) return true;
      
      // Se não foi aprovado no Mercado Pago, verificar no banco de dados
      const token = await pegarTokenUsuario();
      
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_BASE_URL}/painel/planos/verificar-pagamento/${assinaturaId}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      const data = await response.json();
      console.log('Resposta da verificação forçada:', data);
      statusPagamento = data.status;
      
      // Se a assinatura estiver ativa, o pagamento foi aprovado
      if (data.status === 'ativo') {
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      }
      
      // Se ainda estiver pendente, verificar manualmente no Mercado Pago
      if (data.status === 'pendente' && data.payment_id) {
        // Tentar verificar manualmente o pagamento no endpoint novo
        try {
          console.log(`Verificando manualmente o pagamento com ID: ${data.payment_id}`);
          const manualCheckResponse = await fetch(`${API_BASE_URL}/painel/mercadopago/verificar-pagamento`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payment_id: data.payment_id })
          });
          
          const manualCheckData = await manualCheckResponse.json();
          console.log('Resposta da verificação manual:', manualCheckData);
          
          if (manualCheckData.success) {
            // Se o pagamento foi ativado com sucesso, atualizar status
            statusPagamento = 'ativo';
            limparVerificacaoPagamento();
            success = true;
            setTimeout(() => {
              onSuccessRenovacao();
            }, 3000);
            return true;
          } else {
            // Mostrar mensagem sobre o status do pagamento
            const msgElement = document.getElementById('msg-verificacao');
            if (msgElement) {
              msgElement.textContent = `Status do pagamento: ${manualCheckData.payment?.status || 'desconhecido'}. Tente novamente em alguns instantes.`;
              setTimeout(() => {
                if (msgElement) msgElement.textContent = '';
              }, 7000);
            }
          }
        } catch (manualCheckError) {
          console.error('Erro na verificação manual:', manualCheckError);
        }
      }
      
      // Se ainda estiver pendente, mostrar mensagem
      if (statusPagamento === 'pendente') {
        // Adicionar uma mensagem temporária
        const msgElement = document.getElementById('msg-verificacao');
        if (msgElement) {
          msgElement.textContent = 'Pagamento ainda não confirmado. Se você já pagou, aguarde alguns instantes e tente novamente.';
          
          // Limpar a mensagem após 5 segundos
          setTimeout(() => {
            if (msgElement) msgElement.textContent = '';
          }, 5000);
        }
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao forçar verificação do pagamento:', err);
      return false;
    } finally {
      loading = false;
    }
  }

  // Função para forçar a atualização da assinatura
  async function forcarAtualizacaoAssinatura() {
    if (!assinaturaId) {
      error = 'ID da assinatura não encontrado. Por favor, tente novamente.';
      return false;
    }
    
    try {
      loading = true;
      const token = await pegarTokenUsuario();
      
      // Verificar primeiro o status atual
      const statusAtual = await fetch(`${API_BASE_URL}/painel/planos/verificar-pagamento/${assinaturaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      }).then(r => r.json());
      
      // Se já está ativo, não precisa atualizar
      if (statusAtual.status === 'ativo') {
        statusPagamento = 'ativo';
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      }
      
      // Se ainda está pendente, tentar forçar atualização
      const response = await fetch(`${API_BASE_URL}/painel/planos/confirmar-pagamento/${assinaturaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          confirmado_manualmente: true,
          status: 'ativo'
        })
      });

      if (!response.ok) {
        // Mostrar opção de confirmação manual
        temConfirmacaoManual = true;
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao confirmar pagamento');
      }

      const data = await response.json();
      console.log('Resposta da confirmação manual:', data);
      
      if (data.success) {
        statusPagamento = 'ativo';
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      } else {
        // Mostrar opção de confirmação manual
        temConfirmacaoManual = true;
        
        throw new Error(data.message || 'Não foi possível confirmar o pagamento');
      }
    } catch (err) {
      console.error('Erro ao forçar atualização da assinatura:', err);
      
      // Mostrar opção de confirmação manual
      temConfirmacaoManual = true;
      
      // Mensagem de erro mais amigável
      const msgElement = document.getElementById('msg-verificacao');
      if (msgElement) {
        msgElement.textContent = 'Sistema não conseguiu confirmar o pagamento automaticamente. Se você já pagou, use a opção de confirmação manual abaixo.';
        setTimeout(() => {
          if (msgElement) msgElement.textContent = '';
        }, 8000);
      }
      
      return false;
    } finally {
      loading = false;
    }
  }

  // Função para forçar a atualização do status (confirmação manual)
  async function forcarAtualizacaoManual() {
    if (!assinaturaId) {
      error = 'ID da assinatura não encontrado. Por favor, tente novamente.';
      return false;
    }
    
    try {
      loading = true;
      const token = await pegarTokenUsuario();
      
      // Faz uma chamada direta para atualizar o status da assinatura
      const response = await fetch(`${API_BASE_URL}/painel/planos/atualizar-assinatura/${assinaturaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'ativo',
          confirmacao_manual: true,
          data_confirmacao: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Não foi possível atualizar o status da assinatura');
      }

      const data = await response.json();
      console.log('Resposta da atualização manual:', data);
      
      // Atualizar o status e mostrar mensagem de sucesso
      statusPagamento = 'ativo';
      limparVerificacaoPagamento();
      success = true;
      setTimeout(() => {
        onSuccessRenovacao();
      }, 3000);
      return true;
    } catch (err) {
      console.error('Erro ao forçar atualização manual:', err);
      const msgElement = document.getElementById('msg-verificacao');
      if (msgElement) {
        msgElement.textContent = 'Não foi possível atualizar o status. Por favor, contate o suporte.';
        setTimeout(() => {
          if (msgElement) msgElement.textContent = '';
        }, 8000);
      }
      return false;
    } finally {
      loading = false;
    }
  }

  // Função para verificar se o QR code base64 é válido
  function isQrCodeValid() {
    if (!qrCodeData || !qrCodeData.qrCodeBase64) {
      return false;
    }
    
    // Verificar se é uma string base64 válida (não vazia e sem caracteres inválidos)
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return typeof qrCodeData.qrCodeBase64 === 'string' && 
           qrCodeData.qrCodeBase64.length > 0 &&
           base64Regex.test(qrCodeData.qrCodeBase64);
  }

  // Função para tratar erro no carregamento da imagem do QR code
  function handleQrCodeImageError() {
    qrCodeImageError = true;
    console.error('Erro ao carregar imagem do QR code');
  }

  // Função para copiar texto para a área de transferência com tratamento de erros
  async function copiarParaAreaTransferencia(texto: string, elementoId: string, mensagemSucesso: string = 'Copiado!', mensagemOriginal: string = 'Copiar'): Promise<boolean> {
    try {
      if (!navigator.clipboard) {
        throw new Error('API de área de transferência não disponível');
      }
      
      await navigator.clipboard.writeText(texto);
      
      // Atualizar o botão com mensagem de sucesso
      const elemento = document.getElementById(elementoId);
      if (elemento) {
        elemento.textContent = mensagemSucesso;
        setTimeout(() => {
          if (elemento) elemento.textContent = mensagemOriginal;
        }, 2000);
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao copiar para área de transferência:', err);
      
      // Mostrar mensagem de erro
      const msgElement = document.getElementById('msg-verificacao');
      if (msgElement) {
        msgElement.textContent = 'Não foi possível copiar o texto. Seu navegador pode não suportar esta funcionalidade.';
        setTimeout(() => {
          if (msgElement) msgElement.textContent = '';
        }, 3000);
      }
      
      return false;
    }
  }

  // Função para testar se o webhook está acessível
  async function testarWebhook() {
    try {
      const response = await fetch(`${API_BASE_URL}/webhook`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        webhookTeste = `Webhook acessível: ${data.message || 'OK'}`;
        console.log('Webhook teste:', webhookTeste);
      } else {
        webhookTeste = `Webhook não acessível: Erro ${response.status}`;
        console.error('Teste de webhook falhou:', response.status, response.statusText);
      }
    } catch (err) {
      webhookTeste = `Erro ao acessar webhook: ${err instanceof Error ? err.message : String(err)}`;
      console.error('Erro ao testar webhook:', err);
    }
  }
  
  // Função para simular um webhook de pagamento (apenas para ambiente de desenvolvimento)
  async function simularWebhook() {
    if (!assinaturaId) {
      error = 'ID da assinatura não encontrado. Por favor, tente novamente.';
      return false;
    }
    
    try {
      loading = true;
      
      // Verificar se estamos em ambiente de desenvolvimento
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isDev) {
        throw new Error('Esta função só está disponível em ambiente de desenvolvimento');
      }
      
      // Simular um webhook de pagamento
      const response = await fetch(`${API_BASE_URL}/webhook-simulate/${assinaturaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta da simulação de webhook:', data);
      
      if (data.success) {
        statusPagamento = 'ativo';
        limparVerificacaoPagamento();
        success = true;
        setTimeout(() => {
          onSuccessRenovacao();
        }, 3000);
        return true;
      } else {
        throw new Error(data.message || 'Falha na simulação do webhook');
      }
    } catch (err) {
      console.error('Erro ao simular webhook:', err);
      error = err instanceof Error ? err.message : 'Erro desconhecido ao simular webhook';
      return false;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
  <h2 class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
    {isAquisicao ? 'Adquirir Plano Premium' : 'Renovar Assinatura'}
  </h2>
  
  <!-- Mensagem destacada para usuários que já realizaram o pagamento -->
  {#if !loading && !error && !success && (qrCodeData || paymentUrl)}
    <div class="mb-6 p-4 bg-blue-100 border-l-4 border-blue-600 rounded-r-md">
      {#if qrCodeImageError}
        <h3 class="font-medium text-blue-700">PROBLEMAS COM QR CODE?</h3>
        <p class="text-sm text-blue-700 mt-1">
          Você pode usar as seguintes alternativas para pagamento:
        </p>
        <ul class="text-sm text-blue-700 list-disc ml-5 mt-1">
          <li>Copiar o código Pix e colar no app do seu banco</li>
          <li>Usar o botão "Pagar com Mercado Pago" e pagar pelo site</li>
          <li>Copiar a URL de pagamento e abrir em outro navegador</li>
        </ul>
      {:else}
        <h3 class="font-medium text-blue-700">ATENÇÃO: Se você já pagou</h3>
        <p class="text-sm text-blue-700 mt-1">
          Existe um atraso normal entre o pagamento e a confirmação pelo sistema. Se você já realizou o pagamento, clique no botão "Já Paguei" para verificar o status.
        </p>
      {/if}
    </div>
  {/if}
  
  {#if loading}
    <div class="flex flex-col items-center justify-center py-10">
      <Loader2 class="w-12 h-12 text-purple-600 animate-spin" />
      <p class="mt-4 text-gray-600 dark:text-gray-300">Gerando QR Code para pagamento...</p>
    </div>
  {:else if error}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <XCircle class="w-12 h-12 text-red-500 mb-2" />
      <p class="text-red-500 font-medium">{error}</p>
      <button 
        on:click={gerarQrCode}
        class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Tentar Novamente
      </button>
      
      <!-- Botão de debug -->
      <button 
        on:click={verificarToken}
        class="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs"
      >
        Debug Info
      </button>
      {#if debugInfo}
        <div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-left text-xs font-mono whitespace-pre-wrap">
          {debugInfo}
        </div>
      {/if}
      
      <!-- Botão de teste de webhook -->
      <button 
        on:click={testarWebhook}
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
      >
        Testar Webhook
      </button>
      
      <!-- Botão para simular webhook (apenas em desenvolvimento) -->
      {#if window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'}
        {#if assinaturaId}
          <button 
            on:click={simularWebhook}
            class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
          >
            Simular Pagamento
          </button>
        {/if}
      {/if}
    </div>
  {:else if success}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <CheckCircle2 class="w-12 h-12 text-green-500 mb-2" />
      <p class="text-green-600 font-medium dark:text-green-400">Pagamento recebido com sucesso!</p>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        {isAquisicao ? 'Seu plano Premium foi ativado.' : 'Sua assinatura foi renovada.'}
      </p>
    </div>
  {:else if qrCodeData || paymentUrl}
    <div class="flex flex-col items-center">
      <!-- Banner para usuários que já pagaram -->
      <div class="w-full p-4 bg-yellow-50 rounded-md mb-4 border-l-4 border-yellow-400">
        <div class="flex items-start">
          <AlertCircle class="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p class="text-sm font-medium text-yellow-700">
              Já realizou o pagamento?
            </p>
            <p class="text-sm text-yellow-600 mt-1">
              Se você já realizou o pagamento pelo QR code ou Mercado Pago, clique no botão abaixo para atualizar o status.
            </p>
            <button 
              on:click={forcarAtualizacaoAssinatura}
              class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors inline-flex items-center"
              disabled={verificandoPagamento || loading}
            >
              <span>{verificandoPagamento || loading ? 'Verificando...' : 'Já Paguei - Verificar Agora'}</span>
              {#if verificandoPagamento || loading}
                <Loader2 class="ml-2 w-4 h-4 animate-spin" />
              {/if}
            </button>
            <p id="msg-verificacao" class="text-sm text-red-500 mt-1"></p>
          </div>
        </div>
      </div>
      
      {#if qrCodeData && (isQrCodeValid() || (qrCodeData.qrCode && typeof qrCodeData.qrCode === 'string'))}
        {#if isQrCodeValid() && !qrCodeImageError}
          <!-- QR Code como imagem base64 - Melhorado para estar mais destacado -->
          <div class="mb-4 border p-6 rounded bg-white flex flex-col items-center shadow-md">
            <p class="text-center text-lg font-medium text-gray-800 mb-3">Escaneie o QR Code para pagar</p>
            <img 
              src={`data:image/png;base64,${qrCodeData.qrCodeBase64}`} 
              alt="QR Code para pagamento" 
              class="w-72 h-72 mb-3"
              on:error={() => handleQrCodeImageError()}
            />
            
            <div class="w-full mt-2 flex justify-center">
              <button
                on:click={async () => {
                  if (qrCodeData && qrCodeData.qrCode) {
                    await copiarParaAreaTransferencia(
                      qrCodeData.qrCode,
                      'btn-copy-qr',
                      'Código copiado!',
                      'Copiar código QR'
                    );
                  }
                }}
                id="btn-copy-qr"
                class="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Copiar código QR
              </button>
            </div>
            <p class="text-sm text-gray-700 mt-3 text-center">
              Escaneie o QR Code com o aplicativo do seu banco ou copie o código para pagar
            </p>
            <p class="text-xs text-gray-500 mt-1 text-center">
              O sistema verificará o pagamento a cada 10 segundos automaticamente
            </p>
          </div>
        {:else if qrCodeData.qrCode && typeof qrCodeData.qrCode === 'string' && !qrCodeData.qrCode.startsWith('http')}
          <!-- Mostrando QR como texto ou imagem falhou -->
          <div class="mb-4 border p-4 rounded bg-white">
            <div class="w-64 h-64 mb-2 flex flex-col items-center justify-center bg-gray-100 rounded">
              <XCircle class="w-16 h-16 text-red-500 mb-2" />
              <p class="text-sm text-red-600 text-center px-4">
                Não foi possível carregar o QR Code. Por favor, utilize os métodos alternativos abaixo.
              </p>
            </div>
            
            <p class="text-center text-gray-800 break-all font-mono text-xs mb-2">{qrCodeData.qrCode}</p>
            <div class="w-full flex justify-center">
              <button
                on:click={async () => {
                  if (qrCodeData && qrCodeData.qrCode) {
                    await copiarParaAreaTransferencia(
                      qrCodeData.qrCode,
                      'btn-copy-text',
                      'Código copiado!',
                      'Copiar código'
                    );
                  }
                }}
                id="btn-copy-text"
                class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Copiar código
              </button>
            </div>
          </div>
        {/if}
      {/if}
      
      <!-- Sempre mostrar o botão de pagamento se tivermos uma URL -->
      {#if paymentUrl}
        <div class="mb-4 text-center p-4 border rounded-md bg-gray-50">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Opções de pagamento</h3>
          
          <div class="flex flex-col gap-2">
            <button 
              on:click={abrirLinkPagamento}
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors inline-flex items-center justify-center"
            >
              <span>Pagar com Mercado Pago</span>
              <ExternalLink class="ml-2 w-4 h-4" />
            </button>
            
            <button
              on:click={async () => {
                if (paymentUrl) {
                  await copiarParaAreaTransferencia(
                    paymentUrl,
                    'btn-copy-url',
                    'URL copiada!',
                    'Copiar URL de pagamento'
                  );
                }
              }}
              id="btn-copy-url"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Copiar URL de pagamento
            </button>
          </div>
          
          <p class="text-xs text-gray-500 mt-3">
            Se o QR Code não funcionar, você pode usar uma dessas opções alternativas para pagamento.
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Após pagar pelo Mercado Pago, pode levar alguns instantes para o sistema confirmar o pagamento.
          </p>
        </div>
      {/if}
      
      <div class="w-full p-4 bg-blue-50 rounded-md mb-4 dark:bg-blue-900/30">
        <div class="flex items-start">
          <AlertCircle class="text-blue-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <div>
            {#if isAquisicao}
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Você está adquirindo o plano Premium, que lhe dará acesso ilimitado por 30 dias.
              </p>
            {/if}
            
            {#if qrCodeData && (isQrCodeValid() || (qrCodeData.qrCode && typeof qrCodeData.qrCode === 'string'))}
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Escaneie o QR code acima com o app do seu banco para pagar.
              </p>
            {:else if paymentUrl}
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Clique no botão acima para ser redirecionado para a página de pagamento.
              </p>
            {/if}
            <p class="text-sm text-blue-700 mt-1 dark:text-blue-300">
              Tempo restante: <span class="font-medium">{formatarTempoRestante()}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div class="w-full">
        <div class="text-sm text-gray-500 mb-4 dark:text-gray-400">Status: 
          <span class="font-medium 
            {statusPagamento === 'ativo' ? 'text-green-600 dark:text-green-400' : 
              statusPagamento === 'pendente' ? 'text-yellow-600 dark:text-yellow-400' : 
              statusPagamento === 'falha' ? 'text-red-600 dark:text-red-400' : 
              'text-blue-600 dark:text-blue-400'}">
            {statusPagamento === 'ativo' ? 'Aprovado' : 
              statusPagamento === 'pendente' ? 'Aguardando Pagamento' : 
              statusPagamento === 'falha' ? 'Falha no Pagamento' : 
              'Processando'}
          </span>
        </div>
        
        <!-- Botão de confirmação manual (aparece após uma tentativa de verificação) -->
        {#if temConfirmacaoManual}
          <div class="mb-4 p-3 bg-purple-50 rounded-md border border-purple-200">
            <p class="text-sm text-purple-700 mb-2">
              Confirme que você realmente realizou o pagamento:
            </p>
            <button
              on:click={() => {
                temConfirmacaoManual = false;
                forcarAtualizacaoManual();
              }}
              class="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex justify-center items-center"
            >
              Confirmo que paguei - Ativar minha assinatura
            </button>
            <p class="text-xs text-gray-500 mt-2 text-center">
              Clique apenas se você realmente completou o pagamento
            </p>
          </div>
        {/if}
        
        <div class="flex flex-col gap-2 mt-4">
          <button
            on:click={forcarAtualizacaoAssinatura}
            class="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-400 flex justify-center items-center"
            disabled={verificandoPagamento || loading}
          >
            {#if verificandoPagamento || loading}
              <Loader2 class="mr-2 w-5 h-5 animate-spin" />
              Verificar Status do Pagamento
            {:else}
              Verificar Status do Pagamento
            {/if}
          </button>
          
          <button
            on:click={cancelarRenovacao}
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  {:else if !loading && !error && !success && !temFormasPagamento}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle class="w-12 h-12 text-red-500 mb-2" />
      <p class="text-red-500 font-medium">Não foi possível obter os métodos de pagamento.</p>
      <p class="text-gray-600 mt-2 mb-4">Por favor, tente novamente ou entre em contato com o suporte.</p>
      <button 
        on:click={gerarQrCode}
        class="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  {:else if !loading && !error && !success && qrCodeImageError && !paymentUrl}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle class="w-12 h-12 text-yellow-500 mb-2" />
      <p class="text-yellow-600 font-medium">O QR code não pôde ser carregado.</p>
      <p class="text-gray-600 mt-2 mb-4">Infelizmente, não foi possível exibir o QR code e não há URL alternativa disponível.</p>
      <button 
        on:click={gerarQrCode}
        class="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <AlertCircle class="w-12 h-12 text-red-500 mb-2" />
      <p class="text-red-500 font-medium">Não foi possível carregar o método de pagamento.</p>
      <button 
        on:click={gerarQrCode}
        class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  {/if}
</div> 