<script>
    // @ts-nocheck
    import Footer from '$lib/footer/+page.svelte';
    import Breadcrumbs from '$lib/componets/Breadcrumbs.svelte';
    import ScrollTo from '$lib/componets/scrollTo.svelte';
    import Postform from '$lib/componets/postform.svelte';
    import MenuMural from '$lib/componets/MenuMural.svelte';
    import Citys from '../../lib/images/homepage.jpg';
    import Maps from '$lib/images/icons8-mapa-64.png';
    import Rota from '$lib/images/icons8-route-64.png';
    import Mt from '$lib/images/mt.png';
    import Darkmod from '$lib/componets/Darkmod.svelte';



    let isReading = false;
    let speechUtterance;
    let speechSynthesis;
    let readingSpeed = 1.0;

    function stopReading() {
        if (speechSynthesis) {
            speechSynthesis.cancel();
            isReading = false;
        }
    }

    function startReading() {
        if (typeof window !== 'undefined') {
            speechSynthesis = window.speechSynthesis;
            
            if (isReading) {
                stopReading();
                return;
            }

            const text = document.getElementById('historia-texto').textContent;
            speechUtterance = new SpeechSynthesisUtterance(text);
            speechUtterance.lang = 'pt-BR';
            speechUtterance.rate = readingSpeed;
            speechUtterance.pitch = 1;

            speechUtterance.onend = () => {
                isReading = false;
            };

            speechSynthesis.speak(speechUtterance);
            isReading = true;
        }
    }

    function adjustSpeed(change) {
        readingSpeed = Math.max(0.5, Math.min(2, readingSpeed + change));
        if (isReading) {
            stopReading();
            startReading();
        }
    }
</script>

