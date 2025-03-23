"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { Button } from "@/components/ui/button"
import { getCategoryById, getProductsByCategory } from "@/lib/product-data"
import type { Product, Category } from "@/lib/product-data"

export default function CategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Simulate API call
      setTimeout(() => {
        const categoryId = params.id as string
        const foundCategory = getCategoryById(categoryId)
        const categoryProducts = getProductsByCategory(categoryId)

        setCategory(foundCategory || null)
        setProducts(categoryProducts)
        setLoading(false)
      }, 800)
    }
  }, [params.id])

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link href="/categories" className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to categories
        </Link>

        {loading ? (
          <>
            <div className="mb-8">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 w-full">
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </>
        ) : category ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find the best products in our {category.name.toLowerCase()} collection
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold">No products available</h2>
                <p className="text-gray-500 mt-2">No products found in this category.</p>
                <Link href="/shop">
                  <Button className="mt-4">Explore all products</Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Category not found</h2>
            <p className="text-gray-500 mt-2">Sorry, the category you're looking for doesn't exist.</p>
            <Link href="/categories">
              <Button className="mt-4">View all categories</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

