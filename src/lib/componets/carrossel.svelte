<script>
    import Bannervender from '$lib/images/Bannervender.png';
    import bannerseguro from '$lib/images/Bannerseguro.png';
    import Bannerprepara from '$lib/images/Bannerprepara.png';
    import { onDestroy } from 'svelte';

    let currentIndex = 0;
    const images = [bannerseguro, Bannervender, Bannerprepara];

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevSlide() {
        currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }

    // Auto-play with cleanup
    const interval = setInterval(nextSlide, 5000);
    onDestroy(() => clearInterval(interval));
</script>

<div class="relative w-full mx-auto group">
    <button 
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white border-none px-4 py-2 cursor-pointer text-3xl 
                transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-black/50 hover:scale-110
               md:px-3 md:py-1 md:text-xl" 
        on:click={prevSlide}
    >
        &#8249;
    </button>
     <div class="relative flex h-[300px] sm:h-[450px] lg:h-[450px] items-center justify-center">
        <div class="w-full overflow-hidden   shadow-lg  lg:h-[450px]">
            <img 
                src={images[currentIndex]} 
                alt="Banner" 
                class="w-full h-full object-cover "
            />
        </div> 
     </div>
    
    
    <button 
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white border-none px-4 py-2 cursor-pointer text-3xl 
               rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-black/50 hover:scale-110
               md:px-3 md:py-1 md:text-xl" 
        on:click={nextSlide}
    >
        &#8250;
    </button>

    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {#each images as _, i}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <button 
                class="w-3 h-3 rounded-full transition-all duration-300 {i === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}"
                on:click={() => currentIndex = i}
            />
        {/each}
    </div>
</div>

<style>
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    img {
        animation: fadeIn 0.5s ease-in;
    }

    /* Add smooth transition between slides */
    img {
        will-change: transform;
        backface-visibility: hidden;
    }
</style>