
	import Americana from '$lib/images/th.jpeg';
	import lorm from '$lib/images/th1.jpeg';
	import Grau from '$lib/images/grau.jpg';
    import Frete from '$lib/images/frete-do-carlao.jpg';
    import Nunes from '$lib/images/nunes.jpg';
    import Whatsapps from '$lib/images/whats.png';
    import Farmaciaamericana from '$lib/images/th.jpeg';
    import Farmaciajoao from '$lib/images/th1.jpeg';
    import Oriental from '$lib/images/oriental.jpg';
    import Fera from '$lib/images/fera.jpg';
    import Sacchi from '$lib/images/sacchi.jpg';
    import Emílio  from '$lib/images/emilio.jpg';
    import DrogariaTotal  from '$lib/images/DrogariaTotal-UnipharmaI.jpg';
    import DrogariaTotalVip  from '$lib/images/Drogaria-Total-Farmavip-3.jpg';
    import UnipharmaII  from '$lib/images/Drogaria-Total-Unipharma-II.jpg';
    import DrogariaBrasil  from '$lib/images/Drogaria-Brasil.jpg';
    import MercadoBebidas  from '$lib/images/Mercado-Bebidas-Em-Geral.jpg';
    import UnidadeUnidade  from '$lib/images/Unidade-Mista-de-Luiz Antônio.jpg';
    import SaoFrancisco  from '$lib/images/SaoFrancisco.jpg';
    import Prefeitura  from '$lib/images/2020-11-19.jpg';
    import Construção  from '$lib/images/Loja-da-Construção.jpg';
    import rodrigues   from '$lib/images/rodrigues-mat-deposito-renato.jpg';






export function load() {
    return {
        categories:[
            'Todos',
            'Prefeitura',
            'Supermercado',
            'Farmacia',
            'Deposito de bebidas',
            'Saúde',
            'Loja da Construção',
            
        ],
        items: [
               // Prefeitura
               { slug: 'Prefeitura-Municipal-de-Luiz-Antônio', title: 'Prefeitura Municipal de Luiz Antônio',facebook:'https://www.facebook.com/imprensaluizantonio?locale=pt_BR', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14843.441507219095!2d-47.716506835028355!3d-21.55231413369815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375a54b9c06f%3A0xac861ac6ace6c6e8!2sPrefeitura%20Municipal%20de%20Luiz%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1730902932362!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Prefeitura },
            //Supermercado
            {slug:  'FERA Supermercado', title: 'FERA Supermercado', category: 'Supermercado',telefone:'(16) 99630-5735',whatsapp:'16996305735', hours: "Seg-Sex: 	07:00–21:00", image: Fera },
            // Farmacia
            { slug:  'Drogaria-Total-Unipharma-I', title: 'Drogaria Total - Unipharma I', category: 'Farmacia',telefone:'(16) 3983-2066',whatsapp:'16996305735', hours : "Seg-Sex: 08h às 18h", image: DrogariaTotal },
            { slug:  'Drogaria-Total-Farmavip-3', title: 'Drogaria Total - Farmavip 3', category: 'Farmacia',telefone:'(16) 3983-1235',hours: "Seg-Sex: 08h às 18h", image: DrogariaTotalVip },
            { slug:  'Drogaria-Total-Unipharma-II', title: 'Drogaria Total - Unipharma II', category: 'Farmacia',telefone:'(16) 3983-1577',hours: "Seg-Sex: 08h às 18h", image: UnipharmaII },
            { slug:  'Drogaria-Brasil', title: 'Drogaria Brasil', category: 'Farmacia',telefone:'(16) 3983-6439',hours: "Seg-Sex: 08h às 20h", image: DrogariaBrasil },

            // Deposito de bebidas
            { slug:  'Deposito-de-bebidas-e-mercado-no-grau', title: 'Deposito de bebidas e mercado no grau', category: 'Deposito de bebidas',telefone:' (16) 99734-7340',whatsapp:'16997347340', hours: "Seg-Sex: 08h às 22h", image: Grau},
            { slug:  'Mercado-Bebidas-Em-Geral', title: 'Mercado Bebidas Em Geral', category: 'Deposito de bebidas',telefone:'555555555',hours: "Seg-Sex: 08h às 22h", image: MercadoBebidas},
           
            // Saúde
            { slug: 'Unidade-de-Saúde-Dr-Emílio-Serafim', title: 'Unidade de Saúde Dr Emílio Serafim', category: 'Saúde',telefone:'(16) 3983-1278',hours: "Seg-Domingo: 24h", image: Emílio },
            { slug: 'Unidade-Mista-de-Luiz-Antônio', title: 'Unidade Mista de Luiz Antônio', category: 'Saúde',telefone:'(16) 3983-1203',hours: "Seg-Domingo: 24h", image: UnidadeUnidade },
            { slug: 'São-Francisco-saúde', title: 'São Francisco saúde', category: 'Saúde',telefone:'(16) 3983-6222',hours: "Seg-Sex: 08h às 18h", image: SaoFrancisco },
            
         
            // Loja-da-Construção
            { slug: 'Loja-da-Construção', title: 'Receitas Macarrônicas', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: Construção },
            { slug: 'rodrigues-mat-deposito-renato', title: 'rodrigues mat deposito renato', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: rodrigues},
           
           
            {slug: 'Receitas Macarrônicas', title: 'Loja da Construção', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'farmacia-do-joao', title: 'farmacia do joao', category: 'Farmacia', telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: lorm },
            { slug: 'Receitas-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'Receitas Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'text-Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },

        ]
    }
    
}


