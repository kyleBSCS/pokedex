import Image from "next/image";

export default function Card() {
  return (
    <div className="bg-white w-[250px] h-[400px] rounded-xl flex-col border-black border-2 shadow-lg items-center justify-center">
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
          src="/010.png" // Change this to your actual image path
          width={300}
          height={300}
          alt="Caterpie"
          className="relative"
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
    </div>
  );
}
