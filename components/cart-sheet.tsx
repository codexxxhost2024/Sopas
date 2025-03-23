"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/shop">
              <Button className="bg-red-600 hover:bg-red-700">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col gap-4 my-4 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                    <FallbackImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder.svg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <Separator className="my-4" />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Proceed to Checkout</Button>
                </Link>
                <Link href="/shop" className="w-full">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

