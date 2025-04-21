<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';

	let status = 'processando';
	let mensagem = 'Processando seu pagamento...';
	let detalhes = '';
	let contador = 3;
	let intervalId: ReturnType<typeof setInterval> | null = null;

	onMount(async () => {
		// Pegar parâmetros da URL
		const urlParams = new URLSearchParams(window.location.search);
		const statusParam = urlParams.get('status');
		const paymentId = urlParams.get('payment_id');
		
		console.log(`Redirecionamento detectado: status=${statusParam}, payment_id=${paymentId}`);
		
		// Determinar destino baseado no status
		let destino = '/Anuncios-Promocao'; // Padrão para falha
		
		if (statusParam === 'success' || statusParam === 'approved') {
			status = 'aprovado';
			mensagem = 'Pagamento aprovado com sucesso!';
			detalhes = 'Você será redirecionado para o formulário de cadastro do seu comércio.';
			destino = '/formulario-comercio';
			
			// Verificar status exato do pagamento se houver um payment_id
			if (paymentId) {
				try {
					const response = await axios.get(`http://localhost:3000/mercadopago/payment/${paymentId}`);
					if (response.data.success) {
						console.log(`Status do pagamento verificado: ${response.data.payment.status}`);
						// Guardar payment_id no localStorage para uso futuro
						localStorage.setItem('ultimo_pagamento_aprovado', paymentId);
					}
				} catch (error) {
					console.error('Erro ao verificar pagamento:', error);
				}
			}
		} else if (statusParam === 'pending') {
			status = 'pendente';
			mensagem = 'Pagamento pendente';
			detalhes = 'Estamos aguardando a confirmação do seu pagamento. Você será redirecionado para a página de anúncios.';
			destino = '/Anuncios-Promocao';
		} else {
			status = 'falha';
			mensagem = 'Houve um problema com o pagamento';
			detalhes = 'Por favor, tente novamente ou escolha outra forma de pagamento.';
		}
		
		// Iniciar contagem regressiva para redirecionamento
		intervalId = setInterval(() => {
			contador--;
			
			if (contador <= 0) {
				if (intervalId) clearInterval(intervalId);
				goto(destino);
			}
		}, 1000);
		
		// Limpar intervalo ao desmontar
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
	<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
		<div class="text-center">
			{#if status === 'processando'}
				<div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			{:else if status === 'aprovado'}
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
				</div>
			{:else if status === 'pendente'}
				<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
			{:else}
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</div>
			{/if}
			
			<h2 class="text-xl font-semibold mb-2">{mensagem}</h2>
			<p class="text-gray-600 mb-4">{detalhes}</p>
			
			<div class="text-sm text-gray-500">
				Redirecionando em <span class="font-medium">{contador}</span> segundos...
			</div>
		</div>
	</div>
</div> 