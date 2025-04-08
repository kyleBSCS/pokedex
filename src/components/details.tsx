import { PokemonDetailedViewData, loadingQuotes } from "@/types/types";
import { formatPokemonId, formatStatName } from "@/utils/helper";
import { getBGColorForType } from "@/utils/typeColors";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mars,
  Venus,
  CircleSmall,
} from "lucide-react";
import Image from "next/image";
import { JSX, useRef } from "react";

interface DetailsProps {
  pokemonData: PokemonDetailedViewData | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function Details({
  pokemonData,
  isLoading,
  error,
  onClose,
  onPrevious,
  onNext,
  isFirst,
  isLast,
}: DetailsProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const randomQuote =
    loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)];

  // Helper to format gender rate
  const formatGender = (genderRate: number): JSX.Element | string => {
    if (genderRate === -1) {
      return (
        <span className="inline-flex items-center gap-1">
          <CircleSmall aria-label="Genderless" className="text-gray-500" />{" "}
          Genderless
        </span>
      );
    }
    if (genderRate === 0) {
      return (
        <span className="inline-flex items-center gap-1">
          <Mars aria-label="Male" className="text-blue-500" /> 100% Male
        </span>
      );
    }
    if (genderRate === 8) {
      return (
        <span className="inline-flex items-center gap-1">
          <Venus aria-label="Female" className="text-pink-500" /> 100% Female
        </span>
      );
    }
    // Calculate ratio (female rate is in 1/8ths)
    const femalePercentage = (genderRate / 8) * 100;
    const malePercentage = 100 - femalePercentage;
    return (
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex items-center gap-1">
          <Mars aria-label="Male" className="text-blue-500" />{" "}
          {malePercentage.toFixed(1)}%
        </span>
        <span className="inline-flex items-center gap-1">
          <Venus aria-label="Female" className="text-pink-500" />{" "}
          {femalePercentage.toFixed(1)}%
        </span>
      </span>
    );
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75"
        onClick={handleBackdropClick}
      >
        <div className="bg-white p-12 rounded-lg border-2 border-black relative flex items-center justify-center flex-col w-full max-w-[1300px] h-[300px] m-12 overflow-y-auto gap-6">
          <Image
            src="/loading.png"
            alt="Loading details..."
            width={60}
            height={60}
            className="animate-spin mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-center">{randomQuote}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75"
        onClick={handleBackdropClick}
      >
        <div className="bg-white p-12 rounded-lg border-2 border-black relative grid grid-cols-1 sm:grid-cols-[1fr_2fr] w-full max-w-[1300px] max-h-[900px] m-12 overflow-y-auto gap-6">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✖
          </button>
          <p className="text-xl font-semibold text-red-600 text-center">
            Error
          </p>
          <p className="mt-2 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!pokemonData) {
    return (
      <div
        className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75"
        onClick={handleBackdropClick}
      >
        <div className="bg-white p-12 rounded-lg border-2 border-black relative grid grid-cols-1 sm:grid-cols-[1fr_2fr] w-full max-w-[1300px] max-h-[900px] m-12 overflow-y-auto gap-6">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✖
          </button>
          <p className="text-xl font-semibold text-center">
            No data available.
          </p>
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
  } = pokemonData;
  const formattedId = formatPokemonId(id);
  const formattedHeight = `${(height / 10).toFixed(1)} m`;
  const formattedWeight = `${(weight / 10).toFixed(1)} kg`;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white p-12 rounded-lg border-2 border-black relative grid grid-cols-1 sm:grid-cols-[1fr_2fr] w-full max-w-[1300px] max-h-[900px] m-12 overflow-y-auto gap-6"
        ref={modalContentRef}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold z-30"
        >
          ✖
        </button>

        {/* First Column: Picture, Basic Details, Base Stats */}
        <div className="w-full">
          {/* Picture */}
          <div className="relative w-full flex justify-center items-center ">
            {/* Background Rectangle */}
            <div
              className="absolute w-[250px] h-[250px] sm:w-[150px] sm:h-[150px] lg:w-[250px] lg:h-[250px] rounded-4xl"
              style={{ backgroundColor: getBGColorForType(types[0]) }}
            ></div>
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
                <span
                  key={type}
                  className={`font-semibold text-xs text-white px-2.5 py-0.5 rounded-full shadow capitalize border-1 border-black mb-2`}
                  style={{ backgroundColor: getBGColorForType(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
            <h1 className="text-5xl font-bold mt-1 capitalize">
              {name.split("-")[0]}
            </h1>
            {name.includes("-") && (
              <h2 className="text-2xl font-semibold text-gray-500 capitalize">
                {name.split("-")[1]}
              </h2>
            )}
          </div>

          {/* Description */}
          <p className="font-mono font-semibold text-gray-700 text-xl tracking-tight sm:pl-4 mt-2">
            {description}
          </p>

          {/* Base Stats */}
          <div className="flex flex-col gap-1 mt-4 sm:pl-4">
            <h3 className="text-xl lg:text-2xl font-bold mb-2 ">Base Stats</h3>
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="grid grid-cols-[max-content_1fr_max-content] gap-2 items-center text-sm lg:text-base"
              >
                <span className="font-semibold text-gray-600 text-right w-14">
                  {formatStatName(stat.name)}
                </span>
                {/* Progress Bar */}
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
                <span className="font-bold text-gray-600 text-right w-8">
                  {stat.value}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-[max-content_1fr_max-content] gap-2 items-center text-sm lg:text-base">
              <span className="font-bold text-gray-800 text-right w-14">
                TOTAL
              </span>
              <div className="w-full "></div>
              <span className="font-extrabold text-right w-8">
                {stats.reduce((total, stat) => total + stat.value, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Second Column: Pokedex Data, Training, Defenses, Evolution */}
        <div className="flex flex-col gap-4 sm:pl-12 flex-grow">
          <div className="flex flex-wrap gap-6">
            {/* Pokedex Data */}
            <div>
              <h3 className="text-xl lg:text-2xl font-bold mb-2">
                Pokédex Data
              </h3>
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
                <span className="font-semibold text-gray-600">Gender</span>
                <span>{formatGender(genderRate)}</span>
              </div>
            </div>

            {/* Characteristics */}
            <div className="z-10">
              <h3 className="text-xl lg:text-2xl font-bold mb-2">
                Characteristics
              </h3>
              <div className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5 text-sm lg:text-base">
                <span className="font-semibold text-gray-600">
                  Capture Rate
                </span>
                <span>{captureRate}</span>

                <span className="font-semibold text-gray-600">
                  Base Happiness
                </span>
                <span>{baseHappiness}</span>

                <span className="font-semibold text-gray-600">Growth Rate</span>
                <span className="capitalize">
                  {growthRate.replace("-", " ")}
                </span>

                <span className="font-semibold text-gray-600">Habitat</span>
                <span className="capitalize">{habitat ?? "Unknown"}</span>

                <span className="font-semibold text-gray-600">Generation</span>
                <span className="uppercase">
                  {generation.replace("-", " ")}
                </span>

                {/* Optional: Boolean Flags */}
                {(isBaby || isLegendary || isMythical) && (
                  <>
                    <span className="font-semibold text-gray-600 pt-2">
                      Flags
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2">
                      {isBaby && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Baby
                        </span>
                      )}
                      {isLegendary && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Legendary
                        </span>
                      )}
                      {isMythical && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Mythical
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Weaknesses  */}
          <div className="z-10">
            <h3 className="text-xl lg:text-2xl font-bold">Weaknesses</h3>
            <p className="mb-4 text-gray-800">
              These types will be effective against{" "}
              {name.split("-")[0].charAt(0).toUpperCase() +
                name.split("-")[0].slice(1)}
              .
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {weaknesses.map((weakness) => (
                <div
                  key={weakness.type}
                  className={`flex flex-col items-center justify-center p-2 border border-black rounded-lg shadow-sm text-center`}
                  style={{ backgroundColor: getBGColorForType(weakness.type) }}
                >
                  {/* Type Name */}
                  <span className="font-semibold text-black px-2.5 py-0.5 rounded-full capitalize mb-1 bg-white">
                    {weakness.type}
                  </span>
                  {/* Effectiveness */}
                  <span className="text-white font-bold text-md text-center ">
                    {weakness.effectiveness}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Chain */}
          <div className="min-h-0 flex flex-col ">
            <h3 className="text-xl lg:text-2xl font-bold mb-3">
              Evolution Chain
            </h3>

            {evolutionChain && evolutionChain.length > 1 ? (
              <div className="flex flex-col lg:flex-row items-center justify-around gap-2 flex-wrap lg:flex-nowrap bg-gray-100 rounded-2xl border border-black p-2 z-10">
                {evolutionChain.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex flex-col lg:flex-row items-center gap-2 md:gap-6 lg:gap-8 whitespace-nowrap px-auto"
                  >
                    {index > 0 && (
                      <ArrowRight className="transform rotate-90 lg:rotate-0 transition-transform duration-150" />
                    )}

                    {/* Evolution Stage Card */}
                    <div className="text-center">
                      <div
                        className={`rounded-full p-2 w-24 h-24 sm:w-28 sm:h-28 ${
                          name === stage.name
                            ? "lg:w-38 lg:h-38 "
                            : " lg:w-32 lg:h-32 bg-gray-200 "
                        } flex items-center justify-center mb-1 hover:bg-gray-200 transition-colors`}
                        style={{
                          backgroundColor:
                            name === stage.name
                              ? getBGColorForType(types[0])
                              : undefined,
                        }}
                      >
                        <Image
                          src={stage.imageUrl}
                          width={200}
                          height={200}
                          alt={stage.name}
                        />
                      </div>
                      <span className="font-semibold capitalize text-sm lg:text-base">
                        {stage.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {formatPokemonId(stage.id)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center justify-around gap-2 flex-wrap lg:flex-nowrap bg-gray-100 rounded-2xl p-2 py-6 z-10">
                <p className="text-center">
                  {name.split("-")[0].charAt(0).toUpperCase() +
                    name.split("-")[0].slice(1)}{" "}
                  does not evolve.
                </p>
              </div>
            )}
          </div>

          {/* Previous & Next Buttons */}

          <div className="flex w-full items-center gap-4 justify-center ">
            {" "}
            <button
              onClick={onPrevious}
              disabled={isFirst}
              aria-label="Previous Pokémon"
              className={` p-2 rounded-full bg-white border border-black ${
                isFirst
                  ? "opacity-50 cursor-not-allowed hover:bg-white/80"
                  : "cursor-pointer"
              }`}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={onNext}
              disabled={isLast}
              aria-label="Next Pokémon"
              className={`p-2 rounded-full bg-white border border-black ${
                isLast
                  ? "opacity-50 cursor-not-allowed hover:bg-white/80"
                  : "cursor-pointer"
              }`}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Background Element of ID */}
        <div className="hidden lg:block absolute top-4 right-6 md:text-7xl xl:text-8xl 2xl:text-9xl text-gray-300 font-sans pointer-events-none z-0">
          {formattedId}
        </div>

        {/* Background Picture */}
        <div className="hidden absolute sm:block bottom-0 right-0 z-0 pointer-events-none overflow-hidden rounded-br-lg">
          <Image
            src="/pokeball.svg"
            alt=""
            width={500}
            height={500}
            objectFit="cover"
            className="opacity-10 translate-x-1/4 translate-y-1/4 rotate-12"
          />
        </div>
      </div>
    </div>
  );
}
