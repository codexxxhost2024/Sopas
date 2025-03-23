"use client"

import { useEffect } from "react"

export function ImagePreloader() {
  // This component is now essentially a no-op since we're not using Unsplash API
  // We'll keep it for compatibility but it won't do anything

  useEffect(() => {
    console.log("Image preloading disabled - using local placeholders instead")
  }, [])

  return null
}

