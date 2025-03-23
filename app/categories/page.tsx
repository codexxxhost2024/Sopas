"use client"

import Link from "next/link"
import { FallbackImage } from "@/components/ui/fallback-image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { categories } from "@/lib/product-data"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [displayCategories, setDisplayCategories] = useState(categories)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Default category image if the original is broken
  const defaultCategoryImage =
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Categories</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Explore our wide range of product categories and find exactly what you're looking for.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 w-full">
                <Skeleton className="h-[250px] w-full rounded-lg" />
                <Skeleton className="h-6 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-1/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative overflow-hidden rounded-lg h-[250px]"
              >
                <div className="relative h-full w-full overflow-hidden">
                  <FallbackImage
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    fallbackSrc={defaultCategoryImage}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-80">{category.productCount} Products</p>
                  <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-transform transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                    View Category
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

