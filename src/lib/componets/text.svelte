<!-- src/routes/commerce/joao.svelte -->
<script>
    export let commerce = {
      name: "text",
      description: "Seu ponto de referência para produtos locais e atendimento de qualidade.",
      address: "Rua das Flores, 123",
      phone: "(11) 1234-5678",
      hours: "Seg-Sex: 08h às 18h"
    };
  </script>
  
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-blue-600 mb-2">{commerce.name}</h1>
    <p class="text-lg text-gray-700 mb-4">{commerce.description}</p>
    
    <div class="mb-4">
      <p class="text-base text-gray-800"><strong>Endereço:</strong> {commerce.address}</p>
      <p class="text-base text-gray-800"><strong>Telefone:</strong> {commerce.phone}</p>
      <p class="text-base text-gray-800"><strong>Horário de Funcionamento:</strong> {commerce.hours}</p>
    </div>
  
    <div class="bg-gray-100 p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold">Entre em Contato</h2>
      <p class="text-gray-600">Para mais informações, ligue para o nosso número ou visite-nos!</p>
    </div>
  </div>
  