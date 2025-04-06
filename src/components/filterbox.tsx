"use client";

import { useState, useEffect } from "react";
import Button from "./button";
import { POKEMON_TYPES } from "@/types/types";
import { FilterBoxProps } from "@/types/types";

export default function FilterBox({
  searchTerm,
  selectedTypes,
  sortBy,
  onSearchChange,
  onTypeToggle,
  onSortChange,
}: FilterBoxProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Update local state as user types
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  // Trigger the actual search (call parent function)
  const handleSearchTrigger = () => {
    // Pass the current value from the local state to the parent
    onSearchChange(localSearchTerm);
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchTrigger();
    }
  };

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
                value={localSearchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search Pokémon (Name or ID)"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <button
                className="bg-blue-600 font-bold text-white rounded-full p-2 ml-2"
                onClick={handleSearchTrigger}
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">Filter by</h1>
              <div className="grid grid-cols-3 gap-1">
                {POKEMON_TYPES.map((type) => (
                  <Button
                    key={type}
                    name={type}
                    isActive={selectedTypes.includes(type)}
                    onClick={onTypeToggle}
                    colorType="type"
                  />
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Sort by</h1>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  name="id_asc"
                  label="ID Ascending"
                  isActive={sortBy === "id_asc"}
                  onClick={() => onSortChange("id_asc")}
                  colorType="sort"
                />
                <Button
                  name="id_desc"
                  label="ID Descending"
                  isActive={sortBy === "id_desc"}
                  onClick={() => onSortChange("id_desc")}
                  colorType="sort"
                />
                <Button
                  name="name_asc"
                  label="Name A-Z"
                  isActive={sortBy === "name_asc"}
                  onClick={() => onSortChange("name_asc")}
                  colorType="sort"
                />
                <Button
                  name="name_desc"
                  label="Name Z-A"
                  isActive={sortBy === "name_desc"}
                  onClick={() => onSortChange("name_desc")}
                  colorType="sort"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
