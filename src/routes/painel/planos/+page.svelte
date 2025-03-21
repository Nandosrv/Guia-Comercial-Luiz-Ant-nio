<script>
    import { Check, X } from 'lucide-svelte';
  
    let plano = {
      nome: "Plano Prêmio",
      preco: "R$ 49,90/mês",
      beneficios: [
        "Maior visibilidade nos resultados",
        "Destaque em pesquisas",
        "Suporte prioritário",
        "Publicação ilimitada de anúncios"
      ],
      ativo: true
    };
  </script>
  
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold text-gray-800">{plano.nome}</h2>
    <p class="text-gray-600 mt-2">{plano.preco}</p>
    
    <ul class="mt-4 space-y-2">
      {#each plano.beneficios as beneficio}
        <li class="flex items-center text-gray-700">
          <Check class="w-5 h-5 text-green-500 mr-2" />
          {beneficio}
        </li>
      {/each}
    </ul>
  
    <div class="mt-6 flex items-center">
      {#if plano.ativo}
        <span class="flex items-center text-green-600 font-semibold">
          <Check class="w-5 h-5 mr-1" /> Plano Ativo
        </span>
      {:else}
        <span class="flex items-center text-red-600 font-semibold">
          <X class="w-5 h-5 mr-1" /> Plano Inativo
        </span>
      {/if}
    </div>
  </div>