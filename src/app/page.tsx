import Card from "@/components/card";
import FilterBox from "@/components/filterbox";
import Image from "next/image";
import * as motion from "motion/react-client";

const cardItems = Array.from({ length: 20 }, (_, index) => index);

export default function Home() {
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
