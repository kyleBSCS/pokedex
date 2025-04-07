import { PokemonDetailedViewData } from "@/types/types";
import { formatPokemonId, formatStatName } from "@/utils/helper";
import { getBGColorForType } from "@/utils/typeColors";
import Image from "next/image";

interface DetailsProps {
  pokemonData: PokemonDetailedViewData | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function Details({
  pokemonData,
  isLoading,
  error,
  onClose,
}: DetailsProps) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-50">
        <div className="bg-white p-12 rounded-lg border-2 border-black text-center">
          <Image
            src="/loading.png"
            alt="Loading details..."
            width={60}
            height={60}
            className="animate-spin mx-auto mb-4"
          />
          <p className="text-xl font-semibold">Loading Pokémon data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-50">
        <div className="bg-white p-12 rounded-lg border-2 border-red-500 text-center">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✖
          </button>
          <p className="text-xl font-semibold text-red-600">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!pokemonData) {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-50">
        <div className="bg-white p-12 rounded-lg border-2 border-black text-center">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✖
          </button>
          <p className="text-xl font-semibold">No data available.</p>
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    imageUrl,
    types,
    description,
    stats,
    species,
    height,
    weight,
    abilities,
    evolutionChain,
  } = pokemonData;
  const formattedId = formatPokemonId(id);
  const formattedHeight = `${(height / 10).toFixed(1)} m`;
  const formattedWeight = `${(weight / 10).toFixed(1)} kg`;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75">
      <div className="bg-white p-12 rounded-lg border-2 border-black relative grid grid-cols-1 sm:grid-cols-[1fr_2fr] w-full max-w-[1300px] max-h-[900px] m-12 overflow-y-auto gap-6">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-black">
          ✖
        </button>

        {/* First Column: Picture, Basic Details, Base Stats */}
        <div className="w-full">
          {/* Picture */}
          <div className="relative w-full flex justify-center items-center ">
            {/* Background Rectangle */}
            <div className="absolute w-[205px] h-[205px] sm:w-[150px] sm:h-[150px] lg:w-[205px] lg:h-[205px] bg-lime-300 rounded-4xl"></div>
            {/* Pokémon Image */}
            <Image
              draggable="false"
              src={imageUrl}
              width={300}
              height={300}
              alt={name}
              className="relative select-none"
            />
          </div>

          {/* Types and Name */}
          <div className="font-mono sm:pl-4 mt-1">
            <div className="flex gap-1">
              {types.map((type) => (
                <h1
                  className={`font-semibold text-md text-white ${getBGColorForType} px-2 rounded-xl`}
                >
                  {type}
                </h1>
              ))}
            </div>
            <h1 className="text-3xl font-bold mt-1 capitalize">{name}</h1>
            <h2 className="text-xl font-semibold">{formattedId}</h2>
          </div>

          {/* Description */}
          <p className="font-mono font-bold text-gray-700 text-xl tracking-tight sm:pl-4 mt-2">
            {description}
          </p>

          {/* Base Stats */}
          <div className="flex flex-col gap-1 mt-4 sm:pl-4">
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Base Stats</h3>
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="grid grid-cols-[max-content_1fr_max-content] gap-2 items-center text-sm lg:text-base"
              >
                <span className="font-semibold text-gray-600">
                  {formatStatName(stat.name)}
                </span>
                {/* Basic Progress Bar (Optional but nice) */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full
                    "
                    style={{
                      width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                      backgroundColor: getBGColorForType(types[0]),
                    }}
                  ></div>{" "}
                  {/* Max stat assumed ~255 */}
                </div>
                <span className="font-bold text-right w-8">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Column: Pokedex Data, Training, Defenses, Evolution */}
        <div className="flex flex-col gap-4 sm:pl-12 flex-grow">
          {/* Pokedex Data */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Pokédex Data</h3>
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm lg:text-base">
              <span className="font-semibold text-gray-600">Species</span>
              <span className="capitalize">{species}</span>

              <span className="font-semibold text-gray-600">Height</span>
              <span>{formattedHeight}</span>

              <span className="font-semibold text-gray-600">Weight</span>
              <span>{formattedWeight}</span>

              <span className="font-semibold text-gray-600">Abilities</span>
              <span className="capitalize">
                {abilities.map((ability, index) => (
                  <span key={ability}>
                    {ability.replace("-", " ")}
                    {index < abilities.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
              {/* Add more fields like Gender Ratio, Egg Groups if fetched */}
            </div>
          </div>

          {/* Pokedex Data */}
          <h1 className="text-2xl font-bold">Pokédex Data</h1>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 font-bold text-gray-600">
              <span>Species</span>
              <span>Height</span>
              <span>Weight</span>
              <span>Abilities</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Bug Pokémon</span>
              <span>1'00"</span>
              <span>6.4 lbs</span>
              <span>Shield Dust</span>
            </div>
          </div>

          {/* Pokedex Data */}
          <h1 className="text-2xl font-bold">Pokédex Data</h1>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 font-bold text-gray-600">
              <span>Species</span>
              <span>Height</span>
              <span>Weight</span>
              <span>Abilities</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Bug Pokémon</span>
              <span>1'00"</span>
              <span>6.4 lbs</span>
              <span>Shield Dust</span>
            </div>
          </div>
        </div>

        {/* Background Element of ID */}
        <div className="hidden sm:block absolute bottom-4 right-4 text-6xl text-gray-300 font-bold">
          #010
        </div>
      </div>
    </div>
  );
}
