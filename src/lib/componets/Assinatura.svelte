<script lang="ts">
	import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
	import supabase from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '../../stores/userStore.svelte';
	import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';
	import axios from 'axios';

	// Definindo interface para os dados do QR Code
	interface QRCodeData {
		payment_url: string;
		qr_code: string;
		qr_code_base64: string;
	}

	let loading = false;
	let qrCodeData: QRCodeData | null = null;
	let errorMessage = '';
	let errorDetails = '';
	let tokenInfo = '';
	let mostrarDetalhesErro = false;
	let ultimoPaymentId = '';
	let verificandoPagamento = false;
	let tempoRestante = 120; // 2 minutos em segundos
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let statusPagamento = 'pendente';

	// Verificar parâmetros de URL ao montar o componente
	onMount(() => {
		// Processar parâmetros da URL para verificar o status do pagamento
		const urlParams = new URLSearchParams(window.location.search);
		const status = urlParams.get('status');
		const paymentId = urlParams.get('payment_id');
		
		if (status && paymentId) {
			console.log(`Detectado redirecionamento de pagamento: status=${status}, payment_id=${paymentId}`);
			
			if (status === 'success' || status === 'approved') {
				// Salvar o ID do pagamento e redirecionar para o formulário de comércio
				ultimoPaymentId = paymentId;
				setTimeout(() => {
					alert('Pagamento aprovado! Redirecionando para formulário de comércio.');
					goto('/formulario-comercio');
				}, 500);
			} else if (status === 'pending') {
				// Pagamento pendente, iniciar verificação
				ultimoPaymentId = paymentId;
				iniciarVerificacaoPagamento();
			} else {
				// Falha no pagamento
				setTimeout(() => {
					alert('Houve um problema com o pagamento. Tente novamente ou escolha outra forma de pagamento.');
				}, 500);
			}
		}
		
		// Recuperar pagamento salvo no localStorage
		const pagamentoSalvo = localStorage.getItem('ultimoPagamento');
		if (pagamentoSalvo) {
			try {
				const { id, timestamp } = JSON.parse(pagamentoSalvo);
				const tempoDecorrido = Date.now() - timestamp;
				
				// Se o pagamento foi iniciado há menos de 10 minutos
				if (tempoDecorrido < 10 * 60 * 1000) {
					ultimoPaymentId = id;
					verificarPagamento().then(aprovado => {
						if (aprovado) {
							localStorage.removeItem('ultimoPagamento');
							alert('Pagamento aprovado! Redirecionando para formulário de comércio.');
							goto('/formulario-comercio');
						} else if (tempoDecorrido < 2 * 60 * 1000) {
							// Se ainda estiver dentro do período de 2 minutos, retomar verificação
							iniciarVerificacaoPagamento();
						}
					});
				} else {
					// Limpar pagamentos expirados
					localStorage.removeItem('ultimoPagamento');
				}
			} catch (e) {
				console.error('Erro ao processar pagamento salvo:', e);
				localStorage.removeItem('ultimoPagamento');
			}
		}
		
		// Limpar quando o componente for desmontado
		return () => {
			limparVerificacaoPagamento();
		};
	});

	// Função para testar a conexão com o Mercado Pago
	async function testarConexao() {
		try {
			loading = true;
			console.log('Testando conexão com o Mercado Pago...');
			
			const response = await axios.get('https://api-backend-production-5b22.up.railway.app/mercadopago/test-connection');
			console.log('Teste de conexão:', response.data);
			
			if (response.data.success) {
				alert(`Conexão OK: ${response.data.message}`);
				tokenInfo = `Prefixo do token: ${response.data.token_prefix || 'N/A'}`;
				if (response.data.test_payment_id) {
					ultimoPaymentId = response.data.test_payment_id;
					tokenInfo += `\nID do pagamento de teste: ${ultimoPaymentId}`;
				}
			} else {
				alert(`Aviso: ${response.data.error || 'Resposta inesperada do servidor'}`);
				tokenInfo = 'Falha na validação do token';
			}
		} catch (error) {
			console.error('Erro ao testar conexão:', error);
			let mensagemErro = 'Erro ao testar conexão com o Mercado Pago';
			let detalhes = '';
			
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					mensagemErro = 'Erro de autenticação: Token do Mercado Pago inválido ou expirado';
					detalhes = JSON.stringify(error.response?.data || {}, null, 2);
				} else {
					mensagemErro = `Erro ${error.response?.status || 'desconhecido'}: ${error.response?.data?.error || error.message}`;
					detalhes = JSON.stringify(error.response?.data || {}, null, 2);
				}
			}
			
			errorMessage = mensagemErro;
			errorDetails = detalhes;
			mostrarDetalhesErro = true;
			alert(mensagemErro);
		} finally {
			loading = false;
		}
	}

	// Função para verificar status de um pagamento específico
	async function verificarPagamento(paymentId = ultimoPaymentId): Promise<boolean> {
		try {
			if (!paymentId) {
				console.log('Nenhum ID de pagamento disponível para verificar');
				return false;
			}
			
			statusPagamento = 'verificando';
			console.log(`Verificando status do pagamento ID ${paymentId}...`);
			
			const response = await axios.get(`https://api-backend-production-5b22.up.railway.app/mercadopago/payment/${paymentId}`);
			
			if (response.data.success) {
				const status = response.data.payment.status;
				statusPagamento = status;
				console.log(`Status do pagamento ${paymentId}: ${status}`);
				
				// Se o pagamento foi aprovado, retorna true
				if (status === 'approved') {
					console.log('Pagamento APROVADO! 🎉');
					return true;
				}
			} else {
				statusPagamento = 'erro';
				console.error('Falha ao verificar pagamento: ' + response.data.error);
			}
			return false;
		} catch (error) {
			statusPagamento = 'erro';
			console.error('Erro ao verificar pagamento:', error);
			return false;
		}
	}

	// Função wrapper para usar no evento on:click
	async function handleVerificarPagamento() {
		try {
			loading = true;
			const aprovado = await verificarPagamento();
			if (aprovado) {
				localStorage.removeItem('ultimoPagamento');
				alert(`Pagamento ${ultimoPaymentId} aprovado! Redirecionando...`);
				goto('/formulario-comercio');
			} else {
				alert(`Pagamento ${ultimoPaymentId} - Status: ${statusPagamento}`);
			}
		} catch (error) {
			console.error('Erro ao verificar pagamento:', error);
			alert('Erro ao verificar status do pagamento');
		} finally {
			loading = false;
		}
	}

	// Função para iniciar a verificação temporizada do pagamento
	function iniciarVerificacaoPagamento() {
		if (verificandoPagamento || !ultimoPaymentId) return;
		
		verificandoPagamento = true;
		tempoRestante = 120; // Resetar para 2 minutos
		
		// Salvar o ID do pagamento no localStorage com timestamp
		localStorage.setItem('ultimoPagamento', JSON.stringify({
			id: ultimoPaymentId,
			timestamp: Date.now()
		}));
		
		// Verificar o pagamento a cada 5 segundos (mais frequente)
		intervalId = setInterval(async () => {
			tempoRestante -= 5;
			
			// Tentar verificar o pagamento
			const aprovado = await verificarPagamento();
			
			if (aprovado) {
				// Se aprovado, limpar os intervalos e redirecionar
				limparVerificacaoPagamento();
				// Limpar do localStorage, já que o pagamento foi aprovado
				localStorage.removeItem('ultimoPagamento');
				alert('Pagamento aprovado! Redirecionando para formulário de comércio.');
				// mandar pro banco de dados o id do pagamento
				goto('/formulario-comercio');
			} else if (tempoRestante <= 0) {
				// Se o tempo acabou, limpar os intervalos e redirecionar
				limparVerificacaoPagamento();
				// Não limpar do localStorage, o usuário ainda pode concluir o pagamento depois
				alert('Tempo de espera esgotado. Redirecionando para anúncios.');
				goto('/Anuncios-Promocao');
			}
		}, 5000); // Verificar a cada 5 segundos
		
		// Definir um timeout para encerrar após 2 minutos (120000ms)
		timeoutId = setTimeout(() => {
			if (verificandoPagamento) {
				limparVerificacaoPagamento();
				alert('Tempo de espera esgotado. Redirecionando para anúncios.');
				goto('/Anuncios-Promocao');
			}
		}, 120000);
	}

	// Função para limpar a verificação de pagamento
	function limparVerificacaoPagamento() {
		verificandoPagamento = false;
		
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	}

	const handleAssinatura = async () => {
		errorMessage = '';
		errorDetails = '';
		mostrarDetalhesErro = false;
		
		try {
			if (!userStore.value.userId) {
				alert('Você precisa estar logado para assinar um plano.');
				return;
			}
			
			loading = true;
			console.log('Iniciando processo de pagamento...');
			console.log('Dados do usuário:', {
				userId: userStore.value.userId,
				email: userStore.value.email
			});
			
			const token = await pegarTokenUsuario();
			if (!token) {
				throw new Error('Não foi possível obter o token de autenticação. Por favor, faça login novamente.');
			}
			
			console.log('Token de autenticação obtido');
			
			// Obter URL de redirecionamento
			const currentUrl = window.location.origin;
			const redirectUrl = `${currentUrl}/redirecionamento-pagamento`;
			
			// Dados básicos para o pagamento
			const paymentData = {
				transaction_amount: 1, // 1 real para teste
				payer: {
					email: userStore.value.email || 'teste@teste.com',
					identification: {
						type: "CPF",
						number: "19119119100" // CPF de teste
					},
					first_name: "Test",
					last_name: "User"
				},
				description: 'Assinatura Guia Comercial',
				userId: userStore.value.userId
				// Não incluir back_urls e auto_return pois causam erro no Mercado Pago com PIX
			};
			
			// Usando o endpoint que utiliza o SDK do Mercado Pago
			const endpoint = 'https://api-backend-production-5b22.up.railway.app/mercadopago/pix';
				
			console.log(`Enviando requisição para ${endpoint}:`, paymentData);
			
			const response = await axios.put(
				endpoint,
				paymentData,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					timeout: 20000 // Aumentar timeout para 20 segundos
				}
			);
			
			console.log('Resposta da API:', response.data);
			
			if (response.data.success) {
				// Armazenar dados do QR code para exibir na tela
				qrCodeData = {
					payment_url: response.data.payment_url,
					qr_code: response.data.qr_code,
					qr_code_base64: response.data.qr_code_base64
				};
				
				// Armazenar o ID do pagamento para verificação posterior
				ultimoPaymentId = response.data.payment_id;
				
				
				// Salvar no localStorage com timestamp
				localStorage.setItem('ultimoPagamento', JSON.stringify({
					id: ultimoPaymentId,
					timestamp: Date.now()
				}));
				
				// Iniciar verificação temporizada do pagamento
				iniciarVerificacaoPagamento();

				
				// Opcional: abrir a URL de pagamento em uma nova aba
				window.open(response.data.payment_url, '_blank');
			} else {
				errorMessage = response.data.error || 'Erro ao gerar pagamento. Por favor, tente novamente.';
				if (response.data.details) {
					errorDetails = JSON.stringify(response.data.details, null, 2);
					mostrarDetalhesErro = true;
				}
				alert(errorMessage);
			}
		} catch (error) {
			console.error('Erro ao processar pagamento:', error);
			
			// Extrair mensagem de erro mais detalhada
			if (axios.isAxiosError(error)) {
				console.error('Status:', error.response?.status);
				console.error('Dados:', error.response?.data);
				
				if (error.response?.status === 401) {
					errorMessage = 'Erro de autenticação: Token do Mercado Pago inválido ou expirado. Por favor, contacte o suporte.';
				} else {
					errorMessage = error.response?.data?.error || 
						`Erro ${error.response?.status || 'desconhecido'}: ${error.message}`;
				}
				
				if (error.response?.data) {
					errorDetails = JSON.stringify(error.response.data, null, 2);
					mostrarDetalhesErro = true;
				}
			} else {
				errorMessage = 'Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.';
			}
			
			alert(errorMessage);
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col space-y-4">
	<button 
		on:click={handleAssinatura} 
		class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 px-4 text-center transition-colors"
		disabled={loading}
	>
		{#if loading}
			<span class="inline-block animate-spin mr-2">⟳</span> Processando...
		{:else}
			Assinar Agora
		{/if}
	</button>

	<div class="flex items-center justify-between">
		<div class="space-x-2">
			<button 
				on:click={testarConexao} 
				class="text-sm text-blue-600 hover:underline"
				disabled={loading}
			>
				Testar conexão com Mercado Pago
			</button>
			
			{#if ultimoPaymentId}
				<button 
					on:click={handleVerificarPagamento} 
					class="text-sm text-blue-600 hover:underline"
					disabled={loading}
				>
					Verificar pagamento
				</button>
			{/if}
		</div>
	</div>

	{#if tokenInfo}
		<div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
			<p class="font-medium">Informações do token:</p>
			<p class="whitespace-pre-line">{tokenInfo}</p>
		</div>
	{/if}

	{#if errorMessage}
		<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
			<p class="font-medium">Erro ao processar pagamento:</p>
			<p>{errorMessage}</p>
			
			{#if mostrarDetalhesErro && errorDetails}
				<div class="mt-2">
					<button 
						on:click={() => mostrarDetalhesErro = !mostrarDetalhesErro}
						class="text-xs text-red-600 hover:underline"
					>
						{mostrarDetalhesErro ? 'Ocultar detalhes' : 'Mostrar detalhes'}
					</button>
					
					{#if mostrarDetalhesErro}
						<pre class="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-32">{errorDetails}</pre>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#if qrCodeData}
		<div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
			<h3 class="text-lg font-medium mb-2">Pague com PIX</h3>
			{#if qrCodeData.qr_code_base64}
				<img src={`data:image/png;base64,${qrCodeData.qr_code_base64}`} alt="QR Code PIX" class="mx-auto mb-2" />
			{/if}
			<p class="text-sm text-gray-600 mb-2">Código PIX: {qrCodeData.qr_code || 'Indisponível'}</p>
			<a href={qrCodeData.payment_url} target="_blank" class="text-blue-600 hover:underline text-sm">
				Abrir página de pagamento
			</a>
			
			<div class="mt-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
				<p class="font-medium">⚠️ Importante:</p>
				<ol class="list-decimal mt-2 ml-5 text-left">
					<li>Após efetuar o pagamento pelo QR Code, você será redirecionado automaticamente.</li>
					<li>Se não for redirecionado, volte a esta página para concluir o processo.</li>
					<li>O sistema verificará automaticamente o status do seu pagamento.</li>
				</ol>
			</div>
			
			{#if verificandoPagamento}
				<div class="mt-3 p-2 bg-blue-50 rounded-md">
					<p class="text-sm text-blue-700">
						Aguardando confirmação do pagamento... ({Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')})
					</p>
					<p class="text-xs text-blue-600 mt-1">Status atual: {statusPagamento}</p>
					<div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
						<div class="bg-blue-600 h-2.5 rounded-full" style="width: {(tempoRestante / 120) * 100}%"></div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
