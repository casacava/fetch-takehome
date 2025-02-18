"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      )

      if (!response.ok) throw new Error("Failed to log in. Please try again!")

      router.push("/search")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <form
      onSubmit={handleLogin}
      className="bg-white p-6 rounded-lg shadow-md w-96"
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {error && <p className="text-red-500">{error}</p>}

      <label className="block mb-2">
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
      >
        Log In
      </button>
    </form>
  </div>
  )
}