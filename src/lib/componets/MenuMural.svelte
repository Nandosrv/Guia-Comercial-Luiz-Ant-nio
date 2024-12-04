<script lang="ts">
    import { onMount } from 'svelte';
  
    let isMenuOpen = false; // Estado para controlar o menu
  
    // Função para fechar o menu ao clicar fora
    function handleOutsideClick(event: MouseEvent) {
      const menu = document.getElementById('menu');
      const button = document.getElementById('menu-button');
      if (
        isMenuOpen &&
        menu &&
        !menu.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        isMenuOpen = false;
      }
    }
  
    onMount(() => {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    });
  </script>
  
  <!-- Header com menu -->
  <div class="w-full h-[50px] flex items-center justify-between bg-black/60 p-4 border-b border-purple-800">
    <!-- Botão do menu -->
    <button
      id="menu-button"
      class="text-white focus:outline-none"
      on:click={() => (isMenuOpen = !isMenuOpen)}
      aria-label="Toggle menu"
    >
      <!-- Ícone hambúrguer -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg>
    </button>
  
    <!-- Menu -->
    <nav
      id="menu"
      class={`absolute mt-[150px] top-[50px] left-0 w-full bg-black/90 text-white p-4 shadow-lg rounded-b-lg transition-all duration-500 ease-in-out transform ${
        isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <ul class="flex flex-col gap-4 ">
        <li>
          <a href="#HISTORIA-DA-CIDADE" class="hover:underline text-white font-serif">História Da Cidade</a>
        </li>
        <li>
          <a href="#Significado-do-Nome" class="hover:underline text-white font-serif">Significado Do Nome</a>
        </li>
        <li>
          <a href="#Aniversário-da-Cidade" class="hover:underline text-white font-serif">Aniversário da Cidade</a>
        </li>
        <li>
          <a href="#CARACTERÍSTICAS" class="hover:underline text-white font-serif">Características</a>
        </li>
        <li>
          <a href="#COMO-CHEGAR" class="hover:underline text-white font-serif">Como Chegar</a>
        </li>
        <li>
          <a href="#TURISMO" class="hover:underline text-white font-serif">Turismo</a>
        </li>
        <li>
            <a href="#INFORMAÇÕES-ÚTEIS" class="hover:underline text-white font-serif">Informações ÚTeis</a>
          </li> <li>
            <a href="#Comentário" class="hover:underline text-white font-serif">Comentário</a>
          </li>
      </ul>
    </nav>
  </div>
  