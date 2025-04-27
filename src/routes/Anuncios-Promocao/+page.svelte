<script lang="ts">
	// Importe as imagens (você precisará adicionar estas imagens ao seu projeto)
	import ScrollTo from '$lib/componets/scrollTo.svelte';
	import avatardep1 from '$lib/images/avatardep1.jpg';
	import { onMount, onDestroy } from 'svelte';
	import { userStore } from '../../stores/userStore.svelte';
	import { getCookie } from '$lib/utils/cookies';
	import { onAuthStateChanged } from 'firebase/auth';
	import { persistenciaUser } from '$lib/services/authService.svelte';
	import Assinatura from '$lib/componets/Assinatura.svelte';
	import { getAuth } from 'firebase/auth';

	interface Plan {
		name: string;
		description: string;
		price: string;
		planoId: string;
		valor: number;
		features: string[];
		buttonText: string;
	}

	interface QRCodeData {
		qrCode: string;
		qrCodeBase64: string;
		paymentUrl: string;
	}

	let token = '';
	let auth = getAuth();
	// Sincronizar dados do usuário ao carregar a página
    
    const test = async()=>{
        const user = auth.currentUser;
        token = await user?.getIdToken() || '';
		// token do usuario
        // console.log(token);
        fetch(`https://api-backend-production-5b22.up.railway.app/painel/planos`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            }
        })
        .then(response => response.json())
        .then(data => {
        //    console.log(data);
        })
        .catch(error => {
           console.error('Erro ao buscar planos:', error);
        });
    }
	onMount(() => {
        test();
		// Verificar se há dados de usuário nos cookies
		const userId = getCookie('userId');
		if (userId && !userStore.value.userId) {
			// Carregar dados do cookie para o userStore
			userStore.value = {
				...userStore.value,
				name: getCookie('userName') || '',
				email: getCookie('userEmail') || '',
				photoURL: getCookie('userPhotoURL') || '',
				userId: userId
			};
			console.log('Dados do usuário restaurados dos cookies', userStore.value);
		}

		// Verificar autenticação do Firebase
		const auth = getAuth();
       
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser && !userStore.value.photoURL) {
				console.log('Firebase Auth: usuário logado na página de Anúncios');
				try {
					await persistenciaUser(
						{
							...firebaseUser,
							name: firebaseUser.displayName || '',
							userId: firebaseUser.uid
						} as any,
						false
					);
				} catch (error) {
					console.error('Erro ao persistir usuário do Firebase:', error);
				}
			}
		});

		// Limpar listener ao desmontar
		return () => unsubscribe();
	});

	let loading = false;
	let error: string | null = null;
	let qrCodeData: QRCodeData | null = null;
	let checkPaymentInterval: number;
	let checkAttempts = 0;
	const MAX_CHECK_ATTEMPTS = 60; // 5 minutos (a cada 5 segundos)

	// Constantes e estados
	const plans: Plan[] = [
		{
			name: 'Plano Básico',
			description: 'Ideal para pequenos negócios que desejam testar a plataforma.',
			price: 'Grátis',
			planoId: 'basico',
			valor: 0,
			features: [
				'Anúncio por 7 dias',
				'Exposição na página de Anúncios',
				'Contato via WhatsApp',
				'Sem destaques adicionais',
				'Descrição Simples'
			],
			buttonText: 'Começar Agora'
		},
		{
			name: 'Plano Premium',
			description: 'Para negócios em crescimento',
			price: 'R$ 29,99/mês',
			planoId: 'premium',
			valor: 1,
			features: [
				'Anúncio por 30 dias',
				'Destaque na página principal',
				'Contato completo',
				'Link para redes sociais',
				'Descrição detalhada do serviço',
				'Anuncio personalizado',
				'Contato direto com o programador'
			],
			buttonText: 'Assinar Premium'
		},
		{
			name: 'Plano Empresarial',
			description: 'Máxima visibilidade para empresas que desejam se destacar.',
			price: 'R$ 39,99/mês',
			planoId: 'empresarial',
			valor: 39.99,
			features: [
				'Anúncio por 30 dias',
				'Posição de destaque na página principal',
				'Contato completo e personalizado',
				'Links para redes sociais e site oficial',
				'Descrição detalhada do serviço',
				'Suporte prioritário 24/7',
				'Anuncio personalizado',
				'Contato direto com o programador'
			],
			buttonText: 'Contratar Agora'
		}
	];

	const statistics = [
		{ number: '9000+', label: 'Visualizações Mensais' },
		{ number: '200+', label: 'Empresas Cadastradas' },
		{ number: '98%', label: 'Taxa de Satisfação' }
	];

	const benefits = [
		{
			title: 'Visibilidade Local',
			description:
				'Seu negócio aparecerá para pessoas que estão procurando serviços em Luiz Antônio e região',
			icon: '🎯'
		},
		{
			title: 'Mais Clientes',
			description: 'Aumente sua base de clientes com uma presença digital profissional',
			icon: '👥'
		},
		{
			title: 'Credibilidade',
			description: 'Construa confiança com uma presença oficial no principal guia da cidade',
			icon: '🏆'
		}
	];

	const testimonials = [
		{
			name: 'João Silva',
			business: 'Restaurante Sabor & Cia',
			text: 'Desde que anunciamos no Guia Comercial, nosso movimento aumentou em 40%. Os clientes sempre mencionam que nos encontraram através da plataforma. O investimento valeu muito a pena!',
			image: '/avatars/joao.jpg', // Adicione as imagens depois
			rating: 5,
			plan: 'Premium',
			time: 'Cliente há 8 meses'
		},
		{
			name: 'Maria Oliveira',
			business: 'Boutique Maria Bonita',
			text: 'A facilidade de anúnciar e o retorno que tenho é impressionante. Já recomendei para vários outros comerciantes. O suporte é excelente e sempre está disponível quando preciso.',
			image: avatardep1,
			rating: 5,
			plan: 'Empresarial',
			time: 'Cliente há 1 ano'
		},
		{
			name: 'Carlos Santos',
			business: 'Auto Peças Santos',
			text: 'Começamos com o plano básico e logo fizemos upgrade para o premium. A visibilidade que temos agora é excepcional. Nossa loja é facilmente encontrada por novos clientes.',
			image: '/avatars/carlos.jpg',
			rating: 5,
			plan: 'Premium',
			time: 'Cliente há 6 meses'
		},
		{
			name: 'Ana Beatriz',
			business: 'Clínica de Estética Bella',
			text: 'O que mais gosto é a facilidade de atualizar as promoções e novidades. Minhas clientes sempre estão por dentro das novidades através do guia comercial.',
			image: '/avatars/ana.jpg',
			rating: 5,
			plan: 'Empresarial',
			time: 'Cliente há 3 meses'
		}
	];

	function generateStars(rating: number) {
		return '⭐'.repeat(rating);
	}
	const faqs = [
		{
			question: 'Por que devo mandar mensagem no WhatsApp?',
			answer:
				'Assim que você escolher qual plano você deseja, será redirecionado para o WhatsApp para passar detalhes do seu anúncio.'
		},
		{
			question: 'Como funciona o período de anúncio?',
			answer:
				'Os anúncios têm duração conforme o plano que você escolher. Por exemplo, o plano empresarial tem duração de 60 dias, enquanto o plano premium tem duração de 30 dias.'
		},
		{
			question: 'Posso alterar meu plano depois?',
			answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.'
		},
		{
			question: 'Como faço para adicionar fotos ao meu anúncio?',
			answer:
				'Após a contratação, entre em contato com o programador para adicionar fotos ao seu anúncio.'
		},
		{
			question: 'Como entro em contato com o programador?',
			answer:
				'Após escolher o plano, você receberá um link para entrar em contato com o programador. O link é o mesmo para todos os planos.'
		},
		{
			question: 'Por que eu preciso entrar em contato com o programador?',
			answer: 'Para fazer alterações no seu anúncio, como adicionar fotos, alterar o texto, etc.'
		},
		{
			question: 'Quais os métodos de pagamento disponíveis?',
			answer:
				'Atualmente, aceitamos pagamentos via Pix. Assim que o pagamento for confirmado, seu anúncio será ativado.'
		},
		{
			question: 'Quanto tempo leva para o anúncio ser ativado?',
			answer:
				'O anúncio é ativado manualmente após a confirmação do pagamento. Normalmente, leva menos de 24 horas.'
		},
		{
			question: 'Como posso ver o desempenho do meu anúncio?',
			answer:
				'Você pode solicitar um relatório do desempenho do seu anúncio diretamente com o programador.'
		},
		{
			question: 'O que acontece se meu anúncio expirar?',
			answer:
				'Se o anúncio expirar, ele será removido do site. Para mantê-lo ativo, você pode renovar antes da data de expiração.'
		},
		{
			question: 'Posso cancelar meu anúncio antes do término?',
			answer:
				'Sim, você pode cancelar seu anúncio a qualquer momento, mas não haverá reembolso proporcional ao período não utilizado.'
		}
	];

	// Estados
	//   let showContactForm = true; // This is causing the modal to show on load
	let showContactForm = false; // Alterar conforme o controle do seu modal
	let selectedPlan = 'Plano Empresarial'; // Altere isso conforme o plano selecionado
	let formData = {
		name: '',
		email: '',
		phone: '',
		message: ''
	};

	function submitForm() {
		// Criar o link do WhatsApp com os dados do formulário e o plano selecionado
		const whatsappMessage = `
            Nome: ${formData.name}
            Email: ${formData.email}
            Telefone: ${formData.phone}
            Mensagem: ${formData.message || 'Sem mensagem'}
            Plano Selecionado: ${selectedPlan}
        `;
		const encodedMessage = encodeURIComponent(whatsappMessage);
		const whatsappLink = `https://wa.me/5516996151725?text=${encodedMessage}`;

		// Redireciona para o WhatsApp com a mensagem
		window.open(whatsappLink, '_blank');

		// Fechar o modal após enviar
		showContactForm = false;
	}

	// Funções
	function handleContact(planName: string) {
		selectedPlan = planName;
		showContactForm = true;
	}

	// function submitForm() {
	//     console.log('Formulário enviado:', { ...formData, plano: selectedPlan });
	//     alert('Obrigado pelo interesse! Entraremos em contato em breve.');
	//     showContactForm = false;
	//     formData = {
	//         name: '',
	//         email: '',
	//         phone: '',
	//         message: ''
	//     };
	// }
	let showConstructionModal = false;

	async function checkPaymentStatus(paymentId: string) {
		try {
			checkAttempts++;
			console.log(`Verificando status do pagamento (tentativa ${checkAttempts}/${MAX_CHECK_ATTEMPTS})...`);
			
			const user = auth.currentUser;
			if (!user) return;

			const token = await user.getIdToken();
			const response = await fetch(`https://api-backend-production-5b22.up.railway.app/mercadopago/payment/${paymentId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Erro ao verificar status do pagamento');
			}

			const data = await response.json();
			console.log('Status do pagamento:', data);

			if (data.payment?.status === 'approved') {
				// Limpar o intervalo
				if (checkPaymentInterval) {
					clearInterval(checkPaymentInterval);
				}
				
				// Fechar modal do QR Code
				qrCodeData = null;
				
				// Atualizar status da assinatura no banco de dados
				try {
					const updateResponse = await fetch('https://api-backend-production-5b22.up.railway.app/mercadopago/test-webhook', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({ payment_id: paymentId })
					});
					
					if (updateResponse.ok) {
						console.log('Status da assinatura atualizado com sucesso');
					} else {
						console.error('Falha ao atualizar status da assinatura');
					}
				} catch (updateErr) {
					console.error('Erro ao atualizar status da assinatura:', updateErr);
				}
				
				// Redirecionar para o painel
				window.location.href = '/painel';
			} else if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
				// Parar de verificar após o número máximo de tentativas
				if (checkPaymentInterval) {
					clearInterval(checkPaymentInterval);
				}
				console.log('Número máximo de tentativas alcançado. Parando verificação automática.');
				error = 'Tempo limite de verificação excedido. Por favor, verifique sua assinatura na área do cliente.';
			}
		} catch (err) {
			console.error('Erro ao verificar status:', err);
		}
	}

	async function handleAssinatura(plan: Plan): Promise<void> {
		try {
			loading = true;
			error = null;
			
			if (!auth.currentUser) {
				error = 'Você precisa estar logado para assinar um plano';
				return;
			}

			const user = auth.currentUser;
			const token = await user.getIdToken();

			// Se for plano básico, criar assinatura gratuita primeiro
			if (plan.planoId === 'basico') {
				try {
					const response = await fetch('https://api-backend-production-5b22.up.railway.app/mercadopago/pix', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({
							plano: 'basico',
							userId: user.uid,
							transaction_amount: 0,
							description: 'Plano Básico - Guia Comercial',
							payer: {
								email: user.email || '',
								first_name: user.displayName?.split(' ')[0] || 'Cliente',
								last_name: user.displayName?.split(' ').slice(1).join(' ') || 'Guia Comercial'
							}
						})
					});

					const data = await response.json();
					
					if (data.success) {
						// Se a assinatura foi criada com sucesso, redirecionar para o formulário
						window.location.href = '/formulario-comercio';
						return;
					} else {
						error = data.error || 'Erro ao criar assinatura gratuita';
						loading = false;
						return;
					}
				} catch (err) {
					console.error('Erro ao criar assinatura gratuita:', err);
					error = 'Erro ao criar assinatura gratuita. Tente novamente.';
					loading = false;
					return;
				}
			}

			// Preparar dados do pagamento para planos pagos
			const paymentData = {
				transaction_amount: Math.max(0.01, plan.valor),
				description: `Assinatura ${plan.name}`,
				plano: plan.planoId,
				userId: user.uid,
				payer: {
					email: user.email || '',
					first_name: user.displayName?.split(' ')[0] || 'Cliente',
					last_name: user.displayName?.split(' ').slice(1).join(' ') || 'Guia Comercial',
					identification: {
						type: 'CPF',
						number: '19119119100'
					}
				}
			};

			console.log('Enviando dados:', JSON.stringify(paymentData, null, 2));

			const response = await fetch('https://api-backend-production-5b22.up.railway.app/mercadopago/pix', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(paymentData)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Erro na resposta:', {
					status: response.status,
					statusText: response.statusText,
					errorText
				});
				throw new Error(`Erro ao processar pagamento: ${errorText}`);
			}

			const data = await response.json();
			console.log('Resposta do servidor:', data);

			if (!data.success) {
				throw new Error(data.error || 'Erro ao processar pagamento');
			}

			if (plan.planoId === 'basico') {
				window.location.href = '/formulario-comercio';
			} else {
				qrCodeData = {
					qrCode: data.qr_code,
					qrCodeBase64: data.qr_code_base64,
					paymentUrl: data.payment_url
				};

				// Iniciar verificação periódica do status do pagamento
				if (checkPaymentInterval) {
					clearInterval(checkPaymentInterval);
				}
				checkAttempts = 0; // Resetar contador de tentativas
				checkPaymentInterval = window.setInterval(() => checkPaymentStatus(data.payment_id), 5000);
			}
		} catch (err) {
			console.error('Erro ao processar assinatura:', err);
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Erro desconhecido ao processar assinatura';
			}
		} finally {
			loading = false;
		}
	}

	// Limpar o intervalo quando o componente for destruído
	onDestroy(() => {
		if (checkPaymentInterval) {
			clearInterval(checkPaymentInterval);
			checkPaymentInterval = 0;
		}
	});
</script>

<!-- <button class="bg-red-800 w-full h-full">
	<a href="/Anuncios-Promocao/premium">
		test
	</a> -->
<!-- </button> -->
<div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
	<ScrollTo />
	<!-- Hero Section -->
	<div class="relative bg-blue-900 text-white">
		<div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
		<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="mb-6 text-4xl font-bold md:text-6xl">Impulsione Seu Negócio em Luiz Antônio</h1>
				<p class="mb-8 text-xl text-blue-100 md:text-2xl">
					Conecte-se com milhares de clientes potenciais em nossa plataforma
				</p>
				<a
					href="#plans"
					class="inline-block rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-900 transition-colors hover:bg-blue-50"
				>
					Ver Planos
				</a>
			</div>
		</div>
	</div>

	<!-- Planos -->
	<div id="plans" class="bg-white py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-4 text-center text-3xl font-bold">Escolha o Melhor Plano para Seu Negócio</h2>
			<p class="mx-auto mb-12 max-w-2xl text-center text-gray-600">
				Temos opções para todos os tamanhos de negócio. Escolha o plano que melhor atende suas
				necessidades.
			</p>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each plans as plan}
					<div
						class="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-transform hover:scale-105"
					>
						<div class="flex-1">
							<h3 class="text-xl font-semibold text-gray-900">{plan.name}</h3>
							<p class="mt-4 flex items-baseline text-gray-900">
								<span class="text-3xl font-extrabold tracking-tight">{plan.price}</span>
							</p>
							<p class="mt-6 text-gray-500">{plan.description}</p>

							<ul class="mt-6 space-y-4">
								{#each plan.features as feature}
									<li class="flex items-start">
										<div class="flex-shrink-0">
											<svg
												class="h-6 w-6 text-green-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<p class="ml-3 text-base text-gray-500">{feature}</p>
									</li>
								{/each}
							</ul>
						</div>

						<button 
							on:click={() => handleAssinatura(plan)}
							class="mt-8 block w-full rounded-md bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
							disabled={loading}
						>
							{plan.buttonText}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Estatísticas -->
	<div class="bg-gray-50 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
				{#each statistics as stat}
					<div class="p-6">
						<p class="text-4xl font-bold text-blue-600">{stat.number}</p>
						<p class="mt-2 text-gray-600">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Benefícios -->
	<div class="bg-white py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-12 text-center text-3xl font-bold">Por Que Anunciar Conosco?</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each benefits as benefit}
					<div class="rounded-lg bg-gray-50 p-8 text-center shadow-sm">
						<div class="mb-4 text-4xl">{benefit.icon}</div>
						<h3 class="mb-4 text-xl font-semibold">{benefit.title}</h3>
						<p class="text-gray-600">{benefit.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Modal de Contato -->
	{#if showContactForm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div class="w-full max-w-md rounded-lg bg-white p-8">
				<h2 class="mb-4 text-2xl font-bold">Solicitar {selectedPlan}</h2>
				<form on:submit|preventDefault={submitForm} class="space-y-4">
					<div>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700">Nome</label>
						<input
							type="text"
							bind:value={formData.name}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							bind:value={formData.email}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700">Telefone</label>
						<input
							type="tel"
							bind:value={formData.phone}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="block text-sm font-medium text-gray-700">Mensagem (opcional)</label>
						<textarea
							bind:value={formData.message}
							rows="3"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						></textarea>
					</div>
					<div class="flex justify-end space-x-3">
						<button
							type="button"
							on:click={() => (showContactForm = false)}
							class="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Enviar
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Seção de Depoimentos Aprimorada -->
	<div class="bg-gradient-to-b from-white to-gray-50 py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-4xl font-bold">Histórias de Sucesso</h2>
				<p class="mx-auto max-w-2xl text-xl text-gray-600">
					Veja o que nossos clientes têm a dizer sobre sua experiência com o Guia Comercial
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				{#each testimonials as testimonial}
					<div
						class="relative overflow-hidden rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
					>
						<!-- Marca d'água decorativa -->
						<div
							class="absolute right-0 top-0 -translate-y-4 translate-x-4 transform text-9xl font-bold text-gray-100 opacity-10"
						>
							"
						</div>

						<!-- Cabeçalho do depoimento -->
						<div class="mb-6 flex items-center">
							<div
								class="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-bold text-blue-600"
							>
								{#if testimonial.image}
									<img
										src={testimonial.image}
										alt={testimonial.name}
										class="h-full w-full object-cover"
									/>
								{:else}
									{testimonial.name[0]}
								{/if}
							</div>
							<div class="ml-4 flex-1">
								<h3 class="text-lg font-bold">{testimonial.name}</h3>
								<p class="font-medium text-blue-600">{testimonial.business}</p>
								<div class="mt-1 flex items-center gap-2">
									<span class="text-sm">{generateStars(testimonial.rating)}</span>
								</div>
							</div>
						</div>

						<!-- Texto do depoimento -->
						<blockquote class="relative mb-6 text-gray-700">
							<svg
								class="absolute -left-2 -top-4 h-8 w-8 text-blue-100"
								fill="currentColor"
								viewBox="0 0 32 32"
							>
								<path
									d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"
								/>
							</svg>
							<p class="pl-6 italic">"{testimonial.text}"</p>
						</blockquote>

						<!-- Rodapé do depoimento -->
						<div class="flex items-center justify-between border-t pt-4 text-sm text-gray-500">
							<span>Plano {testimonial.plan}</span>
							<span>{testimonial.time}</span>
						</div>
					</div>
				{/each}
			</div>

			<!-- CTA após os depoimentos -->
			<div class="mt-16 text-center">
				<p class="mb-6 text-xl text-gray-600">
					Junte-se a centenas de empresas que já estão crescendo com o Guia Comercial
				</p>
				<a
					href="https://wa.me/5516996151725?text=Quero%20meu%20Comércio%20no%20site"
					target="_blank"
					class="inline-block rounded-full bg-blue-600 px-8 py-4 font-bold text-white transition-colors hover:bg-blue-700"
				>
					Começar Agora
				</a>
			</div>
		</div>
	</div>
	<!-- aqui vai o modal -->
	{#if showConstructionModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div class="w-full max-w-md rounded-lg bg-white p-8">
				<h2 class="mb-4 text-2xl font-bold">Página em Construção</h2>
				<p class="mb-6 text-gray-600">
					Esta funcionalidade está sendo desenvolvida. Por enquanto, entre em contato via WhatsApp
					para anunciar seu negócio.
				</p>
				<div class="flex justify-end space-x-3">
					<button
						on:click={() => (showConstructionModal = false)}
						class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
					>
						Fechar
					</button>
					<a
						href="https://wa.me/5516996151725?text=Olá,%20gostaria%20de%20anunciar%20meu%20negócio%20no%20Guia%20Comercial"
						target="_blank"
						class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
					>
						Contatar via WhatsApp
					</a>
				</div>
			</div>
		</div>
	{/if}
	<!-- Destaque Numérico -->
	<div class="bg-blue-900 py-16 text-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
				<div class="p-6">
					<p class="mb-2 text-5xl font-bold text-yellow-400">98%</p>
					<p class="text-xl">Taxa de Satisfação</p>
				</div>
				<div class="p-6">
					<p class="mb-2 text-5xl font-bold text-yellow-400">+200</p>
					<p class="text-xl">Empresas Anunciantes</p>
				</div>
				<div class="p-6">
					<p class="mb-2 text-5xl font-bold text-yellow-400">+10mil</p>
					<p class="text-xl">Visualizações Mensais</p>
				</div>
			</div>
		</div>
	</div>
	<!-- FAQ -->
	<div class="bg-gray-50 py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 class="mb-12 text-center text-4xl font-extrabold text-gray-800">Perguntas Frequentes</h2>
			<div class="mx-auto max-w-3xl space-y-8">
				{#each faqs as faq}
					<div
						class="transform rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105"
					>
						<h3 class="text-xl font-semibold text-gray-900">
							{faq.question}
						</h3>
						<p class="mt-4 leading-relaxed text-gray-700">
							{faq.answer}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Modal de QR Code -->
	{#if qrCodeData}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div class="w-full max-w-md rounded-lg bg-white p-8">
				<h2 class="mb-4 text-2xl font-bold">Pagamento via PIX</h2>
				<div class="mb-4 text-center">
					<img src={`data:image/png;base64,${qrCodeData?.qrCodeBase64}`} alt="QR Code" class="mx-auto" />
				</div>
				<p class="mb-4 text-center">
					Escaneie o QR Code acima com seu aplicativo bancário para realizar o pagamento
				</p>
				<div class="mb-4">
					<p class="mb-2 font-semibold">Código PIX:</p>
					<div class="relative">
						<input
							type="text"
							value={qrCodeData?.qrCode}
							readonly
							class="w-full rounded-md border p-2 pr-20"
						/>
						<button
							on:click={() => qrCodeData && navigator.clipboard.writeText(qrCodeData.qrCode)}
							class="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
						>
							Copiar
						</button>
					</div>
				</div>
				<div class="flex justify-end space-x-3">
					<button
						on:click={() => (qrCodeData = null)}
						class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
					>
						Fechar
					</button>
					<a
						href={qrCodeData.paymentUrl}
						target="_blank"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Abrir no navegador
					</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- Mensagem de erro -->
	{#if error}
		<div class="fixed inset-x-0 top-4 z-50 mx-auto max-w-md">
			<div class="rounded-lg bg-red-100 p-4 text-red-700">
				<p>{error}</p>
				<button
					on:click={() => (error = null)}
					class="absolute right-2 top-2 text-red-500 hover:text-red-700"
				>
					✕
				</button>
			</div>
		</div>
	{/if}

	<!-- Loading -->
	{#if loading}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="rounded-lg bg-white p-8">
				<div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
			</div>
		</div>
	{/if}
</div>
