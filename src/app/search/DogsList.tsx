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
  setPage: (page: number) => void;
}

export default function DogsList({ breed, sortOrder, page, setPage }: DogsListProps) {
  const [dogIds, setDogIds] = useState<string[]>([])
  const [dogs, setDogs] = useState<Dog[]>([])
  const [totalDogs, setTotalDogs] = useState(0)
  const pageSize = 10

  useEffect(() => {
    async function fetchDogIds() {
      const params = new URLSearchParams()
      if (breed) params.append("breeds", breed)
      params.append("size", pageSize.toString())
      params.append("from", ((page - 1) * pageSize).toString())
      
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
      }
    }

    fetchDogIds()
  }, [breed, sortOrder, page])

  useEffect(() => {
    async function fetchDogDetails() {
      if (dogIds.length === 0) return

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
      }
    }

    fetchDogDetails()
  }, [dogIds])

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {dogs.map((dog) => (
          <div key={dog.id} className="border p-4 rounded">
            <img src={dog.img} alt={dog.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-bold mt-2">{dog.name}</h2>
            <p className="text-gray-600">Breed: {dog.breed}</p>
            <p className="text-gray-600">Age: {dog.age}</p>
            <p className="text-gray-600">Zip Code: {dog.zip_code}</p>
          </div>
        ))}
      </div>
      <Pagination page={page} total={totalDogs} setPage={setPage} />
    </div>
  )
}
