"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, Search, Phone, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { CartSheet } from "@/components/cart-sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, totalPrice } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)

      // Add shadow class to header when scrolled
      const header = document.querySelector("header")
      if (header) {
        if (scrollPosition > 10) {
          header.classList.add("is-sticky")
        } else {
          header.classList.remove("is-sticky")
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial call to set correct state
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Create", href: "/create" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm">
      {/* Top bar with contact info - red background */}
      <div className="bg-red-600 text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-1" />
            <span>(+639) 123456789</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/store-location" className="flex items-center hover:underline">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Store Location</span>
            </Link>
            <Link href="/track-order" className="flex items-center hover:underline">
              <Package className="h-4 w-4 mr-1" />
              <span>Track Your Order</span>
            </Link>
            <div className="flex items-center space-x-1">
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <span>or</span>
              <Link href="/login?tab=signup" className="hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-white dark:bg-gray-900 transition-all duration-200">
        <div className="container mx-auto px-4 relative">
          <div className="flex h-16 items-center justify-between">
            {/* Left section: Menu (mobile) and Logo */}
            <div className="flex items-center">
              {/* Mobile Menu Button - Now on the left */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden mr-2" aria-label="Toggle Menu">
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col space-y-4 py-4">
                    <div className="px-4">
                      <Input type="search" placeholder="Search products..." className="w-full" />
                    </div>
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                          pathname === link.href
                            ? "bg-gray-100 text-primary dark:bg-gray-800"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      href="/account"
                      className="px-4 py-2 text-sm font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </Link>
                    <Link
                      href="/store-location"
                      className="px-4 py-2 text-sm font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Store Location
                    </Link>
                    <Link
                      href="/track-order"
                      className="px-4 py-2 text-sm font-medium flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Track Your Order
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2">
                  <Image src="/images/shapna-logo.png" alt="ShapNa" fill className="object-contain" priority />
                </div>
                <span className="text-xl font-bold text-primary hidden sm:inline-block">ShapNa</span>
              </Link>
            </div>

            {/* Middle section: Search bar - Always visible */}
            <div className="flex-1 max-w-md mx-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const searchInput = e.currentTarget.querySelector("input")
                  const query = searchInput?.value
                  if (query?.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
                  }
                }}
                className="relative"
              >
                <Input
                  type="search"
                  name="q"
                  placeholder="Search products..."
                  className="pr-8 w-full rounded-full border-gray-300"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-0 top-0 h-full rounded-r-full bg-green-500 hover:bg-green-600"
                >
                  <Search className="h-4 w-4 text-white" />
                </Button>
              </form>
            </div>

            {/* Right section: Cart and User */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle moved to account page */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              <CartSheet>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </CartSheet>

              <div className="hidden md:block">
                {totalPrice > 0 && <span className="text-sm font-medium">{formatCurrency(totalPrice)}</span>}
              </div>

              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price)
}

