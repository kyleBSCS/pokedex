// Most types present in this file were created with the help of AI.
// Structure of the JSON for the details of a pokemon

export const MAX_POKEMON_ID = 1302;
export type SortByType = "id_asc" | "id_desc" | "name_asc" | "name_desc";
export const POKEMON_TYPES = [
  "grass",
  "fire",
  "water",
  "electric",
  "psychic",
  "dark",
  "fairy",
  "steel",
  "dragon",
  "ghost",
  "bug",
  "rock",
  "ground",
  "poison",
  "flying",
  "normal",
  "ice",
  "fighting",
];

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    other?: {
      dream_world?: {
        front_default: string | null;
      };
      "official-artwork"?: {
        front_default: string | null;
      };
    };
    front_default: string | null;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

interface PokeApiStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokeApiAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokeApiGenus {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

interface PokeApiFlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version: { name: string; url: string };
}

export interface PokeApiSpeciesDetail {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: { name: string; url: string };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: { name: string; url: string };
  }>;
  egg_groups: Array<{ name: string; url: string }>;
  color: { name: string; url: string };
  shape: { name: string; url: string };
  evolves_from_species: PokeApiResource | null;
  evolution_chain: { url: string };
  habitat: { name: string; url: string } | null;
  generation: { name: string; url: string };
  names: Array<{ language: { name: string; url: string }; name: string }>;
  flavor_text_entries: PokeApiFlavorTextEntry[];
  form_descriptions: Array<{
    description: string;
    language: { name: string; url: string };
  }>;
  genera: PokeApiGenus[];
  varieties: Array<{ is_default: boolean; pokemon: PokeApiResource }>;
}

interface PokeApiEvolutionNode {
  species: PokeApiResource;
  evolves_to: PokeApiEvolutionNode[];
  is_baby: boolean;
}

export interface PokeApiEvolutionChain {
  id: number;
  baby_trigger_item: any;
  chain: PokeApiEvolutionNode;
}

// Structure of the JSON for the list of pokemon
export interface PokeApiResource {
  name: string;
  url: string;
}

export interface PokeApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiResource[];
}

export interface PokeApiTypeResponse {
  id: number;
  name: string;
  pokemon: Array<{
    slot: number;
    pokemon: PokeApiResource;
  }>;
}

export interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export interface GetPokemonOptions {
  limit: number;
  offset: number;
  search?: string;
  types?: string[];
  sort?: SortByType;
}

// What is returned in our service layer
export interface ApiPokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonCardProps[];
}

export interface ButtonProps {
  name: string;
  label?: string;
  isActive: boolean;
  onClick: (name: string) => void;
  colorType?: "type" | "sort" | "default";
}

export interface FilterBoxProps {
  searchTerm: string;
  selectedTypes: string[];
  sortBy: SortByType;
  cardAmount: number;
  onSearchChange: (term: string) => void;
  onTypeToggle: (type: string) => void;
  onSortChange: (sortKey: SortByType) => void;
  onCardViewAmtChange: (amount: number) => void;
}
