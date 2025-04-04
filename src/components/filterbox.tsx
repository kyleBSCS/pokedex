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
        sm:m-12                  
        relative bg-black shadow-lg
        w-full md:w-[500px]  
        h-[500px]             
        p-[2px]               
        md:flex-shrink-0      
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
          <h1 className="text-xl font-bold mb-4">Filter by</h1>
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
      </div>
    </div>
  );
}
