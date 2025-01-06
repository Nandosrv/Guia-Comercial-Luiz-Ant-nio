<script lang="ts">
  import { onMount } from 'svelte';

  let currentYear = new Date().getFullYear();
  let statsVisible = false;
  let stats = {
    empresasCadastradas: 0,
    clientesAtendidos: 0,
    cidadesAtendidas: 0
  };

  type StatsTargets = {
    empresasCadastradas: number;
    clientesAtendidos: number;
    cidadesAtendidas: number;
  };

  function animateNumbers(targets: StatsTargets): void {
    const duration = 2000;
    const startTime = performance.now();

    function updateStats(time: number): void {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      stats.empresasCadastradas = Math.ceil(targets.empresasCadastradas * progress);
      stats.clientesAtendidos = Math.ceil(targets.clientesAtendidos * progress);
      stats.cidadesAtendidas = Math.ceil(targets.cidadesAtendidas * progress);

      if (progress < 1) {
        requestAnimationFrame(updateStats);
      }
    }

    requestAnimationFrame(updateStats);
  }

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible) {
          statsVisible = true;
          animateNumbers({ 
            empresasCadastradas: 98, 
            clientesAtendidos: 12000,
            cidadesAtendidas: 6730 
          });
        }
      });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
  });
</script>

<div class="min-h-screen bg-gray-50 text-gray-800">
  <header class="relative text-center py-16 bg-cover bg-center bg-gray-800 text-white" style="background-image: url('/cidade-background.jpg');">
    <h1 class="text-4xl font-bold">Quem Somos</h1>
    <p class="mt-4 text-lg opacity-80">Conectando negócios e pessoas em Luiz Antônio desde {currentYear - 0}</p>
  </header>

  <main class="container mx-auto px-6 py-12">
    <section class="grid gap-8 md:grid-cols-3">
      <article class="card bg-white shadow-md p-6 rounded-lg text-center">
        <div class="text-4xl mb-4">🏢</div>
        <h2 class="text-2xl font-bold mb-2">Nossa História</h2>
        <p>Bem-vindo ao Guia Comercial Luiz Antônio! Desde {currentYear - 0}, transformando como negócios e clientes locais se conectam.</p>
      </article>
      <article class="card bg-white shadow-md p-6 rounded-lg text-center">
        <div class="text-4xl mb-4">🎯</div>
        <h2 class="text-2xl font-bold mb-2">Nossa Missão</h2>
        <p>Fortalecer a economia local e oferecer informações confiáveis para consumidores e empresas.</p>
      </article>
      <article class="card bg-white shadow-md p-6 rounded-lg text-center">
        <div class="text-4xl mb-4">⭐</div>
        <h2 class="text-2xl font-bold mb-2">Nossos Valores</h2>
        <ul class="list-disc list-inside space-y-2">
          <li>Compromisso com a comunidade local</li>
          <li>Transparência e excelência</li>
          <li>Inovação constante</li>
        </ul>
      </article>
    </section>

    <section class="stats-section mt-16 text-center">
      <h2 class="text-3xl font-bold">Nossos Números</h2>
      <div class="stats-grid grid gap-8 mt-8 md:grid-cols-3">
        <div class="stat-card bg-white shadow-lg p-6 rounded-lg">
          <div class="text-4xl font-extrabold text-blue-500">{stats.empresasCadastradas}+</div>
          <div class="mt-2 text-gray-600">Empresas Cadastradas</div>
        </div>
        <div class="stat-card bg-white shadow-lg p-6 rounded-lg">
          <div class="text-4xl font-extrabold text-blue-500">{stats.cidadesAtendidas}+</div>
          <div class="mt-2 text-gray-600">Asseções diario</div>
        </div>
        <div class="stat-card bg-white shadow-lg p-6 rounded-lg">
          <div class="text-4xl font-extrabold text-blue-500">{stats.clientesAtendidos}+</div>
          <div class="mt-2 text-gray-600">Ascessos ao Site</div>
        </div>
      </div>
    </section>

    <section class="diferenciais mt-16">
      <h2 class="text-3xl font-bold text-center">Nossos Diferenciais</h2>
      <div class="diferenciais-grid grid gap-8 mt-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="diferencial-card bg-white shadow-md p-6 rounded-lg text-center transition-transform transform hover:-translate-y-2">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="text-xl font-semibold mb-2">Plataforma Digital</h3>
          <p>Acesso fácil e rápido em qualquer dispositivo</p>
        </div>
        <div class="diferencial-card bg-white shadow-md p-6 rounded-lg text-center transition-transform transform hover:-translate-y-2">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2">Busca Inteligente</h3>
          <p>Encontre o que precisa com eficiência</p>
        </div>
        <div class="diferencial-card bg-white shadow-md p-6 rounded-lg text-center transition-transform transform hover:-translate-y-2">
          <div class="text-4xl mb-4">🤝</div>
          <h3 class="text-xl font-semibold mb-2">Suporte Local</h3>
          <p>Atendimento personalizado</p>
        </div>
        <div class="diferencial-card bg-white shadow-md p-6 rounded-lg text-center transition-transform transform hover:-translate-y-2">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-2">Análise de Dados</h3>
          <p>Insights para crescimento</p>
        </div>
      </div>
    </section>

    <section class="contato-section bg-gray-800 text-white py-12 mt-16 rounded-lg text-center">
      <h2 class="text-3xl font-bold">Faça Parte Dessa História</h2>
      <p class="mt-4">Cadastre sua empresa ou entre em contato para saber mais!</p>
      <div class="buttons flex justify-center gap-4 mt-8">
        <button
        class="btn primary bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        on:click={() => window.open('https://wa.me/16996151725?text=Olá! Gostaria de cadastrar minha empresa.', '_blank')}
      >
        Cadastre sua Empresa
      </button>
      
      <button
        class="btn secondary border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800"
        on:click={() => window.open('https://wa.me/16996151725?text=Olá! Gostaria de mais informações sobre o site.', '_blank')}
      >
        Entre em Contato
      </button>
      
      </div>
    </section>
  </main>
</div>
