"use client"

import { useEffect, useState } from "react"

interface FiltersProps {
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void
  selectedLocation: string
  onLocationChange: (zip: string) => void
}

export default function Filters({ 
  selectedBreed, 
  onBreedChange, 
  sortOrder, 
  onSortChange,
  selectedLocation,
  onLocationChange
}: FiltersProps) {
  const [breeds, setBreeds] = useState<string[]>([])
  const [zipError, setZipError] = useState(false)

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch breeds");
        const data = await res.json()
        setBreeds(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBreeds()
  }, [])

  // check if zip code is incomplete
  useEffect(() => {
    if (selectedLocation.length > 0 && selectedLocation.length !== 5) setZipError(true)
    else setZipError(false)
  }, [selectedLocation])

  return (
    <div className="flex gap-4 items-start">
      {/* Breed dropdown */}
      <select 
        value={selectedBreed} 
        onChange={(e) => onBreedChange(e.target.value)} 
        className="border p-3 rounded w-1/3 text-lg"
      >
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>{breed}</option>
        ))}
      </select>

      {/* Zip Code Input*/}
      <div className="relative w-1/4 flex flex-col">
        <input
          type="text"
          placeholder="Enter Zip Code"
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className={`border p-2 rounded w-full text-lg ${zipError ? "border-red-500" : ""}`}
        />
        <div className="h-[24px] mt-1 flex items-center">
          {zipError && (
            <div className="bg-red-500 text-white text-xs px-3 py-1 rounded flex items-center gap-1 w-fit">
              🚨 Please enter a full 5-digit zip code!
            </div>
          )}
        </div>
      </div>

      {/* Sort Button */}
      <button 
        className="bg-blue-500 text-white px-6 py-3 rounded text-lg"
        onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sort: {sortOrder === "asc" ? "A → Z" : "Z → A"}
      </button>
    </div>
  )
}
