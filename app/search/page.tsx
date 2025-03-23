"use client"
import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import { SearchResults } from "@/components/search-results"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [currentQuery, setCurrentQuery] = useState(searchTerm)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchTerm.trim())
    window.history.pushState({}, "", url)

    setCurrentQuery(searchTerm.trim())
  }

  // Popular search terms
  const popularSearchTerms = ["Clothing", "Electronics", "Accessories", "Home Decor", "Summer", "Sale"]

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Products</h1>

        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {currentQuery ? (
          <SearchResults query={currentQuery} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Enter a search term to find products</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              {popularSearchTerms.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  onClick={() => {
                    setSearchTerm(term)
                    setCurrentQuery(term)

                    // Update URL
                    const url = new URL(window.location.href)
                    url.searchParams.set("q", term)
                    window.history.pushState({}, "", url)
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

