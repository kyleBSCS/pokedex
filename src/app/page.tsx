import Card from "@/components/card";
import FilterBox from "@/components/filterbox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-mono relative">
      <div className=" mx-auto mt-12 flex flex-col md:flex-row justify-center">
        {/* Filter Box */}
        <FilterBox />

        {/* Main Card List */}
        <div className="w-full md:w-auto flex flex-row flex-wrap gap-2 p-4 md:flex-1 justify-center md:justify-start">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
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
