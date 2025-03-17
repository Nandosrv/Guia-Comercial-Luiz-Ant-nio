<script lang="ts">
	import pegarTokenUsuario from '$lib/help/pegarTokenUsuario';
	import supabase from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '../../stores/userStore.svelte';
	import { subscribeToAuthState, checkAuthState, logout } from '$lib/services/authService.svelte';
	import axios from 'axios';

	const handleAssinatura = async () => {
		try {
			const token = await pegarTokenUsuario();
			const response = await axios.put(
				'http://localhost:3000/mercadopago/api/createpayment',
				{
					transaction_amount: 1,
					token: 'pix', // token necessário para o Mercado Pago
					payer: {
						email: userStore.value.email || 'teste@teste.com'
					},
					description: 'Assinatura Guia Comercial'
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			);
			
			console.log('Resposta da API:', response.data);
			
			// Se a resposta contiver uma URL de pagamento, redirecionar para ela
			if (response.data.payment_url) {
				window.open(response.data.payment_url, '_blank');
			}
		} catch (error) {
			console.error('Erro ao processar pagamento:', error);
			alert('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
		}
	};
</script>

<button on:click={handleAssinatura} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 px-4 text-center transition-colors">
	Assinar Agora
</button>
