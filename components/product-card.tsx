"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { UnsplashImage } from "@/components/ui/unsplash-image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  isNew?: boolean
  isOnSale?: boolean
  originalPrice?: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem, items, updateQuantity } = useCart()

  const cartItem = items.find((item) => item.id === product.id)

  // Default product image if the original is broken
  const defaultProductImage = "/placeholder.svg"

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden transition-all hover:shadow-md w-full">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <UnsplashImage
            product={product}
            alt={product.name}
            fill
            className="transition-transform group-hover:scale-105"
            fallbackSrc={defaultProductImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
          {product.isOnSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
        </div>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>

        {cartItem ? (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2">{cartItem.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  )
}

