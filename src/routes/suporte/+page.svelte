<script lang="ts">
    import { onMount } from 'svelte';
    import Whatsapp from '$lib/images/icon-ws.png';
	import Breadcrumbs from '$lib/componets/Breadcrumbs.svelte';
    const suporteWhatsApp = "16996151725"; // Substitua pelo número do WhatsApp
    const mensagemSuporte = encodeURIComponent(
      "Olá, preciso de suporte no site. Pode me ajudar?"
    );
  
    const linkWhatsApp = `https://wa.me/${suporteWhatsApp}?text=${mensagemSuporte}`;
  </script>
  <div class="min-h-screen bg-gradient-to-br from-purple-950 to-purple-900 justify-center items-center flex flex-col">

    <div class="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-4">Suporte</h1>
      <p class="text-gray-600 text-center mb-8">
        Precisa de ajuda? Estamos aqui! Entre em contato pelo WhatsApp
        e nossa equipe responderá o mais rápido possível.
      </p>
      <div class="flex justify-center">
        <a
          href={linkWhatsApp}
          target="_blank"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition duration-300"
        >
          <img
            src="{Whatsapp}"
            alt="WhatsApp"
            class="w-6 h-6"
          />
          <span>Chamar no WhatsApp</span>
        </a>
      </div>
    </div>
  </div>
  