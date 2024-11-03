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
        padding: 10px 20px;
        background-color: #25D366;
        color: white;
        border-radius: 8px;
        font-weight: bold;
        text-decoration: none;
        transition: background-color 0.3s;
    }
    .whatsapp-button:hover {
        background-color: #1ebe5d;
    }
    .whatsapp-icon {
        margin-right: 10px;
        width: 20px;
        height: 20px;
    }
</style>

<a class="whatsapp-button" href={whatsappLink} target="_blank">
    <img
        class="whatsapp-icon"
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
    />
    Fale Conosco
</a>
