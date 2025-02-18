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
    if (selectedLocation.length > 0 && selectedLocation.length < 5) setZipError(true)
    else setZipError(false)
  }, [selectedLocation])

  return (
    <div className="mb-4 flex gap-4">
      {/* Breed Filter */}
      <select 
        value={selectedBreed} 
        onChange={(e) => onBreedChange(e.target.value)} 
        className="border p-2 rounded"
      >
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
          <option key={breed} value={breed}>{breed}</option>
        ))}
      </select>

      {/* Location Filter */}
      <div className="relative">
          <input
            type="text"
            placeholder="Enter Zip Code"
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className={`border p-2 rounded ${zipError ? "border-red-500" : ""}`}
          />
          {zipError && (
            <p className="text-red-500 text-sm mt-1 absolute -bottom-5">
              Please enter a full 5-digit zip code.
            </p>
          )}
        </div>

      {/* Sort */}
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sort: {sortOrder === "asc" ? "A → Z" : "Z → A"}
      </button>
    </div>
  )
}
