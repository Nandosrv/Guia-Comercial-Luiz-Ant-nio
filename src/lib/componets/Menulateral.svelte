<script>
// @ts-nocheck


    import configura from '$lib/images/icons8-configurações-50.png';
    import ajuda from '$lib/images/icons8-suporte-on-line-50.png';


    let isOpen = false; // Variável para controlar o estado do menu (aberto/fechado)
    
    const navItems = [
  { name: 'Configurações', href: '/noticias', icon: [configura] },
  { name: 'Ajuda e suporte', href: '/comercios', icon: [ajuda]},
  { name: 'Tela e Acessibilidade', href: '/mural', icon: []},
//   { name: 'Dar feedback', href: '/quadroAvisos', icon: <FaCommentDots /> },
//   { name: 'Sair', href: '/suporte', icon: <FaSignOutAlt /> }
];
  
    function toggleMenu() {
      isOpen = !isOpen; // Alterna o estado do menu
    }
  </script>
  
  <main class="flex absolute">
    <!-- Botão de hamburguer -->
    <button
      on:click={toggleMenu}
      class="lg:hidden p-4 text-yellow-500 focus:outline-none"
      aria-label="toggle menu"
    >
      {#if !isOpen}
        <!-- Ícone de hambúrguer -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      {:else}
        <!-- Ícone de fechar (X) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {/if}
    </button>
  
    <!-- Menu Lateral -->
    <div
    class={`fixed top-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-700 to-slate-800 h-[400px] transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } shadow-2xl rounded-r-lg overflow-hidden`}
  >
    <ul class="flex flex-col mt-12 space-y-6 px-4">
      {#each navItems as item}
        <li>
          <a
            href={item.href}
            class=" py-3 px-6 text-lg flex font-medium text-white hover:text-slate-300 hover:bg-slate-600 rounded-lg transition-all duration-300 ease-in-out"
          >
          <!-- Div com o ícone do item -->
         <div class="flex items-center gap-2">
            <img src="{item.icon}" alt="icon" class="w-6 h-6" />

            {item.name}
         </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  
  
  
    <!-- Fundo escuro quando o menu está aberto -->
    {#if isOpen}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="fixed inset-0 bg-black opacity-50"
        on:click={toggleMenu}
      ></div>
    {/if}
  </main>
  
  <style>
    /* Estilos personalizados adicionais podem ser colocados aqui */
  </style>
  