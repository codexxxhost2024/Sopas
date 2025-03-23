"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"

export function QuickCheckout() {
  const { totalItems, totalPrice } = useCart()
  const [expanded, setExpanded] = useState(false)

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-20 transition-all duration-300 transform">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 text-primary mr-3" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            </div>
            <div>
              <h3 className="font-medium">Your Cart</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(totalPrice)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/checkout">
              <Button className="bg-red-600 hover:bg-red-700">
                Checkout
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="shrink-0"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total:</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full bg-red-600 hover:bg-red-700">Proceed to Checkout</Button>
              </Link>
            </div>

            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Secure checkout with multiple payment options</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

