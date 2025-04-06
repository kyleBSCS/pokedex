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
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
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
