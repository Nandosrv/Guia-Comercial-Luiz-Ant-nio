<script lang="ts">
	import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
	import { getAuth } from 'firebase/auth';
	import { Plus, Image, Upload, ExternalLink, Tag, Calendar, Star, Trash, Edit2, AlertCircle, AlertTriangle, CheckCircle2, QrCode, CreditCard } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import RenovacaoAssinatura from '$lib/componets/RenovacaoAssinatura.svelte';

	// svelte-ignore export_let_unused
	export let activeTab;
	let promocoes: any[] = [];
	let novaPromocao = {
		titulo: '',
		descricao: '',
		desconto: '',
		data_inicio: new Date().toISOString().split('T')[0],
		ativa: true,
		imagemUrl: '',
		palavras_chave: '',
		link_externo: ''
	};
	let isAddingPromocao = false;
	let successMessage = '';
	let errorMessage = '';
	let selectedImage: File | null = null;
	let imagePreview: string | null = null;
	let isUploading = false;
	let isEditingPromocao = false;
	let promocaoEmEdicao: any = null;
	
	// Informações do usuário e seu plano
	let usuarioPlano = {
		plano: 'basico',  // Padrão: plano básico
		nome: 'Básico',
		duracao: '7 dias',
		temDestaque: false
	};
	
	// Informações de elegibilidade do usuário
	let elegibilidade = {
		podePublicar: false,
		mensagem: '',
		precisaRenovar: false,
		planoAtual: null as string | null,
		planoBasicoUtilizado: false,
		diasRestantes: 0,
		verificado: false,
		pagamentoPendente: false
	};
	
	// Informações de limite diário
	let limiteDiario = {
		temLimite: false,
		plano: '',
		limiteTotal: 0,
		promocoesHoje: 0,
		limiteDisponivel: 0,
		atingiuLimite: false,
		mensagem: '',
		verificado: false
	};

	// Variáveis para configuração da API
	const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
		? 'https://api-backend-production-5b22.up.railway.app' 
		: 'https://api.seudominio.com';  // Altere para seu domínio de produção

	// Adicionar estado para controlar o modal de renovação
	let mostrarModalRenovacao = false;
	let planoIdParaRenovar = '';
	let mensagemRenovacao = '';
	let isAquisicaoPlano = false;
	
	// Adicionar variável para detalhes do erro
	let errorDetails = '';
	
	onMount(() => {
		verificarTabela();
		fetchUsuarioPlano();
		verificarElegibilidade();
		verificarLimiteDiario();
		fetchPromocoes();
		
		// Verificar elegibilidade e limite a cada 5 minutos
		const intervaloVerificacao = setInterval(async () => {
			await verificarElegibilidade();
			await verificarLimiteDiario();
		}, 5 * 60 * 1000);
		
		// Limpar intervalo quando o componente for desmontado
		return () => {
			clearInterval(intervaloVerificacao);
		};
	});
	
	const auth = getAuth();
	const userId = auth.currentUser?.uid;

	// Função para verificar se a tabela promocoes existe
	async function verificarTabela() {
		try {
			console.log('Verificando tabela promocoes...');
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/verificar-tabela`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			
			if (!response.ok) {
				console.error('Erro ao verificar tabela:', await response.text());
				return;
			}
			
			const data = await response.json();
			console.log('Resposta da verificação da tabela:', data);
			
			if (data.created) {
				console.log('Tabela promocoes foi criada');
			} else {
				console.log('Tabela promocoes já existe');
			}
		} catch (error) {
			console.error('Erro ao verificar tabela:', error);
		}
	}

	// Função para verificar o limite diário de promoções
	async function verificarLimiteDiario() {
		if (!userId) {
			return;
		}

		try {
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/limite-diario`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const dados = await response.json();
				console.log('Dados de limite diário:', dados);
				
				limiteDiario = {
					...dados,
					verificado: true
				};
				
				// Se atingiu o limite, desabilitar o botão de adicionar promoção
				if (dados.temLimite && dados.atingiuLimite) {
					isAddingPromocao = false;
				}
			} else {
				console.error('Erro ao verificar limite diário:', await response.text());
			}
		} catch (error) {
			console.error('Erro ao verificar limite diário:', error);
		}
	}

	// Função para verificar se o usuário pode publicar promoções
	async function verificarElegibilidade() {
		try {
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/verificar-elegibilidade`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Erro ao verificar elegibilidade');
			}

			const data = await response.json();
			console.log('Resposta completa da verificação de elegibilidade:', data);
			
			// Detectar explicitamente status pendente pela mensagem, caso o backend não envie pagamentoPendente
			const statusPendente = 
				data.pagamentoPendente === true || 
				(data.mensagem && data.mensagem.toLowerCase().includes('pendente')) ||
				(data.status === 'pendente');
			
			elegibilidade = {
				verificado: true,
				podePublicar: data.podePublicar,
				mensagem: data.mensagem,
				planoAtual: data.planoAtual,
				diasRestantes: data.diasRestantes || 0,
				precisaRenovar: data.precisaRenovar,
				planoBasicoUtilizado: data.planoBasicoUtilizado,
				pagamentoPendente: statusPendente
			};

			console.log('Elegibilidade processada:', elegibilidade);

			// Se não puder publicar, verificar o motivo
			if (!elegibilidade.podePublicar) {
				errorMessage = elegibilidade.mensagem;
				setTimeout(() => {
					errorMessage = '';
				}, 10000);
			}
		} catch (error) {
			console.error('Erro ao verificar elegibilidade:', error);
			elegibilidade = {
				verificado: true,
				podePublicar: false,
				mensagem: 'Erro ao verificar elegibilidade',
				planoAtual: null,
				diasRestantes: 0,
				precisaRenovar: false,
				planoBasicoUtilizado: false,
				pagamentoPendente: false
			};
		}
	}

	// Função para buscar o plano do usuário
	async function fetchUsuarioPlano() {
		if (!userId) {
			errorMessage = 'Usuário não autenticado.';
			return;
		}

		try {
			const token = await pegarTokenUsuario();
			// Fazer requisição para buscar o plano atual do usuário
			const response = await fetch(`${API_BASE_URL}/painel/promocao/usuario/plano`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const dadosPlano = await response.json();
				
				// Se a API retornar dados do plano, usar essas informações
				if (dadosPlano && dadosPlano.plano) {
					usuarioPlano.plano = dadosPlano.plano.toLowerCase();
					
					// Configurar informações do plano com base no tipo
					if (usuarioPlano.plano === 'premium') {
						usuarioPlano.nome = 'Premium';
						usuarioPlano.duracao = '30 dias';
						usuarioPlano.temDestaque = true;
					} else if (usuarioPlano.plano === 'empresarial') {
						usuarioPlano.nome = 'Empresarial';
						usuarioPlano.duracao = '60 dias';
						usuarioPlano.temDestaque = true;
					} else {
						// Plano básico ou qualquer outro caso
						usuarioPlano.plano = 'basico';
						usuarioPlano.nome = 'Básico';
						usuarioPlano.duracao = '7 dias';
						usuarioPlano.temDestaque = false;
					}
				}
			} else {
				// Se houver erro ao buscar plano, usar padrão básico
				console.warn('Não foi possível obter informações do plano do usuário. Usando plano básico.');
			}
		} catch (error) {
			console.error('Erro ao buscar plano do usuário:', error);
			// Em caso de erro, usar plano básico como fallback
		}
	}

	async function fetchPromocoes() {
		if (!userId) {
			errorMessage = 'Usuário não autenticado.';
			return;
		}

		try {
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Erro na resposta do servidor');
			}

			const data = await response.json();
			
			promocoes = data.map((promocao: any) => ({
				...promocao,
				destaque: promocao.destaque || null
			}));
		} catch (error) {
			console.error('Erro ao buscar promoções:', error);
			errorMessage = 'Erro ao carregar promoções.';
		}
	}
	
	// Função para lidar com a seleção de imagem
	function handleImageSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		
		if (input.files && input.files[0]) {
			selectedImage = input.files[0];
			
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					imagePreview = e.target.result as string;
				}
			};
			reader.readAsDataURL(selectedImage);
		}
	}
	
	// Função para fazer upload da imagem
	async function uploadImagem(): Promise<string | null> {
		if (!selectedImage) return null;
		
		try {
			isUploading = true;
			const token = await pegarTokenUsuario();
			
			const formData = new FormData();
			formData.append('image', selectedImage);
			
			const response = await fetch(`${API_BASE_URL}/upload/imagem-promocao`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
			
			if (!response.ok) {
				console.error('Erro na resposta HTTP:', response.status, response.statusText);
				const errorText = await response.text();
				console.error('Detalhes do erro:', errorText);
				throw new Error(`Erro ao fazer upload da imagem: ${response.status} ${response.statusText}`);
			}
			
			const data = await response.json();
			console.log('Resposta do upload:', data);
			return data.imageUrl;
		} catch (error) {
			console.error('Erro ao fazer upload da imagem:', error);
			throw error;
		} finally {
			isUploading = false;
		}
	}
	
	// Função para excluir uma promoção
	async function excluirPromocao(id: string) {
		if (!confirm('Tem certeza que deseja excluir esta promoção?')) {
			return;
		}

		try {
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || errorData.details || 'Erro ao excluir promoção');
			}

			successMessage = 'Promoção excluída com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);

			// Atualizar a lista de promoções removendo a excluída
			promocoes = promocoes.filter(p => p.id !== id);
		} catch (error) {
			console.error('Erro ao excluir promoção:', error);
			errorMessage = `Erro ao excluir promoção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}

	// Função para iniciar a edição de uma promoção
	function iniciarEdicaoPromocao(promocao: any) {
		promocaoEmEdicao = { ...promocao };
		isEditingPromocao = true;
		isAddingPromocao = true; // Reutiliza o mesmo formulário
		
		// Preencher o formulário com os dados da promoção
		novaPromocao = {
			titulo: promocao.titulo,
			descricao: promocao.descricao,
			desconto: promocao.desconto,
			data_inicio: promocao.data_inicio,
			ativa: promocao.ativa,
			imagemUrl: promocao.imagemUrl,
			palavras_chave: promocao.palavras_chave || '',
			link_externo: promocao.link_externo || ''
		};
		
		// Se houver imagem, mostrar preview
		if (promocao.imagemUrl) {
			imagePreview = promocao.imagemUrl;
		}
		
		// Rolar para o formulário
		setTimeout(() => {
			const form = document.getElementById('promocao-form');
			if (form) form.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}

	// Função para atualizar uma promoção
	async function atualizarPromocao() {
		try {
			const token = await pegarTokenUsuario();
			
			// Se houver uma imagem selecionada, fazer upload primeiro
			if (selectedImage) {
				try {
					isUploading = true;
					console.log('Iniciando upload da nova imagem...');
					const imageUrl = await uploadImagem();
					if (imageUrl) {
						console.log('Imagem enviada com sucesso:', imageUrl);
						novaPromocao.imagemUrl = imageUrl;
					}
				} catch (error) {
					console.error('Erro no upload da imagem:', error);
					errorMessage = 'Erro ao fazer upload da imagem. Tente novamente.';
					return;
				} finally {
					isUploading = false;
				}
			}

			// Preparar dados para envio
			const dadosPromo = {
				titulo: novaPromocao.titulo,
				descricao: novaPromocao.descricao,
				desconto: novaPromocao.desconto,
				data_inicio: novaPromocao.data_inicio,
				ativa: novaPromocao.ativa,
				imagemUrl: novaPromocao.imagemUrl,
				palavras_chave: novaPromocao.palavras_chave || '',
				link_externo: novaPromocao.link_externo || ''
			};

			console.log('Enviando atualização da promoção:', dadosPromo);
			
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes/${promocaoEmEdicao.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(dadosPromo)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || errorData.details || 'Erro ao atualizar promoção');
			}

			const result = await response.json();
			console.log('Promoção atualizada:', result);

			successMessage = 'Promoção atualizada com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);

			// Resetar formulário com a função local
			resetFormulario();
			
			// Atualizar lista de promoções
			fetchPromocoes();
		} catch (error) {
			console.error('Erro ao atualizar promoção:', error);
			errorMessage = `Erro ao atualizar promoção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}
	
	// Função para resetar o formulário
	function resetFormulario() {
		isAddingPromocao = false;
		isEditingPromocao = false;
		promocaoEmEdicao = null;
		selectedImage = null;
		imagePreview = null;
		novaPromocao = {
			titulo: '',
			descricao: '',
			desconto: '',
			data_inicio: new Date().toISOString().split('T')[0],
			ativa: true,
			imagemUrl: '',
			palavras_chave: '',
			link_externo: ''
		};
	}

	// Modificar a função adicionarPromocao para verificar elegibilidade
	async function adicionarPromocao() {
		try {
			// Sempre verificar elegibilidade antes de prosseguir
			await verificarElegibilidade();
			await verificarLimiteDiario();
			
			// Verificar se o pagamento está pendente
			if (elegibilidade.pagamentoPendente) {
				errorMessage = 'Sua assinatura está com pagamento pendente. Por favor, conclua o pagamento para publicar promoções.';
				setTimeout(() => {
					errorMessage = '';
				}, 5000);
				return;
			}
			
			if (!elegibilidade.podePublicar) {
				errorMessage = elegibilidade.mensagem || 'Você não pode publicar promoções no momento. Verifique sua assinatura.';
				setTimeout(() => {
					errorMessage = '';
				}, 5000);
				return;
			}
			
			// Verificar limite diário para plano básico
			if (limiteDiario.temLimite && limiteDiario.atingiuLimite) {
				errorMessage = 'Você atingiu o limite diário de 3 promoções para o plano básico.';
				setTimeout(() => {
					errorMessage = '';
				}, 5000);
				return;
			}
			
			if (isEditingPromocao && promocaoEmEdicao) {
				return atualizarPromocao();
			}
			
			// Restante da função permanece o mesmo
			const token = await pegarTokenUsuario();
			
			// Se houver uma imagem selecionada, fazer upload primeiro
			if (selectedImage) {
				try {
					isUploading = true;
					console.log('Iniciando upload da imagem...');
					const imageUrl = await uploadImagem();
					if (imageUrl) {
						console.log('Imagem enviada com sucesso:', imageUrl);
						novaPromocao.imagemUrl = imageUrl;
					} else {
						console.warn('Upload retornou URL vazia');
					}
				} catch (error) {
					console.error('Erro no upload da imagem:', error);
					errorMessage = 'Erro ao fazer upload da imagem. Tente novamente.';
					return;
				} finally {
					isUploading = false;
				}
			}

			// Preparar dados para envio, garantindo que os nomes dos campos estejam corretos
			const dadosPromo = {
				titulo: novaPromocao.titulo,
				descricao: novaPromocao.descricao,
				desconto: novaPromocao.desconto,
				data_inicio: novaPromocao.data_inicio,
				ativa: novaPromocao.ativa,
				imagemUrl: novaPromocao.imagemUrl,
				palavras_chave: novaPromocao.palavras_chave || '',
				link_externo: novaPromocao.link_externo || '',
				plano: usuarioPlano.plano
			};

			console.log('Enviando dados da promoção:', dadosPromo);
			
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(dadosPromo)
			});

			let responseData;
			try {
				responseData = await response.json();
			} catch (parseError) {
				console.error('Erro ao analisar resposta JSON:', parseError);
				errorMessage = 'Erro ao criar promoção: resposta inválida do servidor';
				setTimeout(() => {
					errorMessage = '';
				}, 8000);
				return;
			}

			if (!response.ok) {
				console.error('Erro na resposta do servidor:', responseData);
				errorMessage = responseData.error || 'Erro ao adicionar promoção';
				
				if (responseData.details) {
					errorDetails = responseData.details;
				} else if (responseData.precisaRenovar) {
					errorDetails = 'Sua assinatura precisa ser renovada.';
				} else if (responseData.precisaAdquirirPlano) {
					errorDetails = 'Você precisa adquirir um plano para continuar publicando.';
				} else {
					errorDetails = 'Tente novamente ou entre em contato com o suporte.';
				}
				
				// Se o erro é sobre plano básico já utilizado ou assinatura expirada
				if (responseData.precisaUpgrade || responseData.precisaRenovar || responseData.precisaAssinatura) {
					await verificarElegibilidade(); // Atualizar o status de elegibilidade
				}
				
				// Se o erro é sobre limite diário
				if (responseData.limiteAtingido) {
					await verificarLimiteDiario(); // Atualizar o status de limite diário
				}
				
				setTimeout(() => {
					errorMessage = '';
					errorDetails = '';
				}, 8000); // Aumentar o tempo para 8 segundos para dar tempo de ler
				return;
			}

			console.log('Promoção adicionada:', responseData);

			successMessage = 'Promoção adicionada com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);

			// Resetar o formulário
			resetFormulario();
			
			// Atualizar limite diário após adicionar promoção
			await verificarLimiteDiario();
			fetchPromocoes();
		} catch (error) {
			console.error('Erro ao adicionar promoção:', error);
			errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao adicionar promoção';
			errorDetails = 'Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.';
			setTimeout(() => {
				errorMessage = '';
				errorDetails = '';
			}, 8000);
		}
	}

	// Função para alternar o status da promoção
	async function alternarStatusPromocao(id: any) {
		const promocao = promocoes.find((p) => p.id === id);
		if (!promocao) return;

		// Inverte o status 'ativa'
		const novoStatus = !promocao.ativa;

		try {
			const token = await pegarTokenUsuario(); // Token de autenticação (se necessário)

			// Fazendo a requisição PUT para atualizar o status da promoção
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ ativa: novoStatus })
			});

			if (!response.ok) {
				throw new Error('Erro ao atualizar status da promoção');
			}

			const result = await response.json();

			// Atualiza a lista de promoções localmente com os dados retornados da API
			promocoes = promocoes.map((p) => {
				if (p.id === id) {
					return { ...result.promocao, destaque: result.destaque };
				}
				return p;
			});

			successMessage = novoStatus 
				? 'Promoção ativada e adicionada aos destaques da semana!' 
				: 'Promoção desativada e removida dos destaques da semana!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error) {
			console.error('Erro ao atualizar status da promoção:', error);
			errorMessage = 'Erro ao atualizar status da promoção.';
		}
	}
	// Função específica para enviar uma promoção para os destaques
	async function enviarParaDestaque(id: string) {
		try {
			console.log("Enviando promoção para destaque. ID:", id);
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes/${id}/destacar`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			const responseData = await response.json();
			console.log("Resposta do servidor:", responseData);

			if (!response.ok) {
				console.error("Erro ao destacar promoção:", responseData);
				throw new Error(responseData.error || responseData.details || 'Erro ao enviar promoção para destaques');
			}

			// Atualizar a lista de promoções localmente
			promocoes = promocoes.map((p) => {
				if (p.id === id) {
					return { 
						...p, 
						ativa: true,  // Sempre ativa quando enviada para destaque
						destaque_id: responseData.destaque?.id || p.destaque_id,
						destaque: responseData.destaque || p.destaque
					};
				}
				return p;
			});

			successMessage = 'Promoção enviada para destaques com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error: unknown) {
			console.error('Erro ao enviar promoção para destaques:', error);
			// Tratamento seguro para erro de tipo unknown
			let mensagemErro = 'Erro ao enviar promoção para destaques.';
			if (error instanceof Error) {
				mensagemErro = error.message || mensagemErro;
			}
			errorMessage = mensagemErro;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}

	// Função específica para remover uma promoção dos destaques
	async function removerDoDestaque(id: string) {
		try {
			console.log("Removendo promoção dos destaques. ID:", id);
			const token = await pegarTokenUsuario();
			const response = await fetch(`${API_BASE_URL}/painel/promocao/promocoes/${id}/remover-destaque`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});

			const responseData = await response.json();
			console.log("Resposta do servidor:", responseData);

			if (!response.ok) {
				console.error("Erro ao remover destaque da promoção:", responseData);
				throw new Error(responseData.error || responseData.details || 'Erro ao remover promoção dos destaques');
			}
			
			// Atualizar a lista de promoções localmente
			promocoes = promocoes.map((p) => {
				if (p.id === id) {
					return { 
						...p,
						destaque: responseData.destaque || null 
					};
				}
				return p;
			});

			successMessage = 'Promoção removida dos destaques com sucesso!';
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		} catch (error: unknown) {
			console.error('Erro ao remover promoção dos destaques:', error);
			// Tratamento seguro para erro de tipo unknown
			let mensagemErro = 'Erro ao remover promoção dos destaques.';
			if (error instanceof Error) {
				mensagemErro = error.message || mensagemErro;
			}
			errorMessage = mensagemErro;
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}

	// Função para abrir o modal de renovação
	function abrirModalRenovacao() {
		if (elegibilidade.planoAtual === 'basico') {
			errorMessage = 'O plano básico gratuito não pode ser renovado. Por favor, adquira um plano premium ou empresarial.';
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
			return;
		}
		
		console.log('Abrindo modal de renovação para o plano:', elegibilidade.planoAtual);
		
		// Buscar ID do plano atual para renovação
		obterIdDoPlanoAtual().then(id => {
			if (id) {
				console.log('ID do plano obtido com sucesso:', id);
				planoIdParaRenovar = id;
				isAquisicaoPlano = false; // Definir como renovação, não aquisição
				mostrarModalRenovacao = true;
			} else {
				console.error('Falha ao obter ID do plano para renovação');
				errorMessage = 'Não foi possível identificar o plano para renovação. Por favor, tente novamente.';
				setTimeout(() => {
					errorMessage = '';
				}, 5000);
			}
		}).catch(error => {
			console.error('Erro ao buscar ID do plano:', error);
			errorMessage = 'Erro ao buscar informações do plano. Por favor, tente novamente.';
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		});
	}
	
	// Função para buscar o ID do plano atual
	async function obterIdDoPlanoAtual() {
		try {
			console.log('Buscando ID do plano atual:', elegibilidade.planoAtual);
			
			const token = await pegarTokenUsuario();
			console.log('Token obtido, buscando planos disponíveis...');
			
			const response = await fetch(`${API_BASE_URL}/painel/planos`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			
			if (!response.ok) {
				console.error('Erro na resposta da API:', response.status, response.statusText);
				throw new Error('Erro ao buscar planos disponíveis');
			}
			
			const planos = await response.json();
			console.log('Planos disponíveis:', planos);
			
			// Encontrar o plano correspondente ao plano atual do usuário
			const planoAtual = planos.find((p: any) => 
				p.nome && p.nome.toLowerCase() === elegibilidade.planoAtual?.toLowerCase()
			);
			
			console.log('Plano encontrado:', planoAtual);
			
			if (!planoAtual || !planoAtual.id) {
				console.error('ID do plano não encontrado para:', elegibilidade.planoAtual);
				
				// Se não encontrar o plano exato, tentar buscar um plano com o mesmo nome
				const planoAlternativo = planos.find((p: any) => 
					p.nome && p.nome.toLowerCase().includes(elegibilidade.planoAtual?.toLowerCase() || '')
				);
				
				if (planoAlternativo && planoAlternativo.id) {
					console.log('Plano alternativo encontrado:', planoAlternativo);
					return planoAlternativo.id;
				}
				
				// Se ainda não encontrar, retornar o primeiro plano que não seja básico
				const primeiroPlanoPago = planos.find((p: any) => 
					p.nome && p.nome.toLowerCase() !== 'basico'
				);
				
				if (primeiroPlanoPago && primeiroPlanoPago.id) {
					console.log('Usando primeiro plano pago como fallback:', primeiroPlanoPago);
					return primeiroPlanoPago.id;
				}
				
				return '';
			}
			
			return planoAtual.id;
		} catch (error) {
			console.error('Erro ao buscar ID do plano:', error);
			return '';
		}
	}
	
	// Função chamada quando a renovação é bem-sucedida
	function onRenovacaoSucesso() {
		mostrarModalRenovacao = false;
		mensagemRenovacao = isAquisicaoPlano 
			? 'Plano Premium adquirido com sucesso!'
			: 'Assinatura renovada com sucesso!';
		
		// Recarregar informações do usuário
		setTimeout(() => {
			verificarElegibilidade();
			verificarLimiteDiario();
			mensagemRenovacao = '';
		}, 2000);
	}
	
	// Função chamada quando ocorre um erro na renovação
	function onRenovacaoErro(mensagem: string) {
		mostrarModalRenovacao = false;
		errorMessage = isAquisicaoPlano
			? `Erro na aquisição do plano: ${mensagem}`
			: `Erro na renovação: ${mensagem}`;
		setTimeout(() => {
			errorMessage = '';
		}, 5000);
	}

	// Função para buscar o ID do plano premium
	async function obterIdPlanoPremium() {
		try {
			const token = await pegarTokenUsuario();
			console.log('Token obtido, buscando planos disponíveis...');
			
			const response = await fetch(`${API_BASE_URL}/painel/planos`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			
			if (!response.ok) {
				console.error('Erro na resposta da API:', response.status, response.statusText);
				throw new Error('Erro ao buscar planos disponíveis');
			}
			
			const planos = await response.json();
			console.log('Planos disponíveis:', planos);
			
			// Encontrar o plano premium
			const planoPremium = planos.find((p: any) => 
				p.nome && p.nome.toLowerCase() === 'premium'
			);
			
			console.log('Plano premium encontrado:', planoPremium);
			
			if (!planoPremium || !planoPremium.id) {
				console.error('ID do plano premium não encontrado');
				
				// Tentar encontrar qualquer plano que não seja básico
				const planoPago = planos.find((p: any) => 
					p.nome && p.nome.toLowerCase() !== 'basico'
				);
				
				if (planoPago && planoPago.id) {
					console.log('Usando plano pago como alternativa:', planoPago);
					return planoPago.id;
				}
				
				return '';
			}
			
			return planoPremium.id;
		} catch (error) {
			console.error('Erro ao buscar ID do plano premium:', error);
			return '';
		}
	}

	// Função para abrir o modal com o plano premium
	async function abrirModalPlanoPremium() {
		console.log('Abrindo modal para adquirir plano premium');
		
		// Buscar ID do plano premium
		const id = await obterIdPlanoPremium();
		if (id) {
			console.log('ID do plano premium obtido com sucesso:', id);
			planoIdParaRenovar = id;
			isAquisicaoPlano = true; // Marcar como aquisição e não renovação
			mostrarModalRenovacao = true;
		} else {
			console.error('Falha ao obter ID do plano premium');
			errorMessage = 'Não foi possível identificar o plano premium. Por favor, tente novamente.';
			setTimeout(() => {
				errorMessage = '';
			}, 5000);
		}
	}
</script>

<div>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Promoções</h1>
		<button
			on:click={() => (isAddingPromocao = !isAddingPromocao)}
			class="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={!elegibilidade.podePublicar || (limiteDiario.verificado && limiteDiario.temLimite && limiteDiario.atingiuLimite) || elegibilidade.pagamentoPendente}
			title={!elegibilidade.podePublicar 
				? 'Você não pode publicar promoções neste momento. Verifique seu plano.' 
				: (limiteDiario.verificado && limiteDiario.temLimite && limiteDiario.atingiuLimite)
					? 'Você atingiu o limite diário de promoções para o plano básico.'
					: elegibilidade.pagamentoPendente
						? 'Sua assinatura está com pagamento pendente. Conclua o pagamento para publicar.'
						: 'Adicionar nova promoção'}
		>
			<Plus class="mr-1 h-5 w-5" />
			Nova Promoção
		</button>
	</div>
	
	<!-- Interface para mostrar status da assinatura -->
	{#if elegibilidade.verificado}
		<div class="mt-4">
			{#if elegibilidade.pagamentoPendente}
				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
					<div class="flex items-start">
						<AlertCircle class="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
						<div>
							<p class="text-sm text-yellow-700">
								Sua assinatura está com pagamento pendente.
							</p>
							<p class="text-sm text-yellow-700 mt-1">
								Por favor, conclua o pagamento para publicar promoções.
							</p>
							<button 
								on:click={abrirModalRenovacao}
								class="mt-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 py-1 px-2 rounded flex items-center"
							>
								<QrCode class="h-4 w-4 mr-1" />
								<span>Ver QR Code para Pagamento</span>
							</button>
						</div>
					</div>
				</div>
			{:else if !elegibilidade.podePublicar}
				<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
					<div class="flex items-start">
						<AlertCircle class="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
						<div>
							<p class="text-sm text-red-700 font-medium">
								{elegibilidade.mensagem}
							</p>
							{#if elegibilidade.diasRestantes === 0}
								<p class="text-sm text-red-700 mt-1">
									Sua assinatura expirou. Renove agora para continuar publicando promoções.
								</p>
							{:else if elegibilidade.diasRestantes < 7}
								<p class="text-sm text-red-700 mt-1">
									Sua assinatura expira em {elegibilidade.diasRestantes} dias. Renove agora para evitar interrupções.
								</p>
							{/if}
							<div class="mt-3">
								<button 
									on:click={abrirModalPlanoPremium}
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
								>
									<QrCode class="h-4 w-4 mr-2" />
									<span>Adquirir Plano Premium</span>
								</button>
								<p class="text-xs text-gray-500 mt-2">
									O plano básico não pode ser renovado. Faça upgrade para ter acesso contínuo.
								</p>
							</div>
						</div>
					</div>
				</div>
			{:else if elegibilidade.planoAtual === 'basico'}
				<div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
					<div class="flex items-start">
						<AlertCircle class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
						<div>
							<p class="text-sm text-blue-700">
								Você está utilizando o plano básico gratuito por 7 dias.
							</p>
							<p class="text-sm text-blue-700 mt-1">
								Para mais recursos, considere fazer upgrade para o plano premium.
							</p>
						</div>
					</div>
				</div>
				
				<!-- Cartão de limite diário para plano básico -->
				{#if limiteDiario.verificado && limiteDiario.temLimite}
					<div class="bg-white dark:bg-gray-800 border rounded-lg p-4 mb-4 shadow-sm">
						<h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Limite diário de promoções</h3>
						
						<div class="flex items-center justify-between mb-1">
							<p class="text-xs text-gray-500 dark:text-gray-400">Promoções publicadas hoje</p>
							<p class="text-xs font-medium text-gray-700 dark:text-gray-300">{limiteDiario.promocoesHoje} de {limiteDiario.limiteTotal}</p>
						</div>
						
						<!-- Barra de progresso -->
						<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3">
							<div class="bg-blue-600 h-2.5 rounded-full" style="width: {(limiteDiario.promocoesHoje / limiteDiario.limiteTotal) * 100}%"></div>
						</div>
						
						{#if limiteDiario.atingiuLimite}
							<div class="flex items-center mt-2 text-yellow-600 dark:text-yellow-500">
								<AlertTriangle class="h-4 w-4 mr-1" />
								<p class="text-xs">Você atingiu o limite diário de promoções.</p>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
								O plano básico permite apenas {limiteDiario.limiteTotal} promoções por dia. 
								Considere fazer 
								<button 
									on:click={abrirModalPlanoPremium} 
									class="text-blue-600 hover:underline dark:text-blue-400"
								>
									upgrade para o plano premium
								</button> 
								para publicar sem limites.
							</p>
						{:else}
							<p class="text-xs text-gray-500 dark:text-gray-400">
								Você ainda pode publicar <span class="font-medium text-blue-600 dark:text-blue-400">{limiteDiario.limiteDisponivel}</span> promoções hoje.
							</p>
						{/if}
					</div>
				{/if}
			{/if}

			{#if elegibilidade.planoAtual && elegibilidade.podePublicar}
				<div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
					<div class="flex items-start">
						<CheckCircle2 class="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
						<div>
							<p class="text-sm text-green-700">
								Seu plano {elegibilidade.planoAtual ? elegibilidade.planoAtual.toUpperCase() : 'Premium'} está ativo.
								{#if elegibilidade.diasRestantes}
									Dias restantes: <span class="font-medium">{elegibilidade.diasRestantes}</span>
								{/if}
							</p>
							
							{#if elegibilidade.planoAtual !== 'basico'}
								<p class="text-xs text-green-700 mt-1">
									Seu plano não possui limite diário de promoções.
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Atualizar o código de botão de renovação de assinatura -->
	{#if elegibilidade.verificado && (!elegibilidade.podePublicar || elegibilidade.diasRestantes < 7)}
		<div class="mt-4">
			{#if elegibilidade.planoBasicoUtilizado || (elegibilidade.planoAtual === 'basico' && !elegibilidade.podePublicar)}
				<!-- Usuário com plano básico expirado ou que já usou plano básico -->
				<button 
					on:click={abrirModalPlanoPremium}
					class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<QrCode class="h-5 w-5 mr-2" />
					<span>Adquirir Plano Premium via QR Code</span>
				</button>
				<p class="text-xs text-gray-500 mt-1 text-center">
					O plano básico não pode ser renovado. Faça upgrade para ter acesso contínuo.
				</p>
			{:else if elegibilidade.planoAtual && elegibilidade.planoAtual !== 'basico'}
				<!-- Usuário com plano premium ou empresarial -->
				<button 
					on:click={abrirModalRenovacao}
					class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<QrCode class="h-5 w-5 mr-2" />
					<span>Renovar Assinatura via QR Code</span>
				</button>
				{#if !elegibilidade.podePublicar}
					<p class="text-xs text-red-500 mt-1 text-center">
						Sua assinatura expirou. Renove para continuar publicando promoções.
					</p>
				{:else if elegibilidade.diasRestantes < 7}
					<p class="text-xs text-yellow-500 mt-1 text-center">
						Sua assinatura expira em breve. Considere renovar para evitar interrupções.
					</p>
				{/if}
			{/if}
		</div>
	{/if}

	{#if mensagemRenovacao}
		<div class="mt-2 p-2 bg-green-100 text-green-800 rounded text-center">
			{mensagemRenovacao}
		</div>
	{/if}

	<!-- Modal de renovação de assinatura -->
	{#if mostrarModalRenovacao}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="relative w-full max-w-md mx-4">
				<!-- Botão de fechar no canto superior direito -->
				<button 
					on:click={() => mostrarModalRenovacao = false}
					class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				
				<!-- Componente de renovação de assinatura -->
				<RenovacaoAssinatura 
					planoId={planoIdParaRenovar}
					onSuccessRenovacao={onRenovacaoSucesso}
					onError={onRenovacaoErro}
					onCancel={() => mostrarModalRenovacao = false}
					isAquisicao={isAquisicaoPlano}
				/>
			</div>
		</div>
	{/if}

	{#if isAddingPromocao}
		<div class="mt-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
			<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Nova Promoção</h3>
			
			<!-- Informação do plano do usuário -->
			<div class="mb-6 mt-2">
				<div class="flex items-center bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-blue-800 dark:text-blue-300">
					<Star class="h-5 w-5 mr-2 {usuarioPlano.plano === 'premium' ? 'text-yellow-500' : usuarioPlano.plano === 'empresarial' ? 'text-purple-500' : 'text-gray-500'}" />
					<div>
						<p class="font-medium">Seu plano: <span class="font-bold">{usuarioPlano.nome}</span></p>
						<p class="text-sm">Suas promoções ficarão ativas por <span class="font-semibold">{usuarioPlano.duracao}</span></p>
						{#if usuarioPlano.temDestaque}
							<p class="text-xs mt-1">Inclui destaque automático na página principal</p>
						{/if}
					</div>
				</div>
			</div>
			
			<form id="promocao-form" on:submit|preventDefault={adicionarPromocao} class="space-y-4">
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label
							for="titulo"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título:</label
						>
						<input
							type="text"
							id="titulo"
							bind:value={novaPromocao.titulo}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							placeholder="Ex: Super Oferta de Verão"
						/>
					</div>
					<div>
						<label
							for="desconto"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Desconto:</label
						>
						<input
							type="text"
							id="desconto"
							bind:value={novaPromocao.desconto}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
							placeholder="Ex: 20% OFF, Compre 1 Leve 2, etc."
						/>
					</div>
				</div>
				
				<div>
					<label
						for="descricao"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição:</label
					>
					<textarea
						id="descricao"
						bind:value={novaPromocao.descricao}
						required
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
						placeholder="Descreva detalhes e condições da sua promoção"
					></textarea>
				</div>
				
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label
							for="dataInicio"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Data de Início:</label
						>
						<div class="relative mt-1 rounded-md shadow-sm">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Calendar class="h-4 w-4 text-gray-400" />
							</div>
							<div class="block w-full rounded-md border-gray-300 pl-10 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
								{new Date(novaPromocao.data_inicio).toLocaleDateString('pt-BR')} (hoje)
							</div>
							<input type="hidden" id="dataInicio" bind:value={novaPromocao.data_inicio} />
						</div>
					</div>
					
					<!-- Campo de Data de Fim (somente exibição) -->
					<div>
						<label
							for="dataFim"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Data de Término:</label
						>
						<div class="relative mt-1 rounded-md shadow-sm">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Calendar class="h-4 w-4 text-gray-400" />
							</div>
							<div class="block w-full rounded-md border-gray-300 pl-10 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
								{#if usuarioPlano.plano === 'basico'}
									{new Date(new Date(novaPromocao.data_inicio).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} (amanhã)
								{:else}
									{new Date(new Date(novaPromocao.data_inicio).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} (7 dias)
								{/if}
							</div>
						</div>
					</div>
				</div>
				
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label
							for="palavrasChave"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Palavras-chave:</label
						>
						<div class="relative mt-1 rounded-md shadow-sm">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Tag class="h-4 w-4 text-gray-400" />
							</div>
							<input
								type="text"
								id="palavrasChave"
								bind:value={novaPromocao.palavras_chave}
								class="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								placeholder="Ex: verão, desconto, roupas"
							/>
						</div>
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Separe as palavras por vírgulas (até 5 palavras)
						</p>
					</div>
					
					<div>
						<label
							for="linkExterno"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Link Externo:</label
						>
						<div class="relative mt-1 rounded-md shadow-sm">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<ExternalLink class="h-4 w-4 text-gray-400" />
							</div>
							<input
								type="url"
								id="linkExterno"
								bind:value={novaPromocao.link_externo}
								class="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
								placeholder="https://..."
							/>
						</div>
						<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Link para mais detalhes ou e-commerce
						</p>
					</div>
				</div>
				
				<!-- Campo de imagem -->
				<div>
					<label
						for="imagem"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagem da Promoção:</label
					>
					<div class="mt-1 flex items-center space-x-4">
						<label class="relative cursor-pointer bg-white rounded-md py-2 px-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
							<span>{selectedImage ? 'Trocar imagem' : 'Selecionar imagem'}</span>
							<input 
								type="file" 
								id="imagem" 
								accept="image/*" 
								on:change={handleImageSelect} 
								class="sr-only" 
							/>
							<Image class="inline-block ml-2 h-4 w-4" />
						</label>
						
						{#if imagePreview}
							<div class="h-16 w-16 overflow-hidden rounded-md relative group">
								<img src={imagePreview} alt="Preview" class="h-full w-full object-cover" />
								<button 
									type="button" 
									class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
									on:click={() => {
										selectedImage = null;
										imagePreview = null;
										novaPromocao.imagemUrl = '';
									}}
								>
									<span class="text-white text-xs">Remover</span>
								</button>
							</div>
						{/if}
					</div>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
						Adicione uma imagem atraente para sua promoção. Recomendado: 800x600px ou maior.
					</p>
					{#if isUploading}
						<p class="mt-1 text-xs text-blue-500">
							Enviando imagem... Por favor, aguarde.
						</p>
					{/if}
				</div>
				
				<div class="flex justify-end space-x-2">
					<button
						type="submit"
						disabled={isUploading}
						class="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isUploading}
							<Upload class="mr-1 h-5 w-5 animate-spin" />
							Enviando...
						{:else if isEditingPromocao}
							Salvar Alterações
						{:else}
							Adicionar Promoção
						{/if}
					</button>
					<button
						type="button"
						on:click={() => {
							isAddingPromocao = false;
							isEditingPromocao = false;
							promocaoEmEdicao = null;
							selectedImage = null;
							imagePreview = null;
							novaPromocao = {
								titulo: '',
								descricao: '',
								desconto: '',
								data_inicio: new Date().toISOString().split('T')[0],
								ativa: true,
								imagemUrl: '',
								palavras_chave: '',
								link_externo: ''
							};
						}}
						class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="mt-6">
		<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Suas Promoções</h3>
		{#if promocoes.length === 0}
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Você ainda não cadastrou nenhuma promoção.
			</p>
		{:else}
			<ul class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each promocoes as promocao}
					<li class="py-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-4">
								{#if promocao.imagemUrl}
									<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
										<img src={promocao.imagemUrl} alt={promocao.titulo} class="h-full w-full object-cover" />
									</div>
								{/if}
								<div>
									<h4 class="text-sm font-medium text-gray-900 dark:text-white">
										{promocao.titulo}
									</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">{promocao.descricao}</p>
									<div class="mt-1 text-xs flex flex-wrap items-center gap-2">
										<span class="font-semibold text-purple-600">{promocao.desconto}</span>
										<span class="text-gray-500">•</span>
										<span class="text-gray-500">
											Plano: {promocao.plano || 'Básico'}
										</span>
										<span class="text-gray-500">•</span>
										<span class="text-gray-500">
											De {new Date(promocao.data_inicio).toLocaleDateString('pt-BR')} até {new Date(promocao.data_fim).toLocaleDateString('pt-BR')}
										</span>
									</div>
									{#if promocao.ativa && promocao.destaque}
										<p class="text-xs text-green-500 mt-1">Ativa e exibida na seção de destaques</p>
									{:else if promocao.ativa}
										<p class="text-xs text-yellow-500 mt-1">Ativa (não está nos destaques)</p>
									{:else}
										<p class="text-xs text-gray-400 mt-1">Inativa</p>
									{/if}
								</div>
							</div>
							<div class="flex space-x-2">
								<!-- Botões de ação -->
								<button
									on:click={() => iniciarEdicaoPromocao(promocao)}
									class="inline-flex items-center rounded-md border border-transparent bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									<Edit2 class="h-4 w-4 mr-1" />
									Editar
								</button>
								
								<button
									on:click={() => excluirPromocao(promocao.id)}
									class="inline-flex items-center rounded-md border border-transparent bg-red-600 hover:bg-red-700 px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								>
									<Trash class="h-4 w-4 mr-1" />
									Excluir
								</button>
								
								<!-- Botão de ativar/desativar -->
								<button
									on:click={() => alternarStatusPromocao(promocao.id)}
									class="inline-flex items-center rounded-md border border-transparent {promocao.ativa ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									{promocao.ativa ? 'Desativar' : 'Ativar'}
								</button>
								
								<!-- Botões de destaque (alternativa para caso o método automático falhe) -->
								{#if !promocao.destaque || (promocao.destaque && !promocao.destaque.ativo)}
									<button
										on:click={() => enviarParaDestaque(promocao.id)}
										class="inline-flex items-center rounded-md border border-transparent bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
									>
										Destacar
									</button>
								{:else}
									<button
										on:click={() => removerDoDestaque(promocao.id)}
										class="inline-flex items-center rounded-md border border-transparent bg-gray-600 hover:bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
									>
										Remover Destaque
									</button>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
		{#if successMessage}
			<p class="text-sm text-green-500">{successMessage}</p>
		{/if}
		{#if errorMessage}
			<div class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
				<div class="flex">
					<div class="flex-shrink-0">
						<AlertCircle class="h-5 w-5 text-red-400" />
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Erro</h3>
						<div class="mt-2 text-sm text-red-700">
							<p>{errorMessage}</p>
							{#if errorDetails}
								<p class="mt-1 text-xs">{errorDetails}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
