
	import Americana from '$lib/images/th.jpeg';
	import lorm from '$lib/images/th1.jpeg';
	import Grau from '$lib/images/grau.jpg';
    import Frete from '$lib/images/frete-do-carlao.jpg';
    import Nunes from '$lib/images/nunes.jpg';
    import Whatsapps from '$lib/images/whats.png';
    import Farmaciaamericana from '$lib/images/th.jpeg';
    import Farmaciajoao from '$lib/images/th1.jpeg';
    import Oriental from '$lib/images/oriental.jpg';
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

    // Loja De Roupas

    import Newroupa from '$lib/images/New-Place-Modas.png';
    import Viva from '$lib/images/moda-vida.jpg';
    import Lauanne from '$lib/images/Lauanne-Moda-Feminina.png';
    import Sol from '$lib/images/Por-Do-Sol-Modas.png';
    import Fenix from '$lib/images/Fenix-Boutique.png';
    import Wagner from '$lib/images/Wagner.png';

    

    

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
            'Lanchonete',
            'Restaurante',
            'Posto de Gasolina',
            'Loja De Moda Infantil',
            'Loja De Roupas',

            
        ],
        items: [
               // Prefeitura
               { slug: 'Prefeitura-Municipal-de-Luiz-Antônio', title: 'Prefeitura Municipal de Luiz Antônio', category: 'Prefeitura', facebook:'https://www.facebook.com/imprensaluizantonio?locale=pt_BR', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14843.441507219095!2d-47.716506835028355!3d-21.55231413369815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375a54b9c06f%3A0xac861ac6ace6c6e8!2sPrefeitura%20Municipal%20de%20Luiz%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1730902932362!5m2!1spt-BR!2sbr', hours: "Seg-Sex: 08:00 -12:00 13:00 - 17:00", image: Prefeitura },
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

            // Deposito de bebidas
            { slug:  'Deposito-de-bebidas-e-mercado-no-grau', title: 'Deposito de bebidas e mercado no grau', category: 'Deposito de bebidas',telefone:' (16) 99734-7340',whatsapp:'16997347340', hours: "Seg-Sex: 08h às 22h", image: Grau, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7565828614984!2d-47.69434432394027!3d-21.55637129100986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837dad614d4f1%3A0xb184aa3567d985ed!2sDeposito%20de%20bebidas%20e%20mercado%20no%20grau!5e0!3m2!1spt-BR!2sbr!4v1731010445702!5m2!1spt-BR!2sbr'},
            { slug:  'Mercado-Bebidas-Em-Geral', title: 'Mercado Bebidas Em Geral', category: 'Deposito de bebidas',telefone:'555555555',hours: "Seg-Sex: 08h às 22h", image: MercadoBebidas, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.9503968139006!2d-47.70667922394037!3d-21.548794790754936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837427187d943%3A0xa24699520099c374!2sMercado%20Bebidas%20Em%20Geral!5e0!3m2!1spt-BR!2sbr!4v1731010485558!5m2!1spt-BR!2sbr'},
           
            // Saúde
            { slug: 'Unidade-de-Saúde-Dr-Emílio-Serafim', title: 'Unidade de Saúde Dr Emílio Serafim', category: 'Saúde',telefone:'(16) 3983-1278',hours: "Seg-Domingo: 24h", image: Emílio, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8811234200844!2d-47.712076123940484!3d-21.551503090846026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376e5357287b%3A0x2862e8c7a6b29f3e!2sUnidade%20de%20Sa%C3%BAde%20Dr%20Em%C3%ADlio%20Serafim!5e0!3m2!1spt-BR!2sbr!4v1731010520450!5m2!1spt-BR!2sbr'},
            { slug: 'Unidade-Mista-de-Luiz-Antônio', title: 'Unidade Mista de Luiz Antônio', category: 'Saúde',telefone:'(16) 3983-1203',hours: "Seg-Domingo: 24h", image: UnidadeUnidade, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.826265124066!2d-47.70453242394035!3d-21.553647590918168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375cfef07e2b%3A0x8c3b867831758dde!2sUnidade%20Mista%20de%20Luiz%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1731010556359!5m2!1spt-BR!2sbr' },
            { slug: 'São-Francisco-saúde', title: 'São Francisco saúde', category: 'Saúde',telefone:'(16) 3983-6222',hours: "Seg-Sex: 08h às 18h", image: SaoFrancisco, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1928.2620631383263!2d-47.70361933026291!3d-21.553129179884653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83700647df5c7%3A0x8e2099e7817b6a69!2zU8OjbyBGcmFuY2lzY28gc2HDumRl!5e0!3m2!1spt-BR!2sbr!4v1731010615839!5m2!1spt-BR!2sbr' },
            
         
            // Loja-da-Construção
            { slug: 'Loja-da-Construção', title: 'Receitas Macarrônicas', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: Construção, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.7876984817008!2d-47.70463450591902!3d-21.555155102095803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83784f6dbeb51%3A0x36a8c4feac3b5cb4!2zTG9qYSBkYSBDb25zdHJ1w6fDo28!5e0!3m2!1spt-BR!2sbr!4v1731010652770!5m2!1spt-BR!2sbr' },
            { slug: 'rodrigues-mat-deposito-renato', title: 'rodrigues mat deposito renato', category: 'Loja da Construção',telefone:'(16) 3983-1223',hours: "Seg-Sex: 07:30h às 17:00", image: rodrigues, maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.804972718956!2d-47.7049820239404!3d-21.554479890946233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8377b6cf4d2c7%3A0xc32d922f1e90318f!2srodrigues%20mat%20deposito%20renato!5e0!3m2!1spt-BR!2sbr!4v1731010691721!5m2!1spt-BR!2sbr'},
           
            //    Lanchonete
            {slug: 'Kilanchao', title: 'Kilanchao', category: 'Lanchonete',telefone:'(16) 3983-6945',hours: "Seg-Sex: 18h às 01:30", image: Kilanche, facebook:'https://www.facebook.com/cleufasazedo75/?locale=pt_BR', instagram:'https://www.instagram.com/killanchao/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.8501020696717!2d-47.70486132394043!3d-21.552715790886833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d200f8def%3A0xa97c54fb53a7f139!2sKilanchao!5e0!3m2!1spt-BR!2sbr!4v1731010720495!5m2!1spt-BR!2sbr'},
            {slug: 'Trailer-do-João', title: 'Trailer do João', category: 'Lanchonete',telefone:'(16) 99230-5994', whatsapp:'16992305994',hours: "Quart-Sex: 19h às 23h", image: Trailerjoao, facebook:'https://www.facebook.com/trailerdojoao/?locale=pt_BR', instagram:'https://www.instagram.com/joaodotrailler/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d927.7177977863007!2d-47.702829947863634!3d-21.55189137470216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837000fd65ed1%3A0x1b8213587b44c678!2sTrailer%20do%20Jo%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1731009889788!5m2!1spt-BR!2sbr'},
          
            //   Posto de Gasolina
            {slug: 'Auto-Posto-Colorado', title: 'Auto Posto Colorado', category: 'Posto de Gasolina',telefone:'(11) 4032-7059', whatsapp:'(11) 4032-7059',hours: "Quart-Sex: 06h às 23h", image: Colorado, facebook:'https://www.facebook.com/ipirangaoficial', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},
            {slug: 'Posto-Ipiranga', title: 'Posto Ipiranga', category: 'Posto de Gasolina',telefone:'(11) 4032-7059', whatsapp:'(11) 4032-7059',hours: "Quart-Sex: 06h às 22h", image: Iguatemi, facebook:'https://www.facebook.com/ipirangaoficial', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},
            {slug: 'Posto-Iguatemi', title: 'Posto Iguatemi Luís Antônio', category: 'Posto de Gasolina',telefone:'01635316497', whatsapp:'(11) 4032-70594',hours: "Quart-Sex: 06h às 22h", image: Iguatemis, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.1414504954328!2d-47.70264950583017!3d-21.55156153661401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375ccd1e10a1%3A0x8c16c8660c8bcd24!2sPosto%20Ipiranga!5e0!3m2!1spt-BR!2sbr!4v1731011049038!5m2!1spt-BR!2sbr'},

            
            //   Loja De Moda Infantil
            {slug: 'Cegonhitas-kids-store', title: 'Cegonhitas - Kids Store', category: 'Loja De Moda Infantil',telefone:'016996274253', whatsapp:'016996274253',hours: "Quart-Sex: 06h às 22h", image: Cegonhitas, facebook:'https://www.facebook.com/cegonhitas', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.465330155181!2d-47.703221299999996!3d-21.557306099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837695a9932b3%3A0x7c1051ae376aba86!2sCegonhitas%20-%20Kids%20Store!5e0!3m2!1spt-BR!2sbr!4v1731014353009!5m2!1spt-BR!2sbr'},
            {slug: 'Dulorekids', title: 'Dulorekids', category: 'Loja De Moda Infantil',telefone:'016991746213', whatsapp:'016991746213',hours: "Quart-Sex: 09h às 18h", image: Dulorekids, facebook:'https://www.facebook.com/OsTopsDaLi', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.340252584413!2d-47.7004849!3d-21.5597502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b837985ec79bbd%3A0xbe6ed251963ed501!2sDulorekids!5e0!3m2!1spt-BR!2sbr!4v1731014661463!5m2!1spt-BR!2sbr'},
            
            // Loja De Roupas
            {slug: 'New-Place-Modas', title: 'New Place Modas', category: 'Loja De Roupas',telefone:'(16) 3983-1329', whatsapp:'016982070897',hours: "Quart-Sex: 09h às 18h", image: Newroupa, facebook:'https://www.facebook.com/profile.php?id=100083104460217', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.673036060404!2d-47.70432564503778!3d-21.55324680357175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b83782b36e8af9%3A0xc9fda462c3c7b40a!2sNew%20Place%20Modas!5e0!3m2!1spt-BR!2sbr!4v1731015085728!5m2!1spt-BR!2sbr'},
            {slug: 'Moda-viva', title: 'Moda viva', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Viva, facebook:'https://www.facebook.com/profile.php?id=100057246558421', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.642024382725!2d-47.70379627005271!3d-21.553852925946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d71b1b591%3A0x96f1ce1aba9cbe56!2sModa%20xiva!5e0!3m2!1spt-BR!2sbr!4v1731015391185!5m2!1spt-BR!2sbr'},
            {slug: 'Lauanne-Moda-Feminina', title: 'Lauanne Moda Feminina', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Lauanne, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.642024382725!2d-47.70379627005271!3d-21.553852925946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375d71b1b591%3A0x96f1ce1aba9cbe56!2sModa%20xiva!5e0!3m2!1spt-BR!2sbr!4v1731015391185!5m2!1spt-BR!2sbr'},
            {slug: 'Por-Do-Sol-Modas', title: 'Por Do Sol Modas', category: 'Loja De Roupas',telefone:'(16) 3983-2007', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Sol, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.660156226998!2d-47.71222044159214!3d-21.55349854152701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376f9f33d0c7%3A0x76ffeb566238c9bc!2sPor%20Do%20Sol%20Modas!5e0!3m2!1spt-BR!2sbr!4v1731015904803!5m2!1spt-BR!2sbr'},
            {slug: 'Fenix-Boutique', title: 'Fênix Boutique', category: 'Loja De Roupas',telefone:'0', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Fenix, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.5409870625635!2d-47.70337522452274!3d-21.55582758495667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8375de98d0051%3A0x1ea373784fffda26!2sF%C3%AAnix%20Boutique!5e0!3m2!1spt-BR!2sbr!4v1731016366970!5m2!1spt-BR!2sbr'},
            {slug: 'Wagner-Luiz-Marques', title: 'Wagner Luiz Marques', category: 'Loja De Roupas',telefone:'01639831386', whatsapp:'00000',hours: "Quart-Sex: 08h às 18h", image: Wagner, facebook:'https://www.facebook.com/', instagram:'https://www.instagram.com/', maps:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7421.915092850343!2d-47.70401938570193!3d-21.54851525238823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b8376a07247763%3A0x97b2ad2d45a205f2!2sWagner%20Luiz%20Marques!5e0!3m2!1spt-BR!2sbr!4v1731016622657!5m2!1spt-BR!2sbr'},
           
            { slug: 'Receitas-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'Receitas Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'Receitas Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },
            { slug: 'text-Macarrônicas', title: 'text-Macarrônicas', category: 'Blogss',telefone:'(16) 3954-2001',hours: "Seg-Sex: 08h às 18h", image: 'https://placehold.co/600x400/EEE/31343C' },

        ]
    }
    
}


