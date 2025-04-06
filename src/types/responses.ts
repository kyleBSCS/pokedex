// Structure of the JSON for the details of a pokemon
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

// Structure of the JSON for the list of pokemon
export interface PokeApiResource {
  name: string;
  url: string;
}

export interface PokeApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
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
  onSearchChange: (term: string) => void;
  onTypeToggle: (type: string) => void;
  onSortChange: (sortKey: SortByType) => void;
}

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
