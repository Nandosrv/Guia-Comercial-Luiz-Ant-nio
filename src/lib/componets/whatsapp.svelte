<script lang="ts">
    export let phone: string = "+5516991916526";
    export let message: string = "Olá! Gostaria de saber mais sobre seus serviços."; // Mensagem padrão

    // Gera o link do WhatsApp com o número e a mensagem
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
</script>

<style>
    .whatsapp-button {
        display: flex;
        align-items: center;
        justify-content: center; /* Centraliza o ícone */
        padding: 10px;
        background-color: #25D366; /* Cor de fundo do botão */
        border-radius: 50%; /* Botão circular */
        transition: background-color 0.3s;
        width: 50px; /* Largura do botão */
        height: 50px; /* Altura do botão */
    }

    .whatsapp-button:hover {
        background-color: #1ebe5d; /* Cor de fundo ao passar o mouse */
    }

    .whatsapp-icon {
        width: 24px; /* Largura do ícone */
        height: 24px; /* Altura do ícone */
    }
</style>

<a class="whatsapp-button" href={whatsappLink} target="_blank" aria-label="Entrar em contato via WhatsApp">
    <img
        class="whatsapp-icon"
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
    />
</a>
