"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import * as motion from "motion/react-client";
import Image from "next/image";

import {
  ApiPokemonResponse,
  PokemonCardProps,
  SortByType,
  AppliedFilters,
  PokemonDetailedViewData,
  ApiPokemonDetailResponse,
} from "@/types/types";
import Card from "@/components/card";
import FilterBox from "@/components/filterbox";
import Details from "@/components/details";

const loadingQuotes = [
  "Fetching data... it's super effective!",
  "Your content is evolving!",
  "This might take a Potion or two...",
  "Snorlax is in the way...",
  "Passing by tall grass...",
  "Trying to avoid wild encounters...",
];

// Limits how many pokemon cards to fetch per batch
/* 
    I increased this from 10 to 30 due to animation bugs when
    the screen is large enough that it can view more than 10 cards at once 
*/
const MAX_CARD_PER_BATCH = 30;

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonCardProps[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>("id_asc");
  const [error, setError] = useState<string | null>(null);
  const [randomIndex, setRandomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // States for the Detailed View
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );
  const [detailedPokemonData, setDetailedPokemonData] =
    useState<PokemonDetailedViewData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // For the trigger that loads more cards
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // =-=-=-=-=-= FETCHER =-=-=-=-=-=
  // Memoized callback function for fetching pokemon
  const fetchPokemon = useCallback(
    async (applyNewFilters = false, filtersToApply?: any) => {
      // Prevent repetitive fetching
      if (isFetchingRef.current) {
        console.log("FETCH BLOCKED: Already fetching.");
        return;
      }

      // Determine which filters to use for fetch
      // Necessary due to race conditions
      const currentSearchTerm = filtersToApply
        ? filtersToApply.searchTerm
        : searchTerm;
      const currentSelectedTypes = filtersToApply
        ? filtersToApply.selectedTypes
        : selectedTypes;
      const currentSortBy = filtersToApply ? filtersToApply.sortBy : sortBy;

      let currentOffset = offset;
      isFetchingRef.current = true;
      setIsLoading(true);

      // For random loading quotes
      setRandomIndex(Math.floor(Math.random() * loadingQuotes.length));

      if (applyNewFilters) {
        console.log("FETCH (Apply New Filters): Resetting list.");

        setPokemonList([]);
        currentOffset = 0;
        setOffset(0);
        setHasMore(true); // Assume true
        setError(null);
      }

      try {
        // Set up the API url
        const params = new URLSearchParams({
          limit: String(MAX_CARD_PER_BATCH),
          offset: String(currentOffset),
          sort: currentSortBy,
        });
        if (currentSearchTerm) params.set("search", currentSearchTerm);
        if (currentSelectedTypes.length > 0)
          params.set("types", currentSelectedTypes.join(","));

        // Construct the URL based on params
        const apiUrl = `/api/pokemon?${params.toString()}`;
        console.log("API URL:", apiUrl);

        // Fetch from own API
        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `API Error: ${res.statusText}`);
        }

        const data: ApiPokemonResponse = await res.json();
        console.log("API Response Data: ", data);

        const newPokemon = data.results;

        setPokemonList((prevList) =>
          applyNewFilters ? newPokemon : [...prevList, ...newPokemon]
        );
        const nextOffset = currentOffset + newPokemon.length;
        setOffset(nextOffset);
        setHasMore(data.next !== null && newPokemon.length > 0);
        setError(null);
      } catch (e: any) {
        // Catch any errors during fetch
        console.error("Failed to fetch Pokemon: ", e);
        setError(
          `Failed to load Pokemon: ${e.message}. Please try refreshing or adjusting filters`
        );
        setHasMore(false);
        if (applyNewFilters) setPokemonList([]);
      } finally {
        // Set flags to false
        setIsLoading(false);
        isFetchingRef.current = false;
        console.log("Fetch cycle complete.");
      }
    },
    [offset, searchTerm, selectedTypes, sortBy]
  );

  const fetchPokemonDetails = useCallback(
    async (id: number) => {
      if (isDetailLoading) return;

      console.log(`Fetching details for Pokemon id ${id}`);
      setIsDetailLoading(true);
      setDetailedPokemonData(null);
      setDetailError(null);

      try {
        const res = await fetch(`/api/pokemon/${id}`);

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `API Error: ${res.statusText}`);
        }

        const data: ApiPokemonDetailResponse = await res.json();
        setDetailedPokemonData(data);
      } catch (e: any) {
        console.error(`Failed to fetch details for Pokemon ${id}`);
        setDetailError(
          `Failed to load details ${e.message}. Please try again!`
        );
      } finally {
        setIsDetailLoading(false);
        console.log(`Detail fetch for id ${id} has been completed`);
      }
    },
    [isDetailLoading]
  );

  // =-=-=-=-=-= HANDLER =-=-=-=-=-=
  const handleApplyFilters = useCallback(
    (appliedFilters: AppliedFilters) => {
      setSearchTerm(appliedFilters.searchTerm);
      setSelectedTypes(appliedFilters.selectedTypes);
      setSortBy(appliedFilters.sortBy);
      fetchPokemon(true, appliedFilters);
    },
    [fetchPokemon]
  );

  // =-=-=-=-=-= EFFECTS =-=-=-=-=-=
  // Initial load
  useEffect(() => {
    fetchPokemon(true);
  }, []);

  // Effect for infinite load (Scroll)
  useEffect(() => {
    // Don't observe if loading, no more data, or if list is 0
    if (isLoading || !hasMore || pokemonList.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Check intersection and ensure it's not during a filter change
        if (entries[0].isIntersecting && !isLoading && !isFetchingRef.current) {
          console.log("Observer triggered fetch (scroll)");
          fetchPokemon(false); // 'false' indicates a scroll fetch, not new filters
        }
      },
      { threshold: 0.1 } // Trigger when 10% is visible
    );

    // Mount
    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    // Unmount
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [fetchPokemon, hasMore, isLoading, pokemonList]);

  return (
    <div className="font-mono relative">
      <div className=" mx-auto mt-12 flex flex-col md:flex-row justify-center">
        {/* Filter Box */}
        <FilterBox
          initialSearchTerm={searchTerm}
          initialSelectedTypes={selectedTypes}
          initialSortBy={sortBy}
          onApply={handleApplyFilters}
        />

        {/* Main Card List */}
        <div className="w-full md:w-auto flex flex-row flex-wrap gap-2 p-4 md:flex-1 justify-center md:justify-start">
          {pokemonList.map((pokemon, index) => (
            <motion.div
              key={pokemon.id}
              initial={{
                opacity: 0,
                x: 600, // Start far right (relative to final position)
                y: 400, // Start far down (relative to final position)
                scale: 3, // Start large
              }}
              animate={{
                opacity: [0, 1, 1], // Fade in during the first part
                // Keyframes for position: [start, curve_peak, end]
                x: [600, 100, 0],
                y: [400, -150, 0],
                // Keyframes for scale: [start, mid_size, end_size]
                scale: [3, 1.25, 1], // Start large, shrink mid-animation, settle to 1
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: (index % MAX_CARD_PER_BATCH) * 0.05, // Staggered delay for each card
              }}
            >
              <Card
                id={pokemon.id}
                name={pokemon.name}
                imageUrl={pokemon.imageUrl}
                types={pokemon.types}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      <div
        ref={observerRef}
        className="h-20 flex justify-center sm:justify-start sm:pl-12 sm:pb-6 items-center w-full text-center"
      >
        {isLoading && (
          <div className="flex gap-2 items-center justify-center">
            <Image
              src="/loading.png"
              alt="Loading icon"
              width={40}
              height={40}
              className="animate-spin"
            />
            <p className="animate-pulse text-white font-bold text-2xl">
              {loadingQuotes[randomIndex]}
            </p>
          </div>
        )}
        {!isLoading && !hasMore && pokemonList.length > 0 && (
          <p className="text-white font-bold text-2xl">-- End of List --</p>
        )}
        {error && <p className="text-white font-semibold p-4">{error}</p>}
      </div>

      {/* <Details /> */}

      {/* Background Image */}
      <div className="fixed bottom-0 right-0 w-full h-full -z-10">
        <Image
          src="/pokeball.svg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>
    </div>
  );
}
