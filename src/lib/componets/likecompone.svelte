<script>
  let likes = 0; // Contador de curtidas

  function incrementLikes() {
    likes += 1; // Incrementa o contador
  }
</script>

<style>
  .like-button {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-family: Arial, sans-serif;
  }

  .like-button button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #f1f1f1;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }

  .like-button button:hover {
    transform: scale(1.1);
  }

  .like-button button:active {
    transform: scale(0.9);
  }

  .like-button svg {
    fill: #707277;
    width: 24px;
    height: 24px;
  }

  .like-button svg.liked {
    fill: #f5356e;
  }
</style>

<div class="like-button">
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button on:click={incrementLikes}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={likes > 0 ? 'liked' : ''}
    >
      <path
        d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
      ></path>
    </svg>
  </button>
  <span>{likes} curtida{likes === 1 ? '' : 's'}</span>
</div>
