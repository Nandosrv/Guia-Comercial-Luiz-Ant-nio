<script context="module" lang="ts">
    // Define o tipo para os detalhes do comércio
    interface CommerceDetails {
      name: string;
      description: string;
    }
  
    // Define um tipo para o objeto de comércios
    type CommerceMap = {
      [key: string]: CommerceDetails;
    };
  
    // Define os detalhes dos comércios
    const commerceDetails: CommerceMap = {
      "mercado-sao-joao": { name: "Mercado São João", description: "O melhor mercado da cidade." },
      "pizzaria-do-luiz": { name: "Pizzaria do Luiz", description: "Pizzas deliciosas e um ambiente aconchegante." },
      "farmacia-do-povo": { name: "Farmácia do Povo", description: "Medicamentos e atendimento de qualidade." },
      "restaurante-saboroso": { name: "Restaurante Saboroso", description: "Delícias para toda a família." },
      "loja-de-roupas-chic": { name: "Loja de Roupas Chic", description: "As últimas tendências em moda." },
      "posto-gasolina-luiz": { name: "Posto de Gasolina Luiz Antônio", description: "Combustível com qualidade." },
      "text": { name: "text", description: "O melhor ponto de encontro da cidade." }
    };
  
    // Define o tipo para os parâmetros da URL
    interface LoadParams {
      id: string;
    }
  
    // A função load é usada para carregar os dados do comércio baseado no id
    export async function load({ params }: { params: LoadParams }) {
      const { id } = params;
  
      return {
        props: {
          commerce: commerceDetails[id] || { name: "Comércio não encontrado", description: "" }
        }
      };
    }
  </script>
  
  <script>
    export let commerce;
  </script>
  
  <h1>{commerce.name}</h1>
  <p>{commerce.description}</p>
  