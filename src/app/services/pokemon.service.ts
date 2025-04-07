import {
  PokemonCardProps,
  PokemonDetail,
  SortByType,
  PokeApiResource,
  PokeApiPokemonListResponse,
  PokeApiTypeResponse,
  GetPokemonOptions,
  PokeApiRawPokemonData,
  PokeApiSpeciesDetail,
  PokeApiEvolutionChain,
  PokeApiEvolutionNode,
  PokemonDetailedViewData,
  EvolutionStage,
  MAX_POKEMON_ID
} from "@/types/types";
import { formatPokemonId } from "@/utils/helper";
const BASE_URL = "https://pokeapi.co/api/v2";

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

      const detail: PokeApiRawPokemonData = await detailRes.json();
      return {
        id: detail.id,
        name: detail.name,
        imageUrl:
          detail.sprites.other?.["official-artwork"]?.front_default ??
          detail.sprites.other?.dream_world?.front_default ??
          detail.sprites.front_default ??
          "/fallback.png", // fallback
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
  const filteredResults = detailedResults.filter(
    (p): p is PokemonCardProps => p !== null
  );
  console.log(`Filtered detailed results count: ${filteredResults.length}`);
  return filteredResults;
}

// Fetches basic details for a single Pokemon ID
async function fetchBasicPokemonDetails(
  id: number | string
): Promise<PokemonDetail | null> {
  try {
    const detailRes = await fetch(`${BASE_URL}/pokemon/${id}}`);

    if (!detailRes.ok) {
      console.warn(
        `Failed to fetch details for ID ${id}: ${detailRes.statusText}`
      );
      return null;
    } 

    // fetch raw data
    const detailData: PokeApiRawPokemonData = await detailRes.json();

    return {
      id: detailData.id;
      name: detailData.name,
      imageUrl:detailData.sprites.other?.["official-artwork"]?.front_default ??
        detailData.sprites.other?.dream_world?.front_default ??
        detailData.sprites.front_default ??
        "/placeholder.png",
      types: detailData.types.map((typeInfo: any) => typeInfo.type.name),
      stats: detailData.stats.map((statInfo: any) => ({
        name: statInfo.stat.name,
        value: statInfo.base_stat
      })),
      abilities: detailData.abilities.map((abilityInfo: any) => abilityInfo.ability.name),
      height: detailData.height,
      weight: detailData.weight,
      speciesUrl: detailData.species.url,
    };
  } catch (e) {
    console.error(`Error fetching basic details for ID ${id}`, e)
    return null;
  }
}

// Recursive function to extract evolution stages from the chain data
async function extractEvolutionStages(node: PokeApiEvolutionNode): Promise<EvolutionStage[]> {
  let stages: EvolutionStage[] = [];
  const speciesUrl = node.species.url;
  const speciesIdMatch = speciesUrl.match(/\/(\d+)\/?$/);
  if (!speciesIdMatch) return [];

  const speciesId = parseInt(speciesIdMatch[1], 10);

  const pokemonDetails = await fetchBasicPokemonDetails(speciesId);
  const imageUrl = pokemonDetails?.imageUrl || "/placeholder.png";

  stages.push({
    id: speciesId,
    name: node.species.name,
    imageUrl: imageUrl,
  })

  // Recursively process next evolution stages
  if (node.evolves_to && node.evolves_to.length > 0) {
    const nestedStagesPromises = node.evolves_to.map(nextNode => extractEvolutionStages(nextNode));
    const nestedStagesArray = await Promise.all(nestedStagesPromises);
    stages = stages.concat(...nestedStagesArray)
  }

  return stages;
}

