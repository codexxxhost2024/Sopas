"use client"

import { useState, useEffect } from "react"
import { fetchUnsplashImage, generateProductImageQuery } from "@/lib/unsplash-api"

interface UseUnsplashImageProps {
  product: {
    name: string
    category: string
    tags?: string[]
  }
  fallbackUrl: string
  width?: number
  height?: number
}

interface UnsplashImageData {
  url: string
  thumbnailUrl: string
  authorName: string
  authorUrl: string
  isLoading: boolean
  error: Error | null
}

export function useUnsplashImage({
  product,
  fallbackUrl,
  width = 800,
  height = 600,
}: UseUnsplashImageProps): UnsplashImageData {
  const [imageData, setImageData] = useState<Omit<UnsplashImageData, "isLoading" | "error">>({
    url: fallbackUrl,
    thumbnailUrl: fallbackUrl,
    authorName: "",
    authorUrl: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // If offline, use fallback immediately
        if (!navigator.onLine) {
          setImageData({
            url: fallbackUrl,
            thumbnailUrl: fallbackUrl,
            authorName: "",
            authorUrl: "",
          })
          setIsLoading(false)
          return
        }

        const query = generateProductImageQuery(product)

        // Try to get image data - this will now always return a fallback
        const result = await fetchUnsplashImage(query, {
          width,
          height,
          fallbackUrl,
        })

        if (isMounted) {
          if (result) {
            setImageData({
              url: result.url,
              thumbnailUrl: result.thumbnailUrl,
              authorName: result.authorName,
              authorUrl: result.authorUrl,
            })
          } else {
            // Use fallback if no result
            setImageData({
              url: fallbackUrl,
              thumbnailUrl: fallbackUrl,
              authorName: "",
              authorUrl: "",
            })
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error in useUnsplashImage:", err)
          setError(err instanceof Error ? err : new Error(String(err)))
          // Use fallback on error
          setImageData({
            url: fallbackUrl,
            thumbnailUrl: fallbackUrl,
            authorName: "",
            authorUrl: "",
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Short delay before fetching to avoid blocking render
    const timer = setTimeout(fetchImage, 100)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [product, fallbackUrl, width, height])

  return {
    ...imageData,
    isLoading,
    error,
  }
}

