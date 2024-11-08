
	import Americana from '$lib/images/th.jpeg';
	import lorm from '$lib/images/th1.jpeg';
	import Grau from '$lib/images/grau.jpg';
    import Frete from '$lib/images/frete-do-carlao.jpg';
    import Nunes from '$lib/images/nunes.jpg';
    import Whatsapps from '$lib/images/whats.png';
    import Farmaciaamericana from '$lib/images/th.jpeg';
    import Farmaciajoao from '$lib/images/th1.jpeg';
    import Oriental from '$lib/images/oriental.jpg';
    // Saude
    import Emílio  from '$lib/images/emilio.jpg';
    import Transporte  from '$lib/images/transporte.jpg';
    import Vacina  from '$lib/images/sala-vacina.webp';
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
    // lanchonet
    import Kilanche   from '$lib/images/kilanchão.jpg';
    import Trailerjoao   from '$lib/images/Trailer-do-João.jpg';
    import Iguatemi    from '$lib/images/Posto-Ipiranga.jpg';
    import Iguatemis    from '$lib/images/1.jpg';
    import Colorado    from '$lib/images/colorado.jpg';
//    Mercado
    import Fernandes from '$lib/images/fer.png';
    import BITTAR from '$lib/images/bitar.png';
    import Sacchi from '$lib/images/sacchi.jpg';
    import Lops from '$lib/images/lops.png';
    import Martins from '$lib/images/martins.png';
    import Fera from '$lib/images/feraa.png';
    // Loja De Moda Infantil
    import Cegonhitas from '$lib/images/Cegonhitas.png';
    import Dulorekids from '$lib/images/Dulorekids.png';
    import Nina from '$lib/images/nina.png';


    // Loja De Roupas

    import Newroupa from '$lib/images/New-Place-Modas.png';
    import Viva from '$lib/images/moda-vida.jpg';
    import Lauanne from '$lib/images/Lauanne-Moda-Feminina.png';
    import Sol from '$lib/images/Por-Do-Sol-Modas.png';
    import Fenix from '$lib/images/Fenix-Boutique.png';
    import Wagner from '$lib/images/Wagner.png';
    import Mida from '$lib/images/Modas-E-Acessorios-Z.png';
    import Chery from '$lib/images/che.png';
    import Karina from '$lib/images/xavier.png';

    // Restaurante

    import Sabor from '$lib/images/Marmitaria-Dona-do-Sabor.png';
    import Trem from '$lib/images/Trem-Minero-Bar-e-Restaurante.png';
    import Gaucha from '$lib/images/Restaurante-Uniao-gaucha.png';
    import Tavola from '$lib/images/Restaurante-La-Tavola.png';
    import Santos from '$lib/images/Santos.png';
    import Aa from '$lib/images/aa.png';

    // Policia
    import Militar from '$lib/images/Policia.png';
    import Civil from '$lib/images/civil.png';

    
    // Borracheiro

    import Duhborracheiro from '$lib/images/Borracheiro.png';

    // HOtel

    import Hotelsol from '$lib/images/Hotel-Vero-Verde.png';
    
            // Veiculos
            import Porfilio from '$lib/images/portifio.png';
            import Merchan from '$lib/images/Merchan.png';
            import Skina from '$lib/images/Veiculos.png';
    