// =-=-=-=-=-=-= MAIN SERVICE =-=-=-=-=-=-=-=
export async function getPokemon(
  options: GetPokemonOptions
): Promise<{ pokemon: PokemonCardProps[]; totalCount: number }> {
  const { limit, offset, search, types, sort = "id_asc" } = options;
  console.log("getPokemon Service Options:", options);

  let basePokemonList: PokeApiResource[];

  // STEP 1: Determine Base List
  if (types && types.length > 0) {
    basePokemonList = await getPokemonByTypes(types);
  } else {
    basePokemonList = await getFullPokemonList();
  }

  // STEP 2: Apply Search Filter (if user wants to search)
  let filteredList = basePokemonList;
  if (search && search.trim()) {
    const lowerSearchTerm = search.trim().toLowerCase();
    filteredList = basePokemonList.filter((pokemon) => {
      const idMatch = pokemon.url.match(/\/(\d+)\/?$/); // Extract the ID from URL
      const pokemonId = idMatch ? idMatch[1] : null;
      const formattedId = pokemonId
        ? formatPokemonId(parseInt(pokemonId, 10))
        : "";

      return (
        pokemon.name.toLowerCase().includes(lowerSearchTerm) ||
        pokemonId === lowerSearchTerm || // Exact ID match
        formattedId.includes(lowerSearchTerm) // Match #000 format
      );
    });

    console.log(
      `Filtered by search "${search}". Count: ${filteredList.length}`
    );
  }

  // STEP 3: Apply Sorting
  filteredList.sort((a, b) => {
    // Extract the ID
    const idA = parseInt(a.url.split("/").filter(Boolean).pop() || "0", 10);
    const idB = parseInt(b.url.split("/").filter(Boolean).pop() || "0", 10);

    switch (sort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "id_desc":
        return idB - idA;
      case "id_asc":
      default:
        return idA - idB;
    }
  });
  console.log(`Sorted by "${sort}".`);

  // STEP 4: Apply Pagination
  const totalCount = filteredList.length;
  const paginatedList = filteredList.slice(offset, offset + limit);
  console.log(
    `Paginated list: Offset=${offset}, Limit=${limit}. Count: ${paginatedList.length}. Total matching: ${totalCount}`
  );

  // STEP 5: Fetch Details for the Paginated List
  const detailedPokemon = await getPokemonDetails(paginatedList);
  console.log(`Fetched details for ${detailedPokemon.length}`);

  // STEP 6: Return Results
  return {
    pokemon: detailedPokemon,
    totalCount: totalCount,
  };
}

// For getting detailed view data
export async function getPokemonDetailsById(id: number | string): Promise<PokemonDetailedViewData | null> {
  console.log(`Fetching detailed view data for Pokemon ID: ${id}`);
  try {
    // STEP 1: Fetch Basic Pokemon Details (stats, abilities, types, images, speciesUrl, etc.)
    const basicDetails = await fetchBasicPokemonDetails(id);
    if (!basicDetails) {
      throw new Error (`Could not fetch basic details for Pokemon ${id}`);
    }
    
    // STEP 2: Fetch Specied Data
    const speciesRes = await fetch(basicDetails.speciesUrl);
    if (!speciesRes.ok) {
      throw new Error (`Failed to fetch species data ${speciesRes.statusText}`);
    }
    const speciesData: PokeApiSpeciesDetail = await speciesRes.json();

    const genus = speciesData.genera?.find(g => g.language.name === 'en')?.genus ?? 'Unknown Species';
    const description = speciesData.flavor_text_entries?.find(ft => ft.language.name === 'en')?.flavor_text?.replace(/[\n\f]/g, ' ') ?? 'No description available.';

    // STEP 3: Fetch Evolution Chain Data
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionRes = await fetch(evolutionChainUrl);
    if (!evolutionRes.ok) {
      throw new Error(`Failed to fetch evolution chain: ${evolutionRes.statusText}`);
    }
    const evolutionData: PokeApiEvolutionChain = await evolutionRes.json();


    // STEP 4: Process Evolution Chain to get names, IDs, and images
    const evolutionStages = await extractEvol

    // STEP 5: Combine all data
    
  } catch (e: any) {
    console.error( `Error in getPokemonDetailsById for ID ${id}`, e);
    return null;
  }
}