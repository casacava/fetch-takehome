"use client"

import { useEffect, useState } from "react"
import Pagination from "./Pagination"

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogsListProps {
  breed: string;
  sortOrder: "asc" | "desc";
  page: number;
  setPage: (page: number) => void
  selectedCity: string
  selectedLocation: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export default function DogsList({ breed, sortOrder, page, setPage, selectedCity, selectedLocation, favorites, onToggleFavorite }: DogsListProps) {
  const [dogIds, setDogIds] = useState<string[]>([])
  const [dogs, setDogs] = useState<Dog[]>([])
  const [totalDogs, setTotalDogs] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const pageSize = 10

  useEffect(() => {
    async function fetchDogIds() {
      setLoading(true)

      let zipCodesToSearch: string[] = [];

      // ✅ If city is entered, fetch zip codes
      if (selectedCity.length > 0) {
        try {
          const res = await fetch("https://frontend-take-home-service.fetch.com/locations/search", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city: selectedCity }), // ✅ Search by city
          });

          if (!res.ok) throw new Error("Failed to fetch locations");
          const data = await res.json();

          zipCodesToSearch = data.results.map((location: { zip_code: string }) => location.zip_code);
        } catch (error) {
          console.error("Error fetching city locations:", error);
        }
      } 
      // ✅ If zip code is entered, use it directly
      else if (selectedLocation.length === 5) {
        zipCodesToSearch = [selectedLocation];
      }

      const params = new URLSearchParams()
      if (breed) params.append("breeds", breed)
      if (zipCodesToSearch.length > 0) params.append("zipCodes", zipCodesToSearch.join(","))
      params.append("size", pageSize.toString())
      params.append("from", ((page - 1) * pageSize).toString())
      console.log("Searching for zip codes:", zipCodesToSearch);
      
      // determine sorting field based on whether breed selected
      const sortField = breed ? "name" : "breed"
      params.append("sort", `${sortField}:${sortOrder}`)

      try {
        const res = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch dogs")
        const data = await res.json()

        setDogIds(data.resultIds)
        setTotalDogs(data.total)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDogIds()
  }, [breed, sortOrder, selectedCity, selectedLocation, page])

  useEffect(() => {
    async function fetchDogDetails() {
      if (dogIds.length === 0) return
      setLoading(true)

      try {
        const res = await fetch(`https://frontend-take-home-service.fetch.com/dogs`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dogIds),
        });

        if (!res.ok) throw new Error("Failed to fetch dog details");
        const data: Dog[] = await res.json()
        setDogs(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDogDetails()
  }, [dogIds])

  return (
    <div>
    {loading ? (
      <div className="flex justify-center items-center mt-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    ) : (
      <>
        {/* ✅ Show No Results Message When No Dogs Found */}
        {dogIds.length === 0 && selectedLocation.length === 5 ? (
          <div className="text-center mt-6 text-gray-600 text-lg">
            💔 Sorry, that specific zip code didn’t match any dogs.  
            <br />
            🏙️ Maybe try searching by city instead?
          </div>
        ) : (
          /* ✅ Show Dog List When There Are Matches */
          <div className="grid grid-cols-2 gap-4">
            {dogs.map((dog) => (
              <div key={dog.id} className="border p-4 rounded">
                <img src={dog.img} alt={dog.name} className="w-full h-40 object-cover rounded" />
                <h2 className="text-xl font-bold mt-2">{dog.name}</h2>
                <p className="text-gray-600">Breed: {dog.breed}</p>
                <p className="text-gray-600">Age: {dog.age}</p>
                <p className="text-gray-600">Zip Code: {dog.zip_code}</p>

                {/* Favorite Button */}
                <button
                  className={`mt-2 px-4 py-2 rounded ${
                    favorites.includes(dog.id) ? "bg-red-500 text-white" : "bg-gray-300"
                  }`}
                  onClick={() => onToggleFavorite(dog.id)}
                >
                  {favorites.includes(dog.id) ? "Unfavorite ❤️" : "Favorite 🤍"}
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} total={totalDogs} setPage={setPage} />
      </>
    )}
    </div>
  )
}
