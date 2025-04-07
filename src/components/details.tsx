import { PokemonDetailedViewData } from "@/types/types";
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

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75">
      <div className="bg-white p-12 rounded-lg border-2 border-black relative grid grid-cols-1 sm:grid-cols-[1fr_2fr] w-full max-w-[1300px] max-h-[900px] m-12 overflow-auto gap-6">
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
              src="/010.png"
              width={300}
              height={300}
              alt="Caterpie"
              className="relative select-none"
            />
          </div>

          {/* Types and Name */}
          <div className="font-mono sm:pl-4 mt-1">
            <div className="flex gap-1">
              <h1 className="font-semibold text-md text-white bg-red-500 px-2 rounded-xl">
                Fire
              </h1>
              <h1 className="font-semibold text-md text-white bg-green-700 px-2 rounded-xl">
                Bug
              </h1>
            </div>
            <h1 className="text-3xl font-bold mt-1">Caterpie</h1>
            <h2 className="text-xl font-semibold">#010</h2>
          </div>

          {/* Description */}
          <p className="font-mono font-bold text-gray-700 text-xl tracking-tight sm:pl-4 mt-2">
            Often hides in water to stalk unwary prey. For swimming fast, it
            moves its ears to maintain balance.
          </p>

          {/* Base Stats */}
          <div className="flex flex-col gap-2 mt-4 sm:pl-4">
            <h1 className="text-2xl font-bold">Base Stats</h1>
            <div className="flex justify-between">
              <span>HP</span>
              <span>45</span>
            </div>
            <div className="flex justify-between">
              <span>Attack</span>
              <span>49</span>
            </div>
            <div className="flex justify-between">
              <span>Defense</span>
              <span>65</span>
            </div>
            <div className="flex justify-between">
              <span>Special Attack</span>
              <span>65</span>
            </div>
            <div className="flex justify-between">
              <span>Special Defense</span>
              <span>55</span>
            </div>
            <div className="flex justify-between">
              <span>Speed</span>
              <span>45</span>
            </div>
          </div>
        </div>

        {/* Second Column: Pokedex Data, Training, Defenses, Evolution */}
        <div className="flex flex-col gap-4 sm:pl-12">
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
