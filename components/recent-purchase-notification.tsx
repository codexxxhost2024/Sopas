"use client"

import { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import { products } from "@/lib/product-data"

interface Purchase {
  name: string
  product: string
  time: string
}

// List of random customer names
const customerNames = [
  "John S.",
  "Emma T.",
  "Michael K.",
  "Sophia L.",
  "David W.",
  "Olivia P.",
  "James R.",
  "Isabella M.",
  "Robert J.",
  "Ava G.",
  "Thomas H.",
  "Mia C.",
  "William B.",
  "Charlotte D.",
  "Daniel F.",
]

// List of random locations
const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
]

// Generate random purchases
const generateRandomPurchases = (): Purchase[] => {
  const randomPurchases: Purchase[] = []

  for (let i = 0; i < 15; i++) {
    const randomCustomerIndex = Math.floor(Math.random() * customerNames.length)
    const randomProductIndex = Math.floor(Math.random() * products.length)
    const randomLocationIndex = Math.floor(Math.random() * locations.length)

    randomPurchases.push({
      name: `${customerNames[randomCustomerIndex]} from ${locations[randomLocationIndex]}`,
      product: products[randomProductIndex].name,
      time: `${Math.floor(Math.random() * 10) + 2} minutes ago`,
    })
  }

  return randomPurchases
}

export function RecentPurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null)
  const [purchases] = useState<Purchase[]>(generateRandomPurchases())
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Initial delay before showing the first notification
    const initialTimeout = setTimeout(() => {
      showNextPurchase()
    }, 5000)

    return () => clearTimeout(initialTimeout)
  }, [])

  const showNextPurchase = () => {
    setCurrentPurchase(purchases[currentIndex])
    setIsVisible(true)

    // Hide notification after 3 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false)

      // Schedule next notification after it's hidden
      const nextTimeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % purchases.length)
        showNextPurchase()
      }, 8000) // Wait 8 seconds before showing next notification

      return () => clearTimeout(nextTimeout)
    }, 3000)

    return () => clearTimeout(hideTimeout)
  }

  if (!isVisible || !currentPurchase) return null

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-xs bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 
                 border border-gray-200 dark:border-gray-800 transition-all duration-500
                 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
          <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-medium text-sm">{currentPurchase.name}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Purchased {currentPurchase.product}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{currentPurchase.time}</p>
        </div>
      </div>
    </div>
  )
}

