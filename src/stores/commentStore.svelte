<!-- Store para gerenciar o estado de notificações de comentários -->
<script context="module" lang="ts">
  import { writable } from 'svelte/store';

  // Store para rastrear se há novos comentários
  export const temNovoComentario = writable(false);
  
  // Store para armazenar a data da última verificação
  export const ultimaVerificacaoComentarios = writable(
    localStorage.getItem('ultimaVerificacaoComentarios') 
      ? new Date(localStorage.getItem('ultimaVerificacaoComentarios') || '')
      : new Date()
  );
  
  // Função para verificar comentários novos
  export function verificarComentariosNovos(comentarios: any[]) {
    // Obter a última verificação da store
    let ultimaVerificacao: Date;
    ultimaVerificacaoComentarios.subscribe(value => { ultimaVerificacao = value; })();
    
    // Verificar se existem comentários mais recentes que a última verificação
    const comentariosNovos = comentarios.some(comentario => {
      const dataComentario = new Date(comentario.data_criacao);
      return dataComentario > ultimaVerificacao;
    });
    
    // Atualizar o indicador de novos comentários
    temNovoComentario.set(comentariosNovos);
    
    // Atualizar a última verificação
    const agora = new Date();
    ultimaVerificacaoComentarios.set(agora);
    localStorage.setItem('ultimaVerificacaoComentarios', agora.toISOString());
  }
  
  // Função para limpar notificações
  export function limparNotificacaoComentarios() {
    temNovoComentario.set(false);
    const agora = new Date();
    ultimaVerificacaoComentarios.set(agora);
    localStorage.setItem('ultimaVerificacaoComentarios', agora.toISOString());
  }
</script> 