<ScrollTo />
<main class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 backdrop-blur-sm">
        <div class="container mx-auto p-4">
            <Breadcrumbs />
        </div>
        <nav class="border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60">
            <div class="container mx-auto p-4">
                <div class="flex items-center justify-end gap-4">
                    <!-- <Darkmod /> -->
                    <MenuMural />
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <div class="grid gap-12 lg:grid-cols-2">
                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        <img src={Mt} alt="Logo" class="h-12 w-12" />
                        <h1 class="text-4xl font-bold text-slate-800 dark:text-white lg:text-5xl">Luíz Antônio</h1>
                    </div>
                    <p class="text-lg text-slate-600 dark:text-gray-300">
                        Uma cidade acolhedora no coração de São Paulo, com rica história e belezas naturais.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <a
                            href="#COMO-CHEGAR"
                            class="rounded-full bg-red-500 px-8 py-3 text-white font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-400"
                        >
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            Como Chegar
                        </a>
                        <a
                            href="#TURISMO"
                            class="rounded-full border-2 border-blue-800 px-8 py-3 text-blue-800 font-medium transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                        >
                            <i class="fas fa-landmark mr-2"></i>
                            Pontos Turísticos
                        </a>
                    </div>
                </div>
                <div class="relative overflow-hidden rounded-2xl">
                    <img
                        src={Citys}
                        alt="Cidade de Luís Antônio"
                        class="h-full w-full object-cover shadow-lg"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- História Section -->
    <section id="HISTORIA-DA-CIDADE" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 class="text-3xl font-bold text-slate-800 dark:text-white">História da Cidade</h2>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            on:click={() => adjustSpeed(-0.1)}
                            class="rounded-full bg-gray-200 dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                            title="Diminuir velocidade"
                        >
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="text-sm font-medium text-slate-800 dark:text-white">
                            {readingSpeed.toFixed(1)}x
                        </span>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            on:click={() => adjustSpeed(0.1)}
                            class="rounded-full bg-gray-200 dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                            title="Aumentar velocidade"
                        >
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button
                    on:click={startReading}
                    class="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 
                    px-4 sm:px-6 py-2.5 sm:py-3 text-white font-medium text-sm sm:text-base transition-all duration-300 
                    hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 
                    hover:scale-[1.02] active:scale-95 group"
                >
                    <span class="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <i class={`${isReading ? "fas fa-pause" : "fas fa-play"} text-base transition-transform duration-300 group-hover:scale-110`}></i>
                    <span class="relative">
                        {isReading ? 'Pausar' : 'Ouvir'}
                    </span>
                    <div class="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"></div>
                </button>
                </div>
            </div>
            <div id="historia-texto" class="space-y-6 text-slate-600 dark:text-gray-300">
                <p id="p0" class="p-2 font-sans lg:text-[20px]">
                    De acordo com o livro "Elementos para a História de Luiz Antônio", a data aceita como de fundação do município é 13 de dezembro de 1893. Neste dia, à margem do "Estradão de São Simão" que ligava a cidade de São Simão ao Porto do Jatahy, o farmacêutico Carlos Loyola, transitando com seu carroção pelo local onde hoje fica a Praça Mário Junqueira, foi repentinamente acometido de cegueira total. Em sua aflição, fez uma promessa à Santa Luzia (protetora dos olhos) de que, se recuperasse a visão, abriria no local uma Botica para dar suporte aos viajantes que transitavam por aquela região inóspita. Alcançada a graça, Loyola cumpriu sua promessa, e ao redor de sua Botica começaram a surgir outras casas, iniciando o povoamento.
                </p>
                <p id="p1" class="p-2 font-sans lg:text-[20px]">
                    No entanto, existem evidências históricas que sugerem que o povoamento da região começou pelo menos 17 anos antes. Em 1887, quando da Criação da Comarca de São Simão, documentos oficiais já mencionavam a Vila Jatahy (primeiro nome de Luiz Antônio) como parte de sua jurisdição, junto com São Simão e Santa Rosa de Viterbo. O povoado inicial se estabeleceu próximo à atual fazenda Jatahy, nas proximidades do antigo porto fluvial do Jatahy.
                </p>
                <p id="p2" class="p-2 font-sans lg:text-[20px]">
                    A transformação definitiva em município ocorreu através da lei nº 5.121, de 31 de dezembro de 1958, que entrou em vigor em 1º de janeiro de 1960, estabelecendo oficialmente o município de Luiz Antônio.
                </p>
            </div>
        </div>

    <!-- Características Section -->
    <section id="CARACTERÍSTICAS" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <h2 class="mb-8 text-3xl font-bold text-slate-800 dark:text-white">Características</h2>
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-gray-200">Economia</h3>
                    <ul class="space-y-2 text-slate-600 dark:text-gray-300">
                        <li>🌾 Produção de cana de açúcar</li>
                        <li>🌳 Cultivo de eucalipto e laranja</li>
                        <li>🏭 Central Energética Moreno</li>
                        <li>📄 VCP- Votorantim Celulose e Papel</li>
                    </ul>
                </div>
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-gray-200">Clima</h3>
                    <ul class="space-y-2 text-slate-600 dark:text-gray-300">
                        <li>🌡️ Tropical seco e saudável</li>
                        <li>💨 Ventos constantes</li>
                        <li>🍂 Quatro estações bem definidas</li>
                        <li>🌡️ Temperatura média: 28º C</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Como Chegar Section -->
    <section id="COMO-CHEGAR" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <div class="mb-8 flex items-center gap-4">
                <img src={Maps} alt="Mapa" class="h-8 w-8" />
                <h2 class="text-3xl font-bold text-slate-800 dark:text-white">Como Chegar</h2>
            </div>
            <div class="grid gap-8 lg:grid-cols-2">
                <div class="space-y-6 text-slate-600 dark:text-gray-300">
                    <div>
                        <h3 class="mb-2 font-semibold text-slate-700 dark:text-gray-200">Localização</h3>
                        <p>Noroeste do estado de São Paulo</p>
                    </div>
                    <div>
                        <h3 class="mb-2 font-semibold text-slate-700 dark:text-gray-200">Principais Acessos</h3>
                        <ul class="space-y-1">
                            <li>• SP-348 (Rodovia dos Bandeirantes)</li>
                            <li>• SP-330 (Rodovia Anhanguera)</li>
                            <li>• SP-253 (Rodovia Deputado Cunha Bueno)</li>
                        </ul>
                    </div>
                    <a
                        href="https://www.google.com.br/maps/dir//Lu%C3%ADs+Ant%C3%B4nio,+SP"
                        target="_blank"
                        class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    >
                        <img src={Rota} alt="Rota" class="h-6 w-6" />
                        <span>Ver Rotas</span>
                    </a>
                </div>
                <div class="overflow-hidden rounded-xl">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.647010632902!2d-47.70730560294354!3d-21.553755470920745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837433372e255%3A0x31f964ae06d686f4!2zTHXDrXMgQW50w7RuaW8sIFNQLCAxNDIxMC0wMDA!5e0!3m2!1spt-BR!2sbr!4v1733249064937!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="400"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="dark:invert-[.95]"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>

    <!-- Turismo Section -->
    <section id="TURISMO" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <h2 class="mb-8 text-3xl font-bold text-slate-800 dark:text-white">Pontos Turísticos</h2>
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div class="rounded-xl bg-slate-50 dark:bg-gray-700 p-6">
                    <h3 class="mb-4 text-xl font-semibold text-slate-700 dark:text-gray-200">Rios Principais</h3>
                    <ul class="space-y-2 text-slate-600 dark:text-gray-300">
                        <li>🌊 Rio Moji-Guaçu</li>
                        <li>🌊 Rio da Onça</li>
                        <li>🌊 Rio Vassununga</li>
                    </ul>
                </div>
                <div class="rounded-xl bg-slate-50 dark:bg-gray-700 p-6">
                    <h3 class="mb-4 text-xl font-semibold text-slate-700 dark:text-gray-200">Córregos</h3>
                    <ul class="space-y-2 text-slate-600 dark:text-gray-300">
                        <li>💧 Beija-Flor</li>
                        <li>💧 Jucuri</li>
                        <li>💧 Boa Sorte</li>
                    </ul>
                </div>
                <div class="rounded-xl bg-slate-50 dark:bg-gray-700 p-6">
                    <h3 class="mb-4 text-xl font-semibold text-slate-700 dark:text-gray-200">Outros Atrativos</h3>
                    <ul class="space-y-2 text-slate-600 dark:text-gray-300">
                        <li>🌿 Área de preservação</li>
                        <li>🏃‍♂️ Trilhas ecológicas</li>
                        <li>🎣 Pesca esportiva</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Informações Úteis Section -->
    <section id="INFORMAÇÕES-ÚTEIS" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <h2 class="mb-8 text-3xl font-bold text-slate-800 dark:text-white">Informações Úteis</h2>
            <div class="grid gap-8 lg:grid-cols-3">
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-gray-200">Prefeitura Municipal</h3>
                    <div class="space-y-2 text-slate-600 dark:text-gray-300">
                        <p>📞 (16) 3983-9000 / 9001</p>
                        <a href="http://www.luizantonio.sp.gov.br/" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            🌐 www.luizantonio.sp.gov.br
                        </a>
                    </div>
                </div>
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-gray-200">Transporte</h3>
                    <div class="space-y-2 text-slate-600 dark:text-gray-300">
                        <p>Viação Danúbio Azul Ltda.</p>
                        <p>📞 (11) 3858-5566</p>
                        <p>📞 (11) 3392-3424</p>
                        <a href="http://www.danubioazul.com.br" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            🌐 www.danubioazul.com.br
                        </a>
                    </div>
                </div>
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-gray-200">Cartório</h3>
                    <div class="space-y-2 text-slate-600 dark:text-gray-300">
                        <p>📍 Rua Manoel Francisco, 225 - Centro</p>
                        <p>📞 (16) 3983-1460</p>
                        <a href="mailto:cartorio@cartoriola.com.br" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            ✉️ cartorio@cartoriola.com.br
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Comment Section -->
    <section id="Comentário" class="container mx-auto px-4 py-16">
        <div class="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg">
            <Postform />
        </div>
    </section>

</main>

<style>
    :global(.dark) {
        color-scheme: dark;
    }
    button {
        transition: all 0.3s ease;
    }
    
    button:active {
        transform: scale(0.95);
    }
</style>