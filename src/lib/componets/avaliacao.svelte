<script lang="ts">
    let rating: number = 0;
  
    function setRating(value: number) {
      rating = value;
    }
  </script>
  
  <div class="rating">
    {#each Array(5) as _, i (5 - i)}
      <input 
        type="radio" 
        id="star{5 - i}" 
        name="rate" 
        value="{5 - i}" 
        bind:group="{rating}" 
        on:change="{() => setRating(5 - i)}" 
      />
      <label for="star{5 - i}" title="text">★</label>
    {/each}
  </div>
  
  <style>
    /* Ocultar os inputs de rádio */
    .rating input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
  
    .rating label {
      float: right;
      cursor: pointer;
      font-size: 30px;
      color: #666;
    }
  
    .rating label:hover,
    .rating label:hover ~ label,
    .rating input:checked ~ label {
      color: #ffa723;
    }
  
    .rating label:hover ~ input:checked ~ label,
    .rating input:checked + label:hover,
    .rating input:checked + label:hover ~ label,
    .rating input:checked ~ label:hover {
      color: #e58e09;
    }
  </style>
  