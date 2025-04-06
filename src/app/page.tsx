"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

import Card from "@/components/card";
import FilterBox from "@/components/filterbox";
import Image from "next/image";
import * as motion from "motion/react-client";
import Details from "@/components/details";
import { formatPokemonId } from "@/utils/helper";
import {
  PokemonDetail,
  PokemonListResponse,
  PokemonCardProps,
  SortByType,
} from "@/types/responses";

// Limits how many pokemon cards to fetch per batch
// I increased this from 10 to 30 due to animation bugs when the screen is large enough that it can view more than 10 cards at once
const POKE_LIMIT = 30;

export default function Home() {
  const [allFetchedPokemon, setAllFetchedPokemon] = useState<
    PokemonCardProps[]
  >([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>("id_asc");

  // For the trigger that loads more cards
  const observerRef = useRef<HTMLDivElement | null>(null);

  // =-=-=-=-=-= FETCHER =-=-=-=-=-=
  // Memoized callback function for fetching pokemon
  const fetchPokemon = useCallback(async () => {
    // Prevent fetching if already loading, no more data, or an error occured
    if (isLoading || !hasMore || error) return;

    setIsLoading(true);
    setError(null);
    console.log(`Fetching Pokemon: limit=${POKE_LIMIT}, offset=${offset}`);

    try {
      // STEP 1: Fetch list of Pokemon names and detail URLs
      const listResponse = await fetch(
        `/api/pokemon?limit=${POKE_LIMIT}&offset=${offset}`
      );
      if (!listResponse.ok) {
        throw new Error(`API List Error: ${listResponse.statusText}`);
      }
      const listData: PokemonListResponse = await listResponse.json();

      // STEP 3: Fetch details for each Pokemon in the list concurrently
      const detailPromises = listData.results.map(async (pokemon) => {
        try {
          // Use the direct PokeAPI URL for details
          const detailRes = await fetch(pokemon.url);
          if (!detailRes.ok) {
            console.warn(
              `Failed to fetch details for ${pokemon.name}: ${detailRes.statusText}`
            );
            return null; // Skip this Pokemon if details fail
          }
          return (await detailRes.json()) as PokemonDetail;
        } catch (detailError) {
          console.error(
            `Error fetching details for ${pokemon.name}:`,
            detailError
          );
          return null; // Skip on error
        }
      });

      const detailedResults = await Promise.all(detailPromises);

      // STEP 3: Filter out null results and format data for the cards
      const newPokemon = detailedResults
        .filter((detail): detail is PokemonDetail => detail !== null)
        .map((detail) => ({
          id: detail.id,
          name: detail.name,
          // TODO: Add fallback image
          imageUrl:
            detail.sprites.other?.["official-artwork"]?.front_default ??
            "/fallback.webp",
          types: detail.types.map((typeInfo) => typeInfo.type.name),
        }));

      // STEP 4: Update states
      setAllFetchedPokemon((prevList) => {
        // Avoid duplicates
        const existingIds = new Set(prevList.map((p) => p.id));
        const uniqueNewPokemon = newPokemon.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prevList, ...uniqueNewPokemon];
      });
      setOffset((prevOffset) => prevOffset + POKE_LIMIT);
      setHasMore(listData.next !== null); // Check if there's a next page URL
    } catch (fetchError: any) {
      console.error("Failed to fetch Pokemon:", fetchError);
      setError(
        `Failed to load Pokemon: ${fetchError.message}. Please try refreshing.`
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset, error, allFetchedPokemon.length]);

  // =-=-=-=-=-= HANDLERS =-=-=-=-=-=
  // Filters and Sort to be passed to FilterBox
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  }, []);

  const handleSortChange = useCallback((sortKey: SortByType) => {
    setSortBy(sortKey);
  }, []);

  // =-=-=-=-=-= COMPUTED VALUES =-=-=-=-=-=
  const displayedCards = useMemo(() => {
    console.log(
      `Filtering/Sorting: Term='${searchTerm}', Types=[${selectedTypes.join(
        ", "
      )}], Sort='${sortBy}'`
    );
    let filtered = [...allFetchedPokemon];

    // STEP 1: Filter by Search Term (Name or ID)
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(lowerSearchTerm) ||
          pokemon.id.toString() === lowerSearchTerm ||
          formatPokemonId(pokemon.id).includes(lowerSearchTerm)
      );
    }

    // STEP 2: Filter by Selected Types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) =>
        selectedTypes.some((selectedType) =>
          pokemon.types.includes(selectedType)
        )
      );
    }

    // STEP 3: Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "id_desc":
          return b.id - a.id;
        case "id_asc":
          return a.id - b.id;
      }
    });

    console.log("Displayed cards after filtering/sorting: ", filtered.length);
    return filtered;
  }, [allFetchedPokemon, searchTerm, selectedTypes, sortBy]);

  // =-=-=-=-=-= EFFECTS =-=-=-=-=-=
  // Effect for initial load
  useEffect(() => {
    if (allFetchedPokemon.length === 0 && !error && !isLoading) {
      console.log("Initial load: Fetching first batch...");
      fetchPokemon();
    }
  }, [allFetchedPokemon.length, error, isLoading, fetchPokemon]);

  // Effect for setting up infinite load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log("Observer triggered, fetching more...");
          fetchPokemon();
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% visible
      }
    );

    const currentObserverRef = observerRef.current; // Capture ref value

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    // Cleanup
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [fetchPokemon, hasMore, isLoading]);

  return (
    <div className="font-mono relative">
      <div className=" mx-auto mt-12 flex flex-col md:flex-row justify-center">
        {/* Filter Box */}
        <FilterBox
          searchTerm={searchTerm}
          selectedTypes={selectedTypes}
          sortBy={sortBy}
          onSearchChange={handleSearchChange}
          onTypeToggle={handleTypeToggle}
          onSortChange={handleSortChange}
        />

        {/* Main Card List */}
        <div className="w-full md:w-auto flex flex-row flex-wrap gap-2 p-4 md:flex-1 justify-center md:justify-start">
          {displayedCards.map((pokemon, index) => (
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
                delay: (index % POKE_LIMIT) * 0.05, // Staggered delay for each card
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
        className="h-20 flex justify-center items-center w-full text-center"
      >
        {isLoading && (
          <p className="animate-pulse text-white font-bold text-2xl">
            Loading more Pokemon...
          </p>
        )}
        {!isLoading && !hasMore && displayedCards.length > 0 && (
          <p className="text-gray-500">-- End of List --</p>
        )}
        {error && <p className="text-gray-600 font-semibold p-4">{error}</p>}
        {!isLoading && hasMore && displayedCards.length === 0 && !error && (
          <p className="texxt-gray-400">Scroll down to load more Pokemon!</p>
        )}
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
