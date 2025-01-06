<script lang="ts">
    import dall from '$lib/images/quem.png';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';

    // Constants
    const ANIMATION_DURATION = 2000;
    const FADE_DURATION = 300;
    const FLY_DURATION = 1000;
    const FLY_DELAY = 300;

    // Interfaces
    interface Valor {
        titulo: string;
        descricao: string;
        icone: string;
        cor: string;
    }

    interface Conquista {
        numero: number;
        sufixo: string;
        texto: string;
        icone: string;
    }

    interface Tab {
        titulo: string;
        conteudo: string;
    }

    // Dados dos valores da empresa
    const valores: Valor[] = [
        { 
            titulo: 'Inovação', 
            descricao: 'Pioneirismo em soluções tecnológicas e processos inovadores',
            icone: '🚀',
            cor: 'from-blue-500 to-blue-700'
        },
        { 
            titulo: 'Excelência', 
            descricao: 'Compromisso com os mais altos padrões de qualidade',
            icone: '⭐',
            cor: 'from-purple-500 to-purple-700'
        },
        { 
            titulo: 'Confiança', 
            descricao: 'Relacionamentos sólidos baseados em transparência',
            icone: '🤝',
            cor: 'from-green-500 to-green-700'
        }
    ];

    // Dados das conquistas
    const conquistas: Conquista[] = [
        { numero: 98, sufixo: '+', texto: 'Empresas Cadastradas', icone: '📊' },
        { numero: 13000, sufixo: '+', texto: 'Usuários Mensais', icone: '👥' },
        { numero: 13, sufixo: '', texto: 'Categorias', icone: '🏆' },
        { numero: 98, sufixo: '%', texto: 'Avaliação Média', icone: '❤️' }
    ];

    // State
    let visible = false;
    let activeTab = 'missao';
    let stats: Record<string, number> = conquistas.reduce((acc, curr) => ({ ...acc, [curr.texto]: 0 }), {});
    
    // Tabs de informação
    const tabs: Record<string, Tab> = {
        missao: {
            titulo: 'Nossa Missão',
            conteudo: 'Transformar o mercado através de soluções inovadoras e sustentáveis, gerando valor real para nossos clientes e parceiros.'
        },
        visao: {
            titulo: 'Nossa Visão',
            conteudo: 'Ser referência em Luiz Antônio em soluções empresariais, reconhecida pela excelência e inovação em nossos serviços.'
        },
        valores: {
            titulo: 'Nossos Valores',
            conteudo: 'Integridade, compromisso com resultados, inovação contínua e valorização das pessoas.'
        }
    };

    function animateNumbers() {
        conquistas.forEach(conquista => {
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
                
                stats[conquista.texto] = Math.floor(conquista.numero * progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });
    }

    onMount(() => {
        try {
            visible = true;
            animateNumbers();
        } catch (error) {
            console.error('Error initializing component:', error);
        }
    });
</script>

<section class="w-full bg-secondary dark:bg-secondary">
    <h2 class="sr-only">Sobre Nossa Empresa</h2>
    {#if visible}
        <div class="container mx-auto px-4 py-16 2xl:max-w-7xl">
            <!-- Seção Principal -->
            <div class="mb-16 flex flex-col items-center justify-between lg:flex-row" in:fade={{ duration: FADE_DURATION }}>
                <!-- Texto Principal -->
                <div class="lg:w-1/2 lg:pr-12">
                    <h1 class="mb-6 text-4xl font-bold leading-tight text-secondary-foreground dark:text-secondary-foreground md:text-5xl lg:text-6xl">
                        Transformando
                        <span class="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                            Ideias
                        </span>
                        em Realidade
                    </h1>
                    <p class="mb-8 text-lg text-secondary-foreground dark:text-secondary-foreground">
						Somos especialistas em soluções empresariais, dedicados a oferecer excelência e inovação. Nossa experiência nos capacita a entregar resultados impactantes que aceleram o crescimento e o sucesso de nossos clientes.  </p>
                    
                    <!-- Tabs -->
                    <div class="mb-8 rounded-lg bg-gray-800 p-6">
                        <div role="tablist" class="mb-4 flex space-x-4">
                            {#each Object.entries(tabs) as [key, {titulo}]}
                                <button
                                    role="tab"
                                    aria-selected={activeTab === key}
                                    aria-controls={`tab-${key}`}
                                    class="transform rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 {activeTab === key ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}"
                                    onclick={() => activeTab = key}
                                >
                                    {titulo}
                                </button>
                            {/each}
                        </div>
                        {#key activeTab}
                            <div 
                                id={`tab-${activeTab}`}
                                role="tabpanel"
                                class="text-gray-300" 
                                transition:fade={{ duration: FADE_DURATION }}
                            >
                                {tabs[activeTab].conteudo}
                            </div>
                        {/key}
                    </div>

                    <div class="flex space-x-4">
                        <a
                            href="https://wa.me/16991916526?text={'Olá, Quero me contatar!'}"
							target="_blank"
                            class="transform rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        >
                            Fale Conosco
                        </a>
                        <a
                           href="/Anuncios-Promocao"
                            class="transform rounded-full bg-red-500 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-red-500"
                        >
                            Nossos Serviços
                        </a>
                    </div>
                </div>

                <!-- Imagem Principal -->
                <div class="mt-12 lg:mt-0 lg:w-1/2" in:fly={{ x: 200, duration: FLY_DURATION, delay: FLY_DELAY }}>
                    <div class="relative">
                        <div class="absolute -inset-1 rounded-lg "></div>
                        <img
                            src={dall}
                            alt="Imagem representando a empresa"
                            loading="lazy"
                            class="relative h-[400px] w-full rounded-lg object-cover shadow-2xl lg:h-[500px]"
                        />
                    </div>
                </div>
            </div>

            <!-- Conquistas -->
            <div class="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4" in:fade={{ duration: FADE_DURATION, delay: FLY_DELAY }}>
                {#each conquistas as conquista}
                    <div class="transform rounded-lg bg-gray-800 p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-gray-700">
                        <div class="mb-2 text-2xl">{conquista.icone}</div>
                        <div class="text-3xl font-bold text-white">
                            {stats[conquista.texto]}{conquista.sufixo}
                        </div>
                        <div class="mt-2 text-sm text-gray-400">{conquista.texto}</div>
                    </div>
                {/each}
            </div>

            <!-- Valores -->
            <div class="grid gap-6 md:grid-cols-3" in:fade={{ duration: FADE_DURATION, delay: FLY_DELAY * 2 }}>
                {#each valores as valor}
                    <div
                        class="group border relative overflow-hidden rounded-lg bg-gray-800 p-6 transition-all duration-300 hover:scale-105"
                    >
                        <div class="relative z-10">
                            <div class="mb-4 text-3xl">{valor.icone}</div>
                            <h3 class="mb-2 text-xl font-bold text-white">{valor.titulo}</h3>
                            <p class="text-sm text-gray-400">{valor.descricao}</p>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-br {valor.cor} opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</section>

<style>
    :global(.transition-all) {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>