"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Filters from "./Filters"
import DogsList from "./DogsList"

export default function SearchPage() {
  const [selectedBreed, setSelectedBreed] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
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
      />
    </div>
  )
}