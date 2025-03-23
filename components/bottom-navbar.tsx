"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ShoppingBag, Grid, Package, PlusCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const pathname = usePathname()

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false)
      } else {
        // Scrolling up - show navbar
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Handle touch events to show navbar on swipe up
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      if (touchStartY - touchY > 50) {
        // Swiping up - show navbar
        setIsVisible(true)
      } else if (touchY - touchStartY > 50) {
        // Swiping down - hide navbar if not at top
        if (window.scrollY > 100) {
          setIsVisible(false)
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [touchStartY])

  // Only show on mobile devices
  if (typeof window !== "undefined" && window.innerWidth > 768) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-40 transition-transform duration-300 md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={cn(
            "flex items-center justify-center w-full h-full",
            pathname === "/" ? "text-primary" : "text-gray-500",
          )}
        >
          <Home className="h-6 w-6" />
        </Link>

        <Link
          href="/shop"
          className={cn(
            "flex items-center justify-center w-full h-full",
            pathname.startsWith("/shop") ? "text-primary" : "text-gray-500",
          )}
        >
          <ShoppingBag className="h-6 w-6" />
        </Link>

        <Link
          href="/create"
          className={cn(
            "flex items-center justify-center w-full h-full",
            pathname === "/create" ? "text-primary" : "text-gray-500",
          )}
        >
          <PlusCircle className="h-6 w-6" />
        </Link>

        <Link
          href="/categories"
          className={cn(
            "flex items-center justify-center w-full h-full",
            pathname.startsWith("/categories") ? "text-primary" : "text-gray-500",
          )}
        >
          <Grid className="h-6 w-6" />
        </Link>

        <Link
          href="/track-order"
          className={cn(
            "flex items-center justify-center w-full h-full",
            pathname === "/track-order" ? "text-primary" : "text-gray-500",
          )}
        >
          <Package className="h-6 w-6" />
        </Link>
      </div>
    </div>
  )
}