export function load() {
    return {
        categories:[
            'Todos',
            'Prefeitura',
            'Polícia',
            'Saúde',
            'Hotel',

            'Supermercado',
            'Farmacia',
            'Deposito de bebidas',
            'Loja da Construção',
            'Lanchonete',
            'Restaurante',
            'Posto de Gasolina',
            'Loja De Moda Infantil',
            'Loja De Roupas',
            'Borracheiro',
            'Venda De Veículos',

            
        ],
        items: [
               // Prefeitura
               { slug: 'Prefeitura-Municipal-de-Luiz-Antonio', title: 'Prefeitura Municipal de Luiz Antônio', category: 'Prefeitura', facebook:'https://www.facebook.com/imprensaluizantonio?locale=pt_BR', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14843.441507219095!2d-47.716506835028355!3d-21.55231413369815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375a54b9c06f%3A0xac861ac6ace6c6e8!2sPrefeitura%20Municipal%20de%20Luiz%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1730902932362!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Prefeitura },
            
            // Polícia Militar do Estado de São Paulo
            { slug: 'Policia-Militar-do-Estado-de-Sao-Paulo', title: 'Polícia Militar do Estado de São Paulo', telefone:'1639831212',category: 'Polícia', facebook:'https://www.facebook.com/profile.php?id=100067434010678', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8606767899664!2d-47.709887153147484!3d-21.55230240665035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83768c7b03cc1%3A0x12be418df378e695!2sPol%C3%ADcia%20Militar%20do%20Estado%20de%20S%C3%A3o%20Paulo!5e0!3m2!1spt-BR!2sbr!4v1731021416785!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Militar },
            { slug: 'Delegacia-de-Policia-Civil', title: 'Delegacia de Polícia Civil', telefone:'1639831413',category: 'Polícia', facebook:'https://www.facebook.com/profile.php?id=100067434010678', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.882118412498!2d-47.71019828939322!3d-21.551464193096777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376e49ee28d5%3A0x5d85b41e756593ea!2sDelegacia%20de%20Pol%C3%ADcia%20Civil!5e0!3m2!1spt-BR!2sbr!4v1731021384484!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Civil },

            //    Hotel
            { slug: 'Hotel-Vero-Verde', title: 'Hotel Vero Verde', telefone:'1639832055',whatsapp:'1639832055',category: 'Hotel', facebook:'https://www.facebook.com', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.868407370839!2d-47.704434199999994!3d-21.5520002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837688dd4d1c9%3A0xb69b943214bd2375!2sHotel%20Vero%20Verde!5e0!3m2!1spt-BR!2sbr!4v1731022397815!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Hotelsol },

               //Supermercado
            {slug:  'FERA-Supermercado', title: 'FERA Supermercado', category: 'Supermercado',telefone:'(16) 99630-5735',whatsapp:'16996305735', hours: "Seg-Sex: 	08:00–21:00", image: Fera, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.766399826033!2d-47.69469402394039!3d-21.55598759099695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83707097b0cd5%3A0x11c0bacf2ff424c1!2sFERA%20Supermercado!5e0!3m2!1spt-BR!2sbr!4v1731010167469!5m2!1spt-BR!2sbr'},
            {slug:  'FERNANDES-SUPERMERCADO', title: 'FERNANDES SUPERMERCADO', category: 'Supermercado',telefone:'01639831144',whatsapp:'5', hours: "Seg-Sex: 	07:00–21:00", image: Fernandes, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.83578392677!2d-47.7043622!3d-21.553275499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375eee0cdc5d%3A0x1dc6fbfc166bfc3f!2sFERNANDES%20SUPERMERCADO!5e0!3m2!1spt-BR!2sbr!4v1731013049285!5m2!1spt-BR!2sbr'},
            {slug:  'SUPERMERCADO-BITTAR', title: 'SUPERMERCADO BITTAR', category: 'Supermercado',telefone:'01639831269',whatsapp:'01639831269', hours: "Seg-Sex: 	07:00–19:00", image: BITTAR, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8129671440515!2d-47.7055318206543!3d-21.554167400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375da98eeef1%3A0xa4601157b66cb344!2sSUPERMERCADO%20BITTAR!5e0!3m2!1spt-BR!2sbr!4v1731013230685!5m2!1spt-BR!2sbr'},
            {slug:  'Supermercado-Sacchi-e-Guedes', title: 'Supermercado Sacchi e Guedes', category: 'Supermercado',telefone:'01639831138',whatsapp:'01639831138', hours: "Seg-Sex: 	08:00–19:00", image: Sacchi, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7717595827944!2d-47.7011315!3d-21.555778099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375c26ca2949%3A0x61e0d7764f951256!2sSupermercado%20Sacchi%20e%20Guedes!5e0!3m2!1spt-BR!2sbr!4v1731013471448!5m2!1spt-BR!2sbr'},
            {slug:  'Real-Lopes-Supermercado', title: 'Real Lopes Supermercado', category: 'Supermercado',telefone:'016994524216',whatsapp:'016994524216', hours: "Seg-Sex: 	06:00–20:00", image: Lops, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8260960496027!2d-47.7139587!3d-21.5536542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376fc43cb119%3A0xcd95566d67e97f43!2sReal%20Lopes%20Supermercado!5e0!3m2!1spt-BR!2sbr!4v1731013658723!5m2!1spt-BR!2sbr'},
            {slug:  'Supermercado-Martins', title: 'Supermercado Martins', category: 'Supermercado',telefone:'01639831437',whatsapp:'01639831437', hours: "Seg-Sex: 	07:00–20:00", image: Martins, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7765413146185!2d-47.694575620654305!3d-21.555591200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83724c8f604b5%3A0x7cedc0fbf1e3ad8e!2sSupermercado%20Martins!5e0!3m2!1spt-BR!2sbr!4v1731013928758!5m2!1spt-BR!2sbr'},
            // Farmacia
            { slug:  'Drogaria-Total-Unipharma-I', title: 'Drogaria Total - Unipharma I', category: 'Farmacia',telefone:'(16) 3983-2066',whatsapp:'16996305735', hours : "Seg-Sex: 08h às 18h", image: DrogariaTotal, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1855.4228604942155!2d-47.706111185252624!3d-21.5528870527717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d3ec9eeb7%3A0xf38f336f640d20ac!2sDrogaria%20Total%20-%20Unipharma%20I!5e0!3m2!1spt-BR!2sbr!4v1731010254862!5m2!1spt-BR!2sbr'},
            { slug:  'Drogaria-Total-Farmavip-3', title: 'Drogaria Total - Farmavip 3', category: 'Farmacia',telefone:'(16) 3983-1235',hours: "Seg-Sex: 08h às 18h", image: DrogariaTotalVip, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1855.426588332413!2d-47.70389466118652!3d-21.55259560038518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8378a6c69bf19%3A0x5a3d4fd83ab18224!2sDrogaria%20Total%20-%20Farmavip%203!5e0!3m2!1spt-BR!2sbr!4v1731010321996!5m2!1spt-BR!2sbr'},
            { slug:  'Drogaria-Total-Unipharma-II', title: 'Drogaria Total - Unipharma II', category: 'Farmacia',telefone:'(16) 3983-1577',hours: "Seg-Sex: 08h às 18h", image: UnipharmaII, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1855.4015658856151!2d-47.70257526114867!3d-21.55455185041849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837cf27a0bf49%3A0x9b2b7e5057cc10cc!2sDrogaria%20Total%20-%20Unipharma%20II!5e0!3m2!1spt-BR!2sbr!4v1731010368704!5m2!1spt-BR!2sbr' },
            { slug:  'Drogaria-Brasil', title: 'Drogaria Brasil', category: 'Farmacia',telefone:'(16) 3983-6439',hours: "Seg-Sex: 08h às 20h", image: DrogariaBrasil, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1855.4145343384646!2d-47.70233826118633!3d-21.553538000401232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837915c73a667%3A0xc93e2c519126ac61!2sDrogaria%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1731010411270!5m2!1spt-BR!2sbr' },

            // Restaurante
            { slug:  'Marmitaria-Dona-do-Sabor', title: 'Marmitaria Dona do Sabor', category: 'Restaurante',telefone:'16993676602',whatsapp:'16993676602',hours: "Seg-Sex: 08h às 20h", image: Sabor, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.66998690237!2d-47.7131883!3d-21.5533064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837ec92974587%3A0xb516cb3212112455!2sMarmitaria%20Dona%20do%20Sabor!5e0!3m2!1spt-BR!2sbr!4v1731018888833!5m2!1spt-BR!2sbr' },
            { slug:  'Trem-Minero-Bar-e-Restaurante', title: 'Trem Minero Bar e Restaurante', category: 'Restaurante',telefone:'1639831493',whatsapp:'1639831493',hours: "Seg-Sex: 08h às 20h", image: Trem, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.718698649114!2d-47.7028769!3d-21.552354299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d3bcee69d%3A0x5d2ee7691735ec23!2sTrem%20Minero%20Bar%20e%20Restaurante!5e0!3m2!1spt-BR!2sbr!4v1731019232903!5m2!1spt-BR!2sbr' },
            { slug:  'Restaurante-Uniao-gaucha', title: 'Restaurante União gaucha', category: 'Restaurante',telefone:'16994220997',whatsapp:'16994220997',hours: "Seg-Sex: 08h às 20h", image: Gaucha, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.913239401581!2d-47.6936914270836!3d-21.54855148602428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837f0b82ac919%3A0x5e7f0e3a79349b2f!2sRestaurante%20Uni%C3%A3o%20gaucha!5e0!3m2!1spt-BR!2sbr!4v1731019512481!5m2!1spt-BR!2sbr' },
            { slug:  'Restaurante-La-Tavola', title: 'Restaurante La Tavola', category: 'Restaurante',telefone:'1639831505',whatsapp:'(16) 3983-1505',hours: "Seg-Sex: 08h às 20h", image: Aa, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.639303742945!2d-47.702642499999996!3d-21.5539061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d05ca7583%3A0xaba73c9586274c83!2sRestaurante%20La%20Tavola!5e0!3m2!1spt-BR!2sbr!4v1731019717163!5m2!1spt-BR!2sbr' },
            { slug:  'Adega-Santos-Restaurante-E-Lanchonete', title: 'Adega Santôs Restaurante E Lanchonete', category: 'Restaurante',telefone:'0',whatsapp:'0',hours: "Seg-Sex: 08h às 20h", image: Santos, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.796889732849!2d-47.69907798565023!3d-21.55082592510156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375b4e2016df%3A0x8a70df70c1e695b!2sAdega%20Sant%C3%B4s%20Restaurante%20E%20Lanchonete!5e0!3m2!1spt-BR!2sbr!4v1731019973368!5m2!1spt-BR!2sbr' },


            // Deposito de bebidas
            { slug:  'Deposito-de-bebidas-e-mercado-no-grau', title: 'Deposito de bebidas e mercado no grau', category: 'Deposito de bebidas',telefone:' (16) 99734-7340',whatsapp:'16997347340', hours: "Seg-Sex: 08h às 22h", image: Grau, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7565828614984!2d-47.69434432394027!3d-21.55637129100986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837dad614d4f1%3A0xb184aa3567d985ed!2sDeposito%20de%20bebidas%20e%20mercado%20no%20grau!5e0!3m2!1spt-BR!2sbr!4v1731010445702!5m2!1spt-BR!2sbr'},
            { slug:  'Mercado-Bebidas-Em-Geral', title: 'Mercado Bebidas Em Geral', category: 'Deposito de bebidas',telefone:'555555555',hours: "Seg-Sex: 08h às 22h", image: MercadoBebidas, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.9503968139006!2d-47.70667922394037!3d-21.548794790754936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837427187d943%3A0xa24699520099c374!2sMercado%20Bebidas%20Em%20Geral!5e0!3m2!1spt-BR!2sbr!4v1731010485558!5m2!1spt-BR!2sbr'},
           
            // Saúde
            { slug: 'Unidade-de-Saude-Dr-Eilio-Serafim', title: 'Unidade de Saúde Dr Emílio Serafim', category: 'Saúde',telefone:'1639831278',hours: "Seg-Domingo: 24h", image: Emílio, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8811234200844!2d-47.712076123940484!3d-21.551503090846026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376e5357287b%3A0x2862e8c7a6b29f3e!2sUnidade%20de%20Sa%C3%BAde%20Dr%20Em%C3%ADlio%20Serafim!5e0!3m2!1spt-BR!2sbr!4v1731010520450!5m2!1spt-BR!2sbr'},
            { slug: 'Unidade-Mista-de-Luiz-Antonio', title: 'Unidade Mista de Luiz Antônio', category: 'Saúde',telefone:'(16) 3983-1203',hours: "Seg-Domingo: 24h", image: UnidadeUnidade, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.826265124066!2d-47.70453242394035!3d-21.553647590918168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375cfef07e2b%3A0x8c3b867831758dde!2sUnidade%20Mista%20de%20Luiz%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1731010556359!5m2!1spt-BR!2sbr' },
            { slug: 'Sao-Francisco-saude', title: 'São Francisco saúde', category: 'Saúde',telefone:'(16) 3983-6222',hours: "Seg-Sex: 08h às 18h", image: SaoFrancisco, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1928.2620631383263!2d-47.70361933026291!3d-21.553129179884653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83700647df5c7%3A0x8e2099e7817b6a69!2zU8OjbyBGcmFuY2lzY28gc2HDumRl!5e0!3m2!1spt-BR!2sbr!4v1731010615839!5m2!1spt-BR!2sbr' },
            { slug: 'Sala-de-vacinacao-Emilio-Serafim', title: 'Sala de vacinação Emílio Serafim', category: 'Saúde',telefone:'1639831733',whatsapp:'1639831733',hours: "Seg-Domingo: 24h", image: Vacina, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8811234200844!2d-47.712076123940484!3d-21.551503090846026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376e5357287b%3A0x2862e8c7a6b29f3e!2sUnidade%20de%20Sa%C3%BAde%20Dr%20Em%C3%ADlio%20Serafim!5e0!3m2!1spt-BR!2sbr!4v1731010520450!5m2!1spt-BR!2sbr'},
            { slug: 'Transporte-Emilio-Serafim', title: 'Transporte Emílio Serafim', category: 'Saúde',telefone:'1639831319',whatsapp:'1639831319',hours: "Seg-Domingo: 24h", image: Transporte, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8811234200844!2d-47.712076123940484!3d-21.551503090846026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376e5357287b%3A0x2862e8c7a6b29f3e!2sUnidade%20de%20Sa%C3%BAde%20Dr%20Em%C3%ADlio%20Serafim!5e0!3m2!1spt-BR!2sbr!4v1731010520450!5m2!1spt-BR!2sbr'},
            
            // Veiculos
            { slug: 'Porfirio-Veiculos', title: 'Porfirio Veículos', category: 'Venda De Veículos',telefone:'16999910568', whatsapp:'16999910568',hours: "Seg-Sex: 07:30h às 17:00",facebook:'https://www.facebook.com/profile.php?id=100085847426766', image: Porfilio, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7704935312818!2d-47.70337522452274!3d-21.55582758495667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375dc3c74269%3A0x408b39b6f6aa61f3!2sR.%20Jos%C3%A9%20Carneiro%20Mesquita%2C%20645%20-%20Centro%2C%20Lu%C3%ADs%20Ant%C3%B4nio%20-%20SP%2C%2014210-000!5e0!3m2!1spt-BR!2sbr!4v1731027902463!5m2!1spt-BR!2sbr' },
            { slug: 'Merchan', title: 'Merchan', category: 'Venda De Veículos',telefone:'1639240401', whatsapp:'16992212498',hours: "Seg-Sex: 07:30h às 17:00",facebook:'https://www.facebook.com/marcosmerchan.merchan?mibextid=LQQJ4d&rdid=JGf29mEbPFjkyQVQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CzeVJUETq%2F%3Fmibextid%3DLQQJ4d', image: Merchan, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7871205712436!2d-47.71247152394039!3d-21.555177690969813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d3c7f8509%3A0x8b299f46f4af9d4!2sMerchan%20Multimarcas!5e0!3m2!1spt-BR!2sbr!4v1731028189698!5m2!1spt-BR!2sbr' },
            { slug: 'Skina-Veiculos-Luiz-Antonio', title: 'Skina Veículos Luiz Antônio', category: 'Venda De Veículos',telefone:'16991337490', whatsapp:'16991337490',hours: "Seg-Sex: 07:30h às 17:00",facebook:'https://www.facebook.com/profile.php?id=100081800174447&sk=about', image: Skina, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d607.3689910674143!2d-47.702052124471095!3d-21.55205832547265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731028702805!5m2!1spt-BR!2sbr' },


            // Loja-da-Construção
            { slug: 'Loja-da-Construcao', title: 'Receitas Macarrônicas', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: Construção, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7876984817008!2d-47.70463450591902!3d-21.555155102095803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83784f6dbeb51%3A0x36a8c4feac3b5cb4!2zTG9qYSBkYSBDb25zdHJ1w6fDo28!5e0!3m2!1spt-BR!2sbr!4v1731010652770!5m2!1spt-BR!2sbr' },
            { slug: 'rodrigues-mat-deposito-renato', title: 'rodrigues mat deposito renato', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: rodrigues, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.804972718956!2d-47.7049820239404!3d-21.554479890946233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8377b6cf4d2c7%3A0xc32d922f1e90318f!2srodrigues%20mat%20deposito%20renato!5e0!3m2!1spt-BR!2sbr!4v1731010691721!5m2!1spt-BR!2sbr'},
           
            //    Lanchonete
            {slug: 'Kilanchao', title: 'Kilanchao', category: 'Lanchonete',telefone:'(16) 3983-6945',hours: "Seg-Sex: 18h às 01:30", image: Kilanche, facebook:'https://www.facebook.com/cleufasazedo75/?locale=pt_BR', instagram:'https://www.instagram.com/killanchao/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8501020696717!2d-47.70486132394043!3d-21.552715790886833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d200f8def%3A0xa97c54fb53a7f139!2sKilanchao!5e0!3m2!1spt-BR!2sbr!4v1731010720495!5m2!1spt-BR!2sbr'},
            {slug: 'Trailer-do-Joao', title: 'Trailer do João', category: 'Lanchonete',telefone:'(16) 99230-5994', whatsapp:'16992305994',hours: "Quart-Sex: 19h às 23h", image: Trailerjoao, facebook:'https://www.facebook.com/trailerdojoao/?locale=pt_BR', instagram:'https://www.instagram.com/joaodotrailler/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d927.7177977863007!2d-47.702829947863634!3d-21.55189137470216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837000fd65ed1%3A0x1b8213587b44c678!2sTrailer%20do%20Jo%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1731009889788!5m2!1spt-BR!2sbr'},
          
            //   Posto de Gasolina
            {slug: 'Auto-Posto-Colorado', title: 'Auto Posto Colorado', category: 'Posto de Gasolina',telefone:'(11) 4032-7059', whatsapp:'(11) 4032-7059',hours: "Quart-Sex: 06h às 23h", image: Colorado, facebook:'https://www.facebook.com/ipirangaoficial', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},
            {slug: 'Posto-Ipiranga', title: 'Posto Ipiranga', category: 'Posto de Gasolina',telefone:'(11) 4032-7059', whatsapp:'(11) 4032-7059',hours: "Quart-Sex: 06h às 22h", image: Iguatemi, facebook:'https://www.facebook.com/ipirangaoficial', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},
            {slug: 'Posto-Iguatemi', title: 'Posto Iguatemi Luís Antônio', category: 'Posto de Gasolina',telefone:'01635316497', whatsapp:'(11) 4032-70594',hours: "Quart-Sex: 06h às 22h", image: Iguatemis, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},

            
            //   Loja De Moda Infantil
            {slug: 'Cegonhitas-kids-store', title: 'Cegonhitas - Kids Store', category: 'Loja De Moda Infantil',telefone:'016996274253', whatsapp:'016996274253',hours: "Quart-Sex: 06h às 22h", image: Cegonhitas, facebook:'https://www.facebook.com/cegonhitas', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.465330155181!2d-47.703221299999996!3d-21.557306099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837695a9932b3%3A0x7c1051ae376aba86!2sCegonhitas%20-%20Kids%20Store!5e0!3m2!1spt-BR!2sbr!4v1731014353009!5m2!1spt-BR!2sbr'},
            {slug: 'Dulorekids', title: 'Dulorekids', category: 'Loja De Moda Infantil',telefone:'016991746213', whatsapp:'016991746213',hours: "Quart-Sex: 09h às 18h", image: Dulorekids, facebook:'https://www.facebook.com/OsTopsDaLi', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.340252584413!2d-47.7004849!3d-21.5597502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837985ec79bbd%3A0xbe6ed251963ed501!2sDulorekids!5e0!3m2!1spt-BR!2sbr!4v1731014661463!5m2!1spt-BR!2sbr'},
            {slug: 'NINA-NYKO', title: 'NINA NYKO', category: 'Loja De Moda Infantil',telefone:'0', whatsapp:'0',hours: "Quart-Sex: 09h às 18h", image: Nina, facebook:'https://www.facebook.com/mayara.adriano.92', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.689715902919!2d-47.70356060141278!3d-21.55292078980166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d41324713%3A0xd7997dc1743388ca!2sNINA%20NYKO!5e0!3m2!1spt-BR!2sbr!4v1731017416425!5m2!1spt-BR!2sbr'},
            
            // Loja De Roupas
            {slug: 'Karina-Xavier', title: 'Karina Xavier', category: 'Loja De Roupas',telefone:'16992331004', whatsapp:'16992331004',hours: "Quart-Sex: 09h às 18h", image: Karina, facebook:'https://www.facebook.com/karina.navesxavier', instagram:'https://www.instagram.com/karinaxxavier?igsh=end3MDZ6NXI3ODZr', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.827402274354!2d-47.709838614247296!3d-21.553603139925226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837afc90cdf8f%3A0xc0964b6bcd3b6ec2!2sKarina%20Xavier%20Ateli%C3%AA!5e0!3m2!1spt-BR!2sbr!4v1731024440705!5m2!1spt-BR!2sbr'},
            
            {slug: 'New-Place-Modas', title: 'New Place Modas', category: 'Loja De Roupas',telefone:'(16) 3983-1329', whatsapp:'016982070897',hours: "Quart-Sex: 09h às 18h", image: Newroupa, facebook:'https://www.facebook.com/profile.php?id=100083104460217', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.673036060404!2d-47.70432564503778!3d-21.55324680357175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83782b36e8af9%3A0xc9fda462c3c7b40a!2sNew%20Place%20Modas!5e0!3m2!1spt-BR!2sbr!4v1731015085728!5m2!1spt-BR!2sbr'},
            {slug: 'Moda-viva', title: 'Moda viva', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Viva, facebook:'https://www.facebook.com/profile.php?id=100057246558421', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.642024382725!2d-47.70379627005271!3d-21.553852925946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d71b1b591%3A0x96f1ce1aba9cbe56!2sModa%20xiva!5e0!3m2!1spt-BR!2sbr!4v1731015391185!5m2!1spt-BR!2sbr'},
            {slug: 'Lauanne-Moda-Feminina', title: 'Lauanne Moda Feminina', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Lauanne, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.642024382725!2d-47.70379627005271!3d-21.553852925946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d71b1b591%3A0x96f1ce1aba9cbe56!2sModa%20xiva!5e0!3m2!1spt-BR!2sbr!4v1731015391185!5m2!1spt-BR!2sbr'},
            // {slug: 'Por-Do-Sol-Modas', title: 'Por Do Sol Modas', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Sol, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.660156226998!2d-47.71222044159214!3d-21.55349854152701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376f9f33d0c7%3A0x76ffeb566238c9bc!2sPor%20Do%20Sol%20Modas!5e0!3m2!1spt-BR!2sbr!4v1731015904803!5m2!1spt-BR!2sbr'},
            // {slug: 'Fenix-Boutique', title: 'Fênix Boutique', category: 'Loja De Roupas',telefone:'0', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Fenix, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.5409870625635!2d-47.70337522452274!3d-21.55582758495667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375de98d0051%3A0x1ea373784fffda26!2sF%C3%AAnix%20Boutique!5e0!3m2!1spt-BR!2sbr!4v1731016366970!5m2!1spt-BR!2sbr'},
            {slug: 'Wagner-Luiz-Marques', title: 'Wagner Luiz Marques', category: 'Loja De Roupas',telefone:'01639831386', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Wagner, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.915092850343!2d-47.70401938570193!3d-21.54851525238823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376a07247763%3A0x97b2ad2d45a205f2!2sWagner%20Luiz%20Marques!5e0!3m2!1spt-BR!2sbr!4v1731016622657!5m2!1spt-BR!2sbr'},
            {slug: 'Modas-E-Acessorios-Z', title: 'Modas E Acessorios Z', category: 'Loja De Roupas',telefone:'0', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Mida, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.6992296837725!2d-47.70492809555918!3d-21.55273483728771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83767fbc821d1%3A0x182e5d1d6419ac1d!2sModas%20E%20Acessorios%20Z!5e0!3m2!1spt-BR!2sbr!4v1731017796610!5m2!1spt-BR!2sbr'},
            {slug: 'Chelly-modas', title: 'Chelly modas', category: 'Loja De Roupas',telefone:'0', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Chery, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.694533086732!2d-47.70202160204177!3d-21.55282663526548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ce1ce4447%3A0xf5981576cee6f003!2sChelly%20modas!5e0!3m2!1spt-BR!2sbr!4v1731018019794!5m2!1spt-BR!2sbr'},
            
            // Borracheiro
            { slug: 'Borracheiro-movel-24h-Duh-Borracheiro', title: 'Borracheiro móvel 24h - Duh Borracheiro', category: 'Borracheiro',telefone:'016993382359',hours: "Seg-Sex: 08h às 18h", image: Duhborracheiro, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.31785684415!2d-47.6916355!3d-21.560187799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b839fb02eddde9%3A0xe620c9ddfa323ceb!2sBorracheiro%20m%C3%B3vel%2024h%20-%20Duh%20Borracheiro!5e0!3m2!1spt-BR!2sbr!4v1731018377945!5m2!1spt-BR!2sbr' },
            
            
            // Marmitex

            
           

        ]
    }
    
}


