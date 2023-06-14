<script lang="ts">
  import Pokemon from './lib/components/Pokemon.svelte';
  import { script } from './lib/scripts/script';
  import Fa from 'svelte-fa';
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';
  import { fly } from 'svelte/transition';
  const allData = script();
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });
  const online = navigator.onLine;
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : '';
  if (needRefresh) {
    updateServiceWorker(true);
  }
</script>

<div class="app {dark}">
  <nav class="navbar">
    <hgroup>
      <h1>☀️ Summer team ☀️</h1>
      <p>What is your summer team ?</p>
      <p class="credits">
        Made with 💜 by <a
          href="https://herisdia.me"
          target="_blank"
          rel="noopener noreferrer">diamant</a
        >.<br />Pokédaily is not affiliated with Nintendo, Creatures Inc. or
        GAME FREAK Inc. // Pokémon and Pokémon character names are trademarks of
        Nintendo.
      </p>
    </hgroup>
  </nav>

  <main>
    <div class="dailyPokemon">
      {#await allData}
        <div
          class="loading"
          transition:fly={{
            y: -200,
            duration: sessionStorage.getItem('done') == '1' ? 0 : 2000,
          }}
        >
          <Fa icon={faSpinner} size="3x" spin />
          <h2>Loading...</h2>
        </div>
      {:then data}
        <div class="result">
          {#each data.SummerPokemons as pokemon, i}
            <div
              class="pk"
              transition:fly={{
                y: 100,
                delay:
                  sessionStorage.getItem('done') == '1' ? 0 : 2000 + i * 1000,
                duration: sessionStorage.getItem('done') == '1' ? 0 : 1000,
              }}
            >
              <Pokemon {data} {i} />
            </div>
          {/each}
        </div>
      {/await}
    </div>
  </main>
</div>

<style lang="scss">
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app {
    --primary: rgb(24, 24, 24);
    --secondary: #eaeaea;
    &.dark {
      --primary: #eaeaea;
      --secondary: rgb(24, 24, 24);
    }
    background-color: var(--secondary);
    color: var(--primary);
    min-height: 100vh;
  }

  :global(::selection) {
    background-color: var(--primary);
    color: var(--secondary);
  }

  :global(body) {
    font-family: 'Open Sans', sans-serif;
  }

  .dailyPokemon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    overflow: hidden;
    .loading {
      text-align: center;
    }
    .result {
      display: grid;
      // Have a grid of 3*2
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      // Have a gap of 10px
      gap: 10px;
      // Make it responsive
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
      }
      @media (max-width: 480px) {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(6, 1fr);
      }
    }
  }

  .navbar {
    display: flex;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    padding: 20px;
    font-size: 24px;
    text-align: center;
    hgroup p {
      font-size: 18px;
    }
    .credits {
      opacity: 0.8;
      margin-top: 6px;
      font-size: 12px;
      a {
        color: var(--primary);
        transition: color 0.5s ease-in-out;
        &:hover {
          color: #b69bc9;
        }
      }
    }
  }

  footer {
    margin-top: 50px;
    text-align: center;
    opacity: 0.8;
    font-size: 12px;
    a {
      color: #b69bc9;
    }
  }
</style>
