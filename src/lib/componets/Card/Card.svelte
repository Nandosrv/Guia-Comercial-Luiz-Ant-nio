<script lang="ts">
	import Avaliacao from "../avaliacao.svelte";
import Call from "../call.svelte";
	import Review from "../Review.svelte";

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
    //   avatar: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
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
                <Avaliacao />
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
<!-- <main class=" flex w-full border border-blue-500 justify-center">
<div class="w-[50%] h-96 flex justify-center border border-blue-500 ">
<img class="w-[50%]" src="{product?.image}" alt="">
</div>
</main> -->
<!-- <div class="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <img class="object-cover object-center w-full h-56" src="{product?.image}" alt="avatar">

    <div class="flex items-center justify-center px-6 py-3 bg-gray-900">
        

        <h1 class="flex justify-center text-center  mx-3 text-lg font-semibold text-white">{product?.title}</h1>
    </div>

    <div class="px-6 py-4">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Patterson johnson</h1>

        <p class="py-2 text-gray-700 dark:text-gray-400">Full Stack maker & UI / UX Designer , love hip hop music Author of Building UI.</p>

        <div class="flex items-center mt-4 text-gray-700 dark:text-gray-200">
            <svg aria-label="suitcase icon" class="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 11H10V13H14V11Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5V4C7 2.89545 7.89539 2 9 2H15C16.1046 2 17 2.89545 17 4V5H20C21.6569 5 23 6.34314 23 8V18C23 19.6569 21.6569 21 20 21H4C2.34314 21 1 19.6569 1 18V8C1 6.34314 2.34314 5 4 5H7ZM9 4H15V5H9V4ZM4 7C3.44775 7 3 7.44769 3 8V14H21V8C21 7.44769 20.5522 7 20 7H4ZM3 18V16H21V18C21 18.5523 20.5522 19 20 19H4C3.44775 19 3 18.5523 3 18Z"/>
            </svg>

            <h1 class="px-2 text-sm">Meraki UI</h1>
        </div>

        <div class="flex items-center mt-4 text-gray-700 dark:text-gray-200">
            <svg aria-label="location pin icon" class="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.063 10.063 6.27214 12.2721 6.27214C14.4813 6.27214 16.2721 8.063 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16757 11.1676 8.27214 12.2721 8.27214C13.3767 8.27214 14.2721 9.16757 14.2721 10.2721Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.3941 5.48178 3.79418C8.90918 0.194258 14.6059 0.0543983 18.2059 3.48179C21.8058 6.90919 21.9457 12.606 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.9732 6.93028 5.17326C9.59603 2.37332 14.0268 2.26454 16.8268 4.93029C19.6267 7.59604 19.7355 12.0269 17.0698 14.8268Z"/>
            </svg>

            <h1 class="px-2 text-sm">California</h1>
        </div>

        <div class="flex items-center mt-4 text-gray-700 dark:text-gray-200">
            <svg aria-label="email icon" class="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"/>
            </svg>

            <h1 class="px-2 text-sm">patterson@example.com</h1>
        </div>
    </div>
</div> -->

<!-- <div class="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <div class="flex items-center justify-between">
        <span class="text-sm font-light text-gray-600 dark:text-gray-400">Mar 10, 2019</span>
        <a  href="/" class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500" tabindex="0" role="button">Design</a>
    </div>

    <div class="mt-2">
        <a href="/" class="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" tabindex="0" >Accessibility tools for designers and developers</a>
        <p class="mt-2 text-gray-600 dark:text-gray-300">{product?.telefone}</p>
    </div>

    <div class="flex items-center justify-between mt-4">
        <a href="/" class="text-blue-600 dark:text-blue-400 hover:underline" tabindex="0" >{product?.title}</a>

        <div class="flex items-center">
            <img class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block" src=" {product?.image} " alt="avatar">
            <a href="/" class="font-bold text-gray-700 cursor-pointer dark:text-gray-200" tabindex="0" >Khatab wedaa</a>
        </div>
    </div>
</div> -->