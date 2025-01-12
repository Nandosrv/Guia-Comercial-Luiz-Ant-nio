<script context="module" lang="ts">
    declare var emailjs: any;
  </script>
  
  <script lang="ts">
    import { onMount } from 'svelte';
  
    const EMAIL_CONFIG = {
      PUBLIC_KEY: "DMmJ1dECItQ-fZgD2",
      SERVICE_ID: "service_heyphlt",
      TEMPLATE_ID: "template_eylkalg"
    };
  
    let nome = '';
    let email = '';
    let assunto = '';
    let mensagem = '';
    let enviando = false;
    let sucesso: boolean | null = null;
    let emailjsLoaded = false;
  
    onMount(async () => {
      // Carrega o script do EmailJS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      
      script.onload = () => {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
        emailjsLoaded = true;
      };
  
      document.head.appendChild(script);
    });
  
    const enviarFormulario = async () => {
      if (!emailjsLoaded) {
        console.error("EmailJS ainda não foi carregado");
        return;
      }
  
      try {
        enviando = true;
        
        const templateParams = {
          from_name: nome,
          from_email: email,
          subject: assunto,
          message: mensagem
        };
  
        const response = await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAIL_CONFIG.PUBLIC_KEY
        );
  
        if (response.status === 200) {
          sucesso = true;
          nome = '';
          email = '';
          assunto = '';
          mensagem = '';
        } else {
          sucesso = false;
        }
        
      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        sucesso = false;
      } finally {
        enviando = false;
      }
    };
  </script>
  
  <!-- O restante do seu código HTML permanece o mesmo -->
  <svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  </svelte:head>
  
  <h2>Entre em Contato</h2>
  
  <form on:submit|preventDefault={enviarFormulario}>
    <div>
      <label for="nome">Nome</label>
      <input 
        type="text" 
        id="nome" 
        bind:value={nome} 
        required 
        placeholder="Seu nome"
      />
    </div>
  
    <div>
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        required 
        placeholder="seu.email@exemplo.com"
      />
    </div>
  
    <div>
      <label for="assunto">Assunto</label>
      <input 
        type="text" 
        id="assunto" 
        bind:value={assunto} 
        required 
        placeholder="Assunto da mensagem"
      />
    </div>
  
    <div>
      <label for="mensagem">Mensagem</label>
      <textarea 
        id="mensagem" 
        bind:value={mensagem} 
        required 
        placeholder="Digite sua mensagem aqui..."
      ></textarea>
    </div>
  
    <button type="submit" disabled={enviando}>
      {enviando ? 'Enviando...' : 'Enviar Mensagem'}
    </button>
  
    {#if sucesso === true}
      <p class="success">✓ Mensagem enviada com sucesso!</p>
    {/if}
  
    {#if sucesso === false}
      <p class="error">✗ Erro ao enviar a mensagem. Por favor, tente novamente.</p>
    {/if}
  </form>
  
  <style>
    form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
  
    div {
      margin-bottom: 1rem;
    }
  
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  
    textarea {
      height: 150px;
      resize: vertical;
    }
  
    button {
      background: #4CAF50;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }
  
    button:hover {
      background: #45a049;
    }
  
    button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  
    .success {
      color: #4CAF50;
      padding: 10px;
      margin-top: 10px;
      text-align: center;
    }
  
    .error {
      color: #f44336;
      padding: 10px;
      margin-top: 10px;
      text-align: center;
    }
  </style>