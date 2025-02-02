<script lang="ts">

    // Importe as imagens (você precisará adicionar estas imagens ao seu projeto)
    import ScrollTo from '$lib/componets/scrollTo.svelte';
import avatardep1 from '$lib/images/avatardep1.jpg';


    // Constantes e estados
    const plans = [
        {
            name: "Plano Básico",
            description: "Ideal para pequenos negócios que desejam testar a plataforma.",
            price: "Grátis",
            features: [
                "Anúncio por 7 dias",
                "Exposição na página de Anúncios",
                "Contato via WhatsApp",
                "Sem destaques adicionais",
                "Descrição Simples"

            ],
            buttonText: "Começar Agora",
            link: "https://wa.me/5516991916526?text=Olá,%20gostaria%20de%20contratar%20o%20Plano%Grátis%20no%20Guia%20Comercial"

            // link: "/Anuncios-Promocao/planos/plano/basico"
        },
        {
            name: "Plano Premium",
            description: "Para negócios em crescimento",
            price: "R$ 29,99/mês",
            features: [
                "Anúncio por 30 dias",
                "Destaque na página principal",
                "Contato completo",
                "Link para redes sociais",
                "Descrição detalhada  do serviço",
                "Anuncio personalizado",
                "Contato direto com o programador"
            ],
            buttonText: "Assinar Premium",
            // link: "/Anuncios-Promocao/planos/plano/premium"
            link: "https://wa.me/5516991916526?text=Olá,%20gostaria%20de%20contratar%20o%20Plano%20Premium%20no%20Guia%20Comercial"
        },
        {
            name: "Plano Empresarial",
            description: "Máxima visibilidade para empresas que desejam se destacar.",
            price: "R$ 39,99/mês",
            features: [
                "Anúncio por 60 dias",
                "Posição de destaque na página principal",
                "Contato completo e personalizado",
                "Links para redes sociais e site oficial",
                "Descrição detalhada do serviço",
                "Suporte prioritário 24/7",
                "Anuncio personalizado",

                "Contato direto com o programador"

            ],
            buttonText: "Contratar Agora",
            link: "https://wa.me/5516991916526?text=Olá,%20gostaria%20de%20contratar%20o%20Plano%Empresarial%20no%20Guia%20Comercial"

            // link: "/Anuncios-Promocao/planos/plano/empresarial"

        }
    ];

    const statistics = [
        { number: "9000+", label: "Visualizações Mensais" },
        { number: "200+", label: "Empresas Cadastradas" },
        { number: "98%", label: "Taxa de Satisfação" }
    ];

    const benefits = [
        {
            title: "Visibilidade Local",
            description: "Seu negócio aparecerá para pessoas que estão procurando serviços em Luiz Antônio e região",
            icon: "🎯"
        },
        {
            title: "Mais Clientes",
            description: "Aumente sua base de clientes com uma presença digital profissional",
            icon: "👥"
        },
        {
            title: "Credibilidade",
            description: "Construa confiança com uma presença oficial no principal guia da cidade",
            icon: "🏆"
        }
    ];

    const testimonials = [
        {
            name: "João Silva",
            business: "Restaurante Sabor & Cia",
            text: "Desde que anunciamos no Guia Comercial, nosso movimento aumentou em 40%. Os clientes sempre mencionam que nos encontraram através da plataforma. O investimento valeu muito a pena!",
            image: "/avatars/joao.jpg", // Adicione as imagens depois
            rating: 5,
            plan: "Premium",
            time: "Cliente há 8 meses"
        },
        {
            name: "Maria Oliveira",
            business: "Boutique Maria Bonita",
            text: "A facilidade de anúnciar e o retorno que tenho é impressionante. Já recomendei para vários outros comerciantes. O suporte é excelente e sempre está disponível quando preciso.",
            image: avatardep1,
            rating: 5,
            plan: "Empresarial",
            time: "Cliente há 1 ano"
        },
        {
            name: "Carlos Santos",
            business: "Auto Peças Santos",
            text: "Começamos com o plano básico e logo fizemos upgrade para o premium. A visibilidade que temos agora é excepcional. Nossa loja é facilmente encontrada por novos clientes.",
            image: "/avatars/carlos.jpg",
            rating: 5,
            plan: "Premium",
            time: "Cliente há 6 meses"
        },
        {
            name: "Ana Beatriz",
            business: "Clínica de Estética Bella",
            text: "O que mais gosto é a facilidade de atualizar as promoções e novidades. Minhas clientes sempre estão por dentro das novidades através do guia comercial.",
            image: "/avatars/ana.jpg",
            rating: 5,
            plan: "Empresarial",
            time: "Cliente há 3 meses"
        }
    ];

    function generateStars(rating: number) {
        return "⭐".repeat(rating);
    }
    const faqs = [
       
    {
        question: "Por que devo mandar mensagem no WhatsApp?",
        answer: "Assim que você escolher qual plano você deseja, será redirecionado para o WhatsApp para passar detalhes do seu anúncio."
    },
    {
        question: "Como funciona o período de anúncio?",
        answer: "Os anúncios têm duração conforme o plano que você escolher. Por exemplo, o plano empresarial tem duração de 60 dias, enquanto o plano premium tem duração de 30 dias."
    },
    {
        question: "Posso alterar meu plano depois?",
        answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
    },
    {
        question: "Como faço para adicionar fotos ao meu anúncio?",
        answer: "Após a contratação, entre em contato com o programador para adicionar fotos ao seu anúncio."
    },
    {
        question: "Como entro em contato com o programador?",
        answer: "Após escolher o plano, você receberá um link para entrar em contato com o programador. O link é o mesmo para todos os planos."
    },
    {
        question: "Por que eu preciso entrar em contato com o programador?",
        answer: "Para fazer alterações no seu anúncio, como adicionar fotos, alterar o texto, etc."
    },
    {
        question: "Quais os métodos de pagamento disponíveis?",
        answer: "Atualmente, aceitamos pagamentos via Pix. Assim que o pagamento for confirmado, seu anúncio será ativado."
    },
    {
        question: "Quanto tempo leva para o anúncio ser ativado?",
        answer: "O anúncio é ativado manualmente após a confirmação do pagamento. Normalmente, leva menos de 24 horas."
    },
    {
        question: "Como posso ver o desempenho do meu anúncio?",
        answer: "Você pode solicitar um relatório do desempenho do seu anúncio diretamente com o programador."
    },
    {
        question: "O que acontece se meu anúncio expirar?",
        answer: "Se o anúncio expirar, ele será removido do site. Para mantê-lo ativo, você pode renovar antes da data de expiração."
    },
    {
        question: "Posso cancelar meu anúncio antes do término?",
        answer: "Sim, você pode cancelar seu anúncio a qualquer momento, mas não haverá reembolso proporcional ao período não utilizado."
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
        const whatsappLink = `https://wa.me/5516991916526?text=${encodedMessage}`;

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
        <div class="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    Impulsione Seu Negócio em Luiz Antônio
                </h1>
                <p class="text-xl md:text-2xl mb-8 text-blue-100">
                    Conecte-se com milhares de clientes potenciais em nossa plataforma
                </p>
                <a href="#plans" class="inline-block bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors">
                    Ver Planos
                </a>
            </div>
        </div>
    </div>

    <!-- Planos -->
    <div id="plans" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-4">Escolha o Melhor Plano para Seu Negócio</h2>
            <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Temos opções para todos os tamanhos de negócio. Escolha o plano que melhor atende suas necessidades.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {#each plans as plan}
                    <div class="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col transition-transform hover:scale-105">
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
                                            <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                            </svg>
                                        </div>
                                        <p class="ml-3 text-base text-gray-500">{feature}</p>
                                    </li>
                                {/each}
                            </ul>
                        </div>

                        <!-- <button 
                            on:click={() => handleContact(plan.name)}
                            class="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 px-4 text-center transition-colors">
                            {plan.buttonText}
                        </button> -->
                        
                        <button 
                        
                        class="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 px-4 text-center transition-colors">
                        <a href="{plan.link}">
                            {plan.buttonText}
                        </a>
                    </button>
                        
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Estatísticas -->
    <div class="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
    <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center mb-12">Por Que Anunciar Conosco?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {#each benefits as benefit}
                    <div class="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                        <div class="text-4xl mb-4">{benefit.icon}</div>
                        <h3 class="text-xl font-semibold mb-4">{benefit.title}</h3>
                        <p class="text-gray-600">{benefit.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Modal de Contato -->
    {#if showContactForm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4">Solicitar {selectedPlan}</h2>
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
                        on:click={() => showContactForm = false}
                        class="px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
    
    <!-- Seção de Depoimentos Aprimorada -->
    <div class="py-24 bg-gradient-to-b from-white to-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">Histórias de Sucesso</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Veja o que nossos clientes têm a dizer sobre sua experiência com o Guia Comercial
                </p>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {#each testimonials as testimonial}
                    <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
                        <!-- Marca d'água decorativa -->
                        <div class="absolute top-0 right-0 text-gray-100 text-9xl font-bold opacity-10 transform translate-x-4 -translate-y-4">
                            "
                        </div>
                        
                        <!-- Cabeçalho do depoimento -->
                        <div class="flex items-center mb-6">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl relative overflow-hidden">
                                {#if testimonial.image}
                                    <img src={testimonial.image} alt={testimonial.name} class="w-full h-full object-cover"/>
                                {:else}
                                    {testimonial.name[0]}
                                {/if}
                            </div>
                            <div class="ml-4 flex-1">
                                <h3 class="font-bold text-lg">{testimonial.name}</h3>
                                <p class="text-blue-600 font-medium">{testimonial.business}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-sm">{generateStars(testimonial.rating)}</span>
                                </div>
                            </div>
                        </div>
    
                        <!-- Texto do depoimento -->
                        <blockquote class="text-gray-700 mb-6 relative">
                            <svg class="w-8 h-8 text-blue-100 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 32 32">
                                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"/>
                            </svg>
                            <p class="italic pl-6">"{testimonial.text}"</p>
                        </blockquote>
    
                        <!-- Rodapé do depoimento -->
                        <div class="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                            <span>Plano {testimonial.plan}</span>
                            <span>{testimonial.time}</span>
                        </div>
                    </div>
                {/each}
            </div>
    
            <!-- CTA após os depoimentos -->
            <div class="text-center mt-16">
                <p class="text-xl text-gray-600 mb-6">
                    Junte-se a centenas de empresas que já estão crescendo com o Guia Comercial
                </p>
                <a 
                href="https://wa.me/5516991916526?text=Quero%20meu%20Comércio%20no%20site" 
                target="_blank" 
                class="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
                Começar Agora
            </a>
            
            
            </div>
        </div>
    </div>
    <!-- aqui vai o modal -->
    {#if showConstructionModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4">Página em Construção</h2>
            <p class="text-gray-600 mb-6">
                Esta funcionalidade está sendo desenvolvida. Por enquanto, entre em contato via WhatsApp para anunciar seu negócio.
            </p>
            <div class="flex justify-end space-x-3">
                <button 
                    on:click={() => showConstructionModal = false}
                    class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                    Fechar
                </button>
                <a 
                    href="https://wa.me/5516991916526?text=Olá,%20gostaria%20de%20anunciar%20meu%20negócio%20no%20Guia%20Comercial"
                    target="_blank"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                    Contatar via WhatsApp
                </a>
            </div>
        </div>
    </div>
{/if}
    <!-- Destaque Numérico -->
    <div class="bg-blue-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div class="p-6">
                    <p class="text-5xl font-bold text-yellow-400 mb-2">98%</p>
                    <p class="text-xl">Taxa de Satisfação</p>
                </div>
                <div class="p-6">
                    <p class="text-5xl font-bold text-yellow-400 mb-2">+200</p>
                    <p class="text-xl">Empresas Anunciantes</p>
                </div>
                <div class="p-6">
                    <p class="text-5xl font-bold text-yellow-400 mb-2">+10mil</p>
                    <p class="text-xl">Visualizações Mensais</p>
                </div>
            </div>
        </div>
    </div>
    <!-- FAQ -->
    <div class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-12">
                Perguntas Frequentes
            </h2>
            <div class="max-w-3xl mx-auto space-y-8">
                {#each faqs as faq}
                    <div class="bg-white rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
                        <h3 class="text-xl font-semibold text-gray-900">
                            {faq.question}
                        </h3>
                        <p class="mt-4 text-gray-700 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
    
</div>