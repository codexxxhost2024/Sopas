"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, SlidersHorizontal, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { QuickCheckout } from "@/components/quick-checkout"
import { Skeleton } from "@/components/ui/skeleton"
import { FallbackImage } from "@/components/ui/fallback-image"

// Import the new arrivals products
import { newArrivalsProducts } from "@/lib/new-arrivals-data"
import type { Product } from "@/lib/product-data"

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("newest")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  // Get all unique categories from new arrivals products
  const categories = Array.from(new Set(newArrivalsProducts.map((product) => product.category))).map((category) => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
  }))

  // Get all unique tags from new arrivals products
  const allTags = Array.from(new Set(newArrivalsProducts.flatMap((product) => product.tags || [])))

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(newArrivalsProducts)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...newArrivalsProducts]

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((product) => product.tags && product.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Filter by price
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        // All products in this collection are new, so we'll sort by id for consistency
        result.sort((a, b) => a.id.localeCompare(b.id))
        break
    }

    setProducts(result)
  }, [selectedCategories, selectedTags, priceRange, sortOption])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([0, 5000])
    setSortOption("newest")
  }

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link href="/shop" className="text-gray-500 hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium">New Arrivals</span>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
          <FallbackImage
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="New Arrivals"
            fill
            className="object-cover"
            fallbackSrc="/placeholder.svg"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">New Arrivals</h1>
            <p className="text-lg md:text-xl max-w-2xl text-center mb-6">
              Be the first to discover our latest products and trends
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Explore Now
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">New Arrivals</h1>

        {/* View options and sorting */}
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex flex-wrap justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mt-2 sm:mt-0">
            <span className="text-sm mr-2">Sort by:</span>
            <select
              className="text-sm border rounded-md p-2 bg-white dark:bg-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-sm text-gray-500">
              Showing 1-{products.length} of {products.length} items
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Mobile Filters */}
          <div className="w-full md:hidden mb-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search with the following filters</SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-mobile-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                          />
                          <label
                            htmlFor={`category-mobile-${category.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Price</h3>
                    <Slider defaultValue={priceRange} max={5000} step={100} onValueChange={setPriceRange} />
                    <div className="flex justify-between mt-2">
                      <span>₱{priceRange[0]}</span>
                      <span>₱{priceRange[1]}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Tags</h3>
                    <div className="space-y-2">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-mobile-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => handleTagChange(tag)}
                          />
                          <label
                            htmlFor={`tag-mobile-${tag}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      clearFilters()
                      setFiltersOpen(false)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block w-1/4 bg-white dark:bg-gray-950 p-4 rounded-lg border sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Filters</h3>
              <Button variant="link" onClick={clearFilters} className="h-auto p-0 text-sm">
                Clear
              </Button>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Price</h3>
                <Slider defaultValue={priceRange} max={5000} step={100} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2">
                  <span>₱{priceRange[0]}</span>
                  <span>₱{priceRange[1]}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Tags</h3>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagChange(tag)}
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 w-full">
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={`
                ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center" : ""}
                ${viewMode === "list" ? "grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center" : ""}
              `}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for other products.</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickCheckout />
      <Footer />
    </main>
  )
}

