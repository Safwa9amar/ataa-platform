"use client";
import { IconButton, Spinner } from "@material-tailwind/react";
import React, { useState } from "react";
import { IoReload } from "react-icons/io5";

export default function ProgramSelector({ programs, loading, selectedProgram, setSelectedProgram, getAllPrograms ,setSelectedProgramTitle}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter programs based on search query
  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-3 min-w-[300px] relative">
      {/* Search Input and Dropdown */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="ابحث عن برنامج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click on options
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || programs.length === 0}
        />
        {/* Dropdown List */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedProgram(program.id);
                    setIsDropdownOpen(false);
                    setSelectedProgramTitle(program.title)
                  }}
                >
                  {program.title}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">لا توجد نتائج</div>
            )}
          </div>
        )}
      </div>

      {/* Reload Button */}
      <IconButton
        variant="outlined"
        color="teal"
        onClick={getAllPrograms}
        disabled={loading}
      >
        {loading ? <Spinner className="h-5 w-5" /> : <IoReload />}
      </IconButton>
    </div>
  );
}