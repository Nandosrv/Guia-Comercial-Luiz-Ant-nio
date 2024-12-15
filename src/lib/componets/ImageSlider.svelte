<script>
	import ondontolo from '$lib/images/ondontolo.png';
    import Gelindo from '$lib/images/gelindo.png';
    import Bin from '$lib/images/Bim.png';
    import Nunes from '$lib/images/nunes.jpg';
    // Imagens com links associados
    let images = [
        { src: Gelindo, link: 'Comercios/Gelindo-Uber' },
        { src: Bin, link: '/Comercios/Bim-Uber' },
        { src: ondontolo, link: '/Comercios/OdontoCompany' }
    ];
    let currentIndex = 0;

    function goToNext() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    // Avançar automaticamente a cada 10 segundos
    setInterval(goToNext, 10000);
</script>

<main class="flex h-[290px] w-full items-end justify-center mt-2">
    <div class="relative flex h-[290px] w-[340px] items-center justify-center">
        <!-- Tornando a imagem clicável com o link associado -->
        <a href={images[currentIndex].link} target="_blank" rel="noopener noreferrer">
            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img
                class="h-[200px] w-[315px] object-cover transition-all duration-1000 rounded-[12px]"
                src={images[currentIndex].src}
                alt="Slider Image"
            />
        </a>

        <!-- Setas de Navegação -->
        <button class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl" on:click={goToPrev}>
            &lt;
        </button>
        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl" on:click={goToNext}>
            &gt;
        </button>
    </div>
</main>

<style>
    /* Estilo adicional caso necessário */
    img {
        object-fit: cover; /* Faz a imagem cobrir todo o espaço do contêiner */
    }
</style>
