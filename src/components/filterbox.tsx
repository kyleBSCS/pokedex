"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "./button";
import {
  POKEMON_TYPES,
  FilterBoxProps,
  SortByType,
  AppliedFilters,
} from "@/types/types";

export default function FilterBox({
  initialSearchTerm,
  initialSelectedTypes,
  initialSortBy,
  onApply,
}: FilterBoxProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);
  const [localSelectedTypes, setLocalSelectedTypes] = useState(
    new Set(initialSelectedTypes)
  );
  const [localSortBy, setLocalSortBy] = useState<SortByType>(initialSortBy);

  // Effect to sync local state if initial props change
  useEffect(() => {
    setLocalSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    setLocalSelectedTypes(new Set(initialSelectedTypes));
  }, [initialSelectedTypes]);

  useEffect(() => {
    setLocalSortBy(initialSortBy);
  }, [initialSortBy]);

  // Update local state as user types
  const handleLocalSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleLocalTypeToggle = useCallback((type: string) => {
    setLocalSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleLocalSortChange = useCallback((sortKey: SortByType) => {
    setLocalSortBy(sortKey);
  }, []);

  const handleApplyClick = () => {
    const appliedFilters: AppliedFilters = {
      searchTerm: localSearchTerm,
      selectedTypes: Array.from(localSelectedTypes), // Convert Set back to Array
      sortBy: localSortBy,
    };
    console.log("Applying filters:", appliedFilters);
    onApply(appliedFilters);
  };

  // Handle Enter key press in the input field
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleApplyClick();
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
                onChange={handleLocalSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search Pokémon (Name or ID)"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Filters */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">Filter by</h1>
              <div className="grid grid-cols-3 gap-1">
                {POKEMON_TYPES.map((type) => (
                  <Button
                    key={type}
                    name={type}
                    isActive={localSelectedTypes.has(type)}
                    onClick={handleLocalTypeToggle}
                    colorType="type"
                  />
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="flex w-full gap-4">
              <div className="w-2/3">
                <h1 className="text-2xl font-bold mb-4">Sort by</h1>
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    name="id_asc"
                    label="ID Ascending"
                    isActive={localSortBy === "id_asc"}
                    onClick={() => handleLocalSortChange("id_asc")}
                    colorType="sort"
                  />
                  <Button
                    name="name_asc"
                    label="Name A-Z"
                    isActive={localSortBy === "name_asc"}
                    onClick={() => handleLocalSortChange("name_asc")}
                    colorType="sort"
                  />
                  <Button
                    name="id_desc"
                    label="ID Descending"
                    isActive={localSortBy === "id_desc"}
                    onClick={() => handleLocalSortChange("id_desc")}
                    colorType="sort"
                  />

                  <Button
                    name="name_desc"
                    label="Name Z-A"
                    isActive={localSortBy === "name_desc"}
                    onClick={() => handleLocalSortChange("name_desc")}
                    colorType="sort"
                  />
                </div>
              </div>

              <div className="place-self-end">
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-7 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg justify-self"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
