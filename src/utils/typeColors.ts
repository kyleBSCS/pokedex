const typeColorMap: { [key: string]: string } = {
  normal: "#A8A77A", // Khaki
  fire: "#EE8130", // OrangeRed
  water: "#6390F0", // DodgerBlue
  electric: "#F7D02C", // Gold
  grass: "#7AC74C", // LimeGreen
  ice: "#96D9D6", // PaleTurquoise
  fighting: "#C22E28", // Firebrick
  poison: "#A33EA1", // MediumOrchid
  ground: "#E2BF65", // SandyBrown
  flying: "#A98FF3", // Lavender
  psychic: "#F95587", // Pink
  bug: "#A6B91A", // YellowGreen
  rock: "#B6A136", // DarkKhaki
  ghost: "#735797", // RebeccaPurple
  dragon: "#6F35FC", // BlueViolet
  dark: "#705746", // SaddleBrown
  steel: "#B7B7CE", // LightSteelBlue
  fairy: "#D685AD", // PaleVioletRed
  default: "#A8A77A", // Default to Normal color
};

export const getBGColorForType = (type: string): string => {
  return typeColorMap[type.toLowerCase()] || typeColorMap.default;
};
