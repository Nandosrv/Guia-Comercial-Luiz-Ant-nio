<script lang="ts">
    export let ad: {
      id: string;
      business_name: string;
      description: string;
      image: string;
      phone_number: string;
      whatsapp: string;
      location: string;
      package: string;
      rating: number;
    };
    
    function shareAd(ad: any) {
      alert(`Compartilhar o anúncio: ${ad.business_name}`);
    }
    
  </script>
  
  <div class="p-6">
      <h3 class="text-xl font-semibold mb-2">{ad.business_name}</h3>
      
      <p class="text-gray-600 dark:text-gray-300 mb-2">{ad.description}</p>
      <div class="flex items-center">
        <span class="text-yellow-400 mr-1">⭐</span>
        <span>{ad.rating && !isNaN(ad.rating) ? ad.rating.toFixed(1) : '0.0'}</span>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <button on:click={() => shareAd(ad)} class="text-primary-500 hover:text-primary-700">Compartilhar</button>
        <button>
          <a class="text-primary-500 hover:text-primary-700" href={`tel:${ad.phone_number}`} >
            Ligar
          </a>
        </button>
        <button>
          <a class="text-primary-500 hover:text-primary-700" href={`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent("Olá, estou interessado no anúncio!")}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </button>
      </div>
  </div>
  