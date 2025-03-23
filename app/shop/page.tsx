"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, SlidersHorizontal, Grid, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { products, categories } from "@/lib/product-data"
import type { Product } from "@/lib/product-data"
import Link from "next/link"
import { QuickCheckout } from "@/components/quick-checkout"
import { Skeleton } from "@/components/ui/skeleton"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const tagParam = searchParams.get("tag")

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [selectedTags, setSelectedTags] = useState<string[]>(tagParam ? [tagParam] : [])
  const [sortOption, setSortOption] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("list")

  // Get all unique tags from products
  const allTags = Array.from(new Set(products.flatMap((product) => product.tags || [])))

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...products]

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
        result = result.filter((product) => product.isNew).concat(result.filter((product) => !product.isNew))
        break
      case "featured":
      default:
        result = result.filter((product) => product.featured).concat(result.filter((product) => !product.featured))
        break
    }

    setFilteredProducts(result)
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
    setPriceRange([0, 3000])
    setSortOption("featured")
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
          <span className="font-medium">Products</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Products</h1>

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
            <Button
              variant={viewMode === "compact" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("compact")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mt-2 sm:mt-0">
            <span className="text-sm mr-2">Sort by:</span>
            <select
              className="text-sm border rounded-md p-2 bg-white dark:bg-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-sm text-gray-500">
              Showing 1-{filteredProducts.length} of {filteredProducts.length} items
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
                    <Slider defaultValue={priceRange} max={3000} step={100} onValueChange={setPriceRange} />
                    <div className="flex justify-between mt-2">
                      <span>₱0</span>
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
                <Slider defaultValue={priceRange} max={3000} step={100} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2">
                  <span>₱0</span>
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
            ) : filteredProducts.length > 0 ? (
              <div
                className={`
                ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center" : ""}
                ${viewMode === "list" ? "grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center" : ""}
                ${viewMode === "compact" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center" : ""}
              `}
              >
                {filteredProducts.map((product) => (
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

