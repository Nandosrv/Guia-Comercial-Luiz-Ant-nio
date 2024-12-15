<script lang="ts">
    // Defina a função que será chamada no evento
    const openWhatsApp = () => {
      const phoneNumber = '16996151725'; // Número de telefone no formato correto
      const message = encodeURIComponent('"Oi, estou interessado(a) em saber mais sobre [serviço/produto]."!');
      const url = `https://wa.me/${phoneNumber}?text=${message}`;
  
      window.open(url, '_blank'); // Abre o WhatsApp em uma nova aba
    };
  </script>
  
  <!-- Botão que chama a função quando clicado -->
  <button on:click={openWhatsApp} class="btn">
    <i class="animation"></i>
    <i class="animation text-white">QUEREMOS TE OUVIR!</i>
  </button>
  

<style>
    /* From Uiverse.io by mi-series */ 
.btn {
  outline: 0;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background: #FF2B2B;
  min-width: 200px;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
  box-sizing: border-box;
  padding: 16px 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  overflow: hidden;
  cursor: pointer;
}

.btn:hover {
  opacity: .95;
}

.btn .animation {
  border-radius: 100%;
  animation: ripple 0.6s linear infinite;
}

@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1);
  }

  100% {
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.1), 0 0 0 40px rgba(255, 255, 255, 0.1), 0 0 0 60px rgba(255, 255, 255, 0.1), 0 0 0 80px rgba(255, 255, 255, 0);
  }
}
</style>