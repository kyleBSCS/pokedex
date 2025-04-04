import Card from "@/components/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-mono">
      <div className="mx-auto mt-12 flex flex-col md:flex-row items-center justify-center">
        {/* Filter Box */}
        <div className="w-96"></div>

        {/* Main Card List */}
        <div className="flex flex-wrap">
          <Card />
        </div>
      </div>
    </div>
  );
}
