"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { PokemonCardProps } from "@/types/responses";

export default function Card() {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

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

  const handleCardClick = (event) => {
    event.stopPropagation();
    setIsSelected(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="bg-white w-[250px] h-[400px] rounded-xl flex-col border-black border-2 items-center justify-center cursor-pointer overflow-hidden"
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
        #010
      </h1>

      {/* Picture */}
      <div className="relative w-full flex justify-center items-center ">
        {/* Background Rectangle */}
        <div className="absolute w-[205px] h-[205px] bg-lime-300 rounded-4xl"></div>

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
      <div className="font-mono pl-4 mt-1">
        <div className="flex gap-1">
          <h1 className="font-semibold text-md text-white bg-red-500 px-2 rounded-xl">
            Fire
          </h1>
          <h1 className="font-semibold text-md text-white bg-green-700 px-2 rounded-xl">
            Bug
          </h1>
        </div>
        <h1 className="text-3xl font-bold mt-1">Caterpie</h1>
      </div>
    </motion.div>
  );
}
