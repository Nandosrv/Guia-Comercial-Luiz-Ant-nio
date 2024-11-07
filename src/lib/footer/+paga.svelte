<script>
    import logos from '$lib/images/new.png'
    import Instagram from '$lib/images/icons8-instagram-64.png'
    import Facebook from '$lib/images/icons8-facebook-novo-48.png'
    import Whatz from '$lib/images/icon-ws.png'
  
</script>

<main class="w-[100%] h-[800px] flex justify-end items-end  ">
    <div class="w-full h-[310px]  bg-[#09052D]">
        <div class="w-full h-[250px]  flex gap-5 justify-center items-center">
           <div class="w-[95%]   h-[240px] flex flex-col gap-2 justify-center items-center">
            <div class="w-[100%] h-[150px] flex justify-center items-center ">
                <div class="w-[150px] h-[150px]  justify-center items-center flex flex-col gap-4">
                    <a href="/">
                        <img class="w-[100px] h-[100px] " src="{logos} " alt="">
                    </a>
                    <p class="text-white  ">Guia Luiz Antônio</p>

                        <div class="flex gap-4">
                            <a href="/"><img class="w-[40px] " src="{Whatz}" alt=""></a>
                        <a href="/"><img class="w-[40px] " src="{Instagram}" alt=""></a>
    
                        <a href="/"><img class="w-[40px] " src="{Facebook}" alt=""></a>
                        </div>
                </div>

            </div>
            <div class="mt-5 w-[100%] h-[50px] flex justify-center items-center">
                <p class="text-white">© 2024 Todos os direitos reservados.</p>
            </div>
           </div>

  
      
     

         </div>
        <div class="w-full h-[150px]">
            <img class="h-[266px]" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigB8iI5tb8WSVBuVUGc9UjjB8O0708X7Fdic_4O1LT4CmLHoiwhanLXiRhe82yw0R7LgACQ2IhZaTY0hhmGi0gYp_Ynb49CVzfmXtYHUVKgXXpWvJ_oYT8cB4vzsnJLe3iCwuzj-w6PeYq_JaHmy_CoGoa6nw0FBo-2xLdOPvsLTh_fmYH2xhkaZ-OGQ/s16000/footer_bg.png" alt="">
        </div>
        <div class="relative w-full h-60">
            <img class="absolute animate-moveRight" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia0PYPxwT5ifToyP3SNZeQWfJEWrUENYA5IXM6sN5vLwAKvaJS1pQVu8mOFFUa_ET4JuHNTFAxKURFerJYHDUWXLXl1vDofYXuij45JZelYOjEFoCOn7E6Vxu0fwV7ACPzArcno1rYuVxGB7JY6G7__e4_KZW4lTYIaHSLVaVLzklZBLZnQw047oq5-Q/s16000/volks.gif" alt="Volkswagen">
            <img class="h-[100px] w-[80px] absolute animate-moveRight delay-100" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyLGwEUVwPK6Vi8xXMymsc-ZXVwLWyXhogZxbcXQYSY55REw_0D4VTQnsVzCrL7nsyjd0P7RVOI5NKJbQ75koZIalD8mqbMquP20fL3DxsWngKkOLOzoOf9sMuxlbyfkIBTsDw5WFUj-YJiI50yzgVjF8cZPHhEjkOP_PRTQXDHEq8AyWpBiJdN9SfQA/s16000/cyclist.gif" alt="Cyclist">
        </div>
    </div>
</main>

<style>
    .animate-moveRight {
        animation: moveRight 10s linear infinite;
    }

    .delay-100 {
        animation-delay: 2s; /* Delay de 1 segundo para a segunda imagem */
    }

    @keyframes moveRight {
        0% {
            transform: translateX(-100vw); /* Começa fora da tela à esquerda */
        }
        100% {
            transform: translateX(100vw); /* Move para fora da tela à direita */
        }
    }
</style>
