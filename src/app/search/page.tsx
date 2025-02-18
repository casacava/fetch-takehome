"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Filters from "./Filters"
import DogsList from "./DogsList"

export default function SearchPage() {
  const [selectedBreed, setSelectedBreed] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<string[]>([])
  const [match, setMatch] = useState<{ name: string; breed: string }| null>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        credentials: "include"
      })

      router.push('/login')
    } catch (error) {
      console.error("logout failed:", error)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    )
  }

  const handleFindMatch = async () => {
    if (favorites.length === 0) {
      alert("select some dogs before finding a match!")
      return
    }

    try {
      // Get Matched Dog ID
      const matchRes = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
      })
  
      if (!matchRes.ok) throw new Error("Failed to fetch match")
      const matchData = await matchRes.json()
      const matchedDogId = matchData.match // The ID of the matched dog
  
      // matched dog details
      const dogRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([matchedDogId]),
      })
  
      if (!dogRes.ok) throw new Error("Failed to fetch dog details");
      const dogData = await dogRes.json()
      const matchedDog = dogData[0]
  
      setMatch({ name: matchedDog.name, breed: matchedDog.breed })
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  }

  return (
    <div className="p-6">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Find Your New Best Friend 🐶</h1>

      {/* Breed Filter & Sorting */}
      <Filters 
        selectedBreed={selectedBreed} 
        onBreedChange={setSelectedBreed} 
        sortOrder={sortOrder} 
        onSortChange={setSortOrder} 
      />

      {/* Dog Results */}
      <DogsList 
        breed={selectedBreed} 
        sortOrder={sortOrder} 
        page={page} 
        setPage={setPage}
        favorites={favorites} 
        onToggleFavorite={toggleFavorite}
      />
      {/* Find Match Button */}
      <div className="flex justify-center mt-6">
        <button className="bg-green-500 text-white px-6 py-3 rounded" onClick={handleFindMatch}>
          Find a Match! 🐶❤️
        </button>
      </div>

      {/* Show Matched Dog */}
      {match && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">Your best match is: {match.name}, the {match.breed}! 🎉 </h2>
        </div>
      )}

    </div>
  )
}