"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { FallbackImage } from "@/components/ui/fallback-image"

interface PackageCardProps {
  id: string
  name: string
  price: number
  image: string
  description: string
}

export function PackageCard({ id, name, price, image, description }: PackageCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
    })
  }

  return (
    <Link href={`/product/${id}`} className="block">
      <div className="group relative rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <FallbackImage
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            fallbackSrc="/placeholder.svg"
          />

          {/* Price overlay */}
          <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold px-4 py-2 rounded-bl-lg">
            <div className="text-xs">ONLY</div>
            <div className="text-xl">{formatCurrency(price)}</div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-xl text-center mb-2">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">{description}</p>

          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={(e) => {
              e.preventDefault()
              handleAddToCart()
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}

