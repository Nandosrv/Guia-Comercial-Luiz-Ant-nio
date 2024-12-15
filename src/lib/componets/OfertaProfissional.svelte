<script lang="ts">
  import Pirapizzas from '../images/pizzaptpt.png';
  import { onMount } from 'svelte';
  import pizzaImg2 from '../images/zero.jpg';
  import whatsappImg from '../images/icon-ws.png';
  type Oferta = {
      id: number;
      titulo: string;
      descricao: string;
      dataInicio: Date;
      dataFim: Date;
      imagemUrl: string;
      desconto: number;
      loja: string;
      whatsapp: string; // Adicionado campo de WhatsApp
  };

  const ofertas: Oferta[] = [
      {
          id: 1,
          titulo: 'JR COSTELA AO BAFO',
          descricao: 'SELF SERVICE, PRATO FEITO, MARMITEX - Atendimento Segunda a Sabado',
          dataInicio: new Date('2023-11-27T00:00:00'),
          dataFim: new Date('2023-12-02T23:59:59'),
          imagemUrl: Pirapizzas,
          desconto: 30,
          loja: 'Pizzaria Exemplo',
          whatsapp: '16996384606', // Número do WhatsApp
      },
      {
          id: 2,
          titulo: 'Oferta de Pizza 2',
          descricao: 'Deliciosa pizza com 40% de desconto',
          dataInicio: new Date('2023-11-27T00:00:00'),
          dataFim: new Date('2023-12-02T23:59:59'),
          imagemUrl: pizzaImg2,
          desconto: 40,
          loja: 'Pizzaria Gourmet',
          whatsapp: '+5511988888888', // Número do WhatsApp
      }, {
          id: 3,
          titulo: 'Oferta de Pizza 2',
          descricao: 'Deliciosa pizza com 40% de desconto',
          dataInicio: new Date('2023-11-27T00:00:00'),
          dataFim: new Date('2023-12-02T23:59:59'),
          imagemUrl: pizzaImg2,
          desconto: 40,
          loja: 'Pizzaria Gourmet',
          whatsapp: '+5511988888888', // Número do WhatsApp
      },
  ];

  let tempoRestante: { [key: number]: string } = {};

  function atualizarTempoRestante() {
      const agora = new Date();
      ofertas.forEach(oferta => {
          const diferenca = oferta.dataFim.getTime() - agora.getTime();

          if (diferenca > 0) {
              const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
              const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
              const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

              tempoRestante[oferta.id] = `${String(dias).padStart(2, '0')}d:${String(horas).padStart(2, '0')}h:${String(minutos).padStart(2, '0')}m:${String(segundos).padStart(2, '0')}s`;
          } else {
              tempoRestante[oferta.id] = 'Oferta encerrada';
          }
      });
  }

  onMount(() => {
      atualizarTempoRestante();
      const intervalo = setInterval(atualizarTempoRestante, 1000);
      return () => clearInterval(intervalo);
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {#each ofertas as oferta}
      <div class=" border border-black bg-gradient-to-br from-purple-950 to-purple-900 shadow-xl rounded-lg overflow-hidden">
          <div class="relative">
              <img src={oferta.imagemUrl} alt={oferta.titulo} class="w-full h-48 lg:h-[400px] bg-center bg-cover" />
              <div class="absolute top-0 left-0 bg-red-600 text-white px-4 py-2 rounded-br-lg font-bold text-xl">
                  -{oferta.desconto}%
              </div>
          </div>
          <div class="p-4 flex flex-col justify-between">
              <h2 class="text-2xl font-bold text-white mb-2">{oferta.titulo}</h2>
              <p class="text-white mb-4">{oferta.descricao}</p>
              <div class="mb-4">
                  <div class="text-sm text-white mb-1">
                      Válido de {oferta.dataInicio.toLocaleDateString()} a {oferta.dataFim.toLocaleDateString()}
                  </div>
                  <div class="flex items-center space-x-2">
                      <span class="font-semibold text-white">Tempo restante:</span>
                      <span class="font-bold text-white text-xl">{tempoRestante[oferta.id] || 'Carregando...'}</span>
                  </div>
              </div>
              <div class="flex justify-between items-center gap-2">
                  <a
                      href={`https://wa.me/${oferta.whatsapp}?text=Olá,%20tenho%20interesse%20na%20oferta%20${oferta.titulo}`}
                      target="_blank"
                      class="w-[200px] h-[50px] bg-green-500 hover:bg-green-600 text-white font-semibold  rounded-full transition duration-300 flex items-center space-x-2"
                  >
                      <img src="{whatsappImg}" alt="WhatsApp" class="ml-1 w-6 h-6 text-white" />
                     
                      <span class="font-semibold text-white">WhatsApp</span>
                  </a>
                  <button
                      on:click={() => alert(`Redirecionando para: ${oferta.titulo}`)}
                      class="h-[50px] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 flex items-center"
                  >
                      Ver oferta
                  </button>
              </div>
          </div>
      </div>
  {/each}
</div>
