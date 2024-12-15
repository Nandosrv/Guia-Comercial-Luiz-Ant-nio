<script>
	import Gelindo from '$lib/images/gelindo.png';
    import Frete from '$lib/images/frete-do-carlao.jpg';
    import Nunes from '$lib/images/nunes.jpg';
    import Grau from '$lib/images/grau.jpg'; // Certifique-se de que o caminho está correto
    import Whatsapps from '$lib/images/whats.png';
    import Farmaciaamericana from '$lib/images/th.jpeg';
    import Farmaciajoao from '$lib/images/th1.jpeg';
    import Oriental from '$lib/images/oriental.jpg';
    import Fera from '$lib/images/fera.jpg';
    import Sacchi from '$lib/images/sacchi.jpg';
    import Jr from '$lib/images/reis.png';

    const comercios = [
        {
            nome: 'Gelindo',
            telefone: '16991025776',
            descricao: 'Deposito de bebidas e mercado no grau.',
            fotos: [Gelindo],
            // texts: '16'
        },
        {
            nome: 'Jr Costela ao Bafo',
            telefone: '16996384606',
            descricao: 'Costela ao Bafo.',
            fotos: [Jr],
            // texts: '8'
        },
        {
            nome: 'Fera',
            telefone: '16996305735',
            descricao: 'FERA Supermercado.',
            fotos: [Fera],
            // texts: '74'
        },
        {
            nome: 'ORIENTAL',
            telefone: '16997541641',
            descricao: 'UTILIDADES, VARIEDADES E PRESENTES.',
            fotos: [Oriental],
            // texts: '17'
        },
        {
            nome: 'Sacchi e Guedes',
            telefone: '1639831138',
            descricao: 'Supermercado Sacchi e Guedes',
            fotos: [Sacchi],
            // texts: '260'
        }
    ];

    let currentIndex1 = 0; // Índice do primeiro card
    let currentIndex2 = 1; // Índice do segundo card

    // Função para alternar os índices dos comércios
    const changeCommerce = () => {
        currentIndex1 = (currentIndex1 + 1) % comercios.length; // Reinicia para 0 ao atingir o final
        currentIndex2 = (currentIndex2 + 1) % comercios.length; // Reinicia para 0 ao atingir o final
    };

    // Intervalo para alternar os cartões a cada 3 segundos
    const intervalId = setInterval(changeCommerce, 5000);

    // Limpar intervalo quando o componente for destruído
    import { onDestroy } from 'svelte';
    onDestroy(() => clearInterval(intervalId));
</script>

<main class="p-2 flex h-[300px] w-full justify-around ">
    <div class="h-[512px] w-[157px]">
        <div class="h-[50%] w-full rounded-[12px] border border-red-100 bg-[#5A4744] ">
            <div class="m-1 h-[70%] w-[95%] rounded-[12px]">
                <img
                    class="h-full w-full object-cover rounded-[12px]"
                    src={comercios[currentIndex1].fotos[0]}
                    alt={`Imagem do comércio ${comercios[currentIndex1].nome}`}
                />
            </div>
            <div class="flex h-[50px] w-full flex-col justify-end">
                <div class="flex w-[145px] items-center justify-between">
                    <p class="text-yellow-400">DESTAQUES</p>
                    <a href={`https://wa.me/${comercios[currentIndex1].telefone}`} target="_blank" class="text-gray-300">
                        <img src={Whatsapps} alt="Ícone do WhatsApp" />
                    </a>
                </div>
                <!-- <div class="flex w-[145px] justify-between">
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>({comercios[currentIndex1].texts})</p>
                </div> -->
            </div>
        </div>
    </div>

    <div class="h-[512px] w-[157px]">
        <div class="h-[50%] w-full rounded-[12px] border border-red-100 bg-[#5A4744] ">
            <div class="m-1 h-[70%] w-[95%] rounded-[12px]">
                <img
                    class="h-full w-full object-cover rounded-[12px]"
                    src={comercios[currentIndex2].fotos[0]}
                    alt={`Imagem do comércio ${comercios[currentIndex2].nome}`}
                />
            </div>
            <div class="flex h-[50px] w-full flex-col justify-end">
                <div class="flex w-[145px] items-center justify-between ">
                    <p class="text-yellow-400 ">DESTAQUES</p>
                    <a href={`https://wa.me/${comercios[currentIndex2].telefone}`} target="_blank" class="text-gray-300">
                        <img src={Whatsapps} alt="Ícone do WhatsApp" />
                    </a>
                </div>
                <!-- <div class="flex w-[145px] justify-between">
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>({comercios[currentIndex2].texts})</p>
                </div> -->
            </div>
        </div>
    </div>
</main>
