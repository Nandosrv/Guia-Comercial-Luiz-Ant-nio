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

	// Função para testar a conexão com o Mercado Pago
	async function testarConexao() {
		try {
			loading = true;
			console.log('Testando conexão com o Mercado Pago...');
			
			const response = await axios.get('http://localhost:3000/mercadopago/test-connection');
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
	async function verificarPagamento() {
		try {
			if (!ultimoPaymentId) {
				alert('Nenhum ID de pagamento disponível para verificar');
				return;
			}
			
			loading = true;
			const response = await axios.get(`http://localhost:3000/mercadopago/payment/${ultimoPaymentId}`);
			
			if (response.data.success) {
				alert(`Status do pagamento ${ultimoPaymentId}: ${response.data.payment.status}`);
			} else {
				alert('Falha ao verificar pagamento: ' + response.data.error);
			}
		} catch (error) {
			console.error('Erro ao verificar pagamento:', error);
			alert('Erro ao verificar status do pagamento');
		} finally {
			loading = false;
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
			};
			
			// Usando o endpoint que utiliza o SDK do Mercado Pago
			const endpoint = 'http://localhost:3000/mercadopago/pix';
				
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
					on:click={verificarPagamento} 
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
		</div>
	{/if}
</div>
