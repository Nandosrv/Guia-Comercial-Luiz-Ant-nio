<script lang="ts">
	import Whatsapp from '$lib/images/icon-ws.png';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { setLastPathUrl } from '$lib/utils/cookies';
	import { fade, slide, scale } from 'svelte/transition';
	import SendEmail from '$lib/componets/sendEmail.svelte';

	onMount(() => {
		setLastPathUrl($page.url.pathname);
	});

	const suporteWhatsApp = '16996151725';
	const mensagemSuporte = encodeURIComponent('Olá, preciso de suporte no site. Pode me ajudar?');
	const linkWhatsApp = `https://wa.me/${suporteWhatsApp}?text=${mensagemSuporte}`;

	// FAQ Items
	let faqItems = [
		{
			question: 'Como posso anunciar meu negócio?',
			answer: 'Para anunciar seu negócio, basta criar uma conta e escolher o plano que melhor atenda suas necessidades. Oferecemos diferentes opções de destaque e exposição.'
		},
		{
			question: 'Quanto tempo leva para meu anúncio ser aprovado?',
			answer: 'Normalmente, os anúncios são aprovados em até 24 horas úteis após o envio.'
		},
		{
			question: 'Como posso editar meu anúncio?',
			answer: 'Acesse sua conta, vá até "Meus Anúncios" e clique no botão editar do anúncio desejado.'
		},
		{
			question: 'Quais formas de pagamento são aceitas?',
			answer: 'Aceitamos PIX e boleto bancário.'
		}
	];

	// Tutorial Items
	const tutorials = [
		{
			title: 'Como criar seu anúncio',
			description: 'Aprenda a cadastrar seu negócio em menos de 5 minutos',
			videoUrl: '#',
			duration: '4:30',
			icon: '📝'
		},
		{
			title: 'Configurando seu perfil',
			description: 'Optimize seu perfil para maior visibilidade',
			videoUrl: '#',
			duration: '3:45',
			icon: '⚙️'
		},
		{
			title: 'Gerenciando seus anúncios',
			description: 'Como editar e atualizar suas informações',
			videoUrl: '#',
			duration: '5:15',
			icon: '📊'
		},
		{
			title: 'Recursos premium',
			description: 'Conheça os benefícios do plano premium',
			videoUrl: '#',
			duration: '6:00',
			icon: '⭐'
		}
	];

	// Estado
	let openItem = -1;
	let isTutorialModalOpen = false;
	let isContactModalOpen = false;

	// Funções
	const toggleFaq = (index: number) => {
		openItem = openItem === index ? -1 : index;
	};

	// Formulário de contato
	let contactForm = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	const handleContactSubmit = () => {
		// Implementar lógica de envio
		console.log('Formulário enviado:', contactForm);
		isContactModalOpen = false;
		// Reset form
		contactForm = {
			name: '',
			email: '',
			subject: '',
			message: ''
		};
	};
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
	<!-- Hero Section -->
	<div class="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div class="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
		<div class="relative mx-auto max-w-7xl">
			<div class="text-center" in:fade={{ duration: 1000 }}>
				<h1 class="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
					Central de Ajuda
				</h1>
				<p class="mt-4 text-xl text-gray-600">
					Como podemos ajudar você hoje?
				</p>
			</div>

			<!-- Contact Options -->
			<div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<!-- WhatsApp Support -->
				<div class="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div class="relative">
						<h3 class="text-2xl font-semibold text-gray-900">Suporte via WhatsApp</h3>
						<p class="mt-4 text-gray-600">Atendimento rápido e personalizado para suas dúvidas.</p>
						<a
							href={linkWhatsApp}
							target="_blank"
							class="mt-6 inline-flex items-center space-x-2 rounded-xl bg-green-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-green-600 hover:shadow-lg"
						>
							<img src={Whatsapp} alt="WhatsApp" class="h-5 w-5" />
							<span>Iniciar Conversa</span>
						</a>
					</div>
				</div>

				<!-- Email Support -->
				<div class="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div class="relative">
						<h3 class="text-2xl font-semibold text-gray-900">Email</h3>
						<p class="mt-4 text-gray-600">Para assuntos que necessitam mais detalhes.</p>
						<button
							on:click={() => (isContactModalOpen = true)}
							class="mt-6 inline-flex items-center space-x-2 rounded-xl bg-blue-500 px-6 py-3 text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
						>
							<span>Enviar Email</span>
						<!-- <p>Envie um email para contatar-nos</p> -->
						</button>

					</div>
				</div>

				<!-- Business Hours -->
				<div class="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					<div class="relative">
						<h3 class="text-2xl font-semibold text-gray-900">Horário de Atendimento</h3>
						<p class="mt-4 text-gray-600">Segunda a Sexta</p>
						<p class="text-lg font-medium text-gray-800">08:00 - 18:00</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- FAQ Section -->
	<div class="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl">
			<h2 class="text-center text-4xl font-bold text-gray-900">Perguntas Frequentes</h2>
			<div class="mt-12 space-y-6">
				{#each faqItems as faq, index}
					<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
						<button
							on:click={() => toggleFaq(index)}
							class="flex w-full items-center justify-between p-6 text-left"
						>
							<span class="text-lg font-medium text-gray-900">{faq.question}</span>
							<span class="ml-6 flex-shrink-0">
								<svg
									class="h-6 w-6 transform text-gray-500 transition-transform duration-300 {openItem === index ? 'rotate-180' : ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</span>
						</button>
						{#if openItem === index}
							<div transition:slide={{ duration: 300 }} class="border-t border-gray-100 bg-gray-50 p-6">
								<p class="text-gray-600">{faq.answer}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Additional Help Section -->
	<div class="relative bg-white px-4 py-20 sm:px-6 lg:px-8">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div class="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-50" />
		<div class="relative mx-auto max-w-7xl text-center">
			<h2 class="text-4xl font-bold text-gray-900">Ainda precisa de ajuda?</h2>
			<p class="mt-4 text-xl text-gray-600">
				Nossa equipe está pronta para ajudar você com qualquer dúvida adicional.
			</p>
			<div class="mt-10 flex justify-center space-x-6">
				<button
					on:click={() => (isTutorialModalOpen = true)}
					class="group relative inline-flex items-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-medium text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
				>
					Ver Tutorial
					<svg
						class="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</button>
				<button
					on:click={() => (isContactModalOpen = true)}
					class="relative inline-flex items-center rounded-xl bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-gray-800"
				>
					Contato
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Tutorial Modal -->
{#if isTutorialModalOpen}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
	>
		<div
			transition:scale={{ duration: 200 }}
			class="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
		>
			<!-- Modal Header -->
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-3xl font-bold text-gray-900">Central de Tutoriais</h2>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					on:click={() => (isTutorialModalOpen = false)}
					class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Tutorial Grid -->
			<div class="grid gap-6 sm:grid-cols-2">
				{#each tutorials as tutorial}
					<div class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
						<!-- svelte-ignore element_invalid_self_closing_tag -->
						<div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						<div class="relative">
							<div class="mb-4 text-4xl">{tutorial.icon}</div>
							<h3 class="mb-2 text-xl font-semibold text-gray-900">{tutorial.title}</h3>
							<p class="mb-4 text-gray-600">{tutorial.description}</p>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-500">Duração: {tutorial.duration}</span>
								<a
									href={tutorial.videoUrl}
									class="inline-flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600"
								>
									<svg
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>Assistir</span>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Quick Tips Section -->
			<div class="mt-8 rounded-xl bg-gray-50 p-6">
				<h3 class="mb-4 text-xl font-semibold text-gray-900">Dicas Rápidas</h3>
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="flex items-start space-x-3">
						<span class="text-blue-500">💡</span>
						<p class="text-sm text-gray-600">Mantenha suas informações sempre atualizadas</p>
					</div>
					<div class="flex items-start space-x-3">
						<span class="text-blue-500">💡</span>
						<p class="text-sm text-gray-600">Adicione fotos de qualidade ao seu anúncio</p>
					</div>
					<div class="flex items-start space-x-3">
						<span class="text-blue-500">💡</span>
						<p class="text-sm text-gray-600">Use palavras-chave relevantes na descrição</p>
					</div>
					<div class="flex items-start space-x-3">
						<span class="text-blue-500">💡</span>
						<p class="text-sm text-gray-600">Responda rapidamente às mensagens recebidas</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Contact Modal -->
{#if isContactModalOpen}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
	>
		<div
			transition:scale={{ duration: 200 }}
			class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">Entre em Contato</h2>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					on:click={() => (isContactModalOpen = false)}
					class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<SendEmail />
		</div>
	</div>
{/if}
<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>