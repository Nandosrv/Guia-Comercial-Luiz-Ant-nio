<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";

    let currentNotification: { message: string; id: number } | null = null;
    let notificationTimeout: any = null; // Usando "any" para evitar o erro de tipo
    let intervalId: any = null; // Usando "any" para evitar o erro de tipo

    function generateVisitorNotification() {
        const randomVisitors = Math.floor(Math.random() * 50) + 20;
        const currentTime = new Date();

        const formattedTime = currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

            const messages = [
        `${randomVisitors} ${randomVisitors === 1 ? 'pessoa está' : 'pessoas estão'} visualizando esta página agora (${formattedTime}).`,
        `Neste momento (${formattedTime}), ${randomVisitors} ${randomVisitors === 1 ? 'visitante está' : 'visitantes estão'} navegando por esta página.`,
        `Você não está sozinho! ${randomVisitors} ${randomVisitors === 1 ? 'pessoa também está' : 'pessoas também estão'} acessando esta página às ${formattedTime}.`,
        `Às ${formattedTime}, ${randomVisitors} ${randomVisitors === 1 ? 'pessoa está' : 'pessoas estão'} explorando esta página com você.`,
        `${randomVisitors} ${randomVisitors === 1 ? 'visitante conectado' : 'visitantes conectados'} nesta página agora (${formattedTime}).`,
        
        // Novas mensagens
        `Às ${formattedTime}, ${randomVisitors} ${randomVisitors === 1 ? 'pessoa está' : 'pessoas estão'} aproveitando o conteúdo desta página.`,
        `Neste momento, ${randomVisitors} ${randomVisitors === 1 ? 'visitante está' : 'visitantes estão'} navegando pela mesma seção que você (${formattedTime}).`,
        `Você sabia? ${randomVisitors} ${randomVisitors === 1 ? 'pessoa está' : 'pessoas estão'} lendo esta página agora mesmo! (${formattedTime})`,
        `${randomVisitors} ${randomVisitors === 1 ? 'visitante está' : 'visitantes estão'} se interessando pelo mesmo conteúdo que você neste instante (${formattedTime}).`,
        `É bom saber que você não está sozinho! ${randomVisitors} ${randomVisitors === 1 ? 'pessoa está' : 'pessoas estão'} online agora (${formattedTime}).`,
        `Às ${formattedTime}, você está compartilhando esta página com ${randomVisitors} ${randomVisitors === 1 ? 'pessoa' : 'pessoas'} curiosas!`,
        `Você tem companhia! ${randomVisitors} ${randomVisitors === 1 ? 'pessoa' : 'pessoas'} estão explorando esta página agora (${formattedTime}).`,
        `${randomVisitors} ${randomVisitors === 1 ? 'visitante está' : 'visitantes estão'} assistindo o conteúdo que você está visualizando neste momento (${formattedTime}).`
    ];


        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        currentNotification = {
            id: Date.now(),
            message: randomMessage
        };

        // Limpa o timeout anterior, caso exista
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // Define o timeout para a notificação desaparecer após 4 segundos
        notificationTimeout = setTimeout(() => {
            currentNotification = null;
        }, 5000); // A notificação some após 5 segundos
    }

    onMount(() => {
        // Gera a primeira notificação imediatamente
        generateVisitorNotification();

        // Configura o intervalo para gerar novas notificações a cada 14 segundos (10s de espera + 4s de exibição)
        intervalId = setInterval(generateVisitorNotification, 20000); // 20 segundos total (4s visível + 10s de espera)
    });

    onDestroy(() => {
        // Limpa o intervalo quando o componente for destruído
        if (intervalId) clearInterval(intervalId);
        if (notificationTimeout) clearTimeout(notificationTimeout);
    });
</script>

<!-- Notificação flutuante única -->
{#if currentNotification}
    <div class="fixed bottom-4 left-4 z-50">
        <div
            transition:fly={{ x: -300, duration: 500 }}
            class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-2 flex items-center space-x-3 transform transition-all hover:scale-105"
        >
            <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <p class="text-sm text-gray-700 dark:text-gray-300">{currentNotification.message}</p>
        </div>
    </div>
{/if}
