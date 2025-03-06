<script lang="ts">
	import { goto } from '$app/navigation';

  import { auth } from '$lib/firebase/client';
  import Icongogole from '$lib/images/googlelogo.png';
  import { loginWithGoogle } from '$lib/services/authService.svelte';
  import supabase from '$lib/supabaseClient';
  let active = false;
  let loginEmail = '';
  let loginPassword = '';
  let registerEmail = '';
  let registerPassword = '';
  let registerName = '';
  let errorMessage = '';

  const toggleForm = () => {
    active = !active;
  };

  const handleLoginWithGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      if (!user) {
        throw new Error('Erro ao fazer login com Google');
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            id: session.user.id,
            name: user.displayName, // Ou user.name, dependendo da estrutura do objeto user
            email: user.email,
          });
        }
      }
      goto('/perfil');
    } catch (error: any) {
      errorMessage = `Erro ao fazer login com Google: ${error.message}`;
      alert(errorMessage);
      goto('login');
    }
  };

  const handleRegister = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
          },
        },
      });
      if (error) {
        throw error;
      }
      if (user) {
        await supabase.from('users').insert({
          id: user.id,
          name: registerName,
          email: registerEmail,
        });
      }
      goto('/perfil');
    } catch (error: any) {
      errorMessage = 'Erro ao criar conta: ' + error.message;
      alert(errorMessage);
    }
  };

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        throw error;
      }
      if (session?.user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            id: session.user.id,
            name: registerName, // Ou outro nome, se disponível
            email: loginEmail,
          });
        }
      }
      goto('/perfil');
    } catch (error: any) {
      errorMessage = 'Erro ao fazer login: ' + error.message;
      alert(errorMessage);
    }
  };
</script>
 

<div class="w-full flex relative justify-center items-center bg-secondary">
  <div class="container relative" class:active={active}>
    <div class="form-box login">
      <form on:submit={handleLogin}>
        <h1>Login</h1>
        <div class="input-box">
          <input type="email" placeholder="E-mail" required bind:value={loginEmail} />
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Senha" required bind:value={loginPassword} />
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="forgot-link">
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#">Esqueceu a senha?</a>
        </div>
        <button type="submit" class="btn">Entrar</button>
        <p>ou entre com plataformas sociais</p>
        <div class="social-icons">
          <button
            type="button"
            class="flex w-full items-center justify-center rounded-lg bg-red-500 py-3 text-black shadow-lg transition hover:bg-gray-100"
            on:click={handleLoginWithGoogle}
          >
            <img src={Icongogole} alt="Google" class="mr-3 h-6 w-6" />
            Login com Google
          </button>
        </div>
      </form>
    </div>

    <div class="form-box register">
      <form on:submit={handleRegister}>
        <h1>Cadastro</h1>
        <div class="input-box">
          <input type="text" placeholder="Usuário" required bind:value={registerName} />
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="email" placeholder="E-mail" required bind:value={registerEmail} />
          <i class="bx bxs-envelope"></i>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Senha" required bind:value={registerPassword} />
          <i class="bx bxs-lock-alt"></i>
        </div>
        <button type="submit" class="btn">Cadastrar</button>
        <p>ou cadastre-se com plataformas sociais</p>
        <div class="social-icons">
          <button
            type="button"
            class="flex w-full items-center justify-center rounded-lg bg-red-500 py-3 text-black shadow-lg transition hover:bg-gray-100"
            on:click={handleLoginWithGoogle}
          >
            <img src={Icongogole} alt="Google" class="mr-3 h-6 w-6" />
            Cadastre-se com Google
          </button>
        </div>
      </form>
    </div>

    <div class="toggle-box">
      <div class="toggle-panel toggle-left">
        <h1>Olá, Bem-vindo!</h1>
        <p>Não tem uma conta?</p>
        <button class="btn" on:click={toggleForm}>Cadastre-se</button>
      </div>
      <div class="toggle-panel toggle-right">
        <h1>Bem-vindo de Volta!</h1>
        <p>Já tem uma conta?</p>
        <button class="btn" on:click={toggleForm}>Entrar</button>
          
      </div>
    </div>
  </div>
