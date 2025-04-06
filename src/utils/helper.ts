// Helper function to format Pokemon ID (e.g., 1 -> #001)
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};
