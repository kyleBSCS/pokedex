import {
  PokemonCardProps,
  PokemonDetail,
  SortByType,
  PokeApiResource,
  PokeApiPokemonListResponse,
  PokeApiTypeResponse,
} from "@/types/responses";
import { formatPokemonId } from "@/utils/helper";

const BASE_URL = "https://pokeapi.co/api/v2";
const MAX_POKEMON_ID = 1025;
// To be adjusted

// =-=-=-=-=-=-= CACHE =-=-=-=-=-=-=-=
// For caching
let fullPokemonListCache: PokeApiResource[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 10 * 60 * 1000; // Cache for 10 minutes

// =-=-=-=-=-=-= HELPER =-=-=-=-=-=-=-=
// Fetches full list of Pokemon names/URLs from PokeAPI or uses cache
async function getFullPokemonList(): Promise<PokeApiResource[]> {
  // Check local storage
  const now = Date.now();
  if (
    fullPokemonListCache &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION_MS
  ) {
    console.log("Using cached full Pokemon List");
    return fullPokemonListCache;
  }

  // If list not found in local storage, fetch from PokeAPI
  console.log("Fetching full Pokemon list from PokeAPI...");
  try {
    const response = await fetch(
      `${BASE_URL}/pokemon?limit=${MAX_POKEMON_ID}&offset=0`
    );
    if (!response.ok) {
      throw new Error(
        `PokeAPI error fetching full list: ${response.statusText}`
      );
    }

    const data: PokeApiPokemonListResponse = await response.json();
    fullPokemonListCache = data.results;
    cacheTimestamp = now;
    console.log(
      `Fetched and cached ${fullPokemonListCache.length} Pokemon references`
    );
    return fullPokemonListCache;
  } catch (e) {
    console.error("Error fetching full Pokemon list:", e);
    return fullPokemonListCache || [];
  }
}

// Fetches Pokemon belong to specific types
async function getPokemonByTypes(types: string[]): Promise<PokeApiResource[]> {
  console.log(`Fetching Pokemon for types: ${types.join(", ")}`);
  const typePromises = types.map(async (type) => {
    try {
      const res = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`);

      if (!res.ok) {
        console.warn(`Failed to fetch type ${type}: ${res.statusText}`);
        return [];
      }

      const data: PokeApiTypeResponse = await res.json();
      return data.pokemon.map((p) => p.pokemon);
    } catch (e) {
      console.error(`Error fetching type ${type}:`, e);
      return [];
    }
  });

  const resultsPerType = await Promise.all(typePromises);

  // Combine results and remove duplicates
  const combinedMap = new Map<string, PokeApiResource>();
  resultsPerType.flat().forEach((pokemon) => {
    if (!combinedMap.has(pokemon.name)) {
      combinedMap.set(pokemon.name, pokemon);
    }
  });

  const uniquePokemon = Array.from(combinedMap.values());
  console.log(
    `Found ${uniquePokemon.length} unique Pokemon across specified types.`
  );
  return uniquePokemon;
}

// Fetches detailed data for a list of Pokemon URLs
async function getPokemonDetails(
  pokemonResources: PokeApiResource[]
): Promise<PokemonCardProps[]> {
  if (!pokemonResources || pokemonResources.length === 0) {
    return [];
  }
  const detailPromises = pokemonResources.map(async (resource) => {
    try {
      // Use the direct PokeAPI URL for details
      const detailRes = await fetch(resource.url);
      if (!detailRes.ok) {
        console.warn(
          `Failed to fetch details for ${resource.name}: ${detailRes.statusText}`
        );
        return null; // Skip this Pokemon if details fail
      }
      const detail: PokemonDetail = await detailRes.json();
      return {
        id: detail.id,
        name: detail.name,
        imageUrl:
          detail.sprites.other?.["official-artwork"]?.front_default ??
          detail.sprites.other?.dream_world?.front_default ??
          detail.sprites.front_default ??
          "/pokeball.svg", // fallback
        types: detail.types.map((typeInfo) => typeInfo.type.name),
      };
    } catch (detailError) {
      console.error(
        `Error fetching details for ${resource.name}:`,
        detailError
      );
      return null; // Skip on error
    }
  });

  const detailedResults = await Promise.all(detailPromises);

  return [];
}

// =-=-=-=-=-=-= MAIN SERVICE =-=-=-=-=-=-=-=
