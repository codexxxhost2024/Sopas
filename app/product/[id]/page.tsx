"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { fetchProductById } from "@/lib/db-operations"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { TrustBadges } from "@/components/trust-badges"
import { ProductUrgency } from "@/components/product-urgency"
import { RecentPurchaseNotification } from "@/components/recent-purchase-notification"
import { FallbackImage } from "@/components/ui/fallback-image"
import { useAuth } from "@/context/auth-context"
import { addToWishlist, removeFromWishlist, fetchUserProfile } from "@/lib/db-operations"

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        setError(null)

        // Try to get from IndexedDB first for offline support
        const cachedProduct = await getCachedProduct(params.id as string)

        if (cachedProduct) {
          setProduct(cachedProduct)
          if (cachedProduct.images?.[0]) {
            setMainImage(cachedProduct.images[0])
          }
          setLoading(false)
        }

        // Only try to fetch from Firestore if we're online
        if (navigator.onLine) {
          try {
            // Fetch from Firestore with timeout
            const fetchedProduct = (await Promise.race([
              fetchProductById(params.id as string),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 8000)),
            ])) as any

            if (fetchedProduct) {
              setProduct(fetchedProduct)
              if (fetchedProduct.images?.[0]) {
                setMainImage(fetchedProduct.images[0])
              }
              // Cache the product for offline use
              await cacheProduct(fetchedProduct)
            } else if (!cachedProduct) {
              // Only set error if we don't have a cached product
              setError("Product not found")
            }
          } catch (fetchError) {
            console.error("Error fetching from Firestore:", fetchError)
            // Only set error if we don't have a cached product
            if (!cachedProduct) {
              setError(fetchError.message || "Failed to load product. Please try again later.")
            }
          }
        } else if (!cachedProduct) {
          // If offline and no cached product
          setError(
            "You are currently offline and this product isn't available offline. Please check your connection and try again.",
          )
        }
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Failed to load product. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  // Check if product is in user's wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !params.id) return

      try {
        const userProfile = await fetchUserProfile(user.uid)
        if (userProfile && userProfile.wishlist) {
          setIsWishlisted(userProfile.wishlist.includes(params.id as string))
        }
      } catch (err) {
        console.error("Error checking wishlist:", err)
      }
    }

    checkWishlist()
  }, [user, params.id])

  // Function to cache product in IndexedDB
  const cacheProduct = async (product: any) => {
    if ("indexedDB" in window) {
      try {
        const db = await openProductDatabase()
        const tx = db.transaction("products", "readwrite")
        const store = tx.objectStore("products")

        await store.put({
          id: product.id,
          product,
          timestamp: Date.now(),
        })

        await tx.complete
      } catch (err) {
        console.error("Failed to cache product:", err)
      }
    }
  }

  // Function to get cached product from IndexedDB
  const getCachedProduct = async (productId: string): Promise<any | null> => {
    if ("indexedDB" in window) {
      try {
        const db = await openProductDatabase()
        const tx = db.transaction("products", "readonly")
        const store = tx.objectStore("products")

        const cachedData = await store.get(productId)

        if (cachedData && Date.now() - cachedData.timestamp < 3600000) {
          // 1 hour cache
          return cachedData.product
        }

        return null
      } catch (err) {
        console.error("Failed to get cached product:", err)
        return null
      }
    }
    return null
  }

  // Helper function to open IndexedDB
  const openProductDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("shapna-product-details", 1)

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

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity > 0 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert("Please log in to add items to your wishlist")
      return
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(user.uid, product.id)
      } else {
        await addToWishlist(user.uid, product.id)
      }
      setIsWishlisted(!isWishlisted)
    } catch (err) {
      console.error("Error updating wishlist:", err)
    }
  }

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />
      <RecentPurchaseNotification />

      <div className="container mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to shop
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">{error}</h2>
            <p className="text-gray-500 mt-2">Please try again or browse other products.</p>
            <Link href="/shop">
              <Button className="mt-4">Continue shopping</Button>
            </Link>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {/* Use FallbackImage instead of UnsplashImage to avoid API calls */}
                <FallbackImage
                  src={mainImage || product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  fallbackSrc="/placeholder.svg"
                  priority
                />
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">New</div>
                )}
                {product.isOnSale && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                    Sale
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                        mainImage === img ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setMainImage(img)}
                    >
                      <FallbackImage
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        fallbackSrc="/placeholder.svg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">{renderRatingStars(product.rating || 0)}</div>
                  <span className="text-sm text-gray-500">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
                {product.isOnSale && (
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded dark:bg-red-900 dark:text-red-100">
                    {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% off
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

              <div>
                <p className="text-sm font-medium">Availability:</p>
                <p className={`${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
                {product.stock > 0 && <ProductUrgency stock={product.stock} />}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <p className="font-medium">Quantity:</p>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-r-none"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-l-none"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="flex-1" onClick={handleAddToCart} disabled={product.stock <= 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to cart
                  </Button>
                  <Button variant="outline" size="icon" onClick={toggleWishlist}>
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <TrustBadges />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Category:</span>{" "}
                  <Link href={`/categories/${product.category}`} className="hover:text-primary">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </Link>
                </p>
                {product.tags && (
                  <p className="text-sm">
                    <span className="font-medium">Tags:</span>{" "}
                    {product.tags.map((tag: string, i: number) => (
                      <span key={tag}>
                        <Link href={`/shop?tag=${tag}`} className="hover:text-primary">
                          {tag}
                        </Link>
                        {i < product.tags.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="text-gray-500 mt-2">Sorry, the product you're looking for doesn't exist.</p>
            <Link href="/shop">
              <Button className="mt-4">Continue shopping</Button>
            </Link>
          </div>
        )}

        {product && (
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 text-gray-600 dark:text-gray-300">
                <p className="mb-4">{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl
                  nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc vel tincidunt lacinia, nisl
                  nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{product.rating}</div>
                      <div className="flex justify-center mt-1">{renderRatingStars(product.rating || 0)}</div>
                      <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div>
                      <p className="font-medium mb-2">Rate this product</p>
                      <Button>Write a review</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <p className="text-gray-500">No reviews yet.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4 text-gray-600 dark:text-gray-300">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-2">Shipping</h3>
                    <p>We offer shipping throughout the Philippines. Delivery times vary by location:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Metro Manila: 1-2 business days</li>
                      <li>Rest of Luzon: 3-5 business days</li>
                      <li>Visayas and Mindanao: 5-7 business days</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Returns</h3>
                    <p>
                      We accept returns within 30 days of purchase. The product must be in its original condition with
                      all tags.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

