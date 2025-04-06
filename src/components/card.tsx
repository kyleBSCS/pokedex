"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { PokemonCardProps } from "@/types/responses";
import { formatPokemonId } from "@/utils/helper";
import { getBGColorForType } from "@/utils/typeColors";

export default function Card({ id, name, imageUrl, types }: PokemonCardProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animations variants for different states of the card
  const cardVariants = {
    // Initial state of the card when not hovered or selected
    initial: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 35 },
    },

    // State of the card when hovered
    hover: {
      y: -8,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.15, ease: "easeOut" },
    },

    // State of the card when selected
    selected: {
      y: [-5, -10, -50],
      opacity: [1, 1, 0],
      scale: [1.0, 1.1, 1.1],
      transition: { duration: 0.4, ease: "easeInOut", times: [0, 0.5, 1] },
    },
  };

  // Target animation based on state
  const getTargetAnimation = () => {
    if (isSelected) {
      return "selected";
    }
    if (isHovered) {
      return "hover";
    }
    return "initial";
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log(`Selected Pokemon: ${name} (ID: ${id})`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const primaryType = types[0] || "normal";
  const cardBgColor = getBGColorForType(primaryType);

  return (
    <motion.div
      ref={cardRef}
      className="bg-white w-[240px] h-[400px] rounded-xl flex-col border-black border-2 items-center justify-center cursor-pointer overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate={getTargetAnimation()}
      onHoverStart={() => {
        if (!isSelected) {
          setIsHovered(true);
        }
      }}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* ID */}
      <h1 className="font-sans text-5xl text-right text-gray-900 tracking-wide pt-4 pr-4">
        {formatPokemonId(id)}
      </h1>

      {/* Picture */}
      <div className="relative w-full flex justify-center items-center ">
        {/* Background Rectangle */}
        <div
          className="absolute w-[205px] h-[205px] rounded-full"
          style={{ backgroundColor: cardBgColor }}
        ></div>

        {/* Pokémon Image */}
        <Image
          draggable="false"
          src={imageError ? "/fallback.webp" : imageUrl}
          width={240}
          height={240}
          alt={name}
          onError={() => setImageError(true)}
          priority={id <= 20}
          className="relative select-none"
        />
      </div>

      {/* Types and Name */}
      <div className={`font-mono pl-4 ${name.split("-")[1] ? "mt-1" : "mt-5"}`}>
        <div className="flex gap-1">
          {/* Types */}
          {types.map((type) => (
            <span
              key={type}
              className={`font-semibold text-xs text-white px-2.5 py-0.5 rounded-full shadow capitalize border-1 border-black`}
              style={{ backgroundColor: getBGColorForType(type) }}
            >
              {type}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold mt-1">
          {name.split("-")[0].charAt(0).toUpperCase() +
            name.split("-")[0].slice(1).toLowerCase()}
        </h1>

        {name.split("-")[1] && (
          <h2 className="-mt-1">
            {name.split("-")[1].charAt(0).toUpperCase() +
              name.split("-")[1].slice(1).toLowerCase()}
          </h2>
        )}
      </div>
    </motion.div>
  );
}
