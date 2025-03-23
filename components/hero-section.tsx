"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FallbackImage } from "@/components/ui/fallback-image"

const slides = [
  {
    id: 1,
    title: "Create Your Online Shop in 1 Minute",
    description: "Launch your e-commerce business instantly with our easy-to-use platform",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    cta: "Get Started",
    link: "/shop/summer-collection",
  },
  {
    id: 2,
    title: "No Coding Required",
    description: "Build your store with our drag-and-drop interface - no technical skills needed",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    cta: "Try Now",
    link: "/shop/new-arrivals",
  },
  {
    id: 3,
    title: "Start Selling Today",
    description: "Accept payments, manage inventory, and grow your business from day one",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    cta: "Start Free",
    link: "/shop/special-offers",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <FallbackImage
            src={slide.image}
            alt={slide.title}
            fill
            style={{
              objectFit: "cover",
            }}
            className="object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">{slide.description}</p>
            <Link href={slide.link}>
              <Button size="lg" className="group">
                {slide.cta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