</div>
 <!-- svelte-ignore css_unused_selector -->
 <style>
  /* Adicione os estilos CSS fornecidos aqui, sem alterações */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
  }

  body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
  }

  .container {
      position: relative;
      width: 850px;
      height: 550px;
      background: #fff;
      border-radius: 30px;
      box-shadow: 0 0 30px rgba(0, 0, 0, .2);
      margin: 20px;
      overflow: hidden;
  }

  .form-box {
      position: absolute;
      right: 0;
      width: 50%;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      color: #333;
      text-align: center;
      padding: 40px;
      z-index: 1;
      transition: .6s ease-in-out 1.2s, visibility 0s 1s;
  }

  .container.active .form-box {
      right: 50%;
  }

  .form-box.register {
      visibility: hidden;
  }

  .container.active .form-box.register {
      visibility: visible;
  }

  form {
      width: 100%;
  }

  .container h1 {
      font-size: 36px;
      margin: -10px 0;
  }

  .input-box {
      position: relative;
      margin: 30px 0;
  }

  .input-box input {
      width: 100%;
      padding: 13px 50px 13px 20px;
      background: #eee;
      border-radius: 8px;
      border: none;
      outline: none;
      font-size: 16px;
      color: #333;
      font-weight: 500;
  }

  .input-box input::placeholder {
      color: #888;
      font-weight: 400;
  }

  .input-box i {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #888;
  }

  .forgot-link {
      margin: -15px 0 15px;
  }

  .forgot-link a {
      font-size: 14.5px;
      color: #333;
      text-decoration: none;
  }

  .btn {
      width: 100%;
      height: 48px;
      background: #7494ec;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, .1);
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: #fff;
      font-weight: 600;
  }

  .container p {
      font-size: 14.5px;
      margin: 15px 0;
  }

  .social-icons {
      display: flex;
      justify-content: center;
  }

  .social-icons a {
      display: inline-flex;
      padding: 10px;
      border: 2px solid #ccc;
      border-radius: 8px;
      font-size: 24px;
      color: #333;
      text-decoration: none;
      margin: 0 8px;
  }

  .toggle-box {
      position: absolute;
      width: 100%;
      height: 100%;
  }

  .toggle-box::before {
      content: '';
      position: absolute;
      left: -250%;
      width: 300%;
      height: 100%;
      background: #7494ec;
      border-radius: 150px;
      z-index: 2;
      transition: 1.8s ease-in-out;
  }

  .container.active .toggle-box::before {
      left: 50%;
  }

  .toggle-panel {
      position: absolute;
      width: 50%;
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: .6s ease-in-out;
  }

  .toggle-panel.toggle-left {
      left: 0;
      transition-delay: 1.2s;
  }

  .container.active .toggle-panel.toggle-left {
      left: -50%;
      transition-delay: .6s;
  }

  .toggle-panel.toggle-right {
      right: -50%;
      transition-delay: .6s;
  }

  .container.active .toggle-panel.toggle-right {
      right: 0;
      transition-delay: 1.2s;
  }

  .toggle-panel p {
      margin-bottom: 20px;
  }

  .toggle-panel .btn {
      width: 160px;
      height: 46px;
      background: transparent;
      border: 2px solid #fff;
      box-shadow: none;
  }

  @media screen and (max-width: 650px) {
      .container {
          height: calc(100vh - 40px);
      }

      .form-box {
          bottom: 0;
          width: 100%;
          height: 70%;
      }

      .container.active .form-box {
          right: 0;
          bottom: 30%;
      }

      .input-box {
          margin: 20px 0;
      }

      .forgot-link {
          margin: -5px 0 15px;
      }

      .toggle-box::before {
          left: 0;
          top: -270%;
          width: 100%;
          height: 300%;
          border-radius: 20vw;
      }

      .container.active .toggle-box::before {
          left: 0;
          top: 70%;
      }

      .toggle-panel {
          width: 100%;
          height: 30%;
      }

      .toggle-panel.toggle-left {
          top: 0;
      }

      .container.active .toggle-panel.toggle-left {
          left: 0;
          top: -30%;
      }

      .toggle-panel.toggle-right {
          right: 0;
          bottom: -30%;
      }

      .container.active .toggle-panel.toggle-right {
          bottom: 0;
      }
  }

  @media screen and (max-width: 400px) {
      .form-box {
          padding: 20px;
      }

      .toggle-panel h1 {
          font-size: 30px;
      }
  }
</style>