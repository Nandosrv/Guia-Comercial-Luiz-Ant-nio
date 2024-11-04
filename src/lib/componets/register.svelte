<script lang="ts">
    import { supabase } from '$lib/supabaseClient'; // Importa o cliente Supabase
    let name = '';
    let email = '';
    let password = '';
    let errorMessage = '';
    let successMessage = '';

    // Função para lidar com o envio do formulário
    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }, // Adiciona o nome do usuário aos dados
            },
        });

        if (error) {
            errorMessage = error.message; // Armazena a mensagem de erro
            successMessage = ''; // Limpa a mensagem de sucesso
        } else {
            successMessage = 'Conta criada com sucesso! Por favor, verifique seu e-mail para ativação.'; // Mensagem de sucesso
            errorMessage = ''; // Limpa a mensagem de erro
        }
    };
</script>

<main class="w-full flex justify-center items-center h-screen">
    <form class="form" on:submit={handleSubmit}>
        <h2 class="form-title">Criar Conta</h2>
        <div class="form-group">
            <label for="name">Nome</label>
            <input
                placeholder="Digite seu Nome"
                class="input"
                type="text"
                bind:value={name}
                id="name"
                required
            />
        </div>
        
        <div class="form-group">
            <label for="email">Email</label>
            <input
                placeholder="Digite seu Email"
                class="input"
                type="email"
                bind:value={email}
                id="email"
                required
            />
        </div>
    
        <div class="form-group">
            <label for="password">Senha</label>
            <input
                placeholder="Digite sua Senha"
                class="input"
                type="password"
                bind:value={password}
                id="password"
                required
            />
        </div>
    
        <button type="submit" class="button-submit">Criar Conta</button>
        
        {#if errorMessage}
            <p class="error">{errorMessage}</p> <!-- Exibe mensagem de erro -->
        {/if}
        {#if successMessage}
            <p class="success">{successMessage}</p> <!-- Exibe mensagem de sucesso -->
        {/if}
        
        <p class="login-link">
            Já tem uma conta? 
            <a href="/user" class="link">Fazer Login</a>
        </p>
    </form>
</main>

<style>
    /* Estilo do formulário */
    main {
        background-color: #f9f9f9; /* Fundo leve para o formulário */
    }

    .form {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 400px; /* Largura máxima do formulário */
        width: 100%; /* Largura total do formulário */
    }

    .form-title {
        text-align: center;
        margin-bottom: 1.5rem; /* Espaçamento inferior */
    }

    .form-group {
        margin-bottom: 1.5rem; /* Espaçamento inferior entre os grupos */
    }

    label {
        display: block;
        margin-bottom: 0.5rem; /* Espaçamento inferior do rótulo */
        font-weight: bold; /* Negrito para os rótulos */
    }

    .input {
        width: 100%; /* Largura total do campo de entrada */
        padding: 0.5rem; /* Espaçamento interno */
        border: 1px solid #ccc; /* Borda leve */
        border-radius: 4px; /* Borda arredondada */
        font-size: 1rem; /* Tamanho da fonte */
        transition: border-color 0.2s; /* Transição suave para a borda */
    }

    .input:focus {
        border-color: #007BFF; /* Cor da borda quando focado */
        outline: none; /* Remove o contorno padrão */
    }

    .button-submit {
        width: 100%; /* Largura total do botão */
        padding: 0.5rem; /* Espaçamento interno */
        background-color: #007BFF; /* Cor de fundo do botão */
        color: white; /* Cor do texto do botão */
        border: none; /* Remove a borda padrão */
        border-radius: 4px; /* Borda arredondada */
        font-size: 1rem; /* Tamanho da fonte */
        cursor: pointer; /* Muda o cursor ao passar sobre o botão */
        transition: background-color 0.2s; /* Transição suave para a cor de fundo */
    }

    .button-submit:hover {
        background-color: #0056b3; /* Cor de fundo ao passar o mouse */
    }

    .error {
        color: red; /* Cor vermelha para a mensagem de erro */
        margin-top: 10px; /* Espaçamento superior */
        text-align: center; /* Centraliza a mensagem de erro */
    }

    .success {
        color: green; /* Cor verde para a mensagem de sucesso */
        margin-top: 10px; /* Espaçamento superior */
        text-align: center; /* Centraliza a mensagem de sucesso */
    }

    .login-link {
        text-align: center; /* Centraliza o texto */
        margin-top: 1.5rem; /* Espaçamento superior */
    }

    .link {
        color: #007BFF; /* Cor do link */
        text-decoration: underline; /* Sublinha o link */
        cursor: pointer; /* Muda o cursor ao passar sobre o link */
    }

    .link:hover {
        color: #0056b3; /* Cor ao passar o mouse */
    }
</style>
