"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineBanner } from "@/components/offline-banner"
import { Package, Search, CheckCircle, Truck, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [orderStatus, setOrderStatus] = useState<null | {
    number: string
    date: string
    status: "processing" | "shipped" | "delivered"
    items: number
    trackingNumber: string
    estimatedDelivery: string
  }>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTracking(true)

    // Simulate API call
    setTimeout(() => {
      if (orderNumber && email) {
        setOrderStatus({
          number: orderNumber,
          date: "March 15, 2023",
          status: "shipped",
          items: 3,
          trackingNumber: "PH" + Math.floor(Math.random() * 10000000),
          estimatedDelivery: "March 20, 2023",
        })
      }
      setIsTracking(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen">
      <OfflineBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-primary">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium">Track Order</span>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Package className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold">Track Your Order</h1>
          </div>

          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Enter your order number and email address to track your order status.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="e.g. ORD-12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="The email you used for your order"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isTracking}>
                {isTracking ? (
                  <>
                    <span className="mr-2">Tracking...</span>
                    <span className="animate-spin">⏳</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </div>

          {orderStatus && (
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                  <span className="font-medium">{orderStatus.number}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                  <span className="font-medium">{orderStatus.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Items:</span>
                  <span className="font-medium">{orderStatus.items}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tracking Number:</span>
                  <span className="font-medium">{orderStatus.trackingNumber}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
                  <span className="font-medium">{orderStatus.estimatedDelivery}</span>
                </div>

                <Separator className="my-6" />

                <div className="relative">
                  <div className="flex justify-between mb-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          orderStatus.status === "processing" ||
                          orderStatus.status === "shipped" ||
                          orderStatus.status === "delivered"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <span className="text-sm mt-2">Processed</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          orderStatus.status === "shipped" || orderStatus.status === "delivered"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        <Box className="h-6 w-6" />
                      </div>
                      <span className="text-sm mt-2">Packed</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          orderStatus.status === "shipped" || orderStatus.status === "delivered"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        <Truck className="h-6 w-6" />
                      </div>
                      <span className="text-sm mt-2">Shipped</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          orderStatus.status === "delivered"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                        }`}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <span className="text-sm mt-2">Delivered</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width:
                          orderStatus.status === "processing"
                            ? "0%"
                            : orderStatus.status === "shipped"
                              ? "66%"
                              : "100%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-medium mb-2">Latest Update</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orderStatus.status === "processing"
                      ? "Your order has been received and is being processed."
                      : orderStatus.status === "shipped"
                        ? "Your order has been shipped and is on its way to you."
                        : "Your order has been delivered. Thank you for shopping with us!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

