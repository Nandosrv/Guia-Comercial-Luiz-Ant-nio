<script lang="ts">
  import { onMount } from 'svelte';
  import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
  import { goto } from '$app/navigation';
  import { getAuth } from 'firebase/auth';
  import { 
    Store, 
    MapPin, 
    Phone, 
    Loader2, 
    CheckCircle, 
    AlertCircle,
    Building2,
    ArrowRight,
    ShoppingBag,
    Mail,
    Clock,
    Facebook,
    Instagram,
    CreditCard,
    Upload,
    MessageSquare,
    X,
    DollarSign,
    CreditCard as CreditCardIcon,
    QrCode,
    Receipt,
    Building,
    Info,
    Image
  } from 'lucide-svelte';

  // Definindo a URL base para uso em todo o componente
  const baseUrl = 'https://api-backend-production-5b22.up.railway.app';

  // Função para gerar slug manualmente
  function gerarSlug(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/--+/g, '-') // Remove múltiplos hífens
      .trim(); // Remove espaços no início e fim
  }

  // Variáveis de formulário
  let nome = '';
  let endereco = '';
  let telefone = '';
  let whatsapp = '';
  let categoria = '';
  let subcategoria = '';
  let email = '';
  let facebook = '';
  let instagram = '';
  let descricao = '';
  let fotos: File[] = [];
  let fotosPreview: string[] = [];
  let plano = ''; // Será definido pelo sistema

  // Métodos de pagamento
  let metodosPagamento = {
    dinheiro: false,
    pix: false,
    cartaoDebito: false,
    cartaoCredito: false,
    boleto: false,
    transferencia: false
  };

  // Horários de funcionamento
  let horariosFuncionamento = [
    { dia: 'Segunda', aberto: true, abertura: '08:00', fechamento: '18:00' },
    { dia: 'Terça', aberto: true, abertura: '08:00', fechamento: '18:00' },
    { dia: 'Quarta', aberto: true, abertura: '08:00', fechamento: '18:00' },
    { dia: 'Quinta', aberto: true, abertura: '08:00', fechamento: '18:00' },
    { dia: 'Sexta', aberto: true, abertura: '08:00', fechamento: '18:00' },
    { dia: 'Sábado', aberto: true, abertura: '08:00', fechamento: '12:00' },
    { dia: 'Domingo', aberto: false, abertura: '08:00', fechamento: '12:00' }
  ];

  // Variáveis de estado
  let firebase_id = '';
  let isComerciante = false;
  let isLoading = true;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';
  let userId = '';
  let activeTab = 'informacoes'; // 'informacoes', 'horarios', 'pagamentos', 'fotos'
  let uploadEmProgresso = false;

  // Categorias e subcategorias
  const categorias = [
    'Alimentação', 
    'Serviços', 
    'Saúde', 
    'Beleza', 
    'Vestuário', 
    'Tecnologia',
    'Automotivo',
    'Educação',
    'Entretenimento',
    'Outro'
  ];

  // Tipo para o mapa de subcategorias
  type CategoriaMap = {
    [key: string]: string[];
  };

  // Subcategorias baseadas na categoria selecionada com tipo definido corretamente
  const subcategoriasPorCategoria: CategoriaMap = {
    'Alimentação': ['Restaurante', 'Lanchonete', 'Padaria', 'Açougue', 'Mercado', 'Sorveteria', 'Bar', 'Outro'],
    'Serviços': ['Limpeza', 'Manutenção', 'Consultoria', 'Advocacia', 'Contabilidade', 'Segurança', 'Outro'],
    'Saúde': ['Farmácia', 'Clínica', 'Consultório', 'Academia', 'Terapia', 'Odontologia', 'Outro'],
    'Beleza': ['Salão de Beleza', 'Barbearia', 'Estética', 'Spa', 'Manicure', 'Maquiagem', 'Outro'],
    'Vestuário': ['Roupas', 'Calçados', 'Acessórios', 'Moda Infantil', 'Moda Praia', 'Outro'],
    'Tecnologia': ['Informática', 'Celulares', 'Assistência Técnica', 'Desenvolvimento Web', 'Software', 'Outro'],
    'Automotivo': ['Oficina', 'Lava-jato', 'Autopeças', 'Concessionária', 'Borracharia', 'Outro'],
    'Educação': ['Escola', 'Curso', 'Professor Particular', 'Idiomas', 'Creche', 'Outro'],
    'Entretenimento': ['Cinema', 'Teatro', 'Parque', 'Casa de Festas', 'Show', 'Música', 'Outro'],
    'Outro': ['Outro']
  };

  // Lista de subcategorias atual baseada na categoria selecionada
  $: subcategoriasList = categoria ? subcategoriasPorCategoria[categoria] || [] : [];

  const auth = getAuth();
  
  // Verifica se o usuário já tem um comércio
  onMount(async () => {
    // Adicionar um pequeno atraso para dar tempo do Firebase inicializar completamente
          await new Promise(resolve => setTimeout(resolve, 1000));            // Adicionar listener para evento de correção de resposta do servidor      document.addEventListener("resposta-corrigida", ((e: CustomEvent) => {        console.log("✅ Evento de resposta corrigida recebido:", e.detail);                if (e.detail && e.detail.success && e.detail.slug) {          console.log("✅ Usando slug corrigido:", e.detail.slug);          // Atualizar o estado conforme necessário          successMessage = "Comércio cadastrado com sucesso (com correção de slug)!";                    // Redirecionar após 2 segundos          setTimeout(() => {            goto('/painel');          }, 2000);        }      }) as EventListener);            // Verificar se o Firebase está inicializado e se há um usuário logado
    const checkAuth = () => {
      console.log("Verificando autenticação...");
      if (auth.currentUser) {
        userId = auth.currentUser.uid;
        console.log("Usuário logado:", userId);
        fetchUserData();
      } else {
        console.log("Usuário não logado. Aguardando...");
        // Tentar novamente após um curto período
        setTimeout(() => {
          if (auth.currentUser) {
            userId = auth.currentUser.uid;
            console.log("Usuário logado na segunda tentativa:", userId);
            fetchUserData();
          } else {
            console.log("Usuário definitivamente não logado.");
            isLoading = false;
            errorMessage = 'Você precisa estar logado para cadastrar um comércio.';
            plano = 'Básico'; // Valor padrão quando não logado
          }
        }, 2000);
      }
    };

    const fetchUserData = async () => {
      try {
        // Verificar se o usuário já tem um comércio
        const response = await fetch(`https://api-backend-production-5b22.up.railway.app/painel/meu-comercio/${userId}`);
        const data = await response.json();

        if (data && data.isComerciante) {
          isComerciante = true;
          // Redireciona para o painel após verificar que é comerciante
          setTimeout(() => {
            goto('/painel');
          }, 500);
        } else {
          // Verifica a assinatura do usuário para determinar o plano
          try {
            const token = await pegarTokenUsuario();
            console.log('Token obtido:', token.substring(0, 20) + '...');
            
            // Tentativa com caminho absoluto completo
            const apiUrl = 'https://api-backend-production-5b22.up.railway.app';
            console.log('Verificando assinatura em:', `${apiUrl}/planos/verificar-assinatura`);
            
            try {
              const assinaturaResponse = await fetch(`${apiUrl}/planos/verificar-assinatura`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (assinaturaResponse.ok) {
                const assinaturaData = await assinaturaResponse.json();
                console.log('Resposta da verificação de assinatura:', assinaturaData);
                
                if (assinaturaData.temAssinatura && assinaturaData.assinatura.ativa) {
                  // Se tem assinatura ativa, usa o plano da assinatura
                  plano = assinaturaData.assinatura.plano;
                } else {
                  // Se não tem assinatura ativa, define como "Básico"
                  plano = 'Básico';
                }
              } else if (assinaturaResponse.status === 404) {
                console.warn('Rota de verificação de assinatura não encontrada. Configurando plano básico.');
                plano = 'Básico'; // Se a rota não existe, considera plano básico
              } else {
                console.error('Erro ao verificar assinatura:', assinaturaResponse.status, await assinaturaResponse.text());
                plano = 'Básico'; // Fallback se a requisição falhar
              }
            } catch (fetchError) {
              console.error('Erro na requisição para verificar assinatura:', fetchError);
              plano = 'Básico'; // Fallback se ocorrer erro na requisição
            }
          } catch (assinaturaError) {
            console.error('Erro ao verificar assinatura:', assinaturaError);
            plano = 'Básico'; // Fallback se ocorrer erro
          }
        }
      } catch (error) {
        console.error('Erro ao verificar comerciante:', error);
        errorMessage = 'Não foi possível verificar seu cadastro. Tente novamente.';
        plano = 'Básico'; // Valor padrão em caso de erro
      } finally {
        isLoading = false;
      }
    };

    // Iniciar a verificação
    checkAuth();
  });

  // Função para lidar com upload de fotos
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    
    // Limita a 5 arquivos
    const totalFiles = fotos.length + input.files.length;
    if (totalFiles > 5) {
      errorMessage = 'Máximo de 5 fotos permitidas.';
      return;
    }
    
    errorMessage = '';
    uploadEmProgresso = true;
    
    // Adiciona os novos arquivos ao array
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type.startsWith('image/')) {
        fotos = [...fotos, file];
        
        // Cria URL para preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const target = e.target;
          if (target && target.result) {
            fotosPreview = [...fotosPreview, target.result as string];
          }
          
          // Se for a última foto, marca o upload como concluído
          if (i === input.files!.length - 1) {
            uploadEmProgresso = false;
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Se não houver nenhum arquivo válido, marca o upload como concluído
    if (!input.files.length) {
      uploadEmProgresso = false;
    }
  }

  // Remove uma foto do array
  function removerFoto(index: number) {
    fotos = fotos.filter((_, i) => i !== index);
    fotosPreview = fotosPreview.filter((_, i) => i !== index);
  }

  // Formatar telefone automaticamente
  function formatarTelefone(event: Event, campo: 'telefone' | 'whatsapp') {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      // Formato: (XX) XXXXX-XXXX
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else if (value.length <= 11) {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
      } else {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
      }
    }
    
    if (campo === 'telefone') {
      telefone = value;
    } else {
      whatsapp = value;
    }
  }

  // Alternar dia como aberto/fechado
  function toggleDiaAberto(index: number) {
    horariosFuncionamento[index].aberto = !horariosFuncionamento[index].aberto;
    horariosFuncionamento = [...horariosFuncionamento];
  }

  // Mudar para a próxima tab
  function proximaTab() {
    if (activeTab === 'informacoes') activeTab = 'horarios';
    else if (activeTab === 'horarios') activeTab = 'pagamentos';
    else if (activeTab === 'pagamentos') activeTab = 'fotos';
  }

  // Mudar para a tab anterior
  function tabAnterior() {
    if (activeTab === 'fotos') activeTab = 'pagamentos';
    else if (activeTab === 'pagamentos') activeTab = 'horarios';
    else if (activeTab === 'horarios') activeTab = 'informacoes';
  }

  // Verificar se os campos obrigatórios da tab atual estão preenchidos
  function validarTabAtual(): boolean {
    if (activeTab === 'informacoes') {
      return !!nome && !!endereco && !!telefone && !!email && !!categoria && !!subcategoria;
    }
    return true;
  }

  // Cadastrar novo comércio
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    isSubmitting = true;
    errorMessage = '';
    successMessage = '';

    if (!userId) {
      errorMessage = 'Erro: Usuário não autenticado.';
      isSubmitting = false;
      return;
    }

    if (!nome || !endereco || !telefone || !email || !categoria || !subcategoria) {
      errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      isSubmitting = false;
      return;
    }

    try {
      const token = await pegarTokenUsuario();
      
      console.log('Iniciando cadastro de comércio:', { nome, categoria });
      
      // Garantir que temos um slug válido para diagnóstico
      const slugTeste = gerarSlug(nome);
      
      console.log('Slug gerado no frontend para teste:', slugTeste);
      
      // Criar formulário para envio dos dados incluindo as fotos
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('endereco', endereco);
      formData.append('categoria', categoria);
      formData.append('subcategoria', subcategoria);
      formData.append('telefone', telefone);
      formData.append('whatsapp', whatsapp);
      formData.append('email', email);
      formData.append('facebook', facebook);
      formData.append('instagram', instagram);
      formData.append('plano', plano);
      formData.append('slug', slugTeste); // Incluindo o slug gerado no frontend
      
      // Adicionar métodos de pagamento
      formData.append('metodosPagamento', JSON.stringify(metodosPagamento));
      
      // Adicionar horários de funcionamento
      formData.append('horariosFuncionamento', JSON.stringify(horariosFuncionamento));
      
      // Adicionar fotos
      fotos.forEach(foto => {
        formData.append('fotos', foto);
      });

      console.log('Enviando requisição para o servidor...');
      const response = await fetch('https://api-backend-production-5b22.up.railway.app/cadastrar-comercio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);
      
      // Verificar se o slug foi gerado
      if (data.success && data.comerciante) {
        // Verificar slug tanto na raiz quanto no objeto comerciante
        let slugResposta = data.slug || data.comerciante.slug;
        
        console.log('Slug recebido do servidor:', slugResposta);
        
        if (!slugResposta) {
          console.warn('AVISO: O servidor não retornou um slug para o comércio! Usando o gerado no frontend.');
          
          // Usar o slug que foi gerado e enviado no formData
          const slugLocal = slugTeste;
          console.log('✅ Usando slug anteriormente gerado:', slugLocal);
          
          // Adicionar o slug à resposta
          if (data.comerciante) {
            data.comerciante.slug = slugLocal;
          }
          data.slug = slugLocal;
          
          // Opcional: tentar atualizar no banco de dados via chamada adicional
          try {
            const updateSlugUrl = `${baseUrl}/painel/meu-comercio/atualizar-comercio`;
            console.log('🔄 Tentando atualizar slug no servidor:', updateSlugUrl);
            
            // Usar mesmo token já obtido anteriormente
            fetch(updateSlugUrl, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId,
                slug: slugLocal,
                nome // Incluir nome pois é obrigatório para a atualização
              })
            })
            .then(res => {
              console.log('Resposta da atualização de slug:', res.status);
              return res.json();
            })
            .then(updateData => {
              console.log('Dados da atualização de slug:', updateData);
            })
            .catch(err => console.error('Erro ao atualizar slug:', err));
          } catch (updateError) {
            console.error('Erro ao tentar atualizar slug:', updateError);
          }
        } else {
          console.log('✅ Slug recebido corretamente do servidor');
        }
      }

      if (data.success) {
        successMessage = 'Comércio cadastrado com sucesso!';
        
        // Limpar formulário
        nome = '';
        endereco = '';
        telefone = '';
        whatsapp = '';
        email = '';
        facebook = '';
        instagram = '';
        categoria = '';
        subcategoria = '';
        descricao = '';
        fotos = [];
        fotosPreview = [];
        metodosPagamento = {
          dinheiro: false,
          pix: false,
          cartaoDebito: false,
          cartaoCredito: false,
          boleto: false,
          transferencia: false
        };
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          goto('/painel');
        }, 2000);
      } else {
        errorMessage = data.error || 'Erro ao cadastrar o comércio.';
      }
    } catch (error) {
      console.error('Erro ao cadastrar comércio:', error);
      errorMessage = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="flex justify-center mb-4">
        <div class="bg-purple-600 p-3 rounded-full inline-flex items-center justify-center">
          <Store class="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Cadastre seu Comércio
      </h1>
      <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
        Aumente sua visibilidade e alcance novos clientes cadastrando seu negócio em nossa plataforma.
      </p>
    </div>

    {#if isLoading}
      <div class="flex justify-center items-center py-20">
        <Loader2 class="h-10 w-10 text-purple-600 animate-spin" />
        <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">Verificando cadastro...</span>
      </div>
    {:else if errorMessage && !userId}
      <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-md">
        <div class="flex items-center">
          <AlertCircle class="h-6 w-6 text-red-500 mr-3" />
          <p class="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
        <div class="mt-4 flex justify-center">
          <a href="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Fazer Login
            <ArrowRight class="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    {:else if !isComerciante}
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <!-- Card Header -->
        <div class="bg-purple-600 px-6 py-4">
          <h2 class="text-xl font-semibold text-white flex items-center">
            <Building2 class="h-6 w-6 mr-2" />
            Informações do seu Negócio
          </h2>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button 
              class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm 
                     {activeTab === 'informacoes' 
                       ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
              on:click={() => activeTab = 'informacoes'}
            >
              <Building2 class="mx-auto h-5 w-5 mb-1" />
              <span>Informações</span>
            </button>
            <button 
              class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm 
                     {activeTab === 'horarios' 
                       ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
              on:click={() => activeTab = 'horarios'}
            >
              <Clock class="mx-auto h-5 w-5 mb-1" />
              <span>Horários</span>
            </button>
            <button 
              class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm 
                     {activeTab === 'pagamentos' 
                       ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
              on:click={() => activeTab = 'pagamentos'}
            >
              <CreditCardIcon class="mx-auto h-5 w-5 mb-1" />
              <span>Pagamentos</span>
            </button>
            <button 
              class="w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm 
                     {activeTab === 'fotos' 
                       ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
              on:click={() => activeTab = 'fotos'}
            >
              <Image class="mx-auto h-5 w-5 mb-1" />
              <span>Fotos</span>
            </button>
          </nav>
        </div>

        <!-- Form -->
        <form on:submit={handleSubmit} class="px-6 py-8 space-y-6">
          {#if errorMessage}
            <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
              <div class="flex">
                <AlertCircle class="h-5 w-5 text-red-500 mr-3" />
                <p class="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
            </div>
          {/if}

          {#if successMessage}
            <div class="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-md">
              <div class="flex">
                <CheckCircle class="h-5 w-5 text-green-500 mr-3" />
                <p class="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          {/if}

          <!-- Tab: Informações Básicas -->
          {#if activeTab === 'informacoes'}
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Nome do Comércio -->
            <div class="sm:col-span-6">
              <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Comércio <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nome"
                  type="text"
                  bind:value={nome}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Ex: Mercado São João"
                />
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Um endereço web único (slug) será gerado automaticamente a partir do nome do seu comércio.
              </p>
            </div>

            <!-- Categoria -->
            <div class="sm:col-span-3">
              <label for="categoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <select
                  id="categoria"
                  bind:value={categoria}
                  required
                  class="block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value="" disabled selected>Selecione uma categoria</option>
                  {#each categorias as cat}
                    <option value={cat}>{cat}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Subcategoria -->
            <div class="sm:col-span-3">
              <label for="subcategoria" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subcategoria <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <select
                  id="subcategoria"
                  bind:value={subcategoria}
                  required
                  class="block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value="" disabled selected>Selecione uma subcategoria</option>
                  {#each subcategoriasList as subcat}
                    <option value={subcat}>{subcat}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Telefone -->
            <div class="sm:col-span-3">
              <label for="telefone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefone"
                  type="text"
                  bind:value={telefone}
                  on:input={(event) => formatarTelefone(event, 'telefone')}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="(00) 00000-0000"
                  maxlength="16"
                />
              </div>
            </div>

            <!-- Whatsapp -->
            <div class="sm:col-span-3">
              <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Whatsapp
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="whatsapp"
                  type="text"
                  bind:value={whatsapp}
                  on:input={(event) => formatarTelefone(event, 'whatsapp')}
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="(00) 00000-0000"
                  maxlength="16"
                />
              </div>
            </div>

            <!-- Endereço -->
            <div class="sm:col-span-6">
              <label for="endereco" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereço <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="endereco"
                  type="text"
                  bind:value={endereco}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Rua, número, bairro, cidade - UF"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="sm:col-span-6">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  bind:value={email}
                  required
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <!-- Redes Sociais -->
            <div class="sm:col-span-3">
              <label for="facebook" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Facebook
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Facebook class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="facebook"
                  type="text"
                  bind:value={facebook}
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="URL do Facebook"
                />
              </div>
            </div>

            <!-- Instagram -->
            <div class="sm:col-span-3">
              <label for="instagram" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Instagram
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Instagram class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="instagram"
                  type="text"
                  bind:value={instagram}
                  class="pl-10 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="@seuinstagram"
                />
              </div>
            </div>

            <!-- Descrição -->
            <div class="sm:col-span-6">
              <label for="descricao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição do Comércio
              </label>
              <div class="mt-1">
                <textarea
                  id="descricao"
                  bind:value={descricao}
                  rows="4"
                  class="block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Descreva seu comércio, produtos ou serviços oferecidos..."
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Uma boa descrição ajuda os clientes a encontrarem seu negócio.
              </p>
            </div>

            <!-- Plano (campo oculto para uso interno) -->
            <div class="sm:col-span-6">
              <label for="plano" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Plano de Assinatura
              </label>
              <div class="mt-1">
                {#if plano === 'Premium'}
                  <div class="flex items-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-300 dark:border-purple-700">
                    <CreditCardIcon class="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
                    <div>
                      <span class="block text-sm font-medium text-purple-800 dark:text-purple-300">
                        Premium
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 ml-2">
                          Ativo
                        </span>
                      </span>
                      <span class="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Seu plano Premium oferece prioridade nas listagens e recursos exclusivos.
                      </span>
                    </div>
                  </div>
                {:else if plano === 'Empresarial'}
                  <div class="flex items-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-300 dark:border-indigo-700">
                    <CreditCardIcon class="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                    <div>
                      <span class="block text-sm font-medium text-indigo-800 dark:text-indigo-300">
                        Empresarial
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 ml-2">
                          Ativo
                        </span>
                      </span>
                      <span class="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Seu plano Empresarial inclui todos os recursos e máxima prioridade nas listagens.
                      </span>
                    </div>
                  </div>
                {:else}
                  <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                    <CreditCardIcon class="h-6 w-6 text-gray-500 mr-3 flex-shrink-0" />
                    <div>
                      <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Básico
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 ml-2">
                          Ativo
                        </span>
                      </span>
                      <span class="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Plano básico com funcionalidades essenciais para seu comércio.
                      </span>
                    </div>
                  </div>
                {/if}
                <input type="hidden" id="plano" bind:value={plano} />
              </div>
            </div>
          </div>
          {/if}

          <!-- Tab: Horários de Funcionamento -->
          {#if activeTab === 'horarios'}
          <div class="space-y-6">
            <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-md mb-4">
              <div class="flex">
                <Info class="h-5 w-5 text-blue-500 mr-3" />
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Configure os horários de funcionamento do seu comércio para cada dia da semana. 
                  Desative a opção "Aberto" caso seu estabelecimento não funcione em determinado dia.
                </p>
              </div>
            </div>
            
            <div class="space-y-4">
              {#each horariosFuncionamento as horario, index}
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-700 dark:text-gray-300">{horario.dia}</span>
                    <div class="flex items-center">
                      <span class="mr-2 text-sm text-gray-500 dark:text-gray-400">Fechado</span>
                      <button 
                        type="button"
                        class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 {horario.aberto ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}"
                        on:click={() => toggleDiaAberto(index)}
                      >
                        <span class="sr-only">Toggle {horario.dia}</span>
                        <span
                          class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 {horario.aberto ? 'translate-x-5' : 'translate-x-0'}"
                        ></span>
                      </button>
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">Aberto</span>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 {!horario.aberto ? 'opacity-50' : ''}">
                    <div>
                      <label for="abertura-{index}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Horário de Abertura
                      </label>
                      <input
                        id="abertura-{index}"
                        type="time"
                        bind:value={horario.abertura}
                        disabled={!horario.aberto}
                        class="mt-1 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                    <div>
                      <label for="fechamento-{index}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Horário de Fechamento
                      </label>
                      <input
                        id="fechamento-{index}"
                        type="time"
                        bind:value={horario.fechamento}
                        disabled={!horario.aberto}
                        class="mt-1 block w-full shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          {/if}

          <!-- Tab: Métodos de Pagamento -->
          {#if activeTab === 'pagamentos'}
          <div>
            <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-md mb-6">
              <div class="flex">
                <Info class="h-5 w-5 text-blue-500 mr-3" />
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Selecione todas as formas de pagamento aceitas pelo seu comércio. 
                  Isso ajudará seus clientes a saberem antecipadamente como podem pagar.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Dinheiro -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="dinheiro"
                  type="checkbox"
                  bind:checked={metodosPagamento.dinheiro}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="dinheiro" class="ml-3 flex items-center">
                  <DollarSign class="h-5 w-5 text-green-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">Dinheiro</span>
                </label>
              </div>

              <!-- Pix -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="pix"
                  type="checkbox"
                  bind:checked={metodosPagamento.pix}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="pix" class="ml-3 flex items-center">
                  <QrCode class="h-5 w-5 text-blue-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">PIX</span>
                </label>
              </div>

              <!-- Cartão de Débito -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="cartaoDebito"
                  type="checkbox"
                  bind:checked={metodosPagamento.cartaoDebito}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="cartaoDebito" class="ml-3 flex items-center">
                  <CreditCardIcon class="h-5 w-5 text-indigo-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">Cartão de Débito</span>
                </label>
              </div>

              <!-- Cartão de Crédito -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="cartaoCredito"
                  type="checkbox"
                  bind:checked={metodosPagamento.cartaoCredito}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="cartaoCredito" class="ml-3 flex items-center">
                  <CreditCardIcon class="h-5 w-5 text-purple-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">Cartão de Crédito</span>
                </label>
              </div>

              <!-- Boleto -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="boleto"
                  type="checkbox"
                  bind:checked={metodosPagamento.boleto}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="boleto" class="ml-3 flex items-center">
                  <Receipt class="h-5 w-5 text-yellow-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">Boleto</span>
                </label>
              </div>

              <!-- Transferência -->
              <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
                <input
                  id="transferencia"
                  type="checkbox"
                  bind:checked={metodosPagamento.transferencia}
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="transferencia" class="ml-3 flex items-center">
                  <Building class="h-5 w-5 text-gray-500 mr-2" />
                  <span class="text-gray-700 dark:text-gray-300">Transferência Bancária</span>
                </label>
              </div>
            </div>
          </div>
          {/if}

          <!-- Tab: Fotos -->
          {#if activeTab === 'fotos'}
          <div>
            <div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-md mb-6">
              <div class="flex">
                <Info class="h-5 w-5 text-blue-500 mr-3" />
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Adicione até 5 fotos do seu comércio. A primeira foto será usada como imagem principal.
                  Prefira fotos com boa iluminação e qualidade.
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Upload de fotos -->
              <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <Upload class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 dark:text-gray-300">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Selecionar fotos</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        multiple
                        on:change={handleFileSelect}
                        disabled={fotos.length >= 5 || uploadEmProgresso}
                      />
                    </label>
                    <p class="pl-1">ou arraste e solte</p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG ou GIF até 5MB
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {fotos.length}/5 fotos selecionadas
                  </p>
                </div>
              </div>

              <!-- Preview das fotos -->
              {#if fotosPreview.length > 0}
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {#each fotosPreview as foto, i}
                    <div class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-w-16 aspect-h-9 group">
                      <img src={foto} alt="Preview" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          class="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 focus:outline-none"
                          on:click={() => removerFoto(i)}
                        >
                          <X class="h-4 w-4" />
                        </button>
                      </div>
                      {#if i === 0}
                        <div class="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                          Principal
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}

              {#if uploadEmProgresso}
                <div class="flex items-center justify-center">
                  <Loader2 class="h-6 w-6 text-purple-600 animate-spin mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Processando imagens...</span>
                </div>
              {/if}
            </div>
          </div>
          {/if}

          <!-- Navegação entre abas e botões de ação -->
          <div class="pt-5 flex justify-between">
            <div>
              {#if activeTab !== 'informacoes'}
                <button
                  type="button"
                  on:click={tabAnterior}
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <ArrowRight class="h-4 w-4 mr-2 transform rotate-180" />
                  Voltar
                </button>
              {/if}
            </div>

            <div class="flex">
              <button
                type="button"
                class="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                on:click={() => goto('/')}
              >
                Cancelar
              </button>

              {#if activeTab !== 'fotos'}
                <button
                  type="button"
                  on:click={proximaTab}
                  disabled={!validarTabAtual()}
                  class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight class="ml-2 h-4 w-4" />
                </button>
              {:else}
                <button
                  type="submit"
                  disabled={isSubmitting || uploadEmProgresso}
                  class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {#if isSubmitting}
                    <Loader2 class="h-5 w-5 mr-2 animate-spin" />
                    Processando...
                  {:else}
                    Cadastrar Comércio
                  {/if}
                </button>
              {/if}
            </div>
          </div>
        </form>
      </div>

      <!-- Benefits Section -->
      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <MapPin class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Visibilidade Local</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Seja encontrado por clientes na sua região que estão procurando seus produtos ou serviços.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <ShoppingBag class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aumente suas Vendas</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Alcance novos clientes e aumente suas vendas com uma presença digital eficiente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg sm:col-span-2 lg:col-span-1">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Phone class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Contato Direto</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Facilite o contato direto com seus clientes através de telefone e WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>