<script lang="ts">
  import { setRename } from '../scripts/script';
  import type { AppData } from '../scripts/script';
  import Infos from './Infos.svelte';
  export let data: AppData;
  export let i: number;
  const id = data.SummerPokemons[i].id;
  const stringID = `${id < 100 ? (id < 10 ? `00${id}` : `0${id}`) : `${id}`}${
    data.SummerPokemons[i].isShiny ? 'S' : ''
  }`;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userLang: 'fr' | 'en' =
    (urlParams.get('lang') || navigator.language.slice(0, 2)) == 'fr'
      ? 'fr'
      : 'en';

  const PokemonName = data.SummerPokemons[i].fetched.pokemon.species.names.find(
    (name) => name.language.name === userLang
  ).name;

  let rename: string =
    data.SummerPokemons[i].rename == ''
      ? PokemonName
      : data.SummerPokemons[i].rename;

  const types = data.SummerPokemons[i].fetched.types.filter(
    (type) => type != null
  );

  const sr = () => {
    if (rename.length > 16) {
      rename = rename.slice(0, 16);
    }
    setRename(rename, i);
  };
</script>

<div class="poke">
  <img
    src="./images/{stringID}.png"
    alt={data.SummerPokemons[i].fetched.pokemon.pokemon.name}
  />
  <h2 contenteditable="true" bind:innerHTML={rename} on:keyup={sr}>
    {data.SummerPokemons[i].rename}
  </h2>
  <h4>{PokemonName}</h4>
  <div class="infos">
    <Infos type="leveling" text="Level {data.SummerPokemons[i].level}" />
    <Infos
      type="nature"
      text={data.SummerPokemons[i].fetched.nature.names.find(
        (name) => name.language.name === userLang
      ).name}
    />
  </div>
  <div class="types">
    {#each types as type}
      <Infos
        type="type"
        text={type.names.find((name) => name.language.name === userLang).name}
        pokemonType={type.name.toLowerCase()}
      />
    {/each}

    {#if data.SummerPokemons[i].isShiny}
      <Infos type="shiny" text="✨" />
    {/if}
  </div>
</div>

<style lang="scss">
  .poke {
    img {
      max-width: 30%;
      margin-bottom: 25px;
    }
    h2 {
      font-size: 24px;
    }
    h4 {
      font-size: 16px;
      font-weight: 200;
      margin-bottom: 5px;
    }
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .infos,
    .types {
      display: flex;
      flex-direction: row;
      font-size: 10px;
      opacity: 0.8;
    }
  }
</style>
