"use client";

export default function TopBar() {
  // Define the polygon string directly for the clip-path style
  const clipPathStyle = `polygon(0% 0%, 100% 0%, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 0% 100%)`;

  return (
    <div
      className="w-5/6 h-16 bg-white sticky top-0 border-b-2 border-r-2 border-black z-10 "
      style={{ clipPath: clipPathStyle }}
    >
      <div className="flex items-center justify-between h-full pl-12">
        <h1 className="text-3xl font-bold font-mono text-gray-800">Pokédex</h1>
        <div className="flex gap-2 pr-10">
          <div className="rounded-full w-6 h-6 bg-red-500 border-2"></div>
          <div className="rounded-full w-6 h-6 bg-yellow-500 border-2"></div>
          <div className="rounded-full w-6 h-6 bg-green-500 border-2"></div>
        </div>
      </div>
    </div>
  );
}
