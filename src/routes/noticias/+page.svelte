<script lang="ts">
    import { onMount } from 'svelte';
    
    let currentSlide = 0;
    
    const slides = [
        {
            title: 'Nova Experiência',
            subtitle: 'Guia Comercial 2.0',
            description: 'Uma nova era para seu negócio digital',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80'
        },
        {
            title: 'Sistema Inteligente',
            subtitle: 'IA & Automação',
            description: 'Tecnologia de ponta para melhor atendimento',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80'
        },
        {
            title: 'Manutenção Programada',
            subtitle: 'Atualizações',
            description: 'Sempre evoluindo para você',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80'
        }
    ];
    const dataJson = `
    {
        "title": "Plano Básico",
        "tipo_de_plano": "Grátis",
        "dias_futuros": "Anúncio por 7 dias",
        "valor": "R$ 0,00",
        "descrição": "Plano básico para você começar a usar o Guia Comercial Luiz Antônio. Anúncio por 7 dias.",
        "anuncios_diasrios": "1 anúncio por dia"

    }
    ` 
    const dataJson2 = `
    {
        "title": "Plano Premium",
        "tipo_de_plano": "29,99",
        "dias_futuros": "Anúncio por 30 dias",
        "valor": "R$ 29,99",
        "descrição": "Plano premium para você começar a usar o Guia Comercial Luiz Antônio. Anúncio por 30 dias.",
        "anuncios_diasrios": "5 anúncios por dia",
        "anuncio_personalizado": "0",
        "destaque": "1"

    }`
    const Grátis = `
    {
        "dias_de_anuncio": {
        "7": "1 anúncio por dia",
        "15": "2 anúncios por dia",
        "30": "3 anúncios por dia"
        }
    }`
    const dataJson3 = `
    {
        "title": "Plano Empresarial",
        "tipo_de_plano": "39,99",
        "dias_futuros": "Anúncio por 30 dias",
        "valor": "R$ 39,99",
        "descrição": "Plano empresarial para você começar a usar o Guia Comercial Luiz Antônio. Anúncio por 30 dias.",
        "anuncios_diasrios": "10 anúncios por dia"
        }`
    
	const features = [
    {
        title: "Nova Interface do Catálogo de Comercios",
        date: "Dezembro 2024",
        category: "Interface",
        description: "Reformulamos a experiência visual do site, com foco em facilitar a navegação e tornar a busca de comércios mais rápida e intuitiva.",
        icon: "🎨",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Sistema de Busca Avançada de Comércios",
        date: "Janeiro 2025",
        category: "Funcionalidade",
        description: "Implementação de uma busca inteligente, com filtros por categoria, localização e horário de funcionamento, facilitando a pesquisa de comércios.",
        icon: "🔍",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Manutenção e Melhoria de Sistema",
        date: "Fevereiro 2025",
        category: "Sistema",
        description: "Atualizações para otimizar a performance do site e garantir mais segurança na navegação e interação com o banco de dados dos comércios.",
        icon: "🔧",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Anúncio de manutenção",
        date: "fevereiro 2025",
        category: "Manutenção",
        description: "Estamos realizando melhorias no site e, em breve, algumas funcionalidades, como os botões, estarão totalmente otimizadas. Agradecemos pela paciência enquanto trabalhamos para oferecer uma experiência ainda melhor",
        icon: "🔧",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
    }
];




    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    onMount(() => {

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    });
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative h-[90vh] overflow-hidden">
        {#each slides as slide, index}
            <div 
                class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style="opacity: {currentSlide === index ? '1' : '0'}"
            >
                <div 
                    class="absolute inset-0 bg-cover bg-center"
                    style="background-image: url('{slide.image}')"
                >
                    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                
                <div class="relative h-full container mx-auto px-4 flex items-center">
                    <div class="w-full md:w-2/3 text-white">
                        <span class="inline-block px-4 py-2 bg-blue-600 rounded-full text-sm uppercase tracking-wider mb-4">
                            {slide.subtitle}
                        </span>
                        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            {slide.title}
                        </h1>
                        <p class="text-xl md:text-2xl opacity-90 max-w-lg mb-8">
                            {slide.description}
                        </p>
                        <!-- <button class="bg-white mt-10 absolute text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300">
                            <a 
                             class="p-5"
                             href="#art-sobre">
                                Saiba mais
                            </a>
                        </button> -->
                    </div>
                </div>
            </div>
        {/each}

        <!-- Slider Controls -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {#each slides as _, i}
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button 
                    class="w-3 h-3 rounded-full border-2 border-white transition-all duration-300 {currentSlide === i ? 'bg-white scale-125' : 'bg-transparent'}"
                    on:click={() => currentSlide = i}
                ></button>
            {/each}
        </div>

        <!-- Arrow Controls -->
        <button 
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-300"
            on:click={prevSlide}
        >
            ←
        </button>
        <button 
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-300"
            on:click={nextSlide}
        >
            →
        </button>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4">
        <div class="container mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Últimas Atualizações</h2>
                <p class="text-gray-600 text-lg">Acompanhe as novidades e melhorias do nosso sistema</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each features as feature}
                    <div class="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div class="relative h-64 overflow-hidden">
                            <img 
                                src={feature.image} 
                                alt={feature.title}
                                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        </div>
                        
                        <div class="p-6 relative">
                            <div class="absolute -top-10 right-6 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
                                {feature.icon}
                            </div>
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-blue-600 font-semibold">{feature.category}</span>
                                <span class="text-gray-500 text-sm">{feature.date}</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p class="text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-20 bg-gray-100">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Cronograma</h2>
                <p class="text-gray-600 text-lg">Planejamento das próximas melhorias</p>
            </div>

            <div id="art-sobre"
             class="max-w-4xl mx-auto">
                <div class="space-y-8">
                    {#each features as feature, index}
                        <div class="relative pl-8 border-l-4 border-blue-500">
                            <div class="absolute w-6 h-6 bg-blue-500 rounded-full -left-[14px] top-1 flex items-center justify-center">
                                <div class="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-xl font-bold text-gray-800">{feature.title}</h3>
                                    <span class="text-blue-600 font-medium">{feature.date}</span>
                                </div>
                                <p class="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>
</div>