"use client";

import { useState } from "react";
import Filters from "./Filters";
import DogsList from "./DogsList";

export default function SearchPage() {
  const [selectedBreed, setSelectedBreed] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Find Your New Best Friend 🐶</h1>

      {/* Breed Filter & Sorting */}
      <Filters 
        selectedBreed={selectedBreed} 
        onBreedChange={setSelectedBreed} 
        sortOrder={sortOrder} 
        onSortChange={setSortOrder} 
      />

      {/* Dog Results */}
      <DogsList breed={selectedBreed} sortOrder={sortOrder} page={page} setPage={setPage} />
    </div>
  )
}