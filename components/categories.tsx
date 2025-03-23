"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCategories } from "@/lib/db-operations"
import type { Category } from "@/lib/product-data"
import { UnsplashImage } from "@/components/ui/unsplash-image"

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        // Try to get from IndexedDB first for offline support
        const cachedCategories = await getCachedCategories()

        if (cachedCategories && cachedCategories.length > 0) {
          setCategories(cachedCategories)
          setLoading(false)
        }

        // Fetch from Firestore
        const fetchedCategories = await fetchCategories()

        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories)
          // Cache the categories for offline use
          await cacheCategories(fetchedCategories)
        }
      } catch (err) {
        console.error("Error loading categories:", err)
        setError("Failed to load categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Function to cache categories in IndexedDB
  const cacheCategories = async (categories: Category[]) => {
    if ("indexedDB" in window) {
      try {
        const db = await openCategoriesDatabase()
        const tx = db.transaction("categories", "readwrite")
        const store = tx.objectStore("categories")

        await store.put({
          id: "all-categories",
          categories,
          timestamp: Date.now(),
        })

        await tx.complete
      } catch (err) {
        console.error("Failed to cache categories:", err)
      }
    }
  }

  // Function to get cached categories from IndexedDB
  const getCachedCategories = async (): Promise<Category[] | null> => {
    if ("indexedDB" in window) {
      try {
        const db = await openCategoriesDatabase()
        const tx = db.transaction("categories", "readonly")
        const store = tx.objectStore("categories")

        const cachedData = await store.get("all-categories")

        if (cachedData && Date.now() - cachedData.timestamp < 86400000) {
          // 24 hour cache
          return cachedData.categories
        }

        return null
      } catch (err) {
        console.error("Failed to get cached categories:", err)
        return null
      }
    }
    return null
  }

  // Helper function to open IndexedDB
  const openCategoriesDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("shapna-categories", 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Default category image if the original is broken
  const defaultCategoryImage =
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 w-full">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative overflow-hidden rounded-lg w-full"
              >
                <div className="relative h-[200px] w-full overflow-hidden">
                  <UnsplashImage
                    product={{ name: category.name, category: category.name }}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    fallbackSrc={category.image || defaultCategoryImage}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-80">{category.productCount} Products</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

