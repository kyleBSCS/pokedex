import Card from "@/components/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-mono">
      <div className="mx-auto mt-12 flex flex-col md:flex-row items-center justify-center">
        {/* Filter Box */}
        <div className="w-[1500px]"></div>

        {/* Main Card List */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
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
    </div>
  );
}
