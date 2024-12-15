<script>
    import ASSSSIS from '$lib/images/ASSSSIS.png';
    import ELETR from '$lib/images/ELETR.png';
    import Saude from '$lib/images/saude.png';
    import MARCENEIRO from '$lib/images/MARCENEIRO.png';
    import ADVOCACIA from '$lib/images/ADVOCACIA.png';
    import image2 from '$lib/images/image2.png';
   
    const servicos = [
        { nome: "Assistência Técnica", descricao: "Soluções completas para dispositivos", imagem: ASSSSIS },
        { nome: "Eletricista", descricao: "Serviços elétricos para sua casa", imagem: ELETR },
        { sext: "Saúde", descricao: "Cuidado médico e consultas", imagem: Saude },
        { nome: "Marceneiro", descricao: "Móveis sob medida e restaurações", imagem: MARCENEIRO },
        { nome: "Advocacia", descricao: "Consultoria e serviços jurídicos", imagem: ADVOCACIA },
        { nome: "Outro Serviço", descricao: "Descrição para o outro serviço", imagem: image2 }
    ];
</script>


<main class="grid grid-cols-2 gap-4 p-4 rounded-xl">
    <div class="flip-card">
        <div class="flip-card-inner ">
            <div class="flip-card-front">
                <img class="h-[254px] object-cover rounded-xl" src="{ASSSSIS} " alt="">
                <p class="title flex justify-center items-center w-[200px] absolute">Assistência</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back absolute">
                
                <p class="title">Assistencia</p>
                <p>Tecnica</p>
            </div>
        </div>
    </div>
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front ">
                <img class="h-[254px] object-cover rounded-xl" src="{ELETR} " alt="">
                <p class="title title flex justify-center items-center w-[200px] absolute">Eletricista</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back">
                <p class="title">Serviços elétricos para sua casa</p>
               
            </div>
        </div>
    </div>
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img class="h-[254px] object-cover rounded-xl" src="{Saude} " alt="">
                <p class="title title flex justify-center items-center w-[200px] absolute">Saúde</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back">
                <p class="title">Cuidado médico e consultas</p>
               
            </div>
        </div>
    </div>
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img class="h-[254px] object-cover rounded-xl" src="{MARCENEIRO} " alt="">
                <p class="title title flex justify-center items-center w-[200px] absolute">Marceneiro</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back">
                <p class="title">Móveis sob medida e restaurações</p>
                <!-- <p>Tecnica</p> -->
            </div>
        </div>
    </div>
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img class="h-[254px] object-cover rounded-xl" src="{ADVOCACIA} " alt="">
                <p class="title flex justify-center items-center w-[200px] absolute">Advocacia</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back">
                <p class="title1">Consultoria e serviços jurídicos</p>
              
            </div>
        </div>
    </div>
    <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img class="h-[254px] object-cover rounded-xl" src="{image2} " alt="">
                <p class="title title flex justify-center items-center w-[200px] absolute">Outro Serviço</p>
                <!-- <p>Hover Me</p> -->
            </div>
            <div class="flip-card-back">
                <p class="title">Outros serviços</p>
            </div>
        </div>
    </div>
</main>



<style>
    .flip-card {
  background-color: transparent;
  width: 190px;
  height: 254px;
  perspective: 1000px;
  font-family: sans-serif;
}

.title {

  font-size: 1.5em;
  font-weight: 900;
  text-align: center;
  margin: 0;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 1rem;
}

.flip-card-front {
  background: linear-gradient(120deg, bisque 60%, rgb(255, 231, 222) 88%,
     rgb(255, 211, 195) 40%, rgba(255, 127, 80, 0.603) 48%);
  color: coral;
}

.flip-card-back {
  background: linear-gradient(120deg, rgb(255, 174, 145) 30%, coral 88%,
     bisque 40%, rgb(255, 185, 160) 78%);
  color: white;
  transform: rotateY(180deg);
}
</style>