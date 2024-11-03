<script lang="ts">
	import Avaliacao from "../avaliacao.svelte";
import Call from "../call.svelte";
	import Review from "../Review.svelte";
	import Whatsapp from "../whatsapp.svelte";

     type Product = {
		slug: string;
		title: string;
		telefone: string;
		image: string;
      
        

	};
    type IProps = {
        product?: Product
    }
    let {product}: IProps = $props()

    let team = [
        {
      name: "Martiana dialan",
      titlle: "Product designer",
      
            
    },
    
    
    ]

</script>




<section class="py-14 flex h-[500px] border border-red-500 ">
    <div class="flex  w-full">
      
      <div class="mt-4 flex ">
        
        <ul class="flex">
          {#each team as item, idx (idx)}
            <li>
              <div class=" flex p-2 w-[400px] h-[100px] justify-start items-center ">
                <img
                  src="{product?.image}"
                  class="rounded-full w-20 h-20 "
                  alt=""
                  
                />
                
                <div class="flex">
                    <h4 class="text-gray-700 font-semibold sm:text-lg flex p-5 uppercase">{product?.title}</h4>
                 
                  </div>
                 
              </div>
              <div class="w-[400px] flex  border border-y-black ">
                <img class="w-[200px] " src=" {product?.image} " alt="">
                <h1 class=" w-[200px] flex  justify-center text-center items-center text-xl">{product?.telefone}</h1>
              </div>
              <div class="flex justify-center text-center items-center  h-[100px]">
                <div class="w-[200px]">
                    <a href="tel:{product?.telefone}">
                        <Call />
                      </a>
                </div>
                <div class="w-[200px] ">
                <Whatsapp />
                </div>
                <div>
                
                
                 
                </div>
               
            </div>
            <div class="w-[100%] border border-blue-500">
              <Review />
            </div>
            
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>


 