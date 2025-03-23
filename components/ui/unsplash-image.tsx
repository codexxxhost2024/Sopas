"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useUnsplashImage } from "@/hooks/use-unsplash-image"

interface UnsplashImageProps {
  product: {
    name: string
    category: string
    tags?: string[]
  }
  fallbackSrc: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

export function UnsplashImage({
  product,
  fallbackSrc,
  alt,
  className,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  ...props
}: UnsplashImageProps & Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "fill" | "width" | "height">) {
  const [imgError, setImgError] = useState(false)
  const { url, thumbnailUrl, authorName, authorUrl, isLoading, error } = useUnsplashImage({
    product,
    fallbackUrl: fallbackSrc,
    width: width || 800,
    height: height || 600,
  })

  // Reset error state if url changes
  useEffect(() => {
    setImgError(false)
  }, [url])

  const handleError = () => {
    console.log(`Image failed to load: ${url}, using fallback`)
    setImgError(true)
  }

  // Use fallback if there's an error or if still loading
  const imageSrc = imgError || error || !url ? fallbackSrc : url

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={cn("object-cover transition-opacity duration-300", className)}
          onError={handleError}
          sizes={sizes}
          priority={priority}
          {...props}
        />
        {/* We're not showing attribution anymore since we're using placeholders */}
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={cn("transition-opacity duration-300", className)}
        onError={handleError}
        sizes={sizes}
        priority={priority}
        {...props}
      />
      {/* We're not showing attribution anymore since we're using placeholders */}
    </div>
  )
}

