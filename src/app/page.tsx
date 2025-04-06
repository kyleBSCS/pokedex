"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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
} from "@/types/responses";

// const cardItems = Array.from({ length: 20 }, (_, index) => index);

// Limits how many pokemon cards to fetch per batch
const POKE_LIMIT = 20;

export default function Home() {
  const [cards, setCards] = useState<PokemonCardProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For the trigger that loads more cards
  const observerRef = useRef<HTMLDivElement | null>(null);

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
        `api/pokemon?limit=${POKE_LIMIT}&offset=${offset}`
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
            detail.sprites.other?.["official-artwork"]?.front_default ?? "",
          types: detail.types.map((typeInfo) => typeInfo.type.name),
        }));

      // STEP 4: Update states
      setCards((prevList) => [...prevList, ...newPokemon]);
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
  }, [isLoading, hasMore, offset, error]);

  // Effect for initial load
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
        threshold: 1.0, // Trigger only when the element is fully visible
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
        <FilterBox />

        {/* Main Card List */}
        <div className="w-full md:w-auto flex flex-row flex-wrap gap-2 p-4 md:flex-1 justify-center md:justify-start">
          {cardItems.map((item, index) => (
            <motion.div
              key={index}
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
                delay: index * 0.05, // Staggered delay for each card
              }}
            >
              <Card />
            </motion.div>
          ))}
        </div>
      </div>
      {/* <Details /> */}

      {/* Background Image */}
      <div className="fixed bottom-0 right-0 w-full h-full -z-10">
        <Image
          src="/pokeball.svg" // Change this to your actual image path
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>
    </div>
  );
}
