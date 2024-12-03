<script lang="ts">
    import OfertaProfissional from '$lib/componets/OfertaProfissional.svelte';
    import Anuncio from '$lib/images/anuncio.png';
    import AnuncioOferts from '$lib/images/postblack.png';
</script>


<main class="w-[100%] h-[100%] gap-10 flex justify-center items-center flex-col  bg-gradient-to-br from-purple-950 to-purple-900 ">
    <div>
        <h1 class="md:hidden text-2xl font-bold tracking-wider text-white text-[35px] md:text-[60px] mt-10 ">
            Ofertas Da Semana 
          </h1>
    </div>
    <div class="w-[90%] md:w-[78%] max-sm:hidden xl:w-[44%] lg:w-[800px]  h-[400px] bg-black/40 p-4 rounded-[12px] flex justify-center items-center ">
            <!-- svelte-ignore element_invalid_self_closing_tag -->
        <img src="{AnuncioOferts}" alt="Anuncio" class="w-[100%] h-[100%] bg-center bg-no-repeat bg-cover rounded-[12px] " />
    </div>
    <div class="border border-black bg-black/40 p-4 rounded-[12px] flex flex-col justify-center items-center gap-5">
        <div class="text-white text-[30px] flex uppercase gap-5 flex-col justify-center items-center">
            ofertas da semana
            </div>
    <div>
       
    </div>
    <div class="flex justify-center items-center flex-col gap-5">
        <OfertaProfissional />
        <p class="text-white text-[50px] flex uppercase gap-5 flex-col">oferta</p>
        <OfertaProfissional />
        <p class="text-white text-[50px] flex uppercase gap-5 flex-col">oferta</p>
        <OfertaProfissional />
        <p class="text-white text-[50px] flex uppercase gap-5 flex-col">oferta</p>
        <OfertaProfissional />
    </div>
   </div>
</main>
<section class="w-[100%] h-[100% flex justify-center items-center ">
    <!-- svelte-ignore a11y_media_has_caption -->
    <!-- svelte-ignore element_invalid_self_closing_tag -->
</section>

