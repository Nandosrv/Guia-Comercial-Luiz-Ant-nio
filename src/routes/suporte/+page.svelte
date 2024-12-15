<script lang="ts">
	import Whatsapp from '$lib/images/icon-ws.png';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { setLastPathUrl } from '$lib/utils/cookies.svelte';

	onMount(() => {
		setLastPathUrl($page.url.pathname);
	});

	const suporteWhatsApp = '16996151725'; // Substitua pelo número do WhatsApp
	const mensagemSuporte = encodeURIComponent('Olá, preciso de suporte no site. Pode me ajudar?');

	const linkWhatsApp = `https://wa.me/${suporteWhatsApp}?text=${mensagemSuporte}`;
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-950 to-purple-900"
>
	<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
		<h1 class="mb-4 text-center text-3xl font-bold text-gray-800">Suporte</h1>
		<p class="mb-8 text-center text-gray-600">
			Precisa de ajuda? Estamos aqui! Entre em contato pelo WhatsApp e nossa equipe responderá o
			mais rápido possível.
		</p>
		<div class="flex justify-center">
			<a
				href={linkWhatsApp}
				target="_blank"
				class="inline-flex items-center space-x-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-green-600"
			>
				<img src={Whatsapp} alt="WhatsApp" class="h-6 w-6" />
				<span>Chamar no WhatsApp</span>
			</a>
		</div>
	</div>
</div>
