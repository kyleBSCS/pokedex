// Helper function to format Pokemon ID (e.g., 1 -> #001)
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Helper function to format stat names
export const formatStatName = (name: string): string => {
  switch (name) {
    case "hp":
      return "HP";
    case "attack":
      return "ATK";
    case "defense":
      return "DEF";
    case "special-attack":
      return "SP. ATK";
    case "special-defense":
      return "SP. DEF";
    case "speed":
      return "SPEED";
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
};
