import {
  PokemonCardProps,
  PokemonDetail,
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
  PokeApiTypeDetailResponse,
  POKEMON_TYPES,
  MAX_POKEMON_ID,
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
          "/fallback.webp", // fallback
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
    const detailRes = await fetch(`${BASE_URL}/pokemon/${id}`, {
      headers: {
        "User-Agent": "Pokedex/1.0 (KyleBSCS)",
      },
      cache: "no-store",
    });

    if (!detailRes.ok) {
      console.warn(
        `Failed to fetch details for ID ${id}: ${detailRes.statusText}`
      );
      return null;
    }

    // fetch raw data
    const detailData: PokeApiRawPokemonData = await detailRes.json();

    return {
      id: detailData.id,
      name: detailData.name,
      imageUrl:
        detailData.sprites.other?.["official-artwork"]?.front_default ??
        detailData.sprites.other?.dream_world?.front_default ??
        detailData.sprites.front_default ??
        "/fallback.webp",
      types: detailData.types.map((typeInfo: any) => typeInfo.type.name),
      stats: detailData.stats.map((statInfo: any) => ({
        name: statInfo.stat.name,
        value: statInfo.base_stat,
      })),
      abilities: detailData.abilities.map(
        (abilityInfo: any) => abilityInfo.ability.name
      ),
      height: detailData.height,
      weight: detailData.weight,
      speciesUrl: detailData.species.url,
    };
  } catch (e) {
    console.error(`Error fetching basic details for ID ${id}`, e);
    return null;
  }
}

// Recursive function to extract evolution stages from the chain data
async function extractEvolutionStages(
  node: PokeApiEvolutionNode
): Promise<EvolutionStage[]> {
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
  });

  // Recursively process next evolution stages
  if (node.evolves_to && node.evolves_to.length > 0) {
    const nestedStagesPromises = node.evolves_to.map((nextNode) =>
      extractEvolutionStages(nextNode)
    );
    const nestedStagesArray = await Promise.all(nestedStagesPromises);
    stages = stages.concat(...nestedStagesArray);
  }

  return stages;
}

// Helper function to calculate weaknesses based on type relations
async function calculateWeaknesses(
  pokemonTypes: string[]
): Promise<Array<{ type: string; effectiveness: number }>> {
  if (!pokemonTypes || pokemonTypes.length === 0) {
    return [];
  }

  // Init multipliers for all possible ATK types
  const typeEffectiveness: { [key: string]: number } = {};
  POKEMON_TYPES.forEach((type) => {
    typeEffectiveness[type] = 1;
  });

  try {
    const typeDetailPromises = pokemonTypes.map((type) =>
      fetch(`${BASE_URL}/type/${type.toLowerCase()}`).then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch type ${type}:${res.statusText}`);
        return res.json() as Promise<PokeApiTypeDetailResponse>;
      })
    );

    const typeDetails = await Promise.all(typeDetailPromises);

    // Apply multipliers based on fetched relations
    for (const details of typeDetails) {
      const relations = details.damage_relations;

      relations.double_damage_from.forEach((typeRel) => {
        if (typeEffectiveness[typeRel.name] !== undefined) {
          typeEffectiveness[typeRel.name] *= 2;
        }
      });
      relations.half_damage_from.forEach((typeRel) => {
        if (typeEffectiveness[typeRel.name] !== undefined) {
          typeEffectiveness[typeRel.name] *= 0.5;
        }
      });
      relations.no_damage_from.forEach((typeRel) => {
        if (typeEffectiveness[typeRel.name] !== undefined) {
          typeEffectiveness[typeRel.name] *= 0;
        }
      });
    }

    // Filter non-weaknesses (effectiveness <= 1) and format result
    const weaknesses = Object.entries(typeEffectiveness)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, effectiveness]) => effectiveness > 1)
      .map(([type, effectiveness]) => ({ type, effectiveness }))
      .sort((a, b) => b.effectiveness - a.effectiveness);

    return weaknesses;
  } catch (e) {
    console.error("Error calculating weaknesses:", e);
    return [];
  }
}

// =-=-=-=-=-=-= MAIN SERVICE =-=-=-=-=-=-=-=
// For getting pokemon for cards in list view
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
export async function getPokemonDetailsById(
  id: number | string
): Promise<PokemonDetailedViewData | null> {
  console.log(`Fetching detailed view data for Pokemon ID: ${id}`);
  try {
    // STEP 1: Fetch Basic Pokemon Details (stats, abilities, types, images, speciesUrl, etc.)
    const basicDetails = await fetchBasicPokemonDetails(id);
    if (!basicDetails) {
      throw new Error(`Could not fetch basic details for Pokemon ${id}`);
    }

    // STEP 2: Fetch Species Data
    const speciesRes = await fetch(basicDetails.speciesUrl);
    if (!speciesRes.ok) {
      throw new Error(`Failed to fetch species data ${speciesRes.statusText}`);
    }
    const speciesData: PokeApiSpeciesDetail = await speciesRes.json();

    const genus =
      speciesData.genera?.find((g) => g.language.name === "en")?.genus ??
      "Unknown Species";
    const description =
      speciesData.flavor_text_entries
        ?.find((ft) => ft.language.name === "en")
        ?.flavor_text?.replace(/[\n\f]/g, " ") ?? "No description available.";

    const captureRate = speciesData.capture_rate;
    const baseHappiness = speciesData.base_happiness;
    const growthRate = speciesData.growth_rate?.name ?? "Unknown";
    const genderRate = speciesData.gender_rate;
    const habitat = speciesData.habitat?.name ?? null;
    const generation = speciesData.generation?.name ?? "Unknown";
    const isBaby = speciesData.is_baby;
    const isLegendary = speciesData.is_legendary;
    const isMythical = speciesData.is_mythical;

    // STEP 3: Fetch Evolution Chain Data
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionRes = await fetch(evolutionChainUrl);
    if (!evolutionRes.ok) {
      throw new Error(
        `Failed to fetch evolution chain: ${evolutionRes.statusText}`
      );
    }
    const evolutionData: PokeApiEvolutionChain = await evolutionRes.json();

    // STEP 4: Process Evolution Chain to get names, IDs, and images
    const evolutionStages = await extractEvolutionStages(evolutionData.chain);

    // STEP 5: Calculatge weaknesses using types
    const weaknesses = await calculateWeaknesses(basicDetails.types);

    // STEP 6: Combine all data
    const detailedData: PokemonDetailedViewData = {
      ...basicDetails,
      species: genus,
      description,
      evolutionChain: evolutionStages,
      weaknesses,
      generation,
      captureRate,
      baseHappiness,
      growthRate,
      genderRate,
      habitat,
      isBaby,
      isLegendary,
      isMythical,
    };

    console.log(`Successfully fetched detailed data for ${detailedData.name}`);
    return detailedData;
  } catch (e: any) {
    console.error(`Error in getPokemonDetailsById for ID ${id}`, e);
    return null;
  }
}
