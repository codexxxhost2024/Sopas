"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchProducts } from "@/lib/db-operations"
import type { Product } from "@/lib/product-data"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleProducts, setVisibleProducts] = useState(8)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Try to get from IndexedDB first for offline support
        const cachedProducts = await getCachedProducts("all-products")

        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts)
          setLoading(false)
        }

        // Fetch from Firestore
        const fetchedProducts = await fetchProducts(20)

        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts)
          setHasMore(fetchedProducts.length >= 20)
          // Cache the products for offline use
          await cacheProducts("all-products", fetchedProducts)
        } else {
          setHasMore(false)
        }
      } catch (err) {
        console.error("Error loading products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Function to cache products in IndexedDB
  const cacheProducts = async (key: string, products: Product[]) => {
    if ("indexedDB" in window) {
      try {
        const db = await openProductsDatabase()
        const tx = db.transaction("products", "readwrite")
        const store = tx.objectStore("products")

        await store.put({
          id: key,
          products,
          timestamp: Date.now(),
        })

        await tx.complete
      } catch (err) {
        console.error("Failed to cache products:", err)
      }
    }
  }

  // Function to get cached products from IndexedDB
  const getCachedProducts = async (key: string): Promise<Product[] | null> => {
    if ("indexedDB" in window) {
      try {
        const db = await openProductsDatabase()
        const tx = db.transaction("products", "readonly")
        const store = tx.objectStore("products")

        const cachedData = await store.get(key)

        if (cachedData && Date.now() - cachedData.timestamp < 3600000) {
          // 1 hour cache
          return cachedData.products
        }

        return null
      } catch (err) {
        console.error("Failed to get cached products:", err)
        return null
      }
    }
    return null
  }

  // Helper function to open IndexedDB
  const openProductsDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("shapna-products", 1)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, products.length))
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Products</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 w-full">
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
              {products.length > 0 ? (
                products.slice(0, visibleProducts).map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No products available</p>
                </div>
              )}
            </div>

            {visibleProducts < products.length && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

