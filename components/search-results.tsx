"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { products as allProducts } from "@/lib/product-data"
import type { Product } from "@/lib/product-data"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query.trim()) {
      setProducts([])
      setLoading(false)
      return
    }

    // Simulate API call
    setLoading(true)
    const timer = setTimeout(() => {
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))),
      )
      setProducts(results)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 w-full">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No results found for "{query}"</h2>
        <p className="text-gray-500 mb-4">Try different keywords or browse our categories</p>
        <Button asChild>
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Found {products.length} results for "{query}"
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

