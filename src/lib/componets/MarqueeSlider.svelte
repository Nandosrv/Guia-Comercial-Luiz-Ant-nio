<script>
	import iconpro from '$lib/images/iconpro.png';

</script>
<div class="marquee">
    <div class="slides">
      <!-- Slide 1 -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 2 -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 3 -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 4 -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
  
      <!-- Duplicando os slides para o efeito contínuo -->
      <!-- Slide 1 (duplicado) -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 2 (duplicado) -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 3 (duplicado) -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
      <!-- Slide 4 (duplicado) -->
      <div class="slide">
        <img src={iconpro} alt="iconpro" />
        <p>Até 15% de desconto na 1ª compra</p>
      </div>
    </div>
  </div>
  <style>
      .marquee {
    display: flex;
    overflow: hidden;
    width: 100%;
  }

  .slides {
    display: flex;
    animation: marquee 22s linear infinite;
  }

  .slide {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-width: max-content;
    padding: 1rem;
  }

  .marquee img {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    object-fit: cover;
  }

  .marquee p {
    width: 100%;
    text-align: center;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  </style>