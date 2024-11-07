<main class="w-[100%] h-[900px] flex justify-end items-end border border-red-400">
    <div class="w-full h-[500px]">
        <div class="w-full h-[250px] bg-black"></div>
        <div class="w-full h-[250px]">
            <img class="h-[266px]" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigB8iI5tb8WSVBuVUGc9UjjB8O0708X7Fdic_4O1LT4CmLHoiwhanLXiRhe82yw0R7LgACQ2IhZaTY0hhmGi0gYp_Ynb49CVzfmXtYHUVKgXXpWvJ_oYT8cB4vzsnJLe3iCwuzj-w6PeYq_JaHmy_CoGoa6nw0FBo-2xLdOPvsLTh_fmYH2xhkaZ-OGQ/s16000/footer_bg.png" alt="">
        </div>
        <div class="relative w-full h-60">
            <!-- Primeira imagem -->
            <img class="absolute animate-moveRight" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia0PYPxwT5ifToyP3SNZeQWfJEWrUENYA5IXM6sN5vLwAKvaJS1pQVu8mOFFUa_ET4JuHNTFAxKURFerJYHDUWXLXl1vDofYXuij45JZelYOjEFoCOn7E6Vxu0fwV7ACPzArcno1rYuVxGB7JY6G7__e4_KZW4lTYIaHSLVaVLzklZBLZnQw047oq5-Q/s16000/volks.gif" alt="Volkswagen">
            <!-- Segunda imagem -->
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
