import React from "react";
import Button from "./button";

export default function FilterBox() {
  // Define the polygon string directly for the clip-path style
  const clipPathStyle = `polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))`;

  return (
    // Outer container
    <div className="p-4">
      <div
        className={`
        sm:mx-12            
        relative bg-black shadow-lg
        w-full sm:w-[500px]  
        h-[700px]             
        p-[2px]               
        md:flex-shrink-0      
        md:sticky
        md:top-32
      `}
        style={{
          clipPath: clipPathStyle,
        }}
      >
        {/* Inner container: Fills the outer container, handles content & scrolling */}
        <div
          className={`
          h-full             
          w-full                
          bg-white p-6         
          overflow-y-auto        
        `}
          style={{
            clipPath: clipPathStyle,
          }}
        >
          {/* Content */}
          <div className="flex flex-col gap-2">
            {/* Header */}
            <h1 className="text-6xl font-bold mb-4 mt-3">POKÉDEX</h1>

            {/* Search Bar */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search Pokémon (Name, ID, Ability)"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <button className="bg-blue-600 font-bold text-white rounded-full p-2 ml-2">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">Filter by</h1>
              <div className="grid grid-cols-3 gap-1">
                <Button name="Grass" />
                <Button name="Fire" />
                <Button name="Water" />
                <Button name="Electric" />
                <Button name="Psychic" />
                <Button name="Dark" />
                <Button name="Fairy" />
                <Button name="Steel" />
                <Button name="Dragon" />
                <Button name="Ghost" />
                <Button name="Bug" />
                <Button name="Rock" />
                <Button name="Ground" />
                <Button name="Poison" />
                <Button name="Flying" />
              </div>
            </div>

            {/* Filters */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Sort by</h1>
              <div className="grid grid-cols-3 gap-1">
                <Button name="Grass" />
                <Button name="Fire" />
                <Button name="Water" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
