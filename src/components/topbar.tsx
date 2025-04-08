"use client";

export default function TopBar() {
  // Define the polygon string directly for the clip-path style
  const clipPathStyle = `polygon(0% 0%, 100% 0%, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 0% 100%)`;

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-5/6 h-16 sticky top-0 z-10 relative p-[1.5px] ">
      <div
        className="absolute inset-0 bg-black z-0" // Use bg-black for border color
        style={{ clipPath: clipPathStyle }}
      />

      <div
        className="relative h-full bg-white z-10" // Use bg-white for content
        style={{ clipPath: clipPathStyle }}
      >
        <div className="flex items-center justify-between h-full pl-12">
          <button
            onClick={handleScrollToTop}
            className="text-3xl font-bold font-mono text-gray-800 focus:outline-none cursor-pointer"
          >
            Pokédex
          </button>
          <div className="flex gap-2 pr-10">
            <div className="rounded-full w-6 h-6 bg-red-500 border-2 border-black"></div>
            <div className="rounded-full w-6 h-6 bg-yellow-500 border-2 border-black"></div>
            <div className="rounded-full w-6 h-6 bg-green-500 border-2 border-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
