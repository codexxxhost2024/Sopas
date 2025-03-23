"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FallbackImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  fill = false,
  width,
  height,
  ...props
}: FallbackImageProps & Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "fill" | "width" | "height">) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}, using fallback: ${fallbackSrc}`)
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  if (fill) {
    return (
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        onError={handleError}
        {...props}
      />
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 100}
      height={height || 100}
      className={className}
      onError={handleError}
      {...props}
    />
  )
}

