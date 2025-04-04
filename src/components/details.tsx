import Image from "next/image";

export default function Details() {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center w-full h-full backdrop-brightness-75">
      <div className="bg-white p-6 rounded-lg border-2 border-black w-96 relative">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-black">
          ✖
        </button>

        {/* First Column: Picture, Basic Details, Base Stats */}
        <div>
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
            <h2 className="text-xl font-semibold">#010</h2>
          </div>

          {/* Description */}
          <p className="font-mono font-bold text-gray-700 text-xl tracking-tight pl-4 mt-2">
            Often hides in water to stalk unwary prey. For swimming fast, it
            moves its ears to maintain balance.
          </p>

          {/* Base Stats */}
        </div>

        {/* Second Column: Pokedex Data, Training, Defenses, Evolution */}

        {/* Background Element of ID */}
      </div>
    </div>
  );
}
