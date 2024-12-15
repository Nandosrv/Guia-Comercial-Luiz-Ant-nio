<!-- <script>

    import Privac from '../../routes/Privac/+page.svelte'
    let showModal = true;

    if (typeof window !== "undefined") {
        localStorage.removeItem("cookiesAccepted");

        showModal = !localStorage.getItem("cookiesAccepted");
    }

    function acceptCookies() {
        showModal = false;
        if (typeof window !== "undefined") {
            localStorage.setItem("cookiesAccepted", "true");
        }
    }
</script> -->

<!-- {#if showModal}
    <div class="fixed bottom-0 left-0 right-0 w-4/5 max-w-[300px] bg-white rounded-2xl shadow-lg z-50 mx-auto mb-[200px]">
        <div class="flex flex-col items-center justify-between pt-9 px-6 pb-6 relative">
            <span class="relative mx-auto -mt-16 mb-8"> -->
                <!-- Coloque o SVG aqui -->
            <!-- </span> -->

            <!-- <h5 class="text-sm font-semibold mb-2 text-left mr-auto text-zinc-700">
                Sua privacidade é importante para nós
            </h5>

            <p class="w-full mb-4 text-sm text-justify">
                Processamos suas informações pessoais para medir e melhorar nossos sites e
                serviços, para auxiliar nossas campanhas e fornecer conteúdo personalizado.
                <br />
                Para mais informações, consulte nossa
                <a href="/Privac" class="font-semibold text-sm underline hover:text-[#634647]">
                    Política de privacidade
                </a>
            </p>

            <button class="text-sm mr-auto font-semibold text-zinc-600 hover:text-[#634647] underline" aria-label="More options">
                Mais opções
            </button>
            <button
                on:click={acceptCookies}
                class="absolute bottom-6 right-6 py-2 px-8 rounded-lg text-sm font-semibold bg-[#ddad81] text-[#634647] hover:bg-[#634647] hover:text-[#ddad81]"
                type="button"
                aria-label="Accept cookies"
            >
                Aceitar
            </button>
        </div>
    </div>
{/if} -->
