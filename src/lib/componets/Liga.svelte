<script lang="ts">
    import iconphone from '$lib/images/icons8.png';
    import Whatsapp from './whatsapp.svelte';
    export let phone: string = "+5516991916526";
</script>

<style>
    .call-button {
        display: flex;
        align-items: center;
        justify-content: center; /* Centraliza o ícone */
        padding: 10px;
        background-color: #34b7f1; /* Cor de fundo do botão */
        border-radius: 50%; /* Botão circular */
        transition: background-color 0.3s;
        width: 50px; /* Largura do botão */
        height: 50px; /* Altura do botão */
    }

    .call-button:hover {
        background-color: #30a0db; /* Cor de fundo ao passar o mouse */
    }

    .call-icon {
        width: 24px; /* Largura do ícone */
        height: 24px; /* Altura do ícone */
    }
</style>

<a class="call-button" href={`tel:${phone}`} aria-label="Ligar para o número">
    <img
        class="call-icon"
        src="{iconphone}"
        alt="Ligar"
    />
</a>
