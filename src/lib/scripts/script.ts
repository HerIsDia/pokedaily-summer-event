import type { Nature, Pokemon, PokemonSpecies, Type } from 'pokenode-ts';
import { getPokemonNature, getPokemonData, getPokemonTypes } from './pokeAPI';

const version = 'Summer 2023';

export interface AppData {
  _lastVersion: string;
  _done: boolean;
  SummerPokemons: PokemonData[];
}

interface PokemonData {
  id: number;
  rename: string;
  natureID: number;
  level: number;
  isShiny: boolean;
  fetched: {
    pokemon: { pokemon: Pokemon; species: PokemonSpecies };
    nature: Nature;
    types: Type[];
  };
}

export const script = async () => {
  const LocalData: AppData | undefined = localStorage.getItem('data')
    ? (JSON.parse(localStorage.getItem('data')!) as AppData)
    : undefined;
  let summerPokemons = LocalData ? LocalData.SummerPokemons : undefined;
  let done = LocalData ? LocalData._done : false;
  if (!done) {
    const teamOf = 6;
    const team: PokemonData[] = [];
    for (let index = 0; index < teamOf; index++) {
      const randomPokemon = Math.floor(Math.random() * 897) + 1;
      const fetchedNewPokemon = await getPokemonData(randomPokemon);
      const randomNature = Math.floor(Math.random() * 24) + 1;
      const fetchedNewNature: Nature = (await getPokemonNature(
        randomNature
      )) as Nature;
      const fetchedNewTypes: Type[] = [
        (await getPokemonTypes(
          fetchedNewPokemon.pokemon.types[0].type.name
        )) as Type,
        fetchedNewPokemon.pokemon.types.length == 2
          ? ((await getPokemonTypes(
            fetchedNewPokemon.pokemon.types[1].type.name
          )) as Type)
          : null,
      ];
      team.push({
        id: randomPokemon,
        rename: '',
        natureID: randomNature,
        level: Math.floor(Math.random() * 99) + 1,
        isShiny: Math.random() < 1 / 69,
        fetched: {
          pokemon: fetchedNewPokemon,
          nature: fetchedNewNature,
          types: fetchedNewTypes,
        },
      });
    }
    const newData: AppData = {
      _lastVersion: version,
      _done: true,
      SummerPokemons: team,
    };
    localStorage.setItem('data', JSON.stringify(newData));
    sessionStorage.setItem('done', '0');
    return newData;
  } else {
    sessionStorage.setItem('done', '1');
    return LocalData;
  }
};

export const setRename = (rename: string, i: number) => {
  const LocalData: AppData | undefined = localStorage.getItem('data')
    ? (JSON.parse(localStorage.getItem('data')!) as AppData)
    : undefined;
  if (!LocalData) return;
  LocalData.SummerPokemons[i].rename = rename;
  const newData: AppData = {
    ...LocalData,
    SummerPokemons: LocalData.SummerPokemons,
  };
  localStorage.setItem('data', JSON.stringify(newData));
};
