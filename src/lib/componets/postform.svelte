<script>
  import Avatari from '$lib/images/icons8-avatar-50.png';
 
  // Sample comments data - could be moved to a separate store or prop
  const comments = [
     {
         author: "Zulmira Maria de Mattos Chaves",
         content: "Luis Antônio, tem o melhor carnaval de rua do Brasil!!!! Confiram..."
     },
     {
         author: "Odair Pereira da Silva",
         content: "Faz 2 anos que eu mudei por motivo de trabalho mas tenho orgulho de ter conhecido esta cidade maravilhosa. Gostaria de parabenizar o prefeito eleito que nesses 04 anos faça o melhor para cidade crescer mais ainda."
     },
     {
         author: "Margarete A. Sbrana de Souza",
         content: "Você gostaria de viver em um local exuberante? Vá a Luiz Antonio! Até o carnaval é muito bom, a saúde é levada a sério, a educação também. Enfim, Luiz Antonio é um pedaço de São Paulo onde você pode encontrar muita paz."
     },
     {
         author: "Bruno",
         content: "Quando eu morava lá era uma maravilha... agora estou bem longe! Mas ainda sinto saudades dos meus amigos! - Recomendo! =D"
     },
     {
         author: "Isa",
         content: "Olha gente... não me vejo morando em outro lugar, e olha que já tentei... sou daqui e daqui não saio mais... quem não conhece tenho certeza que se conhecerem também ficarão por aqui... assim como eu!!"
     },
     {
         author: "Antonio Ernesto Ripamonti",
         content: "Acho particularmente a bela cidade de Luíz Antonio a mais recomendável para se descansar e desfrutar de um ar puro e de um povo hospitaleiro e super gentil e muito amigável. Eu sou o maior incentivador de que todos conheçam e desfrutem da jóia do interior de São Paulo. Eu amo Luíz Antonio e parabenizo todos os que aí me acolhem."
     }
  ];
 </script>
 
 <section class="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
     <header class="border-b border-gray-200 pb-6 mb-6">
         <h2 class="text-2xl font-bold text-gray-800">
             Comentários sobre Luís Antônio
         </h2>
         <p class="text-gray-600 mt-2">
             Descubra o que as pessoas dizem sobre nossa cidade
         </p>
     </header>
 
     <div class="space-y-6">
         {#each comments as comment}
             <article class="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition">
                 <div class="flex items-start gap-4">
                     <img 
                         src={Avatari} 
                         alt="Avatar" 
                         class="w-12 h-12 rounded-full bg-white p-1 shadow-sm"
                     />
                     <div class="flex-1">
                         <h3 class="font-semibold text-gray-800">
                             {comment.author}
                         </h3>
                         <p class="mt-2 text-gray-600 leading-relaxed">
                             {comment.content}
                         </p>
                     </div>
                 </div>
             </article>
         {/each}
     </div>
 
     <!-- Add Comment Form -->
     <!-- <div class="mt-8 pt-6 border-t border-gray-200">
         <h3 class="text-lg font-semibold text-gray-800 mb-4">
             Deixe seu comentário
         </h3>
         <form class="space-y-4">
             <div>
                 <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                     Nome
                 </label>
                 <input 
                     type="text" 
                     id="name"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Seu nome"
                 />
             </div>
             <div>
                 <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
                     Comentário
                 </label>
                 <textarea 
                     id="comment"
                     rows="4"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Compartilhe sua experiência..."
                 ></textarea>
             </div>
             <button 
                 type="submit"
                 class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
             >
                 Enviar comentário
             </button>
         </form>
     </div> -->
 </section>