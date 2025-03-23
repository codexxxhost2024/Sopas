"use client"

import { useEffect, useState } from "react"
import { Clock, EyeIcon, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProductUrgencyProps {
  stock: number
  maxStock?: number
}

export function ProductUrgency({ stock, maxStock = 20 }: ProductUrgencyProps) {
  const [viewers, setViewers] = useState(0)
  const stockPercentage = Math.min(100, (stock / maxStock) * 100)

  useEffect(() => {
    // Generate random number of current viewers between 5-20
    setViewers(Math.floor(Math.random() * 15) + 5)

    const interval = setInterval(() => {
      // Fluctuate viewers slightly to create the impression of real activity
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
        const newValue = prev + change
        return newValue < 5 ? 5 : newValue > 20 ? 20 : newValue
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4 my-4">
      {stock <= 10 && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm p-3 rounded-md flex items-center">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>
            <span className="font-medium">Hurry!</span> Only {stock} items left in stock.
          </p>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <EyeIcon className="h-4 w-4 mr-2" />
        <p>{viewers} people are viewing this right now</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span>Selling fast!</span>
          <span>{stock} left</span>
        </div>
        <Progress value={stockPercentage} className="h-2" />
      </div>

      {stock <= 5 && (
        <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
          <Users className="h-4 w-4 mr-2" />
          <p>{Math.floor(Math.random() * 5) + 3} people purchased this in the last 24 hours</p>
        </div>
      )}
    </div>
  )
}

