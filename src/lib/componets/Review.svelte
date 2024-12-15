<!-- <script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '../../supabaseConfig';
  
    type Review = {
      id: number;
      name: string;
      comment: string;
      rating: number;
      date: string;
    };
  
    let reviews: Review[] = [];
    let averageRating: number = 0;
  
    let name = '';
    let comment = '';
    let rating = 0;
  
    // Função para calcular a média de avaliações
    function calculateAverageRating() {
      const total = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = total / reviews.length || 0;
    }
  
    // Função para carregar avaliações do Supabase
    async function loadReviews() {
      const { data, error } = await supabase.from('comments').select('*').order('date', { ascending: false });
      if (error) {
        console.error('Erro ao carregar avaliações:', error.message);
      } else if (data) {
        reviews = data as Review[];
        calculateAverageRating();
      }
    }
  
    // Função para adicionar uma nova avaliação ao Supabase
    async function addReview() {
      if (name && comment && rating) {
        const newReview = {
          name,
          comment,
          rating,
          date: new Date().toISOString()
        };
  
        const { data, error } = await supabase.from('comments').insert([newReview]);
        if (error) {
          console.error('Erro ao adicionar avaliação:', error.message);
        } else if (data) {
          reviews = [data[0], ...reviews]; // Adiciona o novo comentário na lista local
          calculateAverageRating();
  
          // Limpa os campos do formulário
          name = '';
          comment = '';
          rating = 0;
        }
      }
    }
  
    onMount(() => {
      loadReviews(); // Carrega as avaliações ao montar o componente
    });
  </script>
  
  <div class="review-section">
    <h2>Comentários e Avaliações</h2>
  
    <div class="average-rating">
      <span>Média: {averageRating.toFixed(1)} ★</span>
      <p>Baseado em {reviews.length} avaliações</p>
    </div>
  
    <form class="review-form" on:submit|preventDefault={addReview}>
      <div class="form-group">
        <label for="name">Nome</label>
        <input type="text" id="name" bind:value={name} placeholder="Digite seu nome" required />
      </div>
  
      <div class="form-group">
        <label for="rating">Avaliação</label>
        <select id="rating" bind:value={rating} required>
          <option value="0">Selecione uma nota</option>
          <option value="1">1 Estrela</option>
          <option value="2">2 Estrelas</option>
          <option value="3">3 Estrelas</option>
          <option value="4">4 Estrelas</option>
          <option value="5">5 Estrelas</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="comment">Comentário</label>
        <textarea id="comment" bind:value={comment} placeholder="Escreva seu comentário" required></textarea>
      </div>
  
      <button type="submit" class="submit-button">Enviar Avaliação</button>
    </form>
  
    <div class="review-list">
      {#each reviews as review}
        <div class="review-item">
          <h3>{review.name} <span>{'★'.repeat(review.rating)}</span></h3>
          <p class="review-comment">{review.comment}</p>
          <small>{new Date(review.date).toLocaleDateString()}</small>
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .review-section {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
  
    h2 {
      text-align: center;
    }
  
    .average-rating {
      text-align: center;
      margin-bottom: 1rem;
    }
  
    .review-form {
      margin-bottom: 2rem;
    }
  
    .form-group {
      margin-bottom: 1rem;
    }
  
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
  
    input,
    select,
    textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    button {
      width: 100%;
      padding: 0.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  
    .review-list {
      margin-top: 2rem;
    }
  
    .review-item {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 1rem;
      background-color: #fff;
    }
  
    .review-comment {
      margin: 0.5rem 0;
    }
  </style>
   -->