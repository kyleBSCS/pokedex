"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import Card from "@/components/card";
import FilterBox from "@/components/filterbox";
import Image from "next/image";
import * as motion from "motion/react-client";
import {
  ApiPokemonResponse,
  PokemonCardProps,
  SortByType,
  AppliedFilters,
} from "@/types/types";

const loadingQuotes = [
  "Fetching data... it's super effective!",
  "Your content is evolving!",
  "This might take a Potion or two...",
  "Snorlax is in the way...",
  "Passing by tall grass...",
  "Trying to avoid wild encounters...",
];

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonCardProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>("id_asc");
  const [randomIndex, setRandomIndex] = useState(0);

  // Limits how many pokemon cards to fetch per batch
  // I increased this from 10 to 30 due to animation bugs when the screen is large enough that it can view more than 10 cards at once
  const [cardAmtPerBatch, setCardAmtPerBatch] = useState(30);

  // For the trigger that loads more cards
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // =-=-=-=-=-= FETCHER =-=-=-=-=-=
  // Memoized callback function for fetching pokemon
  const fetchPokemon = useCallback(
    async (applyNewFilters = false, filtersToApply?: any) => {
      // Prevent fetching if already loading OR if it's a scroll-fetch during a filter-change fetch
      if (isFetchingRef.current) {
        console.log("FETCH BLOCKED: Already fetching.");
        return;
      }

      // Determine which filters to use for fetch
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

      setRandomIndex(Math.floor(Math.random() * loadingQuotes.length));

      if (applyNewFilters) {
        console.log("FETCH (Apply New Filters): Resetting list.");
        setPokemonList([]);
        setOffset(0);
        currentOffset = 0;
        setHasMore(true);
        setError(null);
      }

      console.log(
        `FETCH: Offset=${currentOffset}, Limit=${cardAmtPerBatch}, Search='${currentSearchTerm}', Types='${currentSelectedTypes.join(
          ","
        )}', Sort='${currentSortBy}'`
      );

      try {
        const params = new URLSearchParams({
          limit: String(cardAmtPerBatch),
          offset: String(currentOffset),
          sort: currentSortBy,
        });

        if (currentSearchTerm) params.set("search", currentSearchTerm);
        if (currentSelectedTypes.length > 0)
          params.set("types", currentSelectedTypes.join(","));

        const apiUrl = `/api/pokemon?${params.toString()}`;
        console.log("API URL:", apiUrl);

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
        if (applyNewFilters || totalCount === 0) {
          setTotalCount(data.count);
        }
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch Pokemon: ", e);
        setError(
          `Failed to load Pokemon: ${e.message}. Please try refreshing or adjusting filters`
        );
        setHasMore(false);
        if (applyNewFilters) setPokemonList([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
        console.log("Fetch cycle complete.");
      }
    },
    [cardAmtPerBatch, offset, searchTerm, selectedTypes, sortBy, totalCount]
  );

  // =-=-=-=-=-= HANDLERS =-=-=-=-=-=
  const handleApplyFilters = useCallback(
    (appliedFilters: AppliedFilters) => {
      console.log("Applying filters received from FilterBox:", appliedFilters);

      setSearchTerm(appliedFilters.searchTerm);
      setSelectedTypes(appliedFilters.selectedTypes);
      setSortBy(appliedFilters.sortBy);

      fetchPokemon(true, appliedFilters);
    },
    [fetchPokemon]
  );

  // =-=-=-=-=-= EFFECTS =-=-=-=-=-=
  useEffect(() => {
    // Only fetch on initial mount
    if (isInitialLoadRef.current) {
      console.log("Initial load fetch triggered.");
      fetchPokemon(true); // Fetch with initial state filters (empty/defaults)
      isInitialLoadRef.current = false; // Mark initial load as done
    }
  }, [fetchPokemon]);

  // Effect for infinite load (Scroll)
  useEffect(() => {
    // Don't observe if loading, no more data, or if a filter change fetch is in progress
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

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

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
                delay: (index % cardAmtPerBatch) * 0.05, // Staggered delay for each card
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
        className="h-20 flex justify-center sm:justify-start sm:pl-4 sm:pb-4 items-center w-full text-center"
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
