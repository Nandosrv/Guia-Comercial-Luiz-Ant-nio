<script lang="ts">
	import Avatari from '$lib/images/icons8-avatar-50.png';
	import { onMount } from 'svelte';
	import supabase from '$lib/supabaseClient';
	import { getAuth } from 'firebase/auth';
  import { userStore } from '../../stores/userStore.svelte.js';
	// Função auxiliar para gerar ID único
	function generateId(): string {
		return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	interface Comment {
		userRating: string;
		authorAvatar: string;
		id: string;
		author_id: string;
		content: string;
		created_at: string;
		likes: number;
		dislikes: number;
		username: string;
		photo_url: string;
		author?: {
			id?: string;
			email?: string;
			avatar_url?: string;
		};
		replies?: Reply[];
	}

	interface Reply {
		authorAvatar: string;
		id: string;
		comment_id: string;
		author_id: string;
		content: string;
		created_at: string;
		username: string;
		photo_url: string;
		author?: {
			id?: string;
			email?: string;
			avatar_url?: string;
		};
	}

	let comments: Comment[] = [];
	let newComment = '';
	let loading = false;
	let replyContents: { [key: string]: string } = {};
	let replyingTo: string | null = null;
	let editingCommentId: string | null = null;
	let editContent = '';




  
	async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('commentis')
        .select(
          `
          *,
          author:users(id, email, avatar_url),
          replies:comment_replies(*, author:users(id, email, avatar_url))
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Buscar ratings para todos os comentários
      const promises = data.map(async (comment) => {
        const { data: ratings } = await supabase
          .from('comment_ratings')
          .select('rating_type')
          .eq('comment_id', comment.id);

        // Buscar rating do usuário atual
        const auth = getAuth();
        const user = auth.currentUser;
        let userRating = null;

        if (user) {
          const { data: userRatingData } = await supabase
            .from('comment_ratings')
            .select('rating_type')
            .eq('comment_id', comment.id)
            .eq('user_id', user.uid)
            .maybeSingle();

          userRating = userRatingData?.rating_type;
        }

        return {
          ...comment,
          likes: ratings?.filter(r => r.rating_type === 'like').length || 0,
          dislikes: ratings?.filter(r => r.rating_type === 'dislike').length || 0,
          userRating
        };
      });

      comments = await Promise.all(promises);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  }




	async function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();
		loading = true;

		try {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				alert('Por favor, faça login para comentar');
				return;
			}

			const commentId = generateId();

			const { data, error } = await supabase
				.from('commentis')
				.insert([
					{
						id: commentId,
						author_id: user.uid,
						content: newComment,
						username: user.displayName || 'Anônimo',
						photo_url: user.photoURL || ''
					}
				])
				.select(
					`
					*,
					author:users(id, email, avatar_url)
				`
				)
				.single();

			if (error) {
				console.error('Erro ao enviar comentário:', error);
				alert('Erro ao enviar comentário.');
				return;
			}

			comments = [data, ...comments];
			newComment = '';
		} catch (error) {
			console.error('Erro ao enviar comentário:', error);
			alert('Erro ao enviar comentário.');
		} finally {
			loading = false;
		}
	}

	async function deleteComment(commentId: string) {
		const auth = getAuth();
		const user = auth.currentUser;
		
		// Find the comment
		const comment = comments.find(c => c.id === commentId);
		
		if (!user || comment?.author_id !== user.uid) {
			alert('Você não tem permissão para deletar este comentário');
			return;
		}

		if (!confirm('Tem certeza que deseja deletar este comentário?')) {
			return;
		}

		try {
			const { error } = await supabase
				.from('commentis')
				.delete()
				.eq('id', commentId);

			if (error) throw error;

			// Remove comment from local state
			comments = comments.filter(c => c.id !== commentId);
		} catch (error) {
			console.error('Erro ao deletar comentário:', error);
			alert('Erro ao deletar comentário.');
		}
	}

	function startEdit(comment: Comment) {
		const auth = getAuth();
		const user = auth.currentUser;
		
		if (!user || comment.author_id !== user.uid) {
			alert('Você não tem permissão para editar este comentário');
			return;
		}
		
		editingCommentId = comment.id;
		editContent = comment.content;
	}

	async function saveEdit(commentId: string) {
		try {
			const { error } = await supabase
				.from('commentis')
				.update({ content: editContent })
				.eq('id', commentId);

			if (error) throw error;

			// Update comment in local state
			comments = comments.map(comment =>
				comment.id === commentId
					? { ...comment, content: editContent }
					: comment
			);

			editingCommentId = null;
			editContent = '';
		} catch (error) {
			console.error('Erro ao editar comentário:', error);
			alert('Erro ao editar comentário.');
		}
	}
  async function rateComment(commentId: string, type: 'like' | 'dislike') {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('Por favor, faça login para avaliar');
      return;
    }

    // Verificar se o usuário já curtiu este comentário
    const { data: existingRating, error: ratingError } = await supabase
      .from('comment_ratings')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', user.uid)
      .maybeSingle();

    if (ratingError && !ratingError.message.includes('no rows')) {
      console.error('Rating check error:', ratingError);
      throw new Error('Erro ao verificar rating existente');
    }

    if (existingRating) {
      // Se já existe um rating e é do mesmo tipo, remover (toggle off)
      if (existingRating.rating_type === type) {
        const { error: deleteError } = await supabase
          .from('comment_ratings')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.uid);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw new Error('Erro ao remover o rating');
        }
      } else {
        // Se existe mas é de tipo diferente, atualizar
        const { error: updateError } = await supabase
          .from('comment_ratings')
          .update({ rating_type: type })
          .eq('comment_id', commentId)
          .eq('user_id', user.uid);

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error('Erro ao atualizar o rating');
        }
      }
    } else {
      // Se não existe, criar novo rating
      const ratingId = generateId(); // Gerar ID único para o rating
      const { data: insertData, error: insertError } = await supabase
        .from('comment_ratings')
        .insert([
          {
            id: ratingId, // Adicionar o ID gerado
            comment_id: commentId,
            user_id: user.uid,
            rating_type: type
          }
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Erro ao adicionar o rating');
      }
      console.log('Insert successful:', insertData);
    }

    // Buscar contagem atualizada de ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from('comment_ratings')
      .select('rating_type')
      .eq('comment_id', commentId);

    if (ratingsError) {
      console.error('Ratings fetch error:', ratingsError);
      throw new Error('Erro ao buscar ratings');
    }

    // Calcular totais
    const likes = ratings.filter(r => r.rating_type === 'like').length;
    const dislikes = ratings.filter(r => r.rating_type === 'dislike').length;

    // Atualizar estado local
    comments = comments.map(comment =>
      comment.id === commentId
        ? { 
            ...comment, 
            likes, 
            dislikes,
            userRating: type
          }
        : comment
    );

  } catch (error: any) {
    console.error('Erro ao avaliar comentário:', error);
    alert(`Ocorreu um erro ao avaliar o comentário: ${error.message}`);
  }
}













  async function submitReply(commentId: string, replyContent: string) {
    if (!replyContent.trim()) return;

    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert('Por favor, faça login para responder');
            return;
        }

        // Verificar foto na tabela users
        const { data: userData } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', user.uid)
            .single();

        const replyId = generateId();

        const { data, error } = await supabase
            .from('comment_replies')
            .insert([
                {
                    id: replyId,
                    comment_id: commentId,
                    author_id: user.uid,
                    content: replyContent,
                    username: user.displayName || 'Anônimo',
                    photo_url: userData?.avatar_url || user.photoURL || ''
                }
            ])
            .select(`
                *,
                author:users(id, email, avatar_url)
            `)
            .single();

        if (error) throw error;

        // Atualizar o comentário com a nova resposta
        comments = comments.map((comment) => {
            if (comment.id === commentId) {
                const newReplies = comment.replies || [];
                return {
                    ...comment,
                    replies: [...newReplies, data]
                };
            }
            return comment;
        });

        // Limpar o campo de resposta e fechar
        replyingTo = null;
        replyContents[commentId] = '';
    } catch (error) {
        console.error('Erro ao enviar resposta:', error);
        alert('Erro ao enviar resposta.');
    }
}
	onMount(fetchComments);
</script>
<section class="mx-auto w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white to-gray-50/50 p-3 sm:p-4 md:p-8 shadow-xl backdrop-blur-sm">
  <header class="mb-4 sm:mb-6 md:mb-8 border-b border-gray-200/80 pb-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <div class="flex items-center gap-3">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Comentários
        </h2>
        <div class="flex items-center gap-1 text-xs sm:text-sm text-gray-500 bg-gray-100/80 px-2 sm:px-3 py-1 rounded-full">
          <span class="font-medium">{comments.length}</span>
          <span>comentários</span>
        </div>
      </div>
      <div class="flex sm:hidden md:flex items-center gap-2 text-sm text-gray-500">
        <button class="hover:text-blue-600 transition-colors">Mais recentes</button>
        <span>•</span>
        <button class="hover:text-blue-600 transition-colors">Mais curtidos</button>
      </div>
    </div>
    <p class="text-sm sm:text-base text-gray-600">Compartilhe suas experiências e descobertas sobre Luís Antônio</p>
  </header>

  <form on:submit={handleSubmit} class="mb-6 sm:mb-8 md:mb-10 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 relative group hover:border-blue-200 transition-colors">
    <div class="relative">
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <textarea
        bind:value={newComment}
        placeholder="O que você pensa sobre Luís Antônio?"
        class="w-full resize-none rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 text-sm md:text-base text-gray-700 placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        rows="4"
        maxlength="500"
        required
      />
      <div class="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
        {newComment.length}/500
      </div>
    </div>
    
    <div class="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div class="flex items-center gap-1 sm:gap-2">
        <span class="text-xs text-gray-500">Sugestões:</span>
        {#each ['👍', '❤️', '😊', '🌟'] as emoji}
          <button
            type="button"
            on:click={() => {newComment += emoji}}
            class="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            {emoji}
          </button>
        {/each}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        class="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 md:px-6 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-sm hover:shadow-md flex items-center justify-center sm:justify-start gap-2 group-hover:translate-y-[-1px]"
      >
        {#if loading}
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span>Enviando...</span>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <span>Publicar</span>
        {/if}
      </button>
    </div>
  </form>

  <div class="space-y-4 md:space-y-6">
    {#each comments as comment}
      <article class="rounded-xl bg-white p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
        <div class="flex gap-2 sm:gap-4">
          <div class="relative shrink-0">
            <img
              src={comment.photo_url || comment.author?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.author_id}
              alt="Avatar do usuário"
              class="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white p-0.5 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
            />
            <div class="absolute -bottom-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div class="flex flex-wrap items-center gap-1 sm:gap-2">
                  <h3 class="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                    {comment.username || comment.author?.email || 'Usuário Anônimo'}
                  </h3>
                  <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Morador</span>
                  <span class="text-xs text-gray-500">
                    • {new Date(comment.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {#if getAuth().currentUser?.uid === comment.author_id}
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    on:click={() => startEdit(comment)}
                    class="p-1.5 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    on:click={() => deleteComment(comment.id)}
                    class="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
              {/if}
            </div>

            {#if editingCommentId === comment.id}
                <!-- svelte-ignore element_invalid_self_closing_tag -->
              <div class="mt-3">
                <textarea
                  bind:value={editContent}
                  class="w-full resize-none rounded-lg border border-gray-200 p-2 sm:p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  rows="3"
                />
                <div class="mt-2 flex gap-2">
                  <button
                    on:click={() => saveEdit(comment.id)}
                    class="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    <span>Salvar</span>
                  </button>
                  <button
                    on:click={() => {
                      editingCommentId = null;
                      editContent = '';
                    }}
                    class="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            {:else}
              <p class="mt-2 text-sm sm:text-base text-gray-600 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            {/if}

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-1">
                <button
                  on:click={() => rateComment(comment.id, 'like')}
                  class="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200
                  {comment.userRating === 'like' 
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
                    : 'hover:bg-gray-100 text-gray-700'}
                  group"
                >
                  <span class="transform group-hover:scale-110 transition-transform">
                    {comment.userRating === 'like' ? '👍' : '👍'}
                  </span>
                  <span class="text-xs font-medium min-w-[1.25rem] text-center">
                    {comment.likes || 0}
                  </span>
                </button>
                
                <button
                  on:click={() => rateComment(comment.id, 'dislike')}
                  class="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200
                  {comment.userRating === 'dislike' 
                    ? 'bg-red-100 text-red-700 ring-2 ring-red-200' 
                    : 'hover:bg-gray-100 text-gray-700'}
                  group"
                >
                  <span class="transform group-hover:scale-110 transition-transform">
                    {comment.userRating === 'dislike' ? '👎' : '👎'}
                  </span>
                  <span class="text-xs font-medium min-w-[1.25rem] text-center">
                    {comment.dislikes || 0}
                  </span>
                </button>
              </div>

              <div class="h-4 w-px bg-gray-300"></div>

              <button
                on:click={() => (replyingTo = comment.id)}
                class="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                💬 <span class="inline">Responder</span>
              </button>
            </div>

            {#if replyingTo === comment.id}
              <div class="mt-4 bg-gray-50/80 rounded-lg p-3 sm:p-4 border border-gray-200">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs sm:text-sm font-medium text-gray-700">Respondendo ao comentário</span>
                </div>
                
                <!-- svelte-ignore element_invalid_self_closing_tag -->
                <textarea
                  bind:value={replyContents[comment.id]}
                  placeholder="Escreva sua resposta..."
                  class="w-full resize-none rounded-lg border border-gray-200 p-2 sm:p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white"
                  rows="3"
                />

                <div class="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div class="flex gap-1">
                    {#each ['👍', '❤️', '👏', '🎉', '🤔', '😊'] as emoji}
                      <button
                        type="button"
                        on:click={() => {
                          replyContents[comment.id] = (replyContents[comment.id] || '') + emoji;
                        }}
                        class="p-1 sm:p-1.5 hover:bg-white rounded-full transition-colors"
                      >
                        {emoji}
                      </button>
                    {/each}
                  </div>

                  <div class="flex gap-2 w-full sm:w-auto">
                    <button
                      on:click={() => (replyingTo = null)}
                      class="flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-full transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      on:click={() => submitReply(comment.id, replyContents[comment.id])}
                      class="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Enviar</span>
                    </button>
                  </div>
                </div>
              </div>
            {/if}

            {#if comment.replies && comment.replies.length > 0}
              <div class="mt-4 space-y-3 pl-2 sm:pl-3 md:pl-6 border-l-2 border-gray-100">
                {#each comment.replies as reply}
                  <div class="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50/80 transition-colors">
                    <img
                      src={reply.author?.avatar_url || reply.photo_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + reply.author_id}
                      alt="Avatar do usuário"
                      class="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white p-0.5 ring-1 ring-gray-200"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="text-xs sm:text-sm font-semibold text-gray-800">
                          {reply.username || reply.author?.email || 'Usuário Anônimo'}
                        </h3>
                        <span class="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <p class="mt-1 text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">{reply.content}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  article {
    transform: translateY(0);
    transition: all 0.2s ease-in-out;
  }
  
  article:hover {
    transform: translateY(-1px);
  }

  /* Estilização personalizada da scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
</style>





