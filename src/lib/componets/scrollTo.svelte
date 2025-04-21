<script>
  // Função para scroll para o topo
  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<div class="fixed bottom-20 md:bottom-5 right-5 z-50 flex flex-col space-y-2">
  <!-- Botão principal de rolar para o topo -->
  <button
      class="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-md hover:scale-105 hover:from-purple-600 hover:to-blue-600 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
      on:click={scrollToTop}
      aria-label="Rolar para o topo"
      title="Rolar para o topo"
  >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
          focusable="false"
      >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
  </button>
</div>
